
/* Controllers */

function characterCtrl($scope, $routeParams, $http, $window) {
    $scope.character = new Character();
    $scope.active_step = 'overview';
    
    $scope.metatype_choices = [
        new MetatypePriorityChoice('E', Metatype.human, 1),
        new MetatypePriorityChoice('D', Metatype.human, 3),
        new MetatypePriorityChoice('D', Metatype.elf, 0),
        new MetatypePriorityChoice('C', Metatype.human, 5),
        new MetatypePriorityChoice('C', Metatype.elf, 3),
        new MetatypePriorityChoice('C', Metatype.dwarf, 1),
        new MetatypePriorityChoice('C', Metatype.ork, 0),
        new MetatypePriorityChoice('B', Metatype.human, 7),
        new MetatypePriorityChoice('B', Metatype.elf, 6),
        new MetatypePriorityChoice('B', Metatype.dwarf, 4),
        new MetatypePriorityChoice('B', Metatype.ork, 4),
        new MetatypePriorityChoice('B', Metatype.troll, 0),
        new MetatypePriorityChoice('A', Metatype.human, 9),
        new MetatypePriorityChoice('A', Metatype.elf, 8),
        new MetatypePriorityChoice('A', Metatype.dwarf, 7),
        new MetatypePriorityChoice('A', Metatype.ork, 7),
        new MetatypePriorityChoice('A', Metatype.troll, 5),
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
    controller('CharacterCtrl', ['$scope', '$routeParams', '$http', '$window', characterCtrl])
    .controller('MyCtrl2', [function() {
        
    }]);
