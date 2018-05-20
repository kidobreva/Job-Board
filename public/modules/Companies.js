(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/companies', {
            templateUrl: 'views/companies.html',
            controller: 'Companies',
            title: 'Работодатели'
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

        CompaniesService.getCompanies()
            .then(function(response) {
                $scope.companies = response.data;
                $scope.loaded = true;
                $scope.timeout = false;
                $scope.$apply();
            })
            .catch(function() {
                $scope.loaded = true;
                $scope.timeout = false;
                $scope.$apply();
            });

        // Show loading wheel if needed after 1 second
        $timeout(function() {
            if (!$scope.loaded) {
                $scope.timeout = true;
            }
        }, 1000);
    }

    // Module
    angular
        .module('Companies', ['ngRoute'])
        .config(Config)
        .service('CompaniesService', Service)
        .controller('Companies', Ctrl);
})();
