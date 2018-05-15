(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/add-advert', {
            templateUrl: 'views/add-advert.html',
            controller: 'AddAdvert',
            title: 'Добави обява',
            resolve: {
                isCompnany: function($rootScope, $location) {
                    if (!$rootScope.user || $rootScope.user.role !== 'COMPANY') {
                        $location.path('/home');
                        // $rootScope.$apply();
                    }
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
    }

    // Controller
    function Ctrl(AddAdvertService, $scope) {
        console.log('Init AddAdvert Controller');

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
                    // show success alert and clean the form
                    $scope.addAlert();
                    angular.element(document.forms)[0].reset();
                })
                .catch(function(err) {
                    console.error(err);
                });
        };

        // Alert
        $scope.alerts = [];
        $scope.addAlert = function() {
            $scope.alerts.length = 0;
            $scope.alerts.push({ type: 'primary', msg: 'Обявата ви беше успешно публикувана!' });
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
