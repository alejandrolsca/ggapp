module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'productFac', 'i18nFilter',
        function ($scope, productFac, i18nFilter) {

            $scope.labels = Object.keys(i18nFilter("product.labels"));
            $scope.columns = i18nFilter("product.columns");

            // export to xls
            $scope.exportXLS = function () {
                const timestamp = moment().tz('America/Chihuahua').format();
                const fileName = `products_${timestamp}.xlsx`;
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
        
            //set QR Code data defaults
            $scope.qrcodeString = 'YOUR TEXT TO ENCODE';
            $scope.size = 250;
            $scope.correctionLevel = '';
            $scope.typeNumber = 0;
            $scope.inputMode = '';
            $scope.image = true;
        
            //QR Code modal
            $('#myModal').on('show.bs.modal', function (event) {
                var button = $(event.relatedTarget); // Button that triggered the modal
                $scope.qrcodeString = button.data('code_data');// Extract info from data-* attributes
                $scope.$apply();
            })
        
            // formatItem event handler
            var pr_id;
            var cl_id;
            var pr_process;
            var pr_type;
            var wo_previousid;
            var wo_action;
            var wo_actionlabel;
            var code_data;
            $scope.formatItem = function (s, e, cell) {

                if (e.panel.cellType == wijmo.grid.CellType.RowHeader) {
                    e.cell.textContent = e.row + 1;
                }

                var col = s.columns[e.col];
                // add Bootstrap html
                if ((e.panel.cellType == wijmo.grid.CellType.Cell) && (col.binding === 'actions')) {
                    pr_id = e.panel.getCellData(e.row, s.columns.getColumn('pr_id').index, false);
                    cl_id = e.panel.getCellData(e.row, s.columns.getColumn('cl_id').index, false);
                    pr_process = e.panel.getCellData(e.row, s.columns.getColumn('pr_process').index, false);
                    pr_type = e.panel.getCellData(e.row, s.columns.getColumn('pr_type').index, false);
                    wo_previousid = e.panel.getCellData(e.row, s.columns.getColumn('wo_previousid').index, false);
                    wo_action = wo_previousid === null ? `add/${cl_id}/${pr_id}`: `duplicate/${cl_id}/${wo_previousid}`;
                    wo_actionlabel = wo_previousid === null ? 'Orden (Nueva)':'Orden (Duplicar)';
                    code_data = (function () { //QR Code data from columns 
                        var text = '';
                        for (var i = 0; i < $scope.columns.length; i++) {
                            text += i18nFilter("product.labels." + $scope.columns[i].binding.replace('_','-')) + ': ' + e.panel.getCellData(e.row, (i + 1), false) + '\n'
                        }
                        return text;
                    })();
                    e.cell.style.overflow = 'visible';
                    e.cell.innerHTML = `<div class="btn-group btn-group-justified" role="group" aria-label="...">
                                            <div class="btn-group" role="group">
                                                <a href="/product/update/${pr_process}/${pr_type}/${cl_id}/${pr_id}" class="btn btn-default btn-xs">Editar</a>
                                            </div>
                                            <div class="btn-group">
                                            <button type="button" class="btn btn-default  btn-xs dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                                ${i18nFilter("general.labels.add")} <span class="caret"></span>
                                            </button>
                                            <ul class="dropdown-menu" role="menu">
                                                <li><a href="/wo/${wo_action}"><span class="glyphicon glyphicon-th-large" aria-hidden="true"></span> ${wo_actionlabel}</a></li>
                                            </ul>
                                            </div>
                                            <div class="btn-group">
                                            <button type="button" class="btn btn-default  btn-xs dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                                ${i18nFilter("general.labels.show")} <span class="caret"></span>
                                            </button>
                                            <ul class="dropdown-menu" role="menu">
                                                <li><a data-toggle="modal" data-target="#myModal" data-code_data="${code_data}"><span class="glyphicon glyphicon-list-alt" aria-hidden="true"></span> QR Code</a></li>
                                            </ul>
                                            </div>
                                        </div>`;
                }
            }
        
            // bind columns when grid is initialized
            $scope.initGrid = function (s, e) {
                s.rows.defaultSize = 60;
                for (var i = 0; i < $scope.columns.length; i++) {
                    var col = new wijmo.grid.Column();
                    col.binding = $scope.columns[i].binding;
                    col.dataType = $scope.columns[i].type;
                    col.header = i18nFilter("product.labels." + $scope.columns[i].binding.replace('_', '-'));
                    col.wordWrap = false;
                    col.width = $scope.columns[i].width;
                    col.isContentHtml = $scope.columns[i].html;
                    col.visible = $scope.columns[i].visible;
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
                productFac.data().then(function (promise) {
                    $scope.loading = false;
                    if (angular.isArray(promise.data)) {
                        $scope.data = new wijmo.collections.CollectionView(promise.data);
                    }
                });
            });
        }];

})(angular);