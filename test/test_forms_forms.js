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

// Some Field classes have an effect on the HTML attributes of their associated
// Widget. If you set max_length in a CharField and its associated widget is
// either a TextInput or PasswordInput, then the widget's rendered HTML will
// include the "maxlength" attribute.
var UserRegistration = function() {
    this.username = new fields.CharField({max_length: 10});
    this.password = new fields.CharField({max_length: 10, widget: widgets.PasswordInput});
    this.realname = new fields.CharField({max_length: 10, widget: widgets.TextInput});
    this.address = new fields.CharField();

    forms.Form.apply(this, arguments);
};
UserRegistration.prototype.__proto__ = forms.Form.prototype;

var p = new UserRegistration({auto_id: false});
assert(p.as_ul() === '<li>Username: <input maxlength="10" type="text" name="username" /></li>\n<li>Password: <input maxlength="10" type="password" name="password" /></li>\n<li>Realname: <input maxlength="10" type="text" name="realname" /></li>\n<li>Address: <input type="text" name="address" /></li>\n');

var UserRegistration = function() {
    this.username = new fields.CharField({max_length: 10, widget: widgets.TextInput({'maxlength': 20})});
    this.password = new fields.CharField({max_length: 10, widget: widgets.PasswordInput});

    forms.Form.apply(this, arguments);
};
UserRegistration.prototype.__proto__ = forms.Form.prototype;

var p = new UserRegistration({auto_id: false});
assert(p.as_ul() === '<li>Username: <input maxlength="10" type="text" name="username" /></li>\n<li>Password: <input maxlength="10" type="password" name="password" /></li>\n');

// Specifying Labels-----------------

// You can specify the label for a field by using the 'label' argument to a Field
//	class. If you don't specify 'label', Django will use the field name with
//	underscores converted to spaces, and the initial letter capitalized.
var UserRegistration = function() {
    this.username = new fields.CharField({max_length: 10, label: 'Your username'});
    this.password1 = new fields.CharField({widget: widgets.PasswordInput});
    this.password2 = new fields.CharField({widget: widgets.PasswordInput, label: 'Password (again)'});

    forms.Form.apply(this, arguments);
};
UserRegistration.prototype.__proto__ = forms.Form.prototype;

var p = new UserRegistration({auto_id: false});
assert(p.as_ul() === '<li>Your username: <input maxlength="10" type="text" name="username" /></li>\n<li>Password1: <input type="password" name="password1" /></li>\n<li>Password (again): <input type="password" name="password2" /></li>\n');

var Questions = function() {
    this.q1 = new fields.CharField({label: 'The first question'});
    this.q2 = new fields.CharField({label: 'What is your name?'});
    this.q3 = new fields.CharField({label: 'The answer to life is:'});
    this.q4 = new fields.CharField({label: 'Answer this question!'});
    this.q5 = new fields.CharField({label: 'The last question. Period.'});
    forms.Form.apply(this, arguments);
};
Questions.prototype.__proto__ = forms.Form.prototype;

assert(new Questions({auto_id: false}).as_p() === '<p>The first question: <input type="text" name="q1" /></p>\n<p>What is your name? <input type="text" name="q2" /></p>\n<p>The answer to life is: <input type="text" name="q3" /></p>\n<p>Answer this question! <input type="text" name="q4" /></p>\n<p>The last question. Period. <input type="text" name="q5" /></p>\n');
assert(new Questions().as_p() === '<p><label for="id_q1">The first question:</label> <input type="text" name="q1" id="id_q1" /></p>\n<p><label for="id_q2">What is your name?</label> <input type="text" name="q2" id="id_q2" /></p>\n<p><label for="id_q3">The answer to life is:</label> <input type="text" name="q3" id="id_q3" /></p>\n<p><label for="id_q4">Answer this question!</label> <input type="text" name="q4" id="id_q4" /></p>\n<p><label for="id_q5">The last question. Period.</label> <input type="text" name="q5" id="id_q5" /></p>\n');

var UserRegistration = function() {
    this.username = new fields.CharField({max_length: 10, label: ''});
    this.password = new fields.CharField({widget: widgets.PasswordInput});

    forms.Form.apply(this, arguments);
};
UserRegistration.prototype.__proto__ = forms.Form.prototype;

var p = new UserRegistration({auto_id: false});
assert(p.as_ul() === '<li> <input maxlength="10" type="text" name="username" /></li>\n<li>Password: <input type="password" name="password" /></li>\n');

var p = new UserRegistration({auto_id: 'id_%s'});
assert(p.as_ul() === '<li> <input maxlength="10" type="text" name="username" id="id_username" /></li>\n<li><label for="id_password">Password:</label> <input type="password" name="password" id="id_password" /></li>\n');

var UserRegistration = function() {
    this.username = new fields.CharField({max_length: 10, label: null});
    this.password = new fields.CharField({widget: widgets.PasswordInput});

    forms.Form.apply(this, arguments);
};
UserRegistration.prototype.__proto__ = forms.Form.prototype;

var p = new UserRegistration({auto_id: false});
assert(p.as_ul() === '<li>Username: <input maxlength="10" type="text" name="username" /></li>\n<li>Password: <input type="password" name="password" /></li>\n');

var p = new UserRegistration({auto_id: 'id_%s'});
assert(p.as_ul() === '<li><label for="id_username">Username:</label> <input maxlength="10" type="text" name="username" id="id_username" /></li>\n<li><label for="id_password">Password:</label> <input type="password" name="password" id="id_password" /></li>\n');

// Label suffix

// You can specify the 'label_suffix' argument to a Form class to modify the
// punctuation symbol used at the end of a label.  By default, the colon (:) is
// used, and is only appended to the label if the label doesn't already end with a
// punctuation symbol: ., !, ? or :.  If you specify a different suffix, it will
// be appended regardless of the last character of the label.
var FavoriteForm = function() {
    this.color = new fields.CharField({label: 'Favorite color?'});
    this.animal = new fields.CharField({label: 'Favorite animal'});

    forms.Form.apply(this, arguments);
};
FavoriteForm.prototype.__proto__ = forms.Form.prototype;

var f = new FavoriteForm({auto_id: false});
assert(f.as_ul() === '<li>Favorite color? <input type="text" name="color" /></li>\n<li>Favorite animal: <input type="text" name="animal" /></li>\n');
var f = new FavoriteForm({auto_id: false, label_suffix: '?'});
assert(f.as_ul() === '<li>Favorite color? <input type="text" name="color" /></li>\n<li>Favorite animal? <input type="text" name="animal" /></li>\n');
var f = new FavoriteForm({auto_id: false, label_suffix: ''});
assert(f.as_ul() === '<li>Favorite color? <input type="text" name="color" /></li>\n<li>Favorite animal <input type="text" name="animal" /></li>\n');

// Initial data ################################################################
//
// You can specify initial data for a field by using the 'initial' argument to a
// Field class. This initial data is displayed when a Form is rendered with *no*
// data. It is not displayed when a Form is rendered with any data (including an
// empty dictionary). Also, the initial value is *not* used if data for a
// particular required field isn't provided.
var UserRegistration = function() {
    this.username = new fields.CharField({max_length: 10, initial: 'django'});
    this.password = new fields.CharField({widget: widgets.PasswordInput});

    forms.Form.apply(this, arguments);
};
UserRegistration.prototype.__proto__ = forms.Form.prototype;

var p = new UserRegistration({auto_id: false});
assert(p.as_ul() === '<li>Username: <input maxlength="10" type="text" name="username" value="django" /></li>\n<li>Password: <input type="password" name="password" /></li>\n');

var p = new UserRegistration({data: {}, auto_id: false});
assert(p.as_ul() === '<li><ul class="errorlist"><li>This field is required.</li></ul>Username: <input maxlength="10" type="text" name="username" /></li>\n<li><ul class="errorlist"><li>This field is required.</li></ul>Password: <input type="password" name="password" /></li>\n');

var p = new UserRegistration({data: {'username': ''}, auto_id: false});
assert(p.as_ul() === '<li><ul class="errorlist"><li>This field is required.</li></ul>Username: <input maxlength="10" type="text" name="username" /></li>\n<li><ul class="errorlist"><li>This field is required.</li></ul>Password: <input type="password" name="password" /></li>\n');

var p = new UserRegistration({data: {'username': 'foo'}, auto_id: false});
assert(p.as_ul() === '<li>Username: <input maxlength="10" type="text" name="username" value="foo" /></li>\n<li><ul class="errorlist"><li>This field is required.</li></ul>Password: <input type="password" name="password" /></li>\n');

var p = new UserRegistration({data: {'password': 'secret'}});
assert(p.errors.dict['username'].list[0] === 'This field is required.');
assert(!p.is_valid());

// # Dynamic initial data ########################################################
//
// The previous technique dealt with "hard-coded" initial data, but it's also
// possible to specify initial data after you've already created the Form class
// (i.e., at runtime). Use the 'initial' parameter to the Form constructor. This
// should be a dictionary containing initial values for one or more fields in the
// form, keyed by field name.
var UserRegistration = function() {
    this.username = new fields.CharField({max_length: 10});
    this.password = new fields.CharField({widget: widgets.PasswordInput});

    forms.Form.apply(this, arguments);
};
UserRegistration.prototype.__proto__ = forms.Form.prototype;

var p = new UserRegistration({initial: {username: 'django'}, auto_id: false});
assert(p.as_ul() === '<li>Username: <input maxlength="10" type="text" name="username" value="django" /></li>\n<li>Password: <input type="password" name="password" /></li>\n');

var p = new UserRegistration({initial: {username: 'stephanie'}, auto_id: false});
assert(p.as_ul() === '<li>Username: <input maxlength="10" type="text" name="username" value="stephanie" /></li>\n<li>Password: <input type="password" name="password" /></li>\n');

var p = new UserRegistration({initial: {username: 'django'}, data: {}, auto_id: false});
assert(p.as_ul() === '<li><ul class="errorlist"><li>This field is required.</li></ul>Username: <input maxlength="10" type="text" name="username" /></li>\n<li><ul class="errorlist"><li>This field is required.</li></ul>Password: <input type="password" name="password" /></li>\n');

var p = new UserRegistration({initial: {username: 'django'}, data: {'username': ''}, auto_id: false});
assert(p.as_ul() === '<li><ul class="errorlist"><li>This field is required.</li></ul>Username: <input maxlength="10" type="text" name="username" /></li>\n<li><ul class="errorlist"><li>This field is required.</li></ul>Password: <input type="password" name="password" /></li>\n');

var p = new UserRegistration({initial: {username: 'django'}, data: {'username': 'foo'}, auto_id: false});
assert(p.as_ul() === '<li>Username: <input maxlength="10" type="text" name="username" value="foo" /></li>\n<li><ul class="errorlist"><li>This field is required.</li></ul>Password: <input type="password" name="password" /></li>\n');

var p = new UserRegistration({initial: {username: 'django'}, data: {'password': 'secret'}});
assert(p.errors.dict['username'].list[0] === 'This field is required.');
assert(!p.is_valid());

var UserRegistration = function() {
    this.username = new fields.CharField({max_length: 10, initial: 'django'});
    this.password = new fields.CharField({widget: widgets.PasswordInput});

    forms.Form.apply(this, arguments);
};
UserRegistration.prototype.__proto__ = forms.Form.prototype;

var p = new UserRegistration({initial: {username: 'stephanie'}, auto_id: false});
assert(p.as_ul() === '<li>Username: <input maxlength="10" type="text" name="username" value="stephanie" /></li>\n<li>Password: <input type="password" name="password" /></li>\n');

// Callable initial data ########################################################
//
// The previous technique dealt with raw values as initial data, but it's also
// possible to specify callable data.
var UserRegistration = function() {
    this.username = new fields.CharField({max_length: 10});
    this.password = new fields.CharField({widget: widgets.PasswordInput});

    forms.Form.apply(this, arguments);
};
UserRegistration.prototype.__proto__ = forms.Form.prototype;
var initial_django = function() {
    return 'django';
};
var initial_stephanie = function() {
    return 'stephanie';
};

var p = new UserRegistration({initial: {username: initial_django}, auto_id: false});
assert(p.as_ul() === '<li>Username: <input maxlength="10" type="text" name="username" value="django" /></li>\n<li>Password: <input type="password" name="password" /></li>\n');

var p = new UserRegistration({initial: {username: initial_stephanie}, auto_id: false});
assert(p.as_ul() === '<li>Username: <input maxlength="10" type="text" name="username" value="stephanie" /></li>\n<li>Password: <input type="password" name="password" /></li>\n');

var p = new UserRegistration({initial: {username: initial_django}, data: {}, auto_id: false});
assert(p.as_ul() === '<li><ul class="errorlist"><li>This field is required.</li></ul>Username: <input maxlength="10" type="text" name="username" /></li>\n<li><ul class="errorlist"><li>This field is required.</li></ul>Password: <input type="password" name="password" /></li>\n');

var p = new UserRegistration({initial: {username: initial_django}, data: {'username': ''}, auto_id: false});
assert(p.as_ul() === '<li><ul class="errorlist"><li>This field is required.</li></ul>Username: <input maxlength="10" type="text" name="username" /></li>\n<li><ul class="errorlist"><li>This field is required.</li></ul>Password: <input type="password" name="password" /></li>\n');

var p = new UserRegistration({initial: {username: initial_django}, data: {'username': 'foo'}, auto_id: false});
assert(p.as_ul() === '<li>Username: <input maxlength="10" type="text" name="username" value="foo" /></li>\n<li><ul class="errorlist"><li>This field is required.</li></ul>Password: <input type="password" name="password" /></li>\n');

var p = new UserRegistration({initial: {username: initial_django}, data: {'password': 'secret'}});
assert(p.errors.dict['username'].list[0] === 'This field is required.');
assert(!p.is_valid());

var UserRegistration = function() {
    this.username = new fields.CharField({max_length: 10, initial: initial_django});
    this.password = new fields.CharField({widget: widgets.PasswordInput});

    forms.Form.apply(this, arguments);
};
UserRegistration.prototype.__proto__ = forms.Form.prototype;

var p = new UserRegistration({initial: {username: initial_stephanie}, auto_id: false});
assert(p.as_ul() === '<li>Username: <input maxlength="10" type="text" name="username" value="stephanie" /></li>\n<li>Password: <input type="password" name="password" /></li>\n');

// 	# Help text ###################################################################
//
// You can specify descriptive text for a field by using the 'help_text' argument
// to a Field class. This help text is displayed when a Form is rendered.
var UserRegistration = function() {
    this.username = new fields.CharField({max_length: 10, help_text: 'e.g., user@example.com'});
    this.password = new fields.CharField({widget: widgets.PasswordInput, help_text: 'Choose wisely.'});

    forms.Form.apply(this, arguments);
};
UserRegistration.prototype.__proto__ = forms.Form.prototype;

var p = new UserRegistration({auto_id: false});
assert(p.as_ul() === '<li>Username: <input maxlength="10" type="text" name="username" /> e.g., user@example.com</li>\n<li>Password: <input type="password" name="password" /> Choose wisely.</li>\n');
assert(p.as_p() === '<p>Username: <input maxlength="10" type="text" name="username" /> e.g., user@example.com</p>\n<p>Password: <input type="password" name="password" /> Choose wisely.</p>\n');
assert(p.as_table() === '<tr><th>Username:</th><td><input maxlength="10" type="text" name="username" /><br />e.g., user@example.com</td></tr>\n<tr><th>Password:</th><td><input type="password" name="password" /><br />Choose wisely.</td></tr>\n');

var p = new UserRegistration({data: {username: 'foo'}, auto_id: false});
assert(p.as_ul() === '<li>Username: <input maxlength="10" type="text" name="username" value="foo" /> e.g., user@example.com</li>\n<li><ul class="errorlist"><li>This field is required.</li></ul>Password: <input type="password" name="password" /> Choose wisely.</li>\n');

var UserRegistration = function() {
    this.username = new fields.CharField({max_length: 10, help_text: 'e.g., user@example.com'});
    this.password = new fields.CharField({widget: widgets.PasswordInput});
    this.next = new fields.CharField({widget: widgets.HiddenInput, initial:'/', help_text: 'Redirect destination'});

    forms.Form.apply(this, arguments);
};
UserRegistration.prototype.__proto__ = forms.Form.prototype;

var p = new UserRegistration({auto_id: false});
assert(p.as_ul() === '<li>Username: <input maxlength="10" type="text" name="username" /> e.g., user@example.com</li>\n<li>Password: <input type="password" name="password" /><input type="hidden" name="next" value="/" /></li>\n');

// Subclassing forms ###########################################################
//
// You can subclass a Form to add fields. The resulting form subclass will have
// all of the fields of the parent Form, plus whichever fields you define in the
// subclass.

// This stuff is kind of weird right now due to using javascript style inheritance.
var Person = function() {
    this.first_name = new fields.CharField();
    this.last_name = new fields.CharField();
    this.birthday = new fields.DateField();

    forms.Form.apply(this, arguments);
};
Person.prototype.__proto__ = forms.Form.prototype;

var Musician = function() {
    Person.apply(this, arguments);
    this.instrument = new fields.CharField();
    forms.Form.apply(this, arguments);
};
Musician.prototype.__proto__ = Person.prototype;

var p = new Person({auto_id: false});
assert(p.as_ul() === '<li>First name: <input type="text" name="first_name" /></li>\n<li>Last name: <input type="text" name="last_name" /></li>\n<li>Birthday: <input type="text" name="birthday" /></li>\n');
var m = new Musician({auto_id: false});
assert(m.as_ul() === '<li>First name: <input type="text" name="first_name" /></li>\n<li>Last name: <input type="text" name="last_name" /></li>\n<li>Birthday: <input type="text" name="birthday" /></li>\n<li>Instrument: <input type="text" name="instrument" /></li>\n');

// What about subclassing multiple forms? This might work, but we're getting into the hairier side of javascript now...
var Instrument = function() {
    this.instrument = new fields.CharField();
    forms.Form.apply(this, arguments);
};
Instrument.prototype.__proto__ = forms.Form.prototype;

var Beatle = function() {
    Person.apply(this, arguments);
    Instrument.apply(this, arguments);
    this.haircut_type = new fields.CharField();
    forms.Form.apply(this, arguments);
};
Beatle.prototype.__proto__ = Person.prototype;
Beatle.prototype.extend(Instrument.prototype);

var b = new Beatle({auto_id: false});
assert(b.as_ul() === '<li>First name: <input type="text" name="first_name" /></li>\n<li>Last name: <input type="text" name="last_name" /></li>\n<li>Birthday: <input type="text" name="birthday" /></li>\n<li>Instrument: <input type="text" name="instrument" /></li>\n<li>Haircut type: <input type="text" name="haircut_type" /></li>\n');

//# Forms with prefixes #########################################################
//
// Sometimes it's necessary to have multiple forms display on the same HTML page,
// or multiple copies of the same form. We can accomplish this with form prefixes.
// Pass the keyword argument 'prefix' to the Form constructor to use this feature.
// This value will be prepended to each HTML form field name. One way to think
// about this is "namespaces for HTML forms". Notice that in the data argument,
// each field's key has the p
var Person = function() {
    this.first_name = new fields.CharField();
    this.last_name = new fields.CharField();
    this.birthday = new fields.DateField();

    forms.Form.apply(this, arguments);
};
Person.prototype.__proto__ = forms.Form.prototype;

var data = {
    'person1-first_name': 'John',
    'person1-last_name': 'Lennon',
    'person1-birthday': '1940-10-9'
};

var p = new Person({data: data, prefix: 'person1'});
assert(p.as_ul() === '<li><label for="id_person1-first_name">First name:</label> <input type="text" name="person1-first_name" id="id_person1-first_name" value="John" /></li>\n<li><label for="id_person1-last_name">Last name:</label> <input type="text" name="person1-last_name" id="id_person1-last_name" value="Lennon" /></li>\n<li><label for="id_person1-birthday">Birthday:</label> <input type="text" name="person1-birthday" id="id_person1-birthday" value="1940-10-9" /></li>\n');
assert(p.get_bound_field('first_name').toString() === '<input type="text" name="person1-first_name" id="id_person1-first_name" value="John" />');
assert(p.get_bound_field('last_name').toString() === '<input type="text" name="person1-last_name" id="id_person1-last_name" value="Lennon" />');
assert(p.get_bound_field('birthday').toString() === '<input type="text" name="person1-birthday" id="id_person1-birthday" value="1940-10-9" />');
assert(Object.isEmpty(p.errors.dict));
assert(p.is_valid());
assert(p.cleaned_data['first_name'] === 'John');
assert(p.cleaned_data['last_name'] === 'Lennon');
assert(p.cleaned_data['birthday'] == new Date(1940, 9, 9));

var data = {
    'person1-first_name': '',
    'person1-last_name': '',
    'person1-birthday': ''
};

var p = new Person({data: data, prefix: 'person1'});
assert(p.errors.dict['first_name'].list[0] === 'This field is required.');
assert(p.errors.dict['last_name'].list[0] === 'This field is required.');
assert(p.errors.dict['birthday'].list[0] === 'This field is required.');
assert(p.get_bound_field('first_name').errors.list[0] === 'This field is required.');
test.assertThrows(new util.Error("Field person1-first_name not found in Form."), p, forms.Form.get_bound_field, 'person1-first_name');

var data = {
    'first_name': 'John',
    'last_name': 'Lennon',
    'birthday': '1940-10-9'
};

var p = new Person({data: data, prefix: 'person1'});
assert(p.errors.dict['first_name'].list[0] === 'This field is required.');
assert(p.errors.dict['last_name'].list[0] === 'This field is required.');
assert(p.errors.dict['birthday'].list[0] === 'This field is required.');

var data = {
    'person1-first_name': 'John',
    'person1-last_name': 'Lennon',
    'person1-birthday': '1940-10-9',
    'person2-first_name': 'Jim',
    'person2-last_name': 'Morrison',
    'person2-birthday': '1943-12-8'
};

var p1 = new Person({data: data, prefix: 'person1'});
assert(p1.is_valid());
assert(p1.cleaned_data['first_name'] === 'John');
assert(p1.cleaned_data['last_name'] === 'Lennon');
assert(p1.cleaned_data['birthday'] == new Date(1940, 9, 9));

var p2 = new Person({data: data, prefix: 'person2'});
assert(p2.is_valid());
assert(p2.cleaned_data['first_name'] === 'Jim');
assert(p2.cleaned_data['last_name'] === 'Morrison');
assert(p2.cleaned_data['birthday'] == new Date(1943, 11, 8));

// try a custom add_prefix method
var Person = function() {
    this.first_name = new fields.CharField();
    this.last_name = new fields.CharField();
    this.birthday = new fields.DateField();

    var that = this;
    this.add_prefix = function(field_name) {
        return that.prefix ? (that.prefix + '-prefix-' + field_name) : field_name;
    };

    forms.Form.apply(this, arguments);
};
Person.prototype.__proto__ = forms.Form.prototype;

var p = new Person({prefix: 'foo'});
assert(p.as_ul() === '<li><label for="id_foo-prefix-first_name">First name:</label> <input type="text" name="foo-prefix-first_name" id="id_foo-prefix-first_name" /></li>\n<li><label for="id_foo-prefix-last_name">Last name:</label> <input type="text" name="foo-prefix-last_name" id="id_foo-prefix-last_name" /></li>\n<li><label for="id_foo-prefix-birthday">Birthday:</label> <input type="text" name="foo-prefix-birthday" id="id_foo-prefix-birthday" /></li>\n');

var data = {
    'foo-prefix-first_name': 'John',
    'foo-prefix-last_name': 'Lennon',
    'foo-prefix-birthday': '1940-10-9'
};

var p = new Person({data: data, prefix: 'foo'});
assert(p.is_valid());
assert(p.cleaned_data['first_name'] === 'John');
assert(p.cleaned_data['last_name'] === 'Lennon');
assert(p.cleaned_data['birthday'] == new Date(1940, 9, 9));

//# Forms with NullBooleanFields ################################################
//
// NullBooleanField is a bit of a special case because its presentation (widget)
// is different than its data. This is handled transparently, though.
var Person = function() {
    this.name = new fields.CharField();
    this.is_cool = new fields.NullBooleanField();

    forms.Form.apply(this, arguments);
};
Person.prototype.__proto__ = forms.Form.prototype;

var p = new Person({data: {'name': 'Joe'}, auto_id: false});
assert(p.get_bound_field('is_cool').toString() === '<select name="is_cool">\n<option value="1" selected="selected">Unknown</option>\n<option value="2">Yes</option>\n<option value="3">No</option>\n</select>');

var p = new Person({data: {'name': 'Joe', 'is_cool': 1}, auto_id: false});
assert(p.get_bound_field('is_cool').toString() === '<select name="is_cool">\n<option value="1" selected="selected">Unknown</option>\n<option value="2">Yes</option>\n<option value="3">No</option>\n</select>');

var p = new Person({data: {'name': 'Joe', 'is_cool': 2}, auto_id: false});
assert(p.get_bound_field('is_cool').toString() === '<select name="is_cool">\n<option value="1">Unknown</option>\n<option value="2" selected="selected">Yes</option>\n<option value="3">No</option>\n</select>');

var p = new Person({data: {'name': 'Joe', 'is_cool': 3}, auto_id: false});
assert(p.get_bound_field('is_cool').toString() === '<select name="is_cool">\n<option value="1">Unknown</option>\n<option value="2">Yes</option>\n<option value="3" selected="selected">No</option>\n</select>');

var p = new Person({data: {'name': 'Joe', 'is_cool': true}, auto_id: false});
assert(p.get_bound_field('is_cool').toString() === '<select name="is_cool">\n<option value="1">Unknown</option>\n<option value="2" selected="selected">Yes</option>\n<option value="3">No</option>\n</select>');

var p = new Person({data: {'name': 'Joe', 'is_cool': false}, auto_id: false});
assert(p.get_bound_field('is_cool').toString() === '<select name="is_cool">\n<option value="1">Unknown</option>\n<option value="2">Yes</option>\n<option value="3" selected="selected">No</option>\n</select>');

//# Forms with FileFields ################################################
//
// FileFields are a special case because they take their data from the request.FILES,
// not request.POST.
var FileForm = function() {
    this.file1 = new fields.FileField();

    forms.Form.apply(this, arguments);
};
FileForm.prototype.__proto__ = forms.Form.prototype;

var f = new FileForm({auto_id: false});
assert(f.toString() === '<tr><th>File1:</th><td><input type="file" name="file1" /></td></tr>\n');

var f = new FileForm({data: {}, files: {}, auto_id: false});
assert(f.toString() === '<tr><th>File1:</th><td><ul class="errorlist"><li>This field is required.</li></ul><input type="file" name="file1" /></td></tr>\n');

var f = new FileForm({data: {}, files: {'file1': openFile("a file that does not exist")}, auto_id: false});
assert(f.toString() === '<tr><th>File1:</th><td><ul class="errorlist"><li>The submitted file is empty.</li></ul><input type="file" name="file1" /></td></tr>\n');

var f = new FileForm({data: {}, files: {'file1': 'This isnt a file'}, auto_id: false});
assert(f.toString() === '<tr><th>File1:</th><td><ul class="errorlist"><li>No file was submitted. Check the encoding type on the form.</li></ul><input type="file" name="file1" /></td></tr>\n');

var file = openFile('name');
file.length = 5;
var f = new FileForm({data:{}, files: {'file1': file}, auto_id: false});
assert(f.toString() === '<tr><th>File1:</th><td><input type="file" name="file1" /></td></tr>\n');
assert(f.is_valid());

// Basic form processing in a view
var UserRegistration = function() {
    this.username = new fields.CharField({max_length: 10});
    this.password1 = new fields.CharField({widget: widgets.PasswordInput});
    this.password2 = new fields.CharField({widget: widgets.PasswordInput});

    var that = this;
    this.clean = function() {
        if (that.cleaned_data['password1'] && that.cleaned_data['password2'] && that.cleaned_data['password1'] !== that.cleaned_data['password2']) {
            throw new util.ValidationError('Please make sure your passwords match.');
        }
        return that.cleaned_data
    };

    forms.Form.apply(this, arguments);
};
UserRegistration.prototype.__proto__ = forms.Form.prototype;

var my_function = function(method, post_data) {
    var form;
    if (method === 'POST') {
        form = new UserRegistration({data: post_data, auto_id: false});
    } else {
        form = new UserRegistration({auto_id: false});
    }
    if (form.is_valid()) {
        return 'VALID: ' + tojson(form.cleaned_data);
    }
    return util.simplePythonFormat('<form action="" method="post">\n<table>\n%s</table>\n<input type="submit" />\n</form>\n', form);
};

assert(my_function('GET', {}) === '<form action="" method="post">\n<table>\n<tr><th>Username:</th><td><input maxlength="10" type="text" name="username" /></td></tr>\n<tr><th>Password1:</th><td><input type="password" name="password1" /></td></tr>\n<tr><th>Password2:</th><td><input type="password" name="password2" /></td></tr>\n</table>\n<input type="submit" />\n</form>\n');
assert(my_function('POST', {'username': 'this-is-a-long-username', 'password1': 'foo', 'password2': 'bar'}) === '<form action="" method="post">\n<table>\n<tr><td colspan="2"><ul class="errorlist"><li>Please make sure your passwords match.</li></ul></td></tr>\n<tr><th>Username:</th><td><ul class="errorlist"><li>Ensure this value has at most 10 characters (it has 23).</li></ul><input maxlength="10" type="text" name="username" value="this-is-a-long-username" /></td></tr>\n<tr><th>Password1:</th><td><input type="password" name="password1" value="foo" /></td></tr>\n<tr><th>Password2:</th><td><input type="password" name="password2" value="bar" /></td></tr>\n</table>\n<input type="submit" />\n</form>\n');
assert(my_function('POST', {'username': 'mike', password1: 'secret', password2: 'secret'}) === 'VALID: {\n    "username" : "mike" ,\n    "password1" : "secret" ,\n    "password2" : "secret"\n}');

// The empty_permitted attribute

// Sometimes (pretty much in formsets) we want to allow a form to pass validation
// if it is completely empty. We can accomplish this by using the empty_permitted
// agrument to a form constructor.

var SongForm = function() {
    this.artist = new fields.CharField();
    this.name = new fields.CharField();

    forms.Form.apply(this, arguments);
};
SongForm.prototype.__proto__ = forms.Form.prototype;

var data = {'artist': '', 'song': ''};

var f = new SongForm({data: data, empty_permitted: false});
assert(!f.is_valid());
assert(!f.cleaned_data);

var f = new SongForm({data: data, empty_permitted: true});
assert(f.is_valid());
assert(Object.isEmpty(f.errors.dict));
assert(Object.isEmpty(f.cleaned_data));
