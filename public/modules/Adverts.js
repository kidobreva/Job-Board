(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/adverts', {
            templateUrl: 'views/adverts.html',
            controller: 'Adverts',
            title: 'Обяви',
            reloadOnSearch: false
        });
    }

    // Service
    function Service($rootScope) {
        this.doSearch = function(page, size, data) {
            if (data) {
                return $rootScope.promise.post('/api/adverts/search?page=1&size=5', data);
            } else {
                return $rootScope.promise.get('/api/adverts/' + page + '?size=' + (size || 5));
            }
        };
    }

    // Controller
    function Ctrl(AdvertsService, $scope, $timeout, $routeParams, $location) {
        console.log('Init Adverts Controller');

        // Cities
        $scope.cities = [
            'София',
            'Варна',
            'Пловдив',
            'Бургас',
            'Слънчев бряг',
            'Русе',
            'Стара Загора',
            'Велико Търново',
            'Плевен',
            'Шумен',
            'Друг'
        ];

        // Categories
        $scope.categories = [
            'ИТ - Разработка/поддръжка на софтуер хардуер',
            'Счетоводство, Одит',
            'Административни дейности',
            'Банково дело и Финанси',
            'Инженерни дейности',
            'Здравеопазване (Медицински работници)',
            'Архитектура, Строителство и Градоустройство',
            'Медии',
            'Друго'
        ];

        $scope.searchAdvert = function() {
            $scope.isSearch = true;
            getResultsPage(1);
        };

        function doSearch(num, size, isSearch, data) {
            AdvertsService.doSearch(num, size, isSearch, data)
                .then(function(result) {
                    $scope.adverts = result.data.adverts;
                    $scope.totalAdverts = result.data.size;
                    $scope.loaded = true;
                    $scope.timeout = false;
                    $scope.$apply();
                })
                .catch(function() {
                    $scope.adverts.length = 0;
                    $scope.loaded = true;
                    $scope.timeout = false;
                    $scope.$apply();
                });
        }

        function getResultsPage(pageNumber) {
            $location.search({
                page: pageNumber.toString(),
                size: $scope.advertsPerPage.toString()
            });
            $scope.loaded = false;
            if ($scope.isSearch) {
                doSearch(pageNumber, $scope.advertsPerPage, $scope.search);
            } else {
                doSearch(pageNumber, $scope.advertsPerPage);
            }
            // Loading wheel
            $timeout(function() {
                if (!$scope.loaded) {
                    $scope.timeout = true;
                }
            }, 1000);
        }

        // Initial values for pagination
        $scope.currentPage = $routeParams.page || 1;
        $scope.adverts = [];
        $scope.totalAdverts = 0;
        $scope.advertsPerPage = $routeParams.size || '5';
        $scope.pagination = {
            current: $scope.currentPage
        };
        getResultsPage($scope.currentPage);

        $scope.pageChanged = function(newPage) {
            getResultsPage(newPage);
        };
        $scope.beforeChangeSize = function() {
            $scope.pagination.current = 1;
        };
    }

    // Module
    angular
        .module('Adverts', ['ngRoute'])
        .config(Config)
        .service('AdvertsService', Service)
        .controller('Adverts', Ctrl);
})();
