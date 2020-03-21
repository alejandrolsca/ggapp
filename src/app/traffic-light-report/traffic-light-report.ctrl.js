module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'tlrFactory', '$location', 'i18nFilter', '$stateParams', '$filter', 'authService',
        function ($scope, tlrFactory, $location, i18nFilter, $stateParams, $filter, authService) {

            $scope.labels = Object.keys(i18nFilter("tlr.labels"));
            $scope.columns = i18nFilter("tlr.columns");
            $scope.workflow = i18nFilter("tlr.fields.wo_statusoptions");

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

            $scope.exportXLS = function () {
                const timestamp = moment().tz('America/Chihuahua').format();
                const fileName = `tlr_clientid_${$stateParams.cl_id}_${timestamp}.xlsx`;
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

            $scope.itemFormatter = function (panel, r, c, cell) {

                if ((panel.cellType == wijmo.grid.CellType.Cell)) {
                    var flex = panel.grid;
                    var col = flex.columns[c];
                    var row = flex.rows[r];
                    // fix prevent randomn coloring
                    cell.style.backgroundColor = '';
                    cell.style.color = '';
                    // end fix

                    if (col.binding === 'delivery_status') {
                        // delayed, commitment_date is due                            
                        if (row.dataItem.delivery_status === 'Retrasado') {
                            cell.style.backgroundColor = 'OrangeRed';
                            cell.style.color = 'yellow';
                        }
                        // 2 days before commitment_date is due                           
                        if (row.dataItem.delivery_status === 'Por vencer') {
                            cell.style.backgroundColor = 'Gold';
                        }
                        // mora than 2 days before commitment_date is due                           
                        if (row.dataItem.delivery_status === 'Normal') {
                            cell.style.backgroundColor = 'White';
                        }
                        cell.style.overflow = 'visible';
                    }
                }

                // highlight rows that have 'active' set
                if (panel.cellType == wijmo.grid.CellType.Cell) {
                    var flex = panel.grid;
                    var row = flex.rows[r];
                    if (row.dataItem.active && col.header !== 'Estatus') {
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

            // bind columns when grid is initialized
            $scope.initGrid = function (s, e) {
                for (var i = 0; i < $scope.columns.length; i++) {
                    var col = new wijmo.grid.Column();
                    col.binding = $scope.columns[i].binding;
                    col.dataType = $scope.columns[i].type;
                    col.header = i18nFilter("tlr.labels." + $scope.columns[i].binding.replace('_', '-'));
                    col.wordWrap = $scope.columns[i].wordWrap;
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

            $scope.$on('$viewContentLoaded', function () {

                // this code is executed after the view is loaded
                $scope.loading = true;
                tlrFactory.getData().then(function (promise) {
                    $scope.loading = false;
                    if (angular.isArray(promise.data)) {
                        // expose data as a CollectionView to get events
                        $scope.data = new wijmo.collections.CollectionView(promise.data);
                    }
                });
            });
        }];

})(angular);