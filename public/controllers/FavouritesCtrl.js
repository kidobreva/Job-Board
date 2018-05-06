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

Favourites.controller('FavouritesCtrl', function($scope, $http, $window, $routeParams) {
    console.log('FavouritesCtrl');

    $scope.loaded = false;

    $http
        .get('/profile')
        .then(function(response) {
            console.log(response);
            if (response.status === 200) {
                $scope.loaded = true;
                $scope.favourites = response.data.favourites;
            }
        })
        .catch(function(err) {
            console.error(err.data);
        });
});
