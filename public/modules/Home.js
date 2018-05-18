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

    function Ctrl(SearchService) {
        console.log('Init Home Controller');

        // SearchService.getServiceData().then(function (data) {
        //     $cities = data.cities;
        //     $categories = data.categories;
        // })
    }

    // Module
    angular
        .module('Home', ['ngRoute'])
        .config(Config)
        .controller('Home', Ctrl);
})();
