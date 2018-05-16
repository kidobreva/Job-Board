(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/my-adverts/:id/candidates', {
            templateUrl: 'views/admin/users.html',
            controller: 'Candidates',
            title: 'Кандидати',
            resolve: {
                isCompany: function($rootScope, $location, $interval) {
                    var int = $interval(function() {
                        if ($rootScope.user || $rootScope.user === null) {
                            $interval.cancel(int);
                            if (!$rootScope.user || $rootScope.user.role !== 'COMPANY') {
                                $location.path('/home');
                                //$rootScope.$apply();
                            }
                        }
                    }, 100);
                }
            }
        });
    }

    // Service
    function Service($rootScope, $routeParams) {
        // Get users
        this.getUsers = function() {
            return $rootScope.promise.get('/api/advert/' + $routeParams.id + '/candidates');
        };
    }

    // Controller
    function Ctrl(CandidatesService, $rootScope, $scope, $location, $interval, $timeout) {
        console.log('Init Candidates Controller');

        // Get users
        function getUsers() {
            CandidatesService.getUsers()
                .then(function(response) {
                    console.log(response);
                    $scope.users = response.data;
                    $scope.loaded = true;
                    $scope.timeout = false;
                })
                .catch(function(response) {
                    $scope.loaded = true;
                    $scope.timeout = false;
                });
        }

        var int = $interval(function() {
            if ($rootScope.headerLoaded) {
                $interval.cancel(int);

                getUsers();

                // Show loading animation
                $timeout(function() {
                    if (!$scope.loaded) {
                        $scope.timeout = true;
                    }
                }, 1000);            
            }
        }, 100);
    }

    // Module
    angular
        .module('Candidates', ['ngRoute'])
        .config(Config)
        .service('CandidatesService', Service)
        .controller('Candidates', Ctrl);
})();
