module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'productDigitalCounterfoilUpdateFac', '$location', 'i18nFilter', '$stateParams',
        function ($scope, productDigitalCounterfoilUpdateFac, $location, i18nFilter, $stateParams) {
            $scope.fmData = {
                "pr_process": "digital",
                "pr_type": "counterfoil", 
                "pr_precut": "no",
                "pr_reinforcement": "no", 
                "pr_cord": "no", 
                "pr_wire": "no", 
                "pr_drill": 0, 
                "pr_folio": "no", 
                "pr_blocks": "no", 
                "pr_status": "A"
            };
            $scope.fmData.cl_id = +$stateParams.cl_id;
            $scope.fmData.pr_components = 1;

            $scope.onSubmit = function () {

                productDigitalCounterfoilUpdateFac.update($scope.fmData).then(function (promise) {
                    if (promise.data.rowCount === 1) {
                        $location.path('/product/' + $stateParams.cl_id);
                    } else {
                        $scope.updateFail = true;
                    }
                });
            };

            $scope.pr_languageoptions = i18nFilter("productDigitalCounterfoil-update.fields.pr_languageoptions");
            $scope.pr_finalsizemeasureoptions = i18nFilter("productDigitalCounterfoil-update.fields.pr_finalsizemeasureoptions");
            $scope.pr_componentsoptions = i18nFilter("productDigitalCounterfoil-update.fields.pr_componentsoptions");
            $scope.pr_sheetspersetoptions = i18nFilter("productDigitalCounterfoil-update.fields.pr_sheetspersetoptions");
            $scope.pr_inkfrontoptions = i18nFilter("productDigitalCounterfoil-update.fields.pr_inkfrontoptions");
            $scope.pr_inkbackoptions = i18nFilter("productDigitalCounterfoil-update.fields.pr_inkbackoptions");
            $scope.pr_materialsizemeasureoptions = i18nFilter("productDigitalCounterfoil-update.fields.pr_materialsizemeasureoptions");
            $scope.pr_varnishoptions = i18nFilter("productDigitalCounterfoil-update.fields.pr_varnishoptions");
            $scope.pr_varnisfinishedoptions = i18nFilter("productDigitalCounterfoil-update.fields.pr_varnisfinishedoptions");
            $scope.pr_laminateoptions = i18nFilter("productDigitalCounterfoil-update.fields.pr_laminateoptions");
            $scope.pr_laminatefinishedoptions = i18nFilter("productDigitalCounterfoil-update.fields.pr_laminatefinishedoptions");
            $scope.pr_laminatecaliberoptions = i18nFilter("productDigitalCounterfoil-update.fields.pr_laminatecaliberoptions");
            $scope.pr_foliooptions = i18nFilter("productDigitalCounterfoil-update.fields.pr_foliooptions");
            $scope.pr_foldunitoptions = i18nFilter("productDigitalCounterfoil-update.fields.pr_foldunitoptions");
            $scope.pr_precutoptions = i18nFilter("productDigitalCounterfoil-update.fields.pr_precutoptions");
            $scope.pr_reinforcementoptions = i18nFilter("productDigitalCounterfoil-update.fields.pr_reinforcementoptions");
            $scope.pr_cordoptions = i18nFilter("productDigitalCounterfoil-update.fields.pr_cordoptions");
            $scope.pr_wireoptions = i18nFilter("productDigitalCounterfoil-update.fields.pr_wireoptions");
            $scope.pr_drilloptions = i18nFilter("productDigitalCounterfoil-update.fields.pr_drilloptions");
            $scope.pr_blocksoptions = i18nFilter("productDigitalCounterfoil-update.fields.pr_blocksoptions");
            $scope.pr_statusoptions = i18nFilter("productDigitalCounterfoil-update.fields.pr_statusoptions");

            // create components
            $scope.$watch('fmData.pr_components', function (newValue, oldValue) {
                if(newValue===undefined){
                    $scope.components = [];
                    return;
                }
                $scope.components = new Array(newValue)
                
                var componentFields = [
                    'pr_inkfront',
                    'pr_inksfront',
                    'pr_inkback',
                    'pr_inksback',
                    'mt_id'
                ];
                var index = undefined;
                for(var i = 8; newValue <= i; --i){
                    index = i.toString();
                    angular.forEach(componentFields,function(value,key){
                        if($scope.fmData[value]) {
                            if($scope.fmData[value][index]){
                                $scope.fmData[value][index] = undefined;
                            }
                        }
                    })
                }
            });

            $scope.frontInks = {};
            $scope.$watchCollection('fmData.pr_inkfront',function(newValues,oldValues){
                if ($scope.fmData.pr_inkfront !== undefined) {
                    angular.forEach(Object.keys(newValues),function(value,key){
                        $scope.frontInks[value] = new Array($scope.fmData.pr_inkfront[value]);
                        for (var i = $scope.fmData.pr_inkfront[value]; i < 8; i++) {
                            if ($scope.fmData['pr_inksfront']) {
                                if($scope.fmData['pr_inksfront'][value]){
                                    if($scope.fmData['pr_inksfront'][value][i]) {
                                        $scope.fmData['pr_inksfront'][value][i] = undefined;
                                    }
                                }
                            }
                        }
                    })    
                }
            })

            $scope.backInks = {};
            $scope.$watchCollection('fmData.pr_inkback',function(newValues,oldValues){
                if ($scope.fmData.pr_inkback !== undefined) {
                    angular.forEach(Object.keys(newValues),function(value,key){
                        $scope.backInks[value] = new Array($scope.fmData.pr_inkback[value]);
                        for (var i = $scope.fmData.pr_inkback[value]; i < 8; i++) {
                            if ($scope.fmData['pr_inksback']) {
                                if($scope.fmData['pr_inksback'][value]){
                                    if($scope.fmData['pr_inksback'][value][i]) {
                                        $scope.fmData['pr_inksback'][value][i] = undefined;
                                    }
                                }
                            }
                        }
                    })    
                }
            })

            $scope.$on('$viewContentLoaded', function () {
                // this code is executed after the view is loaded

                $scope.loading = true;
                productDigitalCounterfoilUpdateFac.data().then(function (promise) {
                    if (angular.isArray(promise.data) && promise.data.length === 1) {
                        const [data] = promise.data
                        $scope.fmData = data.pr_jsonb;
                        $scope.fmData.cl_id = data.cl_id
                        $scope.fmData.cl_corporatename = data.cl_corporatename
                        $scope.fmData.pr_id = $stateParams.pr_id
                        
                    }
                    $scope.loading = false;
                })

                productDigitalCounterfoilUpdateFac.getClient().then(function (promise) {
                    if (angular.isObject(promise.data)) {
                        var client = promise.data[0].cl_jsonb;
                        var cl_type = client.cl_type
                        $scope.client = (cl_type === 'legal') ? client.cl_corporatename : client.cl_name + ' ' + client.cl_firstsurname;
                    }
                });

                productDigitalCounterfoilUpdateFac.getInks($scope.fmData.pr_process).then(function (promise) {
                    if (angular.isArray(promise.data)) {
                        $scope.pr_inkoptions = [];
                        angular.forEach(promise.data, function (value, key) {
                            this.push({ "label": value.in_code, "value": value.in_id });
                        }, $scope.pr_inkoptions);
                    } else {
                        //$scope.updateFail = true;
                    }
                });

                productDigitalCounterfoilUpdateFac.getMaterials($scope.fmData.pr_process).then(function (promise) {
                    if (angular.isArray(promise.data)) {
                        $scope.mt_idoptions = [];
                        angular.forEach(promise.data, function (value, key) {
                            this.push({ "label": `${value.mt_code} – ${value.mt_description}`, "value": value.mt_id, "width": value.mt_width, "height": value.mt_height, "measure": value.mt_measure });
                        }, $scope.mt_idoptions);
                    } else {
                        //$scope.updateFail = true;
                    }
                });

                productDigitalCounterfoilUpdateFac.getTariffCodes().then(function (promise) {
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