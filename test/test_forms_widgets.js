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
core.content.html();

/**
 * TextInput tests
 */
var w = new widgets.TextInput();
assert(w.render('email', '') == '<input type="text" name="email" />');
assert(w.render('email', null) == '<input type="text" name="email" />');
assert(w.render('email', 'test@example.com') == '<input type="text" name="email" value="test@example.com" />');
assert(w.render('email', 'some "quoted" & ampersanded value') == '<input type="text" name="email" value="some &quot;quoted&quot; &amp; ampersanded value" />');
assert(w.render('email', 'test@example.com', {'class': 'fun'}) == '<input type="text" name="email" class="fun" value="test@example.com" />');

// test passing attrs to constructor
var w = new widgets.TextInput({'class': 'fun'});
assert(w.render('email', '') == '<input class="fun" type="text" name="email" />');
assert(w.render('email', 'foo@example.com') == '<input class="fun" type="text" name="email" value="foo@example.com" />');

// test attr precedence
var w = new widgets.TextInput({'class': 'pretty'});
assert(w.render('email', '', {'class': 'special'}) == '<input class="special" type="text" name="email" />');

/**
 * PasswordInput tests
 */
var w = new widgets.PasswordInput()
assert(w.render('email', '') == '<input type="password" name="email" />');
assert(w.render('email', null) == '<input type="password" name="email" />');
assert(w.render('email', 'test@example.com') == '<input type="password" name="email" value="test@example.com" />');
assert(w.render('email', 'some "quoted" & ampersanded value') == '<input type="password" name="email" value="some &quot;quoted&quot; &amp; ampersanded value" />');
assert(w.render('email', 'test@example.com', {'class': 'fun'}) == '<input type="password" name="email" class="fun" value="test@example.com" />');

// test passing attrs to constructor
var w = new widgets.PasswordInput({'class': 'fun'});
assert(w.render('email', '') == '<input class="fun" type="password" name="email" />');
assert(w.render('email', 'foo@example.com') == '<input class="fun" type="password" name="email" value="foo@example.com" />');

// test attr precedence
var w = new widgets.PasswordInput({'class': 'pretty'});
assert(w.render('email', '', {'class': 'special'}) == '<input class="special" type="password" name="email" />');

// test render_value
var w = new widgets.PasswordInput({}, true);
assert(w.render('email', 'secret') == '<input type="password" name="email" value="secret" />');
var w = new widgets.PasswordInput({}, false);
assert(w.render('email', '') == '<input type="password" name="email" />');
assert(w.render('email', null) == '<input type="password" name="email" />');
assert(w.render('email', 'secret') == '<input type="password" name="email" />');
var w = new widgets.PasswordInput({'class': 'fun'}, false);
assert(w.render('email', 'secret') == '<input class="fun" type="password" name="email" />');

/**
 * HiddenInput tests
 */
var w = new widgets.HiddenInput()
assert(w.render('email', '') == '<input type="hidden" name="email" />');
assert(w.render('email', null) == '<input type="hidden" name="email" />');
assert(w.render('email', 'test@example.com') == '<input type="hidden" name="email" value="test@example.com" />');
assert(w.render('email', 'some "quoted" & ampersanded value') == '<input type="hidden" name="email" value="some &quot;quoted&quot; &amp; ampersanded value" />');
assert(w.render('email', 'test@example.com', {'class': 'fun'}) == '<input type="hidden" name="email" class="fun" value="test@example.com" />');

// test passing attrs to constructor
var w = new widgets.HiddenInput({'class': 'fun'});
assert(w.render('email', '') == '<input class="fun" type="hidden" name="email" />');
assert(w.render('email', 'foo@example.com') == '<input class="fun" type="hidden" name="email" value="foo@example.com" />');

// test attr precedence
var w = new widgets.HiddenInput({'class': 'pretty'});
assert(w.render('email', '', {'class': 'special'}) == '<input class="special" type="hidden" name="email" />');

// test boolean values
var w = new widgets.HiddenInput();
assert(w.render('get_spam', false) == '<input type="hidden" name="get_spam" value="false" />');
assert(w.render('get_spam', true) == '<input type="hidden" name="get_spam" value="true" />');

/**
 * Textarea tests
 */
var w = new widgets.Textarea();
assert(w.render('msg', '') == '<textarea rows="10" cols="40" name="msg"></textarea>');
assert(w.render('msg', None) == '<textarea rows="10" cols="40" name="msg"></textarea>');
assert(w.render('msg', 'value') == '<textarea rows="10" cols="40" name="msg">value</textarea>');
assert(w.render('msg', 'some "quoted" & ampersanded value') == '<textarea rows="10" cols="40" name="msg">some &quot;quoted&quot; &amp; ampersanded value</textarea>');
// TODO This test won't work until we have the equivalent of a mark_safe function
//assert(w.render('msg', mark_safe('pre &quot;quoted&quot; value')) == '<textarea rows="10" cols="40" name="msg">pre &quot;quoted&quot; value</textarea>');
assert(w.render('msg', 'value', {'class': 'pretty', 'rows': 20}) == '<textarea rows="20" cols="40" name="msg" class="pretty">value</textarea>');

// You can also pass 'attrs' to the constructor
var w = new widgets.Textarea({'class': 'pretty'});
assert(w.render('msg', '') == '<textarea rows="10" cols="40" class="pretty" name="msg"></textarea>');
assert(w.render('msg', 'example') == '<textarea rows="10" cols="40" class="pretty" name="msg">example</textarea>');

// 'attrs' passed to render() get precedence over those passed to the constructor:
var w = new widgets.Textarea({'class': 'pretty'});
assert(w.render('msg', '', {'class': 'special'}) == '<textarea rows="10" cols="40" class="special" name="msg"></textarea>');

/**
 * MultipleHidden tests
 */
var w = new widgets.MultipleHiddenInput();
assert(w.render('email', []) == '');
assert(w.render('email', null) == '');
assert(w.render('email', ['test@example.com']) == '<input type="hidden" name="email" value="test@example.com" />\n');
assert(w.render('email', ['some "quoted" & ampersanded value']) == '<input type="hidden" name="email" value="some &quot;quoted&quot; &amp; ampersanded value" />\n');
assert(w.render('email', ['test@example.com', 'foo@example.com']) == '<input type="hidden" name="email" value="test@example.com" />\n<input type="hidden" name="email" value="foo@example.com" />\n');
assert(w.render('email', ['test@example.com'], {'class': 'fun'}) == '<input type="hidden" name="email" class="fun" value="test@example.com" />\n');
assert(w.render('email', ['test@example.com', 'foo@example.com'], {'class': 'fun'}) == '<input type="hidden" name="email" class="fun" value="test@example.com" />\n<input type="hidden" name="email" class="fun" value="foo@example.com" />\n');

var w = new widgets.MultipleHiddenInput({'class': 'fun'})
assert(w.render('email', []) == '');
assert(w.render('email', ['test@example.com']) == '<input class="fun" type="hidden" name="email" value="test@example.com" />\n');
assert(w.render('email', ['test@example.com', 'foo@example.com']) == '<input class="fun" type="hidden" name="email" value="test@example.com" />\n<input class="fun" type="hidden" name="email" value="foo@example.com" />\n');
assert(w.render('email', ['test@example.com'], {'class': 'special'}) == '<input class="special" type="hidden" name="email" value="test@example.com" />\n')

// # FileInput Widget ############################################################

// FileInput widgets don't ever show the value, because the old value is of no use
// if you are updating the form or if the provided file generated an error.
var w = new widgets.FileInput();
assert(w.render('email', '') == '<input type="file" name="email" />');
assert(w.render('email', null) == '<input type="file" name="email" />');
assert(w.render('email', 'test@example.com') == '<input type="file" name="email" />');
assert(w.render('email', 'some "quoted" & ampersanded value') == '<input type="file" name="email" />');
assert(w.render('email', 'test@example.com', {'class': 'fun'}) == '<input type="file" name="email" class="fun" />');

// You can also pass 'attrs' to the constructor:
var w = new widgets.FileInput({'class': 'fun'});
assert(w.render('email', '') == '<input class="fun" type="file" name="email" />');
assert(w.render('email', 'foo@example.com') == '<input class="fun" type="file" name="email" />');

assert(w.render('email', 'ŠĐĆŽćžšđ', {'class': 'special'}) == '<input class="special" type="file" name="email" />');

// Test for the behavior of _has_changed for FileInput. The value of data will
// more than likely come from request.FILES. The value of initial data will
// likely be a filename stored in the database. Since its value is of no use to
// a FileInput it is ignored.

var w = new widgets.FileInput();

// # No file was uploaded and no initial data.
assert(w._has_changed('', null) == false);

// # A file was uploaded and no initial data.
assert(w._has_changed('', {'filename': 'resume.txt', 'content': 'My resume'}) == true);

// # A file was not uploaded, but there is initial data
assert(w._has_changed('resume.txt', null) == false);

// # A file was uploaded and there is initial data (file identity is not dealt
// # with here)
assert(w._has_changed('resume.txt', {'filename': 'resume.txt', 'content': 'My resume'}) == true);

// # CheckboxInput Widget ########################################################

var w = new widgets.CheckboxInput();
assert(w.render('is_cool', '') == '<input type="checkbox" name="is_cool" />');
assert(w.render('is_cool', null) == '<input type="checkbox" name="is_cool" />');
assert(w.render('is_cool', false) == '<input type="checkbox" name="is_cool" />');
assert(w.render('is_cool', true) == '<input type="checkbox" name="is_cool" checked="checked" />');

// Using any value that's not in ('', null, false, true) will check the checkbox
// and set the 'value' attribute.
assert(w.render('is_cool', 'foo') == '<input type="checkbox" name="is_cool" checked="checked" value="foo" />');

assert(w.render('is_cool', false, {'class': 'pretty'}) == '<input type="checkbox" name="is_cool" class="pretty" />');

// You can also pass 'attrs' to the constructor:
var w = new widgets.CheckboxInput({'class': 'pretty'});
assert(w.render('is_cool', '') == '<input class="pretty" type="checkbox" name="is_cool" />');

var w = new widgets.CheckboxInput({'class': 'pretty'});
assert(w.render('is_cool', '', {'class': 'special'}) == '<input class="special" type="checkbox" name="is_cool" />');

// You can pass 'check_test' to the constructor. This is a callable that takes the
// value and returns true if the box should be checked.
var w = new widgets.CheckboxInput({}, function(value) {return value.indexOf("hello") == 0;});
assert(w.render('greeting', '') == '<input type="checkbox" name="greeting" />');
assert(w.render('greeting', 'hello') == '<input type="checkbox" name="greeting" checked="checked" value="hello" />');
assert(w.render('greeting', 'hello there') == '<input type="checkbox" name="greeting" checked="checked" value="hello there" />');
assert(w.render('greeting', 'hello & goodbye') == '<input type="checkbox" name="greeting" checked="checked" value="hello &amp; goodbye" />');

// A subtlety: If the 'check_test' argument cannot handle a value and raises any
// exception during its __call__, then the exception will be swallowed and the box
// will not be checked. In this example, the 'check_test' assumes the value has a
// startswith() method, which fails for the values true, false and null.
assert(w.render('greeting', true) == '<input type="checkbox" name="greeting" />');
assert(w.render('greeting', false) == '<input type="checkbox" name="greeting" />');
assert(w.render('greeting', null) == '<input type="checkbox" name="greeting" />');

// The CheckboxInput widget will return false if the key is not found in the data
// dictionary (because HTML form submission doesn't send any result for unchecked
// checkboxes).
assert(w.value_from_datadict({}, {}, 'testing') == false);

assert(w._has_changed(null, null) == false);
assert(w._has_changed(null, '') == false);
assert(w._has_changed('', null) == false);
assert(w._has_changed('', '') == false);
assert(w._has_changed(false, 'on') == true);
assert(w._has_changed(true, 'on') == false);
assert(w._has_changed(true, '') == true);

// # Select Widget ###############################################################

var choices = {'J': 'John', 'P': 'Paul', 'G': 'George', 'R': 'Ringo'};
var choices2 = {'1': '1', '2': '2', '3':'3'};
var choices3 = {1: 1, 2: 2, 3: 3};

var w = new widgets.Select();

assert(w.render('beatle').toString() == '<select name="beatle">\n</select>');

assert(w.render('beatle', 'J', {}, choices).toString() == '<select name="beatle">\n<option value="J" selected="selected">John</option>\n<option value="P">Paul</option>\n<option value="G">George</option>\n<option value="R">Ringo</option>\n</select>');

// If the value is null, none of the options are selected:
assert(w.render('beatle', null, {}, choices).toString() == '<select name="beatle">\n<option value="J">John</option>\n<option value="P">Paul</option>\n<option value="G">George</option>\n<option value="R">Ringo</option>\n</select>');

// If the value corresponds to a label (but not to an option value), none of the options are selected:
assert(w.render('beatle', 'John', {}, choices).toString() == '<select name="beatle">\n<option value="J">John</option>\n<option value="P">Paul</option>\n<option value="G">George</option>\n<option value="R">Ringo</option>\n</select>');

// The value is compared to its str():
assert(w.render('num', 2, {}, choices2).toString() == '<select name="num">\n<option value="1">1</option>\n<option value="2" selected="selected">2</option>\n<option value="3">3</option>\n</select>');
assert(w.render('num', '2', {}, choices3).toString() == '<select name="num">\n<option value="1">1</option>\n<option value="2" selected="selected">2</option>\n<option value="3">3</option>\n</select>');
assert(w.render('num', 2, {}, choices3).toString() == '<select name="num">\n<option value="1">1</option>\n<option value="2" selected="selected">2</option>\n<option value="3">3</option>\n</select>');

// The 'choices' argument can be any iterable:
var get_choices = function() {
    var result = [];
    for (var i = 0; i < 5; i++) {
        result.push(i);
    }
    return result;
};

assert(w.render('num', 2, {}, get_choices()).toString() == '<select name="num">\n<option value="0">0</option>\n<option value="1">1</option>\n<option value="2" selected="selected">2</option>\n<option value="3">3</option>\n<option value="4">4</option>\n</select>');

/* TODO enable this test after implementing fields.ChoiceField
var things = {{'id': 1, 'name': 'And Boom'}, {'id': 2, 'name': 'One More Thing!'}};

var SomeForm = function(attrs) {
    var c = {'': '---------'};
    for (var i in things) {
        c[things[i]['id']] = things[i]['name'];
    }
    this.somechoice = new fields.ChoiceField({choices: c});
    forms.Form.call(this, attrs);
}

SomeForm.prototype.__proto__ = forms.Form.prototype;

var f = new SomeForm();
assert(f.as_table() == '<tr><th><label for="id_somechoice">Somechoice:</label></th><td><select name="somechoice" id="id_somechoice">\n<option value="" selected="selected">---------</option>\n<option value="1">And Boom</option>\n<option value="2">One More Thing!</option>\n</select></td></tr>');
assert(f.as_table() == '<tr><th><label for="id_somechoice">Somechoice:</label></th><td><select name="somechoice" id="id_somechoice">\n<option value="" selected="selected">---------</option>\n<option value="1">And Boom</option>\n<option value="2">One More Thing!</option>\n</select></td></tr>');
var f = new SomeForm({'somechoice': 2});
assert(f.as_table() == '<tr><th><label for="id_somechoice">Somechoice:</label></th><td><select name="somechoice" id="id_somechoice">\n<option value="">---------</option>\n<option value="1">And Boom</option>\n<option value="2" selected="selected">One More Thing!</option>\n</select></td></tr>');
*/

// You can also pass 'choices' to the constructor:
var w = new widgets.Select({}, choices3);
assert(w.render('num', 2).toString() == '<select name="num">\n<option value="1">1</option>\n<option value="2" selected="selected">2</option>\n<option value="3">3</option>\n</select>');

// If 'choices' is passed to both the constructor and render(), then they'll both be in the output:
assert(w.render('num', 2, {}, {4: 4, 5: 5}).toString() == '<select name="num">\n<option value="1">1</option>\n<option value="2" selected="selected">2</option>\n<option value="3">3</option>\n<option value="4">4</option>\n<option value="5">5</option>\n</select>');

// # Choices are escaped correctly
// #Won't work without mark_safe
// >>> print w.render('escape', null, choices=(('bad', 'you & me'), ('good', mark_safe('you &gt; me'))))

// # Unicode choices are correctly rendered as HTML
//assert(w.render('email', 'ŠĐĆŽćžšđ', choices=[('ŠĐĆŽćžšđ', 'ŠĐabcĆŽćžšđ'), ('ćžšđ', 'abcćžšđ')]) == '<select name="email">\n<option value="1">1</option>\n<option value="2">2</option>\n<option value="3">3</option>\n<option value="\u0160\u0110\u0106\u017d\u0107\u017e\u0161\u0111" selected="selected">\u0160\u0110abc\u0106\u017d\u0107\u017e\u0161\u0111</option>\n<option value="\u0107\u017e\u0161\u0111">abc\u0107\u017e\u0161\u0111</option>\n</select>');

// If choices is passed to the constructor and is a generator, it can be iterated
// over multiple times without getting consumed:
var w = new widgets.Select({}, get_choices());
assert(w.render('num', 2).toString() == '<select name="num">\n<option value="0">0</option>\n<option value="1">1</option>\n<option value="2" selected="selected">2</option>\n<option value="3">3</option>\n<option value="4">4</option>\n</select>');
assert(w.render('num', 3).toString() == '<select name="num">\n<option value="0">0</option>\n<option value="1">1</option>\n<option value="2">2</option>\n<option value="3" selected="selected">3</option>\n<option value="4">4</option>\n</select>');

// Choices can be nested one level in order to create HTML optgroups:
w.choices = {'outer1': 'Outer 1', 'Group "1"': {'inner1': 'Inner 1', 'inner2': 'Inner 2'}};

assert(w.render('nestchoice', null).toString() == '<select name="nestchoice">\n<option value="outer1">Outer 1</option>\n<optgroup label="Group &quot;1&quot;">\n<option value="inner1">Inner 1</option>\n<option value="inner2">Inner 2</option>\n</optgroup>\n</select>');
assert(w.render('nestchoice', 'outer1').toString() == '<select name="nestchoice">\n<option value="outer1" selected="selected">Outer 1</option>\n<optgroup label="Group &quot;1&quot;">\n<option value="inner1">Inner 1</option>\n<option value="inner2">Inner 2</option>\n</optgroup>\n</select>');
assert(w.render('nestchoice', 'inner1').toString() == '<select name="nestchoice">\n<option value="outer1">Outer 1</option>\n<optgroup label="Group &quot;1&quot;">\n<option value="inner1" selected="selected">Inner 1</option>\n<option value="inner2">Inner 2</option>\n</optgroup>\n</select>');

// # NullBooleanSelect Widget ####################################################

var w = new widgets.NullBooleanSelect();
assert(w.render('is_cool', true).toString() == '<select name="is_cool">\n<option value="1">Unknown</option>\n<option value="2" selected="selected">Yes</option>\n<option value="3">No</option>\n</select>');
assert(w.render('is_cool', false).toString() == '<select name="is_cool">\n<option value="1">Unknown</option>\n<option value="2">Yes</option>\n<option value="3" selected="selected">No</option>\n</select>');
assert(w.render('is_cool', null).toString() == '<select name="is_cool">\n<option value="1" selected="selected">Unknown</option>\n<option value="2">Yes</option>\n<option value="3">No</option>\n</select>');
assert(w.render('is_cool', '2').toString() == '<select name="is_cool">\n<option value="1">Unknown</option>\n<option value="2" selected="selected">Yes</option>\n<option value="3">No</option>\n</select>');
assert(w.render('is_cool', '3').toString() == '<select name="is_cool">\n<option value="1">Unknown</option>\n<option value="2">Yes</option>\n<option value="3" selected="selected">No</option>\n</select>');
