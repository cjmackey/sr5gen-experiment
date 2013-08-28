
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
    $scope.can_save = false;
    $scope.refresh = function(callback){
        socket.emit('show character', $scope.character_id);
        socket.once('show character result', function(err, c){
            console.log([err, c]);
            if(err || !c){ return; }
            $scope.character = Character.from_object(c);
            $scope.can_save = false;
            if(session.user){
                $scope.can_save = $scope.character.user_id === session.user._id;
            }
            $scope.$apply();
            if($window) { updateTitle(); }
            if(callback) { callback(); }
        });
    };
    $scope.save = function(callback){
        $scope.saving = true;
        var msg = {character:JSON.stringify($scope.character.to_object()),
                   session_id:session.session_id};
        console.log(msg);
        socket.emit('save character', msg);
        socket.once('save character result', function(err){
            if(err) { return console.log(err); }
            console.log('saved!');
            $scope.saving = false;
            $scope.$apply();
        });
    };
    async.series([
        function(callback) {
            session.sync(socket, localStorage, function(){
                return callback();
            });
        },
        $scope.refresh
    ]);
    
}


function userCtrl($scope, $routeParams, $http, $window, $route, $location, socket, localStorage, session) {
    session.enscope(socket, localStorage, $scope, $route, $location, this);
    $scope.session = session;
    $scope.user_id = null;
    session.sync(socket, localStorage, function(){
        console.log('getting user');
        socket.emit('show user', $routeParams.id);
        socket.once('show user result', function(output){
            console.log('got user result');
            console.log(JSON.stringify(output));
            var err = output[0];
            var user_data = output[1];
            if(!err && user_data){
                console.log(user_data._id);
                $scope.user_id = user_data._id;
                $scope.user_name = user_data.name;
                $scope.user_characters = user_data.characters;
                $scope.$apply();
            }
        });
    });
    $scope.create_character = function(){
        console.log('creating character');
        socket.emit('new character', {name:$scope.new_character_name, session_id: session.session_id});
        socket.once('new character response', function(err, id){
            console.log([err, id]);
            if(err){ return; }
            $location.path('/character/'+id);
            $scope.$apply();
        });
    };
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
