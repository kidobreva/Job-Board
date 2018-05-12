(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/auth', {
            templateUrl: 'views/auth.html',
            controller: 'Auth',
            title: 'Вход и регистрация'
        });
    }

    // Service
    function Service($rootScope) {
        // Login
        this.login = function(user) {
            console.log('Login');
            return $rootScope.promise('POST', '/api/login', user);
        };

        // Register
        this.register = function(user) {
            console.log('Register');
            return $rootScope.promise('POST', '/api/register', user);
        };
    }

    // Controller
    function Ctrl(AuthService, $rootScope, $scope, $window) {
        console.log('Init Auth Controller');
        $scope.registerUser = {};
        $scope.registerUser.isCompany = false;

        $scope.login = function() {
            AuthService.login($scope.user)
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
        $scope.register = function() {
            AuthService.register($scope.registerUser)
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
    }

    // Module
    angular
        .module('Auth', ['ngRoute'])
        .config(Config)
        .service('AuthService', Service)
        .controller('Auth', Ctrl);
})();
