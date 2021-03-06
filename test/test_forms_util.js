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

core.modules.djang10.forms.util();
core.modules.djang10.test.test();

/**
 * strptime tests
 */
assert(util.strptime("30 Nov 00", "%d %b %y") == new Date(2000, 10, 30));
test.assertThrows(new util.ValueError("Date string did not match format."), null, util.strptime, "", "%d %b %y");
test.assertThrows(new util.ValueError("Date string did not match format."), null, util.strptime, "30 Nov 00 7:59", "%d %b %y");
test.assertThrows(new util.ValueError("Date string did not match format."), null, util.strptime, "30 Nove 00", "%d %b %y");
test.assertThrows(new util.ValueError("Date string did not match format."), null, util.strptime, "32 Nov 00", "%d %b %y");
test.assertThrows(new util.ValueError("First argument to strptime must be of type string."), null, util.strptime, 10, "%d %b %y");
test.assertThrows(new util.ValueError("Second argument to strptime must be of type string."), null, util.strptime, "30 Nov 00", 10);
test.assertThrows(new util.ValueError("First argument to strptime must be of type string."), null, util.strptime);
test.assertThrows(new util.ValueError("Unrecognized or unimplemented directive %t."), null, util.strptime, "30 Nov 00", "%d %t %y");
assert(util.strptime("Mon Jun 28 8:20:01 2008") == new Date(2008, 5, 28, 8, 20, 01));
assert(util.strptime("30 november 2000", "%d %B %Y") == new Date(2000, 10, 30));
assert(util.strptime("8:00 sec-12", "%H:%M sec-%S") == new Date(1900, 0, 1, 8, 0, 12));
assert(util.strptime("08:00 AM", "%I:%M %p") == new Date(1900, 0, 1, 8, 0));
assert(util.strptime("Mon 08:12 pm", "%a %I:%M %p") == new Date(1900, 0, 1, 20, 12));
assert(util.strptime("monday a", "%A a") == new Date(1900, 0, 1, 0, 0));
assert(util.strptime("\w", "\w") == new Date(1900, 0, 1, 0, 0));
test.assertThrows(new util.ValueError("Date string did not match format."), null, util.strptime, "a", "\w");
test.assertThrows(new util.ValueError("Date string did not match format."), null, util.strptime, "\w", "a");
assert(util.strptime("11 08", "%m %y") == new Date(2008, 10, 1));

/**
 * conditional_escape tests
 */
assert(util.conditional_escape("") == "");
assert(util.conditional_escape(null) == "");
assert(util.conditional_escape(10) == "10");
assert(util.conditional_escape("hello") == "hello");
assert(util.conditional_escape("hello & goodbye") == "hello &amp; goodbye");
assert(util.conditional_escape(djang10.mark_safe("hello &amp; goodbye")) == "hello &amp; goodbye");

/**
 * bool tests
 */
assert(util.bool() === false);
assert(util.bool(null) === false);
assert(util.bool('') === false);
assert(util.bool(0) === false);
assert(util.bool(false) === false);
assert(util.bool(10) === true);
assert(util.bool(-1) === true);
assert(util.bool("hello") === true);

/**
 * simplePythonFormat tests
 */
test.assertThrows(new util.FormatterError('Message must be of type string.'), null, util.simplePythonFormat, null);
assert(util.simplePythonFormat('') == '');
assert(util.simplePythonFormat('hello') == 'hello');
test.assertThrows(new util.FormatterError('Message must be of type string.'), null, util.simplePythonFormat, 1);
test.assertThrows(new util.FormatterError('Not enough arguments to replace all conversion specifiers.'), null, util.simplePythonFormat, 'hello %d');
test.assertThrows(new util.FormatterError('Not enough arguments to replace all conversion specifiers.'), null, util.simplePythonFormat, 'hello %d %s', "100 s");
test.assertThrows(new util.FormatterError('Could not find mapping for key: dog'), null, util.simplePythonFormat, '%(cat)s and %(dog)s', {cat: "tom", mouse: "jerry"});
test.assertThrows(new util.FormatterError('Unexpected conversion type: c'), null, util.simplePythonFormat, 'hello %c', 'd');
assert(util.simplePythonFormat('%s %s', 'hello', 'world') == 'hello world');
assert(util.simplePythonFormat('run %(adverb)s', {verb: 'run', adverb: 'quickly'}) == 'run quickly');
assert(util.simplePythonFormat('%(verb)s %(adverb)s', {verb: 'run', adverb: 'quickly'}) == 'run quickly');
assert(util.simplePythonFormat('what about a number like %d?', 5) == 'what about a number like 5?');
assert(util.simplePythonFormat('%d %i %s %r %f %%', 5, '24.00', 10, {hello: 'world'}, 5.01) == "5 24 10 {\n    \"hello\" : \"world\"\n} 5.01 %");
assert(util.simplePythonFormat('%(adverb)s %(verb)s', {test: 'test', verb: 'run', adverb: 'quickly'}, 4) == 'quickly run');
assert(util.simplePythonFormat('%s', '') == '');
assert(util.simplePythonFormat('%d', '25is a number') == '25');
assert(util.simplePythonFormat('%f', '25is a number') == '25');
assert(util.simplePythonFormat('%f', '25.42is a decimal') == '25.42');
assert(util.simplePythonFormat('%s %% %s', 25.42, 25) == '25.42 % 25');

/**
 * flatatt tests
 */
assert(util.flatatt({}) == "");
assert(util.flatatt({'id': "header"}) == 'id="header"');
assert(util.flatatt({"class": "news", "title": "Read this"}) == 'class="news" title="Read this"');

/**
 * ErrorList tests
 */
var e = new util.ErrorList();
assert(e.as_ul() == '');
assert(e.as_text() == '');

var e = new util.ErrorList([]);
assert(e.as_ul() == '');
assert(e.as_text() == '');
e.extend(['an error']);
assert(e.as_ul() == '<ul class="errorlist"><li>an error</li></ul>');
assert(e.as_text() == '* an error\n');
e.extend(new util.ErrorList(['another', 'and another']));
assert(e.as_ul() == '<ul class="errorlist"><li>an error</li><li>another</li><li>and another</li></ul>');
assert(e.as_text() == '* an error\n* another\n* and another\n');

test.assertThrows(new util.Error('Attempting to create ErrorList from non-Array.'), {}, util.ErrorList, {});
test.assertThrows(new util.Error('Attempting to create ErrorList from non-Array.'), {}, util.ErrorList, 10);

var e = new util.ErrorList(['an error']);
assert(e.as_ul() == '<ul class="errorlist"><li>an error</li></ul>');
assert(e.as_text() == '* an error\n');
assert("" + e == e.as_ul());

var e = new util.ErrorList(['an error', 'another']);
assert(e.as_ul() == '<ul class="errorlist"><li>an error</li><li>another</li></ul>');
assert(e.as_text() == '* an error\n* another\n');

var e = new util.ErrorList(new util.ErrorList(['an error', 'another']));
assert(e.as_ul() == '<ul class="errorlist"><li>an error</li><li>another</li></ul>');
assert(e.as_text() == '* an error\n* another\n');

/**
 * ErrorDict tests
 */
var e = new util.ErrorDict();
assert(e.as_ul() == '');
assert(e.as_text() == '');

var e = new util.ErrorDict({});
assert(e.as_ul() == '');
var e = new util.ErrorDict([]);
assert(e.as_text() == '');

test.assertThrows(new util.Error('Attempting to create ErrorDict from non-mapping type.'), {}, util.ErrorDict, 5);
test.assertThrows(new util.Error('Attempting to create ErrorDict from non-mapping type.'), {}, util.ErrorDict, 'hi');

var e = new util.ErrorDict(['an error']);
assert(e.as_text() == '* 0\n');

var e = new util.ErrorDict({hello: "world"});
assert(e.as_ul() == '<ul class="errorlist"><li>helloworld</li></ul>');
assert(e.as_text() == '* hello\n');

var e = new util.ErrorDict({hello: "world", other: {test: "test", obj: "obj", toString: function() {return " stuff"}}});
assert(e.as_ul() == '<ul class="errorlist"><li>helloworld</li><li>other stuff</li></ul>');
assert(e.as_text() == '* hello\n* other\n  * test\n  * obj\n  * \nfunction () {\n    return \" stuff\";\n}\n\n');
assert("" + e == e.as_ul());

/**
 * ValidationError tests
 */

assert("" + new util.ValidationError("There was an error.").message == '<ul class="errorlist"><li>There was an error.</li></ul>');
assert("" + new util.ValidationError(["Error one.", "Error two."]).message == '<ul class="errorlist"><li>Error one.</li><li>Error two.</li></ul>');

var VeryBadError = function() {};
VeryBadError.prototype.toString = function() {return "A very bad error.";};

assert("" + new util.ValidationError(new VeryBadError()).message == '<ul class="errorlist"><li>A very bad error.</li></ul>');
assert("" + new util.ValidationError({hello: " world"}).message == '<ul class="errorlist"><li>[object Object]</li></ul>');
