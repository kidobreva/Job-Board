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
    function Ctrl(AdvertService, $rootScope, $scope, $timeout, title, $sce, $sanitize, $location) {
        console.log('Init Advert Controller');
        $rootScope.title = title;

        // Get adverts
        AdvertService.getAdvert()
            .then(function(response) {
                console.log(response.data);
                $scope.now = Date.now();
                $scope.advert = response.data;
                $scope.advert.description = $sce.trustAsHtml($sanitize(response.data.description));
                $scope.loaded = true;
                $scope.timeout = false;
                $scope.$apply();
            })
            .catch(function(err) {
                if (err.status === 403) {
                    $scope.expired = true;
                }
                $scope.loaded = true;
                $scope.timeout = false;
                $scope.$apply();
                console.error(err);
            });

        // Loader
        $timeout(function() {
            if (!$scope.loaded) {
                $scope.timeout = true;
            }
        }, 1000);

        $scope.advertAlert;
        // Save to favourites
        $scope.save = function() {
            $rootScope
                .getCurrentUser()
                .then(function() {
                    AdvertService.save($scope.advert.id)
                        .then(function(response) {
                            //console.log('Alerts', $scope.addAlert);
                            $scope.advertAlert = false;
                            $scope.addAlert();
                            console.log(response);
                        })
                        .catch(function(err) {
                            console.error(err.data);
                        });
                })
                .catch(function() {
                    $location.url('/auth?redirect=' + $location.path());
                });
        };

        // Apply for an advert
        $scope.apply = function() {
            $rootScope
                .getCurrentUser()
                .then(function() {
                    AdvertService.apply($scope.advert.id)
                        .then(function(response) {
                            //console.log('Alerts2', $scope.addAlert);
                            $scope.advertAlert = true;
                            $scope.addAlert();
                            console.log(response);
                        })
                        .catch(function(err) {
                            console.error(err.data);
                        });
                })
                .catch(function() {
                    $location.url('/auth?redirect=' + $location.path());
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

        // Alerts
        $scope.alerts = [];
        $scope.addAlert = function() {
            $scope.alerts.length = 0;
            if ($scope.advertAlert === false) {
                $scope.alerts.push({ type: 'primary', msg: 'Обявата беше запазена успешно!' });
            } else {
                $scope.alerts.push({ type: 'success', msg: 'Успешно кандидатствахте за тази обява!' });
            }                                                                                      
            $scope.$apply();
        };
        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };
    }

    // Module
    angular
        .module('Advert', ['ngRoute'])
        .config(Config)
        .factory('AdvertService', Service)
        .controller('Advert', Ctrl);
})();
