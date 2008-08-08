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

var Article = models.new_model({
    some_field: 10
});

// This would normally get called by install.js
Article.__setup_collection('testapp', 'Article');

db.testapp.Article.remove({});

assert(Object.isEmpty(Article.objects.all()));

var a = new Article();
a.save();

var b = new Article();
b.some_field = 20;
b.save();

assert(Article.objects.all().count() === 2);
assert(Article.objects.all()[0].some_field === 10);
assert(Article.objects.all()[1].some_field === 20);

assert(Article.__collection.toString() === "{DBCollection:testapp.Article}");

// Try using a different collection name
var Article = models.new_model({
    some_field: 10,
    Meta: {
        db_table: "Custom"
    }
});

// This would normally get called by install.js
// Here the second argument will be overriden by the Meta.db_table that we set above.
Article.__setup_collection('testapp', 'Article');

db.testapp.Custom.remove({});

assert(Object.isEmpty(Article.objects.all()));

var a = new Article();
a.save();

var b = new Article();
b.some_field = 20;
b.save();

assert(Article.objects.all().count() === 2);
assert(Article.objects.all()[0].some_field === 10);
assert(Article.objects.all()[1].some_field === 20);

assert(Article.__collection.toString() === "{DBCollection:testapp.Custom}");