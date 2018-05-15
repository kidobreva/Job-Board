(function() {
    // Config
    function Config($routeProvider) {
        // Check for user on first visit
        function isCompany($rootScope, $location, $interval) {
            var int = $interval(function() {
                if ($rootScope.user || $rootScope.user === null) {
                    $interval.cancel(int);
                    if (!$rootScope.user || $rootScope.user.role !== 'COMPANY') {
                        $location.path('/home');
                        // $rootScope.$apply();
                    }
                }
            }, 100);
        }

        $routeProvider.when('/advert/:id/edit', {
            templateUrl: 'views/add-advert.html',
            controller: 'AddAdvert',
            title: 'Промени обява',
            resolve: {
                isCompnany: function($rootScope, $location, $interval) {
                    isCompany.apply(null, arguments);
                }
            }
        });
        $routeProvider.when('/add-advert', {
            templateUrl: 'views/add-advert.html',
            controller: 'AddAdvert',
            title: 'Добави обява',
            resolve: {
                isCompnany: function($rootScope, $location, $interval) {
                    isCompany.apply(null, arguments);
                }
            }
        });
    }

    // Service
    function Service($rootScope) {
        // Add advert
        this.addAdvert = function(advert) {
            console.log('Add advert');
            return $rootScope.promise.post('/api/advert', advert);
        };
        this.getAdvert = function(advertId) {
            return $rootScope.promise.get('/api/advert/' + advertId);
        };
    }

    // Controller
    function Ctrl(AddAdvertService, $scope, $rootScope, $routeParams) {
        console.log('Init AddAdvert Controller');

        if ($routeParams.id) {
            AddAdvertService.getAdvert($routeParams.id)
                .then(advert => {
                    $scope.isEdit = true;
                    $scope.advert = advert.data;
                    $scope.$apply();
                })
                .catch(function(err) {
                    console.error(err);
                });
        }

        // Cities
        $scope.cities = [
            'София',
            'Варна',
            'Пловдив',
            'Бургас',
            'Слънчев бряг',
            'Русе',
            'Стара Загора',
            'Велико Търново',
            'Плевен',
            'Шумен',
            'Друг'
        ];

        // Categories
        $scope.categories = [
            'ИТ - Разработка/поддръжка на софтуер хардуер',
            'Счетоводство, Одит',
            'Административни дейности',
            'Банково дело и Финанси',
            'Инженерни дейности',
            'Здравеопазване (Медицински работници)',
            'Архитектура, Строителство и Градоустройство',
            'Медии',
            'Друго'
        ];

        $scope.addAdvert = function() {
            AddAdvertService.addAdvert($scope.advert)
                .then(function(response) {
                    $rootScope.user.adverts.push(response);
                    // show success alert and clean the form
                    $scope.addAlert($scope.isEdit);
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
        $scope.addAlert = function(isEdit) {
            $scope.alerts.length = 0;
            if (!isEdit) {
                $scope.alerts.push({
                    type: 'primary',
                    msg: 'Обявата ви беше успешно публикувана!'
                });
            } else {
                $scope.alerts.push({ type: 'primary', msg: 'Промените бяха запазени успешно!' });
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
