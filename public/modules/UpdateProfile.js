(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/updateProfile', {
            templateUrl: 'views/updateProfile.html',
            controller: 'UpdateProfile',
            title: 'Настойки на профила'
        });
    }

    // Service
    function Service($rootScope) {
        // Add message
        this.updateProfile = function(user) {
            console.log('Add message');
            return $rootScope.promise.post('/api/profile/edit', user);
        };

        this.getProfile = function() {
            return $rootScope.promise.get('/api/profile');
        };
    }

    // Controller
    function Ctrl(UpdateProfileService, $rootScope, $scope, $location) {
        console.log('Init UpdateProfile Controller');

        // Check for current user
        $rootScope
            .getCurrentUser()
            .then(function() {
                // Get profile
                UpdateProfileService.getProfile()
                    .then(function(response) {
                        $scope.user = response.data;
                        $scope.loaded = true;
                        $scope.$apply();
                    })
                    .catch(function() {
                        $scope.loaded = true;
                    });
            })
            // If there's no user
            .catch(function() {
                // Redirect to the login
                $location.path('/login');
            });

        // Validate pass
        $scope.validatePass = function() {
            var invalid = false;
            $scope.shortPass = $scope.user.newPassword.length && $scope.user.newPassword.length < 6;
            if (
                $scope.user.repeatNewPassword &&
                $scope.user.repeatNewPassword !== $scope.user.newPassword
            ) {
                invalid = true;
            }
            $scope.invalid = invalid;
        };

        // Send user data
        function sendUserData() {
            UpdateProfileService.updateProfile($scope.user)
                .then(function(response) {
                    console.log(response);
                    if (response.status === 200) {
                        $scope.errCode = false;
                        $scope.addAlert();
                        $scope.user = response.data;
                    }
                })
                .catch(function(err) {
                    if (err.status === 401) {
                        $scope.errCode = true;
                        $scope.$apply();
                    }
                    console.log('error', err);
                });
        }

        // Update profile
        $scope.updateProfile = function() {
            if ($scope.user.currentPass !== $rootScope.user.password) {
                sendUserData();
                console.log('Invalid currentPass!');
            } else {
                if ($scope.invalid === false) {
                    sendUserData();
                }
            }
        };

        // Alerts
        $scope.alerts = [];
        $scope.addAlert = function() {
            $scope.alerts.length = 0;
            $scope.alerts.push({ type: 'primary', msg: 'Данните ви бяха успешно обновени!' });
            $scope.$apply();
        };
        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };
    }

    // Module
    angular
        .module('UpdateProfile', ['ngRoute'])
        .config(Config)
        .service('UpdateProfileService', Service)
        .controller('UpdateProfile', Ctrl);
})();
