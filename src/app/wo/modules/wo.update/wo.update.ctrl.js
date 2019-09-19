module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'woUpdateFactory', '$stateParams', 'i18nFilter', '$filter', '$location', 'authService', 'FileUploader','notyf',
        function ($scope, woUpdateFactory, $stateParams, i18nFilter, $filter, $location, authService, FileUploader, notyf) {

            const camelCase = (...args) => {
                const camelCase = args.map(function (value, index) {
                    if (index === 0) {
                        return value.toLowerCase()
                    }
                    return value.charAt(0).toUpperCase() + value.substr(1);
                });
                return camelCase.join('')
            }

            const { username } = authService.profile()

            // Create a new instance of the FileUploader
            $scope.uploader = new FileUploader({
                url: '/api/upload',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('id_token')}`
                },
                formData: [
                    {
                        wo_id: $stateParams.wo_id,
                        wo_updatedby: username
                    }
                ]
            });

            $scope.uploader.filters.push({
                'name': 'enforceMaxFileSize',
                'fn': function (item) {
                    return item.size <= 10485760 // 10 MiB to bytes
                }
            });

            $scope.uploader.onBeforeUploadItem = function (item) {
                console.info(item.alias)
                const [formData] = item.formData
                formData.originalName = item.file.name
                formData.alias = item.alias
                item.file.name = `${formData.wo_id}_${item.alias}.pdf`
                item.alias = 'file'
                console.info('onBeforeUploadItem', item);
            };

            $scope.uploader.onWhenAddingFileFailed = function (item, filter, options) {
                if (filter.name = 'enforceMaxFileSize') {
                    let [input] = document.getElementsByName(options.alias)
                    input.value = ''
                    if (!/safari/i.test(navigator.userAgent)) {
                        input.type = ''
                        input.type = 'file'
                    }
                    alert('El archivo es mayor a 10MB.')
                }
            }

            $scope.uploader.onSuccessItem = function (item, response, status, headers) {
                const [formData] = item.formData
                let [input] = document.getElementsByName(formData.alias)
                input.value = ''
                if (!/safari/i.test(navigator.userAgent)) {
                    input.type = ''
                    input.type = 'file'
                }
                $scope.loading = true;
                woUpdateFactory.getData().then(function (promise) {
                    $scope.loading = false;
                    if (angular.isArray(promise.data) && promise.data.length === 1) {
                        $scope.fmData = promise.data[0].wo_jsonb;
                        $scope.fmData.wo_type = "C"; //N-new,R-rep,C-change
                        $scope.wo_id = promise.data[0].wo_id;
                        $scope.wo_date = promise.data[0].wo_date;
                        const { username } = authService.profile()
                        $scope.fmData.wo_updatedby = username;
                    }
                })
            }

            // open files modal
            $scope.filesModal = () => {
                $('#filesModal').modal('show');
            }

            $scope.wo_foliosperformatoptions = i18nFilter("wo-add.fields.wo_foliosperformatoptions");
            $scope.wo_currencyoptions = i18nFilter("wo-add.fields.wo_currencyoptions");
            $scope.wo_emailoptions = i18nFilter("wo-add.fields.wo_emailoptions");

            $scope.onSubmit = function () {

                woUpdateFactory.update($scope.fmData).then(function (promise) {
                    if (promise.data.rowCount === 1) {
                        notyf.open({
                            type: 'success',
                            message: 'Orden Actualizada.'
                        });
                    } else {
                        $scope.updateFail = true;
                    }
                });
            };

            $scope.$on('$viewContentLoaded', function () {
                // this code is executed after the view is loaded

                $scope.loading = true;
                woUpdateFactory.getData().then(function (promise) {
                    $scope.loading = false;
                    if (angular.isArray(promise.data) && promise.data.length === 1) {
                        $scope.fmData = promise.data[0].wo_jsonb;
                        $scope.fmData.wo_type = "C"; //N-new,R-rep,C-change
                        $scope.wo_id = promise.data[0].wo_id;
                        $scope.wo_date = promise.data[0].wo_date;
                        const { username } = authService.profile()
                        $scope.fmData.wo_updatedby = username;

                    }

                    // create InputDate control
                    $scope.wo_commitmentdate = new wijmo.input.InputDate('#wo_commitmentdate', {
                        format: 'yyyy-MM-dd',
                        mask: '9999-99-99',
                        value: new Date(moment($scope.fmData.wo_commitmentdate).format()),
                    });
                    const originalDate = $scope.fmData.wo_commitmentdate

                    // wo_commitmentdate validator                
                    $scope.wo_commitmentdate.itemValidator = function (date) {
                        return !moment(date).isBefore(moment(), 'day');
                    }

                    // wo_commitmentdate changed handler                
                    $scope.wo_commitmentdate.valueChanged.addHandler(wo_commitmentdateChanged)

                    // wo_commitmentdate changed function
                    function wo_commitmentdateChanged(s, e) {
                        $scope.fmData.wo_commitmentdate = moment(s.value).format('YYYY-MM-DD')
                        $scope.$apply()
                    }


                    woUpdateFactory.getProduct($scope.fmData.pr_id).then(function (promise) {
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
                                        $scope.productUpdateUrl = `/product/update/${$scope.product['pr_jsonb']['pr_process']}/${$scope.product['pr_jsonb']['pr_type']}/${$scope.product['pr_jsonb']['cl_id']}/${$scope.product['pr_id']}`
                                        $scope.folio = (product[0]['pr_jsonb']['pr_folio'] === 'yes') ? true : false;
                                        var pr_type = product[0]['pr_jsonb']['pr_type']
                                        $scope.components = (pr_type === 'paginated' || pr_type === 'counterfoil') ? true : false;
                                        $scope.componentsArray = new Array(product[0]['pr_jsonb']['pr_components'])
                                    }
                                }
                            }
                        );
                    })
                });
                woUpdateFactory.getZone().then(function (promise) {
                    $scope.zo_idoptions = [];
                    if (angular.isArray(promise.data)) {
                        var rows = promise.data;
                        angular.forEach(rows, function (value, key) {
                            this.push({ "label": rows[key]['zo_jsonb']['zo_zone'], "value": rows[key]['zo_id'] });
                        }, $scope.zo_idoptions);
                    }
                });
                woUpdateFactory.getMachine().then(function (promise) {
                    $scope.ma_idoptions = [];
                    if (angular.isArray(promise.data)) {
                        var rows = promise.data;
                        angular.forEach(rows, function (value, key) {
                            this.push({ "label": rows[key]['ma_jsonb']['ma_name'], "value": rows[key]['ma_id'] });
                        }, $scope.ma_idoptions);
                    }
                });
                $scope.loading = false;
            });
        }];

})(angular);