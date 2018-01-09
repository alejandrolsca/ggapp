module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'productUpdateFac', '$location', 'i18nFilter', '$stateParams',
        function ($scope, productUpdateFac, $location, i18nFilter, $stateParams) {

            $scope.onSubmit = function () {

                productUpdateFac.update($scope.fmData).then(function (promise) {
                    if (promise.data.rowCount === 1) {
                        $location.path(`/product/${$scope.fmData.cl_id}`);
                    } else {
                        $scope.updateFail = true;
                    }
                });
            };

            $scope.pr_statusoptions = i18nFilter("product-update.fields.pr_statusoptions");

            $scope.$on('$viewContentLoaded', function () {
                // this code is executed after the view is loaded
                $scope.loading = true;
                productUpdateFac.data().then(function (promise) {
                    if (angular.isArray(promise.data) && promise.data.length === 1) {
                        const [data] = promise.data
                        $scope.fmData = data.pr_jsonb;
                        $scope.fmData.cl_id = data.cl_id
                        $scope.fmData.cl_corporatename = data.cl_corporatename
                        $scope.fmData.pr_id = $stateParams.pr_id
                        
                    }
                    $scope.loading = false;
                })
            });
        }];

})(angular);