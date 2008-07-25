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

core.modules.djang10.forms.widgets();
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