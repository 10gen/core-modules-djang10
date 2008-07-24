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
core.modules.djang10.forms.fields();
core.modules.djang10.forms.util();

forms = {};

var Form = forms.Form = function(params) {
    params = {
        data: {},
        files: {},
        auto_id: "id_%s",
        prefix: null,
        initial: {},
        error_class: util.ErrorList,
        label_suffix: ':',
        empty_permitted: false
    }.merge(params || {});
    
    this._errors = null;
    this._changed_data = null;
    
    //find all the fields
    this.fields = {};
    for (var key in this) {
        if (Object.instanceOf(this[key], fields.Field)) 
            fields[key] = this[key];
    }
    
    //init instance variables
    Object.extend(this, params);

    this.is_bound = !Object.isEmpty(params.data) || !Object.isEmpty(params.files);
};

Form.NON_FIELD_ERRORS = "__NON_FIELD_ERRORS_KEY__";

Form.prototype = {
    is_valid: function() {
        return this.is_bound && Object.isEmpty(this.errors);
    },
    
    add_prefix: function(field_name) {
        return (this.prefix) ? self.prefix + "-" + field_name : field_name;
    },
    
    _html_output: function(normal_row, error_row, row_ender, help_text_html, errors_on_separate_row) {
        var top_errors = this.non_field_errors();
        
        output = [];
        hidden_fields = [];
        
        for (var name in this.fields) {
            var field = this.fields[name];
            
            var bf = new BoundField(this, field, name);
            var bf_errors = new this.error_class(bf.errors);
            
            if (bf.is_hidden) {
                for (var i = 0; i < bf_errors.list.length; i++) {
                    top_errors.extend(['(Hidden field ' + name + ') ' + bf_errors.list[i]]);
                }
                hidden_fields.push(bf.toString());
            }
            else {
                if (errors_on_separate_row && bf_errors.list.length) {
                    output.push(util.simplePythonFormat(error_row, bf_errors.toString()));
                }
                var label;
                if (bf.label) {
                    label = content.HTML.escape(bf.label);
                    if (this.label_suffix) {
                        // If the last character of label is not punctuation
                        if (":?.!".indexOf(label.charAt(label.length - 1)) == -1) {
                            label += this.label_suffix
                        }
                    }
                    label = bf.label_tag(label) || '';
                }
                else {
                    label = '';
                }
                var help_text;
                if (field.help_text) {
                    help_text = util.simplePythonFormat(help_text_html, field.help_text.toString());
                }
                else {
                    help_text = '';
                }
                output.push(util.simplePythonFormat(normal_row, {'errors': bf_errors.toString(), 
                        'label': label, 'field': bf.toString(), 'help_text': help_text}));
            }
        }
        if (top_errors.list.length) {
            output.unshift(util.simplePythonFormat(error_row, top_errors.toString()));
        }
        if (hidden_fields.length) {
            var str_hidden = "";
            for (var i = 0; i < hidden_fields.length; i++) {
                str_hidden += hidden_fields[i];
            }
            if (output.length) {
                var last_row = output.pop();
                output.push(last_row.substring(0, last_row.length - row_ender.length) + str_hidden + row_ender);
            }
            else {
                output.push(str_hidden);
            }
        }
        var rows = "";
        for (var line = 0; line < output.length; line++) {
            rows += output[line] + "\n";
        }
        return rows;
    },
    
    non_field_errors: function() {
        return this.errors[this.NON_FIELD_ERRORS] || new this.error_class();
    },
    
    full_clean: function() {
        this._errors = {};
        this.cleaned_data = {};
        
        if(!this.is_bound)
            return;
        
        //process all the fields
        for(var fieldKey in this.fields) {
            var field = this.fields[fieldKey];
            
            try {
                var value = field.widget.value_from_datadict(this.data, this.files, fieldKey);
            
                //TODO: special case FileField
                this.cleaned_data[fieldKey] = value;
            } catch(e if Object.instanceOf(e, ValidationError)) {
                this._errors[fName] = e.message;
            }
        }
        
        //callback
        try {
            this.cleaned_data = this.clean();
        } catch(e if Object.instanceOf(e, ValidationError)) {
            this._errors[ValidationError.NON_FIELD_ERRORS] = e.message;
        }
        
        if(!Object.isEmpty(this._errors)) {
            this.cleaned_data = null;
        }
    },
    
    clean: function() {
        return this.cleaned_data;
    }
};

Form.prototype.__defineGetter__("errors", function() {
    if (this._errors == null)
        this.full_clean();
    return this._errors;
});

Form.prototype.__defineGetter__("changed_data", function() {
    if (this._changed_data == null) {
        this._changed_data = [];
        for (var name in this.fields) {
           var field = this.fields[name];
           var prefixed_name = this.add_prefix(name);
           var data_value = field.widget.value_fram_datadict(this.data, this.files, prefixed_name);
           var initial_value = (this.initial.containsKey(name)) ? this.initial[name] : field.initial;
           if (field.widget._has_changed(initial_value, data_value)) {
               this._changed_data.push(name)
           }
        } 
    }
    return this._changed_data;
});

// A field plus data
var BoundField = forms.BoundField = function(form, field, name) {
    this.form = form;
    this.field = field;
    this.name = name;
    this.html_name = form.add_prefix(name);
    
    this.label = field.label || pretty_name(name);
    this.help_text = field.help_text || '';
};

BoundField.prototype = {
    toString: function() {
        return this.as_widget();
    },

    as_widget: function(widget, attrs) {
        widget = widget || this.field.widget;
        attrs = attrs || {};
        var auto_id = this.auto_id;
        if (auto_id && !attrs.id && !widget.attrs.id) {
            attrs.id = auto_id;
        }
        
        var data;
        if (!this.form.is_bound) {
            data = this.form.initial.containsKey(this.name) ? this.form.initial[this.name] : this.field.initial;
            if (data instanceof Function) {
                data = data();
            }
        }
        else {
            data = this.data;
        }
        return widget.render(this.html_name, data, attrs);
    },
    
    as_text: function(attrs) {
        return this.as_widget(new widgets.TextInput(), attrs);
    },
    
    as_textarea: function(attrs) {
        return this.as_widget(new widgets.Textarea(), attrs);
    },
    
    as_hidden: function(attrs) {
        return this.as_widget(new this.field.hidden_widget(), attrs);
    },
    
    label_tag: function(contents, attrs) {
        contents = contents || content.HTML.escape(this.label);
        var widget = this.field.widget;
        var id = widget.attrs.id || this.auto_id;
        if (id) {
            attrs = (attrs) ? util.flatatt(attrs) : '';
            contents = util.simplePythonFormat('<label for="%s"%s>%s</label', widget.id_for_label(id), attrs, contents);
        }
        return contents;
    }
};

BoundField.prototype.__defineGetter__("errors", function() {
    return this.form.errors[this.name] || new this.form.error_class();
});

BoundField.prototype.__defineGetter__("data", function() {
    return this.field.widget.value_from_datadict(this.form.data, this.form.files, this.html_names);
});

BoundField.prototype.__defineGetter__("is_hidden", function() {
    return this.field.widget.is_hidden;
});

BoundField.prototype.__defineGetter__("auto_id", function() {
    auto_id = this.form.auto_id;
    if (auto_id && /%s/.test(auto_id))
        return util.simplePythonFormat(auto_id, this.html_name);
    else if (auto_id)
        return this.html_name;
    return '';
});

var pretty_name = function(name) {
    name = name.charAt(0).toUpperCase() + name.substring(1);
    return name.replace(/_/g, " ");
};

return forms;
