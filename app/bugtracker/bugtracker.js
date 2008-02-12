SYSOUT ("STARTING BUGTRACKER");
SYSOUT(app);
app.App = function() {}
app.App.prototype.config = function(key, opts){
    if(opts == null) opts = {merge: true};
    if(opts && opts.merge){
        var merge = app.App.getlist(allowModule, this.name, key) || [];
        var add = [];
        db._config.find({app: this.name, key: key}).forEach(function(u){add.push(u.value)});
        return merge.concat(add);
    }
    else if(opts && opts.priority == "_init") {
        var val = app.getlist(allowModule, this.name, key);
        if(! val)
            val = db._config.findOne({app: this.name, key: key});
        return val;
    }
    else if(opts && opts.match){
        var merged = this.config(key, {merge:true});
        return (app.App.findArray(merged, opts.match));
    }
};

app.App.prototype.add_config = function(key, val, opts){
    db._config.save({app: this.name, key: key, value: val});
};

app.App.findArray = function(ary, tgt){
    for(var i in ary){
        if(ary[i] == tgt) return true;
    }
    return false;
};

app.App.getlist = function(){
        //SYSOUT(getlist(app, "bugtracker", "data", "helper", "getlist") == app.bugtracker.data.helper.getlist);
        var obj = arguments[0];
        var i = 1;
        while(obj && i < arguments.length){
            obj = obj[arguments[i]];
            ++i;
        }
        return obj;
};

app.bugtracker.BugTracker = function() {};
app.bugtracker.BugTracker.prototype = new app.App();
app.bugtracker.BugTracker.prototype.name = "bugs";
app.bugtracker.BugTracker.prototype.list_projects = function(){
    var cur = db.bugtracker.projects.find();
    return cur.toArray();
};

app.bugtracker.app = new app.bugtracker.BugTracker();

app.bugtracker._get_user_list = function (name){
    alist = app.bugtracker.app.config(name, {merge: true});
    return alist;
};

app.bugtracker.list_OSes = function(){
    return app.bugtracker._get_user_list("OS");
};

app.bugtracker.list_versions = function(){
    return app.bugtracker._get_user_list("version");
};

