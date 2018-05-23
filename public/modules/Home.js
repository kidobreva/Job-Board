(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'views/home.html',
            controller: 'Home',
            title: 'Job Board - Начало'
        });
    }

    // Controller
    function Ctrl(AdvertsService, $scope, $location) {
        console.log('Init Home Controller');
        $scope.search = {
            keywords: ''
        };

        $scope.status = {
            isopen: false
        };

        $scope.toggled = function(open) {
            console.log('Dropdown is now: ', open);
        };

        $scope.slider = {
            minValue: 200,
            maxValue: 3000,
            options: {
                // selectionBarGradient: {
                //     from: 'white',
                //     to: '#FC0'
                // },
                floor: 200,
                ceil: 3000,
                translate: function(value, sliderId, label) {
                    switch (label) {
                        case 'model':
                            return 'от <b>' + value + '</b> лв.';
                        case 'high':
                            return 'до <b>' + value + '</b> лв.';
                        default:
                            return value;
                    }
                }
            }
        };

        $scope.labels = {
            itemsSelected: 'избрани',
            selectAll: 'избери всички',
            unselectAll: 'премахни всички',
            search: 'търси...',
            select: 'избери'
        };

        // Get search data
        AdvertsService.getSearchData().then(function(response) {
            $scope.categories = response.data.categories;
            $scope.cities = response.data.cities;
            $scope.levels = response.data.levels;
            $scope.types = response.data.types;
            $scope.loaded = true;
            $scope.$apply();
        });

        $scope.doSearch = function() {
            var url = '/adverts/1?search=true';
            Object.keys($scope.search).forEach(function(prop) {
                if (typeof $scope.search[prop] !== 'object') {
                    url += '&' + prop + '=' + $scope.search[prop];
                } else {
                    url += '&' + prop + '=';
                    var arr = [];
                    Object.keys($scope.search[prop]).forEach(function(obj, i) {
                        arr[i] = $scope.search[prop][obj].id;
                    });
                    url += arr;
                }
            });
            url += '&' + 'salary=' + $scope.slider.minValue + ',' + $scope.slider.maxValue;
            $location.url(url);
        };
    }

    // Module
    angular
        .module('Home', ['ngRoute'])
        .config(Config)
        .controller('Home', Ctrl);
})();
