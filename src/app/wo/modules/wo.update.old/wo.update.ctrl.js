module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'woUpdateFactory',
        function ($scope, woUpdateFactory) {

            $scope.$on('$viewContentLoaded', function () {
                // this code is executed after the view is loaded
                $scope.loading = true;
                woUpdateFactory.updateData().then(function (promise) {
                    $scope.loading = false;
                    if (angular.isArray(promise.data)) {

                    }
                });
            });
        }];

})(angular);