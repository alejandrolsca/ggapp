module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'productStampsGeneralAddFac', '$location', 'i18nFilter', '$stateParams',
        function ($scope, productStampsGeneralAddFac, $location, i18nFilter, $stateParams) {
            $scope.fmData = {};
            $scope.fmData.pr_process = 'stamps';
            $scope.fmData.pr_type = 'general';
            $scope.fmData.cl_id = $stateParams.cl_id;

            $scope.onSubmit = function () {

                productStampsGeneralAddFac.add($scope.fmData).then(function (promise) {
                    if (promise.data.rowCount === 1) {
                        $location.path('/product/'+$stateParams.cl_id);
                    } else {
                        $scope.updateFail = true;
                    }
                });
            };

            $scope.pr_languageoptions = i18nFilter("productStampsGeneral-add.fields.pr_languageoptions");            
            $scope.pr_finalsizemeasureoptions = i18nFilter("productStampsGeneral-add.fields.pr_finalsizemeasureoptions");
            $scope.pr_stamptypeoptions = i18nFilter("productStampsGeneral-add.fields.pr_stamptypeoptions");
            $scope.pr_inkfrontoptions = i18nFilter("productStampsGeneral-add.fields.pr_inkfrontoptions");
            $scope.pr_statusoptions = i18nFilter("productStampsGeneral-add.fields.pr_statusoptions");
        
            // create front ink fields
            $scope.$watch('fmData.pr_inkfront', function (newValue, oldValue) {
                if ($scope.fmData.pr_inkfront != undefined) {
                    $scope.frontInks = new Array(newValue);
                    for (var i = 0; i < oldValue; i++) {
                        $scope.fmData['pr_inksfront'][i] = undefined;
                    }
                }
            });

            $scope.$on('$viewContentLoaded', function () {
                // this code is executed after the view is loaded
                
                productStampsGeneralAddFac.getClient().then(function (promise) {
                    $scope.loading = false;
                    if (angular.isObject(promise.data)) {
                        var client = promise.data[0].cl_jsonb;
                        var cl_type = client.cl_type
                        $scope.client = (cl_type === 'legal') ? client.cl_corporatename : client.cl_name + ' ' + client.cl_fatherslastname + ' ' + client.cl_motherslastname;                    }
                });

                productStampsGeneralAddFac.getInks().then(function (promise) {
                    if (angular.isArray(promise.data)) {
                        $scope.pr_inkoptions = [];
                        angular.forEach(promise.data, function (value, key) {
                            this.push({ "label": value.in_code, "value": value.in_id });
                        }, $scope.pr_inkoptions);
                    } else {
                        //$scope.updateFail = true;
                    }
                });

                productStampsGeneralAddFac.getMaterials().then(function (promise) {
                    if (angular.isArray(promise.data)) {
                        $scope.mt_idoptions = [];
                        angular.forEach(promise.data, function (value, key) {
                            this.push({ "label": value.mt_code, "value": value.mt_id, "width": value.mt_width, "height": value.mt_height, "measure": value.mt_measure });
                        }, $scope.mt_idoptions);
                    } else {
                        //$scope.updateFail = true;
                    }
                });

            });
        }];

})(angular);