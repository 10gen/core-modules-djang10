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

// # IntegerField ################################################################

var f = new fields.IntegerField();
test.assertThrows(new util.ValidationError("This field is required."), f, fields.IntegerField.prototype.clean, '');
test.assertThrows(new util.ValidationError("This field is required."), f, fields.IntegerField.prototype.clean, null);
assert(f.clean('1') == 1);
assert(typeof(f.clean('1') ) == "number");
assert(f.clean('23') == 23);
test.assertThrows(new util.ValidationError("Enter a whole number."), f, fields.IntegerField.prototype.clean, 'a');
assert(f.clean(42) == 42);
test.assertThrows(new util.ValidationError("Enter a whole number."), f, fields.IntegerField.prototype.clean, '3.14');
assert(f.clean('1 ') == 1);
assert(f.clean(' 1') == 1);
assert(f.clean(' 1 ') == 1);
test.assertThrows(new util.ValidationError("Enter a whole number."), f, fields.IntegerField.prototype.clean, '1a');

var f = new fields.IntegerField({required: false});
assert(f.clean('') == null);
assert(f.clean(null) == null);
assert(f.clean('1') == 1);
assert(typeof(f.clean('1')) == "number");
assert(f.clean('23') == 23);
test.assertThrows(new util.ValidationError("Enter a whole number."), f, fields.IntegerField.prototype.clean, 'a');
assert(f.clean('1 ') == 1);
assert(f.clean(' 1') == 1);
assert(f.clean(' 1 ') == 1);
test.assertThrows(new util.ValidationError("Enter a whole number."), f, fields.IntegerField.prototype.clean, '1a');

// IntegerField accepts an optional max_value parameter:
var f = new fields.IntegerField({max_value: 10});
test.assertThrows(new util.ValidationError("This field is required."), f, fields.IntegerField.prototype.clean, null);
assert(f.clean(1) == 1);
assert(f.clean(10) == 10);
test.assertThrows(new util.ValidationError("Ensure this value is less than or equal to 10."), f, fields.IntegerField.prototype.clean, 11);
assert(f.clean('10') == 10);
test.assertThrows(new util.ValidationError("Ensure this value is less than or equal to 10."), f, fields.IntegerField.prototype.clean, '11');

// IntegerField accepts an optional min_value parameter:
var f = new fields.IntegerField({min_value: 10});
test.assertThrows(new util.ValidationError("This field is required."), f, fields.IntegerField.prototype.clean, null);
test.assertThrows(new util.ValidationError("Ensure this value is greater than or equal to 10."), f, fields.IntegerField.prototype.clean, 1);
assert(f.clean(10) == 10);
assert(f.clean(11) == 11);
assert(f.clean('10') == 10);
assert(f.clean('11') == 11);

// min_value and max_value can be used together:
var f = new fields.IntegerField({min_value: 10, max_value: 20});
test.assertThrows(new util.ValidationError("This field is required."), f, fields.IntegerField.prototype.clean, null);
test.assertThrows(new util.ValidationError("Ensure this value is greater than or equal to 10."), f, fields.IntegerField.prototype.clean, 1);
assert(f.clean(10) == 10);
assert(f.clean(11) == 11);
assert(f.clean('10') == 10);
assert(f.clean('11') == 11);
assert(f.clean(20) == 20);
test.assertThrows(new util.ValidationError("Ensure this value is less than or equal to 20."), f, fields.IntegerField.prototype.clean, 21);

// # FloatField ##################################################################

var f = new fields.FloatField();
test.assertThrows(new util.ValidationError("This field is required."), f, fields.FloatField.prototype.clean, '');
test.assertThrows(new util.ValidationError("This field is required."), f, fields.FloatField.prototype.clean, null);
assert(f.clean('1') == 1.0);
assert(typeof f.clean('1') == 'number');
assert(f.clean('23') == 23.0);
assert(f.clean('3.14') == 3.1400000000000001);
assert(f.clean(3.14) == 3.1400000000000001);
assert(f.clean(42) == 42.0);
test.assertThrows(new util.ValidationError("Enter a number."), f, fields.FloatField.prototype.clean, 'a');
assert(f.clean('1.0 ') == 1.0);
assert(f.clean(' 1.0') == 1.0);
assert(f.clean(' 1.0 ') == 1.0);
test.assertThrows(new util.ValidationError("Enter a number."), f, fields.FloatField.prototype.clean, '1.0a');

var f = new fields.FloatField({required: false});
assert(f.clean('') == null);
assert(f.clean(null) == null);
assert(f.clean('1') == 1.0);

// FloatField accepts min_value and max_value just like IntegerField:
var f = new fields.FloatField({max_value: 1.5, min_value: 0.5});
test.assertThrows(new util.ValidationError("Ensure this value is less than or equal to 1.5."), f, fields.FloatField.prototype.clean, '1.6');
test.assertThrows(new util.ValidationError("Ensure this value is greater than or equal to 0.5."), f, fields.FloatField.prototype.clean, '0.4');
assert(f.clean('1.5') == 1.5);
assert(f.clean('0.5') == 0.5);

/*
    TODO Write tests for the rest of the fields
*/