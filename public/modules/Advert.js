(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/advert/:id', {
            templateUrl: 'views/advert.html',
            controller: 'AdvertCtrl',
            title: 'Информация за обява'
        });
    }

    // Service
    function Service($rootScope, $routeParams, $http) {
        // Save to favourites
        this.save = function(advert) {
            return $rootScope.promise('POST', '/api/favourite', advert);
        };

        // Apply for an advert
        this.apply = function(advert) {
            return $rootScope.promise('POST', '/api/apply', advert);
        };

        // Delete advert
        this.deleteAdvert = function() {
            return $rootScope.promise(
                'DELETE',
                '/api/advert/' + $routeParams.id
            );
        };

        // Get adverts
        this.getAdverts = function(scope) {
            $http
                .get('/api/advert/' + $routeParams.id)
                .then(function(response) {
                    console.log('advert:', response);
                    if (response.status === 200) {
                        scope.advert = response.data;

                        $http
                            .get('/profile')
                            .then(function(response) {
                                console.log('user:', response);
                                if (response.status === 200) {
                                    scope.loaded = true;
                                    scope.timeout = false;
                                    scope.user = response.data;
                                }
                            })
                            .catch(function(err) {
                                scope.loaded = true;
                                scope.timeout = false;
                                console.error(err.data);
                            });
                    }
                })
                .catch(function(err) {
                    console.error(err.data);
                });
        };
    }

    // Controller
    function Ctrl(AdvertService, $scope, $timeout) {
        console.log('AdvertCtrl');

        $scope.loaded = false;

        // Loader
        $timeout(function() {
            if (!$scope.loaded) {
                $scope.timeout = true;
            }
        }, 1000);

        $scope.save = function() {
            AdvertService.save($scope.advert)
                .then(function(response) {
                    console.log(response);
                    if (response.status === 200) {
                        console.log('Saved!');
                    }
                })
                .catch(function(err) {
                    console.error(err.data);
                });
        };
        $scope.apply = function() {
            AdvertService.apply($scope.advert)
                .then(function(response) {
                    console.log(response);
                    if (response.status === 200) {
                        console.log('Applied!');
                    }
                })
                .catch(function(err) {
                    console.error(err.data);
                });
        };
        $scope.deleteAdvert = function() {
            AdvertService.deleteAdvert()
                .then(function(response) {
                    console.log(response);
                    if (response.status === 200) {
                        console.log('Advert deleted!');
                    }
                })
                .catch(function(err) {
                    console.error(err.data);
                });
        };
        AdvertService.getAdverts($scope);
    }

    // Module
    angular
        .module('App.Advert', ['ngRoute'])
        .config(['$routeProvider', Config])
        .service('AdvertService', Service)
        .controller('AdvertCtrl', Ctrl);
})();
