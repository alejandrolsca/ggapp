module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'productStampsInkUpdateFac', '$location', 'i18nFilter', '$stateParams',
        function ($scope, productStampsInkUpdateFac, $location, i18nFilter, $stateParams) {
            $scope.fmData = {};
            $scope.fmData.pr_process = 'stamps';
            $scope.fmData.pr_type = 'ink';
            $scope.fmData.cl_id = +$stateParams.cl_id;

            $scope.onSubmit = function () {

                productStampsInkUpdateFac.update($scope.fmData).then(function (promise) {
                    if (promise.data.rowCount === 1) {
                        $location.path('/product/'+$stateParams.cl_id);
                    } else {
                        $scope.updateFail = true;
                    }
                });
            };

            $scope.pr_statusoptions = i18nFilter("productStampsInk-update.fields.pr_statusoptions");
        
            // create front ink fields
            $scope.$watch('fmData.pr_inkfront', function (newValue, oldValue) {
                if ($scope.fmData.pr_inkfront != undefined) {
                    $scope.frontInks = new Array(newValue);
                    for (var i = 0; i < oldValue; i++) {
                        $scope.fmData['pr_inksfront'][i] = undefined;
                    }
                }
            });
        
            // create back ink fields
            $scope.$watch('fmData.pr_inkback', function (newValue, oldValue) {
                if ($scope.fmData.pr_inkback != undefined) {
                    $scope.backInks = new Array(newValue);
                    for (var i = 0; i < oldValue; i++) {
                        $scope.fmData['pr_inksback'][i] = undefined;
                    }
                }
            });

            $scope.$on('$viewContentLoaded', function () {
                // this code is executed after the view is loaded

                $scope.loading = true;
                productStampsInkUpdateFac.data().then(function (promise) {
                    if (angular.isArray(promise.data) && promise.data.length === 1) {
                        const [data] = promise.data
                        $scope.fmData = data.pr_jsonb;
                        $scope.fmData.cl_id = data.cl_id
                        $scope.fmData.cl_corporatename = data.cl_corporatename
                        $scope.fmData.pr_id = $stateParams.pr_id
                        
                    }
                    $scope.loading = false;
                })
                
                productStampsInkUpdateFac.getClient().then(function (promise) {
                    if (angular.isObject(promise.data)) {
                        var client = promise.data[0].cl_jsonb;
                        var cl_type = client.cl_type
                        $scope.client = (cl_type === 'legal') ? client.cl_corporatename : client.cl_name + ' ' + client.cl_firstsurname;                    }
                });

                productStampsInkUpdateFac.getMaterials($scope.fmData.pr_process).then(function (promise) {
                    if (angular.isArray(promise.data)) {
                        $scope.mt_idoptions = [];
                        angular.forEach(promise.data, function (value, key) {
                            this.push({ "label": `${value.mt_code} – ${value.mt_description}`, "value": value.mt_id, "width": value.mt_width, "height": value.mt_height, "measure": value.mt_measure });
                        }, $scope.mt_idoptions);
                    } else {
                        //$scope.updateFail = true;
                    }
                });

                productStampsInkUpdateFac.getTariffCodes().then(function (promise) {
                    $scope.tc_idoptions = [];
                    const { data } = promise
                    if (angular.isArray(data)) {
                        angular.forEach(data, function (value, key) {
                            this.push({ "label": `${value.tc_jsonb.tc_code} - ${value.tc_jsonb.tc_description}`, "value": value.tc_id });
                        }, $scope.tc_idoptions);
                    }
                });

            });
        }];

})(angular);