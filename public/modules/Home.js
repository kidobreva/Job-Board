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
    function Ctrl(AdvertsService, $scope) {
        console.log('Init Home Controller');

        // Get search data
        AdvertsService.getSearchData().then(function(response) {
            console.log(response.data.categories);
            $scope.categories = response.data.categories;
            $scope.$apply();
        });
    }

    // Module
    angular
        .module('Home', ['ngRoute'])
        .config(Config)
        .controller('Home', Ctrl);
})();
