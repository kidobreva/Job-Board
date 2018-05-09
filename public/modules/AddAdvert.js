(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/add-advert', {
            templateUrl: 'views/add-advert.html',
            controller: 'AddAdvertCtrl',
            title: 'Добави обява'
        });
    }

    // Service
    function Service($http, $window) {
        // Add advert
        this.addAdvert = function(scope) {
            console.log('Add advert');

            $http
                .post('/add-advert', scope.advert)
                .then(function(response) {
                    if (response.status === 200) {
                        $window.location.href = '#!/adverts';
                    }
                })
                .catch(function(err) {
                    console.error(err.data);
                });
        };
    }

    // Controller
    function Ctrl(AddAdvertService, $scope) {
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

        $scope.addAdvert = AddAdvertService.addAdvert.bind(null, $scope);
    }

    // Module
    angular
        .module('App.AddAdvert', ['ngRoute'])
        .config(['$routeProvider', Config])
        .service('AddAdvertService', Service)
        .controller('AddAdvertCtrl', Ctrl);
})();
