var SearchModule = angular.module('App.Search', ['ngRoute']);

SearchModule.config([
    '$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/search', {
            templateUrl: 'views/search.html',
            controller: 'SearchCtrl',
            title: 'Търсене на обяви'
        });
    }
]);

SearchModule.controller('SearchCtrl', function(
    $scope,
    $http,
    $timeout,
    $routeParams
) {
    console.log('SearchCtrl');
    $scope.loaded = false;

    var query = '/search?';
    if ($routeParams.category !== 'undefined') {
        query += 'category=' + $routeParams.category + '&';
    }
    if ($routeParams.city !== 'undefined') {
        query += 'city=' + $routeParams.city + '&';
    }

    $timeout(function() {
        if (!$scope.loaded) {
            $scope.timeout = true;
        }
    }, 1000);

    $http
        .get(query)
        .then(function(adverts) {
            console.log(adverts);
            $scope.adverts = adverts.data;
            $scope.loaded = true;
            $scope.timeout = false;
        })
        .catch(function(err) {
            $scope.loaded = true;
            $scope.timeout = false;
            console.log(err);
        });
});
