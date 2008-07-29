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
        
        if (/^\d+$/.test(value)) {
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
}

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
        
        if (/(^\d+\.?$)|(^\d*\.\d+$)/.test(value)) {
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
}

/*
    TODO Implement the rest of the fields
*/

return fields;
