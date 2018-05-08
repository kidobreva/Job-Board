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
    function Service($http, $window, $routeParams) {
        // Get profile
        this.getProfile = function(scope) {
            $http
                .get('/profile')
                .then(function(response) {
                    console.log(response);
                    if (response.status === 200) {
                        scope.loaded = true;
                        scope.timeout = false;

                        response.data.registeredDate = new Date(
                            response.data.registeredDate
                        ).toDateString();
                        scope.user = response.data;
                    }
                })
                .catch(function(err) {
                    scope.loaded = true;
                    scope.timeout = false;
                    console.error(err.data);
                });
        };
    }

    // Controller
    function Ctrl($scope, $timeout) {
        console.log('ProfileCtrl');

        // Loader
        $scope.loaded = false;
        $timeout(function() {
            if (!$scope.loaded) {
                $scope.timeout = true;
            }
        }, 1000);

        ProfileService.getProfile($scope);
    }

    // Module
    angular
        .module('App.Profile', ['ngRoute'])
        .config(['$routeProvider', Config])
        .service('ProfileService', Service)
        .controller('ProfileCtrl', Ctrl);
})();
