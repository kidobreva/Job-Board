var AboutModule = angular.module('App.About', ['ngRoute']);

// Route
AboutModule.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        title: 'За нас'
    })
}]);

// Controller
AboutModule.controller('AboutCtrl', [function() {
    console.log('AboutCtrl');
}]);
