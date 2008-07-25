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
core.modules.djang10.test.test();

/**
 * CharField tests
 */
var f = new fields.CharField();
assert(f.clean(1) == '1');
assert(f.clean('hello') == 'hello');
test.assertThrows(new util.ValidationError("This field is required."), f, fields.CharField.prototype.clean, null);
test.assertThrows(new util.ValidationError("This field is required."), f, fields.CharField.prototype.clean, '');
assert(f.clean([1, 2, 3]) == '1,2,3');

var f = new fields.CharField({required: false});
assert(f.clean(1) == '1');
assert(f.clean('hello') == 'hello');
assert(f.clean(null) == '');
assert(f.clean('') == '');
assert(f.clean([1, 2, 3]) == '1,2,3');

var f = new fields.CharField({max_length: 10, required: false});
assert(f.clean('12345') == '12345');
assert(f.clean('1234567890') == '1234567890');
test.assertThrows(new util.ValidationError("Ensure this value has at most 10 characters (it has 11)."), f, fields.CharField.prototype.clean, '1234567890a');

var f = new fields.CharField({min_length: 10, required: false});
assert(f.clean('') == '');
test.assertException(f, fields.CharField.prototype.clean, '12345');
assert(f.clean('1234567890') == '1234567890');
assert(f.clean('1234567890a') == '1234567890a');

var f = new fields.CharField({min_length: 10, required: true});
test.assertThrows(new util.ValidationError("This field is required."), f, fields.CharField.prototype.clean, '');
test.assertThrows(new util.ValidationError("Ensure this value has at least 10 characters (it has 5)."), f, fields.CharField.prototype.clean, '12345');
assert(f.clean('1234567890') == '1234567890');
assert(f.clean('1234567890a') == '1234567890a');

/*
    TODO Write tests for the rest of the fields
*/