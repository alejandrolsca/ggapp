module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'productDigitalPaginatedAddFac', '$location', 'i18nFilter', '$stateParams',
        function ($scope, productDigitalPaginatedAddFac, $location, i18nFilter, $stateParams) {
            $scope.fmData = {
                "pr_process": "digital",
                "pr_type": "paginated",
                "pr_spiralbind": "no", 
                "pr_stapling": "no", 
                "pr_bound": "no",
                "pr_folio": "no", 
                "pr_status": "A"
            };
            $scope.fmData.cl_id = +$stateParams.cl_id;
            $scope.fmData.pr_components = 1;

            $scope.onSubmit = function () {

                productDigitalPaginatedAddFac.add($scope.fmData).then(function (promise) {
                    if (promise.data.rowCount == 1) {
                        $location.path('/product/' + $stateParams.cl_id);
                    } else {
                        $scope.updateFail = true;
                    }
                });
            };

            $scope.pr_languageoptions = i18nFilter("productDigitalPaginated-add.fields.pr_languageoptions");            
            $scope.pr_finalsizemeasureoptions = i18nFilter("productDigitalPaginated-add.fields.pr_finalsizemeasureoptions");
            $scope.pr_componentsoptions = i18nFilter("productDigitalPaginated-add.fields.pr_componentsoptions");
            $scope.pr_inkfrontoptions = i18nFilter("productDigitalPaginated-add.fields.pr_inkfrontoptions");
            $scope.pr_inkbackoptions = i18nFilter("productDigitalPaginated-add.fields.pr_inkbackoptions");
            $scope.pr_varnishoptions = i18nFilter("productDigitalPaginated-add.fields.pr_varnishoptions");
            $scope.pr_varnisfinishedoptions = i18nFilter("productDigitalPaginated-add.fields.pr_varnisfinishedoptions");
            $scope.pr_laminateoptions = i18nFilter("productDigitalPaginated-add.fields.pr_laminateoptions");
            $scope.pr_laminatefinishedoptions = i18nFilter("productDigitalPaginated-add.fields.pr_laminatefinishedoptions");
            $scope.pr_laminatecaliberoptions = i18nFilter("productDigitalPaginated-add.fields.pr_laminatecaliberoptions");
            $scope.pr_foliooptions = i18nFilter("productDigitalPaginated-add.fields.pr_foliooptions");
            $scope.pr_foldunitoptions = i18nFilter("productDigitalPaginated-add.fields.pr_foldunitoptions");
            $scope.pr_precutoptions = i18nFilter("productDigitalPaginated-add.fields.pr_precutoptions");            
            $scope.pr_diecuttingoptions = i18nFilter("productDigitalPaginated-add.fields.pr_diecuttingoptions");
            $scope.pr_reinforcementoptions = i18nFilter("productDigitalPaginated-add.fields.pr_reinforcementoptions");
            $scope.pr_cordoptions = i18nFilter("productDigitalPaginated-add.fields.pr_cordoptions");
            $scope.pr_wireoptions = i18nFilter("productDigitalPaginated-add.fields.pr_wireoptions");
            $scope.pr_drilloptions = i18nFilter("productDigitalPaginated-add.fields.pr_drilloptions");
            $scope.pr_staplingoptions = i18nFilter("productDigitalPaginated-add.fields.pr_staplingoptions");
            $scope.pr_boundoptions = i18nFilter("productDigitalPaginated-add.fields.pr_boundoptions");
            $scope.pr_spiralbindoptions = i18nFilter("productDigitalPaginated-add.fields.pr_spiralbindoptions");
            $scope.pr_blocksoptions = i18nFilter("productDigitalPaginated-add.fields.pr_blocksoptions");
            $scope.pr_statusoptions = i18nFilter("productDigitalPaginated-add.fields.pr_statusoptions");
            $scope.pr_materialsizemeasureoptions = i18nFilter("productDigitalPaginated-add.fields.pr_materialsizemeasureoptions");
            
            // create components
            $scope.$watch('fmData.pr_components', function (newValue, oldValue) {
                if(newValue===undefined){
                    $scope.components = [];
                    return;
                }
                $scope.components = new Array(newValue)
                
                var componentFields = [
                    'pr_pages',
                    'pr_inkfront',
                    'pr_inksfront',
                    'pr_inkback',
                    'pr_inksback',
                    'mt_id',
                    'pr_materialsizewidth',
                    'pr_materialsizeheight',
                    'pr_materialsizemeasure',
                    'pr_materialformatsqty',
                    'pr_varnish',
                    'pr_varnishfinished',
                    'pr_laminate',
                    'pr_laminatefinished',
                    'pr_laminatecaliber',
                    'pr_foldunit1',
                    'pr_foldunit2',
                    'pr_foldunit3',
                    'pr_precut',
                    'pr_drill'
                ];
                var componentDefaults = [
                    {"field":"pr_varnish", "value":"no"},
                    {"field": "pr_laminate", "value": "no"},
                    {"field": "pr_foldunit1", "value": 0},
                    {"field": "pr_foldunit2", "value": 0},
                    {"field": "pr_foldunit3", "value": 0},
                    {"field": "pr_precut", "value": "no"},
                    {"field": "pr_drill", "value": 0}
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
                for(var i = 0; i < newValue; i++){
                    index = i.toString();
                    angular.forEach(componentDefaults, function(value,key){
                        if(!$scope.fmData[value.field]){
                            $scope.fmData[value.field] = {};
                            if(!$scope.fmData[value.field][index]){
                                $scope.fmData[value.field][index] = value.value;
                            }
                        }
                        if(!$scope.fmData[value.field][index]){
                            $scope.fmData[value.field][index] = value.value;
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

                productDigitalPaginatedAddFac.getClient().then(function (promise) {
                    $scope.loading = false;
                    if (angular.isObject(promise.data)) {
                        var client = promise.data[0].cl_jsonb;
                        var cl_type = client.cl_type
                        $scope.client = (cl_type === 'legal') ? client.cl_corporatename : client.cl_name + ' ' + client.cl_firstsurname;                    }
                });

                productDigitalPaginatedAddFac.getInks().then(function (promise) {
                    if (angular.isArray(promise.data)) {
                        $scope.pr_inkoptions = [];
                        angular.forEach(promise.data, function (value, key) {
                            this.push({ "label": value.in_code, "value": value.in_id });
                        }, $scope.pr_inkoptions);
                    } else {
                        //$scope.updateFail = true;
                    }
                });

                productDigitalPaginatedAddFac.getMaterials($scope.fmData.pr_process).then(function (promise) {
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