module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'workflowFactory', '$location', 'i18nFilter', '$stateParams', '$filter', 'authService',
        function ($scope, workflowFactory, $location, i18nFilter, $stateParams, $filter, authService) {

            $scope.fmData = {};

            var userProfile = authService.profile();

            $scope.labels = Object.keys(i18nFilter("workflow.labels"));
            $scope.columns = i18nFilter("workflow.columns");
            $scope.materialColumns = i18nFilter("workflow.materialColumns");

            // export to xls
            $scope.exportXLS = function () {
                if ($scope.fmData.wo_status || $scope.fmData.wo_status === 0) {
                    const { label: current_status } = $scope.wo_statusoptions.find((value) => {
                        return value.value === $scope.fmData.wo_status
                    })
                    const timestamp = moment().tz('America/Chihuahua').format();
                    const fileName = `workflow_${current_status}_${timestamp}.xlsx`;
                    const flexGrid = $scope.ggGrid
                    try {
                        wijmo.grid.xlsx.FlexGridXlsxConverter.save(flexGrid, {
                            includeColumnHeaders: true,
                            includeCellStyles: false
                        }, fileName);
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
                    const flexGrid = $scope.materialsGrid
                    try {
                        wijmo.grid.xlsx.FlexGridXlsxConverter.save(flexGrid, {
                            includeColumnHeaders: true,
                            includeCellStyles: false
                        }, fileName);
                    } catch (error) {
                        throw new Error(error)
                    }
                }
            }

            // export to PDF
            $scope.exportPDF = async () => {
                const bold = {
                    font: new wijmo.pdf.PdfFont("Helvetica", 10, "normal", "bold")
                }
                const boldContinued = {
                    font: new wijmo.pdf.PdfFont("Helvetica", 10, "normal", "bold"),
                    continued: true
                }

                $scope.onUpdate()
                var img_gglogo = require('../../static/img/gg-logo.png');
                const { data: orders } = await workflowFactory.getWoPrint($scope.wo_id.join(','))
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
                    pdfDoc.drawText(`Cliente: `, null, null, data.cl_corporatename ? boldContinued : bold); pdfDoc.drawText(`${data.cl_corporatename || ''}`,null, null, {
                        brush: new wijmo.pdf.PdfSolidBrush('Blue'),
                        font: new wijmo.pdf.PdfFont("Helvetica", 10, "normal", "bold"),
                        link: `${window.location.origin}/client/update/${data.cl_id}`
                    })
                    pdfDoc.drawText(`Zona: `, null, null, data.zo_zone ? boldContinued : bold); pdfDoc.drawText(`${data.zo_zone || ''}`,null, null, {
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
                    pdfDoc.drawText(`Cantidad: `, null, null, wo_jsonb.wo_qty ? boldContinued : bold); pdfDoc.drawText(`${wo_jsonb.wo_qty || ''} ${wo_jsonb.wo_qtymeasure || ''}`)
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
                    pdfDoc.drawText(`Maquina: `, null, null, data.ma_name ? boldContinued : bold); pdfDoc.drawText(`${data.ma_name || ''}`,null, null, {
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
            }

            // formatter to add checkboxes to boolean columns
            $scope.onUpdate = function () {
                var flex = $scope.ggGrid;
                var arr = []
                for (var i = 0; i < flex.rows.length; i++) {
                    if (flex.getCellData(i, flex.columns.getColumn('active').index) === true) arr.push(+flex.getCellData(i, flex.columns.getColumn('wo_id').index));
                }
                $scope.wo_id = arr;
                $scope.selected = (arr.length > 0) ? true : false;
                var next_status = undefined;
                angular.forEach($scope.wo_statusoptions, function (value, key) {
                    if (value.value === $scope.fmData.wo_nextstatus) next_status = value.label;
                });
                $scope.next_status = next_status;
            };

            $scope.onSubmit = function () {
                var notyf = new Notyf({
                    duration: 5000,
                    types: [
                        {
                            type: "error",
                            duration: 5000,
                            className: "notyf-error"
                        }
                    ]
                });

                const { us_group: status_group } = $scope.wo_statusoptions.find((value) => {
                    return value.value === $scope.fmData.wo_status
                })

                const statusChangeAllowed = userProfile.us_group.includes(status_group) || userProfile.us_group.includes('admin')

                if (!statusChangeAllowed) {
                    // Display an error notification
                    notyf.error({
                        type: "error",
                        message: "Necesita privilegios adicionales para realizar esta acción."
                    });
                    return;
                }
                if ($scope.fmData.wo_nextstatus === 18) {
                    workflowFactory.updatecancellation($scope.fmData.wo_nextstatus, userProfile.username, $scope.fmData.wo_cancellationnotes, $scope.wo_id.join(',')).then(function (promise) {
                        if (promise.data.rowCount >= 1) {
                            $scope.fmData.wo_status = $scope.fmData.wo_nextstatus;
                        } else {
                            $scope.updateFail = true;
                        }
                    });
                } else {
                    workflowFactory.update($scope.fmData.wo_nextstatus, userProfile.username, $scope.wo_id.join(',')).then(function (promise) {
                        if (promise.data.rowCount >= 1) {
                            $scope.fmData.wo_status = $scope.fmData.wo_nextstatus;
                        } else {
                            $scope.updateFail = true;
                        }
                    });
                }
                $('#myModal').modal('hide');
            }
            $scope.materialsModal = () => {
                $('#materialsModal').modal('show');
                $scope.materials = new wijmo.collections.CollectionView($scope.materialsRaw);
            }

            $scope.itemFormatter = function (panel, r, c, cell) {

                // fix prevent randomn coloring
                cell.style.backgroundColor = '';
                cell.style.color = '';
                // end fix
                
                if ((panel.cellType == wijmo.grid.CellType.Cell)) {
                    var flex = panel.grid;
                    var col = flex.columns[c];
                    var row = flex.rows[r];
                    const hasAttachements = !!row.dataItem.file1 || !!row.dataItem.file2
                    if (!hasAttachements) {
                        //row.isReadOnly = true
                        //cell.style.backgroundColor = 'Gainsboro';
                        if (col.binding === 'active') {
                            cb = cell.firstChild
                            cb.setAttribute('disabled', 'disabled')
                        }
                    }
                }

                // display available files
                if ((panel.cellType == wijmo.grid.CellType.Cell)) {
                    var flex = panel.grid;
                    var col = flex.columns[c];
                    var row = flex.rows[r];
                    if (col.binding === 'files') {
                        if (row.dataItem.file1) {
                            row.dataItem.files = row.dataItem.file1
                            cell.innerHTML =
                                `<a class="link" href="/uploads/${row.dataItem.wo_id}_file1.pdf" download="${row.dataItem.file1}" target="_blank">descargar</a> | 
                            <a class="link" href="/uploads/${row.dataItem.wo_id}_file1.pdf" target="_blank">${row.dataItem.file1}</a><br/>`
                        }
                        if (row.dataItem.file2) {
                            row.dataItem.files += ` | ${row.dataItem.file2}`
                            cell.innerHTML +=
                                `<a class="link" href="/uploads/${row.dataItem.wo_id}_file2.pdf" download="${row.dataItem.file2}" target="_blank">descargar</a> | 
                            <a class="link" href="/uploads/${row.dataItem.wo_id}_file2.pdf" target="_blank">${row.dataItem.file2}</a>`
                        }
                    }
                }

                // highlight rows that have 'active' set
                if (panel.cellType == wijmo.grid.CellType.Cell) {
                    var flex = panel.grid;
                    var row = flex.rows[r];
                    if (row.dataItem.active) {
                        cell.style.backgroundColor = 'gold';
                    }
                }

                if (panel.cellType == wijmo.grid.CellType.ColumnHeader) {
                    var flex = panel.grid;
                    var col = flex.columns[c];
                    var row = flex.rows[r];

                    // check that this is a boolean column
                    if (col.dataType == wijmo.DataType.Boolean) {

                        // prevent sorting on click
                        col.allowSorting = false;

                        // count true values to initialize checkbox
                        var cnt = 0;
                        for (var i = 0; i < flex.rows.length; i++) {
                            if (flex.getCellData(i, c) === true) cnt++;
                        }

                        // create and initialize checkbox
                        cell.innerHTML = '<input type="checkbox"> ' + cell.innerHTML;
                        var cb = cell.firstChild;
                        cb.checked = cnt > 0;
                        cb.indeterminate = cnt > 0 && cnt < flex.rows.length;

                        // apply checkbox value to cells
                        cb.addEventListener('click', function (e) {
                            flex.beginUpdate();
                            for (var i = 0; i < flex.rows.length; i++) {
                                const row = flex.rows[i]
                                const hasAttachements = !!row.dataItem.file1 || !!row.dataItem.file2
                                if (hasAttachements) {
                                    flex.setCellData(i, c, cb.checked);
                                }
                            }
                            flex.endUpdate();
                        });
                    }
                }
            }

            $scope.formatItem = function (s, e, cell) {
                
                if (e.panel.cellType == wijmo.grid.CellType.RowHeader) {
                    e.cell.textContent = e.row + 1;
                }
                
                var col = s.columns[e.col];
                // add Bootstrap html
            }

            $scope.onFilterApplied = function (s, e) {
                setTimeout(function () {
                    const { items: rows } = $scope.data
                    const materials = []
                    const material_ids = []
                    rows.map(value => {
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
                    $scope.materialsRaw = materials
                }, 500);

            };

            // bind columns when grid is initialized
            $scope.initGrid = function (s, e) {
                s.rows.defaultSize = 60;
                /*
                var flex = $scope.ggGrid;
                
                flex.updatingView.addHandler(function(s,e){
                    flex.autoSizeRows(flex.viewRange.row,flex.viewRange.row2)
                });
                flex.scrollPositionChanged.addHandler(function(s,e){
                    flex.autoSizeRows(flex.viewRange.row,flex.viewRange.row2)
                });
                */
                for (var i = 0; i < $scope.columns.length; i++) {
                    var col = new wijmo.grid.Column();
                    col.binding = $scope.columns[i].binding;
                    col.dataType = $scope.columns[i].type;
                    col.isContentHtml = $scope.columns[i].html;
                    col.header = i18nFilter("workflow.labels." + $scope.columns[i].binding.replace('_', '-'));
                    col.wordWrap = false;
                    col.width = $scope.columns[i].width;
                    if (['wo_price', 'wo_currency'].includes($scope.columns[i].binding)) {
                        col.visible = authService.userHasRole(['admin', 'warehouse', 'sales'])
                    }
                    s.columns.push(col);

                }
            };

            $scope.initMaterialsGrid = function (s, e) {
                for (var i = 0; i < $scope.materialColumns.length; i++) {
                    var col = new wijmo.grid.Column();
                    col.binding = $scope.materialColumns[i].binding;
                    col.dataType = $scope.materialColumns[i].type;
                    col.isContentHtml = $scope.materialColumns[i].html;
                    col.header = i18nFilter("workflow.labels." + $scope.materialColumns[i].binding.replace('_', '-'));
                    col.wordWrap = false;
                    col.width = $scope.materialColumns[i].width;
                    s.columns.push(col);

                }
            };

            $scope.materialsItemFormatter = function (panel, r, c, cell) {

            }

            // create the tooltip object
            $scope.$watch('ggGrid', function () {
                if ($scope.ggGrid) {

                    // store reference to grid
                    var flex = $scope.ggGrid;

                    // create tooltip
                    var tip = new wijmo.Tooltip(),
                        rng = null;

                    // monitor the mouse over the grid
                    flex.hostElement.addEventListener('mousemove', function (evt) {
                        var ht = flex.hitTest(evt);
                        if (!ht.range.equals(rng)) {

                            // new cell selected, show tooltip
                            if (ht.cellType == wijmo.grid.CellType.Cell) {
                                rng = ht.range;
                                var col = flex.columns[rng.col].header;
                                var cellElement = document.elementFromPoint(evt.clientX, evt.clientY),
                                    cellBounds = wijmo.Rect.fromBoundingRect(cellElement.getBoundingClientRect()),
                                    data = wijmo.escapeHtml(flex.getCellData(rng.row, rng.col, true)),
                                    tipContent = col + ': "<b>' + data + '</b>"';
                                if (cellElement.className.indexOf('wj-cell') > -1) {
                                    if (rng.col !== 0)
                                        tip.show(flex.hostElement, tipContent, cellBounds);
                                } else {
                                    tip.hide(); // cell must be behind scroll bar...
                                }
                            }
                        }
                    });
                    flex.hostElement.addEventListener('mouseout', function () {
                        tip.hide();
                        rng = null;
                    });
                }
            });

            $scope.wo_statusoptions = [];
            $scope.wo_statusoptions = JSON.parse(JSON.stringify(i18nFilter("workflow.fields.wo_statusoptions"))) // clone array
            $scope.wo_statusoptions.map((value) => {
                value.notAnOption = false;
                /*if (userProfile.us_group.includes(value.us_group) || userProfile.us_group.includes('admin')) {
                    value.notAnOption = false;
                }*/
                return value
            })

            $scope.$on('$viewContentLoaded', function () {

                // this code is executed after the view is loaded

                $scope.$watch('fmData.wo_status', function (newValue, oldValue) {
                    $scope.loading = true;
                    $scope.actions = [];
                    const actions = JSON.parse(JSON.stringify(i18nFilter("workflow.fields.wo_statusoptions"))) // clone array
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
                    workflowFactory.getData(newValue, current_status.interval).then(function (promise) {
                        $scope.loading = false;
                        if (angular.isArray(promise.data)) {
                            // expose data as a CollectionView to get events
                            $scope.data = new wijmo.collections.CollectionView(promise.data);
                        }
                    });
                });
            });
        }];

})(angular);