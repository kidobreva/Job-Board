(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/user/:id', {
            templateUrl: 'views/user.html',
            controller: 'User',
            title: 'Потребител'
        });
    }

    // Service
    function Service($rootScope, $http, $routeParams) {
        // (Admin) Block user
        this.blockUser = function() {
            return $rootScope.promise.patch('/api/user/block/' + $routeParams.id, {
                isBlocked: true
            });
        };

        // Get user
        this.getUser = function() {
            return $rootScope.promise.get('/api/user/' + $routeParams.id);
        };
    }

    // Controller
    function Ctrl(UserService, $rootScope, $scope, $location, $interval, $timeout) {
        console.log('Init User Controller');
        $scope.blockUser = UserService.blockUser.bind(null);

        // Check for current user
        $rootScope
            .getCurrentUser()
            .then(function(currentUser) {
                // Check for the user's role
                if (currentUser.role === 'USER') {
                    $location.path('/home');
                } else {
                    // Get user
                    UserService.getUser()
                        .then(function(response) {
                            $scope.userDetails = response.data;
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
        .module('User', ['ngRoute'])
        .config(Config)
        .service('UserService', Service)
        .controller('User', Ctrl);
})();
