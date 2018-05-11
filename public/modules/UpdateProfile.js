(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/updateProfile', {
            templateUrl: 'views/updateProfile.html',
            controller: 'UpdateProfileCtrl',
            title: 'Настойки на профила'
        });
    }

    // Service
    function Service($rootScope) {
        // Add message
        this.updateProfile = function (user) {
            console.log('Add message');
            return $rootScope.promise('POST', '/api/profile/edit', user);
        }
    }

    // Controller
    function Ctrl(UpdateProfileService, $rootScope, $scope) {
        console.log('UpdateProfileCtrl');
        // $scope.user = $rootScope.getUser();

        $scope.updateProfile = function() {
            if (new Hashes.SHA1().hex($scope.user.currentPass) !== $rootScope.user.password) {
                sendUserData();
                console.log('Invalid currentPass!');   
            } else {
                if ($scope.user.newPassword) {
                    if ($scope.user.newPassword !== $scope.user.repeatNewPassword 
                        || $scope.user.newPassword.length < 6 ) {                            
                            console.log($scope.user)
                            console.log('The passwords are not the same!');
                        } else {
                            sendUserData();
                        }
                    } else {
                         sendUserData();
                 }
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
                            $scope.addAlert();
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
        } 
        

        $scope.validatePass = function () {
            var invalid = false;
            console.log($scope.user.repeatNewPassword);
            if ($scope.user.repeatNewPassword && $scope.user.repeatNewPassword !== $scope.user.newPassword) {
                invalid = true;                
            }
            $scope.invalid = invalid;
        }

        $scope.isSubmitted = function () {
            return $scope.submit;
        }

        $scope.clicked = function () {
            $scope.submit = true;
        }
    
    }

        
    // Module
    angular
        .module('App.UpdateProfile', ['ngRoute'])
        .config(['$routeProvider', Config])
        .service('UpdateProfileService', Service)
        .controller('UpdateProfileCtrl', Ctrl);
})();