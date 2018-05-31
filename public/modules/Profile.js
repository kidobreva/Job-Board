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

        this.deleteVideo = function() {
            return $rootScope.promise.delete('/api/profile/video');
        };
    }

    // Controller
    function Ctrl(ProfileService, $rootScope, $scope, $location, FileUploader) {
        console.log('Init Profile Controller');
        $scope.isProfile = true;
        $scope.deletePicture = function(url, scope) {
            ProfileService.deletePicture(url).then(function(res) {
                scope.$parent.currentImage =
                    scope.$parent.images[scope.$parent.images.indexOf(url) + 1];
                $scope.user.pictures.splice($scope.user.pictures.indexOf(url), 1);
                $scope.$apply();
            });
        };
        $scope.deleteVideo = function() {
            ProfileService.deleteVideo().then(function() {
                $scope.user.video = null;
                $scope.$apply();
            });
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
                $scope.uploadCV = new FileUploader({
                    url: '/api/profile/upload-cv/' + $rootScope.user.id
                });
                $scope.uploadCV.onAfterAddingFile = function(file) {
                    ProfileService.upload(file)
                        .then(function(res) {
                            $scope.user.cv = res.cv;
                            $scope.addAlert('user');
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
                    ProfileService.upload(file)
                        .then(function(data) {
                            $scope.user.video = data.video;
                        })
                        .catch(function(err) {
                            console.log(err);
                        });
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

        // Alerts
        $scope.alerts = [];
        $scope.leftAlerts = [];
        $scope.addAlert = function(type) {
            $scope.alerts.length = 0;
            $scope.leftAlerts.length = 0;
            switch (type) {
                case 'user':
                    $scope.alerts.push({
                        type: 'primary',
                        msg: 'CV-то ви беше прикачено успешно!'
                    });
                    break;
            }
            // $scope.$apply();
        };
        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
            $scope.leftAlerts.splice(index, 1);
        };

        // Custom file select
        $scope.getFile = function(id) {
            if (id) {
                var choose = document.getElementById(id);
                if (typeof choose != 'undefined') {
                    choose.click();
                }
            }
        };
    }

    // Module
    angular
        .module('Profile', ['ngRoute'])
        .config(Config)
        .service('ProfileService', Service)
        .controller('Profile', Ctrl);
})();
