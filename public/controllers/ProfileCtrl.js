var Profile = angular.module('App.Profile', ['ngRoute']);

Profile.config([
    '$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/profile', {
            templateUrl: 'views/profile.html',
            controller: 'ProfileCtrl',
            title: 'Профил'
        });
    }
]);

Profile.controller('ProfileCtrl', function($scope, $http, $window, $routeParams) {
    console.log('ProfileCtrl');

    $scope.loaded = false;

    $http
        .get('/profile')
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
