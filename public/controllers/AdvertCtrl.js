var Advert = angular.module('App.Advert', ['ngRoute']);

// Route
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

// Controller
Advert.controller('AdvertCtrl', function($scope, $http, $window, $routeParams, $timeout) {
    console.log('AdvertCtrl');

    $scope.loaded = false;

    // Loader
    $timeout(function() {
        if (!$scope.loaded) {
            $scope.timeout = true;
        }
    }, 1000);

    // Save to favourites
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

    // Apply for an advert
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

    // Delete advert
    $scope.deleteAdvert = function() {
        $http
            .delete('/advert/' + $routeParams.id)
            .then(function(response) {
                console.log(response);
                if (response.status === 200) {
                    console.log('Advert deleted!');
                }
            })
            .catch(function(err) {
                console.error(err.data);
            });
    }

    // Get adverts
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
                            $scope.timeout = false;
                            $scope.user = response.data;
                        }
                    })
                    .catch(function(err) {
                        $scope.loaded = true;
                        $scope.timeout = false;
                        console.error(err.data);
                    });
            }
        })
        .catch(function(err) {
            console.error(err.data);
        });
});
