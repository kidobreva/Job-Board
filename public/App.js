var App = angular.module('App', [
    'ngRoute',
    'ngAnimate',
    'App.Home',
    'App.Auth',
    'App.AddAdvert',
    'App.Adverts',
    'App.Companies',
    'App.Logout',
    'App.Contacts',
    'App.Advert',
    'App.Company',
    'App.Profile',
    'App.Favourites',
    'App.Users',
    'App.User',
    'App.About',
    'App.Search'
]);

App.config([
    '$locationProvider',
    '$routeProvider',
    function($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');

        $routeProvider.otherwise({ redirectTo: '/home' });
    }
]);

App.run(function($rootScope, $route, $http, $location) {
    console.log('Init App');

    // Change page title, based on Route information
    $rootScope.$on('$routeChangeSuccess', function(
        currentRoute,
        previousRoute
    ) {
        $rootScope.title = $route.current.title;
    });

    // Set active class
    $rootScope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };

    // Check for user on first visit
    $http
        .get('/profile')
        .then(function(response) {
            console.log(response);
            $rootScope.user = response.data;
            $rootScope.isLogged = true;
            $rootScope.headerLoaded = true;
        })
        .catch(function(err) {
            console.log(err);
            $rootScope.user = null;
            $rootScope.isLogged = false;
            $rootScope.headerLoaded = true;
        });
});
