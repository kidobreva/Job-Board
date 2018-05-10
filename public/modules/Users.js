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
    function Service($rootScope) {
        // Get users
        this.getUsers = function() {
            return $rootScope.promise('GET', '/api/users');
        };
    }

    // Controller
    function Ctrl(UsersService, $scope, $timeout) {
        console.log('UsersCtrl');

        // Loader
        $scope.loaded = false;
        $timeout(function() {
            if (!$scope.loaded) {
                $scope.timeout = true;
            }
        }, 1000);

        UsersService.getUsers()
            .then(function(response) {
                console.log(response);
                if (response.status === 200) {
                    $scope.loaded = true;
                    $scope.timeout = false;
                    $scope.users = response.data;
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
        .module('App.Users', ['ngRoute'])
        .config(['$routeProvider', Config])
        .service('UsersService', Service)
        .controller('UsersCtrl', Ctrl);
})();
