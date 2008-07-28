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
        return data[name];
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
        
        if (value != '' && value != null) 
            attrs["value"] = value;
        
        return '<input ' + util.flatatt(attrs) + ' />';
    }
};

//TextInput --------------------------------------
var TextInput = widgets.TextInput = function(attrs) {
    Input.call(this, attrs);
};

TextInput.prototype = {
    __proto__ : Input.prototype,

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
        return util.simplePythonFormat('<textarea %s>%s</textarea>', 
                util.flatatt(final_attrs), content.HTML.escape(value));
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
        return out;
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
        return files[name];
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
        if (value !== '' && value !== true && value !== false && value !== null) {
            final_attrs['value'] = value.toString();
        }
        return "<input " + util.flatatt(final_attrs) + " />";
    },
    
    value_from_datadict: function(data, files, name) {
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
        return output;
    },
    
    render_options: function(choices, selected_choices) {
        var render_option = function(option_value, option_label) {
            option_value = option_value.toString();
            var selected_html = (selected_choices.indexOf(option_value) > -1) ? ' selected="selected"' : '';
            return util.simplePythonFormat('<option value="%s"%s>%s</option>', 
                    content.HTML.escape(option_value), selected_html, content.HTML.escape(option_label));
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
        switch (value) {
            case true:
            case '2':
                value = '2';
                break;
            case false:
            case '3':
                value = '3';
                break;
            default:
                value = '1';
                break;
        }
        return Select.render.call(this, name, value, attrs || null, choices || {});
    },
    
    value_from_datadict: function(data, files, name) {
        var value = data[name];
        
        switch (value) {
            case true:
            case '2':
                return '2';
            case false:
            case '3':
                return '3';
            default:
                return '1';
        }
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
        return output;
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
    this.choice_label = choice[1].toString();
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
        var choice_label = content.HTML.escape(this.choice_label);
        return util.simplePythonFormat('<label%s>%s %s</label>', label_for, this.tag(), choice_label);
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
        return '<input ' + util.flatatt(final_attrs) + ' />';
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
        return '<ul>\n' + inner + '</ul>';
    }
}

RadioFieldRenderer.prototype.__defineGetter__("radio_inputs", function() {
    var ris = [];
    for (var i in this.choices) {
        var attrs_copy = {};
        for (var j in this.attrs) {
            attrs_copy[j] = this.attrs[j];
        }
        ris.push(new RadioInput(this.name, this.value, attrs_copy, [i, this.choices[i]], i));
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
    }
};

RadioSelect.id_for_label = function(id_) {
    if (id_) {
        id_ += '_0';
    }
    return id_;
};

/*
    TODO implement the rest of the widgets
*/

return widgets;
