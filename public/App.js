(function() {
    // Register modules
    var modules = [
        'ngRoute',
        'ngAnimate',
        'ui.bootstrap',

        // Auth
        'Auth',
        'Logout',

        // Users
        'User',
        'Users',
        'Profile',
        'Favourites',
        'MyCV',
        'UpdateProfile',

        // Companies
        'Company',
        'Companies',

        // Adverts
        'Advert',
        'Adverts',
        'Search',
        'AddAdvert',

        // Other
        'Home',
        'About',
        'Price',
        'Contacts'
    ];

    // Module
    angular
        .module('App', modules)
        .config(Config)
        .run(Run);

    // Config
    function Config($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');
        $routeProvider.otherwise({ redirectTo: '/home' });
    }

    // Run
    function Run($rootScope, $route, $http, $location) {
        console.log('Init App');

        // Promise function
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
        $rootScope.$on('$routeChangeSuccess', function() {
            $rootScope.title = $route.current.title;
        });

        // Set active class for the navbar
        $rootScope.isActive = function(viewLocation) {
            return viewLocation === $location.path();
        };

        // Check for user on init
        $rootScope
            .promise('GET', '/api/profile')
            .then(function(response) {
                console.log(response);
                $rootScope.isLogged = true;
                $rootScope.headerLoaded = true;
                $rootScope.user = response.data;
            })
            .catch(function(err) {
                console.log(err);
                $rootScope.user = null;
                $rootScope.isLogged = false;
                $rootScope.headerLoaded = true;
            });
    }
})();
