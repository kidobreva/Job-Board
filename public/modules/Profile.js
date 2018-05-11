(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/profile', {
            templateUrl: 'views/profile.html',
            controller: 'ProfileCtrl',
            title: 'Профил'
        });
    }

    // Service
    function Service($rootScope, $http) {
        // Get profile
        this.getProfile = function() {
            return $rootScope.promise('GET', '/api/profile');
        };

        this.uploadPicture = function(scope) {
            var fileReader = new FileReader();
            fileReader.onloadend = function(e) {
                $http
                    .post('/api/profile/upload-picture/' + scope.user.id, {
                        data: e.target.result
                    })
                    .then(function() {
                        scope.user.img = e.target.result;
                    });
            };
            fileReader.readAsDataURL(
                angular.element(document.querySelector('.upload'))[0].files[0]
            );
        };
    }

    // Controller
    function Ctrl(ProfileService, $scope, $timeout) {
        console.log('ProfileCtrl');

        // Loader
        $scope.loaded = false;
        $timeout(function() {
            if (!$scope.loaded) {
                $scope.timeout = true;
            }
        }, 1000);

        ProfileService.getProfile()
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

        $scope.uploadPicture = ProfileService.uploadPicture.bind(null, $scope);
    }

    // Module
    angular
        .module('App.Profile', ['ngRoute'])
        .config(['$routeProvider', Config])
        .service('ProfileService', Service)
        .controller('ProfileCtrl', Ctrl);
})();
