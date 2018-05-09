(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/updateProfile', {
            templateUrl: 'views/updateProfile.html',
            controller: 'UpdateProfileCtrl',
            title: 'Настойки на профила'
        });
    }

    // Controller
    function Ctrl() {
        console.log('UpdateProfileCtrl');
    }

    // Module
    angular
        .module('App.UpdateProfile', ['ngRoute'])
        .config(['$routeProvider', Config])
        .controller('UpdateProfileCtrl', Ctrl);
})();