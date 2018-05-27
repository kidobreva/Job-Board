(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/advert/:id/edit', {
            templateUrl: 'views/add-advert.html',
            controller: 'AddAdvert',
            title: 'Промени обява'
        });
        $routeProvider.when('/add-advert', {
            templateUrl: 'views/add-advert.html',
            controller: 'AddAdvert',
            title: 'Добави обява'
        });
        $routeProvider.when('/adverts', {
            resolve: {
                load: function($location) {
                    $location.path('/adverts/1');
                }
            }
        });
    }

    // Service
    function Service($rootScope) {
        // Add advert
        this.addAdvert = function(advert) {
            console.log('Add advert');
            return $rootScope.promise.post('/api/advert', { advert: advert });
        };
        this.getAdvert = function(advertId, isEdit) {
            if (isEdit) {
                return $rootScope.promise.get('/api/advert/' + advertId + '?edit=true');
            } else {
                return $rootScope.promise.get('/api/advert/' + advertId);
            }
        };
    }

    // Controller
    function Ctrl(AddAdvertService, AdvertsService, $scope, $rootScope, $routeParams, $location) {
        console.log('Init AddAdvert Controller');

        // Check for current user
        $rootScope
            .getCurrentUser()
            .then(function(currentUser) {
                // Check for the user's role
                if (currentUser.role !== 'COMPANY') {
                    $location.path('/home');
                } else {
                    AdvertsService.getSearchData().then(function(res) {
                        console.log(res.data);
                        $scope.categories = res.data.categories;
                        $scope.cities = res.data.cities;
                        $scope.levels = res.data.levels;
                        $scope.types = res.data.types;
                        $scope.loaded = true;
                        $scope.$apply();
                        if ($routeParams.id) {
                            AddAdvertService.getAdvert($routeParams.id, true)
                                .then(advert => {
                                    $scope.isEdit = true;
                                    $scope.advert = advert.data;
                                    $scope.$apply();
                                    console.log(advert);
                                })
                                .catch(function(err) {
                                    console.error(err);
                                });
                        }
                    });
                }
            })
            // If there's no user
            .catch(function() {
                // Redirect to the login
                $location.url('/auth?redirect=' + $location.path());
            });

        // Add advert
        $scope.addAdvert = function() {
            AddAdvertService.addAdvert($scope.advert)
                .then(function(response) {
                    $scope.id = response.data.id;
                    // $rootScope.user.adverts.push(response);
                    // show success alert and clean the form
                    $scope.addAlert();
                    if (!$scope.isEdit) {
                        $scope.advert.description = '';
                        angular.element(document.forms)[0].reset();
                        $scope.$apply();
                    }
                })
                .catch(function(err) {
                    console.error(err);
                });
        };

        // Alert
        $scope.alerts = [];
        $scope.addAlert = function() {
            $scope.alerts.length = 0;
            if (!$scope.isEdit) {
                $scope.alerts.push({
                    type: 'primary',
                    msg: 'Обявата Ви беше публикувана успешно!'
                });
            } else {
                $scope.alerts.push({
                    type: 'primary',
                    msg: 'Промените бяха запазени успешно!'
                });
            }

            $scope.$apply();
        };
        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };
    }

    // Module
    angular
        .module('AddAdvert', ['ngRoute'])
        .config(Config)
        .service('AddAdvertService', Service)
        .controller('AddAdvert', Ctrl);
})();
