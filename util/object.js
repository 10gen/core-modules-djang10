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

Object.instanceOf = function(object, constructor){

    while (object != null && (typeof object == "object")) {
        if (object == constructor.prototype) 
            return true;
        object = object.__proto__;
    }
    return false;
};

Object.isEmpty = function(object) {
    for(var p in object)
        return false;
        
    return true;  
};
