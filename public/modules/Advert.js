(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/advert/:id', {
            templateUrl: 'views/advert.html',
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
        // Save to favourites
        this.save = function(id) {
            return $rootScope.promise('POST', '/api/favourite', { data: id });
        };

        // Apply for an advert
        this.apply = function(id) {
            return $rootScope.promise('POST', '/api/apply', { data: id });
        };

        // Delete advert
        this.deleteAdvert = function() {
            return $rootScope.promise(
                'DELETE',
                '/api/advert/' + $routeParams.id
            );
        };

        // Get adverts
        this.getAdverts = function() {
            return $rootScope.promise('GET', '/api/advert/' + $routeParams.id);
        };
    }

    // Controller
    function Ctrl(AdvertService, $rootScope, $scope, $timeout, title) {
        console.log('Init Advert Controller');
        $rootScope.title = title;

        // Get adverts
        AdvertService.getAdverts()
            .then(function(response) {
                if (response.status === 200) {
                    $scope.advert = response.data;
                    $scope.timeout = false;
                    $scope.loaded = true;
                    $rootScope
                        .promise('GET', '/api/profile')
                        .then(function(response) {
                            $scope.user = response.data;
                        })
                        .catch(function(err) {
                            //
                        });
                }
            })
            .catch(function(err) {
                $scope.loaded = true;
                $scope.timeout = false;
                console.error(err.data);
            });

        // Loader
        $scope.loaded = false;
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
                    if (response.status === 200) {
                        console.log('Saved!');
                    }
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
                    if (response.status === 200) {
                        console.log('Applied!');
                    }
                })
                .catch(function(err) {
                    console.error(err.data);
                });
        };

        // Delete advert
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
    }

    // Module
    angular
        .module('Advert', ['ngRoute'])
        .config(Config)
        .service('AdvertService', Service)
        .controller('Advert', Ctrl);
})();
