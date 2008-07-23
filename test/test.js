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

test = {};

var assertException = test.assertException = function(this_object, callable) {
    exception = null;
    
    try {
        var args = Array.prototype.slice.call(arguments, 2);
        callable.apply(this_object, args);
    }
    catch (e) {
        exception = e;
    }
    
    assert(exception);
    
    return true;
};

var assertThrows = test.assertThrows = function(expected_exception, this_object, callable) {
    exception = null;
    
    try {
        var args = Array.prototype.slice.call(arguments, 3);
        callable.apply(this_object, args);
    }
    catch (e) {
        exception = e;
    }
    
    assert(exception);

    if (typeof(exception) == "object") {
        assert(exception.__proto__ == expected_exception.__proto__);
        if(exception.message)
            assert(exception.message == expected_exception.message);
    }
    else {
        assert(exception === expected_exception);
    }
    
    return true;
};

return test;