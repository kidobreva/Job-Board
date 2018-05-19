(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'views/home.html',
            controller: 'Home',
            title: 'Job Board - Начало'
        });
    }
    console.log('Init Home Controller');

    function Service($rootScope) {
           // search data
            this.getSearchData = function() {
                return categories;

                //return $rootScope.promise.get('/api/profile')        
            }        
    }    

    // Controller
    function Ctrl(SearchService, $scope, $rootScope) {
        console.log('Init Home Controller');

        // Categories
        $scope.categories = [
            'ИТ - Разработка/поддръжка на софтуер хардуер',
            'Счетоводство, Одит',
            'Административни дейности',
            'Банково дело и Финанси',
            'Инженерни дейности',
            'Здравеопазване (Медицински работници)',
            'Архитектура, Строителство и Градоустройство',
            'Бизнес,Консултантски услуги',
            'Военна дейност',
            'Детегледачки и Домашни помощници',
            'Дизайн, Криейтив, Видео и Анимация',
            'Държавна администрация',
            'Енергетика',
            'Застрахователна дейност',
            'Логистика, Спедиция',
            'Недвижими имоти',
            'Почистване и грижи за дома/офиса',
            'Право, Юридически услуги',
            'Ремонт, Сервиз, Поддръжка',
            'Телекомуникации',
            'Туристически агенции',
            'Човешки ресурси',
            'Шофьори и куриери',
            'Друго'
        ];

        // SearchService.getSearchData().then(function (data) {
        //     //$scope.cities = data.cities;
        //     console.log(data.categories);
        //     $scope.categories = data.categories;
        // });
    }

    // Module
    angular
        .module('Home', ['ngRoute'])
        .config(Config)
        .service('SearchService', Service)
        .controller('Home', Ctrl);
})();
