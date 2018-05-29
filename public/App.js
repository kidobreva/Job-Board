(function() {
    // Register modules
    var modules = [
        'ngRoute',
        'ngAnimate',
        'angularUtils.directives.dirPagination',
        'ui.bootstrap',
        'ngSanitize',
        'ngWig',
        'angular.backtop',
        'btorfs.multiselect',
        'rzModule',
        'mwl.confirm',
        'angularFileUpload',
        'fblindSimpleImageGallery',

        // Users
        'Auth',
        'Users',
        'Profile',
        'MyCV',
        'UpdateProfile',
        'Messages',
        'Message',

        // Companies
        'Company',
        'Companies',
        'AddAdvert',

        // Adverts
        'Advert',
        'Adverts',
        'Candidates',

        // Other
        'Home',
        'Contacts',
        'Admin',
        'Categories'
    ];

    // Config
    function Config($locationProvider, $routeProvider, paginationTemplateProvider) {
        $locationProvider.html5Mode(true);
        paginationTemplateProvider.setPath('vendors/angular/dirPagination/dirPagination.tpl.html');

        // Routes
        $routeProvider.when('/about', {
            templateUrl: 'views/about.html',
            title: 'За нас'
        });
        $routeProvider.when('/price', {
            templateUrl: 'views/price.html',
            title: 'Цени на услугите'
        });
        $routeProvider.when('/faq', {
            templateUrl: 'views/faq.html',
            title: 'Често задавани въпроси'
        });
        $routeProvider.when('/conditions', {
            templateUrl: 'views/conditions.html',
            title: 'Общи условия'
        });
        $routeProvider.when('/logout', {
            resolve: {
                logout: function($rootScope, $location) {
                    $rootScope.promise
                        .get('/api/logout')
                        .then(function() {
                            $rootScope.user = null;
                            $rootScope.isLogged = false;
                            console.log('Logged out!');
                            $location.path('/home');
                            $rootScope.$apply();
                        })
                        .catch(function() {
                            $location.path('/home');
                            $rootScope.$apply();
                        });
                }
            }
        });

        // Not found
        $routeProvider.otherwise({ redirectTo: '/home' });
    }

    // Run
    function Run($rootScope, $route, $http, $location, $routeParams, $q, $timeout) {
        console.log('Init App Run');

        // Change page title, based on Route information
        $rootScope.$on('$routeChangeSuccess', function() {
            $rootScope.title = $route.current.title;
        });

        // Set active class for the navbar
        $rootScope.isActive = function(viewLocation, hasPages) {
            if (hasPages) {
                return viewLocation === '/' + $location.path().split('/')[1];
            }
            return viewLocation === $location.path();
        };

        // Location path change without reload
        var original = $location.path;
        $location.path = function(path, reload) {
            if (reload === false) {
                var lastRoute = $route.current;
                var un = $rootScope.$on('$locationChangeSuccess', function() {
                    $route.current = lastRoute;
                });
                $timeout(un, 200);
            }
            return original.apply($location, [path]);
        };

        // ScrollTo animation
        function easeInOutQuad(t, b, c, d) {
            //t = current time
            //b = start value
            //c = change in value
            //d = duration
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }
        $rootScope.scrollTo = function(to, duration) {
            var start = document.documentElement.scrollTop,
                change = to - start,
                currentTime = 0,
                increment = 20;

            var animateScroll = function() {
                currentTime += increment;
                var val = easeInOutQuad(currentTime, start, change, duration);
                document.documentElement.scrollTop = val;
                if (currentTime < duration) {
                    setTimeout(animateScroll, increment);
                }
            };
            animateScroll();
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
                    promise = $http.delete(url);
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
        $rootScope.getCurrentUser = function() {
            var deferred = $q.defer();
            $rootScope.promise
                .get('/api/profile')
                .then(function(response) {
                    $rootScope.user = response.data;
                    $rootScope.isLogged = true;
                    $rootScope.headerLoaded = true;
                    deferred.resolve(response.data);
                })
                .catch(function() {
                    $rootScope.user = null;
                    $rootScope.isLogged = false;
                    $rootScope.headerLoaded = true;
                    deferred.reject();
                });
            return deferred.promise;
        };
        $rootScope
            .getCurrentUser()
            .then(function(user) {
                console.log('Current user:', user);
            })
            .catch(function() {
                console.warn('No user logged in!');
            });
    }

    // Module
    angular
        .module('App', modules)
        .config(Config)
        .run(Run);
})();
