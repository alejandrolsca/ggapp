module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'productLaserGeneralAddFac', '$location', 'i18nFilter', '$stateParams',
        function ($scope, productLaserGeneralAddFac, $location, i18nFilter, $stateParams) {
            $scope.fmData = {};
            $scope.fmData = { "pr_process": "laser", "pr_type": "general", "cl_id": "8", "pr_partno": "TEST", "pr_code": "TEST-1.3", "pr_language": "español", "pr_weight": "0.500", "pr_name": "Test product", "pr_description": "test product description", "pr_finalsizewidth": "10.00", "pr_finalsizeheight": "5.00", "pr_finalsizemeasure": "cm", "pr_inkfront": 2, "pr_inksfront": { "0": "3", "1": "2" }, "mt_id": "1", "pr_status": "A" };
            $scope.fmData.pr_process = 'laser';
            $scope.fmData.pr_type = 'general';
            $scope.fmData.cl_id = $stateParams.cl_id;

            $scope.onSubmit = function () {

                productLaserGeneralAddFac.add($scope.fmData).then(function (promise) {
                    if (promise.data.rowCount === 1) {
                        $location.path('/product/'+$stateParams.cl_id);
                    } else {
                        $scope.updateFail = true;
                    }
                });
            };
      
            $scope.pr_finalsizemeasureoptions = i18nFilter("productLaserGeneral-add.fields.pr_finalsizemeasureoptions");
            $scope.pr_surfaceoptions = i18nFilter("productLaserGeneral-add.fields.pr_surfaceoptions");
            $scope.pr_statusoptions = i18nFilter("productLaserGeneral-add.fields.pr_statusoptions");

             // create front ink fields
             $scope.$watch('fmData.pr_surface', function (newValue, oldValue) {
                if (newValue !== 'other') {
                    $scope.fmData.pr_othersurface = undefined;
                }
            });

            $scope.$on('$viewContentLoaded', function () {
                // this code is executed after the view is loaded
                
                productLaserGeneralAddFac.getClient().then(function (promise) {
                    $scope.loading = false;
                    if (angular.isObject(promise.data)) {
                        $scope.client = promise.data;
                    }
                });
            });
        }];

})(angular);