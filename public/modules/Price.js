(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/price', {
            templateUrl: 'views/price.html',
            controller: 'PriceCtrl',
            title: 'Цени на услугите'
        });
    }

    // Controller
    function Ctrl() {
        console.log('PriceCtrl');
    }

    // Module
    angular
        .module('App.Price', ['ngRoute'])
        .config(['$routeProvider', Config])
        .controller('PriceCtrl', Ctrl);
})();