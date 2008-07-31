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

var f = new fields.CharField({widget: widgets.Textarea});
assert(f.widget.constructor == widgets.Textarea);
assert(f.widget.constructor != widgets.TextInput);

// # IntegerField ################################################################

var f = new fields.IntegerField();
test.assertThrows(new util.ValidationError("This field is required."), f, fields.IntegerField.prototype.clean, '');
test.assertThrows(new util.ValidationError("This field is required."), f, fields.IntegerField.prototype.clean, null);
assert(f.clean('1') == 1);
assert(typeof(f.clean('1') ) == "number");
assert(f.clean('23') == 23);
assert(f.clean('-1') == -1);
assert(f.clean(-1) == -1);
assert(f.clean('0') == 0);
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
assert(f.clean('-1') == -1.0);
assert(f.clean('-1.2') == -1.2);
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

// # DecimalField ################################################################

var f = new fields.DecimalField({max_digits: 4, decimal_places: 2});
test.assertThrows(new util.ValidationError("This field is required."), f, fields.DecimalField.prototype.clean, '');
test.assertThrows(new util.ValidationError("This field is required."), f, fields.DecimalField.prototype.clean, null);
assert(f.clean('1') == 1.0);
assert(typeof f.clean('1') == "number");
assert(f.clean('23') == 23);
assert(f.clean('3.14') == 3.14);
assert(f.clean(3.14) == 3.14);
test.assertThrows(new util.ValidationError("Enter a number."), f, fields.DecimalField.prototype.clean, 'a');
assert(f.clean('1.0 ') == 1.0);
assert(f.clean(' 1.0') == 1.0);
assert(f.clean(' 1.0 ') == 1.0);
test.assertThrows(new util.ValidationError("Enter a number."), f, fields.DecimalField.prototype.clean, '1.0a');
test.assertThrows(new util.ValidationError("Ensure that there are no more than 4 digits in total."), f, fields.DecimalField.prototype.clean, '123.45');
test.assertThrows(new util.ValidationError("Ensure that there are no more than 2 decimal places."), f, fields.DecimalField.prototype.clean, '1.234');
test.assertThrows(new util.ValidationError("Ensure that there are no more than 2 digits before the decimal point."), f, fields.DecimalField.prototype.clean, '123.4');
assert(f.clean('-12.34') == -12.34);
test.assertThrows(new util.ValidationError("Ensure that there are no more than 4 digits in total."), f, fields.DecimalField.prototype.clean, '-123.45');
assert(f.clean('-.12') == -0.12);
assert(f.clean('-00.12') == -0.12);
assert(f.clean('-000.12') == -0.12);
test.assertThrows(new util.ValidationError("Ensure that there are no more than 2 decimal places."), f, fields.DecimalField.prototype.clean, '-000.123');
test.assertThrows(new util.ValidationError("Ensure that there are no more than 4 digits in total."), f, fields.DecimalField.prototype.clean, '-000.1234');
test.assertThrows(new util.ValidationError("Enter a number."), f, fields.DecimalField.prototype.clean, '--0.12');

var f = new fields.DecimalField({max_digits: 4, decimal_places: 2, required: false});
assert(f.clean('') == null);
assert(f.clean(null) == null);
assert(f.clean('1') == 1);

// DecimalField accepts min_value and max_value just like IntegerField:
var f = new fields.DecimalField({max_digits: 4, decimal_places: 2, max_value: 1.5, min_value: 0.5});

test.assertThrows(new util.ValidationError("Ensure this value is less than or equal to 1.5."), f, fields.DecimalField.prototype.clean, '1.6');
test.assertThrows(new util.ValidationError("Ensure this value is greater than or equal to 0.5."), f, fields.DecimalField.prototype.clean, '0.4');
assert(f.clean('1.5') == 1.5);
assert(f.clean('0.5') == 0.5);
assert(f.clean('.5') == 0.5);
assert(f.clean('00.50') == 0.50);

// # DateField ###################################################################

var f = new fields.DateField();
assert(f.clean(new Date(2006, 9, 25)) == new Date(2006, 9, 25));
assert(f.clean(Date.parse('2006-25-10 14:30')) == new Date(2006, 9, 25));
assert(f.clean(new Date(2006, 9, 25, 14, 30, 59)) == new Date(2006, 9, 25));
assert(f.clean(Date.parse('2006-25-10 14:30:59')) == new Date(2006, 9, 25));
assert(f.clean('2006-10-25') == new Date(2006, 9, 25));
assert(f.clean('10/25/2006') == new Date(2006, 9, 25));
assert(f.clean('10/25/06') == new Date(2006, 9, 25));
assert(f.clean('Oct 25 2006') == new Date(2006, 9, 25));
assert(f.clean('October 25 2006') == new Date(2006, 9, 25));
assert(f.clean('October 25, 2006') == new Date(2006, 9, 25));
assert(f.clean('25 October 2006') == new Date(2006, 9, 25));
assert(f.clean('25 October, 2006') == new Date(2006, 9, 25));
test.assertThrows(new util.ValidationError("Enter a valid date."), f, fields.DateField.prototype.clean, '2006-4-32');
test.assertThrows(new util.ValidationError("Enter a valid date."), f, fields.DateField.prototype.clean, '200a-10-25');
test.assertThrows(new util.ValidationError("Enter a valid date."), f, fields.DateField.prototype.clean, '25/10/06');
test.assertThrows(new util.ValidationError("This field is required."), f, fields.DateField.prototype.clean, null);

var f = new fields.DateField({required: false});
assert(f.clean(null) == null);
assert(f.clean('') == null);

// DateField accepts an optional input_formats parameter:
var f = new fields.DateField({input_formats: ['%Y %m %d']});
assert(f.clean(new Date(2006, 10, 25)) == new Date(2006, 10, 25));
assert(f.clean(new Date(2006, 10, 25, 14, 30)) == new Date(2006, 10, 25));
assert(f.clean('2006 10 25') == new Date(2006, 9, 25));

// The input_formats parameter overrides all default input formats,
// so the default formats won't work unless you specify them:
test.assertThrows(new util.ValidationError("Enter a valid date."), f, fields.DateField.prototype.clean, '2006-10-25');
test.assertThrows(new util.ValidationError("Enter a valid date."), f, fields.DateField.prototype.clean, '10/25/2006');
test.assertThrows(new util.ValidationError("Enter a valid date."), f, fields.DateField.prototype.clean, '10/25/06');

// # TimeField ###################################################################

var f = new fields.TimeField();
assert(f.clean(new Date(0, 0, 0, 14, 25)) == new Date(0, 0, 0, 14, 25));
assert(f.clean(new Date(0, 0, 0, 14, 25, 59)) == new Date(0, 0, 0, 14, 25, 59));
assert(f.clean('14:25') == new Date(0, 0, 0, 14, 25));
assert(f.clean('14:25:59') == new Date(0, 0, 0, 14, 25, 59));
test.assertThrows(new util.ValidationError("Enter a valid time."), f, fields.DateField.prototype.clean, 'hello');
test.assertThrows(new util.ValidationError("Enter a valid time."), f, fields.DateField.prototype.clean, '1:24 p.m.');

// TimeField accepts an optional input_formats parameter:
var f = new fields.TimeField({input_formats: ['%I:%M %p']});
assert(f.clean(new Date(2006, 5, 5, 14, 25)) == new Date(0, 0, 0, 14, 25));
assert(f.clean(new Date(0, 5, 5, 14, 25, 59)) == new Date(0, 0, 0, 14, 25, 59));
assert(f.clean('4:25 AM') == new Date(0, 0, 0, 4, 25));
assert(f.clean('4:25 PM') == new Date(0, 0, 0, 16, 25));

// The input_formats parameter overrides all default input formats,
// so the default formats won't work unless you specify them:
test.assertThrows(new util.ValidationError("Enter a valid time."), f, fields.DateField.prototype.clean, '14:30:25');

/*
    TODO Write tests for the rest of the fields
*/