var ContactsModule = angular.module('App.Contacts', ['ngRoute']);

// Route
ContactsModule.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/contacts', {
        templateUrl: 'views/contacts.html',
        controller: 'ContactsCtrl',
        title: 'Контакти'
    })
}]);

// Controller
ContactsModule.controller('ContactsCtrl', [function() {
    console.log('ContactsCtrl');
  }]);