
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
 *  10gen Djang10 Framework
 *
 *  Peer file to : django.conf.urls.defaults  
 */

/*
 *   patterns() - to allow urls.js to be written like urls.py
 */
patterns = function() {

    // the first arg is a 'common prefix' to the packages, so prepend it

    var ret = new Array();
    var prefix = arguments[0];

    for (i = 1; i < arguments.length; i++) {

        if (prefix.length > 0) {
            ret[i-1] = [ arguments[i][0], prefix + (prefix.charAt(prefix.length - 1) == "." ? "" : ".") + arguments[i][1]];
        }
        else {
            ret[i-1] = arguments[i];
        }
    }

    return ret;
}
