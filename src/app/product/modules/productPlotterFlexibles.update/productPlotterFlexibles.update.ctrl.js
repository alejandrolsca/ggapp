module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'productPlotterFlexiblesUpdateFac', '$location', 'i18nFilter', '$stateParams',
        function ($scope, productPlotterFlexiblesUpdateFac, $location, i18nFilter, $stateParams) {
            $scope.fmData = {
                "pr_process": "plotter",
                "pr_type": "flexibles", 
                "pr_laminate": "no", 
                "pr_varnish": "no", 
                "pr_precut": "no",
                "pr_transfer": "no", 
                "pr_drill": "no", 
                "pr_folio": "no", 
                "pr_status": "A"
            };
            $scope.fmData.cl_id = +$stateParams.cl_id;

            $scope.onSubmit = function () {

                productPlotterFlexiblesUpdateFac.update($scope.fmData).then(function (promise) {
                    if (promise.data.rowCount === 1) {
                        $location.path('/product/'+$stateParams.cl_id);
                    } else {
                        $scope.updateFail = true;
                    }
                });
            };

            $scope.pr_languageoptions = i18nFilter("productPlotterFlexibles-update.fields.pr_languageoptions");            
            $scope.pr_finalsizemeasureoptions = i18nFilter("productPlotterFlexibles-update.fields.pr_finalsizemeasureoptions");
            $scope.pr_inkfrontoptions = i18nFilter("productPlotterFlexibles-update.fields.pr_inkfrontoptions");
            $scope.pr_inkbackoptions = i18nFilter("productPlotterFlexibles-update.fields.pr_inkbackoptions");
            $scope.pr_varnishoptions = i18nFilter("productPlotterFlexibles-update.fields.pr_varnishoptions");
            $scope.pr_varnisfinishedoptions = i18nFilter("productPlotterFlexibles-update.fields.pr_varnisfinishedoptions");
            $scope.pr_laminateoptions = i18nFilter("productPlotterFlexibles-update.fields.pr_laminateoptions");
            $scope.pr_laminatefinishedoptions = i18nFilter("productPlotterFlexibles-update.fields.pr_laminatefinishedoptions");
            $scope.pr_laminatecaliberoptions = i18nFilter("productPlotterFlexibles-update.fields.pr_laminatecaliberoptions");
            $scope.pr_foliooptions = i18nFilter("productPlotterFlexibles-update.fields.pr_foliooptions");
            $scope.pr_precutoptions = i18nFilter("productPlotterFlexibles-update.fields.pr_precutoptions");
            $scope.pr_transferoptions = i18nFilter("productPlotterFlexibles-update.fields.pr_transferoptions");
            $scope.pr_drilloptions = i18nFilter("productPlotterFlexibles-update.fields.pr_drilloptions");            
            $scope.pr_blocksoptions = i18nFilter("productPlotterFlexibles-update.fields.pr_blocksoptions");
            $scope.pr_statusoptions = i18nFilter("productPlotterFlexibles-update.fields.pr_statusoptions");
        
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
                productPlotterFlexiblesUpdateFac.data().then(function (promise) {
                    if (angular.isArray(promise.data) && promise.data.length === 1) {
                        const [data] = promise.data
                        $scope.fmData = data.pr_jsonb;
                        $scope.fmData.cl_id = data.cl_id
                        $scope.fmData.cl_corporatename = data.cl_corporatename
                        $scope.fmData.pr_id = $stateParams.pr_id
                        
                    }
                    $scope.loading = false;
                })
                
                productPlotterFlexiblesUpdateFac.getClient().then(function (promise) {
                    if (angular.isObject(promise.data)) {
                        var client = promise.data[0].cl_jsonb;
                        var cl_type = client.cl_type
                        $scope.client = (cl_type === 'legal') ? client.cl_corporatename : client.cl_name + ' ' + client.cl_firstsurname;                    }
                });

                productPlotterFlexiblesUpdateFac.getInks($scope.fmData.pr_process).then(function (promise) {
                    if (angular.isArray(promise.data)) {
                        $scope.pr_inkoptions = [];
                        angular.forEach(promise.data, function (value, key) {
                            this.push({ "label": value.in_code, "value": value.in_id });
                        }, $scope.pr_inkoptions);
                    } else {
                        //$scope.updateFail = true;
                    }
                });

                productPlotterFlexiblesUpdateFac.getMaterials($scope.fmData.pr_process).then(function (promise) {
                    if (angular.isArray(promise.data)) {
                        $scope.mt_idoptions = [];
                        angular.forEach(promise.data, function (value, key) {
                            this.push({ "label": `${value.mt_code} – ${value.mt_description}`, "value": value.mt_id, "width": value.mt_width, "height": value.mt_height, "measure": value.mt_measure });
                        }, $scope.mt_idoptions);
                    } else {
                        //$scope.updateFail = true;
                    }
                });

                productPlotterFlexiblesUpdateFac.getTariffCodes().then(function (promise) {
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