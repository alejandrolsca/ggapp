module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'woFactory', '$location', 'i18nFilter', '$state', '$stateParams', '$timeout',
        function ($scope, woFactory, $location, i18nFilter, $state, $stateParams, $timeout) {

            $scope.labels = Object.keys(i18nFilter("wo.labels"));
            $scope.columns = i18nFilter("wo.columns");
            $scope.workflow = i18nFilter("tlr.fields.wo_statusoptions");

            // export to xls
            $scope.exportXLS = function () {
                const timestamp = moment().tz('America/Chihuahua').format();
                const fileName = `orders_${timestamp}.xlsx`;
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

            $scope.edit = function (id) {
                if (angular.isNumber(id)) {
                    var link = "/wo/update/" + id;
                    window.location = link;
                }
            };

            $scope.duplicate = function (id) {
                if (angular.isNumber(id)) {
                    var link = "/wo/duplicate/" + id;
                    window.location = link;
                }
            };

            // generate ShippingList
            $scope.shippingList = function () {
                var flex = $scope.ggGrid;
                var wo_id = []
                for (var i = 0; i < flex.rows.length; i++) {
                    if (flex.getCellData(i, flex.columns.getColumn('shipment').index) === true) wo_id.push(+flex.getCellData(i, flex.columns.getColumn('wo_id').index));
                }
                const selected = (wo_id.length > 0) ? true : false;
                if (selected) {
                    $state.go('shippingListAdd', {
                        cl_id: $stateParams.cl_id,
                        wo_id: wo_id.join(',')
                    })
                } else {
                    alert('Debe seleccionar por lo menos una orden.')
                }

            };

            // generate exportationInvoice
            $scope.exportationInvoice = function () {
                var flex = $scope.ggGrid;
                var wo_id = []
                for (var i = 0; i < flex.rows.length; i++) {
                    if (flex.getCellData(i, flex.columns.getColumn('invoice').index) === true) wo_id.push(+flex.getCellData(i, flex.columns.getColumn('wo_id').index));
                }
                const selected = (wo_id.length > 0) ? true : false;
                if (selected) {
                    $state.go('exportationInvoiceAdd', {
                        cl_id: $stateParams.cl_id,
                        wo_id: wo_id.join(',')
                    })
                } else {
                    alert('Debe seleccionar por lo menos una orden.')
                }

            };

            $scope.itemFormatter = function (panel, r, c, cell) {

                // fix prevent randomn coloring
                cell.style.backgroundColor = '';
                cell.style.color = '';
                // end fix

                // highlight rows that have 'invoice' set
                if (panel.cellType == wijmo.grid.CellType.Cell) {
                    var flex = panel.grid;
                    var row = flex.rows[r];
                    var col = flex.columns[c];
                    if (col.binding === 'invoice') {
                        var cb = cell.firstChild;
                        if (row.dataItem.wo_exportationinvoice === true || row.dataItem.wo_status < 13 || row.dataItem.wo_status === 18) {
                            cb.disabled = true
                        }
                        if (row.dataItem.invoice) {
                            cell.style.backgroundColor = '#CDDC39';
                        }
                    }
                    if (col.binding === 'shipment') {
                        var cb = cell.firstChild;
                        if (row.dataItem.wo_shippinglist === true || row.dataItem.wo_status < 13 || row.dataItem.wo_status === 18) {
                            cb.disabled = true
                        }
                        if (row.dataItem.shipment) {
                            cell.style.backgroundColor = '#3F51B5';
                        }
                    }
                }

                if (panel.cellType == wijmo.grid.CellType.ColumnHeader) {
                    var flex = panel.grid;
                    var col = flex.columns[c];

                    // check that this is a boolean column
                    if (col.dataType == wijmo.DataType.Boolean && col.binding === 'invoice') {

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
                                if (!flex.rows[i].dataItem.wo_exportationinvoice && ((flex.rows[i].dataItem.wo_status > 12) && (flex.rows[i].dataItem.wo_status < 18))) {
                                    flex.setCellData(i, c, cb.checked);
                                }
                            }
                            flex.endUpdate();
                        });
                    }
                    // check that this is a boolean column
                    if (col.dataType == wijmo.DataType.Boolean && col.binding === 'shipment') {

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
                                if (!flex.rows[i].dataItem.wo_shippinglist && ((flex.rows[i].dataItem.wo_status > 12) && (flex.rows[i].dataItem.wo_status < 18))) {
                                    flex.setCellData(i, c, cb.checked);
                                }
                            }
                            flex.endUpdate();
                        });
                    }
                }

                // display available files
                if ((panel.cellType == wijmo.grid.CellType.Cell)) {
                    var flex = panel.grid;
                    var col = flex.columns[c];
                    var row = flex.rows[r];
                    if (col.binding === 'file1') {
                        if (row.dataItem.file1) {
                            cell.innerHTML =
                                `<a class="link" href="/uploads/${row.dataItem.wo_id}_file1.pdf" download="${row.dataItem.file1}" target="_blank">descargar</a> | 
                            <a class="link" href="/uploads/${row.dataItem.wo_id}_file1.pdf" target="_blank">${row.dataItem.file1}</a><br/>`
                        }
                    }
                    if (col.binding === 'file2') {
                        if (row.dataItem.file2) {
                            cell.innerHTML =
                                `<a class="link" href="/uploads/${row.dataItem.wo_id}_file2.pdf" download="${row.dataItem.file2}" target="_blank">descargar</a> | 
                            <a class="link" href="/uploads/${row.dataItem.wo_id}_file2.pdf" target="_blank">${row.dataItem.file2}</a>`
                        }
                    }

                    if (col.binding === 'wo_status') {
                        angular.forEach($scope.workflow, function (value, key) {
                            if (value.value === panel.grid.getCellData(r, flex.columns.getColumn('wo_status').index)) {
                                //row.dataItem.wo_status = `(${value.value}) ${value.label}`;
                                cell.innerHTML = `(${value.value}) ${value.label}`;
                            }
                        });
                    }
                }
            }
            // formatItem event handler
            $scope.formatItem = function (s, e, cell) {

                if (e.panel.cellType == wijmo.grid.CellType.RowHeader) {
                    e.cell.textContent = e.row + 1;
                }

                s.rows.defaultSize = 30;
                var col = s.columns[e.col];

                // add Bootstrap html
                if ((e.panel.cellType == wijmo.grid.CellType.Cell) && (col.binding === 'actions')) {
                    const wo_id = e.panel.getCellData(e.row, s.columns.getColumn('wo_id').index, false);
                    e.cell.style.overflow = 'visible';
                    e.cell.innerHTML = `<div class="btn-group btn-group-justified" role="group" aria-label="...">
                                            <div class="btn-group" role="group">
                                                <a href="/wo/update/${$stateParams.cl_id}/${wo_id}" class="btn btn-default btn-xs">${i18nFilter("general.labels.edit")}</a>
                                            </div>
                                            <div class="btn-group" role="group">
                                                <a href="/wo/history/${wo_id}" class="btn btn-default btn-xs">${i18nFilter("general.labels.history")}</a>
                                            </div>
                                            <div class="btn-group" role="group">
                                                <a href="/wo/duplicate/${$stateParams.cl_id}/${wo_id}" class="btn btn-default btn-xs">${i18nFilter("general.labels.duplicate")}</a>
                                            </div>
                                       </div>`;
                }
            }

            // bind columns when grid is initialized
            $scope.initGrid = function (s, e) {
                for (var i = 0; i < $scope.columns.length; i++) {
                    var col = new wijmo.grid.Column();
                    col.binding = $scope.columns[i].binding;
                    col.dataType = $scope.columns[i].type;
                    col.isReadOnly = $scope.columns[i].isReadOnly;
                    col.filterType = $scope.columns[i].filterType;
                    col.header = i18nFilter("wo.labels." + $scope.columns[i].binding.replace('_', '-'));
                    col.wordWrap = false;
                    col.width = $scope.columns[i].width;
                    s.columns.push(col);
                }
            };


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
                setTimeout(function () {
                    s.grid.autoSizeRows()
                }, 500);

            };

            $scope.wo_dateoptions = i18nFilter("wo.fields.wo_dateoptions");
            $scope.wo_date = '1 month'

            $scope.$on('$viewContentLoaded', function () {
                // this code is executed after the view is loaded

                let currentSearch,
                    lastSearch,
                    filterTextTimeout;
                $scope.$watchGroup(['zo_zone', 'wo_release', 'pr_partno', 'wo_date'], function (newValues, oldValues, scope) {
                    let [zo_zone, wo_release, pr_partno, wo_date] = newValues
                    console.log(zo_zone, wo_release, pr_partno, wo_date)
                    zo_zone = zo_zone || ''
                    wo_release = wo_release || ''
                    pr_partno = pr_partno || ''
                    wo_date = wo_date || '1 month'

                    currentSearch = zo_zone.toLowerCase() + wo_release.toLowerCase() + pr_partno.toLowerCase() + wo_date.toLowerCase()

                    const sameSearch = (currentSearch === lastSearch)

                    if (filterTextTimeout) {
                        $scope.loading = false;
                        $timeout.cancel(filterTextTimeout);
                    }

                    if (!sameSearch) {
                        $scope.loading = true;
                        filterTextTimeout = $timeout(function () {
                            woFactory.getData(zo_zone, wo_release, pr_partno, wo_date).then(function (promise) {
                                $scope.loading = false;
                                lastSearch = zo_zone.toLowerCase() + wo_release.toLowerCase() + pr_partno.toLowerCase() + wo_date.toLowerCase()
                                if (angular.isArray(promise.data)) {
                                    // expose data as a CollectionView to get events
                                    $scope.data = new wijmo.collections.CollectionView(promise.data);
                                    /*
                                    setTimeout(() => {
                                        var flex = $scope.ggGrid;
                                        var filter = new wijmo.grid.filter.FlexGridFilter(flex);
                                        filter.defaultFilterType = wijmo.grid.filter.FilterType.None;
                                        var columns = flex.columns;
                                        angular.forEach(columns, function (value, key) {
                                            var col = flex.columns.getColumn(value.binding),
                                                cf = filter.getColumnFilter(key);
                                            cf.filterType = value.filterType;
                                        });
                                    }, 1500);*/
                                }
                            });
                        }, 1500);
                    }
                });
            });
        }];

})(angular);