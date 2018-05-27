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
        this.getStatistics = function() {
            return $rootScope.promise.get('/api/admin/statistics');
        };
    }

    // Controller
    function Ctrl(AdminService, $rootScope, $scope, $location) {
        console.log('Init Profile Controller');

        // Check for current user
        $rootScope
            .getCurrentUser()
            .then(function(user) {
                $scope.user = user;

                AdminService.getStatistics().then(function(response) {
                    $scope.numberOfUsers = response.data.numberOfUsers;
                    $scope.numberOfAdverts = response.data.numberOfAdverts;
                    $scope.categories = response.data.numberOfCategories;
                    $scope.numberOfCandidates = response.data.numberOfCandidates;

                    $scope.loaded = true;
                    $scope.timeout = false;
                    $scope.$apply();
                });
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
