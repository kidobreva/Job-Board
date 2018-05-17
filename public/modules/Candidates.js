(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/my-adverts/:id/candidates', {
            templateUrl: 'views/admin/users.html',
            controller: 'Candidates',
            title: 'Кандидати'
        });
    }

    // Service
    function Service($rootScope, $routeParams) {
        // Get users
        this.getCandidates = function() {
            return $rootScope.promise.get('/api/advert/' + $routeParams.id + '/candidates');
        };
    }

    // Controller
    function Ctrl(CandidatesService, $rootScope, $scope, $location, $interval, $timeout) {
        console.log('Init Candidates Controller');

        // Check for current user
        $rootScope
            .getCurrentUser()
            .then(function(currentUser) {
                // Check for the user's role
                if (currentUser.role !== 'COMPANY') {
                    $location.path('/home');
                } else {
                    // Get users
                    CandidatesService.getCandidates()
                        .then(function(response) {
                            $scope.users = response.data;
                            $scope.$apply();
                            $scope.loaded = true;
                            $scope.timeout = false;
                        })
                        .catch(function() {
                            $scope.loaded = true;
                            $scope.timeout = false;
                        });

                    // Show loading wheel if needed after 1 second
                    $timeout(function() {
                        if (!$scope.loaded) {
                            $scope.timeout = true;
                        }
                    }, 1000);
                }
            })
            // If there's no user
            .catch(function() {
                // Redirect to the login
                $location.path('/login');
            });
    }

    // Module
    angular
        .module('Candidates', ['ngRoute'])
        .config(Config)
        .service('CandidatesService', Service)
        .controller('Candidates', Ctrl);
})();
