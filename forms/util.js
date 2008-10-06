/**
*      Copyright (C) 2008 10gen Inc.
*
*    Licensed under the Apache License, Version 2.0 (the "License");
*    you may not use this file except in compliance with the License.
*    You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
*    Unless required by applicable law or agreed to in writing, software
*    distributed under the License is distributed on an "AS IS" BASIS,
*    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*    See the License for the specific language governing permissions and
*    limitations under the License.
*/

util = {};

core.content.html();

/**
An emulation of python's strptime method.

Note: reads 1-based month indices to be consistant with Python strftime
rather than 0-based, which would be consistant with JavaScript Date object.
Months are still stored as 0-based.

Note: doesn't accept %c %j %u %w %W %x %X or %Z as of now. Also doesn't make use
of any weekday info that is parsed in order to calculate the date.

TODO Fixes for either of the above notes?
 */
var strptime = util.strptime = function(string, format) {
    if (typeof(string) != 'string') {
        throw new ValueError("First argument to strptime must be of type string.");
    }
    if (format == null) {
        // default format used by Python's strptime
        format = "%a %b %d %H:%M:%S %Y";
    }
    if (typeof(format) != 'string') {
        throw new ValueError("Second argument to strptime must be of type string.");
    }

    // The regular expression to match on given the format code
    var re = "^";

    // Code to be run to populate the new date object after matching
    var functions = [];

    // Number of match groups so far
    // Start at 1, since re.exec(...)[0] is the entire match, not the first substring
    var num_groups = 1;

    // Are we currently in a directive (%x)
    var directive = false;

    // Generate the re and code
    for (var i = 0; i < format.length; i++) {
        var ch = format.charAt(i);
        if (directive) {
            directive = false;
            var result = getReCodeAndCallbackForDirective(ch, num_groups);
            re += result[0];
            if (result[1]) {
                functions.push(result[1]);
            }
            num_groups += result[2];
        }
        else if (ch == "%") {
            directive = true;
        }
        else {
            re += ch;
        }
    }

    re += "$";

    // Attempt to match
    var match = RegExp(re).exec(string);
    if (match == null) {
        throw new ValueError("Date string did not match format.");
    }

    // Defaults come from python strptime
    var date = new Date(1900, 0, 1, 0, 0, 0);
    // Manipulate the date based on the callbacks generated
    for (var i = 0; i < functions.length; i++) {
        functions[i](match, date);
    }

    return date;
};

// helper functions for strptime
var getReCodeAndCallbackForDirective = function(directive, group_number) {
    switch (directive) {
        // Right now we just ignore weekdays names... this behavior could be improved
        case "a":
            return ["(?:[Mm]on|[Tt]ue|[Ww]ed|[Tt]hu|[Ff]ri|[Ss]at|[Ss]un)", null, 0];
        case "A":
            return ["(?:[Mm]onday|[Tt]uesday|[Ww]ednesday|[Tt]hursday|[Ff]riday|[Ss]aturday|[Ss]unday)", null, 0];
        case "b":
            return ["([Jj]an|[Ff]eb|[Mm]ar|[Aa]pr|[Mm]ay|[Jj]un|[Jj]ul|[Aa]ug|[Ss]ep|[Oo]ct|[Nn]ov|[Dd]ec)", generateAbbrevMonthFunc(group_number), 1];
        case "B":
            return ["([Jj]anuary|[Ff]ebruary|[Mm]arch|[Aa]pril|[Mm]ay|[Jj]une|[Jj]uly|[Aa]ugust|[Ss]eptember|[Oo]ctober|[Nn]ovember|[Dd]ecember)", generateFullMonthFunc(group_number), 1];
        case "d":
            return ["(\\d\\d?)", generateMonthDayFunc(group_number), 1];
        case "H":
            return ["(\\d\\d?)", generateHourFunc(group_number, 23), 1];
        case "I":
            return ["(\\d\\d?)", generateHourFunc(group_number, 12), 1];
        case "m":
            return ["(\\d\\d?)", generateMonthFunc(group_number), 1];
        case "M":
            return ["(\\d\\d?)", generateMinuteFunc(group_number), 1];
        case "p":
            return ["(am|AM|pm|PM)", generateAMPMFunc(group_number), 1];
        case "S":
            return ["(\\d\\d?)", generateSecondFunc(group_number), 1];
        case "y":
            return ["(\\d\\d)", generateYearFunc(group_number, 2000), 1];
        case "Y":
            return ["(\\d\\d\\d\\d)", generateYearFunc(group_number), 1];
        case "%":
            return ["%", null, 0];
        default:
            throw new ValueError("Unrecognized or unimplemented directive %" + directive + ".");
    }
};

var generateAbbrevMonthFunc = function(group_number) {
    return function(match, date) {
        date.setMonth(generateAbbrevMonthFunc.abbrevs[match[group_number].toLowerCase()]);
    };
};
generateAbbrevMonthFunc.abbrevs = {
    'jan': 0,
    'feb': 1,
    'mar': 2,
    'apr': 3,
    'may': 4,
    'jun': 5,
    'jul': 6,
    'aug': 7,
    'sep': 8,
    'oct': 9,
    'nov': 10,
    'dec': 11
};

var generateFullMonthFunc = function(group_number) {
    return function(match, date) {
        date.setMonth(generateFullMonthFunc.names[match[group_number].toLowerCase()]);
    };
};
generateFullMonthFunc.names = {
    'january': 0,
    'february': 1,
    'march': 2,
    'april': 3,
    'may': 4,
    'june': 5,
    'july': 6,
    'august': 7,
    'september': 8,
    'october': 9,
    'november': 10,
    'december': 11
};

var generateMonthDayFunc = function(group_number) {
    return function(match, date) {
        var day = Number(match[group_number]);
        if (day < 0 || day > 31) {
            throw new ValueError("Date string did not match format.");
        }
        date.setDate(day);
    };
};

var generateHourFunc = function(group_number, clock) {
    return function(match, date) {
        var hour = Number(match[group_number]);
        if (hour < 0 || hour > clock) {
            throw new ValueError("Date string did not match format.");
        }
        // Use modulo arithmetic to deal with AM PM (see generateAMPMFunc)
        date.setHours((date.getHours() + hour) % 24);
    };
};

var generateMonthFunc = function(group_number) {
    return function(match, date) {
        var month = Number(match[group_number]);
        if (month < 1 || month > 12) {
            throw new ValueError("Date string did not match format.");
        }
        date.setMonth(month - 1);
    };
};

var generateMinuteFunc = function(group_number) {
    return function(match, date) {
        var min = Number(match[group_number]);
        if (min < 0 || min > 59) {
            throw new ValueError("Date string did not match format.");
        }
        date.setMinutes(min);
    };
};

var generateAMPMFunc = function(group_number) {
    return function(match, date) {
        if (match[group_number].toLowerCase().charAt(0) == "p") {
            date.setHours((date.getHours() + 12) % 24);
        }
    };
};

var generateSecondFunc = function(group_number) {
    return function(match, date) {
        var sec = Number(match[group_number]);
        if (sec < 0 || sec > 61) {
            throw new ValueError("Date string did not match format.");
        }
        date.setSeconds(sec);
    };
};

var generateYearFunc = function(group_number, base) {
    return function(match, date) {
        var year = Number(match[group_number]);
        if (base) {
            if (year < 0 || year > 99) {
                throw new ValueError("Date string did not match format.");
            }
            year += base;
        }
        date.setFullYear(year);
    };
};

var conditional_escape = util.conditional_escape = function(s) {
    if (s == null) {
        return "";
    }
    if (djang10.is_safe(s)) {
        return s.toString();
    }
    return content.HTML.escape(s);
};

// An imitation of the python built-in bool()
var bool = util.bool = function(x) {
    if (!x)
        return false;
    return true;
};

var simplePythonFormat = util.simplePythonFormat = function (msg, vals) {
    if (typeof(msg) != 'string') {
        throw new FormatterError('Message must be of type string.');
    }

    var re = /\%(?:\((\w+)\))?([\w\%])/;

    var getReplacement = function (v, code) {
        if (v == null)
            return null;

        switch (code) {
            case "s":
                return v.toString();
            case "r":
                return tojson(v).toString();
            case "i":
            case "d":
                return parseInt(v).toString();
            case "f":
                return Number(v).toString();
            case "%":
                return "%";
            default:
                throw new FormatterError('Unexpected conversion type: ' + code);
        }
    };

    var arg_index = 1;
    var named = false;

    while ((match = re.exec(msg)) != null) {
        if (match[2] == "%")
            arg_index --;

        if (arg_index >= arguments.length)
            throw new FormatterError('Not enough arguments to replace all conversion specifiers.');

        // named replacement
        if(match[1]) {
            var repl = getReplacement(vals[match[1]], match[2]);
            if (repl == null)
                throw new FormatterError('Could not find mapping for key: ' + match[1]);
            named = true;
        }
        // anonymous replacement
        else {
            repl = getReplacement(arguments[arg_index], match[2]);
            arg_index++;
        }

        msg = msg.replace(re, repl);
    }
    if (arg_index < arguments.length && !named)
        throw new FormatterError('Too many arguments.');

    return msg;
}

// Note: the django version gives a leading space, this doesn't.
var flatatt = util.flatatt = function(dict) {
    var buffer = "";
    var isFirst = true;

    for(var key in dict) {
        if(!isFirst)
            buffer += ' ';
        buffer += (key + '=' + '"' + content.HTML.escape(dict[key]) + '"');

        isFirst = false;
    }
    return buffer;
};

var ErrorDict = util.ErrorDict = function(dict) {
    if (typeof(dict) == 'undefined') {
        dict = {};
    }
    if (typeof(dict) != 'object') {
        throw new Error("Attempting to create ErrorDict from non-mapping type.");
    }
    this.dict = dict;
};

ErrorDict.prototype = {
    _dontEnum: true,

    toString: function() {
        return this.as_ul();
    },

    as_ul: function() {
        if (this.dict.keySet().length == 0)
            return '';
        var inner = '';
        for (var k in this.dict) {
            inner += '<li>' + k + this.dict[k] + '</li>';
        }
        return djang10.mark_safe('<ul class="errorlist">' + inner + '</ul>');
    },

    as_text: function() {
        if (this.dict.keySet().length == 0)
            return '';
        var out = '';
        for (var k in this.dict) {
            var inner = '';
            if (typeof(this.dict[k]) == 'object') {
                for (var j in this.dict[k]) {
                    inner += '  * ' + this.dict[k][j] + '\n';
                }
            }
            out += '* ' + k + '\n' + inner;
        }
        return out;
    }
};

var ErrorList = util.ErrorList = function(list) {
    if (typeof(list) == 'undefined') {
        list = [];
    }
    if (typeof(list) != 'object') {
        throw new Error("Attempting to create ErrorList from non-Array.");
    }
    if (list.constructor == Array) {
        this.list = list;
        return;
    }
    if (list.constructor == util.ErrorList) {
        this.list = list.list;
        return;
    }
    throw new Error("Attempting to create ErrorList from non-Array.");
};

ErrorList.prototype = {
    _dontEnum: true,

    toString: function() {
        return this.as_ul();
    },

    as_ul: function() {
        if (this.list.length == 0)
            return '';
        var inner = '';
        for (var i = 0; i < this.list.length; i++)
            inner += '<li>' + content.HTML.escape(this.list[i]) + '</li>';
        return djang10.mark_safe('<ul class="errorlist">' + inner + '</ul>');
    },

    as_text: function() {
        if (this.list.length == 0)
            return '';
        var out = '';
        for (var i = 0; i < this.list.length; i++)
            out += '* ' + this.list[i] + '\n';
        return out;
    },

    extend: function(list) {
        if (typeof(list) == 'undefined' || typeof(list) != 'object') {
            throw new Error("Invalid argument to extend.");
        }
        if (list.constructor == Array) {
            for (var i = 0; i < list.length; i++) {
                this.list.push(list[i]);
            }
        }
        if (list.constructor == ErrorList) {
            for (var i = 0; i < list.list.length; i++) {
                this.list.push(list.list[i]);
            }
        }
    }
};

var ValueError = util.ValueError = function(msg) {
    Error.call(this, msg);
};

var NotImplementedError = util.NotImplementedError = function(msg) {
    Error.call(this, msg);
};

var FormatterError = util.FormatterError = function(msg) {
    Error.call(this, msg);
}

var ValidationError = util.ValidationError = function(msg) {
    if (typeof msg === 'object' && msg.constructor === ErrorList) {
        Error.call(this, msg);
    } else if (typeof(msg) !== 'object' || msg.constructor !== Array)
        Error.call(this, new ErrorList([msg]));
    else
        Error.call(this, new ErrorList(msg));
};
ValidationError.NON_FIELD_ERRORS = '__all__';

var Error = util.Error = function(msg) {
    this.message = msg;
};

Error.prototype = {
    toString: function() {
        return this.message.toString();
    }
};

return util;
