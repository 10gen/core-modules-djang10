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
core.file.file();

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

// # DateTimeField ###############################################################

var f = new fields.DateTimeField();
assert(f.clean(new Date(2006, 9, 25)) == new Date(2006, 9, 25, 0, 0));
assert(f.clean(new Date(2006, 9, 25, 14, 30)) == new Date(2006, 9, 25, 14, 30));
assert(f.clean(new Date(2006, 9, 25, 14, 30, 59)) == new Date(2006, 9, 25, 14, 30, 59));
assert(f.clean('2006-10-25 14:30:45') == new Date(2006, 9, 25, 14, 30, 45));
assert(f.clean('2006-10-25 14:30:00') == new Date(2006, 9, 25, 14, 30));
assert(f.clean('2006-10-25 14:30') == new Date(2006, 9, 25, 14, 30));
assert(f.clean('2006-10-25') == new Date(2006, 9, 25, 0, 0));
assert(f.clean('10/25/2006 14:30:45') == new Date(2006, 9, 25, 14, 30, 45));
assert(f.clean('10/25/2006 14:30:00') == new Date(2006, 9, 25, 14, 30));
assert(f.clean('10/25/2006 14:30') == new Date(2006, 9, 25, 14, 30));
assert(f.clean('10/25/2006') == new Date(2006, 9, 25, 0, 0));
assert(f.clean('10/25/06 14:30:45') == new Date(2006, 9, 25, 14, 30, 45));
assert(f.clean('10/25/06 14:30:00') == new Date(2006, 9, 25, 14, 30));
assert(f.clean('10/25/06 14:30') == new Date(2006, 9, 25, 14, 30));
assert(f.clean('10/25/06') == new Date(2006, 9, 25, 0, 0));
test.assertThrows(new util.ValidationError("Enter a valid date/time."), f ,fields.DateTimeField.prototype.clean, 'hello');
test.assertThrows(new util.ValidationError("Enter a valid date/time."), f ,fields.DateTimeField.prototype.clean, '2006-10-25 4:30 p.m.');

// DateField accepts an optional input_formats parameter:
var f = new fields.DateTimeField({input_formats: ['%Y %m %d %I:%M %p']});
assert(f.clean(new Date(2006, 9, 25)) == new Date(2006, 9, 25, 0, 0));
assert(f.clean(new Date(2006, 9, 25, 14, 30)) == new Date(2006, 9, 25, 14, 30));
assert(f.clean(new Date(2006, 9, 25, 14, 30, 59)) == new Date(2006, 9, 25, 14, 30, 59));
assert(f.clean('2006 10 25 2:30 PM') == new Date(2006, 9, 25, 14, 30));

// The input_formats parameter overrides all default input formats,
// so the default formats won't work unless you specify them:
test.assertThrows(new util.ValidationError("Enter a valid date/time."), f ,fields.DateTimeField.prototype.clean, '2006-10-25 14:30:45');

var f = new fields.DateTimeField({required: false});
assert(f.clean(null) == null);
assert(f.clean('') == null);

// # RegexField ##################################################################

var f = new fields.RegexField({regex: '^\\d[A-F]\\d$'});
assert(f.clean('2A2') == '2A2');
assert(f.clean('3F3') == '3F3');
test.assertThrows(new util.ValidationError("Enter a valid value."), f, fields.RegexField.prototype.clean, '3G3');
test.assertThrows(new util.ValidationError("Enter a valid value."), f, fields.RegexField.prototype.clean, ' 2A2');
test.assertThrows(new util.ValidationError("Enter a valid value."), f, fields.RegexField.prototype.clean, '2A2 ');
test.assertThrows(new util.ValidationError("This field is required."), f, fields.RegexField.prototype.clean, '');

var f = new fields.RegexField({regex: '^\\d[A-F]\\d$', required: false});
assert(f.clean('2A2') == '2A2');
assert(f.clean('3F3') == '3F3');
test.assertThrows(new util.ValidationError("Enter a valid value."), f, fields.RegexField.prototype.clean, '3G3');
assert(f.clean('') == '');

// Alternatively, RegexField can take a compiled regular expression:
var f = new fields.RegexField({regex: RegExp('^\\d[A-F]\\d$')});
assert(f.clean('2A2') == '2A2');
assert(f.clean('3F3') == '3F3');
test.assertThrows(new util.ValidationError("Enter a valid value."), f, fields.RegexField.prototype.clean, '3G3');
test.assertThrows(new util.ValidationError("Enter a valid value."), f, fields.RegexField.prototype.clean, ' 2A2');
test.assertThrows(new util.ValidationError("Enter a valid value."), f, fields.RegexField.prototype.clean, '2A2 ');

// RegexField takes an optional error_message argument:
var f = new fields.RegexField({regex: /^\d\d\d\d$/, error_message: 'Enter a four-digit number.'});
assert(f.clean('1234') == '1234');
test.assertThrows(new util.ValidationError("Enter a four-digit number."), f, fields.RegexField.prototype.clean, '123');
test.assertThrows(new util.ValidationError("Enter a four-digit number."), f, fields.RegexField.prototype.clean, 'abcd');

// RegexField also access min_length and max_length parameters, for convenience.
var f = new fields.RegexField({regex: '^\\d+$', min_length: 5, max_length: 10});
test.assertThrows(new util.ValidationError("Ensure this value has at least 5 characters (it has 3)."), f, fields.RegexField.prototype.clean, '123');
test.assertThrows(new util.ValidationError("Ensure this value has at least 5 characters (it has 3)."), f, fields.RegexField.prototype.clean, 'abc');
assert(f.clean('12345') == '12345');
assert(f.clean('1234567890') == '1234567890');
test.assertThrows(new util.ValidationError("Ensure this value has at most 10 characters (it has 11)."), f, fields.RegexField.prototype.clean, '12345678901');
test.assertThrows(new util.ValidationError("Enter a valid value."), f, fields.RegexField.prototype.clean, '12345a');

// # EmailField ##################################################################

var f = new fields.EmailField();
test.assertThrows(new util.ValidationError("This field is required."), f, fields.EmailField.prototype.clean, '');
test.assertThrows(new util.ValidationError("This field is required."), f, fields.EmailField.prototype.clean, null);
assert(f.clean('person@example.com') == 'person@example.com');
test.assertThrows(new util.ValidationError("Enter a valid e-mail address."), f, fields.EmailField.prototype.clean, 'foo');
test.assertThrows(new util.ValidationError("Enter a valid e-mail address."), f, fields.EmailField.prototype.clean, 'foo@');
test.assertThrows(new util.ValidationError("Enter a valid e-mail address."), f, fields.EmailField.prototype.clean, 'foo@bar');

var f = new fields.EmailField({required: false});
assert(f.clean('') == '');
assert(f.clean(null) == '');
assert(f.clean('person@example.com') == 'person@example.com');
test.assertThrows(new util.ValidationError("Enter a valid e-mail address."), f, fields.EmailField.prototype.clean, 'foo');
test.assertThrows(new util.ValidationError("Enter a valid e-mail address."), f, fields.EmailField.prototype.clean, 'foo@');
test.assertThrows(new util.ValidationError("Enter a valid e-mail address."), f, fields.EmailField.prototype.clean, 'foo@bar');

// EmailField also access min_length and max_length parameters, for convenience.
var f = new fields.EmailField({min_length: 10, max_length: 15});
test.assertThrows(new util.ValidationError("Ensure this value has at least 10 characters (it has 9)."), f, fields.EmailField.prototype.clean, 'a@foo.com');
assert(f.clean('alf@foo.com') == 'alf@foo.com');
test.assertThrows(new util.ValidationError("Ensure this value has at most 15 characters (it has 20)."), f, fields.EmailField.prototype.clean, 'alf123456789@foo.com');

// # FileField ##################################################################

var f = new fields.FileField();
test.assertThrows(new util.ValidationError("This field is required."), f, fields.FileField.prototype.clean, '');
test.assertThrows(new util.ValidationError("This field is required."), f, fields.FileField.prototype.clean, '', '');
assert(f.clean('', 'files/test1.pdf') == 'files/test1.pdf');

test.assertThrows(new util.ValidationError("This field is required."), f, fields.FileField.prototype.clean, null);
test.assertThrows(new util.ValidationError("This field is required."), f, fields.FileField.prototype.clean, null, '');
assert(f.clean(null, 'files/test2.pdf') == 'files/test2.pdf');

test.assertThrows(new util.ValidationError("No file was submitted. Check the encoding type on the form."), f, fields.FileField.prototype.clean, openFile(''));
test.assertThrows(new util.ValidationError("No file was submitted. Check the encoding type on the form."), f, fields.FileField.prototype.clean, openFile(''), '');
assert(f.clean(null, 'files/test3.pdf') == 'files/test3.pdf');

test.assertThrows(new util.ValidationError("No file was submitted. Check the encoding type on the form."), f, fields.FileField.prototype.clean, 'Some content that is not a file');

test.assertThrows(new util.ValidationError("The submitted file is empty."), f, fields.FileField.prototype.clean, openFile('name'), null);
test.assertThrows(new util.ValidationError("The submitted file is empty."), f, fields.FileField.prototype.clean, openFile('name'), '');

var f = new fields.FileField({required: false});
assert(f.clean('') === null);
assert(f.clean('', '') === null);

var fakeFile = openFile('name');
fakeFile.length = 20;

assert((f.clean(fakeFile)).constructor === File);
assert((f.clean(fakeFile, 'files/test4.pdf')).constructor === File);

// # URLField ##################################################################

var f = new fields.URLField();
test.assertThrows(new util.ValidationError("This field is required."), f, fields.URLField.prototype.clean, '');
test.assertThrows(new util.ValidationError("This field is required."), f, fields.URLField.prototype.clean, null);
assert(f.clean('http://localhost') == 'http://localhost/');
assert(f.clean('http://example.com') == 'http://example.com/');
assert(f.clean('http://www.example.com') == 'http://www.example.com/');
assert(f.clean('http://www.example.com:8000/test') == 'http://www.example.com:8000/test');
assert(f.clean('http://200.8.9.10') == 'http://200.8.9.10/');
assert(f.clean('http://200.8.9.10:8000/test') == 'http://200.8.9.10:8000/test');
test.assertThrows(new util.ValidationError("Enter a valid URL."), f, fields.URLField.prototype.clean, 'foo');
test.assertThrows(new util.ValidationError("Enter a valid URL."), f, fields.URLField.prototype.clean, 'http://');
test.assertThrows(new util.ValidationError("Enter a valid URL."), f, fields.URLField.prototype.clean, 'http://example');
test.assertThrows(new util.ValidationError("Enter a valid URL."), f, fields.URLField.prototype.clean, 'http://example.');
test.assertThrows(new util.ValidationError("Enter a valid URL."), f, fields.URLField.prototype.clean, 'http://.com');

var f = new fields.URLField({required: false});
assert(f.clean('') == '');
assert(f.clean(null) == '');
assert(f.clean('http://example.com') == 'http://example.com/');
assert(f.clean('http://www.example.com') == 'http://www.example.com/');
test.assertThrows(new util.ValidationError("Enter a valid URL."), f, fields.URLField.prototype.clean, 'foo');
test.assertThrows(new util.ValidationError("Enter a valid URL."), f, fields.URLField.prototype.clean, 'http://');
test.assertThrows(new util.ValidationError("Enter a valid URL."), f, fields.URLField.prototype.clean, 'http://example');
test.assertThrows(new util.ValidationError("Enter a valid URL."), f, fields.URLField.prototype.clean, 'http://example.');
test.assertThrows(new util.ValidationError("Enter a valid URL."), f, fields.URLField.prototype.clean, 'http://.com');

// URLField takes an optional verify_exists parameter, which is false by default.
// This verifies that the URL is live on the Internet and doesn't return a 404 or 500:
var f = new fields.URLField({verify_exists: true});
assert(f.clean('http://www.google.com') == 'http://www.google.com/');
test.assertThrows(new util.ValidationError("Enter a valid URL."), f, fields.URLField.prototype.clean, 'http://example');
test.assertThrows(new util.ValidationError("This URL appears to be a broken link."), f, fields.URLField.prototype.clean, 'http://www.broken.djangoproject.com');
test.assertThrows(new util.ValidationError("This URL appears to be a broken link."), f, fields.URLField.prototype.clean, 'http://www.google.com/we-love-microsoft.html');
test.assertThrows(new util.ValidationError("This URL appears to be a broken link."), f, fields.URLField.prototype.clean, 'www.a-really-long-url-that-probably-doesnt-exist-aseonuthaesnuothaeusnathua.com');

var f = new fields.URLField({verify_exists: true, required: false});
assert(f.clean('') == '');
assert(f.clean('http://www.google.com') == 'http://www.google.com/');

// URLField also access min_length and max_length parameters, for convenience.
var f = new fields.URLField({min_length: 15, max_length: 20});
test.assertThrows(new util.ValidationError("Ensure this value has at least 15 characters (it has 13)."), f, fields.URLField.prototype.clean, 'http://f.com');
assert(f.clean('http://example.com') == 'http://example.com/');
test.assertThrows(new util.ValidationError("Ensure this value has at most 20 characters (it has 38)."), f, fields.URLField.prototype.clean, 'http://abcdefghijklmnopqrstuvwxyz.com');

// URLField should prepend 'http://' if no scheme was given
var f = new fields.URLField({required: false});
assert(f.clean('example.com') == 'http://example.com/');
assert(f.clean('') == '');
assert(f.clean('https://example.com') == 'https://example.com/');

// URLField should append '/' if no path was given
var f = new fields.URLField();
assert(f.clean('http://example.com') == 'http://example.com/');

// URLField shouldn't change the path if it was given
assert(f.clean('http://example.com/test') == 'http://example.com/test');

// # BooleanField ################################################################

var f = new fields.BooleanField();
test.assertThrows(new util.ValidationError('This field is required.'), f, fields.BooleanField.prototype.clean, '');
test.assertThrows(new util.ValidationError('This field is required.'), f, fields.BooleanField.prototype.clean, null);
assert(f.clean(true) === true);
test.assertThrows(new util.ValidationError('This field is required.'), f, fields.BooleanField.prototype.clean, false);
assert(f.clean(1) === true);
test.assertThrows(new util.ValidationError('This field is required.'), f, fields.BooleanField.prototype.clean, 0);
assert(f.clean('Django rocks') === true);
assert(f.clean('true') === true);
test.assertThrows(new util.ValidationError('This field is required.'), f, fields.BooleanField.prototype.clean, 'false');

var f = new fields.BooleanField({required: false});
assert(f.clean('') === false);
assert(f.clean(null) === false);
assert(f.clean(true) === true);
assert(f.clean(false) === false);
assert(f.clean(1) === true);
assert(f.clean(0) === false);
assert(f.clean('Djang10 rocks') === true);

// A form's BooleanField with a hidden widget will output the string 'false', so
// that should clean to the boolean value false:
assert(f.clean('false') === false);

// # ChoiceField #################################################################

var choices = {'1': 'One', '2': 'Two'};

var f = new fields.ChoiceField({choices: choices});
test.assertThrows(new util.ValidationError('This field is required.'), f, fields.ChoiceField.prototype.clean, '');
test.assertThrows(new util.ValidationError('This field is required.'), f, fields.ChoiceField.prototype.clean, null);
assert(f.clean(1) === '1');
assert(f.clean('1') === '1');
test.assertThrows(new util.ValidationError('Select a valid choice. 3 is not one of the available choices.'), f, fields.ChoiceField.prototype.clean, '3');

var f = new fields.ChoiceField({choices: choices, required: false});
assert(f.clean('') === '');
assert(f.clean(null) === '');
assert(f.clean(1) === '1');
assert(f.clean('1') === '1');
test.assertThrows(new util.ValidationError('Select a valid choice. 3 is not one of the available choices.'), f, fields.ChoiceField.prototype.clean, '3');

var f = new fields.ChoiceField({choices: {'J': 'John', 'P': 'Paul'}});
assert(f.clean('J') === 'J');
test.assertThrows(new util.ValidationError('Select a valid choice. John is not one of the available choices.'), f, fields.ChoiceField.prototype.clean, 'John');

var f = new fields.ChoiceField({choices: {'Numbers': choices, 'Letters': {'3': 'A', '4': 'B'}, '5': 'Other'}});
assert(f.clean(1) === '1');
assert(f.clean('1') === '1');
assert(f.clean(3) === '3');
assert(f.clean('3') === '3');
assert(f.clean(5) === '5');
assert(f.clean('5') === '5');
test.assertThrows(new util.ValidationError('Select a valid choice. 6 is not one of the available choices.'), f, fields.ChoiceField.prototype.clean, '6');

// # NullBooleanField ############################################################

var f = new fields.NullBooleanField();
assert(f.clean('') == null);
assert(f.clean(true) == true);
assert(f.clean(false) == false);
assert(f.clean(null) == null);
assert(f.clean('1') == null);
assert(f.clean('2') == null);
assert(f.clean('3') == null);
assert(f.clean('hello') == null);

// # MultipleChoiceField #########################################################

var f = new fields.MultipleChoiceField({choices: choices});
test.assertThrows(new util.ValidationError('This field is required.'), f, fields.MultipleChoiceField.clean, '');
test.assertThrows(new util.ValidationError('This field is required.'), f, fields.MultipleChoiceField.clean, null);
assert(f.clean([1])[0] === ['1'][0]);
assert(f.clean(['1'])[0] === ['1'][0]);
assert(f.clean(['1', '2'])[0] === ['1', '2'][0]);
assert(f.clean(['1', '2'])[1] === ['1', '2'][1]);
assert(f.clean([1, '2'])[0] === ['1', '2'][0]);
assert(f.clean([1, '2'])[1] === ['1', '2'][1]);
assert(f.clean([1, '2']).length === ['1', '2'].length);
assert(f.clean({a: 1, b: '2'})[0] === ['1', '2'][0]);
assert(f.clean({a: 1, b: '2'})[1] === ['1', '2'][1]);
assert(f.clean({a: 1, b: '2'}).length === ['1', '2'].length);
test.assertThrows(new util.ValidationError('Enter a list of values.'), f, fields.MultipleChoiceField.clean, 'hello');
test.assertThrows(new util.ValidationError('This field is required.'), f, fields.MultipleChoiceField.clean, []);
test.assertThrows(new util.ValidationError('This field is required.'), f, fields.MultipleChoiceField.clean, {});
test.assertThrows(new util.ValidationError('Select a valid choice. 3 is not one of the available choices.'), f, fields.MultipleChoiceField.clean, ['3']);

var f = new fields.MultipleChoiceField({choices: choices, required: false});
assert(f.clean('').length === 0);
assert(f.clean(null).length === 0);
assert(f.clean([1])[0] === ['1'][0]);
assert(f.clean(['1'])[0] === ['1'][0]);
assert(f.clean(['1', '2'])[0] === ['1', '2'][0]);
assert(f.clean(['1', '2'])[1] === ['1', '2'][1]);
assert(f.clean([1, '2'])[0] === ['1', '2'][0]);
assert(f.clean([1, '2'])[1] === ['1', '2'][1]);
assert(f.clean([1, '2']).length === ['1', '2'].length);
assert(f.clean({a: 1, b: '2'})[0] === ['1', '2'][0]);
assert(f.clean({a: 1, b: '2'})[1] === ['1', '2'][1]);
assert(f.clean({a: 1, b: '2'}).length === ['1', '2'].length);
test.assertThrows(new util.ValidationError('Enter a list of values.'), f, fields.MultipleChoiceField.clean, 'hello');
assert(f.clean([]).length === 0);
assert(f.clean({}).length === 0);
test.assertThrows(new util.ValidationError('Select a valid choice. 3 is not one of the available choices.'), f, fields.MultipleChoiceField.clean, ['3']);

var f = new fields.MultipleChoiceField({choices: {'Numbers': choices, 'Letters': {'3': 'A', '4': 'B'}, '5': 'Other'}});
assert(f.clean([1])[0] === '1');
assert(f.clean(['1'])[0] === '1');
assert(f.clean([1, 5])[0] === '1');
assert(f.clean([1, 5])[1] === '5');
assert(f.clean([1, '5'])[0] === '1');
assert(f.clean([1, '5'])[1] === '5');
assert(f.clean(['1', 5])[0] === '1');
assert(f.clean(['1', 5])[1] === '5');
assert(f.clean(['1', '5'])[0] === '1');
assert(f.clean(['1', '5'])[1] === '5');
test.assertThrows(new util.ValidationError('Select a valid choice. 6 is not one of the available choices.'), f, fields.MultipleChoiceField.clean, ['6']);
test.assertThrows(new util.ValidationError('Select a valid choice. 6 is not one of the available choices.'), f, fields.MultipleChoiceField.clean, ['1', '6']);

// # ComboField ##################################################################

// ComboField takes a list of fields that should be used to validate a value,
// in that order.
var f = new fields.ComboField({fields: [new fields.CharField({max_length: 20}), new fields.EmailField()]});
assert(f.clean('test@example.com') === 'test@example.com');
test.assertThrows(new util.ValidationError('Ensure this value has at most 20 characters (it has 28).'), f, fields.ComboField.clean, 'longemailaddress@example.com');
test.assertThrows(new util.ValidationError('Enter a valid e-mail address.'), f, fields.ComboField.clean, 'not an email');
test.assertThrows(new util.ValidationError('This field is required.'), f, fields.ComboField.clean, '');
test.assertThrows(new util.ValidationError('This field is required.'), f, fields.ComboField.clean, null);

var f = new fields.ComboField({fields: [new fields.CharField({max_length: 20}), new fields.EmailField()], required: false});
assert(f.clean('test@example.com') === 'test@example.com');
test.assertThrows(new util.ValidationError('Ensure this value has at most 20 characters (it has 28).'), f, fields.ComboField.clean, 'longemailaddress@example.com');
test.assertThrows(new util.ValidationError('Enter a valid e-mail address.'), f, fields.ComboField.clean, 'not an email');
assert(f.clean('') === '');
assert(f.clean(null) === '');

// # FilePathField ###############################################################
var path = '../core-modules/djang10/master/'
var f = new fields.FilePathField({path: path})
test.assertThrows(new util.ValidationError('Select a valid choice. install.js is not one of the available choices.'), f, fields.FilePathField.clean, 'install.js');
assert(f.clean(path + 'install.js') == '../core-modules/djang10/master/install.js');

var f = new fields.FilePathField({path: path, match: '^.*?\.js$'});
test.assertThrows(new util.ValidationError('Select a valid choice. ../core-modules/djang10/master/readme.txt is not one of the available choices.'), f, fields.FilePathField.clean, path + 'readme.txt');
assert(f.clean(path + 'install.js') == '../core-modules/djang10/master/install.js');
test.assertThrows(new util.ValidationError('Select a valid choice. ../core-modules/djang10/master/forms/fields.js is not one of the available choices.'), f, fields.FilePathField.clean, path + 'forms/fields.js');

var f = new fields.FilePathField({path: path, recursive: true, match: '^.*?\.js$'});
test.assertThrows(new util.ValidationError('Select a valid choice. ../core-modules/djang10/master/readme.txt is not one of the available choices.'), f, fields.FilePathField.clean, path + 'readme.txt');
assert(f.clean(path + 'install.js') == '../core-modules/djang10/master/install.js');
assert(f.clean(path + 'forms/fields.js') == '../core-modules/djang10/master/forms/fields.js');

// # SplitDateTimeField ##########################################################

var f = new fields.SplitDateTimeField();
assert(f.clean([new Date(2006, 1, 10), new Date(0, 0, 0, 7, 30)]) == new Date(2006, 1, 10, 7, 30));
test.assertThrows(new util.ValidationError('This field is required.'), f, fields.SplitDateTimeField.clean, null);
test.assertThrows(new util.ValidationError('This field is required.'), f, fields.SplitDateTimeField.clean, '');
test.assertThrows(new util.ValidationError('Enter a list of values.'), f, fields.SplitDateTimeField.clean, 'hello');
test.assertThrows(new util.ValidationError(['Enter a valid date.', 'Enter a valid time.']), f, fields.SplitDateTimeField.clean, ['hello', 'there']);
test.assertThrows(new util.ValidationError(['Enter a valid time.']), f, fields.SplitDateTimeField.clean, ['2006-01-10', 'there']);
test.assertThrows(new util.ValidationError(['Enter a valid date.']), f, fields.SplitDateTimeField.clean, ['hello', '7:30']);

var f = new fields.SplitDateTimeField({required: false});
assert(f.clean([new Date(2006, 1, 10), new Date(0, 0, 0, 7, 30)]) == new Date(2006, 1, 10, 7, 30));
assert(f.clean(['2006-01-10', '7:30']) == new Date(2006, 0, 10, 7, 30));

assert(f.clean(null) === null);
assert(f.clean('') === null);
assert(f.clean(['']) === null);
assert(f.clean(['', '']) === null);
test.assertThrows(new util.ValidationError('Enter a list of values.'), f, fields.SplitDateTimeField.clean, 'hello');
test.assertThrows(new util.ValidationError(['Enter a valid date.', 'Enter a valid time.']), f, fields.SplitDateTimeField.clean, ['hello', 'there']);
test.assertThrows(new util.ValidationError(['Enter a valid time.']), f, fields.SplitDateTimeField.clean, ['2006-01-10', 'there']);
test.assertThrows(new util.ValidationError(['Enter a valid date.']), f, fields.SplitDateTimeField.clean, ['hello', '7:30']);
test.assertThrows(new util.ValidationError(['Enter a valid time.']), f, fields.SplitDateTimeField.clean, ['2006-01-10', '']);
test.assertThrows(new util.ValidationError(['Enter a valid time.']), f, fields.SplitDateTimeField.clean, ['2006-01-10']);
test.assertThrows(new util.ValidationError(['Enter a valid date.']), f, fields.SplitDateTimeField.clean, ['', '7:30']);

// IPAddressField

var f = new fields.IPAddressField();
assert(f.clean('192.168.0.0') === '192.168.0.0');
test.assertThrows(new util.ValidationError('Enter a valid IPv4 address.'), f, fields.IPAddressField.clean, '999.999.999.999');
test.assertThrows(new util.ValidationError('Enter a valid IPv4 address.'), f, fields.IPAddressField.clean, '192.168.0');
test.assertThrows(new util.ValidationError('Enter a valid IPv4 address.'), f, fields.IPAddressField.clean, 'not an ip');
test.assertThrows(new util.ValidationError('This field is required.'), f, fields.IPAddressField.clean, '');
