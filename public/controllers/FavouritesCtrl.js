var Favourites = angular.module('App.Favourites', ['ngRoute']);

Favourites.config([
    '$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/favourites', {
            templateUrl: 'views/favourites.html',
            controller: 'FavouritesCtrl',
            title: 'Любими обяви'
        });
    }
]);

Favourites.controller('FavouritesCtrl', function(
    $scope,
    $http,
    $window,
    $routeParams,
    $timeout
) {
    console.log('FavouritesCtrl');

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
                $scope.favourites = response.data.favourites;
            }
        })
        .catch(function(err) {
            $scope.loaded = true;
            $scope.timeout = false;
            console.error(err.data);
        });
});
