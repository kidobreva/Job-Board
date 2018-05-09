(function() {
    // Register modules
    var modules = [
        'ngRoute',
        'ngAnimate',

        // Auth
        'App.Auth',
        'App.Logout',

        // Users
        'App.User',
        'App.Users',
        'App.Profile',
        'App.Favourites',
        'App.MyCV',
        'App.UpdateProfile',

        // Companies
        'App.Company',
        'App.Companies',

        // Adverts
        'App.Advert',
        'App.Adverts',
        'App.Search',
        'App.AddAdvert',

        // Other
        'App.Home',
        'App.About',
        'App.Price',
        'App.Contacts'
    ];

    // Module
    angular
        .module('App', modules)
        .config(['$locationProvider', '$routeProvider', Config])
        .run(Run);

    // Config
    function Config($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');

        $routeProvider.otherwise({ redirectTo: '/home' });
    }

    // Run
    function Run($rootScope, $route, $http, $location) {
        console.log('Init App');

        // Change page title, based on Route information
        $rootScope.$on('$routeChangeSuccess', function(
            currentRoute,
            previousRoute
        ) {
            $rootScope.title = $route.current.title;
        });

        // Set active class
        $rootScope.isActive = function(viewLocation) {
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
    }
})();
