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
        // Get profile
        this.getProfile = function() {
            return $rootScope.promise('GET', '/api/profile');
        };

        // Upload picture
        this.uploadCV = function(file) {
            return $rootScope.promise(
                'POST',
                '/api/profile/upload-cv/' + $rootScope.user.id,
                {
                    data: file
                }
            );
        };
    }

    // Controller
    function Ctrl(MyCVService, $scope, $timeout) {
        console.log('Init MyCV Controller');

        // Loader
        $scope.loaded = false;
        $timeout(function() {
            if (!$scope.loaded) {
                $scope.timeout = true;
            }
        }, 1000);

        // Get profile
        MyCVService.getProfile()
            .then(function(response) {
                console.log(response);
                if (response.status === 200) {
                    $scope.loaded = true;
                    $scope.timeout = false;
                    $scope.user = response.data;
                }
            })
            .catch(function(err) {
                $scope.loaded = true;
                $scope.timeout = false;
                console.error(err.data);
            });

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
