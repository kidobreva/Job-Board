var AdvertsModule = angular.module('App.Adverts', ['ngRoute']);

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

AdvertsModule.controller('AdvertsCtrl', function($scope, $http, $timeout) {
    console.log('AdvertsCtrl');
    $scope.loaded = false;

    $timeout(function() {
        if (!$scope.loaded) {
            $scope.timeout = true;
        }
    }, 1000);

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
