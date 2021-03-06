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
core.net.url();

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

    var widget = params.widget || this.widget;

    //instantiate the widget if it needs it
    if (widget instanceof Function) {
        widget = new widget();
    }

    //get field specific html attributes to apply for the current widget
    widget.attrs = widget.attrs.merge(this.widget_attrs(widget));

    this.widget = widget;

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
            throw new util.ValidationError(
                util.simplePythonFormat(this.error_messages["max_length"],
                    {'max': this.max_length, 'length': value_len}
                )
            );
        if(this.min_length != null && value_len < this.min_length && value != '')
            throw new util.ValidationError(
                util.simplePythonFormat(this.error_messages["min_length"],
                    {'min': this.min_length, 'length': value_len}
                )
            );

        return value;
    },

    widget_attrs: function(widget) {
        var attrs = {};

        if(this.max_length != null) {
            if(widget._use_max_length_attr) {
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

		var match;
        if (/^-?\d+(E\d+)?$/.test(value)) {
            value = Number(value);
        } else if ((match = /^-?\d*\.(\d+)E(\d+)/.exec(value))) {
			if (Number(match[2]) >= match[1].length) {
				value = Number(value);
			} else {
				throw new util.ValidationError(this.error_messages['invalid']);
			}
		} else {
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
        'max_digits': 'Ensure that there are no more than %d digits in total.',
        'max_decimal_places': 'Ensure that there are no more than %s decimal places.',
        'max_whole_digits': 'Ensure that there are no more than %d digits before the decimal point.'
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
            throw new util.ValidationError(
                util.simplePythonFormat(this.error_messages['max_whole_digits'],
                    this.max_digits - this.decimal_places
                )
            );
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

var FileField = fields.FileField = function(params) {
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
};

// NOTE: doesn't make use of a validator_user_agent right now
var URLField = fields.URLField = function(params) {
    params = {
        max_length: null,
        min_length: null,
        verify_exists: false,
    }.merge(params || {});
    //               protocol         domain          tld   or localhost or ip                               port     the rest...
    params.regex = /^https?:\/\/(?:(?:[A-Z0-9.\-]+\.)+[A-Z]{2,6}|localhost|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::\d+)?(?:\/?|\/\S+)$/i;
    RegexField.call(this, params);

    this.verify_exists = params.verify_exists;
};

URLField.prototype = {
    __proto__: RegexField.prototype,

    default_error_messages: {
        'invalid': 'Enter a valid URL.',
        'invalid_link': 'This URL appears to be a broken link.'
    },

    clean: function(value) {
        if (value && value.indexOf('://') === -1) {
            value = 'http://' + value;
        }
        var u = value && new URL(value);
        if (value && !u.path) {
            value += '/';
        }
        value = RegexField.prototype.clean.apply(this, [value]);
        if (value === '') {
            return value;
        }
        if (this.verify_exists) {
            var req = new XMLHttpRequest("GET", value);
            var res = req.send();
            // TODO this should probably follow redirects and check that the resulting page actually exists
            if (!res || !res.status || res.status >= 400) { // 400s and 500s are error codes
                throw new util.ValidationError(this.error_messages['invalid_link']);
            }
        }
        return value;
    }
};

var BooleanField = fields.BooleanField = function(params) {
    Field.apply(this, [params]);
};

BooleanField.prototype = {
    __proto__: Field.prototype,

    widget: widgets.CheckboxInput,

    clean: function(value) {
        if (typeof value === 'string' && value === 'false') {
            value = false;
        } else {
            value = util.bool(value);
        }

        Field.prototype.clean.apply(this, [value]);

        if (!value && this.required) {
            throw new util.ValidationError(this.error_messages['required']);
        }
        return value;
    }
};

var ChoiceField = fields.ChoiceField = function(params) {
    params = {
        choices: [],
        required: true,
        widget: null,
        label: null,
        initial: null,
        help_text: null
    }.merge(params || {});

    Field.apply(this, [params]);

    this.choices = params.choices;
};

ChoiceField.prototype = {
    __proto__: Field.prototype,

    widget: widgets.Select,

    default_error_messages: {
        'invalid_choice': 'Select a valid choice. %(value)s is not one of the available choices.'
    },

    clean: function(value) {
        value = Field.prototype.clean.apply(this, [value]);

        if (value === null) {
            value = '';
        }
        value = value.toString();
        if (value === '') {
            return value;
        }

        if (!this.valid_value(value)) {
            throw new util.ValidationError(util.simplePythonFormat(this.error_messages['invalid_choice'], {'value': value}));
        }

        return value
    },

    valid_value: function(value) {
        for (var k in this.choices) {
            var v = this.choices[k];

            if (typeof v === 'object') {
                // This is an optgroup
                for (var k2 in v) {
                    if (value === k2.toString()) {
                        return true;
                    }
                }
            }

            if (value === k.toString()) {
                return true;
            }
        }
        return false;
    }
};

ChoiceField.prototype.__defineGetter__("choices", function() {return this._choices;});
ChoiceField.prototype.__defineSetter__("choices", function(value) {
    this.widget.choices = value;
    this._choices = this.widget.choices;
});

var NullBooleanField = fields.NullBooleanField = function(params) {
    BooleanField.apply(this, [params]);
};

NullBooleanField.prototype = {
    __proto__: BooleanField.prototype,

    widget: widgets.NullBooleanSelect,

    clean: function(value) {
        if (typeof value === 'boolean') {
            return value;
        }
        return null;
    }
};

var MultipleChoiceField = fields.MultipleChoiceField = function(params) {
    ChoiceField.apply(this, [params]);
};

MultipleChoiceField.prototype = {
    __proto__: ChoiceField.prototype,

    hidden_widget: widgets.MultipleHiddenInput,
    widget: widgets.SelectMultiple,
    default_error_messages: {
        'invalid_choice': 'Select a valid choice. %(value)s is not one of the available choices.',
        'invalid_list': 'Enter a list of values.'
    },

    clean: function(value) {
        if (this.required && (!value || (typeof value === 'object' && Object.isEmpty(value)))) {
            throw new util.ValidationError(this.error_messages['required']);
        } else if (!this.required && (!value || (typeof value === 'object' && Object.isEmpty(value)))) {
            return [];
        }
        if (typeof value !== 'object') {
            throw new util.ValidationError(this.error_messages['invalid_list']);
        }
        var ret_val = [];
        for (var k in value) {
            value[k] = value[k].toString();
            if (!this.valid_value(value[k])) {
                throw new util.ValidationError(util.simplePythonFormat(this.error_messages['invalid_choice'], {value: value[k]}));
            }
            ret_val.push(value[k]);
        }
        return ret_val;
    }
};

var ComboField = fields.ComboField = function(params) {
    params = {
        fields: []
    }.merge(params || {});

    Field.apply(this, [params]);

    for (var i = 0; i < params.fields.length; i++) {
        params.fields[i].required = false;
    }

    this.fields = params.fields;
};

ComboField.prototype = {
    __proto__: Field.prototype,

    clean: function(value) {
        Field.clean.apply(this, [value]);

        for (var i = 0; i < this.fields.length; i++) {
            value = this.fields[i].clean(value);
        }

        return value;
    }
}

var FilePathField = fields.FilePathField = function(params) {
    params = {
        match: null,
        recursive: false,
        required: true,
        widget: widgets.Select,
        label: null,
        initial: null,
        help_text: null
    }.merge(params || {});

    this.path = params.path;
    this.match = params.match;
    this.recursive = params.recursive;

    ChoiceField.apply(this, [params]);

    this.choices = {};

    if (this.match !== null) {
        this.match_re = RegExp(this.match);
    }

    var thisFile = openFile(params.path);
    if (thisFile.exists() && thisFile.isDirectory()) {
        var contents = [];
        contents = thisFile.listFiles();

        if (this.recursive) {
            addFiles(contents, this.choices, this.match_re, params.path);
        } else {
            for (var i = 0; i < contents.length; i++) {
                if (!contents[i].isDirectory()) {
                    if (!this.match_re || this.match_re.test(contents[i].getName())) {
                        this.choices[params.path + contents[i].getName()] = contents[i];
                    }
                }
            }
        }
        this.widget.choices = this.choices;
    } else {
        throw new util.ValidationError('path ' + params.path + 'does not exist or is not a directory.');
    }
};

FilePathField.prototype.__proto__ = ChoiceField.prototype;

var addFiles = function(files, choices, match_re, path) {
    for (var i = 0; i < files.length; i++) {
        if (files[i].isDirectory()) {
            addFiles(files[i].listFiles(), choices, match_re, path + files[i].getName() + '/');
        } else if (!match_re || match_re.test(files[i].getName())) {
            choices[path + files[i].getName()] = files[i];
        }
    }
};

MultiValueField = fields.MultiValueField = function(params) {
    params = {
        fields: []
    }.merge(params || {});

    Field.apply(this, [params]);

    for (var i = 0; i < params.fields.length; i++) {
        params.fields[i].required = false;
    }

    this.fields = params.fields;
};

MultiValueField.prototype = {
    __proto__: Field.prototype,

    default_error_messages: {
        'invalid': 'Enter a list of values.'
    },

    clean: function(value) {
        var clean_data = [];
        var errors = new util.ErrorList();

        if (!value || (typeof value === 'object' && Object.isEmpty(value))) {
            if (this.required) {
                throw new util.ValidationError(this.error_messages['required']);
            }
            return this.compress([]);
        }
        if (typeof value !== 'object') {
            throw new util.ValidationError(this.error_messages['invalid']);
        }

        var empty = true;
        for (var i in value) {
            if (value[i] !== null && value[i] !== '') {
                var empty = false;
            }
        }
        if (empty) {
            if (this.required) {
                throw new util.ValidationError(this.error_messages['required']);
            }
            return this.compress([]);
        }

        for (var i in this.fields) {
            var field = this.fields[i];

            var field_value = value[i];

            if (this.required && (field_value === null || field_value === '')) {
                throw new util.ValidationError(this.error_messages['required']);
            }
            try {
                clean_data.push(field.clean(field_value));
            } catch (e if e.constructor === util.ValidationError) {
                errors.extend(e.message);
            }
        }
        if (errors.toString()) {
            throw new util.ValidationError(errors);
        }
        return this.compress(clean_data);
    },

    compress: function(data_list) {
        throw new util.NotImplementedError('Subclasses must implement this method.');
    }
};

var SplitDateTimeField = fields.SplitDateTimeField = function(params) {
    params = {
        error_messages: {}
    }.merge(params || {});
    var errors = this.default_error_messages.merge(params.error_messages);
    var fields = [
        new DateField({error_messages: {'invalid': errors['invalid_date']}}),
        new TimeField({error_messages: {'invalid': errors['invalid_time']}})
    ];

    MultiValueField.apply(this, [params.merge({fields: fields})]);
};

SplitDateTimeField.prototype = {
    __proto__: MultiValueField.prototype,

    widget: widgets.SplitDateTimeWidget,

    default_error_messages: {
        'invalid_date': 'Enter a valid date.',
        'invalid_time': 'Enter a valid time.'
    },

    compress: function(data_list) {
        if (data_list && !Object.isEmpty(data_list)) {
            if (data_list[0] === null || data_list[0] === '') {
                throw new util.ValidationError(this.error_messages['invalid_date']);
            }
            if (data_list[1] === null || data_list[1] === '') {
                throw new util.ValidationError(this.error_messages['invalid_time']);
            }
            return new Date(data_list[0].getFullYear(), data_list[0].getMonth(),
                data_list[0].getDate(), data_list[1].getHours(),
                data_list[1].getMinutes(), data_list[1].getSeconds());
        }
        return null;
    }
};

var IPAddressField = fields.IPAddressField = function(params) {
    params = (params || {}).merge({
        regex: /^(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}$/
    });

    RegexField.apply(this, [params]);
};

IPAddressField.prototype = {
    __proto__: RegexField.prototype,

    default_error_messages: {
        'invalid': 'Enter a valid IPv4 address.'
    }
};

// Right now just a pass-through for FileField. In Django it checks that the
// file is a valid image but that is a lot of work without PIL.
var ImageField = fields.ImageField = function(params) {
    FileField.apply(this, [params]);
};

ImageField.prototype.__proto__ = FileField.prototype;

return fields;
