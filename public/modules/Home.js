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
    function Ctrl(SearchService, $scope) {
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

        // Get search data
        SearchService.getSearchData().then(function(response) {
            console.log(response.data);
        });
    }

    // Module
    angular
        .module('Home', ['ngRoute'])
        .config(Config)
        .controller('Home', Ctrl);
})();
