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
            return $rootScope.promise(
                'PATCH',
                '/api/user/block/' + $routeParams.id,
                { isBlocked: true }
            );
        };

        // Get user
        this.getUser = function() {
            return $rootScope.promise('GET', '/api/user/' + $routeParams.id);
        };
    }

    // Controller
    function Ctrl(UserService, $scope, $timeout) {
        console.log('UserCtrl');

        // Loader
        $scope.loaded = false;
        $timeout(function() {
            if (!$scope.loaded) {
                $scope.timeout = true;
            }
        }, 1000);

        $scope.blockUser = function() {
            UserService.blockUser()
                .then(function(response) {
                    console.log(response);
                    if (response.status === 200) {
                        $scope.loaded = true;
                        $scope.timeout = false;
                        $scope.user = response.data;
                    }
                })
                .catch(function(err) {
                    $scope.loaded = true;
                    $scope.timeout = false;
                    console.error(err.data);
                });
        };
        UserService.getUser()
            .then(function(response) {
                console.log(response);
                if (response.status === 200) {
                    $scope.loaded = true;
                    $scope.timeout = false;
                    $scope.user = response.data;
                }
            })
            .catch(function(err) {
                $scope.loaded = true;
                $scope.timeout = false;
                console.error(err.data);
            });
    }

    // Module
    angular
        .module('User', ['ngRoute'])
        .config(Config)
        .service('UserService', Service)
        .controller('User', Ctrl);
})();
