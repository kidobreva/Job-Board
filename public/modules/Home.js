(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'views/home.html',
            controller: 'Home',
            title: 'Job Board - Начало'
        });
    }

    // Controller
    function Ctrl($scope, $location) {
        console.log('Init Home Controller');

        // Carousel
        $scope.myInterval = 5000;
        $scope.noWrapSlides = false;
        $scope.active = 0;


        // // Cities
        // $scope.cities = [
        //     'София',
        //     'Варна',
        //     'Пловдив',
        //     'Бургас',
        //     'Слънчев бряг',
        //     'Русе',
        //     'Стара Загора',
        //     'Велико Търново',
        //     'Плевен',
        //     'Шумен',
        //     'Друг'
        // ];

        // // Categories
        // $scope.categories = [
        //     'ИТ - Разработка/поддръжка на софтуер хардуер',
        //     'Счетоводство, Одит',
        //     'Административни дейности',
        //     'Банково дело и Финанси',
        //     'Инженерни дейности',
        //     'Здравеопазване (Медицински работници)',
        //     'Архитектура, Строителство и Градоустройство',
        //     'Медии',
        //     'Друго'
        // ];

        // // Search advert
        // $scope.searchAdvert = function() {
        //     $location.url(`/search?category=${
        //         $scope.advert.category
        //     }&city=${$scope.advert.city}`);
        // };
    }

    // Module
    angular
        .module('Home', ['ngRoute'])
        .config(Config)
        .controller('Home', Ctrl);
})();
