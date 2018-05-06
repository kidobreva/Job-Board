var Advert = angular.module('App.Advert', ['ngRoute']);

Advert.config([
    '$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/advert/:id', {
            templateUrl: 'views/advert.html',
            controller: 'AdvertCtrl',
            title: 'Информация за обява'
        });
    }
]);

Advert.controller('AdvertCtrl', function($scope, $http, $window, $routeParams) {
    console.log('AdvertCtrl');

    $scope.loaded = false;

    $http
        .get('/advert/' + $routeParams.id)
        .then(function(response) {
            console.log(response);
            if (response.status === 200) {
                $scope.loaded = true;
                $scope.advert = response.data;
            }
        })
        .catch(function(err) {
            console.error(err.data);
        });
});
