(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/auth', {
            templateUrl: 'views/auth.html',
            controller: 'AuthCtrl',
            title: 'Вход и регистрация'
        });
    }

    // Service
    function Service($http, $window, $rootScope) {
        // Login
        this.login = function(scope) {
            console.log('Login');

            $http
                .post('/login', scope.user)
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
        this.register = function(scope) {
            console.log('Register');
            console.log(scope.registerUser);

            $http
                .post('/register', scope.registerUser)
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

    // Controller
    function Ctrl($scope, AuthService) {
        console.log('AuthCtrl');
        $scope.registerUser = {};
        $scope.registerUser.isCompany = false;

        $scope.login = AuthService.login.bind(null, $scope);
        $scope.register = AuthService.register.bind(null, $scope);
    }

    // Module
    angular
        .module('App.Auth', ['ngRoute'])
        .config(['$routeProvider', Config])
        .service('AuthService', Service)
        .controller('AuthCtrl', Ctrl);
})();
