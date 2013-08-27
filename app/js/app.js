

// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'myApp.controllers']).
    config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        // $locationProvider.html5Mode(true);
        $routeProvider.when('/', {templateUrl: 'partials/root.html',
                                  controller: 'RootCtrl'});
        $routeProvider.when('/user/:id', {templateUrl: 'partials/user.html',
                                          controller: 'UserCtrl'});
        $routeProvider.when('/character/:id', {templateUrl: 'partials/character.html',
                                               controller: 'CharacterCtrl'});
        $routeProvider.otherwise({redirectTo: '/'});
    }]);
