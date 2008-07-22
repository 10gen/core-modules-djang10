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

/**
 * TextInput tests
 */
w = new widgets.TextInput();
assert(w.render('email', '') == '<input type="text" name="email" />');
assert(w.render('email', null) == '<input type="text" name="email" />');
assert(w.render('email', 'test@example.com') == '<input type="text" name="email" value="test@example.com" />');
assert(w.render('email', 'some "quoted" & ampersanded value') == '<input type="text" name="email" value="some &quot;quoted&quot; &amp; ampersanded value" />');
assert(w.render('email', 'test@example.com', {'class': 'fun'}) == '<input type="text" name="email" class="fun" value="test@example.com" />');

// test passing attrs to constructor
w = new widgets.TextInput({'class': 'fun'});
assert(w.render('email', '') == '<input class="fun" type="text" name="email" />');
assert(w.render('email', 'foo@example.com') == '<input class="fun" type="text" name="email" value="foo@example.com" />');

// test attr precedence
w = new widgets.TextInput({'class': 'pretty'});
assert(w.render('email', '', {'class': 'special'}) == '<input class="special" type="text" name="email" />');

/**
 * PasswordInput tests
 */
w = new widgets.PasswordInput()
assert(w.render('email', '') == '<input type="password" name="email" />');
assert(w.render('email', null) == '<input type="password" name="email" />');
assert(w.render('email', 'test@example.com') == '<input type="password" name="email" value="test@example.com" />');
assert(w.render('email', 'some "quoted" & ampersanded value') == '<input type="password" name="email" value="some &quot;quoted&quot; &amp; ampersanded value" />');
assert(w.render('email', 'test@example.com', {'class': 'fun'}) == '<input type="password" name="email" class="fun" value="test@example.com" />');

// test passing attrs to constructor
w = new widgets.PasswordInput({'class': 'fun'});
assert(w.render('email', '') == '<input class="fun" type="password" name="email" />');
assert(w.render('email', 'foo@example.com') == '<input class="fun" type="password" name="email" value="foo@example.com" />');

// test attr precedence
w = new widgets.PasswordInput({'class': 'pretty'});
assert(w.render('email', '', {'class': 'special'}) == '<input class="special" type="password" name="email" />');

// test render_value
w = new widgets.PasswordInput({}, true);
assert(w.render('email', 'secret') == '<input type="password" name="email" value="secret" />');
w = new widgets.PasswordInput({}, false);
assert(w.render('email', '') == '<input type="password" name="email" />');
assert(w.render('email', null) == '<input type="password" name="email" />');
assert(w.render('email', 'secret') == '<input type="password" name="email" />');
w = new widgets.PasswordInput({'class': 'fun'}, false);
assert(w.render('email', 'secret') == '<input class="fun" type="password" name="email" />');

/**
 * HiddenInput tests
 */
w = new widgets.HiddenInput()
assert(w.render('email', '') == '<input type="hidden" name="email" />');
assert(w.render('email', null) == '<input type="hidden" name="email" />');
assert(w.render('email', 'test@example.com') == '<input type="hidden" name="email" value="test@example.com" />');
assert(w.render('email', 'some "quoted" & ampersanded value') == '<input type="hidden" name="email" value="some &quot;quoted&quot; &amp; ampersanded value" />');
assert(w.render('email', 'test@example.com', {'class': 'fun'}) == '<input type="hidden" name="email" class="fun" value="test@example.com" />');

// test passing attrs to constructor
w = new widgets.HiddenInput({'class': 'fun'});
assert(w.render('email', '') == '<input class="fun" type="hidden" name="email" />');
assert(w.render('email', 'foo@example.com') == '<input class="fun" type="hidden" name="email" value="foo@example.com" />');

// test attr precedence
w = new widgets.HiddenInput({'class': 'pretty'});
assert(w.render('email', '', {'class': 'special'}) == '<input class="special" type="hidden" name="email" />');

// test boolean values
w = new widgets.HiddenInput();
assert(w.render('get_spam', false) == '<input type="hidden" name="get_spam" value="false" />');
assert(w.render('get_spam', true) == '<input type="hidden" name="get_spam" value="true" />');

/*
    TODO write tests for the rest of the widgets.
*/