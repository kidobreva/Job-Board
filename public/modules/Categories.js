(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/admin/categories', {
            templateUrl: 'views/categories.html',
            controller: 'Categories',
            title: 'Категории'
        });
    }

    // Service
    function Service($rootScope) {
        // Get categories
        this.getCategories = function() {
            return $rootScope.promise.get('/api/admin/categories');
        };

        // Add category
        this.addCategory = function(name) {
            return $rootScope.promise.post('/api/admin/category', { name: name });
        };

        // Remove category
        this.removeCategory = function(id) {
            return $rootScope.promise.delete('/api/admin/category/' + id);
        };

        // Edit category
        this.editCategory = function(id, name) {
            return $rootScope.promise.patch('/api/admin/category/' + id, { name: name });
        };
    }

    // Controller
    function Ctrl(CategoriesService, $rootScope, $scope, $location, $timeout, $uibModal) {
        console.log('Init Categories Controller');

        // Check for current user
        $rootScope
            .getCurrentUser()
            .then(function(currentUser) {
                // Check for the user's role
                if (currentUser.role !== 'ADMIN') {
                    $location.path('/home');
                } else {
                    // Get users
                    CategoriesService.getCategories()
                        .then(function(response) {
                            $scope.categories = response.data;
                            $scope.loaded = true;
                            $scope.timeout = false;
                            $scope.$apply();
                        })
                        .catch(function() {
                            $scope.loaded = true;
                            $scope.timeout = false;
                        });

                    // Show loading wheel if needed after 1 second
                    $timeout(function() {
                        if (!$scope.loaded) {
                            $scope.timeout = true;
                        }
                    }, 1000);
                }
            })
            // If there's no user
            .catch(function() {
                // Redirect to the login
                $location.url('/auth?redirect=' + $location.path());
            });

        function updateView(type, category, index) {
            console.log(category);
            switch (type) {
                case 'add':
                    $scope.categories.push(category);
                    break;
                case 'rename':
                    $scope.categories[index] = category;
                    break;
                case 'delete':
                    $scope.categories.splice(index, 1);
            }
            $scope.$apply();
        }

        // Add category modal
        $scope.openAddCategory = function() {
            $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'add-category.html',
                controller: function($uibModalInstance, $scope) {
                    $scope.ok = function() {
                        CategoriesService.addCategory($scope.categoryName).then(function(response) {
                            updateView('add', response.data);
                        });
                        $uibModalInstance.close();
                    };

                    $scope.cancel = function() {
                        $uibModalInstance.dismiss();
                    };
                }
            });
        };

        // Edit category modal
        $scope.openEditCategory = function(id, index) {
            $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'edit-category.html',
                controller: function($uibModalInstance, $scope) {
                    $scope.ok = function() {
                        CategoriesService.editCategory(id, $scope.categoryName).then(function(response) {
                            updateView('rename', response.data, index);
                        });
                        $uibModalInstance.close();
                    };

                    $scope.cancel = function() {
                        $uibModalInstance.dismiss();
                    };
                }
            });
        };

        $scope.removeCategory = function(id, index) {
            CategoriesService.removeCategory(id).then(function(response) {
                updateView('delete', response.data, index);
            });
        };
    }

    // Module
    angular
        .module('Categories', ['ngRoute'])
        .config(Config)
        .service('CategoriesService', Service)
        .controller('Categories', Ctrl);
})();
