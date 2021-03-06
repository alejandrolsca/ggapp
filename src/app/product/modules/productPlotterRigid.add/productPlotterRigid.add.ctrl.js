module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'productPlotterRigidAddFac', '$location', 'i18nFilter', '$stateParams',
        function ($scope, productPlotterRigidAddFac, $location, i18nFilter, $stateParams) {
            $scope.fmData = {
                "pr_process": "plotter",
                "pr_type": "rigid", 
                "pr_laminate": "no", 
                "pr_varnish": "no", 
                "pr_rivet": "no",
                "pr_doublesided": "no", 
                "pr_fold": "no", 
                "pr_drill": "no", 
                "pr_folio": "no", 
                "pr_status": "A"
            };
            $scope.fmData.cl_id = +$stateParams.cl_id;

            $scope.onSubmit = function () {

                productPlotterRigidAddFac.add($scope.fmData).then(function (promise) {
                    if (promise.data.rowCount === 1) {
                        $location.path('/product/'+$stateParams.cl_id);
                    } else {
                        $scope.updateFail = true;
                    }
                });
            };

            $scope.pr_languageoptions = i18nFilter("productPlotterRigid-add.fields.pr_languageoptions");            
            $scope.pr_finalsizemeasureoptions = i18nFilter("productPlotterRigid-add.fields.pr_finalsizemeasureoptions");
            $scope.pr_inkfrontoptions = i18nFilter("productPlotterRigid-add.fields.pr_inkfrontoptions");
            $scope.pr_inkbackoptions = i18nFilter("productPlotterRigid-add.fields.pr_inkbackoptions");
            $scope.pr_varnishoptions = i18nFilter("productPlotterRigid-add.fields.pr_varnishoptions");
            $scope.pr_varnisfinishedoptions = i18nFilter("productPlotterRigid-add.fields.pr_varnisfinishedoptions");
            $scope.pr_laminateoptions = i18nFilter("productPlotterRigid-add.fields.pr_laminateoptions");
            $scope.pr_laminatefinishedoptions = i18nFilter("productPlotterRigid-add.fields.pr_laminatefinishedoptions");
            $scope.pr_laminatecaliberoptions = i18nFilter("productPlotterRigid-add.fields.pr_laminatecaliberoptions");
            $scope.pr_foliooptions = i18nFilter("productPlotterRigid-add.fields.pr_foliooptions");
            $scope.pr_printedlabeledoptions = i18nFilter("productPlotterRigid-add.fields.pr_printedlabeledoptions");
            $scope.pr_rivetoptions = i18nFilter("productPlotterRigid-add.fields.pr_rivetoptions");
            $scope.pr_doublesidedoptions = i18nFilter("productPlotterRigid-add.fields.pr_doublesidedoptions");
            $scope.pr_foldoptions = i18nFilter("productPlotterRigid-add.fields.pr_foldoptions");
            $scope.pr_drilloptions = i18nFilter("productPlotterRigid-add.fields.pr_drilloptions");
            $scope.pr_blocksoptions = i18nFilter("productPlotterRigid-add.fields.pr_blocksoptions");
            $scope.pr_statusoptions = i18nFilter("productPlotterRigid-add.fields.pr_statusoptions");
        
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
                
                productPlotterRigidAddFac.getClient().then(function (promise) {
                    $scope.loading = false;
                    if (angular.isObject(promise.data)) {
                        var client = promise.data[0].cl_jsonb;
                        var cl_type = client.cl_type
                        $scope.client = (cl_type === 'legal') ? client.cl_corporatename : client.cl_name + ' ' + client.cl_firstsurname;                    }
                });

                productPlotterRigidAddFac.getInks($scope.fmData.pr_process).then(function (promise) {
                    if (angular.isArray(promise.data)) {
                        $scope.pr_inkoptions = [];
                        angular.forEach(promise.data, function (value, key) {
                            this.push({ "label": value.in_code, "value": value.in_id });
                        }, $scope.pr_inkoptions);
                    } else {
                        //$scope.updateFail = true;
                    }
                });

                productPlotterRigidAddFac.getMaterials($scope.fmData.pr_process).then(function (promise) {
                    if (angular.isArray(promise.data)) {
                        $scope.mt_idoptions = [];
                        angular.forEach(promise.data, function (value, key) {
                            this.push({ "label": `${value.mt_code} – ${value.mt_description}`, "value": value.mt_id, "width": value.mt_width, "height": value.mt_height, "measure": value.mt_measure });
                        }, $scope.mt_idoptions);
                    } else {
                        //$scope.updateFail = true;
                    }
                });

                productPlotterRigidAddFac.getTariffCodes().then(function (promise) {
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