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

AdvertsModule.controller('AdvertsCtrl', function($scope, $http) {
    console.log('AdvertsCtrl');
    $scope.loaded = false;

    $http
        .get('/adverts')
        .then(function(adverts) {
            console.log(adverts);
            $scope.adverts = adverts.data;
            $scope.loaded = true;
        })
        .catch(function(err) {
            console.log(err);
        });
});
