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

core.content.html();
core.modules.djang10.forms.util();

widgets = {};

/*
    NOTE it might make more sense for widgets to take an object like {attrs: attrs, choices: choices}
*/
var Widget = widgets.Widget = function(attrs) {
    this.attrs = attrs || {};
};

Widget.prototype = {
    render: function(name, value, attrs){
        throw new util.NotImplementedError();
    },

    build_attrs: function(extra_attrs, kwargs) {
        var attrs = this.attrs.merge(kwargs || {});
        return attrs.merge(extra_attrs || {});
    },

    value_from_datadict: function(data, files, name){
        return data && data[name];
    },

    _has_changed: function(initial, data) {
        var data_value = (data == null) ? '' : data;
        var initial_value = (initial == null) ? '' : initial;

        return (data_value != initial_value);
    },

    id_for_label: function(id){
        return id;
    }
};

//Input -------------------------------
var Input = widgets.Input = function(attrs) {
    Widget.call(this, attrs);
};

Input.prototype = {
    __proto__: Widget.prototype,

    input_type: null,

    render: function(name, value, attrs){
        var type = this.input_type;

        // we might want the value to be false, so check for undefined not negation
        value = typeof(value) != 'undefined' ? value : '';

        attrs = this.build_attrs(attrs, { type: type, name: name });

        if (!((typeof value === 'string' && value === '') || (typeof value === 'object' && value === null))) {
            attrs["value"] = value;
        }

        return djang10.mark_safe('<input ' + util.flatatt(attrs) + ' />');
    }
};

//TextInput --------------------------------------
var TextInput = widgets.TextInput = function(attrs) {
    Input.call(this, attrs);
};

TextInput.prototype = {
    __proto__ : Input.prototype,
    _use_max_length_attr: true,

    input_type: "text"
};

// PasswordInput -------------------
var PasswordInput = widgets.PasswordInput = function(attrs, render_value) {
    Input.call(this, attrs || {});

    //render_value defaults to true
    this.render_value = typeof(render_value) != 'undefined' ? render_value : true;
};

PasswordInput.prototype = {
    __proto__ : Input.prototype,
    _use_max_length_attr: true,

    input_type: "password",

    render: function(name, value, attrs) {
        if(!this.render_value) value = null;
        return Input.prototype.render.call(this, name, value, attrs);
    }
};

//HiddenInput ----------------------
var HiddenInput = widgets.HiddenInput = function(attrs) {
    Input.call(this, attrs || {});
};

HiddenInput.prototype = {
    __proto__: Input.prototype,

    input_type: "hidden",
    is_hidden: true
};

var Textarea = widgets.Textarea = function(attrs) {
    attrs = {'rows': '10', 'cols': '40'}.merge(attrs || {});
    Widget.call(this, attrs);
};

Textarea.prototype = {
    __proto__: Widget.prototype,

    render: function(name, value, attrs) {
        if (value == null)
            value = '';
        var final_attrs = this.build_attrs(attrs, {name: name});
        return djang10.mark_safe(util.simplePythonFormat('<textarea %s>%s</textarea>',
                util.flatatt(final_attrs), util.conditional_escape(value)));
    }
}

var MultipleHiddenInput = widgets.MultipleHiddenInput = function(attrs, choices) {
    this.choices = choices;
    HiddenInput.call(this, attrs);
};

MultipleHiddenInput.prototype = {
    __proto__: HiddenInput.prototype,

    render: function(name, value, attrs, choices) {
        if (value == null)
            value = [];
        var final_attrs = this.build_attrs(attrs, {type: this.input_type, name: name});
        var out = '';
        for (i = 0; i < value.length; i++) {
            out += '<input ' + util.flatatt(final_attrs.merge({value: value[i]})) + ' />\n';
        }
        return djang10.mark_safe(out);
    }
};

var FileInput = widgets.FileInput = function(attrs) {
    Input.call(this, attrs || {});
};

FileInput.prototype = {
    __proto__: Input.prototype,

    input_type: "file",
    needs_multipart_form: true,

    render: function(name, value, attrs) {
        return Input.render.call(this, name, null, attrs);
    },

    value_from_datadict: function(data, files, name) {
        return files && files[name];
    },

    _has_changed: function(initial, data) {
        if (data == null)
            return false;
        return true;
    }
};

var CheckboxInput = widgets.CheckboxInput = function(attrs, check_test) {
    Widget.call(this, attrs || {});

    // Use passed in value or else just identity.
    this.check_test = check_test || function(x) {return x;};
};

CheckboxInput.prototype = {
    __proto__: Widget.prototype,

    render: function(name, value, attrs) {
        var final_attrs = this.build_attrs(attrs || {}, {type: 'checkbox', name: name});

        var result;
        try {
            result = this.check_test(value);
        }
        catch(e) {
            result = false;
        }
        if (result) {
            final_attrs['checked'] = 'checked';
        }
        if (value !== '' && typeof value !== 'boolean' && value !== null) {
            final_attrs['value'] = value.toString();
        }
        return djang10.mark_safe("<input " + util.flatatt(final_attrs) + " />");
    },

    value_from_datadict: function(data, files, name) {
        if (!data) {
            return null;
        }
        if (typeof(data[name]) == "undefined") {
            return false;
        }
        return Widget.value_from_datadict.call(this, data, files, name);
    },

    _has_changed: function(initial, data) {
        return util.bool(initial) != util.bool(data);
    }
};

var Select = widgets.Select = function(attrs, choices) {
    Widget.call(this, attrs || {});
    this.choices = choices || {};
};

Select.prototype = {
    __proto__: Widget.prototype,

    render: function(name, value, attrs, choices) {
        if (value == null)
            value = '';
        var final_attrs = this.build_attrs(attrs || {}, {name: name});
        var output = '<select ' + util.flatatt(final_attrs) + '>\n';
        var options = this.render_options(choices || {}, [value]);
        if (options)
            output += options;
        output += '</select>';
        return djang10.mark_safe(output);
    },

    render_options: function(choices, selected_choices) {
        var render_option = function(option_value, option_label) {
            option_value = option_value.toString();
            var selected_html = (selected_choices.indexOf(option_value) > -1) ? ' selected="selected"' : '';
            return util.simplePythonFormat('<option value="%s"%s>%s</option>',
                    content.HTML.escape(option_value), selected_html, util.conditional_escape(option_label));
        };

        for (var i in selected_choices) {
            selected_choices[i] = selected_choices[i].toString();
        }
        var output = "";
        choices = this.choices.merge(choices);
        for (var option_value in choices) {
            var option_label = choices[option_value];

            if (typeof(option_label) == "object") {
                output += '<optgroup label="' + content.HTML.escape(option_value) + '">\n';
                for (var option in option_label) {
                    output += render_option(option, option_label[option]) + "\n";
                };
                output += '</optgroup>\n';
            }
            else {
                output += render_option(option_value, option_label) + "\n";
            }
        }
        return output;
    }
};

var NullBooleanSelect = widgets.NullBooleanSelect = function(attrs) {
    var choices = {'1': 'Unknown', '2': 'Yes', '3': 'No'};
    Select.call(this, attrs || {}, choices);
};

NullBooleanSelect.prototype = {
    __proto__: Select.prototype,

    render: function(name, value, attrs, choices) {
        if (typeof value === 'boolean') {
            value = value ? '2' : '3';
        } else if (typeof value !== 'string' && typeof value !== 'undefined') {
            value = value.toString();
        }
        if (value !== '2' && value !== '3') {
            value = '1';
        }
        return Select.render.call(this, name, value, attrs || null, choices || {});
    },

    value_from_datadict: function(data, files, name) {
        var value = data && data[name];

        if (typeof value === 'boolean') {
            value = value ? '2' : '3';
        } else if (typeof value !== 'string' && typeof value !== 'undefined') {
            value = value.toString();
        }
        if (value !== '2' && value !== '3') {
            value = '1';
        }

        return value;
    },

    _has_changed: function(initial, data) {
        return util.bool(initial) != util.bool(data);
    }
};

var SelectMultiple = widgets.SelectMultiple = function(attrs, choices) {
    Select.call(this, attrs, choices);
};

SelectMultiple.prototype = {
    __proto__: Select.prototype,

    render: function(name, value, attrs, choices) {
        if (value == null)
            value = [];
        var final_attrs = this.build_attrs(attrs, {name: name});
        var output = '<select multiple="multiple" ' + util.flatatt(final_attrs) + '>\n';
        var options = this.render_options(choices || {}, value);
        if (options)
            output += options;
        output += '</select>';
        return djang10.mark_safe(output);
    },

    _has_changed: function(initial, data) {
        if (initial == null)
            initial = [];
        if (data == null)
            data = [];
        if (initial.length != data.length)
            return true;
        for (var i in initial) {
            if (initial[i] != data[i]) {
                return true;
            }
        }
        return false;
    }
};

var RadioInput = widgets.RadioInput = function(name, value, attrs, choice, index) {
    this.name = name;
    this.value = value;
    this.attrs = attrs;
    this.choice_value = choice[0].toString();
    this.choice_label = choice[1];
    this.index = index;
};

RadioInput.prototype = {
    toString: function() {
        var label_for;
        if (typeof(this.attrs.id) != 'undefined') {
            label_for = ' for="' + this.attrs.id + "_" + this.index + '"';
        }
        else {
            label_for = '';
        }
        var choice_label = util.conditional_escape(this.choice_label);
        return djang10.mark_safe(util.simplePythonFormat('<label%s>%s %s</label>', label_for, this.tag(), choice_label));
    },

    is_checked: function() {
        return this.value == this.choice_value;
    },

    tag: function() {
        if (typeof(this.attrs.id) != 'undefined') {
            this.attrs.id += "_" + this.index;
        }
        var final_attrs = this.attrs.merge({type:'radio', name: this.name, value: this.choice_value});
        if (this.is_checked()) {
            final_attrs['checked'] = 'checked';
        }
        return djang10.mark_safe('<input ' + util.flatatt(final_attrs) + ' />');
    }
};

var RadioFieldRenderer = widgets.RadioFieldRenderer = function(name, value, attrs, choices) {
    this.name = name;
    this.value = value;
    this.attrs = attrs;
    this.choices = choices;
};

RadioFieldRenderer.prototype = {
    toString: function() {
        return this.render();
    },

    render: function() {
        var inner = "";
        var inputs = this.radio_inputs;
        for (var i in inputs) {
            inner += '<li>' + inputs[i].toString() + '</li>\n';
        }
        return djang10.mark_safe('<ul>\n' + inner + '</ul>');
    }
}

RadioFieldRenderer.prototype.__defineGetter__("radio_inputs", function() {
    var ris = [];
    var k = 0;
    for (var i in this.choices) {
        var attrs_copy = {};
        for (var j in this.attrs) {
            attrs_copy[j] = this.attrs[j];
        }
        ris.push(new RadioInput(this.name, this.value, attrs_copy, [i, this.choices[i]], k));
        k++;
    }
    return ris;
});

var RadioSelect = widgets.RadioSelect = function(attrs, choices, renderer) {
    if (typeof(renderer) != 'undefined') {
        this.renderer = renderer;
    }
    Select.call(this, attrs, choices);
};

RadioSelect.prototype = {
    __proto__: Select.prototype,

    renderer: RadioFieldRenderer,

    get_renderer: function(name, value, attrs, choices) {
        if (value == null) {
            value = '';
        }
        var str_value = value.toString();
        var final_attrs = this.build_attrs(attrs);
        choices = this.choices.merge(choices || {});
        return new this.renderer(name, str_value, final_attrs, choices);
    },

    render: function(name, value, attrs, choices) {
        return this.get_renderer(name, value, attrs, choices).render();
    },

    id_for_label: function(id_) {
        if (id_) {
            id_ += '_0';
        }
        return id_;
    }
};

var CheckboxSelectMultiple = widgets.CheckboxSelectMultiple = function() {
    SelectMultiple.apply(this, arguments);
};

CheckboxSelectMultiple.prototype = {
    __proto__: SelectMultiple.prototype,

    render: function(name, value, attrs, choices) {
        if (value == null) {
            value = "";
        }
        var has_id = util.bool(attrs && attrs['id']);

        var final_attrs = this.build_attrs(attrs, {name: name});

        var output = '<ul>\n';
        for (var j in value) {
            value[j] = value[j].toString();
        }
        choices = this.choices.merge(choices || {});
        var i = 0;
        for (var option_value in choices) {
            var option_label = choices[option_value];
            var label_for;

            if (has_id) {
                final_attrs['id'] = attrs['id'] + '_' + i;
                label_for = ' for="' + final_attrs['id'] + '"';
            }
            else {
                label_for = '';
            }

            var cb = new CheckboxInput(final_attrs, function(val) {return (value.indexOf(val) != -1)});
            option_value = option_value.toString();
            var rendered_cb = cb.render(name, option_value);
            option_label = util.conditional_escape(option_label);
            output += util.simplePythonFormat('<li><label%s>%s %s</label></li>\n', label_for, rendered_cb, option_label);

            i++;
        }
        output += '</ul>';
        return djang10.mark_safe(output);
    },

    id_for_label: function(id_) {
        if (id_)
            id_ += '_0';
        return id_;
    }
}

var MultiWidget = widgets.MultiWidget = function(widgets, attrs) {
    for (var i in widgets) {
        if (widgets[i] instanceof Function) {
            widgets[i] = new widgets[i]();
        }
    }
    this.widgets = widgets;

    Widget.call(this, attrs);
};

MultiWidget.prototype = {
    __proto__: Widget.prototype,

    render: function(name, value, attrs) {
        if (!(value instanceof Array)) {
            value = this.decompress(value);
        }
        var output = [];
        var final_attrs = this.build_attrs(attrs);
        var id_ = final_attrs['id'];
        var i = 0;
        for (widget in this.widgets) {
            var widget_value = value[i];

            if (id_) {
                final_attrs['id'] = id_ + '_' + i;
            }

            output.push(this.widgets[widget].render(name + '_' + i, widget_value, final_attrs));

            i++;
        }
        return djang10.mark_safe(this.format_output(output));
    },

    value_from_datadict: function(data, files, name) {
        var vals = [];
        var i = 0;
        for (var w in this.widgets) {
            vals.push(this.widgets[w].value_from_datadict(data, files, name + '_' + i));
            i++;
        }
        return vals;
    },

    _has_changed: function(initial, data) {
        if (initial == null) {
            initial = [];
            for (var x = 0; x < data.length; x++) {
                initial.push('');
            }
        } else {
            initial = this.decompress(initial);
        }

        for (var x = 0; x < data.length; x++) {
            if (this.widgets[x]._has_changed(initial[x], data[x])) {
                return true;
            }
        }
        return false;
    },

    format_output: function(rendered_widgets) {
        var output = '';
        for (var i in rendered_widgets) {
            output += rendered_widgets[i];
        }
        return output;
    },

    decompress: function(value) {
        throw util.NotImplementedError('Subclasses must implement this method.');
    },

    id_for_label: function(id_) {
        if (id_)
            id_ += '_0';
        return id_;
    }
}

MultiWidget.prototype.__defineGetter__('media', function() {
    /*
        TODO implement Media
    */
    throw new util.NotImplementedError('TODO: implement media');
});

var SplitDateTimeWidget = widgets.SplitDateTimeWidget = function(attrs) {
    var widgets = [new TextInput(attrs), new TextInput(attrs)];
    MultiWidget.call(this, widgets, attrs);
};

SplitDateTimeWidget.prototype = {
    __proto__: MultiWidget.prototype,

    decompress: function(value) {
        if (value) {
            return [value.strftime("%Y-%d-%m"), value.strftime("%H:%M:%S")];
        }
        return [null, null];
    }
}

var DateTimeInput = widgets.DateTimeInput = function(attrs, format) {
    Input.call(this);

    if (format) {
        this.format = format;
    }
};

DateTimeInput.prototype = {
    __proto__: Input.prototype,

    input_type: 'text',
    format: '%Y-%m-%d %H:%M:%S',

    render: function(name, value, attrs) {
        if (value == null) {
            value = '';
        }
        else if (value['strftime']) {
            value = value.strftime(this.format);
        }

        return Input.render.call(this, name, value, attrs);
    }
};

return widgets;
