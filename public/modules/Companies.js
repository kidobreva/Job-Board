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
    function Ctrl(CompaniesService, $scope, $timeout) {
        console.log('Init Companies Controller');

        // Loader
        $timeout(function() {
            if (!$scope.loaded) {
                $scope.timeout = true;
            }
        }, 1000);

        $scope.getCompanies = function() {
            CompaniesService.getCompanies()
                .then(function(companies) {
                    $scope.loaded = true;
                    $scope.timeout = false;
                    $scope.companies = companies.data;
                })
                .catch(function(err) {
                    $scope.loaded = true;
                    $scope.timeout = false;
                    console.log(err);
                });
        };

        $scope.getCompanies();
    }

    // Module
    angular
        .module('Companies', ['ngRoute'])
        .config(Config)
        .service('CompaniesService', Service)
        .controller('Companies', Ctrl);
})();
