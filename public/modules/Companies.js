(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/companies', {
            templateUrl: 'views/companies.html',
            controller: 'CompaniesCtrl',
            title: 'Фирми'
        });
    }

    // Service
    function Service($rootScope) {
        // Get companies
        this.getCompanies = function() {
            return $rootScope.promise('GET', '/api/companies');
        };
    }

    // Controller
    function Ctrl(CompaniesService, $scope, $timeout) {
        console.log('CompaniesCtrl');

        // Loader
        $scope.loaded = false;
        $timeout(function() {
            if (!$scope.loaded) {
                $scope.timeout = true;
            }
        }, 1000);

        $scope.getCompanies = function() {
            CompaniesService.getCompanies()
                .then(function(companies) {
                    console.log(companies);
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
        .module('App.Companies', ['ngRoute'])
        .config(['$routeProvider', Config])
        .service('CompaniesService', Service)
        .controller('CompaniesCtrl', Ctrl);
})();
