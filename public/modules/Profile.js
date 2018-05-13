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
            return $rootScope.promise.post(
                '/api/profile/upload-picture/' + $rootScope.user.id,
                {
                    data: e.target.result
                }
            );
        };
    }

    // Controller
    function Ctrl(
        ProfileService,
        $rootScope,
        $scope,
        $window,
        $interval,
        $timeout
    ) {
        console.log('Init Profile Controller');

        var int = $interval(function() {
            if ($rootScope.headerLoaded) {
                $interval.cancel(int);

                // Check if the there is user
                if (!$rootScope.user) {
                    $window.location.href = '/home';
                } else {
                    $scope.loaded = true;
                    $scope.timeout = false;
                }
            }
        }, 100);

        // Show loading animation
        $timeout(function() {
            if (!$scope.loaded) {
                $scope.timeout = true;
            }
        }, 1000);

        // Custom file select
        $scope.getFile = new selectFile();
        $scope.getFile.targets('choose', 'selected');

        // Upload picture
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
