(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/update-profile', {
            templateUrl: 'views/update-profile.html',
            controller: 'UpdateProfile',
            title: 'Настойки на профила'
        });
    }

    // Service
    function Service($rootScope) {
        this.updateProfile = function(user) {
            return $rootScope.promise.post('/api/profile/edit', user);
        };

        this.getProfile = function() {
            return $rootScope.promise.get('/api/edit-profile');
        };
    }

    // Controller
    function Ctrl(UpdateProfileService, $rootScope, $scope, $location, $sanitize, $sce) {
        console.log('Init UpdateProfile Controller');

        // Check for current user
        $rootScope
            .getCurrentUser()
            .then(function() {
                // Get profile
                UpdateProfileService.getProfile()
                    .then(function(response) {
                        console.log(response);
                        //$scope.user.contacts = {};
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
                $location.url('/auth?redirect=' + $location.path());
            });

        // Validate pass
        $scope.validatePass = function() {
            var invalid = false;
            if ($scope.user.newPassword) {
                $scope.shortPass =
                    $scope.user.newPassword.length && $scope.user.newPassword.length < 6;
            }
            if (
                $scope.user.repeatNewPassword &&
                $scope.user.repeatNewPassword !== $scope.user.newPassword
            ) {
                invalid = true;
            }
            $scope.invalid = invalid;
        };

        // Update profile
        $scope.updateProfile = function() {
            //if ($scope.invalid === false) {
            $scope.user.description = $sanitize($scope.user.description);
            UpdateProfileService.updateProfile($scope.user)
                .then(function(response) {
                    $scope.errCode = false;
                    $scope.user.newPassword = '';
                    $scope.user.repeatNewPassword = '';
                    $scope.user.currentPass = '';
                    $scope.addAlert();
                })
                .catch(function(err) {
                    if (err.status === 401) {
                        $scope.errCode = true;
                        $scope.$apply();
                    }
                    console.log('error', err);
                });
            //}
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
