(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/contacts', {
            templateUrl: 'views/contacts.html',
            controller: 'ContactsCtrl',
            title: 'Контакти'
        });
    }

    // Controller
    function Ctrl() {
        console.log('ContactsCtrl');
    }

    // Module
    angular
        .module('App.Contacts', ['ngRoute'])
        .config(['$routeProvider', Config])
        .controller('ContactsCtrl', Ctrl);
})();
