var AdvertsModule = angular.module('App.Adverts', ['ngRoute']);

// Route
AdvertsModule.config([
    '$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/adverts', {
            templateUrl: 'views/adverts.html',
            controller: 'AdvertsCtrl',
            title: 'Обяви'
        });
    }
]);

// Controller
AdvertsModule.controller('AdvertsCtrl', function($scope, $http, $timeout) {
    console.log('AdvertsCtrl');

    // Loader
    $scope.loaded = false;
    $timeout(function() {
        if (!$scope.loaded) {
            $scope.timeout = true;
        }
    }, 1000);

    // Get adverts
    $http
        .get('/adverts')
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
