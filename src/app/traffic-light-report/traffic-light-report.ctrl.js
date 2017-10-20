module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'tlrFactory', '$location', 'i18nFilter', '$stateParams', '$filter', 'authService',
        function ($scope, tlrFactory, $location, i18nFilter, $stateParams, $filter, authService) {

            var userProfile = angular.fromJson(localStorage.getItem('profile')) || {};



            $scope.labels = Object.keys(i18nFilter("tlr.labels"));
            $scope.columns = i18nFilter("tlr.columns");

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
                var flex = $scope.ggGrid;
                var arr = []
                arr.push('Please review the following Work Orders' + '\r\n\r\n')
                for (var i = 0; i < flex.rows.length; i++) {
                    if (flex.getCellData(i, flex.columns.getColumn('active').index) === true) {
                        arr.push(
                            "traffic light report status: " + flex.getCellData(i, flex.columns.getColumn('status').index) + '\r\n' +
                            "wo_id: " + flex.getCellData(i, flex.columns.getColumn('wo_id').index) + '\r\n' +
                            "cl_id: " + flex.getCellData(i, flex.columns.getColumn('cl_id').index) + '\r\n' +
                            "cl_corporatename: " + flex.getCellData(i, flex.columns.getColumn('cl_corporatename').index) + '\r\n' +
                            "cl_fatherslastname: " + flex.getCellData(i, flex.columns.getColumn('cl_fatherslastname').index) + '\r\n' +
                            "cl_motherslastname: " + flex.getCellData(i, flex.columns.getColumn('cl_motherslastname').index) + '\r\n' +
                            "wo_commitmentdate: " + flex.getCellData(i, flex.columns.getColumn('wo_commitmentdate').index) + '\r\n' +
                            "wo_deliverydate: " + flex.getCellData(i, flex.columns.getColumn('wo_deliverydate').index) + '\r\n' +
                            "wo_status: " + flex.getCellData(i, flex.columns.getColumn('wo_status').index) + '\r\n' +
                            "wo_date: " + flex.getCellData(i, flex.columns.getColumn('wo_date').index) + '\r\n' +
                            "-----------------------------------------------------------" + '\r\n'
                        );
                    }
                }

                var subject = 'Work Orders Review';

                var body = encodeURIComponent(arr.join('\r\n'));

                window.location.href = 'mailto:?subject=' + subject + '&body=' + body;
                console.log(body);
            }

            $scope.itemFormatter = function (panel, r, c, cell) {

                if ((panel.cellType == wijmo.grid.CellType.Cell)) {
                    var flex = panel.grid;
                    var col = flex.columns[c];
                    var row = flex.rows[r];
                    cell.style.backgroundColor = '';
                    cell.style.color = '';
                    if (col.header === 'Status') {
                        var commitment_date = moment(panel.grid.getCellData(r, flex.columns.getColumn('wo_commitmentdate').index, false).substring(0, 10));
                        var delivery_date = panel.grid.getCellData(r, flex.columns.getColumn('wo_deliverydate').index, false);
                        var days = undefined;
                        var status = undefined;
                        //console.log(delivery_date);
                        if (delivery_date === null) {
                            days = commitment_date.diff(moment(), 'days');
                            // delayed, commitment_date is due                            
                            if (days <= 0) {
                                status = 'Delayed (' + Math.abs(days) + ')';
                                cell.style.backgroundColor = 'OrangeRed';
                                cell.style.color = 'yellow';
                            }
                            // 2 days before commitment_date is due                           
                            if (days > 0 && days < 3) {
                                status = Math.abs(days) + ' Day(s) left';
                                cell.style.backgroundColor = 'Gold';
                            }

                        } else {
                            days = commitment_date.diff(moment(delivery_date.substring(0, 10)), 'days')
                            // delivered on commitment_date
                            if (days === 0) {
                                status = 'Delivered On Time';
                                cell.style.backgroundColor = 'LimeGreen';
                                cell.style.color = 'Black';
                            }
                            // delivered after commitment_date
                            if (days < 0) {
                                status = 'Late Delivery (' + Math.abs(days) + ')';
                                cell.style.backgroundColor = 'Grey';
                                cell.style.color = 'Gainsboro';
                            }
                            // delivered before commitment_date                            
                            if (days > 0) {
                                status = 'Efficient Delivery (' + Math.abs(days) + ')';
                                cell.style.backgroundColor = 'DodgerBlue';
                                cell.style.color = 'White';
                            }
                        }
                        cell.style.overflow = 'visible';
                        row.dataItem.status = status;
                        cell.innerHTML = status;
                    }
                }



                // highlight rows that have 'active' set
                if (panel.cellType == wijmo.grid.CellType.Cell) {
                    var flex = panel.grid;
                    var row = flex.rows[r];
                    if (row.dataItem.active && col.header !== 'Status') {
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

            // autosize columns
            $scope.itemsSourceChanged = function (sender, args) {
                sender.autoSizeColumns();
            };

            // bind columns when grid is initialized
            $scope.initGrid = function (s, e) {
                for (var i = 0; i < $scope.columns.length; i++) {
                    var col = new wijmo.grid.Column();
                    col.binding = $scope.columns[i].binding;
                    col.dataType = $scope.columns[i].type;
                    col.header = i18nFilter("tlr.labels." + $scope.labels[i]);
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

            $scope.pagesizeoptions = [
                { "label": "25", "value": 25 },
                { "label": "50", "value": 50 },
                { "label": "100", "value": 100 },
                { "label": "200", "value": 200 },
                { "label": "500", "value": 500 },
                { "label": "1000", "value": 1000 },
            ]

            $scope.$on('$viewContentLoaded', function () {

                // this code is executed after the view is loaded
                $scope.loading = true;
                tlrFactory.getData().then(function (promise) {
                    $scope.loading = false;
                    if (angular.isArray(promise.data)) {
                        // expose data as a CollectionView to get events
                        $scope.data = new wijmo.collections.CollectionView(promise.data);
                        $scope.data.pageSize = 25;
                    }
                });
            });
        }];

})(angular);