(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/company/:id', {
            templateUrl: 'views/company.html',
            controller: 'CompanyCtrl',
            title: 'Информация за фирма'
        });
    }

    // Service
    function Service($http, $routeParams) {
        // Get company
        this.getCompany = function(scope) {
            $http
                .get('/company/' + $routeParams.id)
                .then(function(response) {
                    console.log(response);
                    if (response.status === 200) {
                        scope.loaded = true;
                        scope.timeout = false;
                        scope.company = response.data;
                    }
                })
                .catch(function(err) {
                    scope.loaded = true;
                    scope.timeout = false;
                    console.error(err.data);
                });
        };

        // (Admin) Block company
        this.blockCompany = function(scope) {
            $http
                .patch('/company/block/' + $routeParams.id, { isBlocked: true })
                .then(function(response) {
                    console.log(response);
                    if (response.status === 200) {
                        scope.loaded = true;
                        scope.timeout = false;
                        scope.company = response.data;
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
    function Ctrl(CompanyService, $scope, $timeout) {
        console.log('CompanyCtrl');

        // Loader
        $scope.loaded = false;
        $timeout(function() {
            if (!$scope.loaded) {
                $scope.timeout = true;
            }
        }, 1000);

        CompanyService.getCompany($scope);
        $scope.blockCompany = CompanyService.getCompany.bind(null, $scope);
    }

    // Module
    angular
        .module('App.Company', ['ngRoute'])
        .config(['$routeProvider', Config])
        .service('CompanyService', Service)
        .controller('CompanyCtrl', Ctrl);
})();
