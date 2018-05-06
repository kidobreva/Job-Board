var App = angular.module('App', [
    'ngRoute',
    'App.Home',
    'App.Auth',
    'App.AddAdvert',
    'App.Adverts',
    'App.Companies',
    'App.Logout',
    'App.Contacts'
]);

App.config([
    '$locationProvider',
    '$routeProvider',
    function($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');

        $routeProvider.otherwise({ redirectTo: '/home' });
    }
]);

App.run(function($rootScope, $route, $http) {
    console.log('Init App');

    // Check for user on first visit
    $http
        .get('/currentUser', function(response) {
            $rootScope.isLogged = true;
        })
        .catch(function(err) {
            $rootScope.isLogged = false;
        });

    // Change page title, based on Route information
    $rootScope.$on('$routeChangeSuccess', function(
        currentRoute,
        previousRoute
    ) {
        $rootScope.title = $route.current.title;
    });
});
