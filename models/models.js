models = {};

models.new_model = function(props) {
    props = props || {};
    
    // Get the collection name to use for the generated Class
    var collection_name = null;
    if (props.Meta && props.Meta.db_table) {
        collection_name = props.Meta.db_table;
    }    
    
    var Class = function() {
        // initialize _meta
        this._meta = {};
        this._meta._fields = {};
        this._meta._field_values = {};
        
        for (var key in props) {
            // Meta is a special case - just merge the properties into _meta
            if (key === 'Meta') {
                this._meta = this._meta.merge(props.Meta);
            } else if (props[key] instanceof Field) { // fields are also special
                // set the field name
                props[key].set_attributes_from_name(key);
                this._meta._fields[key] = props[key];
                
                // default value
                this._meta._fields[key].save_form_data(this._meta._field_values, props[key].get_default());
                
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
    };

    Class.prototype = {
        save: function() {
            this.__collection.save(this);
        },
        
        objects: {
            all: function() {
                return Class.prototype.__collection.find();
            }
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
        'null': false,
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
    this['null'] = params['null'];
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
            return this['default'].toString();
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

return models;