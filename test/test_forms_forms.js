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

core.modules.djang10.forms.forms();
core.modules.djang10.forms.fields();
core.modules.djang10.forms.widgets();
core.modules.djang10.test.test();
core.modules.djang10.forms.util();

var Person = function(params) {
    this.first_name = new fields.CharField();
    this.last_name = new fields.CharField();
    
    forms.Form.call(this, params);
};

Person.prototype.__proto__ = forms.Form.prototype;

var p = new Person({data: {'first_name': 'John', 'last_name': 'Lennon'}});
assert(p.is_bound == true);
assert(Object.isEmpty(p.errors.dict));
assert(p.is_valid() == true);
assert(p.errors.as_ul() == '');
assert(p.errors.as_text() == '');
assert(p.cleaned_data.first_name == 'John');
assert(p.cleaned_data.last_name == 'Lennon');
assert(p.get_bound_field('first_name').toString() == '<input type="text" name="first_name" id="id_first_name" value="John" />');
assert(p.get_bound_field('last_name').toString() == '<input type="text" name="last_name" id="id_last_name" value="Lennon" />');
test.assertThrows(new util.Error("Field nonexistant not found in Form."), p, forms.Form.get_bound_field, 'nonexistant');
assert(p.toString() == '<tr><th><label for="id_first_name">First name:</label></th><td><input type="text" name="first_name" id="id_first_name" value="John" /></td></tr>\n<tr><th><label for="id_last_name">Last name:</label></th><td><input type="text" name="last_name" id="id_last_name" value="Lennon" /></td></tr>\n');
assert(p.toString() == '<tr><th><label for="id_first_name">First name:</label></th><td><input type="text" name="first_name" id="id_first_name" value="John" /></td></tr>\n<tr><th><label for="id_last_name">Last name:</label></th><td><input type="text" name="last_name" id="id_last_name" value="Lennon" /></td></tr>\n');

var p = new Person({data: {}});
assert(p.is_bound);
assert(!p.is_valid());
assert(p.errors.dict['first_name'].toString() == '<ul class="errorlist"><li>This field is required.</li></ul>');
assert(p.errors.dict['last_name'].toString() == '<ul class="errorlist"><li>This field is required.</li></ul>');
assert(typeof(p.cleaned_data) == 'undefined');
assert(p.toString() == '<tr><th><label for="id_first_name">First name:</label></th><td><ul class="errorlist"><li>This field is required.</li></ul><input type="text" name="first_name" id="id_first_name" /></td></tr>\n<tr><th><label for="id_last_name">Last name:</label></th><td><ul class="errorlist"><li>This field is required.</li></ul><input type="text" name="last_name" id="id_last_name" /></td></tr>\n');
assert(p.as_table() == p.toString());
assert(p.as_ul() == '<li><ul class="errorlist"><li>This field is required.</li></ul><label for="id_first_name">First name:</label> <input type="text" name="first_name" id="id_first_name" /></li>\n<li><ul class="errorlist"><li>This field is required.</li></ul><label for="id_last_name">Last name:</label> <input type="text" name="last_name" id="id_last_name" /></li>\n');
assert(p.as_p() == '<ul class="errorlist"><li>This field is required.</li></ul>\n<p><label for="id_first_name">First name:</label> <input type="text" name="first_name" id="id_first_name" /></p>\n<ul class="errorlist"><li>This field is required.</li></ul>\n<p><label for="id_last_name">Last name:</label> <input type="text" name="last_name" id="id_last_name" /></p>\n');

var p = new Person();
assert(!p.is_bound);
assert(Object.isEmpty(p.errors.dict));
assert(!p.is_valid());
assert(typeof(p.cleaned_data) == 'undefined');
assert(p.toString() == '<tr><th><label for="id_first_name">First name:</label></th><td><input type="text" name="first_name" id="id_first_name" /></td></tr>\n<tr><th><label for="id_last_name">Last name:</label></th><td><input type="text" name="last_name" id="id_last_name" /></td></tr>\n');
assert(p.toString() == p.as_table());
assert(p.as_ul() == '<li><label for="id_first_name">First name:</label> <input type="text" name="first_name" id="id_first_name" /></li>\n<li><label for="id_last_name">Last name:</label> <input type="text" name="last_name" id="id_last_name" /></li>\n');
assert(p.as_p() == '<p><label for="id_first_name">First name:</label> <input type="text" name="first_name" id="id_first_name" /></p>\n<p><label for="id_last_name">Last name:</label> <input type="text" name="last_name" id="id_last_name" /></p>\n');

var p = new Person({data: {'last_name': 'Lennon'}});
assert(p.errors.dict['first_name'].toString() == '<ul class="errorlist"><li>This field is required.</li></ul>');
assert(!p.is_valid());
assert(p.errors.as_ul() == '<ul class="errorlist"><li>first_name<ul class="errorlist"><li>This field is required.</li></ul></li></ul>');
assert(p.errors.as_text() == '* first_name\n  * This field is required.\n');
assert(typeof(p.cleaned_data) == 'undefined');
assert(p.get_bound_field('first_name').errors.toString() == '<ul class="errorlist"><li>This field is required.</li></ul>');
assert(p.get_bound_field('first_name').errors.as_text() == '* This field is required.\n');

var p = new Person();
assert(p.get_bound_field('first_name').toString() == '<input type="text" name="first_name" id="id_first_name" />');
assert(p.get_bound_field('last_name').toString() == '<input type="text" name="last_name" id="id_last_name" />');

var data = {'first_name': 'John', 'extra': 'hello', 'last_name': 'Lennon'};
var p = new Person({data: data});
assert(p.is_valid());
assert(p.cleaned_data.first_name == 'John');
assert(p.cleaned_data.last_name == 'Lennon');

var OptionalPersonForm = function() {
    this.first_name = new fields.CharField();
    this.last_name = new fields.CharField();
    this.nick_name = new fields.CharField({required: false});
    
    forms.Form.apply(this, arguments);
};

OptionalPersonForm.prototype.__proto__ = forms.Form.prototype;

var data = {'first_name': 'John', 'last_name': 'Lennon'};
var f = new OptionalPersonForm({data: data});
assert(f.is_valid());
assert(f.cleaned_data['nick_name'] == '');
assert(f.cleaned_data['first_name'] == 'John');
assert(f.cleaned_data['last_name'] == 'Lennon');

var p = new Person({auto_id: '%s_id'});
assert(p.as_table() == '<tr><th><label for="first_name_id">First name:</label></th><td><input type="text" name="first_name" id="first_name_id" /></td></tr>\n<tr><th><label for="last_name_id">Last name:</label></th><td><input type="text" name="last_name" id="last_name_id" /></td></tr>\n');
assert(p.as_ul() == '<li><label for="first_name_id">First name:</label> <input type="text" name="first_name" id="first_name_id" /></li>\n<li><label for="last_name_id">Last name:</label> <input type="text" name="last_name" id="last_name_id" /></li>\n');
assert(p.as_p() == '<p><label for="first_name_id">First name:</label> <input type="text" name="first_name" id="first_name_id" /></p>\n<p><label for="last_name_id">Last name:</label> <input type="text" name="last_name" id="last_name_id" /></p>\n');

var p = new Person({auto_id: true});
assert(p.as_ul() == '<li><label for="first_name">First name:</label> <input type="text" name="first_name" id="first_name" /></li>\n<li><label for="last_name">Last name:</label> <input type="text" name="last_name" id="last_name" /></li>\n');

var p = new Person({auto_id: false});
assert(p.as_ul() == '<li>First name: <input type="text" name="first_name" /></li>\n<li>Last name: <input type="text" name="last_name" /></li>\n');

var PersonNew = function() {
    this.first_name = new fields.CharField({widget: new widgets.TextInput({'id': 'first_name_id'})});
    this.last_name = new fields.CharField();
    
    forms.Form.apply(this, arguments);
};

PersonNew.prototype.__proto__ = forms.Form.prototype;

var p = new PersonNew({auto_id: false});
assert(p.as_ul() == '<li><label for="first_name_id">First name:</label> <input id="first_name_id" type="text" name="first_name" /></li>\n<li>Last name: <input type="text" name="last_name" /></li>\n');

var p = new PersonNew({auto_id: true});
assert(p.as_ul() == '<li><label for="first_name_id">First name:</label> <input id="first_name_id" type="text" name="first_name" /></li>\n<li><label for="last_name">Last name:</label> <input type="text" name="last_name" id="last_name" /></li>\n');

var SignupForm = function() {
    this.email = new fields.EmailField();
    this.get_spam = new fields.BooleanField();
    
    forms.Form.apply(this, arguments)
};

SignupForm.prototype.__proto__ = forms.Form.prototype;

var f = new SignupForm({auto_id: false});
assert(f.get_bound_field('email').toString() === '<input type="text" name="email" />');
assert(f.get_bound_field('get_spam').toString() === '<input type="checkbox" name="get_spam" />');

var f = new SignupForm({data: {'email': 'test@example.com', 'get_spam': true}, auto_id: false});
assert(f.get_bound_field('email').toString() === '<input type="text" name="email" value="test@example.com" />');
assert(f.get_bound_field('get_spam').toString() === '<input type="checkbox" name="get_spam" checked="checked" />');

var ContactForm = function() {
    this.subject = new fields.CharField();
    this.message = new fields.CharField({widget: widgets.Textarea});
    
    forms.Form.apply(this, arguments);
};

ContactForm.prototype.__proto__ = forms.Form.prototype;

var f = new ContactForm({auto_id: false});
assert(f.get_bound_field('subject').toString() === '<input type="text" name="subject" />');
assert(f.get_bound_field('message').toString() === '<textarea rows="10" cols="40" name="message"></textarea>');
assert(f.get_bound_field('subject').as_textarea() === '<textarea rows="10" cols="40" name="subject"></textarea>');
assert(f.get_bound_field('message').as_text() === '<input type="text" name="message" />');
assert(f.get_bound_field('message').as_hidden() === '<input type="hidden" name="message" />');

var ContactForm = function() {
    this.subject = new fields.CharField();
    this.message = new fields.CharField({widget: new widgets.Textarea({'rows': 80, 'cols': 20})});
    
    forms.Form.apply(this, arguments);
};

ContactForm.prototype.__proto__ = forms.Form.prototype;

var f = new ContactForm({auto_id: false});
assert(f.get_bound_field('message').toString() === '<textarea rows="80" cols="20" name="message"></textarea>');

//instance level attrs don't carry over to as_textarea, as_text and as_hidden
assert(f.get_bound_field('message').as_text() === '<input type="text" name="message" />');
var f = new ContactForm({data: {'subject': 'Hello', 'message': 'I love you.'}, auto_id: false});
assert(f.get_bound_field('subject').as_textarea() === '<textarea rows="10" cols="40" name="subject">Hello</textarea>');
assert(f.get_bound_field('message').as_text() === '<input type="text" name="message" value="I love you." />');
assert(f.get_bound_field('message').as_hidden() === '<input type="hidden" name="message" value="I love you." />');

var FrameworkForm = function() {
    this.name = new fields.CharField();
    this.language = new fields.ChoiceField({choices: {'P': 'Python', 'J': 'Java'}});

    forms.Form.apply(this, arguments);
};
FrameworkForm.prototype.__proto__ = forms.Form.prototype;

var f = new FrameworkForm({auto_id: false});
assert(f.get_bound_field('language').toString() === '<select name="language">\n<option value="P">Python</option>\n<option value="J">Java</option>\n</select>');

var f = new FrameworkForm({data: {'name': 'Django', 'language': 'P'}, auto_id: false});
assert(f.get_bound_field('language').toString() === '<select name="language">\n<option value="P" selected="selected">Python</option>\n<option value="J">Java</option>\n</select>');

var FrameworkForm = function() {
    this.name = new fields.CharField();
    this.language = new fields.ChoiceField({choices: {'': '------', 'P': 'Python', 'J': 'Java'}});

    forms.Form.apply(this, arguments);
};
FrameworkForm.prototype.__proto__ = forms.Form.prototype;

var f = new FrameworkForm({auto_id: false});
assert(f.get_bound_field('language').toString() === '<select name="language">\n<option value="" selected="selected">------</option>\n<option value="P">Python</option>\n<option value="J">Java</option>\n</select>');
