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
    function Service($http, $window, $routeParams) {
        // Save to favourites
        this.save = function(scope) {
            $http
                .post('/favourite', scope.advert)
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
        this.apply = function(scope) {
            $http
                .post('/apply', scope.advert)
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
        this.deleteAdvert = function(scope) {
            $http
                .delete('/advert/' + $routeParams.id)
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

        // Get adverts
        this.getAdverts = function(scope) {
            $http
                .get('/advert/' + $routeParams.id)
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
    function Ctrl($scope, AdvertService, $timeout) {
        console.log('AdvertCtrl');

        $scope.loaded = false;

        // Loader
        $timeout(function() {
            if (!$scope.loaded) {
                $scope.timeout = true;
            }
        }, 1000);

        $scope.save = AdvertService.save.bind(null, $scope);
        $scope.apply = AdvertService.apply.bind(null, $scope);
        $scope.deleteAdvert = AdvertService.deleteAdvert.bind(null, $scope);
        AdvertService.getAdverts($scope);
    }

    // Module
    angular
        .module('App.Advert', ['ngRoute'])
        .config(['$routeProvider', Config])
        .service('AdvertService', Service)
        .controller('AdvertCtrl', Ctrl);
})();
