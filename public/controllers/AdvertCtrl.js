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

    $scope.save = function() {
        $http
            .post('/favourite', $scope.advert)
            .then(function(response) {
                console.log(response);
                if (response.status === 200) {
                    console.log('Saved!');
                }
            })
            .catch(function(err) {
                console.error(err.data);
            });
    };

    $scope.apply = function() {
        $http
            .post('/apply', $scope.advert)
            .then(function(response) {
                console.log(response);
                if (response.status === 200) {
                    console.log('Applied!');
                }
            })
            .catch(function(err) {
                console.error(err.data);
            });
    };

    $http
        .get('/advert/' + $routeParams.id)
        .then(function(response) {
            console.log('advert:', response);
            if (response.status === 200) {
                $scope.advert = response.data;

                $http
                    .get('/profile')
                    .then(function(response) {
                        console.log('user:', response);
                        if (response.status === 200) {
                            $scope.loaded = true;
                            $scope.user = response.data;
                        }
                    })
                    .catch(function(err) {
                        $scope.loaded = true;
                        console.error(err.data);
                    });
            }
        })
        .catch(function(err) {
            console.error(err.data);
        });
});
