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
    function Ctrl(UpdateProfileService, $rootScope, $scope) {
        console.log('Init UpdateProfile Controller');

        UpdateProfileService.getProfile()
            .then(function(response) {
                $scope.user = response.data;
                $scope.loaded = true;
                $scope.$apply();
                console.log($scope.loaded);
                $scope.timeout = false;
            })
            .catch(function(err) {
                $scope.loaded = true;
                $scope.timeout = false;
                console.error(err.data);
            });

        $scope.updateProfile = function() {
            if (new Hashes.SHA1().hex($scope.user.currentPass) !== $rootScope.user.password) {
                sendUserData();
                console.log('Invalid currentPass!');
            } else {
                if ($scope.invalid === false) {
                    sendUserData();
                }
            }

            $scope.alerts = [];

            $scope.addAlert = function() {
                $scope.alerts.length = 0;
                $scope.alerts.push({ type: 'primary', msg: 'Данните ви бяха успешно обновени!' });
                $scope.$apply();
            };

            $scope.closeAlert = function(index) {
                $scope.alerts.splice(index, 1);
            };

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
        };

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
    }

    // Module
    angular
        .module('UpdateProfile', ['ngRoute'])
        .config(Config)
        .service('UpdateProfileService', Service)
        .controller('UpdateProfile', Ctrl);
})();
