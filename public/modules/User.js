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

        var int = $interval(function() {
            if ($rootScope.headerLoaded) {
                $interval.cancel(int);

                // Check if the the user is a company or an admin
                if (!$rootScope.user) {
                    $location.path('/home');
                    // $rootScope.$apply();
                } else if ($rootScope.user.role !== 'COMPANY' || $rootScope.user.role !== 'ADMIN') {
                    $location.path('/home');
                    // $rootScope.$apply();
                } else {
                    UserService.getUser()
                        .then(function(response) {
                            $scope.loaded = true;
                            $scope.timeout = false;
                            $scope.user = response.data;
                        })
                        .catch(function() {
                            $scope.loaded = true;
                            $scope.timeout = false;
                        });
                }
            }
        }, 100);

        // Show loading animation
        $timeout(function() {
            if (!$scope.loaded) {
                $scope.timeout = true;
            }
        }, 1000);

        $scope.blockUser = UserService.blockUser.bind(null);
    }

    // Module
    angular
        .module('User', ['ngRoute'])
        .config(Config)
        .service('UserService', Service)
        .controller('User', Ctrl);
})();
