module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'supplierAddFac', '$location', 'i18nFilter', '$interval',
        function ($scope, supplierAddFac, $location, i18nFilter, $interval) {
            $scope.fmData = {};

            $scope.onSubmit = function () {

                supplierAddFac.add($scope.fmData).then(function (promise) {
                    if (promise.data.rowCount === 1) {
                        $location.path('/supplier');
                    } else {
                        $scope.updateFail = true;
                    }
                });
            };

            $scope.su_statusoptions = i18nFilter("supplier.fields.su_statusoptions");
            $scope.su_typeoptions = i18nFilter("supplier.fields.su_typeoptions");

            $scope.$on('$viewContentLoaded', function () {
                // this code is executed after the view is loaded

                supplierAddFac.getCountries().then(function (promise) {
                    if (angular.isArray(promise.data)) {
                        $scope.su_countryoptions = promise.data;
                    } else {
                        //$scope.updateFail = true;
                    }
                });

            });
        }];

})(angular);