module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'woDuplicateFactory', '$stateParams', 'i18nFilter', '$filter','$location',
        function ($scope, woDuplicateFactory, $stateParams, i18nFilter, $filter, $location) {

            const camelCase = (...args) => {
                const camelCase = args.map(function (value, index) {
                    if (index === 0) {
                        return value.toLowerCase()
                    }
                    return value.charAt(0).toUpperCase() + value.substr(1);
                });
                return camelCase.join('')
            }

            // product modal
            $('#modal').on('show.bs.modal', async (event) => {
                //var button = $(event.relatedTarget); // Button that triggered the modal
                //$scope.qrcodeString = button.data('code_data');// Extract info from data-* attributes
                try {
                    const { data } = await woDuplicateFactory.getProductInfo($scope.fmData.pr_id)
                    let hasComponents = false
                    let componentsIndex = undefined
                    let pr_process = undefined
                    let pr_type = undefined
                    data.map((value, index, data) => {
                        if (value.key === 'pr_components') {
                            hasComponents = true
                            componentsIndex = index
                        }
                        if (value.key === 'pr_process') {
                            pr_process = value.value
                        }
                        if (value.key === 'pr_type') {
                            pr_type = value.value
                        }
                    })
                    if (hasComponents) {
                        const componentsData = data.map(async (value, index, data) => {
                            if (typeof value.value === 'object') {
                                value.value = null
                            }
                            if (value.key === 'mt_id') {
                                for (let i = 1; i <= data[componentsIndex].value; i++) {
                                    const { data } = await woDuplicateFactory.getProductInfoMaterial(value['component' + i])
                                    value['component' + i] = data[0].material
                                }
                            }
                            if (value.key === 'pr_inksfront') {
                                for (let i = 1; i <= data[componentsIndex].value; i++) {
                                    if (value['component' + i]) {
                                        const { data } = await woDuplicateFactory.getProductInfoInks(Object.values(value['component' + i]).join(','))
                                        value['component' + i] = data[0].inks
                                    }
                                }
                            }
                            if (value.key === 'pr_inksback') {
                                for (let i = 1; i <= data[componentsIndex].value; i++) {
                                    if (value['component' + i]) {
                                        const { data } = await woDuplicateFactory.getProductInfoInks(Object.values(value['component' + i]).join(','))
                                        value['component' + i] = data[0].inks
                                    }
                                }
                            }
                            return value
                        })
                        componentsData.map(async (value, index, data) => {
                            if (typeof value.value === 'object') {
                                value.value = null
                            }
                            return value
                        })
                        Promise.all(componentsData).then((completed) => {
                            completed.map((value) => {
                                value.key = i18nFilter(`${camelCase('product', pr_process, pr_type)}-add.labels.${value.key.replace('_', '-')}`);
                            })
                            $scope.prInfo = completed
                            $scope.components = new Array(completed[componentsIndex].value)
                            $scope.$apply()
                        })
                    }
                    if (!hasComponents) {
                        const generalData = data.map(async (value, index, data) => {
                            if (value.key === 'mt_id') {
                                const { data } = await woDuplicateFactory.getProductInfoMaterial(value.value)
                                value.value = data[0].material
                            }
                            if (value.key === 'pr_inksfront') {
                                if (value.value) {
                                    const { data } = await woDuplicateFactory.getProductInfoInks(Object.values(value.value).join(','))
                                    value.value = data[0].inks
                                }
                            }
                            if (value.key === 'pr_inksback') {
                                if (value.value) {
                                    const { data } = await woDuplicateFactory.getProductInfoInks(Object.values(value.value).join(','))
                                    value.value = data[0].inks
                                }
                            }
                            return value
                        })
                        Promise.all(generalData).then((completed) => {
                            completed.map((value) => {
                                value.key = i18nFilter(`${camelCase('product', pr_process, pr_type)}-add.labels.${value.key.replace('_', '-')}`);
                            })
                            $scope.prInfo = completed
                            $scope.components = new Array()
                            $scope.$apply()
                        })
                    }
                } catch (error) {
                    console.log(error)
                }
            })

            $scope.wo_foliosperformatoptions = i18nFilter("wo-add.fields.wo_foliosperformatoptions");
            $scope.wo_currencyoptions = i18nFilter("wo-add.fields.wo_currencyoptions");
            $scope.wo_emailoptions = i18nFilter("wo-add.fields.wo_emailoptions");
            
            $scope.onSubmit = function () {

                woDuplicateFactory.add($scope.fmData).then(function (promise) {
                    if (promise.data.rowCount === 1) {
                        $location.path('/wo/' + $stateParams.cl_id);
                    } else {
                        $scope.updateFail = true;
                    }
                });
            };

            $scope.$on('$viewContentLoaded', function () {
                // this code is executed after the view is loaded
                $scope.loading = true;
                woDuplicateFactory.getData().then(function(promise){
                    $scope.loading = false;
                    if(angular.isArray(promise.data) && promise.data.length === 1) {
                            $scope.fmData = promise.data[0].wo_jsonb;
                            $scope.fmData.wo_type = "R"; //N-new, R-rep, C-change
                            $scope.fmData.wo_status = 0; //0-Active
                            $scope.fmData.wo_previousid = promise.data[0].wo_id;
                            $scope.fmData.wo_previousdate = promise.data[0].wo_date.substring(0, 10);
                            $scope.fmData.wo_createdby = authService.userProfile.username;

                    }
                });

                woDuplicateFactory.getZone().then(function (promise) {
                    $scope.zo_idoptions = [];
                    if (angular.isArray(promise.data)) {
                        var rows = promise.data;
                        angular.forEach(rows, function (value, key) {
                            this.push({ "label": rows[key]['zo_jsonb']['zo_zone'], "value": rows[key]['zo_id'] });
                        }, $scope.zo_idoptions);
                    }
                })

                woDuplicateFactory.getProduct().then(function (promise) {
                    $scope.pr_idoptions = [];
                    var rows = [];
                    if (angular.isArray(promise.data)) {
                        rows = promise.data;
                        angular.forEach(rows, function (value, key) {
                            this.push({ "label": rows[key]['pr_jsonb']['pr_code'] + ' - ' + rows[key]['pr_jsonb']['pr_name'], "value": rows[key]['pr_id'] });
                        }, $scope.pr_idoptions);
                    }
                    $scope.$watch(
                        "fmData.pr_id",
                        function prChange(newValue, oldValue) {
                            if (newValue !== undefined) {
                                var product = $filter('filter')(rows, { "pr_id": newValue }, true);
                                if (product.length !== 1) {
                                    $scope.prinfo = false;
                                    return;
                                } else {
                                    $scope.prinfo = true;
                                    $scope.product = product[0];
                                    $scope.folio = (product[0]['pr_jsonb']['pr_folio'] === 'yes') ? true : false;
                                    var pr_type = product[0]['pr_jsonb']['pr_type'] 
                                    $scope.components = (pr_type === 'paginated' || pr_type === 'counterfoil') ? true : false;
                                    $scope.componentsArray = new Array(product[0]['pr_jsonb']['pr_components'])
                                    woDuplicateFactory.getMachine(product[0]['pr_jsonb']['pr_process']).then(function (promise) {
                                        $scope.ma_idoptions = [];
                                        if (angular.isArray(promise.data)) {
                                            var rows = promise.data;
                                            angular.forEach(rows, function (value, key) {
                                                this.push({ "label": rows[key]['ma_jsonb']['ma_name'], "value": rows[key]['ma_id'] });
                                            }, $scope.ma_idoptions);
                                        }
                                    });
                                }
                            }
                        }
                    );
                });
                $scope.loading = false;
            });
        }];

})(angular);