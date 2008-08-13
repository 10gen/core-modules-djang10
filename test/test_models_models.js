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

var db = connect("test");

//--------------- Test ModelError ----------------
var j = new models.ModelError("Test error", "this test failed");
assert(j.toString() === "(MODEL ERROR) Test error: this test failed");
j = new models.ModelError("Unnamed error message");
assert(j.toString() === "(MODEL ERROR) Unnamed error message");
j = new models.ModelError();
assert(j.toString() === "(UNKNOWN MODEL ERROR)");
assert(j.toString() !== "some random string that has nothing to do with j");

//-------------- Test Models ---------------
var Article = models.new_model({
    some_non_field: 10,
    some_field: new models.Field({'default': 10})
});
// This would normally get called by install.js
Article.__setup_collection('testapp', 'Article');

db.testapp.Article.remove({});

assert(Object.isEmpty(Article.objects().find()));

var a = new Article();
assert(a.some_non_field === 10);
assert(a.some_field === 10);
assert(a.id === null);
a.save();
assert(a.id !== null);
assert(a.id === a._id);

var b = new Article();
b.some_field = 20;
b.save();
assert(b.some_non_field === 10);
assert(b.some_field === 20);

assert(Article.objects().find().count() === 2);
assert(Article.objects().find()[0].some_field === 10);
assert(Article.objects().find()[1].some_field === 20);

assert(Article.__collection.toString() === "{DBCollection:testapp.Article}");

// Try using a different collection name
var Article = models.new_model({
    some_non_field: 10,
    some_field: new models.Field({'default': 10}),
    Meta: {
        db_table: "Custom"
    }
});
// Here the second argument will be overriden by the Meta.db_table that we set above.
Article.__setup_collection('testapp', 'Article');

db.testapp.Custom.remove({});

assert(Object.isEmpty(Article.objects().find()));

var a = new Article();
assert(a.some_non_field === 10);
assert(a.some_field === 10);
assert(a.id === null);
a.save();
assert(a.id !== null);
assert(a.id === a._id);
a.save();

var b = new Article();
b.some_field = 20;
b.save();
assert(b.some_non_field === 10);
assert(b.some_field === 20);

assert(Article.objects().find().count() === 2);
assert(Article.objects().find()[0].some_field === 10);
assert(Article.objects().find()[1].some_field === 20);

assert(Article.__collection.toString() === "{DBCollection:testapp.Custom}");

// Test having a property named id
var Article = models.new_model({
    id: 10
});
Article.__setup_collection('testapp', 'Article');

db.testapp.Article.remove({});

var a = new Article();
assert(a.id === 10);
a.save();
assert(a.id === 10);

// Test saving a field with a manually set db_column
var Article = models.new_model({
    my_field: new models.Field({'db_column': 'my_column'})
});
Article.__setup_collection('testapp', 'Article');

db.testapp.Article.remove({});

var a = new Article();
a.my_field = 30;
a.save();
assert(a.my_field === 30);

var b = Article.objects().find()[0];
assert(b.my_field === 30);
assert(b.id == a.id);
b.my_field = 20;
b.save();

assert(Article.objects().find().count() === 1);
assert(Article.objects().find()[0].my_field === 20);

// Test that we get an exception if db_column is the same as an existing property
var Article = models.new_model({
    my_column: 'this shouldnt work',
    my_field: new models.Field({'db_column': 'my_column'})
});
Article.__setup_collection('testapp', 'Article');

db.testapp.Article.remove({});

var a = new Article();
test.assertThrows("(MODEL ERROR) column name matches existing property name: my_column", a, Article.save);

var Article = models.new_model({
    my_field: new models.Field({'db_column': 'my_column'}),
    my_column: 'this shouldnt work'
});
Article.__setup_collection('testapp', 'Article');

var a = new Article();
test.assertThrows("(MODEL ERROR) column name matches existing property name: my_column", a, Article.save);

var Article = models.new_model({
    my_field: new models.Field({'db_column': 'my_column'}),
    my_column: new models.Field()
});
Article.__setup_collection('testapp', 'Article');

var a = new Article();
test.assertThrows("(MODEL ERROR) column name matches existing property name: my_column", a, Article.save);

// Test setting a value from the constructor
var Article = models.new_model({
    my_field: new models.Field()
});
Article.__setup_collection('testapp', 'Article');

var a = new Article();
assert(a.my_field === "");

var a = new Article({my_field: 5});
assert(a.my_field === 5);

var Article = models.new_model({
    my_field: new models.Field({'default': 20})
});
Article.__setup_collection('testapp', 'Article');

var a = new Article();
assert(a.my_field === 20);

var a = new Article({my_field: 5});
assert(a.my_field === 5);