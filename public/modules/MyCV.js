(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/myCV', {
            templateUrl: 'views/myCV.html',
            controller: 'MyCV',
            title: 'Моите CV-та'
        });
    }

    // Service
    function Service($rootScope) {
        // Upload picture
        this.uploadCV = function(file) {
            return $rootScope.promise.post('/api/profile/upload-cv/' + $rootScope.user.id, {
                data: file
            });
        };
    }

    // Controller
    function Ctrl(MyCVService, $rootScope, $scope, $window, $interval, $timeout) {
        console.log('Init MyCV Controller');

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

        // Upload picture
        $scope.uploadCV = function() {
            var fileReader = new FileReader();
            fileReader.onloadend = function(e) {
                MyCVService.uploadCV(e.target.result).then(function() {
                    $scope.user.cv = e.target.result;
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
        .module('MyCV', ['ngRoute'])
        .config(Config)
        .service('MyCVService', Service)
        .controller('MyCV', Ctrl);
})();
