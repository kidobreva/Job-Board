var AuthModule = angular.module('App.Auth', ['ngRoute']);

// Route
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

// Controller
AuthModule.controller('AuthCtrl', function($scope, $http, $window, $rootScope) {
    console.log('AuthCtrl');
    $scope.registerUser = {};
    $scope.registerUser.isCompany = false;

    // Login
    $scope.login = function() {
        console.log('Login');

        $http
            .post('/login', $scope.user)
            .then(function(response) {
                if (response.status === 200) {
                    $rootScope.isLogged = true;
                    $rootScope.user = response.data;
                    $window.location.href = '#!/profile';
                }
            })
            .catch(function(err) {
                console.error(err.data);
            });
    };

    // Register
    $scope.register = function() {
        console.log('Register');
        console.log($scope.registerUser);

        $http
            .post('/register', $scope.registerUser)
            .then(function(response) {
                if (response.status === 200) {
                    $rootScope.isLogged = true;
                    $rootScope.user = response.data;
                    $window.location.href = '#!/profile';
                }
            })
            .catch(function(err) {
                console.error(err.data);
            });
    };
});
