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

core.modules.djang10.forms.forms();
core.modules.djang10.forms.fields();
core.modules.djang10.test.test();
core.modules.djang10.forms.util();

Person = function(params) {
    this.first_name = new fields.CharField();
    this.last_name = new fields.CharField();
    
    forms.Form.call(this, params);
};

Person.prototype.__proto__ = forms.Form.prototype;

var p = new Person({data: {'first_name': 'John', 'last_name': 'Lennon'}});
assert(p.is_bound == true);
assert(Object.isEmpty(p.errors.dict));
assert(p.is_valid() == true);
assert(p.errors.as_ul() == '');
assert(p.errors.as_text() == '');
assert(p.cleaned_data.first_name == 'John');
assert(p.cleaned_data.last_name == 'Lennon');
assert(p.get_bound_field('first_name').toString() == '<input type="text" name="first_name" id="id_first_name" value="John" />');
assert(p.get_bound_field('last_name').toString() == '<input type="text" name="last_name" id="id_last_name" value="Lennon" />');
test.assertThrows(new util.Error("Field nonexistant not found in Form."), p, forms.Form.get_bound_field, 'nonexistant');
assert(p.toString() == '<tr><th><label for="id_first_name">First name:</label></th><td><input type="text" name="first_name" id="id_first_name" value="John" /></td></tr>\n<tr><th><label for="id_last_name">Last name:</label></th><td><input type="text" name="last_name" id="id_last_name" value="Lennon" /></td></tr>\n');
assert(p.toString() == '<tr><th><label for="id_first_name">First name:</label></th><td><input type="text" name="first_name" id="id_first_name" value="John" /></td></tr>\n<tr><th><label for="id_last_name">Last name:</label></th><td><input type="text" name="last_name" id="id_last_name" value="Lennon" /></td></tr>\n');

var p = new Person({data: {}});
assert(p.is_bound);
assert(!p.is_valid());
assert(p.errors.dict['first_name'].toString() == '<ul class="errorlist"><li>This field is required.</li></ul>');
assert(p.errors.dict['last_name'].toString() == '<ul class="errorlist"><li>This field is required.</li></ul>');
assert(typeof(p.cleaned_data) == 'undefined');
assert(p.toString() == '<tr><th><label for="id_first_name">First name:</label></th><td><ul class="errorlist"><li>This field is required.</li></ul><input type="text" name="first_name" id="id_first_name" /></td></tr>\n<tr><th><label for="id_last_name">Last name:</label></th><td><ul class="errorlist"><li>This field is required.</li></ul><input type="text" name="last_name" id="id_last_name" /></td></tr>\n');
assert(p.as_table() == p.toString());
assert(p.as_ul() == '<li><ul class="errorlist"><li>This field is required.</li></ul><label for="id_first_name">First name:</label> <input type="text" name="first_name" id="id_first_name" /></li>\n<li><ul class="errorlist"><li>This field is required.</li></ul><label for="id_last_name">Last name:</label> <input type="text" name="last_name" id="id_last_name" /></li>\n');
assert(p.as_p() == '<ul class="errorlist"><li>This field is required.</li></ul>\n<p><label for="id_first_name">First name:</label> <input type="text" name="first_name" id="id_first_name" /></p>\n<ul class="errorlist"><li>This field is required.</li></ul>\n<p><label for="id_last_name">Last name:</label> <input type="text" name="last_name" id="id_last_name" /></p>\n');

var p = new Person();
assert(!p.is_bound);
assert(Object.isEmpty(p.errors.dict));
assert(!p.is_valid());
assert(typeof(p.cleaned_data) == 'undefined');
assert(p.toString() == '<tr><th><label for="id_first_name">First name:</label></th><td><input type="text" name="first_name" id="id_first_name" /></td></tr>\n<tr><th><label for="id_last_name">Last name:</label></th><td><input type="text" name="last_name" id="id_last_name" /></td></tr>\n');
assert(p.toString() == p.as_table());
assert(p.as_ul() == '<li><label for="id_first_name">First name:</label> <input type="text" name="first_name" id="id_first_name" /></li>\n<li><label for="id_last_name">Last name:</label> <input type="text" name="last_name" id="id_last_name" /></li>\n');
assert(p.as_p() == '<p><label for="id_first_name">First name:</label> <input type="text" name="first_name" id="id_first_name" /></p>\n<p><label for="id_last_name">Last name:</label> <input type="text" name="last_name" id="id_last_name" /></p>\n');