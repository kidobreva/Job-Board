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
            return $rootScope.promise.patch('/api/admin/block/' + $routeParams.id);
        };
    }

    // Controller
    function Ctrl(
        CompanyService,
        SendMessageService,
        $uibModal,
        $rootScope,
        AdvertsService,
        $routeParams,
        $scope,
        $timeout
    ) {
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

        //Alert modal
        function alertModal() {
            $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'alertModal.html',
                controller: function($uibModalInstance, $scope) {
                    $scope.cancel = function() {
                        $uibModalInstance.dismiss();
                    };
                }
            });
        }

        //Send report message
        $scope.reportCompany = function() {
            $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'reportCompany.html',
                controller: function($uibModalInstance, $scope) {
                    $scope.ok = function() {
                        $rootScope.getCurrentUser().then(function(user) {
                            console.log('User', user);
                            SendMessageService.sendMessage({
                                text: $scope.reportMsg,
                                phone: undefined,
                                name: user.firstName + ' ' + user.lastName,
                                email: $scope.reportEmail
                            });
                            $uibModalInstance.close();
                            alertModal();
                        });
                    };

                    $scope.cancel = function() {
                        $uibModalInstance.dismiss();
                    };
                }
            });
        };

        // Show loading wheel if needed after 1 second
        $timeout(function() {
            if (!$scope.loaded) {
                $scope.timeout = true;
            }
        }, 1000);

        // Alerts
        $scope.alerts = [];
        $scope.addAlert = function() {
            $scope.alerts.length = 0;
            $scope.alerts.push({ type: 'primary', msg: 'Компанията е блокирана успешно!' });
            $scope.$apply();
        };
        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };

        // (Admin) Block company
        $scope.blockCompany = function() {
            CompanyService.blockCompany().then(function(res) {
                console.log(res);
                $scope.addAlert();
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
