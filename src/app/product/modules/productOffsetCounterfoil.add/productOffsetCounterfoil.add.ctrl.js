module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'productOffsetCounterfoilAddFac', '$location', 'i18nFilter', '$stateParams',
        function ($scope, productOffsetCounterfoilAddFac, $location, i18nFilter, $stateParams) {
            $scope.fmData = {};
            //$scope.fmData = { "cl_id": "8", "pa_id": "1", "pr_code": "test123", "pr_cord": "allocated", "pr_fold": "tryptic", "pr_name": "Producto de prueba", "pr_type": "general", "pr_wire": "allocated", "pr_folio": "yes", "pr_blocks": "100", "pr_partno": "TEST-ASA.asas: 23,34", "pr_precut": "horizontal", "pr_status": "A", "pr_weight": "0.25", "pr_inkback": 2, "pr_process": "offset", "pr_varnish": "yes", "pr_inkfront": 2, "pr_inksback": { "0": "5", "1": "3" }, "pr_laminate": "yes", "pr_language": "español", "pr_inksfront": { "0": "2", "1": "2" }, "pr_varnishuv": "oneside", "pr_diecutting": "yes", "pr_description": "este es un producto de prueba", "pr_diecuttingqty": "5", "pr_reinforcement": "one", "pr_finalsizewidth": "100.00", "pr_papersizewidth": "100.00", "pr_finalsizeheight": "200.00", "pr_laminatecaliber": "2mm", "pr_paperformatsqty": "123", "pr_papersizeheight": "200.00", "pr_varnishfinished": "matte", "pr_finalsizemeasure": "cm", "pr_laminatefinished": "matte", "pr_papersizemeasure": "cm" };
            $scope.fmData.pr_process = 'offset';
            $scope.fmData.pr_type = 'counterfoil';
            $scope.fmData.cl_id = $stateParams.cl_id;

            $scope.onSubmit = function () {

                productOffsetCounterfoilAddFac.add($scope.fmData).then(function (promise) {
                    if (promise.data.rowCount === 1) {
                        $location.path('/product/' + $stateParams.cl_id);
                    } else {
                        $scope.updateFail = true;
                    }
                });
            };

            $scope.pr_languageoptions = i18nFilter("productOffsetCounterfoil-add.fields.pr_languageoptions");
            $scope.pr_finalsizemeasureoptions = i18nFilter("productOffsetCounterfoil-add.fields.pr_finalsizemeasureoptions");
            $scope.pr_sheetspersetoptions = i18nFilter("productOffsetCounterfoil-add.fields.pr_sheetspersetoptions");
            $scope.pr_inkfrontoptions = i18nFilter("productOffsetCounterfoil-add.fields.pr_inkfrontoptions");
            $scope.pr_inkbackoptions = i18nFilter("productOffsetCounterfoil-add.fields.pr_inkbackoptions");
            $scope.pr_papersizemeasureoptions = i18nFilter("productOffsetCounterfoil-add.fields.pr_papersizemeasureoptions");
            $scope.pr_varnishoptions = i18nFilter("productOffsetCounterfoil-add.fields.pr_varnishoptions");
            $scope.pr_varnisfinishedoptions = i18nFilter("productOffsetCounterfoil-add.fields.pr_varnisfinishedoptions");
            $scope.pr_laminateoptions = i18nFilter("productOffsetCounterfoil-add.fields.pr_laminateoptions");
            $scope.pr_laminatefinishedoptions = i18nFilter("productOffsetCounterfoil-add.fields.pr_laminatefinishedoptions");
            $scope.pr_laminatecaliberoptions = i18nFilter("productOffsetCounterfoil-add.fields.pr_laminatecaliberoptions");
            $scope.pr_foliooptions = i18nFilter("productOffsetCounterfoil-add.fields.pr_foliooptions");
            $scope.pr_foldunitoptions = i18nFilter("productOffsetCounterfoil-add.fields.pr_foldunitoptions");
            $scope.pr_precutoptions = i18nFilter("productOffsetCounterfoil-add.fields.pr_precutoptions");
            $scope.pr_reinforcementoptions = i18nFilter("productOffsetCounterfoil-add.fields.pr_reinforcementoptions");
            $scope.pr_cordoptions = i18nFilter("productOffsetCounterfoil-add.fields.pr_cordoptions");
            $scope.pr_wireoptions = i18nFilter("productOffsetCounterfoil-add.fields.pr_wireoptions");
            $scope.pr_drilloptions = i18nFilter("productOffsetCounterfoil-add.fields.pr_drilloptions");
            $scope.pr_blocksoptions = i18nFilter("productOffsetCounterfoil-add.fields.pr_blocksoptions");
            $scope.pr_statusoptions = i18nFilter("productOffsetCounterfoil-add.fields.pr_statusoptions");

            // populate sheets per set fields
            $scope.$watch('fmData.pr_sheetsperset', function (newValue, oldValue) {
                if ($scope.fmData.pr_sheetsperset !== undefined) {
                    $scope.fmData.pr_inkfront = undefined;
                    $scope.fmData.pr_inkback = undefined;
                    $scope.sheetsperset = new Array(newValue);
                    let frontArray = [];
                    let backArray = [];
                    for (var i = 0; i < newValue; i++) {
                        frontArray.push('fmData.pr_inkfront[' + i + ']')
                        backArray.push('fmData.pr_inkback[' + i + ']')
                    }
                    $scope.frontSet = frontArray;
                    $scope.backSet = backArray;
                    console.log('frontSet', $scope.frontSet, 'backSet', $scope.backSet)
                }
            });

            $scope.$watchCollection('frontSet', function (newValues, oldValues) {
                if (newValues !== undefined) {
                    newValues.forEach(function (value, index) {
                        $scope.$watch(value, function (newValue, oldValue) {
                            if (newValue !== undefined) {
                                console.log('entro')
                                $scope.frontInks = {};
                                $scope.frontInks[index] = new Array(newValue);
                                if ($scope.fmData.pr_inksfront) {
                                    for (var i = 0; i < oldValue; i++) {
                                        $scope.fmData['pr_inksfront'][index] = undefined;
                                    }
                                }
                            }
                        });
                    })
                }
            })

            $scope.$watchCollection('backSet', function (newValues, oldValues) {
                if (newValues !== undefined) {
                    newValues.forEach(function (value, index) {
                        $scope.$watch(value, function (newValue, oldValue) {
                            if (newValue !== undefined) {
                                $scope.backInks = {};
                                $scope.backInks[index] = new Array(newValue);
                                if ($scope.fmData.pr_inksback) {
                                    for (var i = 0; i < oldValue; i++) {
                                        $scope.fmData['pr_inksback'][index] = undefined;
                                    }
                                }
                            }
                        });
                    })
                }
            })

            $scope.$on('$viewContentLoaded', function () {
                // this code is executed after the view is loaded

                productOffsetCounterfoilAddFac.getClient().then(function (promise) {
                    $scope.loading = false;
                    if (angular.isObject(promise.data)) {
                        $scope.client = promise.data;
                    }
                });

                productOffsetCounterfoilAddFac.getInks().then(function (promise) {
                    if (angular.isArray(promise.data)) {
                        $scope.pr_inkoptions = [];
                        angular.forEach(promise.data, function (value, key) {
                            this.push({ "label": value.in_code, "value": value.in_id });
                        }, $scope.pr_inkoptions);
                    } else {
                        //$scope.updateFail = true;
                    }
                });

                productOffsetCounterfoilAddFac.getPapers().then(function (promise) {
                    if (angular.isArray(promise.data)) {
                        $scope.pa_idoptions = [];
                        angular.forEach(promise.data, function (value, key) {
                            this.push({ "label": value.pa_code, "value": value.pa_id, "width": value.pa_width, "height": value.pa_height, "measure": value.pa_measure });
                        }, $scope.pa_idoptions);
                    } else {
                        //$scope.updateFail = true;
                    }
                });

            });
        }];

})(angular);