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

// Assert that this_object.callable() throws an exception. 
// If this_object is null, uses the global object.
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

// Assert that this_object.callable() throws expected_exception.
// If this_object is null, uses the global object.
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

    if (typeof exception === "object") {
        if (typeof expected_exception !== "object") {
            assert(exception.toString() === expected_exception.toString());
        } else {
            assert(exception.__proto__ == expected_exception.__proto__);
            if(exception.message)
                assert(exception.message.toString() == expected_exception.message.toString());
        }
    }
    else {
        assert(exception === expected_exception);
    }
    
    return true;
};

return test;