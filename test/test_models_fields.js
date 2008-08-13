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

core.modules.djang10.test.test();
core.modules.djang10.util.object();
core.modules.djang10.models.models();

// Make sure defaults are getting set up properly
var f = new models.Field();
assert(f['name'] === null);
assert(f['blank'] === false);
assert(f['db_column'] === null);
assert(f['db_index'] === false);
assert(Object.isEmpty(f['default']));
assert(f['editable'] === true);
assert(f['help_text'] === '');
assert(f['unique'] === false);
assert(f['unique_for_date'] === null);
assert(f['unique_for_month'] === null);
assert(f['unique_for_year'] === null);
assert(f['validator_list'] === null);
assert(f['verbose_name'] === null);

assert(f.has_default() === false);
assert(f.get_default() === '');

f.set_attributes_from_name('mikes_new_field');
assert(f['name'] === 'mikes_new_field');
assert(f['attname'] === 'mikes_new_field');
assert(f['column'] === 'mikes_new_field');
assert(f['verbose_name'] === 'mikes new field');

// Now make sure overriding defaults works properly
var f = new models.Field({'name': 'my_field', 'blank': true,
        'db_column': 'col', 'db_index': true, 'default': 'hello', 'editable': false,
        'help_text': 'help!', 'unique': true, 'unique_for_date': 'a',
        'unique_for_month': 'b', 'unique_for_year': 'c', 'validator_list': 'd',
        'verbose_name': 'My Field!'});
assert(f['name'] === 'my_field');
assert(f['blank'] === true);
assert(f['db_column'] === 'col');
assert(f['db_index'] === true);
assert(f['default'] === 'hello');
assert(f['editable'] === false);
assert(f['help_text'] === 'help!');
assert(f['unique'] === true);
assert(f['unique_for_date'] === 'a');
assert(f['unique_for_month'] === 'b');
assert(f['unique_for_year'] === 'c');
assert(f['validator_list'] === 'd');
assert(f['verbose_name'] === 'My Field!');

assert(f.has_default() === true);
assert(f.get_default() === 'hello');

f.set_attributes_from_name('my_other_field');
assert(f['name'] === 'my_other_field');
assert(f['attname'] === 'my_other_field');
assert(f['column'] === 'col');
assert(f['verbose_name'] === 'My Field!');

var obj = {'my_other_field': 'mike'};
assert(f.value_from_object(obj) === 'mike');
f.save_form_data(obj, 'mikey');
assert(f.value_from_object(obj) === 'mikey');

// Test callable defaults
var f = new models.Field({'default': function() {return "hello";}});
assert(f.get_default() === 'hello');

// Test BooleanField
var f = new models.BooleanField();
assert(f.blank === true);
assert(f.to_javascript(true) === true);
assert(f.to_javascript(false) === false);
assert(f.to_javascript(1) === true);
assert(f.to_javascript(0) === false);
assert(f.to_javascript('true') === true);
assert(f.to_javascript('false') === false);
assert(f.to_javascript('t') === true);
assert(f.to_javascript('f') === false);
assert(f.to_javascript('1') === true);
assert(f.to_javascript('0') === false);
test.assertThrows("This value must be either true or false.", f, models.BooleanField.to_javascript, null);
test.assertThrows("This value must be either true or false.", f, models.BooleanField.to_javascript, '2');
test.assertThrows("This value must be either true or false.", f, models.BooleanField.to_javascript, 'True');
test.assertThrows("This value must be either true or false.", f, models.BooleanField.to_javascript, 'trueaoeu');
test.assertThrows("This value must be either true or false.", f, models.BooleanField.to_javascript, 10);