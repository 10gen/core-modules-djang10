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
 * template.js
 *
 * template related stuff for djang10
 *
 *  modeled after  django.template package
 */


function Template(compiledTemplate) {
    this.compiledTemplate = compiledTemplate;
}

Template.prototype.render = function(context) {

    var myBuf = "";

    scope.setGlobal(true);


    f = this.compiledTemplate;

    if (f == null) {
        f = scope.eval("core.modules.djang10.templates.notemplatefound");
        f.getScope(true).print = function(s) { myBuf += s;};
        f({"template_name" : this.template_name});
        f.clearScope();
    }
    else {
        f.getScope(true).print = function(s) { myBuf += s;};
        f(context);
        f.clearScope();
    }

    return myBuf;
}
