(function() {
    // Register modules
    var modules = [
        'ngRoute',
        'ngAnimate',
        'ui.bootstrap',

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

        $rootScope.promise = function(type, url, data) {
            var promise;
            switch (type) {
                case 'GET':
                    promise = $http.get(url, data);
                    break;
                case 'POST':
                    promise = $http.post(url, data);
                    break;
                case 'PUT':
                    promise = $http.put(url, data);
                    break;
                case 'PATCH':
                    promise = $http.patch(url, data);
                    break;
                case 'DELETE':
                    promise = $http.delete(url, data);
                    break;
            }
            return new Promise(function(resolve, reject) {
                promise
                    .then(function(response) {
                        resolve(response);
                    })
                    .catch(function(err) {
                        reject(err);
                    });
            });
        };

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

        $rootScope.getUser = function() {
            $http
                .get('/profile')
                .then(function(response) {
                    console.log(response);
                    $rootScope.isLogged = true;
                    $rootScope.headerLoaded = true;
                    return response.data;
                })
                .catch(function(err) {
                    console.log(err);
                    $rootScope.user = null;
                    $rootScope.isLogged = false;
                    $rootScope.headerLoaded = true;
                });
        };
        // Check for user on first visit
        $rootScope.user = $rootScope.getUser();
    }
})();
