var AboutModule = angular.module('App.About', ['ngRoute']);

AboutModule.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        title: 'За нас'
    })
}]);

AboutModule.controller('AboutCtrl', [function() {
    console.log('AboutCtrl');
  }]);