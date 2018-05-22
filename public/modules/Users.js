(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/admin/users', {
            templateUrl: 'views/users.html',
            controller: 'Users',
            title: 'Потребители'
        });
    }

    // Service
    function Service($rootScope) {
        // Get users
        this.getUsers = function() {
            return $rootScope.promise.get('/api/admin/users');
        };
    }

    // Controller
    function Ctrl(UsersService, $rootScope, $scope, $location, $timeout) {
        console.log('Init Users Controller');

        // Check for current user
        $rootScope
            .getCurrentUser()
            .then(function(currentUser) {
                // Check for the user's role
                if (currentUser.role !== 'ADMIN') {
                    $location.path('/home');
                } else {
                    // Get users
                    UsersService.getUsers()
                        .then(function(response) {
                            $scope.users = response.data;
                            $scope.$apply();
                            $scope.loaded = true;
                            $scope.timeout = false;
                        })
                        .catch(function() {
                            $scope.loaded = true;
                            $scope.timeout = false;
                        });

                    // Show loading wheel if needed after 1 second
                    $timeout(function() {
                        if (!$scope.loaded) {
                            $scope.timeout = true;
                        }
                    }, 1000);
                }
            })
            // If there's no user
            .catch(function() {
                // Redirect to the login
                $location.path('/auth');
            });
    }

    // Module
    angular
        .module('Users', ['ngRoute'])
        .config(Config)
        .service('UsersService', Service)
        .controller('Users', Ctrl);
})();
