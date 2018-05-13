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
<<<<<<< HEAD
        // Add new data
        this.updateProfile = function (user) {
            console.log('Add new data');
            return $rootScope.promise('POST', '/api/profile/edit', user);
        }
=======
        // Add message
        this.updateProfile = function(user) {
            console.log('Add message');
            return $rootScope.promise.post('/api/profile/edit', user);
        };
>>>>>>> 6b0d8c9f594afc4ec8b0374e1c5dc97fc4ffda2f

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
<<<<<<< HEAD
                if ($scope.invalid === false) {
                    sendUserData();
                }
                
                // if ($scope.user.newPassword) {
                //     if ($scope.user.newPassword !== $scope.user.repeatNewPassword 
                //         || $scope.user.newPassword.length < 6 ) {                            
                //             console.log($scope.user)
                //             console.log('The passwords are not the same!');
                //         } else {
                //             sendUserData();
                //         }
                //     } else {
                //          sendUserData();
                //  }
=======
                if ($scope.user.newPassword) {
                    if (
                        $scope.user.newPassword !== $scope.user.repeatNewPassword ||
                        $scope.user.newPassword.length < 6
                    ) {
                        console.log($scope.user);
                        console.log('The passwords are not the same!');
                    } else {
                        sendUserData();
                    }
                } else {
                    sendUserData();
                }
>>>>>>> 6b0d8c9f594afc4ec8b0374e1c5dc97fc4ffda2f
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
<<<<<<< HEAD
                        if (response.status === 200) {   
                            $scope.errCode = false; 
                            //$scope.errCodeEqualPass = false;                   
                            $scope.addAlert();  
                            $scope.user = response.data;                          
                        }
                        
=======
                        $scope.addAlert();
>>>>>>> 6b0d8c9f594afc4ec8b0374e1c5dc97fc4ffda2f
                    })
                    .catch(function(err) {
                        if (err.status === 401) {
                            $scope.errCode = true;
                            $scope.$apply();
<<<<<<< HEAD
                        } 
                        // if (err.status === 400) {
                        //     $scope.errCodeEqualPass = true;
                        //     $scope.$apply();
                        // }                         
=======
                        }
>>>>>>> 6b0d8c9f594afc4ec8b0374e1c5dc97fc4ffda2f
                        console.log('error', err);
                    });
            }
        };

        $scope.validatePass = function() {
            var invalid = false;
<<<<<<< HEAD
            var shortPass = false;
            //console.log($scope.user.repeatNewPassword);
            if ($scope.user.repeatNewPassword &&
                $scope.user.repeatNewPassword !== $scope.user.newPassword ) {
                invalid = true;                
            }
            
            $scope.invalid = invalid;            
        }
        // function isShortPass ($scope) {
        //     if ($scope.user.newPassword.length < 6 &&
        //         $scope.user.repeatNewPassword < 6 ) {
        //         console.log('new pass lenght', $scope.user.newPassword.length);
        //         shortPass = true;                
        //     }
        //     $shortPass = shortPass;
        // }

        

        // $scope.isSubmitted = function () {
        //     return $scope.submit;
        // }

        // $scope.clicked = function () {
        //     $scope.submit = true;
        // }
    
=======
            console.log($scope.user.repeatNewPassword);
            if (
                $scope.user.repeatNewPassword &&
                $scope.user.repeatNewPassword !== $scope.user.newPassword
            ) {
                invalid = true;
            }
            $scope.invalid = invalid;
        };

        $scope.isSubmitted = function() {
            return $scope.submit;
        };

        $scope.clicked = function() {
            $scope.submit = true;
        };
>>>>>>> 6b0d8c9f594afc4ec8b0374e1c5dc97fc4ffda2f
    }

    // Module
    angular
        .module('UpdateProfile', ['ngRoute'])
        .config(Config)
        .service('UpdateProfileService', Service)
        .controller('UpdateProfile', Ctrl);
})();
