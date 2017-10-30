module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'productLaserGeneralAddFac', '$location', 'i18nFilter', '$stateParams',
        function ($scope, productLaserGeneralAddFac, $location, i18nFilter, $stateParams) {
            $scope.fmData = {};
            $scope.fmData.pr_process = 'laser';
            $scope.fmData.pr_type = 'general';
            $scope.fmData.cl_id = +$stateParams.cl_id;

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
                        var client = promise.data[0].cl_jsonb;
                        var cl_type = client.cl_type
                        $scope.client = (cl_type === 'legal') ? client.cl_corporatename : client.cl_name + ' ' + client.cl_fatherslastname;
                    }
                });
            });
        }];

})(angular);