(function() {
    // Register modules
    var modules = [
        'ngRoute',
        'ngAnimate',
        'ui.bootstrap',

        // Users
        'Auth',
        'User',
        'Users',
        'Profile',
        'Favourites',
        'MyCV',
        'UpdateProfile',

        // Companies
        'Company',
        'Companies',
        'AddAdvert',

        // Adverts
        'Advert',
        'Adverts',
        'Search',

        // Other
        'Home',
        'Contacts'
    ];

    // Module
    angular
        .module('App', modules)
        .config(Config)
        .run(Run);

    // Config
    function Config($locationProvider, $routeProvider) {
        $locationProvider.html5Mode(true);

        // Routes
        $routeProvider.when('/about', {
            templateUrl: 'views/about.html',
            title: 'За нас'
        });
        $routeProvider.when('/price', {
            templateUrl: 'views/price.html',
            title: 'Цени на услугите'
        });
        $routeProvider.when('/logout', {
            resolve: {
                logout: function($rootScope, $window) {
                    $rootScope.promise
                        .get('/api/logout')
                        .then(function() {
                            $rootScope.user = null;
                            $rootScope.isLogged = false;
                            console.log('Logged out!');
                            $window.location.href = '/home';
                        })
                        .catch(function() {
                            $window.location.href = '/home';
                        });
                }
            }
        });

        // Not found
        $routeProvider.otherwise({ redirectTo: '/home' });
    }

    // Run
    function Run($rootScope, $route, $http, $location) {
        console.log('Init App Run');

        // Change page title, based on Route information
        $rootScope.$on('$routeChangeSuccess', function() {
            $rootScope.title = $route.current.title;
        });

        // Set active class for the navbar
        $rootScope.isActive = function(viewLocation) {
            return viewLocation === $location.path();
        };

        // Promise switch
        var GET = 'GET';
        var POST = 'POST';
        var PUT = 'PUT';
        var PATCH = 'PATCH';
        var DELETE = 'DELETE';
        function promise(type, url, data) {
            var promise;
            switch (type) {
                case GET:
                    promise = $http.get(url);
                    break;
                case POST:
                    promise = $http.post(url, data);
                    break;
                case PUT:
                    promise = $http.put(url, data);
                    break;
                case PATCH:
                    promise = $http.patch(url, data);
                    break;
                case DELETE:
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
        }

        // Promise functions
        $rootScope.promise = {
            get: function(url) {
                return promise(GET, url);
            },
            post: function(url, data) {
                return promise(POST, url, data);
            },
            put: function(url, data) {
                return promise(PUT, url, data);
            },
            patch: function(url, data) {
                return promise(PATCH, url, data);
            },
            delete: function(url, data) {
                return promise(DELETE, url, data);
            }
        };

        // Check for user on init
        $rootScope.promise
            .get('/api/profile')
            .then(function(response) {
                $rootScope.user = response.data;
                $rootScope.isLogged = true;
                $rootScope.headerLoaded = true;
                console.log('Current user:', response.data);
            })
            .catch(function() {
                $rootScope.user = null;
                $rootScope.isLogged = false;
                $rootScope.headerLoaded = true;
                console.warn('No user logged in!');
            });
    }
})();
