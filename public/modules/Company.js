(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/company/:id/page/:page', {
            templateUrl: 'views/company.html',
            controller: 'Company',
            title: 'Информация за фирма',
            reloadOnSearch: false
        });
        $routeProvider.when('/company/:id', {
            templateUrl: 'views/company.html',
            controller: 'Company',
            title: 'Информация за фирма',
            reloadOnSearch: false
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
    function Ctrl(CompanyService, AdvertsService, $routeParams, $scope, $timeout, $rootScope, $location) {
        console.log('Init Company Controller');

        AdvertsService.getSearchData().then(function(res) {
            $scope.categories = res.data.categories;
            $scope.cities = res.data.cities;

            CompanyService.getCompany()
                .then(function(response) {
                    console.log('Company', response);
                    // response.data.description = $sce.trustAsHtml(response.data.description);
                    delete response.data.adverts;
                    $scope.company = response.data;
                    $scope.loaded = true;
                    $scope.timeout = false;
                    $scope.$apply();
                })
                .catch(function(err) {
                    $scope.loaded = true;
                    $scope.timeout = false;
                    console.error(err.data);
                    $scope.$apply();
                });
        });

        // Show loading wheel if needed after 1 second
        $timeout(function() {
            if (!$scope.loaded) {
                $scope.timeout = true;
            }
        }, 1000);

        // (Admin) Block company
        $scope.blockCompany = CompanyService.getCompany.bind(null);
    }

    // Module
    angular
        .module('Company', ['ngRoute'])
        .config(Config)
        .service('CompanyService', Service)
        .controller('Company', Ctrl);
})();
