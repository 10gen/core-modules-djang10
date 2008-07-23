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

core.modules.djang10.util.object();
core.modules.djang10.forms.widgets();

fields = {};

var Field = fields.Field = function(params) {
    params = {
        required: true,
        widget: null,
        label: null,
        initial: null,
        help_text: "",
        error_messages: {}
    }.merge(params || {});

    this.required = params.required;
    this.label = params.label;
    this.initial = params.initial;
    this.help_text = params.help_text;
    if(params.widget != null)
        this.widget = params.widget;
    
    //instantiate the widget if it needs it
    if (this.widget instanceof Function) {
        this.widget = new this.widget();
    }
    
    //get field specific html attributes to apply for the current widget
    Object.extend(this.widget.attrs, this.widget_attrs(this.widget));
    
    //get error messages
    this.error_messages = {};

    //from base classes
    var prototypeStack = [];                
    for(var prototype = this.__proto__; prototype != null; prototype = prototype.__proto__)
        prototypeStack.push(prototype);
    while(prototypeStack.length > 0)
        this.error_messages.extend(prototypeStack.pop().default_error_messages);

    //from arguments
    this.error_messages.extend(params.error_messages);
};

Field.prototype = {
    widget: widgets.TextInput,
    hidden_widget: widgets.HiddenInput,
    default_error_messages: {
        required: "This field is required.",
        invalid: "Enter a valid value."
    },
    
    widget_attrs: function(widget) {
        return {};
    },
    
    clean: function(value) {
        if(this.required && (value == null || value == '')) 
            throw new ValidationError(this.error_messages["required"]);
        
        return value;
    }
};

var CharField = fields.CharField = function(params) {
    params = {
        max_length: null, 
        min_length: null

    }.merge(params || {});
    
    this.max_length = params.max_length;
    this.min_length = params.min_length;
    
    Field.call(this, params);
};

CharField.prototype = {
    __proto__ : Field.prototype,

    default_error_messages: {
        'max_length': 'Ensure this value has at most %(max)d characters (it has %(length)d).',
        'min_length': 'Ensure this value has at least %(min)d characters (it has %(length)d).'
    },
    
    clean: function(value) {
        // convert to a string
        if (value != null)
            value = value.toString();
        else
            value = '';
        
        Field.prototype.clean.call(this, value);
        
        var value_len = value.length;
        if(this.max_length != null && value_len > this.max_length)
            throw new ValidationError(simplePythonFormat(this.error_messages["max_length"], {'max': this.max_length, 'length': value_len}));
        if(this.min_length != null && value_len < this.min_length && value != '')
            throw new ValidationError(simplePythonFormat(this.error_messages["min_length"], {'min': this.min_length, 'length': value_len}));
        
        return value;
    },
    
    widget_attrs: function(widget) {
        var attrs = {};
        
        if(this.max_length != null) {
            if(Object.instanceOf(widget, widgets.TextInput) || Object.instanceOf(widget, widgets.PasswordInput)) {
                attrs["maxlength"] = this.max_length;
            }
        }
        
        return attrs;
    }
};

/*
    TODO Implement the rest of the fields
*/

/*
    TODO Mave this stuff
*/
var simplePythonFormat = fields.simplePythonFormat = function (msg, vals) {
    if (typeof(msg) != 'string') {
        throw new FormatterError('Message must be of type string.')
    }
    
    var re = /\%(?:\((\w+)\))?([\w\%])/;
    
    var getReplacement = function (v, code) {
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
                throw new FormatterError('Unexpected conversion type: ' + v)
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

FormatterError = function(msg) {
    this.message = msg;
}

ValidationError = function(msg) {
    this.message = msg;
};
ValidationError.NON_FIELD_ERRORS = '__all__';

return fields;