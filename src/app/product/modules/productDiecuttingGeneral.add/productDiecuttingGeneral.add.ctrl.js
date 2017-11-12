module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'productDiecuttingGeneralAddFac', '$location', 'i18nFilter', '$stateParams',
        function ($scope, productDiecuttingGeneralAddFac, $location, i18nFilter, $stateParams) {
            $scope.fmData = {};
            $scope.fmData.pr_process = 'diecutting';
            $scope.fmData.pr_type = 'general';
            $scope.fmData.cl_id = +$stateParams.cl_id;

            $scope.onSubmit = function () {

                productDiecuttingGeneralAddFac.add($scope.fmData).then(function (promise) {
                    if (promise.data.rowCount === 1) {
                        $location.path('/product/'+$stateParams.cl_id);
                    } else {
                        $scope.updateFail = true;
                    }
                });
            };
      
            $scope.pr_finalsizemeasureoptions = i18nFilter("productDiecuttingGeneral-add.fields.pr_finalsizemeasureoptions");
            $scope.pr_statusoptions = i18nFilter("productDiecuttingGeneral-add.fields.pr_statusoptions");

             // create front ink fields
             $scope.$watch('fmData.pr_surface', function (newValue, oldValue) {
                if (newValue !== 'other') {
                    $scope.fmData.pr_othersurface = undefined;
                }
            });

            $scope.$on('$viewContentLoaded', function () {
                // this code is executed after the view is loaded
                
                productDiecuttingGeneralAddFac.getClient().then(function (promise) {
                    $scope.loading = false;
                    if (angular.isObject(promise.data)) {
                        var client = promise.data[0].cl_jsonb;
                        var cl_type = client.cl_type
                        $scope.client = (cl_type === 'legal') ? client.cl_corporatename : client.cl_name + ' ' + client.cl_firstsurname;
                    }
                });

                productDiecuttingGeneralAddFac.getMaterials($scope.fmData.pr_process).then(function (promise) {
                    if (angular.isArray(promise.data)) {
                        $scope.mt_idoptions = [];
                        angular.forEach(promise.data, function (value, key) {
                            this.push({ "label": `${value.mt_code} – ${value.mt_description}`, "value": value.mt_id, "width": value.mt_width, "height": value.mt_height, "measure": value.mt_measure });
                        }, $scope.mt_idoptions);
                    } else {
                        //$scope.updateFail = true;
                    }
                });

            });
        }];

})(angular);