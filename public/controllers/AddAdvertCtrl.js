var AddAdvert = angular.module('App.AddAdvert', ['ngRoute']);

// Route
AddAdvert.config([
    '$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/add-advert', {
            templateUrl: 'views/add-advert.html',
            controller: 'AddAdvertCtrl',
            title: 'Добави обява'
        });
    }
]);

// Controller
AddAdvert.controller('AddAdvertCtrl', function($scope, $http, $window) {
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

    // Add advert
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
