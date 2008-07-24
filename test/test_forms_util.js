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
assert(util.simplePythonFormat('%(verb)s %(adverb)s', {verb: 'run', adverb: 'quickly'}) == 'run quickly');
assert(util.simplePythonFormat('what about a number like %d?', 5) == 'what about a number like 5?');
assert(util.simplePythonFormat('%d %i %s %r %f %%', 5, '24.00', 10, {hello: 'world'}, 5.01) == "5 24 10 { \"hello\" : \"world\"  }\n 5.01 %");
assert(util.simplePythonFormat('%(adverb)s %(verb)s', {test: 'test', verb: 'run', adverb: 'quickly'}, 4) == 'quickly run');
assert(util.simplePythonFormat('%s', '') == '');
/*
    TODO better test coverage for simplePythonFormat
*/

/**
 * flatatt tests
 */
assert(util.flatatt({}) == "");
assert(util.flatatt({'id': "header"}) == 'id="header"');
assert(util.flatatt({"class": "news", "title": "Read this"}) == 'class="news" title="Read this"');

/**
 * ErrorList tests
 */
e = new util.ErrorList();
assert(e.as_ul() == '');
assert(e.as_text() == '');

e = new util.ErrorList([]);
assert(e.as_ul() == '');
assert(e.as_text() == '');

test.assertThrows(new util.Error('Attempting to create ErrorList from non-Array.'), {}, util.ErrorList, {});
test.assertThrows(new util.Error('Attempting to create ErrorList from non-Array.'), {}, util.ErrorList, 10);

e = new util.ErrorList(['an error']);
assert(e.as_ul() == '<ul class="errorlist"><li>an error</li></ul>');
assert(e.as_text() == '* an error\n');
assert("" + e == e.as_ul());

e = new util.ErrorList(['an error', 'another']);
assert(e.as_ul() == '<ul class="errorlist"><li>an error</li><li>another</li></ul>');
assert(e.as_text() == '* an error\n* another\n');

/**
 * ErrorDict tests
 */
e = new util.ErrorDict();
assert(e.as_ul() == '');
assert(e.as_text() == '');

e = new util.ErrorDict({});
assert(e.as_ul() == '');
e = new util.ErrorDict([]);
assert(e.as_text() == '');

test.assertThrows(new util.Error('Attempting to create ErrorDict from non-mapping type.'), {}, util.ErrorDict, 5);
test.assertThrows(new util.Error('Attempting to create ErrorDict from non-mapping type.'), {}, util.ErrorDict, 'hi');

e = new util.ErrorDict(['an error']);
assert(e.as_text() == '* 0\n');

e = new util.ErrorDict({hello: "world"});
assert(e.as_ul() == '<ul class="errorlist"><li>helloworld</li></ul>');
assert(e.as_text() == '* hello\n');

e = new util.ErrorDict({hello: "world", other: {test: "test", obj: "obj", toString: function() {return " stuff"}}});
assert(e.as_ul() == '<ul class="errorlist"><li>helloworld</li><li>other stuff</li></ul>');
assert(e.as_text() == '* hello\n* other\n  * test\n  * obj\n  * \nfunction () {\n    return \" stuff\";\n}\n\n');
assert("" + e == e.as_ul());
