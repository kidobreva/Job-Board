(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/admin/users', {
            templateUrl: 'views/admin/users.html',
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
    function Ctrl(UsersService, $rootScope, $scope, $location, $interval, $timeout) {
        console.log('Init Users Controller');

        // Get users
        function getUsers() {
            UsersService.getUsers()
                .then(function(response) {
                    $scope.loaded = true;
                    $scope.timeout = false;
                    $scope.users = response.data;
                })
                .catch(function() {
                    $scope.loaded = true;
                    $scope.timeout = false;
                });
        }

        var int = $interval(function() {
            if ($rootScope.headerLoaded) {
                $interval.cancel(int);

                // Check if the user is admin
                if (!$rootScope.user) {
                    $location.path('/home');
                    $rootScope.$apply();
                } else if ($rootScope.user.role !== 'ADMIN') {
                    $location.path('/home');
                    $rootScope.$apply();
                } else {
                    getUsers();

                    // Show loading animation
                    $timeout(function() {
                        if (!$scope.loaded) {
                            $scope.timeout = true;
                        }
                    }, 1000);
                }
            }
        }, 100);
    }

    // Module
    angular
        .module('Users', ['ngRoute'])
        .config(Config)
        .service('UsersService', Service)
        .controller('Users', Ctrl);
})();
