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

Profile.controller('ProfileCtrl', function(
    $scope,
    $http,
    $window,
    $routeParams,
    $timeout
) {
    console.log('ProfileCtrl');

    $scope.loaded = false;

    $timeout(function() {
        if (!$scope.loaded) {
            $scope.timeout = true;
        }
    }, 1000);

    $http
        .get('/profile')
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
});
