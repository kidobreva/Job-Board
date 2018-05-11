(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/add-advert', {
            templateUrl: 'views/add-advert.html',
            controller: 'AddAdvert',
            title: 'Добави обява'
        });
    }

    // Service
    function Service($rootScope) {
        // Add advert
        this.addAdvert = function(advert) {
            console.log('Add advert');
            return $rootScope.promise('POST', '/api/add-advert', advert);
        };
    }

    // Controller
    function Ctrl(AddAdvertService, $scope, $window) {
        console.log('AddAdvertCtrl');

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
                    if (response.status === 200) {
                        // $window.location.href = '#!/adverts';
                    }
                })
                .catch(function(err) {
                    console.error(err);
                });
        };
    }

    // Module
    angular
        .module('AddAdvert', ['ngRoute'])
        .config(Config)
        .service('AddAdvertService', Service)
        .controller('AddAdvert', Ctrl);
})();
