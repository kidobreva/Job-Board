var User = angular.module('App.User', ['ngRoute']);

User.config([
    '$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/user/:id', {
            templateUrl: 'views/user.html',
            controller: 'UserCtrl',
            title: 'Потребител'
        });
    }
]);

User.controller('UserCtrl', function($scope, $http, $window, $routeParams) {
    console.log('UserCtrl');

    $scope.loaded = false;

    $http
        .get('/user/' + $routeParams.id)
        .then(function(response) {
            console.log(response);
            if (response.status === 200) {
                $scope.loaded = true;
                $scope.user = response.data;
            }
        })
        .catch(function(err) {
            console.error(err.data);
        });
});
