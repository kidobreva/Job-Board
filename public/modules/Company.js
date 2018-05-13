(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/company/:id', {
            templateUrl: 'views/company.html',
            controller: 'Company',
            title: 'Информация за фирма'
        });
    }

    // Service
    function Service($rootScope, $routeParams) {
        // Get company
        this.getCompany = function() {
            return $rootScope.promise.get('/api/company/' + $routeParams.id);
        };

        // (Admin) Block company
        this.blockCompany = function() {
            return $rootScope.promise.patch('/api/company/block/' + $routeParams.id, {
                isBlocked: true
            });
        };
    }

    // Controller
    function Ctrl(CompanyService, $scope, $timeout) {
        console.log('Init Company Controller');

        // Loader
        $timeout(function() {
            if (!$scope.loaded) {
                $scope.timeout = true;
            }
        }, 1000);

        // Get company
        CompanyService.getCompany()
            .then(function(response) {
                console.log(response);
                $scope.loaded = true;
                $scope.timeout = false;
                $scope.company = response.data;
            })
            .catch(function(err) {
                $scope.loaded = true;
                $scope.timeout = false;
                console.error(err.data);
            });

        // (Admin) Block company
        $scope.blockCompany = function() {
            CompanyService.getCompany()
                .then(function(response) {
                    console.log(response);
                    $scope.loaded = true;
                    $scope.timeout = false;
                    $scope.company = response.data;
                })
                .catch(function(err) {
                    $scope.loaded = true;
                    $scope.timeout = false;
                    console.error(err.data);
                });
        };
    }

    // Module
    angular
        .module('Company', ['ngRoute'])
        .config(Config)
        .service('CompanyService', Service)
        .controller('Company', Ctrl);
})();
