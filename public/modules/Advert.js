(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/advert/:id', {
            templateUrl: '/views/advert.html',
            controller: 'Advert',
            resolve: {
                title: function($route) {
                    return 'Информация за обява №' + $route.current.params.id;
                }
            }
        });
    }

    // Service
    function Service($rootScope, $routeParams) {
        return {
            // Get adverts
            getAdvert: function() {
                return $rootScope.promise.get('/api/advert/' + $routeParams.id);
            },

            // Save to favourites
            save: function(id) {
                return $rootScope.promise.post('/api/favourite', {
                    data: id
                });
            },

            // Apply for an advert
            apply: function(id) {
                return $rootScope.promise.post('/api/apply', { data: id });
            },

            // Delete advert
            deleteAdvert: function(id) {
                return $rootScope.promise.delete('/api/advert/' + id);
            }
        };
    }

    // Controller
    function Ctrl(AdvertService, $rootScope, $scope, $timeout, title) {
        console.log('Init Advert Controller');
        $rootScope.title = title;

        // Get adverts
        AdvertService.getAdvert()
            .then(function(response) {
                $scope.advert = response.data;
                $scope.timeout = false;
                $scope.loaded = true;
            })
            .catch(function(err) {
                $scope.loaded = true;
                $scope.timeout = false;
                console.error(err);
            });

        // Loader
        $timeout(function() {
            if (!$scope.loaded) {
                $scope.timeout = true;
            }
        }, 1000);

        // Save to favourites
        $scope.save = function() {
            AdvertService.save($scope.advert.id)
                .then(function(response) {
                    console.log(response);
                })
                .catch(function(err) {
                    console.error(err.data);
                });
        };

        // Apply for an advert
        $scope.apply = function() {
            AdvertService.apply($scope.advert.id)
                .then(function(response) {
                    console.log(response);
                })
                .catch(function(err) {
                    console.error(err.data);
                });
        };

        // Delete advert
        $scope.deleteAdvert = function() {
            AdvertService.deleteAdvert($scope.advert.id)
                .then(function(response) {
                    console.log(response);
                })
                .catch(function(err) {
                    console.error(err.data);
                });
        };
    }

    // Module
    angular
        .module('Advert', ['ngRoute'])
        .config(Config)
        .factory('AdvertService', Service)
        .controller('Advert', Ctrl);
})();
