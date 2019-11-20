module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'workflow2Factory', '$location', 'i18nFilter', '$stateParams', '$filter', 'authService', '$timeout', 'notyf',
        function ($scope, workflow2Factory, $location, i18nFilter, $stateParams, $filter, authService, $timeout, notyf) {

            $scope.fmData = {};

            var userProfile = authService.profile();

            const defaultColDef = i18nFilter("workflow2.defaultColDef");
            const defaultGridDef = i18nFilter("workflow2.defaultGridDef");
            const sideBar = i18nFilter("workflow2.sideBar");
            const statusBar = i18nFilter("workflow2.statusBar");
            const mainColumnDefs = i18nFilter("workflow2.mainColumnDefs");
            const materialColumnDefs = i18nFilter("workflow2.materialColumnDefs");

            // export to xls
            $scope.exportXLS = function () {
                if ($scope.fmData.wo_status || $scope.fmData.wo_status === 0) {
                    const { label: current_status } = $scope.wo_statusoptions.find((value) => {
                        return value.value === $scope.fmData.wo_status
                    })
                    const timestamp = moment().tz('America/Chihuahua').format();
                    const fileName = `workflow2_${current_status}_${timestamp}.xlsx`;
                    const params = {
                        fileName: fileName
                    }
                    try {
                        $scope.mainGridOptions.api.exportDataAsExcel(params);
                    } catch (error) {
                        throw new Error(error)
                    }
                }
            }

            // export to xls
            $scope.exportMaterialsXLS = function () {
                if ($scope.fmData.wo_status || $scope.fmData.wo_status === 0) {
                    const { label: current_status } = $scope.wo_statusoptions.find((value) => {
                        return value.value === $scope.fmData.wo_status
                    })
                    const timestamp = moment().tz('America/Chihuahua').format();
                    const fileName = `requested_material_${current_status}_${timestamp}.xlsx`;
                    const params = {
                        fileName: fileName
                    }
                    try {
                        $scope.materialsGridOptions.api.exportDataAsExcel(params);
                    } catch (error) {
                        throw new Error(error)
                    }
                }
            }

            // export to PDF
            $scope.exportPDF = () => {
                isSelected().then(async (selected) => {
                    if (selected) {
                        var img_gglogo = require('../../static/img/gg-logo.png');
                        const { data: orders } = await workflow2Factory.getWoPrint($scope.wo_id.join(','))
                        let pdfDoc = null
                        const pdfTemplate = (pdfDoc, data) => {
                            const { pr_material } = data
                            const { wo_jsonb } = data
                            const { pr_jsonb } = data
                            const materials = pr_material.split(',')
                            const hasComponents = (pr_jsonb.pr_type === 'paginated' || pr_jsonb.pr_type === 'counterfoil') ? true : false;
                            const componentsArray = new Array(pr_jsonb.pr_components)
                            pdfDoc.header.drawImage(img_gglogo, 0, 0, {
                                width: wijmo.pdf.pxToPt(150),
                                height: wijmo.pdf.pxToPt(79)
                            });
                            pdfDoc.drawText(`Orden no: ${data.wo_id}`, 0, wijmo.pdf.pxToPt(79))
                            pdfDoc.drawText(`Cliente: ${data.cl_corporatename}`)
                            pdfDoc.drawText(`Order Type: ${wo_jsonb.wo_type}`)
                            pdfDoc.drawText(`Zona: ${data.zo_zone}`)
                            pdfDoc.drawText(`Release: ${wo_jsonb.wo_release}`)
                            pdfDoc.drawText(`Orden de compra: ${wo_jsonb.wo_po}`)
                            pdfDoc.drawText(`Linea ${wo_jsonb.wo_line} de ${wo_jsonb.wo_linetotal}`)
                            pdfDoc.drawText(`Producto: ${pr_jsonb.pr_code} - ${pr_jsonb.pr_name}`)
                            pdfDoc.drawText(`Cantidad: ${wo_jsonb.wo_qty}`)
                            pdfDoc.drawText(`No. Part: ${data.pr_partno}`)
                            pdfDoc.drawText(`Folio: ${data.pr_folio}`)
                            pdfDoc.drawText(`Material:`)
                            materials.map((value) => {
                                pdfDoc.drawText(`${value}`)
                            })
                            if (hasComponents) {
                                pdfDoc.drawText(`Material Ordenado:`)
                                for (let i = 0; i < pr_jsonb.pr_components; i++) {
                                    pdfDoc.drawText(`${pr_jsonb.pr_concept[i]}: ${wo_jsonb.wo_componentmaterialqty[i]}`)
                                }
                            } else {
                                pdfDoc.drawText(`Material Ordenado: ${wo_jsonb.wo_materialqty}`)
                            }
                            pdfDoc.drawText(`# Tintas frente: ${data.inkfront}`)
                            pdfDoc.drawText(`Tintas frente: ${data.inksfront}`)
                            pdfDoc.drawText(`# Tintas reverso: ${data.inkback}`)
                            pdfDoc.drawText(`Tintas reverso: ${data.inksback}`)
                            pdfDoc.drawText(`Maquina: ${data.ma_name}`)
                            pdfDoc.drawText(`Cant. x paq/rollo: ${wo_jsonb.wo_packageqty}`)
                            pdfDoc.drawText(`Cant. x caja: ${wo_jsonb.wo_boxqty}`)
                            pdfDoc.drawText(`Notas: ${wo_jsonb.wo_notes}`)
                            pdfDoc.drawText(`Fecha compromiso: ${wo_jsonb.wo_commitmentdate}`)
                            pdfDoc.drawText(`Precio: ${data.wo_price}`)
                            pdfDoc.drawText(`Moneda: ${data.wo_currency}`)


                        }
                        orders.map((value, index) => {
                            if (index === 0) {
                                const margin = 36
                                pdfDoc = new wijmo.pdf.PdfDocument({
                                    pageSettings: {
                                        layout: wijmo.pdf.PdfPageOrientation.Portrait,
                                        size: wijmo.pdf.PdfPageSize.Letter,
                                        margins: { // margins are given in points
                                            left: margin,
                                            top: margin,
                                            right: margin,
                                            bottom: margin
                                        },
                                    },
                                    ended: function (sender, args) {
                                        const timestamp = moment().tz('America/Chihuahua').format();
                                        const fileName = `orders_${timestamp}.pdf`;
                                        wijmo.pdf.saveBlob(args.blob, `${fileName}.pdf`);
                                    }
                                })
                                pdfDoc.setFont(new wijmo.pdf.PdfFont('Helvetica', 10, 'normal', '500'))
                                pdfTemplate(pdfDoc, value)
                            } else {
                                const pdfDocRef = pdfDoc.addPage()
                                pdfTemplate(pdfDocRef, value)
                            }
                        })
                        pdfDoc.end()
                    } else {
                        notyf.open({
                            type: 'warning',
                            message: 'Debe seleccionar por lo menos una orden de trabajo.'
                        });
                    }
                })
            }

            $scope.onUpdate = function () {
                isSelected().then((selected) => {
                    if(selected) {
                        $('#myModal').modal('show');
                        setNextStatus()
                    } else {
                        notyf.open({
                            type: 'warning',
                            message: 'Debe seleccionar por lo menos una orden de trabajo.'
                        });
                    }
                })
            };

            const isSelected = async () => {
                const { length } = $scope.wo_id || []
                const selected = (length > 0) ? true : false;
                return await selected
            }

            const setNextStatus = () => {
                var next_status = undefined;
                angular.forEach($scope.wo_statusoptions, function (value, key) {
                    if (value.value === $scope.fmData.wo_nextstatus) {
                        next_status = value.label;
                    }
                });
                $scope.next_status = next_status;
            }


            $scope.onSubmit = function () {

                const { us_group: status_group } = $scope.wo_statusoptions.find((value) => {
                    return value.value === $scope.fmData.wo_status
                })

                const statusChangeAllowed = userProfile.us_group.includes(status_group) || userProfile.us_group.includes('admin')

                if (!statusChangeAllowed) {
                    // Display an error notification
                    notyf.error('Necesita privilegios adicionales para realizar esta acción.');
                    return;
                }
                if ($scope.fmData.wo_nextstatus === 18) {
                    workflow2Factory.updatecancellation($scope.fmData.wo_nextstatus, userProfile.username, $scope.fmData.wo_cancellationnotes, $scope.wo_id.join(',')).then(function (promise) {
                        if (promise.data.rowCount >= 1) {
                            $scope.fmData.wo_status = $scope.fmData.wo_nextstatus;
                        } else {
                            $scope.updateFail = true;
                        }
                    });
                } else {
                    workflow2Factory.update($scope.fmData.wo_nextstatus, userProfile.username, $scope.wo_id.join(',')).then(function (promise) {
                        if (promise.data.rowCount >= 1) {
                            $scope.fmData.wo_status = $scope.fmData.wo_nextstatus;
                        } else {
                            $scope.updateFail = true;
                        }
                    });
                }
                $('#myModal').modal('hide');
            }

            $scope.materialsGridOptions = {
                columnDefs: [
                    ...materialColumnDefs
                ],
                defaultColDef: { ...defaultColDef },
                ...defaultGridDef,
                sideBar: { ...sideBar },
                statusBar: { ...statusBar },
                rowData: []
            }

            $scope.materialsModal = () => {
                $scope.setMaterials()
                $('#materialsModal').modal('show');
            }


            // autoSizeRows after filter applied
            $scope.setMaterials = function (s, e) {
                setTimeout(function () {
                    const rows = $scope.selectedRows || []
                    const materials = []
                    const material_ids = []
                    rows.map(value => {
                        value = value.data
                        if (value.pr_components) {
                            const pr_materials = value.pr_materialraw.split('|')
                            const mt_id = Object.keys(value.pr_jsonb.mt_id)
                            mt_id.map((component_id, index) => {
                                if (!material_ids.includes(value.pr_jsonb.mt_id[component_id])) {
                                    material_ids.push(value.pr_jsonb.mt_id[component_id])
                                    materials.push({ "mt_id": value.pr_jsonb.mt_id[component_id], "pr_material": pr_materials[index], "pr_materialqty": Number(value.wo_componentmaterialqty[index]) })
                                } else {
                                    const material_index = materials.findIndex((elem) => {
                                        return elem.mt_id === value.pr_jsonb.mt_id[component_id]
                                    })
                                    materials[material_index].pr_materialqty += Number(value.wo_componentmaterialqty[index])
                                }
                            })
                        } else {
                            const mt_id = Object.keys(value.pr_jsonb.mt_id)
                            if (!material_ids.includes(value.pr_jsonb.mt_id)) {
                                material_ids.push(value.pr_jsonb.mt_id)
                                materials.push({ "mt_id": value.pr_jsonb.mt_id, "pr_material": value.pr_material, "pr_materialqty": Number(value.wo_materialqty) })
                            } else {
                                const material_index = materials.findIndex((elem) => {
                                    return elem.mt_id === value.pr_jsonb.mt_id
                                })
                                materials[material_index].pr_materialqty += Number(value.wo_materialqty)
                            }

                        }
                    })
                    $timeout(function () {
                        $scope.materialsGridOptions.api.setRowData(materials)
                    }, 0, true)
                }, 500);

            };

            $scope.wo_statusoptions = [];
            $scope.wo_statusoptions = JSON.parse(JSON.stringify(i18nFilter("workflow2.fields.wo_statusoptions"))) // clone array
            $scope.wo_statusoptions.map((value) => {
                value.notAnOption = true;
                if (userProfile.us_group.includes(value.us_group) || userProfile.us_group.includes('admin')) {
                    value.notAnOption = false;
                }
                return value
            })

            $scope.mainGridOptions = {
                defaultColDef: { ...defaultColDef },
                columnDefs: [
                    {
                        headerName: "Active", field: "active", sortable: false, width: 120, filter: false,
                        checkboxSelection: true,
                        headerCheckboxSelection: true,
                        headerCheckboxSelectionFilteredOnly: true
                    },
                    {
                        headerName: "Acciones", sortable: false, width: 100, filter: false, cellRenderer: function (params) {
                            return `<div class="btn-group btn-group-justified" role="group" aria-label="...">
                                    <div class="btn-group" role="group">
                                        <a href="/wo/view/${params.data.cl_id}/${params.data.wo_id}" target="_blank" class="btn btn-default btn-xs">${i18nFilter("general.labels.open")}</a>
                                    </div>
                                </div>`;
                        }
                    },
                    {
                        headerName: "Archivos", sortable: false, width: 240, filter: false, cellRenderer: function (params) {
                            let innerHTML = ''
                            if (params.data.file1) {
                                innerHTML =
                                    `<a class="link" href="/uploads/${params.data.wo_id}_file1.pdf" download="${params.data.file1}" target="_blank">descargar</a> | 
                                <a class="link" href="/uploads/${params.data.wo_id}_file1.pdf" target="_blank">${params.data.file1}</a><br/>`
                            }
                            if (params.data.file2) {
                                innerHTML +=
                                    `<a class="link" href="/uploads/${params.data.wo_id}_file2.pdf" download="${params.data.file2}" target="_blank">descargar</a> | 
                                <a class="link" href="/uploads/${params.data.wo_id}_file2.pdf" target="_blank">${params.data.file2}</a>`
                            }
                            return innerHTML;
                        }
                    },
                    ...mainColumnDefs
                ],
                ...defaultGridDef,
                sideBar: { ...sideBar },
                statusBar: { ...statusBar },
                onGridReady: onGridReady,
                onSelectionChanged: onSelectionChanged,
                rowData: []

            }

            function onGridReady(event) {
                const visible = authService.userHasRole(['admin', 'warehouse', 'sales'])
                event.columnApi.setColumnVisible("wo_price", visible);
                event.columnApi.setColumnVisible("wo_currency", visible);
            }

            function onSelectionChanged(event) {
                $scope.selectedRows = event.api.getSelectedNodes();
                $scope.wo_id = $scope.selectedRows.map((row) => {
                    return row.data.wo_id
                })
            }

            $scope.$on('$viewContentLoaded', function () {

                // this code is executed after the view is loaded
                $scope.$watch('fmData.wo_status', function (newValue, oldValue) {
                    $scope.loading = true;
                    $scope.actions = [];
                    const actions = JSON.parse(JSON.stringify(i18nFilter("workflow2.fields.wo_statusoptions"))) // clone array
                    const current_status = actions.find((value) => {
                        return newValue === value.value
                    }) || { "interval": "1 year" }
                    actions.map((value) => {
                        if (value.wo_prevstatus.includes(newValue)) {
                            if (userProfile.us_group.includes('admin')) {
                                value.notAnOption = false
                                $scope.actions.push(value)
                            } else {
                                if (!userProfile.us_group.includes(actions[newValue].us_group)) {
                                    value.notAnOption = true
                                    $scope.actions.push(value)
                                } else {
                                    value.notAnOption = (value.value === 18);
                                    $scope.actions.push(value)
                                }
                            }
                        }
                    })
                    workflow2Factory.getData(newValue, current_status.interval).then(function (promise) {
                        $scope.loading = false;
                        if (angular.isArray(promise.data)) {
                            $timeout(function () {
                                $scope.wo_id = [];
                                $scope.mainGridOptions.api.setRowData(promise.data);
                            }, 0, true)
                        }
                    });
                });
            });
        }];

})(angular);