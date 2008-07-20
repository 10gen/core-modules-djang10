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

/**
 * loader.js
 *
 * template related stuff for djang10
 *
 *  modeled after  django.template package
 */

core.modules.djang10.template.template();

Loader = {
    get_template: function(name){
        var template = djang10.loadTemplate(name);
        
        return new Template(template);
    },
    
    getTemplate: function(name){
        return Loader.get_template(name);
    }
};
