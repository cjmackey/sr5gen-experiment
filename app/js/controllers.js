'use strict';

/* Controllers */

function inherit(Parent, constructor){
    var wrapping_constructor = function() {
        Parent.apply(this, arguments);
        constructor.apply(this, arguments);
    };
    wrapping_constructor.prototype = new Parent();
    wrapping_constructor.prototype.constructor = wrapping_constructor;
    return wrapping_constructor;
}

function Metatype(name) {
    this.name = name;
    this.attribute_mins = [1,1,1,1,1,1,1,1,1];
    this.attribute_maxs = [6,6,6,6,6,6,6,6,6];
}
Metatype.prototype.equals = function(x) { return this.name === x.name; }
Metatype.human = new Metatype('Human');
Metatype.human.attribute_mins[8] = 2;
Metatype.human.attribute_maxs[8] = 7;
Metatype.elf = new Metatype('Elf');
Metatype.elf.attribute_mins[1] = 2;
Metatype.elf.attribute_maxs[1] = 7;
Metatype.elf.attribute_mins[7] = 3;
Metatype.elf.attribute_maxs[7] = 8;


function PriorityChoice(priority) {
    this.priority = priority || 'A';
}
var MetatypePriorityChoice = inherit(PriorityChoice, function(priority, metatype, points) {
    this.metatype = metatype || null;
    this.points = points;
});
MetatypePriorityChoice.prototype.str = function() { return this.metatype.name + " (" + this.points + ")"; }

MetatypePriorityChoice.prototype.equals = function(x) {
    return (this.priority === x.priority &&
            this.metatype.equals(x.metatype));
}



function Character() {
    this.name = null;
    this.metatype_choice = null;
    this.attribute_point_allocation = [0,0,0,0,0,0,0,0,0,0,0];
    this.attribute_karma_allocation = [0,0,0,0,0,0,0,0,0,0,0];
}
Character.prototype.metatype = function() { return (this.metatype_choice || {metatype: null}).metatype; }
Character.prototype.metatype_priority = function() { return (this.metatype_choice || {priority:null}).priority; }
Character.prototype.choose_metatype = function(metatype_choice) { this.metatype_choice = metatype_choice; }
Character.parseInt = function(x) { var tmp = parseInt(x || '0'); return isNaN(tmp) ? 0 : tmp; }
Character.prototype.attributes = function() {
    if(!this.metatype()) { return null; }
    var arr = [];
    for(var i in this.attribute_point_allocation) {
        arr.push(this.attribute(i));
    }
    return arr;
}
Character.prototype.attribute = function(i) {
    if(!this.metatype()) { return null; }
    var x = Character.parseInt(this.attribute_point_allocation[i]);
    x = x + this.attribute_karma_allocation[i];
    var min = this.metatype().attribute_mins[i];
    if(min) { x = x + min; }
    return x;
}
Character.prototype.attribute_info_string = function(i) {
    if(!this.metatype()) { return null; }
    // NOTE: someday, add in augmented attributes like b(a)/m
    if(i <= 8){
        return this.attribute(i) + '/' + this.metatype().attribute_maxs[i];
    }else{
        return this.attribute(i) + '/' + 6
    }
}
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
}


function characterCtrl($scope, $http, $window) {
    $scope.blah = 'asdf'
    $scope.some_var = 'hello'
    $scope.character = new Character();
    $scope.active_step = 'overview';
    
    $scope.metatype_choices = [
        new MetatypePriorityChoice('E', Metatype.human, 1),
        new MetatypePriorityChoice('D', Metatype.human, 3),
        new MetatypePriorityChoice('D', Metatype.elf, 0),
        new MetatypePriorityChoice('C', Metatype.human, 5),
        new MetatypePriorityChoice('C', Metatype.elf, 3),
    ];
    
    function updateTitle() {
        var new_title = "A Shadowrun Character Generator";
        if($scope.character.name) {
            new_title = $scope.character.name + " " + new_title;
        }
        $window.document.title = new_title;
    }
    
    $scope.character_name_change = function() {
        updateTitle();
    };
    
    $scope.goto_step = function(x) { $scope.active_step = x; };
    $scope.is_active_step = function(x) { return $scope.active_step === x; };
    if($window) { updateTitle(); }
}


angular.module('myApp.controllers', []).
    controller('CharacterCtrl', ['$scope', '$http', '$window', characterCtrl])
    .controller('MyCtrl2', [function() {
        
    }]);
