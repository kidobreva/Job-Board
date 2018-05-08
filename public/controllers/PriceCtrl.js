var PriceModule = angular.module('App.Price', ['ngRoute']);

// Route
PriceModule.config([
    '$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/price', {
            templateUrl: 'views/price.html',
            controller: 'PriceCtrl',
            title: 'Цени на услугите'
        });
    }
]);

// Controller
PriceModule.controller('PriceCtrl', [function() {
    console.log('PriceCtrl');
}]);