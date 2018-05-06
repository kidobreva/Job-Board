var App = angular.module('App', [
    'ngRoute',
    'App.Home',
    'App.Auth',
    'App.AddAdvert',
    'App.Adverts',
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

App.run(function($rootScope, $route) {
    console.log('Init App');

    // Change page title, based on Route information
    $rootScope.$on('$routeChangeSuccess', function(
        currentRoute,
        previousRoute
    ) {
        $rootScope.title = $route.current.title;
    });
});
