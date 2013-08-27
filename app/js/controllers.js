
/* Controllers */

function characterCtrl($scope, $routeParams, $http, $window, $route, $location, socket, localStorage, session) {
    session.enscope(socket, localStorage, $scope, $route, $location, this);
    $scope.session = session;
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
    
    console.log($routeParams);
    $scope.character_id = $routeParams.id;
    $scope.character = null;
    async.series([
        function(callback) {
            session.sync(socket, localStorage, function(){
                return callback();
            });
        },
        function(callback) {
            //todo: get info from server based on character id
            return callback();
        },
        function(callback) {
            $scope.character = new Character();
            if($window) { updateTitle(); }
        }
    ]);
    
}


function userCtrl($scope, $routeParams, $http, $window, $route, $location, socket, localStorage, session) {
    session.enscope(socket, localStorage, $scope, $route, $location, this);
    $scope.session = session;
    session.sync(socket, localStorage, function(){
    });
    console.log($routeParams);
}

function rootCtrl($scope, $routeParams, $http, $window, $route, $location, socket, localStorage, session) {
    session.enscope(socket, localStorage, $scope, $route, $location, this);
    session.sync(socket, localStorage, function(){
    });
    console.log($routeParams);
    console.log($scope);
    console.log($scope.session);
}

angular.module('myApp.controllers', []).
    controller('CharacterCtrl', ['$scope', '$routeParams', '$http', '$window', '$route', '$location', 'socket', 'localStorage', 'session', characterCtrl]).
    controller('UserCtrl', ['$scope', '$routeParams', '$http', '$window', '$route', '$location', 'socket', 'localStorage', 'session', userCtrl]).
    controller('RootCtrl', ['$scope', '$routeParams', '$http', '$window', '$route', '$location', 'socket', 'localStorage', 'session', rootCtrl]);
