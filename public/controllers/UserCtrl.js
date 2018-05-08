var User = angular.module('App.User', ['ngRoute']);

// Route
User.config([
    '$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/user/:id', {
            templateUrl: 'views/user.html',
            controller: 'UserCtrl',
            title: 'Потребител'
        });
    }
]);

// Controller
User.controller('UserCtrl', function($scope, $http, $window, $routeParams, $timeout, $rootScope) {
    console.log('UserCtrl');

    // Loader
    $scope.loaded = false;
    $timeout(function() {
        if (!$scope.loaded) {
            $scope.timeout = true;
        }
    }, 1000);

    // (Admin) Block user
    $scope.blockUser = function() {
        $http
            .patch('/user/block/' + $routeParams.id, { isBlocked: true })
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
    };

    // Get user
    $http
        .get('/user/' + $routeParams.id)
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
