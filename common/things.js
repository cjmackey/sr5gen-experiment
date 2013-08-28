

Array.prototype.equals = function(x) {
    if(!x) { return false; }
    if(x.length != this.length) { return false; }
    for(var i = 0; i < this.length; i++) {
        this_type = typeof(this[i]);
        if(this_type !== typeof(x[i])) { return false; }
        if(this[i] !== x[i]) {
            if(this[i] === null || x[i] === null) { return false; }
            if(typeof(this[i].equals) === 'function') {
                if(typeof(x[i].equals) !== 'function') { return false; }
                if(!this[i].equals(x[i])) { return false; }
            } else {
                if(typeof(x[i].equals) === 'function') { return false; }
                // TODO: deep object comparison?
                if(this[i] !== x[i]) { return false; }
            }
        }
    }
    return true;
};

function cleanse_object(o){
    if(!(typeof o === 'object' && o)) { return o; }
    for(var k in o){
        if(typeof k === 'string' && k.indexOf('$') != -1) {
            delete o[k];
        }else{
            cleanse_object(o[k]);
        }
    }
    return o;
}


function inherit(Parent, constructor){
    var wrapping_constructor = function() {
        Parent.apply(this, arguments);
        constructor.apply(this, arguments);
    };
    wrapping_constructor.prototype = new Parent();
    wrapping_constructor.prototype.constructor = wrapping_constructor;
    return wrapping_constructor;
}

function User(email, _id) {
    this.email = email;
    this._id = _id;
}
User.prototype.to_object = function() { return this; };
User.from_object = function(obj) {
    var u = new User();
    u._id = obj._id;
    u.email = obj.email;
    return u;
};


function Metatype(name) {
    this.name = name;
    this.attribute_mins = [1,1,1,1,1,1,1,1,1];
    this.attribute_maxs = [6,6,6,6,6,6,6,6,6];
}
Metatype.prototype.to_object = function() {
    return {name:this.name,
            attribute_mins:this.attribute_mins,
            attribute_maxs:this.attribute_maxs};
};
Metatype.from_object = function(obj) {
    var m = new Metatype(obj.name);
    m.attribute_mins = obj.attribute_mins;
    m.attribute_maxs = obj.attribute_maxs;
    return m;
};
Metatype.prototype.equals = function(x) {
    return (this.name === x.name &&
            this.attribute_mins.equals(x.attribute_mins) &&
            this.attribute_maxs.equals(x.attribute_maxs));
};
Metatype.human = new Metatype('Human');
Metatype.human.attribute_mins[8] = 2;
Metatype.human.attribute_maxs[8] = 7;
Metatype.elf = new Metatype('Elf');
Metatype.elf.attribute_mins[1] = 2;
Metatype.elf.attribute_maxs[1] = 7;
Metatype.elf.attribute_mins[7] = 3;
Metatype.elf.attribute_maxs[7] = 8;
Metatype.dwarf = new Metatype('Dwarf');
Metatype.dwarf.attribute_mins[0] = 3;
Metatype.dwarf.attribute_maxs[0] = 8;
Metatype.dwarf.attribute_maxs[2] = 5;
Metatype.dwarf.attribute_mins[3] = 3;
Metatype.dwarf.attribute_maxs[3] = 8;
Metatype.dwarf.attribute_mins[4] = 2;
Metatype.dwarf.attribute_maxs[4] = 7;
Metatype.ork = new Metatype('Ork');
Metatype.ork.attribute_mins[0] = 4;
Metatype.ork.attribute_maxs[0] = 9;
Metatype.ork.attribute_mins[3] = 3;
Metatype.ork.attribute_maxs[3] = 8;
Metatype.ork.attribute_maxs[5] = 5;
Metatype.ork.attribute_maxs[7] = 5;
Metatype.troll = new Metatype('Troll');
Metatype.troll.attribute_mins[0] = 5;
Metatype.troll.attribute_maxs[0] = 10;
Metatype.troll.attribute_maxs[1] = 5;
Metatype.troll.attribute_mins[3] = 5;
Metatype.troll.attribute_maxs[3] = 10;
Metatype.troll.attribute_maxs[5] = 5;
Metatype.troll.attribute_maxs[6] = 5;
Metatype.troll.attribute_maxs[7] = 4;



function PriorityChoice(priority) {
    this.priority = priority || 'A';
}
PriorityChoice.prototype.equals = function(x) { return this.priority === x.priority; };
PriorityChoice.prototype.to_object = function() {
    return this;
};
PriorityChoice.from_object = function(obj) {
    return new PriorityChoice(obj.priority);
};
var MetatypePriorityChoice = inherit(PriorityChoice, function(priority, metatype, points) {
    this.metatype = metatype || null;
    this.points = points;
});
MetatypePriorityChoice.prototype.to_object = function(){
    return {priority:this.priority, metatype:this.metatype, points:this.points};
};
MetatypePriorityChoice.prototype.equals = function(x) {
    return (this.priority === x.priority &&
            this.metatype.equals(x.metatype)
           );
};
MetatypePriorityChoice.from_object = function(obj) {
    return new MetatypePriorityChoice(obj.priority, Metatype.from_object(obj.metatype), obj.points);
};
MetatypePriorityChoice.prototype.str = function() { return this.metatype.name + " (" + this.points + ")"; };

MetatypePriorityChoice.prototype.equals = function(x) {
    return (this.priority === x.priority &&
            this.metatype.equals(x.metatype));
};



function Character() {
    this.user_id = null;
    this._id = null;
    this.name = null;
    this.metatype_choice = null;
    this.attribute_point_allocation = [0,0,0,0,0,0,0,0,0,0,0];
    this.attribute_karma_allocation = [0,0,0,0,0,0,0,0,0,0,0];
}
Character.prototype.to_object = function() { return this; };
Character.from_object = function(obj) {
    var c = new Character();
    c.user_id = obj.user_id;
    c._id = obj._id;
    c.name = obj.name;
    if(obj.metatype_choice){
        c.metatype_choice = MetatypePriorityChoice.from_object(obj.metatype_choice);
    }
    c.attribute_point_allocation = obj.attribute_point_allocation;
    c.attribute_karma_allocation = obj.attribute_karma_allocation;
    return c;
};
Character.prototype.equals = function(x) {
    return (this.name === x.name &&
            this.metatype_choice.equals(x.metatype_choice) &&
            this.attribute_point_allocation.equals(x.attribute_point_allocation) &&
            this.attribute_karma_allocation.equals(x.attribute_karma_allocation)
           );
};
Character.prototype.metatype = function() { return (this.metatype_choice || {metatype: null}).metatype; };
Character.prototype.metatype_priority = function() { return (this.metatype_choice || {priority:null}).priority; };
Character.prototype.choose_metatype = function(metatype_choice) { this.metatype_choice = metatype_choice; };
Character.parseInt = function(x) { var tmp = parseInt(x, 10); return isNaN(tmp) ? 0 : tmp; };
Character.prototype.attributes = function() {
    if(!this.metatype()) { return null; }
    var arr = [];
    for(var i in this.attribute_point_allocation) {
        arr.push(this.attribute(i));
    }
    return arr;
};
Character.prototype.attribute = function(i) {
    if(!this.metatype()) { return null; }
    var x = Character.parseInt(this.attribute_point_allocation[i]);
    x = x + this.attribute_karma_allocation[i];
    var min = this.metatype().attribute_mins[i];
    if(min) { x = x + min; }
    return x;
};
Character.prototype.attribute_info_string = function(i) {
    if(!this.metatype()) { return null; }
    // NOTE: someday, add in augmented attributes like b(a)/m
    if(i <= 8){
        return this.attribute(i) + '/' + this.metatype().attribute_maxs[i];
    }else{
        return this.attribute(i) + '/' + 6;
    }
};
Character.prototype.attributes_priority = function() {
    if(!this.metatype()) { return null; }
    var attr_points = 0;
    for(var i in [0,1,2,3,4,5,6,7]){
        attr_points = attr_points + Character.parseInt(this.attribute_point_allocation[i]);
    }
    if(attr_points <= 12){
        return 'E';
    }else if(attr_points <= 14){
        return 'D';
    }else if(attr_points <= 16){
        return 'C';
    }else if(attr_points <= 20){
        return 'B';
    }else if(attr_points <= 24){
        return 'A';
    }else{
        return '!';
    }
};

