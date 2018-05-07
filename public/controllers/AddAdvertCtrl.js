var AppAdvert = angular.module('App.AddAdvert', ['ngRoute']);

AppAdvert.config([
    '$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/add-advert', {
            templateUrl: 'views/add-advert.html',
            controller: 'AddAdvertCtrl',
            title: 'Добави обява'
        });
    }
]);

AppAdvert.controller('AddAdvertCtrl', function($scope, $http, $window) {
    console.log('AddAdvertCtrl');

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
        console.log('Add advert');

        $http
            .post('/add-advert', $scope.advert)
            .then(function(response) {
                if (response.status === 200) {
                    $window.location.href = '#!/adverts';
                }
            })
            .catch(function(err) {
                console.error(err.data);
            });
    };
});
