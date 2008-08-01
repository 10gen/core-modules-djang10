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
core.modules.djang10.forms.util();

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
        if(this.required && (value == null || (typeof(value) == 'string' && value == ''))) 
            throw new util.ValidationError(this.error_messages["required"]);
        
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
        Field.prototype.clean.call(this, value);
        
        if (value == null || (typeof(value) == 'string' && value == ''))
            return '';
        
        value = value.toString();
        var value_len = value.length;
        if(this.max_length != null && value_len > this.max_length)
            throw new util.ValidationError(util.simplePythonFormat(this.error_messages["max_length"], {'max': this.max_length, 'length': value_len}));
        if(this.min_length != null && value_len < this.min_length && value != '')
            throw new util.ValidationError(util.simplePythonFormat(this.error_messages["min_length"], {'min': this.min_length, 'length': value_len}));
        
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

var IntegerField = fields.IntegerField = function(params) {
    params = {
        max_value: null,
        min_value: null
    }.merge(params || {});
    
    this.max_value = params.max_value;
    this.min_value = params.min_value;
    
    Field.call(this, params);
};

IntegerField.prototype = {
    __proto__: Field.prototype,
    
    default_error_messages: {
        'invalid': 'Enter a whole number.',
        'max_value': 'Ensure this value is less than or equal to %s.',
        'min_value': 'Ensure this value is greater than or equal to %s.'
    },
    
    clean: function(value) {
        Field.prototype.clean.call(this, value);
        
        if (value == null || (typeof(value) == 'string' && value == ''))
            return null;
        
        // convert to string and trim
        value = value.toString().replace(/^\s+/, '').replace(/\s+$/, '');
        
        if (/^-?\d+$/.test(value)) {
            value = Number(value);
        }
        else {
            throw new util.ValidationError(this.error_messages['invalid']);
        }
        
        if (this.max_value != null && value > this.max_value) {
            throw new util.ValidationError(util.simplePythonFormat(this.error_messages['max_value'], this.max_value));
        }
        if (this.min_value != null && value < this.min_value) {
            throw new util.ValidationError(util.simplePythonFormat(this.error_messages['min_value'], this.min_value));
        }
        
        return value;
    }
};

var FloatField = fields.FloatField = function(params) {
    params = {
        max_value: null,
        min_value: null
    }.merge(params || {});
    
    this.max_value = params.max_value;
    this.min_value = params.min_value;
    
    Field.call(this, params);
};

FloatField.prototype = {
    __proto__: Field.prototype,
    
    default_error_messages: {
        'invalid': 'Enter a number.',
        'max_value': 'Ensure this value is less than or equal to %s.',
        'min_value': 'Ensure this value is greater than or equal to %s.'
    },
    
    clean: function(value) {
        Field.prototype.clean.call(this, value);
        
        if (value == null || (typeof(value) == 'string' && value == ''))
            return null;
        
        // convert to string and trim
        value = value.toString().replace(/^\s+/, '').replace(/\s+$/, '');
        
        if (/(^-?\d+\.?$)|(^-?\d*\.\d+$)/.test(value)) {
            value = Number(value);
        }
        else {
            throw new util.ValidationError(this.error_messages['invalid']);
        }
        
        if (this.max_value != null && value > this.max_value) {
            throw new util.ValidationError(util.simplePythonFormat(this.error_messages['max_value'], this.max_value));
        }
        if (this.min_value != null && value < this.min_value) {
            throw new util.ValidationError(util.simplePythonFormat(this.error_messages['min_value'], this.min_value));
        }
        
        return value;
    }
};

var DecimalField = fields.DecimalField = function(params) {
    params = {
        max_value: null,
        min_value: null,
        max_digits: null,
        decimal_places: null
    }.merge(params || {});
    
    this.max_value = params.max_value;
    this.min_value = params.min_value;
    this.max_digits = params.max_digits;
    this.decimal_places = params.decimal_places;
    
    Field.call(this, params);
};

DecimalField.prototype = {
    __proto__: Field.prototype,
    
    default_error_messages: {
        'invalid': 'Enter a number.',
        'max_value': 'Ensure this value is less than or equal to %s.',
        'min_value': 'Ensure this value is greater than or equal to %s.',
        'max_digits': 'Ensure that there are no more than %s digits in total.',
        'max_decimal_places': 'Ensure that there are no more than %s decimal places.',
        'max_whole_digits': 'Ensure that there are no more than %s digits before the decimal point.'
    },
    
    clean: function(value) {
        Field.prototype.clean.call(this, value);
        
        if (value == null || (typeof(value) == 'string' && value == ''))
            return null;
        
        // convert to string and trim
        value = value.toString().replace(/^\s+/, '').replace(/\s+$/, '');

        if (/(^-?\d+\.?$)|(^-?\d*\.\d+$)/.test(value)) {
            var pieces = value.replace('-', '').split('.');
            if (pieces.length == 2) {
                pieces[0] = pieces[0].replace(/0+/, '0');
            }
            var decimals = (pieces.length == 2) ? pieces[1].length : 0;
            var digits = pieces[0].length;
            
            value = Number(value);
        }
        else {
            throw new util.ValidationError(this.error_messages['invalid']);
        }
        
        if (this.max_value != null && value > this.max_value) {
            throw new util.ValidationError(util.simplePythonFormat(this.error_messages['max_value'], this.max_value));
        }
        if (this.min_value != null && value < this.min_value) {
            throw new util.ValidationError(util.simplePythonFormat(this.error_messages['min_value'], this.min_value));
        }
        if (this.max_digits != null && (digits + decimals) > this.max_digits) {
            throw new util.ValidationError(util.simplePythonFormat(this.error_messages['max_digits'], this.max_digits));
        }
        if (this.decimal_places != null && decimals > this.decimal_places) {
            throw new util.ValidationError(util.simplePythonFormat(this.error_messages['max_decimal_places'], this.decimal_places));
        }
        if (this.max_digits != null && this.decimal_places != null && digits > (this.max_digits - this.decimal_places)) {
            throw new util.ValidationError(util.simplePythonFormat(this.error_messages['max_whole_digits'], (this.max_digits - this.decimal_places)));
        }
        
        return value;
    }
};

var DateField = fields.DateField = function(params) {
    params = {
        input_formats: null
    }.merge(params || {});
    
    Field.call(this, params);
    this.input_formats = params.input_formats || DateField.DEFAULT_DATE_INPUT_FORMATS;
};

DateField.DEFAULT_DATE_INPUT_FORMATS = [
    '%Y-%m-%d', '%m/%d/%Y', '%m/%d/%y', // '2006-10-25', '10/25/2006', '10/25/06'
    '%b %d %Y', '%b %d, %Y',            // 'Oct 25 2006', 'Oct 25, 2006'
    '%d %b %Y', '%d %b, %Y',            // '25 Oct 2006', '25 Oct, 2006'
    '%B %d %Y', '%B %d, %Y',            // 'October 25 2006', 'October 25, 2006'
    '%d %B %Y', '%d %B, %Y'             // '25 October 2006', '25 October, 2006'
];

DateField.prototype = {
    __proto__: Field.prototype,
    
    default_error_messages: {
        'invalid': 'Enter a valid date.'
    },
    
    clean: function(value) {
        Field.prototype.clean.call(this, value);
        
        if (value == null || (typeof(value) == 'string' && value == ''))
            return null;
        
        if (typeof(value) == 'object' && value.constructor == Date) {
            return new Date(value.getFullYear(), value.getMonth(), value.getDate());
        }
        
        if (typeof(value) == 'string') {
            for (var i in this.input_formats) {
                var format = this.input_formats[i];
                
                try {
                    var d = util.strptime(value, format);
                    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
                }
                catch (e if e.constructor === util.ValueError) {
                    continue;
                }
            }
        }
        throw new util.ValidationError(this.error_messages['invalid']);
    }
}

var TimeField = fields.TimeField = function(params) {
    params = {
        input_formats: null
    }.merge(params || {});
    
    Field.call(this, params);
    this.input_formats = params.input_formats || TimeField.DEFAULT_TIME_INPUT_FORMATS;
};

TimeField.DEFAULT_TIME_INPUT_FORMATS = [
    '%H:%M:%S',     // '14:30:59'
    '%H:%M'         // '14:30'
];

TimeField.prototype = {
    __proto__: Field.prototype,
    
    default_error_messages: {
        'invalid': 'Enter a valid time.'
    },
    
    clean: function(value) {
        Field.prototype.clean.call(this, value);
        
        if (value == null || (typeof(value) == 'string' && value == ''))
            return null;
        
        if (typeof(value) === 'object' && value.constructor == Date) {
            return new Date(0, 0, 0, value.getHours(), value.getMinutes(), value.getSeconds());
        }
        
        if (typeof(value) === 'string') {
            for (var i  = 0; i < this.input_formats.length; i++) {
                var format = this.input_formats[i];
                
                try {
                    var d = util.strptime(value, format);
                    return new Date(0, 0, 0, d.getHours(), d.getMinutes(), d.getSeconds());
                }
                catch (e if e.constructor === util.ValueError) {
                    continue;
                }
            }
        }
        throw new util.ValidationError(this.error_messages['invalid']);
    }
};

var DateTimeField = fields.DateTimeField = function(params) {
    params = {
        input_formats: null
    }.merge(params || {});
    
    Field.call(this, params);
    this.input_formats = params.input_formats || DateTimeField.DEFAULT_DATETIME_INPUT_FORMATS;
};

DateTimeField.DEFAULT_DATETIME_INPUT_FORMATS = [
    '%Y-%m-%d %H:%M:%S',     // '2006-10-25 14:30:59'
    '%Y-%m-%d %H:%M',        // '2006-10-25 14:30'
    '%Y-%m-%d',              // '2006-10-25'
    '%m/%d/%Y %H:%M:%S',     // '10/25/2006 14:30:59'
    '%m/%d/%Y %H:%M',        // '10/25/2006 14:30'
    '%m/%d/%Y',              // '10/25/2006'
    '%m/%d/%y %H:%M:%S',     // '10/25/06 14:30:59'
    '%m/%d/%y %H:%M',        // '10/25/06 14:30'
    '%m/%d/%y',              // '10/25/06'
];

DateTimeField.prototype = {
    __proto__: Field.prototype,
    
    widget: widgets.DateTimeInput,
    
    default_error_messages: {
        'invalid': 'Enter a valid date/time.'
    },
    
    clean: function(value) {
        Field.prototype.clean.call(this, value);
        
        if (value === null || (typeof(value) === 'string' && value === ''))
            return null;
        
        if (typeof(value) === 'object' && value.constructor === Date) {
            return value;
        }
        
        if (typeof(value) === 'object' && value.constructor === Array) {
            // ie: input comes from a SplitDateTimeWidget.
            if (value.length != 2) {
                throw new util.ValidationError(this.error_messages['invalid']);
            }
            // just join the date and time...
            value = value[0] + " " + value[1];
        }
        
        if (typeof(value) === 'string') {
            for (var i = 0; i < this.input_formats.length; i++) {
                var format = this.input_formats[i];
            
                try {
                    return util.strptime(value, format);
                }
                catch (e if e.constructor === util.ValueError) {
                    continue;
                }
            }
        }
        throw new util.ValidationError(this.error_messages['invalid']);
    }
};

var RegexField = fields.RegexField = function(params) {
    params = {
        regex: '',
        error_messages: {}
    }.merge(params || {});
    
    // error_message is just copied to e_m['invalid'] for backwards compatibility
    if (params.error_message) {
        params.error_messages['invalid'] = params.error_message;
    }
    
    CharField.call(this, params);
    if (typeof(params.regex) === 'string') {
        this.regex = RegExp(params.regex);
    }
    else {
        this.regex = params.regex;
    }
};

RegexField.prototype = {
    __proto__: CharField.prototype,
    
    clean: function(value) {
        CharField.prototype.clean.call(this, value);
        
        if (value === null || value === "") {
            return '';
        }
        if (!this.regex.test(value)) {
            throw new util.ValidationError(this.error_messages['invalid']);
        }
        
        return value;
    }
};

var EmailField = fields.EmailField = function(params) {
    params = params || {};
    params.regex = /^\w[\w\+\.]*@\w+(\.\w+)+$/;

    RegexField.call(this, params);
};

EmailField.prototype = {
    __proto__: RegexField.prototype,
    
    default_error_messages: {
        'invalid': 'Enter a valid e-mail address.'
    }
};

var FileField = fields.FileField = function(param) {
    Field.call(this, params);
};

FileField.prototype = {
    __proto__: Field.prototype,
    
    widget: widgets.FileInput,
    
    default_error_messages: {
        'invalid': 'No file was submitted. Check the encoding type on the form.',
        'missing': 'No file was submitted.',
        'empty': 'The submitted file is empty.'
    },
    
    clean: function(data, initial) {
        initial = initial || null;
        
        Field.prototype.clean.call(this, initial || data);
        
        if (!this.required && (data === null || data === '')) {
            return null;
        }
        if (!data && initial) {
            return initial;
        }
        
        if (!data.filename) {
            throw new util.ValidationError(this.error_messages['invalid']);
        }
        if (!data.length) {
            throw new util.ValidationError(this.error_messages['empty']);
        }
        
        return data;
    }
}

/*
    TODO Implement the rest of the fields
*/

return fields;
