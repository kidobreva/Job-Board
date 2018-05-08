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
    function Service($http) {
        // Get companies
        this.getCompanies = function(scope) {
            $http
                .get('/companies')
                .then(function(companies) {
                    console.log(companies);
                    scope.loaded = true;
                    scope.timeout = false;
                    scope.companies = companies.data;
                })
                .catch(function(err) {
                    scope.loaded = true;
                    scope.timeout = false;
                    console.log(err);
                });
        };
    }

    // Controller
    function Ctrl($scope, $timeout, CompaniesService) {
        console.log('CompaniesCtrl');

        // Loader
        $scope.loaded = false;
        $timeout(function() {
            if (!$scope.loaded) {
                $scope.timeout = true;
            }
        }, 1000);

        $scope.getCompanies = CompaniesService.getCompanies.bind(null, $scope);
    }

    // Module
    angular
        .module('App.Companies', ['ngRoute'])
        .config(['$routeProvider', Config])
        .service('CompaniesService', Service)
        .controller('CompaniesCtrl', Ctrl);
})();
