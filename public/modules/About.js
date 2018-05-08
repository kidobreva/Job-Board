(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/about', {
            templateUrl: 'views/about.html',
            controller: 'AboutCtrl',
            title: 'За нас'
        });
    }

    // Controller
    function Ctrl() {
        console.log('AboutCtrl');
    }

    // Module
    angular
        .module('App.About', ['ngRoute'])
        .config(['$routeProvider', Config])
        .controller('AboutCtrl', Ctrl);
})();
