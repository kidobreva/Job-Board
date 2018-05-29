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
    function Service($rootScope, $q) {
        // Upload promise
        this.upload = function(file) {
            var deferred = $q.defer();
            file.onSuccess = deferred.resolve;
            file.onError = deferred.reject;
            file.upload();
            return deferred.promise;
        };

        this.deletePicture = function(url) {
            console.log({ url: url });
            return $rootScope.promise.patch('/api/profile/pictures', { url: url });
        };
    }

    // Controller
    function Ctrl(ProfileService, $rootScope, $scope, $location, FileUploader) {
        console.log('Init Profile Controller');
        $scope.isProfile = true;
        $scope.deletePicture = function(url) {
            ProfileService.deletePicture(url);
        };

        // Check for current user
        $rootScope
            .getCurrentUser()
            .then(function(user) {
                // Uploader for avatar/logo
                $scope.uploadPicture = new FileUploader({
                    url: '/api/profile/upload-picture/' + $rootScope.user.id
                });
                $scope.uploadPicture.onAfterAddingFile = function(file) {
                    ProfileService.upload(file)
                        .then(function(data) {
                            $scope.user.img = data.img + '?' + Date.now();
                        })
                        .catch(function(err) {
                            console.log(err);
                        });
                };

                // Uploader for CV
                $scope.uploadPicture = new FileUploader({
                    url: '/api/profile/upload-cv/' + $rootScope.user.id
                });
                $scope.uploadPicture.onAfterAddingFile = function(file) {
                    ProfileService.upload(file)
                        .then(function(res) {
                            $scope.user.cv = res.cv;
                        })
                        .catch(function(err) {
                            console.log(err);
                        });
                };

                // Uploader for pictures
                $scope.uploadPictures = new FileUploader({
                    url: '/api/profile/upload-pictures/' + $rootScope.user.id
                });
                $scope.uploadPictures.onAfterAddingFile = function(file) {
                    ProfileService.upload(file)
                        .then(function(data) {
                            $scope.user.pictures = data.pictures;
                        })
                        .catch(function(err) {
                            console.log(err);
                        });
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
    }

    // Module
    angular
        .module('Profile', ['ngRoute'])
        .config(Config)
        .service('ProfileService', Service)
        .controller('Profile', Ctrl);
})();
