

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

function MapperFilter() {
}


MapperFilter.matchURI = function(uri)  {
    
    var map = djang10.getControllerMap();
    var keys = map.keys();
    var match_array = null;
    var duple = null;

    for(var i=keys.length - 1; i>=0 ; i--) {
        match_array = uri.match(keys[i]);

        if (match_array != null) {
            duple = map.get(keys[i]);
            break;
        }
    }
    
    if (duple == null) {
        return null;
    }
    else {
        return { duple : duple, match_array : match_array };
    }
}
