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
                return "%"
            default:
                throw new FormatterError('Unexpected conversion type: ' + code)
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
            if (!repl)
                throw new FormatterError('Could not find mapping for key: ' + match[1]);
            named = true
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
        return '<ul class="errorlist">' + inner + '</ul>';
    },
    
    as_text: function() {
        if (this.dict.keySet().length == 0)
            return '';
        var out = '';
        for (var k in this.dict) {
            var inner = '';
            for (var j in this.dict[k]) {
                inner += '  * ' + this.dict[k][j] + '\n';
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
    toString: function() {
        return this.as_ul();
    },
    
    as_ul: function() {
        if (this.list.length == 0)
            return '';
        var inner = '';
        for (var i = 0; i < this.list.length; i++)
            inner += '<li>' + this.list[i] + '</li>';
        return '<ul class="errorlist">' + inner + '</ul>';
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

var NotImplementedError = util.NotImplementedError = function(msg) {
    Error.call(this, msg);
};

var FormatterError = util.FormatterError = function(msg) {
    Error.call(this, msg);
}

var ValidationError = util.ValidationError = function(msg) {
    if (typeof(msg) != 'object' || msg.constructor != Array)
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