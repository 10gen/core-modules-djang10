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
 * http.sh
 *
 * HTTP related stuff for djang10
 *
 *  modeled after  django.http package
 */

/**
 * object rep of a HTTP response, expected as the return from the
 * various methods in view.py
 * 
 * @TODO - get django source and see
 *  
 * @param s body content of Http response
 */
function HttpResponse(c) {
    this.content = c;
}

HttpResponse.prototype.getContent = function() {
    return this.content;
}

/**
 *  object rep of Http Request.  Right now, just wraps our own request object
 *  to make it look like django (-ish)
 * @param req
 */
function HttpRequest(req) {
    this.request = req;
}

HttpRequest.prototype.getRequest = function() {
    return this.request;
}
