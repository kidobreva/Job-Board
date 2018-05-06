var AuthModule = angular.module('App.Auth', ['ngRoute']);

AuthModule.config([
    '$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/auth', {
            templateUrl: 'views/auth.html',
            controller: 'AuthCtrl',
            title: 'Вход и регистрация'
        });
    }
]);

AuthModule.controller('AuthCtrl', function($scope, $http, $window) {
    console.log('AuthCtrl');
    $scope.registerUser = {};
    $scope.registerUser.isCompany = false;

    $scope.login = function() {
        console.log('Login');

        $http
            .post('/login', $scope.user)
            .then(function(response) {
                if (response.status === 200) {
                    $window.location.href = '#!/home';
                }
            })
            .catch(function(err) {
                console.error(err.data);
            });
    };

    $scope.register = function() {
        console.log('Register');
        console.log($scope.registerUser);

        $http
            .post('/register', $scope.registerUser)
            .then(function(response) {
                if (response.status === 200) {
                    $window.location.href = '#!/home';
                }
            })
            .catch(function(err) {
                console.error(err.data);
            });
    };
});
