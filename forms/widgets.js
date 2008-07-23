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
    Input.call(this, attrs);
};

Textarea.prototype = {
    __proto__: Input.prototype,
    
    render: function(name, value, attrs) {
        if (value == null)
            value = '';
        var final_attrs = this.build_attrs(attrs, {name: name});
        return util.simplePythonFormat('<textarea %s>%s</textarea>', 
                util.flatatt(final_attrs), content.HTML.escape(value));
    }
}

/*
    TODO implement the rest of the widgets
*/

return widgets;
