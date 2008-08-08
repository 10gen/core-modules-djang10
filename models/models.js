models = {};

models.new_model = function(props) {
    props = props || {};
    
    // Get the collection name to use for the generated Class
    var collection_name = null;
    if (props.Meta && props.Meta.db_table) {
        collection_name = props.Meta.db_table;
    }    
    
    var Class = function() {
        for (var key in props) {
            this[key] = props[key];
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
        }
    }
    
    return Class;
}

return models;