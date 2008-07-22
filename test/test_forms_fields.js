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

core.modules.djang10.forms.fields();

var assertException = function(func, thisobj) {
    exception = null;
    
    try {
        var args = Array.prototype.slice.call(arguments, 2);
        func.apply(thisobj, args);
    }
    catch (exc) {
        exception = exc;
    }
    
    assert(exception);
};

/**
 * simplePythonFormat tests
 */
assertException(fields.simplePythonFormat, null, null);
assert(fields.simplePythonFormat('') == '');
assert(fields.simplePythonFormat('hello') == 'hello');
assertException(fields.simplePythonFormat, null, 1);
assertException(fields.simplePythonFormat, null, 'hello', 5);
assert(fields.simplePythonFormat('%s %s', 'hello', 'world') == 'hello world');
assert(fields.simplePythonFormat('%(verb)s %(adverb)s', {verb: 'run', adverb: 'quickly'}) == 'run quickly');
assert(fields.simplePythonFormat('what about a number like %d?', 5) == 'what about a number like 5?');
assert(fields.simplePythonFormat('%d %i %s %r %f %%', 5, '24.00', 10, {hello: 'world'}, 5.01) == "5 24 10 { \"hello\" : \"world\"  }\n 5.01 %");
assert(fields.simplePythonFormat('%(adverb)s %(verb)s', {test: 'test', verb: 'run', adverb: 'quickly'}, 4) == 'quickly run');

/**
 * CharField tests
 */
f = new fields.CharField();
assert(f.clean(1) == '1');
assert(f.clean('hello') == 'hello');
assertException(fields.CharField.prototype.clean, f, null);
assertException(fields.CharField.prototype.clean, f, '');
assert(f.clean([1, 2, 3]) == '1,2,3');

f = new fields.CharField({required: false});
assert(f.clean(1) == '1');
assert(f.clean('hello') == 'hello');
assert(f.clean(null) == '');
assert(f.clean('') == '');
assert(f.clean([1, 2, 3]) == '1,2,3');

f = new fields.CharField({max_length: 10, required: false});
assert(f.clean('12345') == '12345');
assert(f.clean('1234567890') == '1234567890');
assertException(fields.CharField.prototype.clean, f, '1234567890a');

f = new fields.CharField({min_length: 10, required: false});
assert(f.clean('') == '');
assertException(fields.CharField.prototype.clean, f, '12345');
assert(f.clean('1234567890') == '1234567890');
assert(f.clean('1234567890a') == '1234567890a');

f = new fields.CharField({min_length: 10, required: true});
assertException(fields.CharField.prototype.clean, f, '');
assertException(fields.CharField.prototype.clean, f, '12345');
assert(f.clean('1234567890') == '1234567890');
assert(f.clean('1234567890a') == '1234567890a');

/*
    TODO Write tests for the rest of the fields
*/