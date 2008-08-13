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

core.modules.djang10.validators();
core.modules.djang10.util.object();

models = {};

models.new_model = function(props) {
    props = props || {};
    
    // Get the collection name to use for the generated Class
    var collection_name = null;
    if (props.Meta && props.Meta.db_table) {
        collection_name = props.Meta.db_table;
    }    
    
    var Class = function(params) {
        // Class level stuff. TODO: this should be moved to the prototype...
        // initialize _meta
        this._meta = {};
        this._meta._fields = {};
        this._meta._field_values = {};
        
        for (var key in props) {
            // Meta is a special case - just merge the properties into _meta
            if (key === 'Meta') {
                this._meta = this._meta.merge(props.Meta);
            } else if (Object.instanceOf(props[key], Field)) { // fields are also special
                // set the field name
                props[key].set_attributes_from_name(key);
                this._meta._fields[key] = props[key];
                
                //getter and setter
                // we do a little bit of indirection here to deal with the closure properly
                Class.prototype.__defineGetter__(key, 
                    (function(key) { 
                        return function() {
                            return this._meta._fields[key].value_from_object(this._meta._field_values);
                        };
                    }) (key));
                Class.prototype.__defineSetter__(key, 
                    (function(key) { 
                        return function(val) {
                            this._meta._fields[key].save_form_data(this._meta._field_values, val);
                        };
                    }) (key));
                
            } else {
                this[key] = props[key];
            }
        }
        
        // Actual instance level stuff
        params = params || {};

        for (var key in this._meta._fields) {
            var field = this._meta._fields[key];
            var value = null;
            
            if (field['attname'] in params) {
                value = params[field['attname']];
                delete params[field['attname']];
            } else {
                value = field.get_default();
            }
            
            this[field['attname']] = value;
        }
        
        for (var key in params) {
            if (key in this) {
                this[key] = params[key];
            } else {
                throw new ModelError("KeyError", "Invalid argument: " + key);
            }
        }
    };

    Class.prototype = {
        // Create a slimmed down object and store that in the database instead.
        // Also use db_column names for fields instead of their regular names.
        save: function() {
            var to_save = {_id: this._id};

            for (var key in this) {
                // Don't bother saving stuff that is in the prototype
                if (this.hasOwnProperty(key)) {
                    // We handle _meta seperately
                    if (key !== '_meta') {
                        to_save[key] = this[key];
                    }
                }
            }
            
            to_save._postLoad_map = {};
            // Now save the meta stuff
            for (var key in this._meta._fields) {
                var field = this._meta._fields[key];
                
                // Make sure there are no name conflicts
                if (field.column in to_save) {
                    throw new ModelError("column name matches existing property name: " + field.column);
                }
                
                to_save[field.column] = this[field.attname];
                to_save._postLoad_map[field.column] = field.attname;
            }
            this.__collection.save(to_save);
            this._id = to_save._id;
        },
       
        validate: function () {
            var error_dict = {};
            var invalid = {};
            
            for (var key in this._meta._fields) {
                var f = this._meta._fields[key];
                
                try {
                    this[f.attname] = f.to_javascript(this[f.attname]);
                } catch (e if e instanceof validators.ValidationError) {
                    error_dict[f.name] = e.messages;
                    invalid[f.name] = true;
                }
            }
            
            for (var key in this._meta._fields) {
                var f = this._meta._fields[key];
                
                if (f.name in invalid) {
                    continue;
                }
                
                var errors = f.validate_full(f.attname, this);
                
                if (errors.length > 0) {
                    error_dict[f.name] = errors;
                }
            }
            
            return error_dict;
        },
        
        objects: function() {
            return Class.prototype.__collection;
        },
        
        postLoad: function() {
            for (var key in this._postLoad_map) {
                var swap = this[key];
                delete this[key];
                this[this._postLoad_map[key]] = swap;
            }
            delete this._postLoad_map;
        },
        
        // Don't mess with this stuff. It is used to setup the __collection variable.
        // __setup_collection gets called from install.js
        __collection_name: collection_name,
        __setup_collection: function(app_prefix, collection_name) {      
            if (this.__collection_name) {
                this.prototype.__collection = db[app_prefix][this.__collection_name];
            } else {
                this.prototype.__collection = db[app_prefix][collection_name];
            }
            // Set the constructor
            this.prototype.__collection.setConstructor(Class);
        }
    }
    
    if (!props.id) {
        Class.prototype.__defineGetter__("id", function() {
            return this._id;
        });
    }
    
    return Class;
}

var NOT_PROVIDED = function() {};

var Field = models.Field = function(params) {
    params = {
        'name': null,
        'blank': false,
        'db_column': null,
        'db_index': false,
        'default': new NOT_PROVIDED(),
        'editable': true,
        'help_text': '',
        'unique': false,
        'unique_for_date': null,
        'unique_for_month': null,
        'unique_for_year': null,
        'validator_list': null,
        'verbose_name': null,
    }.merge(params || {});
    
    this['name'] = params['name'];
    this['blank'] = params['blank'];
    this['db_column'] = params['db_column'];
    this['db_index'] = params['db_index'];
    this['default'] = params['default'];
    this['editable'] = params['editable'];
    this['help_text'] = params['help_text'];
    this['unique'] = params['unique'];
    this['unique_for_date'] = params['unique_for_date'];
    this['unique_for_month'] = params['unique_for_month'];
    this['unique_for_year'] = params['unique_for_year'];
    this['validator_list'] = params['validator_list'];
    this['verbose_name'] = params['verbose_name'];
};

Field.prototype = {
    // This is poorly named. It is the equivalent of Django's to_python. What
    // it does is convert the input value into the expected data type, raising
    // a validation error if it cannot be converted.
    to_javascript: function(value) {
        return value;
    },
    
    validate_full: function(field_data, all_data) {
        if (!this.blank && !field_data) {
            return ['This field is required.'];
        }
        try {
            this.validate(field_data, all_data);
        } catch (e if e instanceof validators.ValidationError) {
            return e.messages;
        }
        return [];
    },
    
    // Subclasses should throw validators.ValidationError on an error
    validate: function() {},
    
    set_attributes_from_name: function(n) {
        this['name'] = n;
        this.attname = this.get_attname();
        this.column = this.db_column || this.attname;
        if (this.verbose_name === null && n) {
            this.verbose_name = n.replace(/_/g, ' ')
        }
    },
    
    get_attname: function() {
        return this['name'];
    },
    
    has_default: function() {
        return !(this['default'] instanceof NOT_PROVIDED);
    },
    
    get_default: function() {
        if (this.has_default()) {
            if (this['default'] instanceof Function) {
                return this['default']();
            }
            return this['default'];
        }
        return "";
    },
    
    save_form_data: function(instance, data) {
        instance[this.attname] = data;
    },
    
    value_from_object: function(obj) {
        return obj[this.attname];
    }
};

var BooleanField = models.BooleanField = function(params) {
    params = {
        blank: true
    }.merge(params || {});
    
    Field.apply(this, [params]);
};

BooleanField.prototype = {
    __proto__: Field.prototype,
    
    to_javascript: function(value) {
        if (value === true || value === 't' || value === 'true' || value === '1') {
            return true;
        }
        if (value === false || value === 'f' || value === 'false' || value === '0') {
            return false;
        }
        throw new validators.ValidationError("This value must be either true or false.");
    }
}

var ModelError = models.ModelError = function(name, message) {
    if (message === null) {
        message = name;
        name = null;
    }
    this['name'] = name;
    this['message'] = message;
};

ModelError.prototype.toString = function() {
    if (!this.message) {
        return "(UNKNOWN MODEL ERROR)";
    }
    if (!this['name']) {
        return "(MODEL ERROR) " + this.message;
    }
    return "(MODEL ERROR) " + this['name'] + ": " + this['message'];
};

return models;