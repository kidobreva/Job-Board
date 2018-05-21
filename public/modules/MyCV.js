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
    function Ctrl(MyCVService, $rootScope, $scope, $location) {
        console.log('Init MyCV Controller');

        // Check for current user
        $rootScope
            .getCurrentUser()
            .then(function(currentUser) {
                // Check for the user's role
                if (currentUser.role !== 'USER') {
                    $location.path('/home');
                }
                $scope.loaded = true;
            })
            // If there's no user
            .catch(function() {
                // Redirect to the login
                $location.path('/auth');
            });

        // Upload picture
        $scope.uploadCV = function() {
            var fileReader = new FileReader();
            fileReader.onloadend = function(e) {
                MyCVService.uploadCV(e.target.result).then(function(res) {
                    $scope.user.cv = res.data.cv;
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
