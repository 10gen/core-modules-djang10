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
        if (!v)
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
}

var NotImplementedError = util.NotImplementedError = function(msg) {
    this.message = msg;
};

var FormatterError = util.FormatterError = function(msg) {
    this.message = msg;
}

var ValidationError = util.ValidationError = function(msg) {
    this.message = msg;
};

ValidationError.NON_FIELD_ERRORS = '__all__';

return util;