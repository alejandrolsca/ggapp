module.exports = (function(angular){
    'use strict';
    
    return ['$scope', 'cardinalArtFac', 'i18nFilter',
    function ($scope, cardinalArtFac, i18nFilter) {
    
        $scope.labels = Object.keys(i18nFilter("cardinal-art.labels"));
        $scope.columns = i18nFilter("cardinal-art.columns");

        // export to xls
        $scope.exportXLS = function () {
            const timestamp = moment().tz('America/Chihuahua').format();
            const fileName = `cardinal-arts_${timestamp}.xlsx`;
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
                    cell.style.backgroundColor = 'Gainsboro';
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

        $scope.onFilterApplied = function (sender, args) {
            setTimeout(function () {
                sender.grid.autoSizeRows()
            }, 0);
        };
        
        // bind columns when grid is initialized
        $scope.initGrid = function(s, e) {
            for (var i = 0; i < $scope.columns.length; i++) {
                var col = new wijmo.grid.Column();
                col.binding = $scope.columns[i].binding;
                col.dataType = $scope.columns[i].type;
                col.isContentHtml = $scope.columns[i].html;
                col.header = i18nFilter("cardinal-art.labels." + $scope.columns[i].binding.replace('_', '-'));
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

        $scope.$on('$viewContentLoaded', function () {
            // this code is executed after the view is loaded
            $scope.loading = true;
            cardinalArtFac.data().then(function(promise){
                $scope.loading = false;
                if(angular.isArray(promise.data)) {
                    $scope.data = new wijmo.collections.CollectionView(promise.data);
                }
            });
         });
    }];
    
})(angular);