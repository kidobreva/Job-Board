(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/about', {
            templateUrl: 'views/about.html',
            controller: 'About',
            title: 'За нас'
        });
    }

    // Controller
    function Ctrl() {
        console.log('AboutCtrl');
    }

    // Module
    angular
        .module('About', ['ngRoute'])
        .config(Config)
        .controller('About', Ctrl);
})();
