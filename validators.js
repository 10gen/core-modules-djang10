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

validators = {};

var ValidationError = validators.ValidationError = function(message) {
    if (message instanceof Array) {
        this.messages = message;
    } else if (typeof message === "string") {
        this.messages = [message];
    } else {
        this.messages = ["Validation Error"];
    }
};

ValidationError.prototype.toString = function() {
    return this.messages.toString();
};

return validators;