(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/auth', {
            templateUrl: 'views/auth.html',
            controller: 'Auth',
            title: 'Вход и регистрация',
            resolve: {
                isLogged: function($rootScope, $location) {
                    $rootScope
                        .getCurrentUser()
                        .then(function() {
                            $location.path('/home');
                        })
                        .catch(function() {});
                }
            }
        });
    }

    // Service
    function Service($rootScope) {
        // Login
        this.login = function(user) {
            console.log('Login');
            return $rootScope.promise.post('/api/login', user);
        };

        // Register
        this.register = function(user) {
            console.log('Register');
            return $rootScope.promise.post('/api/register', user);
        };
    }

    // Controller
    function Ctrl(AuthService, $rootScope, $scope, $location) {
        console.log('Init Auth Controller');
        $scope.registerUser = {};
        $scope.registerUser.isCompany = false;

        $scope.login = function() {
            AuthService.login($scope.user)
                .then(function(response) {
                    $rootScope.isLogged = true;
                    $rootScope.user = response.data;
                    $location.path('/profile');
                    $rootScope.$apply();
                })
                .catch(function(err) {
                    if (err.status === 404) {
                        $scope.user.password = '';
                        $scope.badUser = true;
                        $scope.$apply();
                    }
                    console.error(err.data);
                });
        };
        $scope.register = function() {
            AuthService.register($scope.registerUser)
                .then(function(response) {
                    $rootScope.isLogged = true;
                    $rootScope.user = response.data;
                    $location.path('/profile');
                    $rootScope.$apply();
                })
                .catch(function(err) {
                    // if (err.status === 409) {
                    //     $scope.badUser = true;
                    //     $scope.$apply();
                    // }
                    $scope.addAlert(err.status);
                    $scope.registerUser.bulstat = '';
                    $scope.registerUser.email = '';
                    $scope.registerUser.password = '';
                    $scope.registerUser.repeatPassword = '';                    
                    console.error(err.data);
                    $rootScope.$apply();
                });
        };

        // Alerts
        $scope.alerts = [];
        $scope.addAlert = function(status) {
            $scope.alerts.length = 0;
            console.log(status);
            if (status === 409){
                $scope.alerts.push({ type: 'warning', msg: 'Потребител с такъв имейл вече съществува!' });
            } else {
                $scope.alerts.push({ type: 'warning', msg: 'Потребител с такъв булстат вече съществува!' });
            }
            
            $scope.$apply();
        };
        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };

        // Validate pass
        $scope.validatePass = function() {
            var invalid = false;
            $scope.shortPass = $scope.registerUser.password.length && $scope.registerUser.password.length < 6;
            if (
                $scope.registerUser.repeatPassword &&
                $scope.registerUser.repeatPassword !== $scope.registerUser.password
            ) {
                invalid = true;
            }
            $scope.invalid = invalid;
        };

        // Validate bulstat
        $scope.validateBulstat = function() {
            var errBulstat = false;
            if ($scope.registerUser.bulstat.length &&
                ($scope.registerUser.bulstat.length !== 9 || !$scope.isNumberBulstat())) {
                    errBulstat = true;
            }
            $scope.errBulstat = errBulstat;
        }

        $scope.isNumberBulstat = function() {
            var regex = /^[0-9]*$/gm;
            return regex.test(Number($scope.registerUser.bulstat));
        };

        $scope.reset = function(isCompany) {
            $scope.registerUser = {};
            if (isCompany) {
                $scope.registerUser.isCompany = true;
            }
        }
    }

    // Module
    angular
        .module('Auth', ['ngRoute'])
        .config(Config)
        .service('AuthService', Service)
        .controller('Auth', Ctrl);
})();
