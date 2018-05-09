(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/myCV', {
            templateUrl: 'views/myCV.html',
            controller: 'MyCVCtrl',
            title: 'Моите CV-та'
        });
    }

    // Controller
    function Ctrl() {
        console.log('MyCVCtrl');
    }

    // Module
    angular
        .module('App.MyCV', ['ngRoute'])
        .config(['$routeProvider', Config])
        .controller('MyCVCtrl', Ctrl);
})();