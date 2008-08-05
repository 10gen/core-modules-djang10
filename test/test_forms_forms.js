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

var FrameworkForm = function() {
    this.name = new fields.CharField();
    this.language = new fields.ChoiceField({choices: {'P': 'Python', 'J': 'Java'}, widget: new widgets.Select({'class': 'foo'})});

    forms.Form.apply(this, arguments);
};
FrameworkForm.prototype.__proto__ = forms.Form.prototype;

var f = new FrameworkForm({auto_id: false});
assert(f.get_bound_field('language').toString() === '<select class="foo" name="language">\n<option value="P">Python</option>\n<option value="J">Java</option>\n</select>');

var f = new FrameworkForm({data: {'name': 'Django', 'language': 'P'}, auto_id: false});
assert(f.get_bound_field('language').toString() === '<select class="foo" name="language">\n<option value="P" selected="selected">Python</option>\n<option value="J">Java</option>\n</select>');

// When passing a custom widget instance to ChoiceField, note that setting
// 'choices' on the widget is meaningless. The widget will use the choices
//	defined on the Field, not the ones defined on the Widget.

var FrameworkForm = function() {
    this.name = new fields.CharField();
    this.language = new fields.ChoiceField({choices: {'P': 'Python', 'J': 'Java'}, widget: new widgets.Select({'class': 'foo'}, {'R': 'Ruby', 'P': 'Perl'})});

    forms.Form.apply(this, arguments);
};
FrameworkForm.prototype.__proto__ = forms.Form.prototype;

var f = new FrameworkForm({auto_id: false});
assert(f.get_bound_field('language').toString() === '<select class="foo" name="language">\n<option value="P">Python</option>\n<option value="J">Java</option>\n</select>');

var f = new FrameworkForm({data: {'name': 'Django', 'language': 'P'}, auto_id: false});
assert(f.get_bound_field('language').toString() === '<select class="foo" name="language">\n<option value="P" selected="selected">Python</option>\n<option value="J">Java</option>\n</select>');

// set choices after the fact
var FrameworkForm = function() {
    this.name = new fields.CharField();
    this.language = new fields.ChoiceField();

    forms.Form.apply(this, arguments);
};
FrameworkForm.prototype.__proto__ = forms.Form.prototype;

var f = new FrameworkForm({auto_id: false});
assert(f.get_bound_field('language').toString() === '<select name="language">\n</select>');
f.fields['language'].choices = {'P': 'Python', 'J': 'Java'};
assert(f.get_bound_field('language').toString() === '<select name="language">\n<option value="P">Python</option>\n<option value="J">Java</option>\n</select>');

var FrameworkForm = function() {
    this.name = new fields.CharField();
    this.language = new fields.ChoiceField({choices: {'P': 'Python', 'J': 'Java'}, widget: widgets.RadioSelect});

    forms.Form.apply(this, arguments);
};
FrameworkForm.prototype.__proto__ = forms.Form.prototype;

var f = new FrameworkForm({auto_id: false});
assert(f.get_bound_field('language').toString() === '<ul>\n<li><label><input type="radio" name="language" value="P" /> Python</label></li>\n<li><label><input type="radio" name="language" value="J" /> Java</label></li>\n</ul>');
assert(f.toString() === '<tr><th>Name:</th><td><input type="text" name="name" /></td></tr>\n<tr><th>Language:</th><td><ul>\n<li><label><input type="radio" name="language" value="P" /> Python</label></li>\n<li><label><input type="radio" name="language" value="J" /> Java</label></li>\n</ul></td></tr>\n');
assert(f.as_ul() === '<li>Name: <input type="text" name="name" /></li>\n<li>Language: <ul>\n<li><label><input type="radio" name="language" value="P" /> Python</label></li>\n<li><label><input type="radio" name="language" value="J" /> Java</label></li>\n</ul></li>\n');

var f = new FrameworkForm({auto_id: 'id_%s'});
assert(f.get_bound_field('language').toString() === '<ul>\n<li><label for="id_language_0"><input id="id_language_0" type="radio" name="language" value="P" /> Python</label></li>\n<li><label for="id_language_1"><input id="id_language_1" type="radio" name="language" value="J" /> Java</label></li>\n</ul>')
assert(f.toString() === '<tr><th><label for="id_name">Name:</label></th><td><input type="text" name="name" id="id_name" /></td></tr>\n<tr><th><label for="id_language_0">Language:</label></th><td><ul>\n<li><label for="id_language_0"><input id="id_language_0" type="radio" name="language" value="P" /> Python</label></li>\n<li><label for="id_language_1"><input id="id_language_1" type="radio" name="language" value="J" /> Java</label></li>\n</ul></td></tr>\n');
assert(f.as_ul() === '<li><label for="id_name">Name:</label> <input type="text" name="name" id="id_name" /></li>\n<li><label for="id_language_0">Language:</label> <ul>\n<li><label for="id_language_0"><input id="id_language_0" type="radio" name="language" value="P" /> Python</label></li>\n<li><label for="id_language_1"><input id="id_language_1" type="radio" name="language" value="J" /> Java</label></li>\n</ul></li>\n');
assert(f.as_p() === '<p><label for="id_name">Name:</label> <input type="text" name="name" id="id_name" /></p>\n<p><label for="id_language_0">Language:</label> <ul>\n<li><label for="id_language_0"><input id="id_language_0" type="radio" name="language" value="P" /> Python</label></li>\n<li><label for="id_language_1"><input id="id_language_1" type="radio" name="language" value="J" /> Java</label></li>\n</ul></p>\n');

var SongForm = function() {
    this.name = new fields.CharField();
    this.composers = new fields.MultipleChoiceField();
    
    forms.Form.apply(this, arguments);
};
SongForm.prototype.__proto__ = forms.Form.prototype;

var f = new SongForm({auto_id: false});
assert(f.get_bound_field('composers').toString() === '<select multiple="multiple" name="composers">\n</select>');

var SongForm = function() {
    this.name = new fields.CharField();
    this.composers = new fields.MultipleChoiceField({choices: {'J': 'John Lennon', 'P': 'Paul McCartney'}});
    
    forms.Form.apply(this, arguments);
};
SongForm.prototype.__proto__ = forms.Form.prototype;

var f = new SongForm({auto_id: false});
assert(f.get_bound_field('composers').toString() === '<select multiple="multiple" name="composers">\n<option value="J">John Lennon</option>\n<option value="P">Paul McCartney</option>\n</select>');

var f = new SongForm({data: {'name': 'Yesterday', 'composers': ['P']}, auto_id: False});
assert(f.get_bound_field('name').toString() === '<input type="text" name="name" value="Yesterday" />');
assert(f.get_bound_field('composers').toString() === '<select multiple="multiple" name="composers">\n<option value="J">John Lennon</option>\n<option value="P" selected="selected">Paul McCartney</option>\n</select>');

assert(f.get_bound_field('composers').as_hidden() === '<input type="hidden" name="composers" value="P" />\n');

var f = new SongForm({data: {'name': 'From Me To You', 'composers': ['P', 'J']}, auto_id: False});
assert(f.get_bound_field('composers').as_hidden() === '<input type="hidden" name="composers" value="P" />\n<input type="hidden" name="composers" value="J" />\n');

var SongForm = function() {
    this.name = new fields.CharField();
    this.composers = new fields.MultipleChoiceField({choices: {'J': 'John Lennon', 'P': 'Paul McCartney'}, widget: widgets.CheckboxSelectMultiple});
    
    forms.Form.apply(this, arguments);
};
SongForm.prototype.__proto__ = forms.Form.prototype;

var f = new SongForm({auto_id: false});
assert(f.get_bound_field('composers').toString() === '<ul>\n<li><label><input name="composers" type="checkbox" value="J" /> John Lennon</label></li>\n<li><label><input name="composers" type="checkbox" value="P" /> Paul McCartney</label></li>\n</ul>');

var f = new SongForm({data: {'composers': ['J']}, auto_id: false});
assert(f.get_bound_field('composers').toString() === '<ul>\n<li><label><input name="composers" type="checkbox" checked="checked" value="J" /> John Lennon</label></li>\n<li><label><input name="composers" type="checkbox" value="P" /> Paul McCartney</label></li>\n</ul>');

var f = new SongForm({data: {'composers': ['J', 'P']}, auto_id: false});
assert(f.get_bound_field('composers').toString() === '<ul>\n<li><label><input name="composers" type="checkbox" checked="checked" value="J" /> John Lennon</label></li>\n<li><label><input name="composers" type="checkbox" checked="checked" value="P" /> Paul McCartney</label></li>\n</ul>');

var f = new SongForm({auto_id: '%s_id'});
assert(f.get_bound_field('composers').toString() === '<ul>\n<li><label for="composers_id_0"><input name="composers" id="composers_id_0" type="checkbox" value="J" /> John Lennon</label></li>\n<li><label for="composers_id_1"><input name="composers" id="composers_id_1" type="checkbox" value="P" /> Paul McCartney</label></li>\n</ul>');

var f = new SongForm({data: {'name': 'Yesterday', 'composers': ['J', 'P']}});
assert(Object.isEmpty(f.errors.dict));

var SongFormHidden = function() {
    this.name = new fields.CharField();
    this.composers = new fields.MultipleChoiceField({choices: {'J': 'John Lennon', 'P': 'Paul McCartney'}, widget: widgets.MultipleHiddenInput});
    
    forms.Form.apply(this, arguments);
};
SongFormHidden.prototype.__proto__ = forms.Form.prototype;

var f = new SongFormHidden({data: {name: 'Yesterday', composers: ['J', 'P']}, auto_id: false});
assert(f.as_ul() === '<li>Name: <input type="text" name="name" value="Yesterday" /><input type="hidden" name="composers" value="J" />\n<input type="hidden" name="composers" value="P" />\n</li>\n')

var f = new SongFormHidden({data: {name: 'Yesterday'}, auto_id: false});
assert(f.errors.dict['composers'].list[0] == 'This field is required.');

var f = new SongFormHidden({data: {name: 'Yesterday', composers: ['J']}, auto_id: false});
assert(Object.isEmpty(f.errors.dict));
assert(f.cleaned_data['composers'][0] === 'J');
assert(f.cleaned_data['composers'].length === 1);
assert(f.cleaned_data['name'] === 'Yesterday');

var f = new SongFormHidden({data: {name: 'Yesterday', composers: ['J', 'P']}, auto_id: false});
assert(Object.isEmpty(f.errors.dict));
assert(f.cleaned_data['composers'][0] === 'J');
assert(f.cleaned_data['composers'][1] === 'P');
assert(f.cleaned_data['composers'].length === 2);
assert(f.cleaned_data['name'] === 'Yesterday');

var EscapingForm = function() {
    this.special_name = new fields.CharField();
    
    var that = this;
    this.clean_special_name = function() {
        throw new util.ValidationError("Something's wrong with '" + that.cleaned_data["special_name"] + "'")
    }
    
    forms.Form.apply(this, arguments);
};
EscapingForm.prototype = {
    __proto__: forms.Form.prototype,
};

var f = new EscapingForm({data: {'special_name': "Nothing to escape"}, auto_id: false});
assert(f.toString() === '<tr><th>Special name:</th><td><ul class="errorlist"><li>Something&#39;s wrong with &#39;Nothing to escape&#39;</li></ul><input type="text" name="special_name" value="Nothing to escape" /></td></tr>\n');

var f = new EscapingForm({data: {'special_name': "Should escape < & > and <script>alert('xss')</script>"}, auto_id: false});
assert(f.toString() === '<tr><th>Special name:</th><td><ul class="errorlist"><li>Something&#39;s wrong with &#39;Should escape &lt; &amp; &gt; and &lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;&#39;</li></ul><input type="text" name="special_name" value="Should escape &lt; &amp; &gt; and &lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;" /></td></tr>\n');

// Validating multiple fields in relation to another

//  There are a couple of ways to do multiple-field validation. If you want the
//	validation message to be associated with a particular field, implement the
//	clean_XXX() method on the Form, where XXX is the field name. As in
//	Field.clean(), the clean_XXX() method should return the cleaned value. In the
//	clean_XXX() method, you have access to self.cleaned_data, which is a dictionary
//	of all the data that has been cleaned *so far*, in order by the fields,
//	including the current field (e.g., the field XXX if you're in clean_XXX()).

var UserRegistration = function() {
    this.username = new fields.CharField({max_length: 10});
    this.password1 = new fields.CharField({widget: widgets.PasswordInput});
    this.password2 = new fields.CharField({widget: widgets.PasswordInput});
    var that = this;
    this.clean_password2 = function() {
        if (that.cleaned_data['password1'] && that.cleaned_data['password2'] && that.cleaned_data['password1'] !== that.cleaned_data['password2']) {
            throw new util.ValidationError('Please make sure your passwords match.');
        }
        return that.cleaned_data['password2'];
    };
    
    forms.Form.apply(this, arguments);
};
UserRegistration.prototype.__proto__ = forms.Form.prototype;

var f = new UserRegistration({auto_id: false});
assert(Object.isEmpty(f.errors.dict));

var f = new UserRegistration({data: {}, auto_id: false});
assert(f.errors.dict['username'].list[0] === 'This field is required.');
assert(f.errors.dict['password1'].list[0] === 'This field is required.');
assert(f.errors.dict['password2'].list[0] === 'This field is required.');

var f = new UserRegistration({data: {'username': 'mike', password1: 'foo', password2: 'bar'}, auto_id: false});
assert(f.errors.dict['password2'].list[0] === 'Please make sure your passwords match.');

var f = new UserRegistration({data: {'username': 'mike', password1: 'foo', password2: 'foo'}, auto_id: false});
assert(Object.isEmpty(f.errors.dict));
assert(f.cleaned_data.username === 'mike');
assert(f.cleaned_data.password1 === 'foo');
assert(f.cleaned_data.password2 === 'foo');

//  Another way of doing multiple-field validation is by implementing the
//	Form's clean() method. If you do this, any ValidationError raised by that
//	method will not be associated with a particular field; it will have a
//	special-case association with the field named '__all__'.
//	Note that in Form.clean(), you have access to self.cleaned_data, a dictionary of
//	all the fields/values that have *not* raised a ValidationError. Also note
//	Form.clean() is required to return a dictionary of all clean data.

var UserRegistration = function() {
    this.username = new fields.CharField({max_length: 10});
    this.password1 = new fields.CharField({widget: widgets.PasswordInput});
    this.password2 = new fields.CharField({widget: widgets.PasswordInput});
    var that = this;
    this.clean = function() {
        if (that.cleaned_data['password1'] && that.cleaned_data['password2'] && that.cleaned_data['password1'] !== that.cleaned_data['password2']) {
            throw new util.ValidationError('Please make sure your passwords match.');
        }
        return that.cleaned_data;
    };
    
    forms.Form.apply(this, arguments);
};
UserRegistration.prototype.__proto__ = forms.Form.prototype;

var f = new UserRegistration({auto_id: false});
assert(Object.isEmpty(f.errors.dict));

var f = new UserRegistration({data: {}, auto_id: false});
assert(f.as_table() === '<tr><th>Username:</th><td><ul class="errorlist"><li>This field is required.</li></ul><input maxlength="10" type="text" name="username" /></td></tr>\n<tr><th>Password1:</th><td><ul class="errorlist"><li>This field is required.</li></ul><input type="password" name="password1" /></td></tr>\n<tr><th>Password2:</th><td><ul class="errorlist"><li>This field is required.</li></ul><input type="password" name="password2" /></td></tr>\n');
assert(f.errors.dict['username'].list[0] === 'This field is required.');
assert(f.errors.dict['password1'].list[0] === 'This field is required.');
assert(f.errors.dict['password2'].list[0] === 'This field is required.');

var f = new UserRegistration({data: {'username': 'mike', password1: 'foo', password2: 'bar'}, auto_id: false});
assert(f.errors.dict['__all__'].list[0] === 'Please make sure your passwords match.');
assert(f.as_table() === '<tr><td colspan="2"><ul class="errorlist"><li>Please make sure your passwords match.</li></ul></td></tr>\n<tr><th>Username:</th><td><input maxlength="10" type="text" name="username" value="mike" /></td></tr>\n<tr><th>Password1:</th><td><input type="password" name="password1" value="foo" /></td></tr>\n<tr><th>Password2:</th><td><input type="password" name="password2" value="bar" /></td></tr>\n');
assert(f.as_ul() === '<li><ul class="errorlist"><li>Please make sure your passwords match.</li></ul></li>\n<li>Username: <input maxlength="10" type="text" name="username" value="mike" /></li>\n<li>Password1: <input type="password" name="password1" value="foo" /></li>\n<li>Password2: <input type="password" name="password2" value="bar" /></li>\n');

var f = new UserRegistration({data: {'username': 'mike', 'password1': 'foo', 'password2': 'foo'}, auto_id: false});
assert(Object.isEmpty(f.errors.dict));
assert(f.cleaned_data.username === 'mike');
assert(f.cleaned_data.password1 === 'foo');
assert(f.cleaned_data.password2 === 'foo');

// Dynamic construction

var Person = function() {
    this.first_name = new fields.CharField();
    this.last_name = new fields.CharField();
    
    forms.Form.apply(this, arguments);
    
    this.fields['birthday'] = new fields.DateField();
};
Person.prototype.__proto__ = forms.Form.prototype;

var p = new Person({auto_id: false});
assert(p.toString() === '<tr><th>First name:</th><td><input type="text" name="first_name" /></td></tr>\n<tr><th>Last name:</th><td><input type="text" name="last_name" /></td></tr>\n<tr><th>Birthday:</th><td><input type="text" name="birthday" /></td></tr>\n')

var MyForm = function(params, field_list) {
    forms.Form.apply(this, [params.merge({auto_id: false})]);
    
    for (var k in field_list) {
        this.fields[k] = field_list[k];
    }
};
MyForm.prototype.__proto__ = forms.Form.prototype;

var myform = new MyForm({}, {'field1': new fields.CharField(), 'field2': new fields.CharField()});
assert(myform.toString() === '<tr><th>Field1:</th><td><input type="text" name="field1" /></td></tr>\n<tr><th>Field2:</th><td><input type="text" name="field2" /></td></tr>\n');

var myform = new MyForm({}, {'field3': new fields.CharField(), 'field4': new fields.CharField()});
assert(myform.toString() === '<tr><th>Field3:</th><td><input type="text" name="field3" /></td></tr>\n<tr><th>Field4:</th><td><input type="text" name="field4" /></td></tr>\n');

var MyForm = function(params, field_list) {
    this.default_field_1 = new fields.CharField();
    this.default_field_2 = new fields.CharField();
    forms.Form.apply(this, [params.merge({auto_id: false})]);
    
    for (var k in field_list) {
        this.fields[k] = field_list[k];
    }
};
MyForm.prototype.__proto__ = forms.Form.prototype;

var myform = new MyForm({}, {'field1': new fields.CharField(), 'field2': new fields.CharField()});
assert(myform.toString() === '<tr><th>Default field 1:</th><td><input type="text" name="default_field_1" /></td></tr>\n<tr><th>Default field 2:</th><td><input type="text" name="default_field_2" /></td></tr>\n<tr><th>Field1:</th><td><input type="text" name="field1" /></td></tr>\n<tr><th>Field2:</th><td><input type="text" name="field2" /></td></tr>\n');

var myform = new MyForm({}, {'field3': new fields.CharField(), 'field4': new fields.CharField()});
assert(myform.toString() === '<tr><th>Default field 1:</th><td><input type="text" name="default_field_1" /></td></tr>\n<tr><th>Default field 2:</th><td><input type="text" name="default_field_2" /></td></tr>\n<tr><th>Field3:</th><td><input type="text" name="field3" /></td></tr>\n<tr><th>Field4:</th><td><input type="text" name="field4" /></td></tr>\n');

// Changes to field attributes do not persist from one Form instance to another
var Person = function(names_required, params) {
    this.first_name = new fields.CharField({required: false});
    this.last_name = new fields.CharField({required: false});
    
    forms.Form.apply(this, [params]);
    
    if (names_required) {
        this.fields['first_name'].required = true;
        this.fields['first_name'].widget.attrs['class'] = 'required';
        this.fields['last_name'].required = true;
        this.fields['last_name'].widget.attrs['class'] = 'required';
    }
};
Person.prototype.__proto__ = forms.Form.prototype;

var f = new Person(false);
assert(f.get_bound_field('first_name').field.required === false);
assert(f.get_bound_field('last_name').field.required === false);
assert(Object.isEmpty(f.get_bound_field('first_name').field.widget.attrs));
assert(Object.isEmpty(f.get_bound_field('last_name').field.widget.attrs));

var f = new Person(true);
assert(f.get_bound_field('first_name').field.required === true);
assert(f.get_bound_field('last_name').field.required === true);
assert(f.get_bound_field('first_name').field.widget.attrs['class'] === 'required');
assert(f.get_bound_field('last_name').field.widget.attrs['class'] === 'required');

var f = new Person(false);
assert(f.get_bound_field('first_name').field.required === false);
assert(f.get_bound_field('last_name').field.required === false);
assert(Object.isEmpty(f.get_bound_field('first_name').field.widget.attrs));
assert(Object.isEmpty(f.get_bound_field('last_name').field.widget.attrs));

var Person = function(name_max_length, params) {
    this.first_name = new fields.CharField({max_length: 30});
    this.last_name = new fields.CharField({max_length: 30});
    
    forms.Form.apply(this, [params]);
    
    if (name_max_length) {
        this.fields['first_name'].max_length = name_max_length;
        this.fields['last_name'].max_length = name_max_length;
    }
};
Person.prototype.__proto__ = forms.Form.prototype;

var f = new Person();
assert(f.get_bound_field('first_name').field.max_length === 30);
assert(f.get_bound_field('last_name').field.max_length === 30);

var f = new Person(20);
assert(f.get_bound_field('first_name').field.max_length === 20);
assert(f.get_bound_field('last_name').field.max_length === 20);

var f = new Person();
assert(f.get_bound_field('first_name').field.max_length === 30);
assert(f.get_bound_field('last_name').field.max_length === 30);

// HiddenInput widgets are displayed differently in the as_table(), as_ul()
// and as_p() output of a Form -- their verbose names are not displayed, and a
// separate row is not displayed. They're displayed in the last row of the
// form, directly after that row's form element.
var Person = function() {
    this.first_name = new fields.CharField();
    this.last_name = new fields.CharField();
    this.hidden_text = new fields.CharField({widget: widgets.HiddenInput});
    this.birthday = new fields.DateField();
    
    forms.Form.apply(this, arguments);
};
Person.prototype.__proto__ = forms.Form.prototype;

var p = new Person({auto_id: false});
assert(p.toString() === '<tr><th>First name:</th><td><input type="text" name="first_name" /></td></tr>\n<tr><th>Last name:</th><td><input type="text" name="last_name" /></td></tr>\n<tr><th>Birthday:</th><td><input type="text" name="birthday" /><input type="hidden" name="hidden_text" /></td></tr>\n');
assert(p.as_ul() === '<li>First name: <input type="text" name="first_name" /></li>\n<li>Last name: <input type="text" name="last_name" /></li>\n<li>Birthday: <input type="text" name="birthday" /><input type="hidden" name="hidden_text" /></li>\n');
assert(p.as_p() === '<p>First name: <input type="text" name="first_name" /></p>\n<p>Last name: <input type="text" name="last_name" /></p>\n<p>Birthday: <input type="text" name="birthday" /><input type="hidden" name="hidden_text" /></p>\n');

// With auto_id set, a HiddenInput still gets an ID, but it doesn't get a label.
var p = new Person({auto_id: 'id_%s'});
assert(p.toString() === '<tr><th><label for="id_first_name">First name:</label></th><td><input type="text" name="first_name" id="id_first_name" /></td></tr>\n<tr><th><label for="id_last_name">Last name:</label></th><td><input type="text" name="last_name" id="id_last_name" /></td></tr>\n<tr><th><label for="id_birthday">Birthday:</label></th><td><input type="text" name="birthday" id="id_birthday" /><input type="hidden" name="hidden_text" id="id_hidden_text" /></td></tr>\n');
assert(p.as_ul() === '<li><label for="id_first_name">First name:</label> <input type="text" name="first_name" id="id_first_name" /></li>\n<li><label for="id_last_name">Last name:</label> <input type="text" name="last_name" id="id_last_name" /></li>\n<li><label for="id_birthday">Birthday:</label> <input type="text" name="birthday" id="id_birthday" /><input type="hidden" name="hidden_text" id="id_hidden_text" /></li>\n');
assert(p.as_p() === '<p><label for="id_first_name">First name:</label> <input type="text" name="first_name" id="id_first_name" /></p>\n<p><label for="id_last_name">Last name:</label> <input type="text" name="last_name" id="id_last_name" /></p>\n<p><label for="id_birthday">Birthday:</label> <input type="text" name="birthday" id="id_birthday" /><input type="hidden" name="hidden_text" id="id_hidden_text" /></p>\n');

// If a field with a HiddenInput has errors, the as_table() and as_ul() output
// will include the error message(s) with the text "(Hidden field [fieldname]) "
// prepended. This message is displayed at the top of the output, regardless of
// its field's order in the form.
var p = new Person({data: {'first_name': 'John', 'last_name': 'Lennon', 'birthday': '1940-10-9'}, auto_id: false});
assert(p.toString() === '<tr><td colspan="2"><ul class="errorlist"><li>(Hidden field hidden_text) This field is required.</li></ul></td></tr>\n<tr><th>First name:</th><td><input type="text" name="first_name" value="John" /></td></tr>\n<tr><th>Last name:</th><td><input type="text" name="last_name" value="Lennon" /></td></tr>\n<tr><th>Birthday:</th><td><input type="text" name="birthday" value="1940-10-9" /><input type="hidden" name="hidden_text" /></td></tr>\n');
assert(p.as_ul() === '<li><ul class="errorlist"><li>(Hidden field hidden_text) This field is required.</li></ul></li>\n<li>First name: <input type="text" name="first_name" value="John" /></li>\n<li>Last name: <input type="text" name="last_name" value="Lennon" /></li>\n<li>Birthday: <input type="text" name="birthday" value="1940-10-9" /><input type="hidden" name="hidden_text" /></li>\n')
assert(p.as_p() === '<ul class="errorlist"><li>(Hidden field hidden_text) This field is required.</li></ul>\n<p>First name: <input type="text" name="first_name" value="John" /></p>\n<p>Last name: <input type="text" name="last_name" value="Lennon" /></p>\n<p>Birthday: <input type="text" name="birthday" value="1940-10-9" /><input type="hidden" name="hidden_text" /></p>\n');

// A corner case: It's possible for a form to have only HiddenInputs.
var TestForm = function() {
    this.foo = new fields.CharField({widget: widgets.HiddenInput});
    this.bar = new fields.CharField({widget: widgets.HiddenInput});
    
    forms.Form.apply(this, arguments);
};
TestForm.prototype.__proto__ = forms.Form.prototype;

var p = new TestForm({auto_id: False});
assert(p.as_table() === '<input type="hidden" name="foo" /><input type="hidden" name="bar" />\n');
assert(p.as_ul() === '<input type="hidden" name="foo" /><input type="hidden" name="bar" />\n');
assert(p.as_p() === '<input type="hidden" name="foo" /><input type="hidden" name="bar" />\n');

// A forms fields are displayed in the same order in which they were defined.
var TestForm = function() {
    this.field1 = new fields.CharField();
    this.field2 = new fields.CharField();
    this.field3 = new fields.CharField();
    this.field4 = new fields.CharField();
    this.field5 = new fields.CharField();
    this.field6 = new fields.CharField();                  
    this.field7 = new fields.CharField();
    this.field8 = new fields.CharField();
    this.field9 = new fields.CharField();
    this.field10 = new fields.CharField();
    this.field11 = new fields.CharField();
    this.field12 = new fields.CharField();
    this.field13 = new fields.CharField();
    this.field14 = new fields.CharField();
    
    forms.Form.apply(this, arguments);
};
TestForm.prototype.__proto__ = forms.Form.prototype;

var p = new TestForm({auto_id: false});
assert(p.toString() === '<tr><th>Field1:</th><td><input type="text" name="field1" /></td></tr>\n<tr><th>Field2:</th><td><input type="text" name="field2" /></td></tr>\n<tr><th>Field3:</th><td><input type="text" name="field3" /></td></tr>\n<tr><th>Field4:</th><td><input type="text" name="field4" /></td></tr>\n<tr><th>Field5:</th><td><input type="text" name="field5" /></td></tr>\n<tr><th>Field6:</th><td><input type="text" name="field6" /></td></tr>\n<tr><th>Field7:</th><td><input type="text" name="field7" /></td></tr>\n<tr><th>Field8:</th><td><input type="text" name="field8" /></td></tr>\n<tr><th>Field9:</th><td><input type="text" name="field9" /></td></tr>\n<tr><th>Field10:</th><td><input type="text" name="field10" /></td></tr>\n<tr><th>Field11:</th><td><input type="text" name="field11" /></td></tr>\n<tr><th>Field12:</th><td><input type="text" name="field12" /></td></tr>\n<tr><th>Field13:</th><td><input type="text" name="field13" /></td></tr>\n<tr><th>Field14:</th><td><input type="text" name="field14" /></td></tr>\n');











