var Users = angular.module('App.Users', ['ngRoute']);

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

Users.controller('UsersCtrl', function($scope, $http, $window, $routeParams) {
    console.log('UsersCtrl');

    $scope.loaded = false;

    $http
        .get('/users')
        .then(function(response) {
            console.log(response);
            if (response.status === 200) {
                $scope.loaded = true;
                $scope.users = response.data;
            }
        })
        .catch(function(err) {
            console.error(err.data);
        });
});
