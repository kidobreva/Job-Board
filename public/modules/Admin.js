(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/admin', {
            templateUrl: 'views/admin.html',
            controller: 'Admin',
            title: 'Админ панел'
        });
    }

    // Service
    function Service($rootScope) {
        //
    }

    // Controller
    function Ctrl(AdminService, $rootScope, $scope, $location) {
        console.log('Init Profile Controller');

        // Check for current user
        $rootScope
            .getCurrentUser()
            .then(function(user) {
                $scope.user = user;
                $scope.loaded = true;
                $scope.timeout = false;
            })
            // If there's no user
            .catch(function() {
                // Redirect to the login
                $location.url('/auth?redirect=' + $location.path());
            });
    }

    // Module
    angular
        .module('Admin', ['ngRoute'])
        .config(Config)
        .service('AdminService', Service)
        .controller('Admin', Ctrl);
})();
