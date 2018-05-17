(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/profile', {
            templateUrl: 'views/profile.html',
            controller: 'Profile',
            title: 'Профил'
        });
    }

    // Service
    function Service($rootScope) {
        // Upload picture
        this.uploadPicture = function(e) {
            return $rootScope.promise.post('/api/profile/upload-picture/' + $rootScope.user.id, {
                data: e.target.result
            });
        };
    }

    // Controller
    function Ctrl(ProfileService, $rootScope, $scope, $location) {
        console.log('Init Profile Controller');

        // Check for current user
        $rootScope
            .getCurrentUser()
            .then(function(user) {
                $scope.user = user;
                $scope.loaded = true;
                $scope.timeout = false;
            })
            // If there's no user
            .catch(function() {
                // Redirect to the login
                $location.path('/login');
            });

        // Custom file select
        $scope.getFile = new selectFile();
        $scope.getFile.targets('choose', 'selected');

        // Upload picture
        $scope.isChosen = function() {
            $scope.chosen = true;
            $scope.$apply();
        };
        $scope.uploadPicture = function() {
            var fileReader = new FileReader();
            fileReader.onloadend = function(e) {
                ProfileService.uploadPicture(e).then(function() {
                    $rootScope.user.img = e.target.result;
                    $scope.chosen = false;
                    $scope.$apply();
                });
            };
            fileReader.readAsDataURL(
                angular.element(document.querySelector('.upload'))[0].files[0]
            );
        };
    }

    // Module
    angular
        .module('Profile', ['ngRoute'])
        .config(Config)
        .service('ProfileService', Service)
        .controller('Profile', Ctrl);
})();
