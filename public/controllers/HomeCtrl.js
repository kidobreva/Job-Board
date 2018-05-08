var HomeModule = angular.module('App.Home', ['ngRoute']);

// Route
HomeModule.config([
    '$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'views/home.html',
            controller: 'HomeCtrl',
            title: 'Job Board - Начало'
        });
    }
]);

// Controller
HomeModule.controller('HomeCtrl', function($scope, $window) {
    console.log('HomeCtrl');

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

    // Search advert
    $scope.searchAdvert = function() {
        $window.location.href = `#!/search?category=${
            $scope.advert.category
        }&city=${$scope.advert.city}`;
    };
});
