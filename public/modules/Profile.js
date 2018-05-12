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
        // Get profile
        this.getProfile = function() {
            return $rootScope.promise('GET', '/api/profile');
        };

        // Upload picture
        this.uploadPicture = function(e) {
            return $rootScope.promise(
                'POST',
                '/api/profile/upload-picture/' + $rootScope.user.id,
                {
                    data: e.target.result
                }
            );
        };
    }

    // Controller
    function Ctrl(ProfileService, $scope, $timeout) {
        console.log('Init Profile Controller');

        // Loader
        $scope.loaded = false;
        $timeout(function() {
            if (!$scope.loaded) {
                $scope.timeout = true;
            }
        }, 1000);

        // Custom file select
        $scope.getFile = new selectFile;
        $scope.getFile.targets('choose','selected');

        // Get profile
        ProfileService.getProfile()
            .then(function(response) {
                console.log(response);
                if (response.status === 200) {
                    $scope.user = response.data;
                    $scope.timeout = false;
                    $scope.loaded = true;
                }
            })
            .catch(function(err) {
                $scope.loaded = true;
                $scope.timeout = false;
                console.error(err.data);
            });

        // Upload picture
        $scope.uploadPicture = function() {
            var fileReader = new FileReader();
            fileReader.onloadend = function(e) {
                ProfileService.uploadPicture(e).then(function() {
                    $scope.user.img = e.target.result;
                    $scope.chosen = false;
                    $scope.$apply();
                });
            };
            fileReader.readAsDataURL(
                angular.element(document.querySelector('.upload'))[0].files[0]
            );
        };

        $scope.isChosen = function() {
            $scope.chosen = true;
            $scope.$apply();
        };
    }

    // Module
    angular
        .module('Profile', ['ngRoute'])
        .config(Config)
        .service('ProfileService', Service)
        .controller('Profile', Ctrl);
})();
