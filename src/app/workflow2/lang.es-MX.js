const datefilterParams = {
    inRangeInclusive: true,
    includeBlanksInEquals: false,
    includeBlanksInLessThan: false,
    includeBlanksInGreaterThan: false,
    comparator: function (filterLocalDateAtMidnight, cellValue) {
        let dateAsString = cellValue || ''
        
        dateAsString = dateAsString.slice(0,10);

        if (!moment(dateAsString,"YYYY-MM-DD").isValid()) return -1;
        
        const dateParts = dateAsString.split("-");
        
        const cellDate = new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2]));

        if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
            return 0;
        }

        if (cellDate < filterLocalDateAtMidnight) {
            return -1;
        }

        if (cellDate > filterLocalDateAtMidnight) {
            return 1;
        }
    }
}
module.exports = {
    "title": "Flujo de Trabajo",
    "defaultColDef": {
        sortable: true,
        resizable: true,
        filterParams: {
            clearButton: true,
            applyButton: false,
            debounceMs: 200
        }
    },
    "defaultGridDef": {
        enableRangeSelection: true,
        floatingFilter: true,
        rowSelection: 'multiple'
    },
    "sideBar": {
        toolPanels: ['columns', 'filters']
    },
    "statusBar": {
        statusPanels: [
            { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left' },
            { statusPanel: 'agSelectedRowCountComponent', align: 'right' }
        ]
    },
    "mainColumnDefs": [
        { headerName: "No. orden", field: "wo_id", width: 100, filter: 'agSetColumnFilter' },
        { headerName: "Tipo", field: "wo_type", width: 100, filter: 'agSetColumnFilter' },
        { headerName: "Proceso", field: "pr_process", width: 100, filter: 'agSetColumnFilter' },
        { headerName: "Fecha compromiso", field: "wo_commitmentdate", filter: 'agDateColumnFilter', filterParams: datefilterParams },
        { headerName: "cliente", field: "cl_id", width: 100, filter: 'agSetColumnFilter' },
        { headerName: "Razón social", field: "cl_corporatename", width: 200, filter: 'agSetColumnFilter' },
        { headerName: "Zona", field: "zo_zone", width: 200, filter: 'agSetColumnFilter' },
        { headerName: "Codigo de Producto", field: "pr_code", width: 200, filter: 'agTextColumnFilter' },
        { headerName: "Producto", field: "pr_name", width: 200, filter: 'agSetColumnFilter' },
        { headerName: "Maquina", field: "ma_name", width: 200, filter: 'agSetColumnFilter' },
        { headerName: "Material", field: "pr_material", width: 200, filter: 'agSetColumnFilter', cellRenderer: (params) => params.data.pr_material, autoHeight: true },
        { headerName: "No. Tintas frente", field: "inkfront", width: 200, filter: false, cellRenderer: (params) => params.data.inkfront },
        { headerName: "Tintas frente", field: "inksfront", width: 200, filter: 'agTextColumnFilter', cellRenderer: (params) => params.data.inksfront },
        { headerName: "No. Tintas reverso", field: "inkback", width: 200, filter: false, cellRenderer: (params) => params.data.inkback },
        { headerName: "Tintas reverso", field: "inksback", width: 200, filter: 'agTextColumnFilter', cellRenderer: (params) => params.data.inksback },
        { headerName: "Release", field: "wo_release", width: 200, filter: 'agTextColumnFilter' },
        { headerName: "Orden de compra", field: "wo_po", width: 200, filter: 'agTextColumnFilter' },
        { headerName: "Cantidad", field: "wo_qty", width: 200, filter: false },
        { headerName: "Cantidad x paquete", field: "wo_packageqty", width: 200, filter: false },
        { headerName: "Cantidad x caja", field: "wo_boxqty", width: 200, filter: false },
        { headerName: "Folios x formato", field: "wo_foliosperformat", width: 200, filter: false },
        { headerName: "Serie", field: "wo_foliosseries", width: 200, filter: false },
        { headerName: "Del", field: "wo_foliosfrom", width: 200, filter: false },
        { headerName: "Al", field: "wo_foliosto", width: 200, filter: false },
        { headerName: "Precio", field: "wo_price", width: 200, filter: 'agTextColumnFilter' },
        { headerName: "Moneda", field: "wo_currency", width: 200, filter: 'agSetColumnFilter' },
        { headerName: "Notas", field: "wo_notes", width: 200, filter: 'agTextColumnFilter' },
        { headerName: "Notas Cancelación", field: "wo_cancellationnotes", width: 200, filter: 'agTextColumnFilter' },
        { headerName: "ID anterior", field: "wo_previousid", width: 200, filter: 'agTextColumnFilter' },
        { headerName: "Fecha anterior", field: "wo_previousdate", width: 200, filter: 'agDateColumnFilter', filterParams: datefilterParams },
        { headerName: "Actualizado por", field: "wo_updatedby", width: 200, filter: 'agSetColumnFilter' },
        { headerName: "Ult. Actualización", field: "wo_lastupdated", width: 200, filter: 'agDateColumnFilter', filterParams: datefilterParams },
        { headerName: "Creado por", field: "wo_createdby", width: 200, filter: 'agSetColumnFilter' },
        { headerName: "Fecha", field: "wo_date", width: 200, filter: 'agDateColumnFilter', filterParams: datefilterParams }
    ],
    "materialColumnDefs": [
        { headerName: "ID Material", field: "mt_id", width: 176, filter: 'agTextColumnFilter', type: "numericColumn" },
        { headerName: "Material", field: "pr_material", width: 484, filter: 'agSetColumnFilter' },
        { headerName: "Cantidad", field: "pr_materialqty", width: 176, filter: 'agNumberColumnFilter', type: "numericColumn" }
    ],
    "fields": {
        wo_statusoptions: [
            { "label": "Activo", "value": 0, "desc": "Orden Activa", "us_group": "production_planner", "wo_prevstatus": [], "interval": "1 year" },
            { "label": "En espera de material", "value": 1, "desc": "No hay material en el almacén", "us_group": "warehouse", "wo_prevstatus": [0, 4, 6, 9, 16], "interval": "1 year" },
            { "label": "Material disponible", "value": 2, "desc": "Hay material en el almacén pero aun no se ha iniciado el trabajo", "us_group": "production", "wo_prevstatus": [1], "interval": "1 year" },
            { "label": "En producción", "value": 3, "desc": "En producción", "us_group": "production", "wo_prevstatus": [2, 4], "interval": "1 year" },
            { "label": "Detenido en Producción", "value": 4, "desc": "La orden se detuvo en producción", "us_group": "production", "wo_prevstatus": [3], "interval": "1 year" },
            { "label": "Acabados", "value": 5, "desc": "Procesando Acabados", "us_group": "finishing", "wo_prevstatus": [3, 6, 7], "interval": "1 year" },
            { "label": "Detenido en Acabados", "value": 6, "desc": "La orden se detuvo en producción", "us_group": "finishing", "wo_prevstatus": [5], "interval": "1 year" },
            { "label": "Terminado", "value": 7, "desc": "Terminado en producción", "us_group": "quality_assurance", "wo_prevstatus": [3, 5], "interval": "1 year" },
            { "label": "Departamento de calidad", "value": 8, "desc": "Inspeccion de calidad en proceso", "us_group": "quality_assurance", "wo_prevstatus": [1, 7], "interval": "1 year" },
            { "label": "Rechazado por calidad", "value": 9, "desc": "Rechazado por calidad", "us_group": "warehouse", "wo_prevstatus": [8], "interval": "1 year" },
            { "label": "Aprobado por calidad", "value": 10, "desc": "Aprobado por calidad", "us_group": "packaging", "wo_prevstatus": [8], "interval": "1 year" },
            { "label": "Empaque e Inspección Final", "value": 11, "desc": "En proceso de empaque e inspección Final", "us_group": "packaging", "wo_prevstatus": [10], "interval": "1 year" },
            { "label": "Producto terminado", "value": 12, "desc": "Producto terminado", "us_group": "packaging", "wo_prevstatus": [11], "interval": "1 year" },
            { "label": "Facturación/Lista de Embarque", "value": 13, "desc": "Facturado", "us_group": "warehouse", "wo_prevstatus": [12], "interval": "1 year" },
            { "label": "Enviado", "value": 14, "desc": "Los articulos fueron enviados", "us_group": "warehouse", "wo_prevstatus": [13], "interval": "1 year" },
            { "label": "No se pudo entregar", "value": 15, "desc": "El producto no se pudo entregar", "us_group": "warehouse", "wo_prevstatus": [14], "interval": "1 year" },
            { "label": "Rechazado por el cliente", "value": 16, "desc": "El producto fue rechazado por el cliente", "us_group": "warehouse", "wo_prevstatus": [14, 15], "interval": "1 year" },
            { "label": "Entregado", "value": 17, "desc": "El producto se entrego al cliente con éxito", "us_group": "warehouse", "wo_prevstatus": [14, 15], "interval": "6 week" },
            { "label": "Cancelada", "value": 18, "desc": "La orden de trabajo fue cancelada", "us_group": "admin", "wo_prevstatus": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], "interval": "1 year" }
        ]
    }
}