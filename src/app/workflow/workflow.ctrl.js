module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'workflowFactory', '$location', 'i18nFilter', '$stateParams', '$filter', 'authService',
        function ($scope, workflowFactory, $location, i18nFilter, $stateParams, $filter, authService) {

            $scope.fmData = {};

            var userProfile = authService.profile();

            $scope.labels = Object.keys(i18nFilter("workflow.labels"));
            $scope.columns = i18nFilter("workflow.columns");

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
                workflowFactory.update($scope.fmData.wo_nextstatus, $scope.wo_id.join(',')).then(function (promise) {
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

            $scope.itemFormatter = function (panel, r, c, cell) {

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
                                                    <a href="#/wo/view/${cl_id}/${wo_id}" class="btn btn-default btn-xs">${i18nFilter("general.labels.open")}</a>
                                                </div>
                                        </div>`;
                }
            }

            // autosize columns
            $scope.itemsSourceChanged = function (sender, args) {
                //sender.autoSizeColumns();
            };

            // bind columns when grid is initialized
            $scope.initGrid = function (s, e) {
                for (var i = 0; i < $scope.columns.length; i++) {
                    var col = new wijmo.grid.Column();
                    col.binding = $scope.columns[i];
                    col.header = i18nFilter("workflow.labels." + $scope.columns[i].replace('_', '-'));
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