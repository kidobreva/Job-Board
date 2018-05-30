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
            save: function() {
                return $rootScope.promise.post('/api/favourite/' + $routeParams.id);
            },

            // Apply for an advert
            apply: function(id) {
                return $rootScope.promise.post('/api/apply/' + $routeParams.id);
            },

            // Delete advert
            deleteAdvert: function(id) {
                return $rootScope.promise.delete('/api/advert/' + id);
            },

            // Block advert
            blockAdvert: function(id) {
                return $rootScope.promise.patch('/api/advert/block/' + id);
            }
        };
    }

    // Controller
    function Ctrl(
        AdvertService,
        SendMessageService,
        $rootScope,
        $scope,
        $timeout,
        title,
        $sce,
        $sanitize,
        $location,
        $uibModal
    ) {
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
                if (err.status === 404) {
                    $scope.expired = true;
                }
                if (err.status === 403) {
                    $scope.isBlocked = true;
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

        //$scope.advertAlert;
        // Save to favourites
        $scope.save = function() {
            $rootScope
                .getCurrentUser()
                .then(function() {
                    AdvertService.save($scope.advert.id)
                        .then(function(response) {
                            //console.log('Alerts', $scope.addAlert);
                            $scope.addAlert('save');
                            console.log(response);
                        })
                        .catch(function(err) {
                            $scope.addAlert('saveError');
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
                            $scope.addAlert('apply');
                            console.log(response);
                        })
                        .catch(function(err) {
                            if (err.status === 409) {
                                $scope.addAlert('applyError');
                            } else {
                                $scope.addAlert('missingCv');
                            }
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
                    console.log('TEST');
                    $scope.addAlert('delete');
                })
                .catch(function(err) {
                    console.error(err.data);
                });
        };

        // Block advert
        $scope.blockAdvert = function() {
            AdvertService.blockAdvert($scope.advert.id).then(function(res) {
                console.log(res);
                $scope.addAlert('blocked');
            });
        };

        //Alert modal
        function alertModal() {
            $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'alert.html',
                controller: function($uibModalInstance, $scope) {
                    $scope.cancel = function() {
                        $uibModalInstance.dismiss();
                    };
                }
            });
        }

        //Send report message
        $scope.reportAdvert = function() {
            $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'report.html',
                controller: function($uibModalInstance, $scope) {
                    $scope.ok = function() {
                        $rootScope
                        .getCurrentUser()
                        .then(function(user) {
                            console.log('User', user);
                            SendMessageService.sendMessage({
                                text: $scope.reportMsg,
                                phone: undefined,
                                name: user.firstName + ' ' + user.lastName,
                                email: $scope.reportEmail
                            });
                            $uibModalInstance.close();
                            alertModal();
                        });
                    };

                    $scope.cancel = function() {
                        $uibModalInstance.dismiss();
                    };
                }
            });
        };

        // Alerts
        $scope.alerts = [];
        $scope.leftAlerts = [];
        $scope.addAlert = function(type) {
            $scope.alerts.length = 0;
            $scope.leftAlerts.length = 0;
            switch (type) {
                case 'save':
                    $scope.leftAlerts.push({
                        type: 'primary',
                        msg: 'Обявата беше запазена успешно!'
                    });
                    break;
                case 'saveError':
                    $scope.leftAlerts.push({ type: 'danger', msg: 'Обявата вече е запазена!' });
                    break;
                case 'delete':
                    $scope.leftAlerts.push({
                        type: 'success',
                        msg: 'Обявата беше изтрита успешно!'
                    });
                    break;
                case 'blocked':
                    $scope.leftAlerts.push({
                        type: 'success',
                        msg: 'Обявата беше блокирана успешно!'
                    });
                    break;    
                case 'apply':
                    $scope.alerts.push({
                        type: 'success',
                        msg: 'Успешно кандидатствахте за тази обява!'
                    });
                    break;
                case 'applyError':
                    $scope.alerts.push({
                        type: 'danger',
                        msg: 'Вече сте кандидатствали за тази обява!'
                    });
                    break;
                case 'missingCv':
                    $scope.alerts.push({ type: 'primary', msg: 'Моля прикачете CV от вашия <a href="/profile">профил</a>!' });
                    break;
            }

            $scope.$apply();
        };
        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
            $scope.leftAlerts.splice(index, 1);
        };
    }

    // Module
    angular
        .module('Advert', ['ngRoute'])
        .config(Config)
        .factory('AdvertService', Service)
        .controller('Advert', Ctrl);
})();
