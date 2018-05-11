(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/price', {
            templateUrl: 'views/price.html',
            controller: 'Price',
            title: 'Цени на услугите'
        });
    }

    // Controller
    function Ctrl() {
        console.log('PriceCtrl');
    }

    // Module
    angular
        .module('Price', ['ngRoute'])
        .config(Config)
        .controller('Price', Ctrl);
})();