(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/companies', {
            templateUrl: 'views/companies.html',
            controller: 'Companies',
            title: 'Фирми'
        });
    }

    // Service
    function Service($rootScope) {
        // Get companies
        this.getCompanies = function() {
            return $rootScope.promise.get('/api/companies');
        };
    }

    // Controller
    function Ctrl(CompaniesService, $scope, $timeout, $rootScope, $location) {
        console.log('Init Companies Controller');

        // Check for current user
        $rootScope
            .getCurrentUser()
            .then(function() {
                // Get companies
                CompaniesService.getCompanies()
                    .then(function(response) {
                        $scope.companies = response.data;
                        $scope.loaded = true;
                        $scope.$apply();
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
            })
            // If there's no user
            .catch(function() {
                // Redirect to the login
                $location.path('/login');
            });
    }

    // Module
    angular
        .module('Companies', ['ngRoute'])
        .config(Config)
        .service('CompaniesService', Service)
        .controller('Companies', Ctrl);
})();
