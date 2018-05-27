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
        this.uploadPicture = function(name, e) {
            return $rootScope.promise.post('/api/profile/upload-picture/' + $rootScope.user.id, {
                name: name,
                img: e.target.result
            });
        };

        // Upload video
        this.uploadVideo = function(name, e) {
            return $rootScope.promise.post('/api/profile/upload-video/' + $rootScope.user.id, {
                name: name,
                img: e.target.result
            });
        };
    }

    // Controller
    function Ctrl(ProfileService, $rootScope, $scope, $location, FileUploader) {
        console.log('Init Profile Controller');
        $scope.isVideo = false;

        // Check for current user
        $rootScope
            .getCurrentUser()
            .then(function(user) {
                // Uploader for pictures
                $scope.uploadPictures = new FileUploader({
                    url: '/api/profile/upload-pictures/' + $rootScope.user.id
                });
                $scope.uploadPictures.onAfterAddingFile = function(file) {
                    file.upload();
                };

                // Uploader for videos
                $scope.uploadVideo = new FileUploader({
                    url: '/api/profile/upload-video/' + $rootScope.user.id
                });
                $scope.uploadVideo.onAfterAddingFile = function(file) {
                    file.upload();
                };

                $scope.user = user;
                $scope.loaded = true;
                $scope.timeout = false;
            })
            // If there's no user
            .catch(function() {
                // Redirect to the login
                $location.url('/auth?redirect=' + $location.path());
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
                var name = angular.element(document.querySelector('.upload'))[0].files[0].name;
                ProfileService.uploadPicture(name, e).then(function() {
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
