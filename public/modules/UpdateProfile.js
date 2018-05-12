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
        // Add new data
        this.updateProfile = function (user) {
            console.log('Add new data');
            return $rootScope.promise('POST', '/api/profile/edit', user);
        }

        this.getProfile = function() {
            return $rootScope.promise('GET', '/api/profile');
        };
    }

    // Controller
    function Ctrl(UpdateProfileService, $rootScope, $scope) {
        console.log('Init UpdateProfile Controller');
        
        UpdateProfileService.getProfile()
            .then(function(response) {
                if (response.status === 200) {
                    $scope.user = response.data;
                    $scope.loaded = true;
                    $scope.$apply();
                    console.log($scope.loaded);
                    $scope.timeout = false;
                }
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
            }

            $scope.alerts = [];
           
            $scope.addAlert = function() {
                $scope.alerts.length = 0;
                $scope.alerts.push({ type: 'primary', msg: 'Данните ви бяха успешно обновени!' });
                $scope.$apply();                
            }

            $scope.closeAlert = function(index) {
                $scope.alerts.splice(index, 1);  
            }    
            
            function sendUserData () {
                UpdateProfileService.updateProfile($scope.user)
                    .then(function (response) {
                        console.log(response);
                        if (response.status === 200) {   
                            $scope.errCode = false; 
                            //$scope.errCodeEqualPass = false;                   
                            $scope.addAlert();  
                            $scope.user = response.data;                          
                        }
                        
                    })
                    .catch(function(err) {
                        if (err.status === 401) {
                            $scope.errCode = true;
                            $scope.$apply();
                        } 
                        // if (err.status === 400) {
                        //     $scope.errCodeEqualPass = true;
                        //     $scope.$apply();
                        // }                         
                        console.log('error', err);
                    });
            }
        } 
        

        $scope.validatePass = function () {
            var invalid = false;
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
    
    }

        
    // Module
    angular
        .module('UpdateProfile', ['ngRoute'])
        .config(Config)
        .service('UpdateProfileService', Service)
        .controller('UpdateProfile', Ctrl);
})();