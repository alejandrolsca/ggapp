module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'productOffsetCounterfoilAddFac', '$location', 'i18nFilter', '$stateParams',
        function ($scope, productOffsetCounterfoilAddFac, $location, i18nFilter, $stateParams) {
            $scope.fmData = {};
            $scope.fmData.pr_process = 'offset';
            $scope.fmData.pr_type = 'counterfoil';
            $scope.fmData.cl_id = +$stateParams.cl_id;

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
            $scope.pr_materialsizemeasureoptions = i18nFilter("productOffsetCounterfoil-add.fields.pr_materialsizemeasureoptions");
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
                    var frontArray = [];
                    var backArray = [];
                    for (var i = 0; i < newValue; i++) {
                        frontArray.push('fmData.pr_inkfront[' + i + ']')
                        backArray.push('fmData.pr_inkback[' + i + ']')
                    }
                    $scope.frontSet = frontArray;
                    $scope.backSet = backArray;
                    console.log('frontSet', $scope.frontSet, 'backSet', $scope.backSet)
                }
            });
            $scope.frontInks = {};
            $scope.$watchCollection('frontSet', function (newValues, oldValues) {
                if (newValues !== undefined) {
                    newValues.forEach(function (value, index) {
                        $scope.$watch(value, function (newValue, oldValue) {
                            console.log(value, index)
                            if (newValue !== undefined) {                              
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
            $scope.backInks = {};
            $scope.$watchCollection('backSet', function (newValues, oldValues) {
                if (newValues !== undefined) {                   
                    newValues.forEach(function (value, index) {
                        $scope.$watch(value, function (newValue, oldValue) {
                            if (newValue !== undefined) {                                                            
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
                        var client = promise.data[0].cl_jsonb;
                        var cl_type = client.cl_type
                        $scope.client = (cl_type === 'legal') ? client.cl_corporatename : client.cl_name + ' ' + client.cl_firstsurname;
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

                productOffsetCounterfoilAddFac.getMaterials().then(function (promise) {
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