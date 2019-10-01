module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'woHistoryFactory', '$location', 'i18nFilter', '$stateParams',
        function ($scope, woHistoryFactory, $location, i18nFilter, $stateParams) {

            $scope.labels = Object.keys(i18nFilter("wo-history.labels"));
            $scope.columns = i18nFilter("wo-history.columns");
            $scope.workflow = i18nFilter("tlr.fields.wo_statusoptions");
            $scope.wo_id = $stateParams.wo_id

            // export to xls
            $scope.exportXLS = function () {
                const timestamp = moment().tz('America/Chihuahua').format();
                const fileName = `order${$stateParams.wo_id}history_${timestamp}.xlsx`;
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

            $scope.itemFormatter = function (panel, r, c, cell) {

                if ((panel.cellType == wijmo.grid.CellType.Cell)) {
                    var flex = panel.grid;
                    var col = flex.columns[c];
                    var row = flex.rows[r];
                    if (col.binding === 'old_status') {
                        angular.forEach($scope.workflow, function (value, key) {
                            if (value.value === panel.grid.getCellData(r, flex.columns.getColumn('old_status').index)) {
                                row.dataItem.old_status = `(${value.value}) ${value.label}`;
                                cell.innerHTML = `(${value.value}) ${value.label}`;
                            }
                        });
                    }
                    if (col.binding === 'new_status') {
                        angular.forEach($scope.workflow, function (value, key) {
                            if (value.value === panel.grid.getCellData(r, flex.columns.getColumn('new_status').index)) {
                                row.dataItem.new_status = `(${value.value}) ${value.label}`;
                                cell.innerHTML = `(${value.value}) ${value.label}`;
                            }
                        });
                    }
                }

            }

            // autoSizeRows on load
            $scope.itemsSourceChanged = function (sender, args) {
                //sender.autoSizeColumns();
                sender.autoSizeRows()
            };

            // autoSizeRows on sorted column
            $scope.onSortedColumn = function (sender, args) {
                sender.autoSizeRows()
            };

            // autoSizeRows after filter applied
            $scope.onFilterApplied = function (s, e) {
                setTimeout(function () {
                    s.grid.autoSizeRows()
                }, 500);

            };

            // bind columns when grid is initialized
            $scope.initGrid = function (s, e) {
                for (var i = 0; i < $scope.columns.length; i++) {
                    var col = new wijmo.grid.Column();
                    col.header = i18nFilter("wo-history.labels." + $scope.columns[i].binding.replace('_', '-'));
                    col.binding = $scope.columns[i].binding;
                    col.dataType = $scope.columns[i].type;
                    col.width = $scope.columns[i].width;
                    col.isContentHtml = $scope.columns[i].html;
                    col.wordWrap = $scope.columns[i].wordWrap;
                    col.align = 'left';
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

            $scope.$on('$viewContentLoaded', function () {
                // this code is executed after the view is loaded

                $scope.loading = true;

                woHistoryFactory.getData().then(function (promise) {

                    $scope.loading = false;

                    if (angular.isArray(promise.data)) {

                        // expose data as a CollectionView to get events
                        $scope.data = new wijmo.collections.CollectionView(promise.data);

                    }
                });
            });
        }];

})(angular);