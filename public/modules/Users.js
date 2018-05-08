(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/users', {
            templateUrl: 'views/users.html',
            controller: 'UsersCtrl',
            title: 'Потребители'
        });
    }

    // Service
    function Service($http, $window, $routeParams) {
        // Get users
        this.getUsers = function(scope) {
            $http
                .get('/users')
                .then(function(response) {
                    console.log(response);
                    if (response.status === 200) {
                        scope.loaded = true;
                        scope.timeout = false;
                        scope.users = response.data;
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
    function Ctrl($scope, $timeout, UsersService) {
        console.log('UsersCtrl');

        // Loader
        $scope.loaded = false;
        $timeout(function() {
            if (!$scope.loaded) {
                $scope.timeout = true;
            }
        }, 1000);

        UsersService.getUsers($scope);
    }

    // Module
    angular
        .module('App.Users', ['ngRoute'])
        .config(['$routeProvider', Config])
        .service('UsersService', Service)
        .controller('UsersCtrl', Ctrl);
})();
