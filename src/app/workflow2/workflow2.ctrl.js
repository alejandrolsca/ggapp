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
                        const bold = {
                            font: new wijmo.pdf.PdfFont("Helvetica", 10, "normal", "bold")
                        }
                        const boldContinued = {
                            font: new wijmo.pdf.PdfFont("Helvetica", 10, "normal", "bold"),
                            continued: true
                        }

                        var img_gglogo = require('../../static/img/gg-logo.png');
                        const { data: orders } = await workflow2Factory.getWoPrint($scope.wo_id.join(','))
                        let pdfDoc = null
                        const pdfTemplate = (pdfDoc, data) => {
                            const { pr_material, wo_jsonb, pr_jsonb } = data
                            const materials = pr_material.split(',')
                            const hasComponents = (pr_jsonb.pr_type === 'paginated' || pr_jsonb.pr_type === 'counterfoil') ? true : false;
                            const timestamp = moment().tz('America/Chihuahua').locale('es').format("DD/MM/YYYY h:mm:ss a");
                            //const componentsArray = new Array(pr_jsonb.pr_components)
                            pdfDoc.header.drawImage(img_gglogo, 0, 0, {
                                width: wijmo.pdf.pxToPt(150),
                                height: wijmo.pdf.pxToPt(79)
                            });
                            pdfDoc.drawText(`Orden no: `, 0, wijmo.pdf.pxToPt(79), data.wo_id ? boldContinued : bold); pdfDoc.drawText(`${data.wo_id || ''}`, null, null, {
                                brush: new wijmo.pdf.PdfSolidBrush('Blue'),
                                font: new wijmo.pdf.PdfFont("Helvetica", 10, "normal", "bold"),
                                link: `${window.location.origin}/wo/view/${data.cl_id}/${data.wo_id}`
                            })
                            pdfDoc.drawText(`Usuario: `, null, null, userProfile.username ? boldContinued : bold); pdfDoc.drawText(`${userProfile.username}`)
                            pdfDoc.drawText(`Fecha: `, null, null, timestamp ? boldContinued : bold); pdfDoc.drawText(`${timestamp}`)
                            pdfDoc.drawText(` `)
                            pdfDoc.drawText(`------------------------------------------------------- CLIENTE -----------------------------------------------------------`)
                            pdfDoc.drawText(`Cliente: `, null, null, data.cl_corporatename ? boldContinued : bold); pdfDoc.drawText(`${data.cl_corporatename || ''}`, null, null, {
                                brush: new wijmo.pdf.PdfSolidBrush('Blue'),
                                font: new wijmo.pdf.PdfFont("Helvetica", 10, "normal", "bold"),
                                link: `${window.location.origin}/client/update/${data.cl_id}`
                            })
                            pdfDoc.drawText(`Zona: `, null, null, data.zo_zone ? boldContinued : bold); pdfDoc.drawText(`${data.zo_zone || ''}`, null, null, {
                                brush: new wijmo.pdf.PdfSolidBrush('Blue'),
                                font: new wijmo.pdf.PdfFont("Helvetica", 10, "normal", "bold"),
                                link: `${window.location.origin}/zone/update/${data.cl_id}/${data.zo_id}`
                            })
                            pdfDoc.drawText(` `)
                            pdfDoc.drawText(`------------------------------------------------------- PRODUCTO --------------------------------------------------------`)
                            pdfDoc.drawText(`Codigo: `, null, null, pr_jsonb.pr_code ? boldContinued : bold); pdfDoc.drawText(`${pr_jsonb.pr_code || ''}`, null, null, {
                                brush: new wijmo.pdf.PdfSolidBrush('Blue'),
                                font: new wijmo.pdf.PdfFont("Helvetica", 10, "normal", "bold"),
                                link: `${window.location.origin}/product/update/${pr_jsonb.pr_process}/${pr_jsonb.pr_type}/${data.cl_id}/${data.pr_id}`
                            })
                            pdfDoc.drawText(`Producto: `, null, null, pr_jsonb.pr_name ? boldContinued : bold); pdfDoc.drawText(`${pr_jsonb.pr_name || ''}`)
                            pdfDoc.drawText(`No. Parte: `, null, null, data.pr_partno ? boldContinued : bold); pdfDoc.drawText(`${data.pr_partno || ''}`)
                            pdfDoc.drawText(`Folio: `, null, null, data.pr_folio ? boldContinued : bold); pdfDoc.drawText(`${data.pr_folio || ''}`)
                            pdfDoc.drawText(`# Tintas frente: `, null, null, data.inkfront ? boldContinued : bold); pdfDoc.drawText(`${data.inkfront || ''}`)
                            pdfDoc.drawText(`Tintas frente: `, null, null, data.inksfront ? boldContinued : bold); pdfDoc.drawText(`${data.inksfront || ''}`)
                            pdfDoc.drawText(`# Tintas reverso: `, null, null, data.inkback ? boldContinued : bold); pdfDoc.drawText(`${data.inkback || ''}`)
                            pdfDoc.drawText(`Tintas reverso: `, null, null, data.inksback ? boldContinued : bold); pdfDoc.drawText(`${data.inksback || ''}`)
                            pdfDoc.drawText(` `)
                            pdfDoc.drawText(`------------------------------------------------------- ORDEN -------------------------------------------------------------`)
                            pdfDoc.drawText(`Orden no: `, null, null, data.wo_id ? boldContinued : bold); pdfDoc.drawText(`${data.wo_id || ''}`, null, null, {
                                brush: new wijmo.pdf.PdfSolidBrush('Blue'),
                                font: new wijmo.pdf.PdfFont("Helvetica", 10, "normal", "bold"),
                                link: `${window.location.origin}/wo/view/${data.cl_id}/${data.wo_id}`
                            })
                            pdfDoc.drawText(`Fecha compromiso: `, null, null, wo_jsonb.wo_commitmentdate ? boldContinued : bold); pdfDoc.drawText(`${wo_jsonb.wo_commitmentdate || ''}`)
                            pdfDoc.drawText(`Tipo: `, null, null, wo_jsonb.wo_type ? boldContinued : bold); pdfDoc.drawText(`${wo_jsonb.wo_type || ''}`)
                            pdfDoc.drawText(`Release: `, null, null, wo_jsonb.wo_release ? boldContinued : bold); pdfDoc.drawText(`${wo_jsonb.wo_release || ''}`)
                            pdfDoc.drawText(`Orden de compra: `, null, null, wo_jsonb.wo_po ? boldContinued : bold); pdfDoc.drawText(`${wo_jsonb.wo_po || ''}`)
                            pdfDoc.drawText(`Linea: `, null, null, wo_jsonb.wo_line || wo_jsonb.wo_linetotal ? boldContinued : bold);
                            if (wo_jsonb.wo_line || wo_jsonb.wo_linetotal) {
                                pdfDoc.drawText(`${wo_jsonb.wo_line || ''} de ${wo_jsonb.wo_linetotal || ''}`)
                            }
                            pdfDoc.drawText(`Cantidad: `, null, null, wo_jsonb.wo_qty ? boldContinued : bold); pdfDoc.drawText(`${wo_jsonb.wo_qty || ''}`)
                            pdfDoc.drawText(`Material:`, null, null, bold)
                            materials.map((value) => {
                                pdfDoc.drawText(`${value}`)
                            })
                            if (hasComponents) {
                                pdfDoc.drawText(`Material Ordenado:`, null, null, bold)
                                for (let i = 0; i < pr_jsonb.pr_components; i++) {
                                    pdfDoc.drawText(`${pr_jsonb.pr_concept[i]}: ${wo_jsonb.wo_componentmaterialqty[i]}`)
                                }
                            } else {
                                pdfDoc.drawText(`Material Ordenado: `, null, null, wo_jsonb.wo_materialqty ? boldContinued : bold); pdfDoc.drawText(`${wo_jsonb.wo_materialqty || ''}`)

                            }
                            pdfDoc.drawText(`Maquina: `, null, null, data.ma_name ? boldContinued : bold); pdfDoc.drawText(`${data.ma_name || ''}`, null, null, {
                                brush: new wijmo.pdf.PdfSolidBrush('Blue'),
                                font: new wijmo.pdf.PdfFont("Helvetica", 10, "normal", "bold"),
                                link: `${window.location.origin}/machine/update/${data.ma_id}`
                            })
                            pdfDoc.drawText(`Notas: `, null, null, wo_jsonb.wo_notes ? boldContinued : bold); pdfDoc.drawText(`${wo_jsonb.wo_notes || ''}`)
                            pdfDoc.drawText(` `)
                            pdfDoc.drawText(`------------------------------------------------------- EMPAQUE -----------------------------------------------------------`)
                            pdfDoc.drawText(`Cant. x paq/rollo: `, null, null, wo_jsonb.wo_packageqty ? boldContinued : bold); pdfDoc.drawText(`${wo_jsonb.wo_packageqty || ''}`)
                            pdfDoc.drawText(`Cant. x caja: `, null, null, wo_jsonb.wo_boxqty ? boldContinued : bold); pdfDoc.drawText(`${wo_jsonb.wo_boxqty || ''}`)
                            pdfDoc.drawText(`Precio: `, null, null, data.wo_price ? boldContinued : bold); pdfDoc.drawText(`${data.wo_price || ''}`)
                            pdfDoc.drawText(`Moneda: `, null, null, data.wo_currency ? boldContinued : bold); pdfDoc.drawText(`${data.wo_currency || ''}`)


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
                    if (selected) {
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
                value.notAnOption = false;
                /*if (userProfile.us_group.includes(value.us_group) || userProfile.us_group.includes('admin')) {
                    value.notAnOption = false;
                }*/
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
                isRowSelectable: isRowSelectable,
                dateComponent: CustomDateComponent,
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

            function isRowSelectable(rowNode) {
                const hasAttachements = !!rowNode.data.file1 || !!rowNode.data.file2
                return hasAttachements;
            }

            function CustomDateComponent() {
            }
            
            CustomDateComponent.prototype.init = function (params) {
                var template = 
                    `<input style="width:90%; margin-left: 4px;
                    margin-right: 4px;" type="text" data-input />
                    <a class="input-button" title="clear" data-clear>
                        <i class="glyphicon glyphicon-remove-circle"></i>
                    </a>`;
            
                this.params = params;
            
                this.eGui = document.createElement('div');
            
                var eGui = this.eGui;
            
                eGui.setAttribute('role', 'presentation');
                eGui.classList.add('ag-input-wrapper');
                eGui.classList.add('custom-date-filter');
                eGui.innerHTML = template;
            
                this.eInput = eGui.querySelector('input');
            
                this.picker = flatpickr(this.eGui, {
                    onChange: this.onDateChanged.bind(this),
                    dateFormat: 'Y-m-d',
                    wrap: true
                });
            
                this.picker.calendarContainer.classList.add('ag-custom-component-popup');
            
                this.date = null;
            };
            
            CustomDateComponent.prototype.getGui = function () {
                return this.eGui;
            };
            
            CustomDateComponent.prototype.onDateChanged = function (selectedDates) {
                this.date = selectedDates[0] || null;
                this.params.onDateChanged();
            };
            
            CustomDateComponent.prototype.getDate = function () {
                return this.date;
            };
            
            CustomDateComponent.prototype.setDate = function (date) {
                this.picker.setDate(date);
                this.date = date;
            };

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