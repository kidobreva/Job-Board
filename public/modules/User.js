(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/user/:id', {
            templateUrl: 'views/user.html',
            controller: 'UserCtrl',
            title: 'Потребител'
        });
    }

    // Service
    function Service($http, $routeParams) {
        // (Admin) Block user
        this.blockUser = function(scope) {
            $http
                .patch('/user/block/' + $routeParams.id, { isBlocked: true })
                .then(function(response) {
                    console.log(response);
                    if (response.status === 200) {
                        scope.loaded = true;
                        scope.timeout = false;
                        scope.user = response.data;
                    }
                })
                .catch(function(err) {
                    scope.loaded = true;
                    scope.timeout = false;
                    console.error(err.data);
                });
        };

        // Get user
        this.getUser = function(scope) {
            $http
                .get('/user/' + $routeParams.id)
                .then(function(response) {
                    console.log(response);
                    if (response.status === 200) {
                        scope.loaded = true;
                        scope.timeout = false;
                        scope.user = response.data;
                    }
                })
                .catch(function(err) {
                    scope.loaded = true;
                    scope.timeout = false;
                    console.error(err.data);
                });
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

        $scope.blockUser = UserService.blockUser.bind(null, $scope);
        UserService.getUser($scope);
    }

    // Module
    angular
        .module('App.User', ['ngRoute'])
        .config(['$routeProvider', Config])
        .service('UserService', Service)
        .controller('UserCtrl', Ctrl);
})();
