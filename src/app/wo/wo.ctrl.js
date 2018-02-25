module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'woFactory', '$location', 'i18nFilter', '$stateParams',
        function ($scope, woFactory, $location, i18nFilter, $stateParams) {
            
            $scope.labels = Object.keys(i18nFilter("wo.labels"));
            $scope.columns = i18nFilter("wo.columns");

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
                    var link = "#/wo/update/" + id;
                    window.location = link;
                }
            };

            $scope.duplicate = function (id) {
                if (angular.isNumber(id)) {
                    var link = "#/wo/duplicate/" + id;
                    window.location = link;
                }
            };
            $scope.itemFormatter = function (panel, r, c, cell) {
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
            }
            // formatItem event handler
            $scope.formatItem = function (s, e, cell) {

                if (e.panel.cellType == wijmo.grid.CellType.RowHeader) {
                    e.cell.textContent = e.row + 1;
                }

                s.rows.defaultSize = 30;
            
                // add Bootstrap html
                if ((e.panel.cellType == wijmo.grid.CellType.Cell) && (e.col == 0)) {
                    const wo_id = e.panel.getCellData(e.row, s.columns.getColumn('wo_id').index, false);
                    e.cell.style.overflow = 'visible';
                    e.cell.innerHTML = `<div class="btn-group btn-group-justified" role="group" aria-label="...">
                                            <div class="btn-group" role="group">
                                                <a href="#/wo/update/${$stateParams.cl_id}/${wo_id}" class="btn btn-default btn-xs">${i18nFilter("general.labels.edit")}</a>
                                            </div>
                                            <div class="btn-group" role="group">
                                                <a href="#/wo/history/${wo_id}" class="btn btn-default btn-xs">${i18nFilter("general.labels.history")}</a>
                                            </div>
                                            <div class="btn-group" role="group">
                                                <a href="#/wo/duplicate/${$stateParams.cl_id}/${wo_id}" class="btn btn-default btn-xs">${i18nFilter("general.labels.duplicate")}</a>
                                            </div>
                                       </div>`;
                }
            }
        
            // bind columns when grid is initialized
            $scope.initGrid = function (s, e) {
                for (var i = 0; i < $scope.columns.length; i++) {
                    var col = new wijmo.grid.Column();
                    col.binding = $scope.columns[i];
                    col.header = i18nFilter("wo.labels." + $scope.columns[i].replace('_','-'));
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
                setTimeout(function() {
                s.grid.autoSizeRows()
                }, 500);
                
            };

            $scope.$on('$viewContentLoaded', function () {
                // this code is executed after the view is loaded

                $scope.loading = true;

                woFactory.getData().then(function (promise) {

                    $scope.loading = false;

                    if (angular.isArray(promise.data)) {
                                            
                        // expose data as a CollectionView to get events
                        $scope.data = new wijmo.collections.CollectionView(promise.data);

                    }
                });
            });
        }];

})(angular);