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
                $scope.onUpdate()
                var img_gglogo = require('../../static/img/gg-logo.png');
                const { data: orders } = await workflowFactory.getWoPrint($scope.wo_id.join(','))
                console.log(orders)
                let pdfDoc = null
                const pdfTemplate = (pdfDoc, data) => {
                    console.log('width', pdfDoc.width + 72, 'height', pdfDoc.height + 72) // plus 72 points
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
                console.log($scope.wo_id.join(','))
                workflowFactory.update($scope.fmData.wo_nextstatus, userProfile.username, $scope.wo_id.join(',')).then(function (promise) {
                    console.log(promise.data)
                    if (promise.data.rowCount >= 1) {
                        $scope.fmData.wo_status = $scope.fmData.wo_nextstatus;
                    } else {
                        $scope.updateFail = true;
                    }
                });
                $('#myModal').modal('hide');
                console.log('submited')
            }
            $scope.materialsModal = () => {
                $('#materialsModal').modal('show');
                $scope.materials = new wijmo.collections.CollectionView($scope.materialsRaw);
            }

            $scope.itemFormatter = function (panel, r, c, cell) {

                // localize timezone America/Chihuahua
                if ((panel.cellType == wijmo.grid.CellType.Cell)) {
                    var flex = panel.grid;
                    var col = flex.columns[c];
                    var row = flex.rows[r];
                    if (col.binding === 'wo_updated') {
                        if (row.dataItem.wo_updated) {
                            row.dataItem.wo_updated = moment(row.dataItem.wo_updated).tz('America/Chihuahua').format();
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
                            cell.innerHTML = 
                            `<a class="link" href="/uploads/${row.dataItem.wo_id}_file1.pdf" download="${row.dataItem.file1}" target="_blank">descargar</a> | 
                            <a class="link" href="/uploads/${row.dataItem.wo_id}_file1.pdf" target="_blank">${row.dataItem.file1}</a><br/>`
                        }
                        if (row.dataItem.file2) {
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

                    // check that this is a boolean column
                    if (col.dataType == wijmo.DataType.Boolean) {

                        // prevent sorting on click
                        col.allowSorting = false;

                        // count true values to initialize checkbox
                        var cnt = 0;
                        for (var i = 0; i < flex.rows.length; i++) {
                            if (flex.getCellData(i, c) == true) cnt++;
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
                                flex.setCellData(i, c, cb.checked);
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

                s.rows.defaultSize = 30;
                var col = s.columns[e.col];
                // add Bootstrap html
                if ((e.panel.cellType == wijmo.grid.CellType.Cell) && (col.binding === 'actions')) {
                    const cl_id = e.panel.getCellData(e.row, s.columns.getColumn('cl_id').index, false);
                    const wo_id = e.panel.getCellData(e.row, s.columns.getColumn('wo_id').index, false);
                    e.cell.style.overflow = 'visible';
                    e.cell.innerHTML = `<div class="btn-group btn-group-justified" role="group" aria-label="...">
                                                <div class="btn-group" role="group">
                                                    <a href="#/wo/view/${cl_id}/${wo_id}" target="_blank" class="btn btn-default btn-xs">${i18nFilter("general.labels.open")}</a>
                                                </div>
                                        </div>`;
                }
            }

            // autoSizeRows on load
            $scope.itemsSourceChanged = function (sender, args) {
                //sender.autoSizeColumns();
                sender.autoSizeRows()
            };

            // autoSizeRows on sorted column
            $scope.onSortedColumn = function (sender, args) {
                console.log(sender)
                sender.autoSizeRows()
            };

            // autoSizeRows after filter applied
            $scope.onFilterApplied = function (s, e) {
                setTimeout(function() {
                const {items: rows } = $scope.data
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
                                    //console.log(elem)
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
                                //console.log(elem)
                                return elem.mt_id === value.pr_jsonb.mt_id
                            })
                            materials[material_index].pr_materialqty += Number(value.wo_materialqty)
                        } 

                    }
                })
                $scope.materialsRaw = materials
                s.grid.autoSizeRows()
                }, 500);
                
            };

            // bind columns when grid is initialized
            $scope.initGrid = function (s, e) {
                for (var i = 0; i < $scope.columns.length; i++) {
                    var col = new wijmo.grid.Column();
                    col.binding = $scope.columns[i].binding;
                    col.dataType = $scope.columns[i].type;
                    col.isContentHtml = $scope.columns[i].html;
                    col.header = i18nFilter("workflow.labels." + $scope.columns[i].binding.replace('_', '-'));
                    col.wordWrap = false;
                    col.width = $scope.columns[i].width;
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
                value.notAnOption = true;
                if (value.us_group === userProfile.us_group || userProfile.us_group === 'admin') {
                    value.notAnOption = false;
                }
                return value
            })

            $scope.$on('$viewContentLoaded', function () {

                // this code is executed after the view is loaded

                $scope.$watch('fmData.wo_status', function (newValue, oldValue) {
                    $scope.loading = true;
                    $scope.actions = [];
                    const actions = JSON.parse(JSON.stringify(i18nFilter("workflow.fields.wo_statusoptions"))) // clone array
                    actions.map((value) => {
                        if (value.wo_prevstatus.includes(newValue)) {
                            value.notAnOption = false;
                            if ((value.value == 18) && (userProfile.us_group !== 'admin')) {
                                value.notAnOption = true;
                            }
                            $scope.actions.push(value)
                        }
                    })
                    workflowFactory.getData(newValue).then(function (promise) {
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