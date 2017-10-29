module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'materialAddFac', '$location', 'i18nFilter',
        function ($scope, materialAddFac, $location, i18nFilter) {
            $scope.fmData = {};

            $scope.onSubmit = function () {

                materialAddFac.add($scope.fmData).then(function (promise) {
                    if (promise.data.rowCount === 1) {
                        $location.path('/material');
                    } else {
                        $scope.updateFail = true;
                    }
                });
            };

            $scope.mt_statusoptions = i18nFilter("material.fields.mt_statusoptions");
            $scope.mt_typeoptions = i18nFilter("material.fields.mt_typeoptions");
            $scope.mt_measureoptions = i18nFilter("material.fields.mt_measureoptions");

            $scope.$on('$viewContentLoaded', function () {
                // this code is executed after the view is loaded

                materialAddFac.getSuppliers().then(function (promise) {
                    if (angular.isArray(promise.data)) {
                        $scope.su_idoptions = [];
                        angular.forEach(promise.data, function (value, key) {
                            this.push({ "label": value.su_corporatename || (value.su_name + ' ' + value.su_fatherslastname), "value": +value.su_id });
                        }, $scope.su_idoptions);
                    } else {
                        //$scope.updateFail = true;
                    }
                });

            });
        }];

})(angular);