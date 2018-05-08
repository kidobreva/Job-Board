var Users = angular.module('App.Users', ['ngRoute']);

// Route
Users.config([
    '$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/users', {
            templateUrl: 'views/users.html',
            controller: 'UsersCtrl',
            title: 'Потребители'
        });
    }
]);

// Controller
Users.controller('UsersCtrl', function($scope, $http, $window, $routeParams, $timeout) {
    console.log('UsersCtrl');

    // Loader
    $scope.loaded = false;
    $timeout(function() {
        if (!$scope.loaded) {
            $scope.timeout = true;
        }
    }, 1000);

    // Get users
    $http
        .get('/users')
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
});
