module.exports = {
    "title": "Flujo de Trabajo",
    "labels": {
        "wo-id": "No. orden",
        "cl-id": "cliente",
        "cl-corporatename": "Razón social",
        "cl-firstsurname": "1er apellido",
        "cl-secondsurname": "2do apellido",
        "zo-id": "ID zona",
        "zo-zone": "Zona",
        "wo-orderedby": "Ordenado por",
        "wo-attention": "Atención",
        "ma-id": "Maquina",
        "wo-release": "Release",
        "wo-po": "Orden de compra",
        "wo-line": "Linea",
        "wo-linetotal": "De",
        "pr-id": "ID Producto",
        "pr-code": "Codigo de Producto",
        "pr-process": "Proceso",
        "pr-name": "Producto",
        "ma-name": "Maquina",
        "mt-id": "ID Material",
        "pr-material": "Material",
        "pr-materialqty": "Cantidad",
        "inkfront": "No. Tintas frente",
        "inksfront": "Tintas frente",
        "inkback": "No. Tintas reverso",
        "inksback": "Tintas reverso",
        "wo-qty": "Cantidad",
        "wo-packageqty": "Cantidad x paquete",
        "wo-boxqty": "Cantidad x caja",
        "wo-excedentqty": "Excedente",
        "wo-foliosperformat": "Folios x formato",
        "wo-foliosseries": "Serie",
        "wo-foliosfrom": "Del",
        "wo-foliosto": "Al",
        "wo-type": "Tipo",
        "wo-commitmentdate": "Fecha compromiso",
        "wo-previousid": "ID anterior",
        "wo-previousdate": "Fecha anterior",
        "wo-notes": "Notas",
        "wo-price": "Precio",
        "wo-currency": "Moneda",
        "wo-email": "Enviar Correo",
        "wo-status": "Estatus",
        "wo-updatedby": "Actualizado por",
        "wo-updated": "Fecha de Actualización",
        "wo-createdby": "Creado por",
        "wo-date": "Fecha"
    },
    "columns": [
        { "binding": "wo_type", "type": "String", "width": 100, "html": false },
        { "binding": "pr_process", "type": "String", "width": 100, "html": false },
        { "binding": "wo_id", "type": "Number", "width": 100, "html": false },
        { "binding": "wo_commitmentdate", "type": "Date", "width": 150, "html": false },
        { "binding": "cl_id", "type": "Number", "width": 100, "html": false },
        { "binding": "cl_corporatename", "type": "String", "width": 200, "html": false },
        { "binding": "zo_zone", "type": "String", "width": 200, "html": false },
        { "binding": "pr_code", "type": "String", "width": 200, "html": false },
        { "binding": "pr_name", "type": "String", "width": 200, "html": false },
        { "binding": "ma_name", "type": "String", "width": 200, "html": false },
        { "binding": "pr_material", "type": "String", "width": 400, "html": true },
        { "binding": "inkfront", "type": "String", "width": 200, "html": true },
        { "binding": "inksfront", "type": "String", "width": 300, "html": true },
        { "binding": "inkback", "type": "String", "width": 200, "html": true },
        { "binding": "inksback", "type": "String", "width": 300, "html": true },
        { "binding": "wo_po", "type": "String", "width": 100, "html": false },
        { "binding": "wo_qty", "type": "Number", "width": 100, "html": false },
        { "binding": "wo_packageqty", "type": "Number", "width": 100, "html": false },
        { "binding": "wo_boxqty", "type": "Number", "width": 100, "html": false },
        { "binding": "wo_foliosperformat", "type": "Number", "width": 100, "html": false },
        { "binding": "wo_foliosseries", "type": "String", "width": 100, "html": false },
        { "binding": "wo_foliosfrom", "type": "Number", "width": 100, "html": false },
        { "binding": "wo_foliosto", "type": "Number", "width": 100, "html": false },
        { "binding": "wo_notes", "type": "String", "width": 100, "html": false },
        { "binding": "wo_previousid", "type": "Number", "width": 100, "html": false },
        { "binding": "wo_previousdate", "type": "Date", "width": 150, "html": false },
        { "binding": "wo_status", "type": "Number", "width": 100, "html": false },
        { "binding": "wo_updatedby", "type": "String", "width": 100, "html": false },
        { "binding": "wo_updated", "type": "Date", "width": 150, "html": false },
        { "binding": "wo_createdby", "type": "String", "width": 100, "html": false },
        { "binding": "wo_date", "type": "Date", "width": 150, "html": false }
    ],
    "materialColumns": [
        { "binding": "mt_id", "type": "Number", "width": 80, "html": false },
        { "binding": "pr_material", "type": "String", "width": 500, "html": false },
        { "binding": "pr_materialqty", "type": "Date", "width": 150, "html": false }
    ],
    "fields": {
        wo_statusoptions: [
            { "label": "Activo", "value": 0, "desc": "Orden Activa", "us_group": "sales", "wo_prevstatus": [], "interval": "1 year" },
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
            { "label": "Empaque", "value": 11, "desc": "En proceso de empaque", "us_group": "packaging", "wo_prevstatus": [10], "interval": "1 year" },
            { "label": "Inspección Final", "value": 12, "desc": "Listo para embarque", "us_group": "quality_assurance", "wo_prevstatus": [11], "interval": "1 year" },
            { "label": "Facturación/Lista de Embarque", "value": 13, "desc": "Facturado", "us_group": "warehouse", "wo_prevstatus": [12], "interval": "1 year" },
            { "label": "Enviado", "value": 14, "desc": "Los articulos fueron enviados", "us_group": "warehouse", "wo_prevstatus": [13], "interval": "1 year" },
            { "label": "No se pudo entregar", "value": 15, "desc": "El producto no se pudo entregar", "us_group": "warehouse", "wo_prevstatus": [14], "interval": "1 year" },
            { "label": "Rechazado por el cliente", "value": 16, "desc": "El producto fue rechazado por el cliente", "us_group": "warehouse", "wo_prevstatus": [14, 15], "interval": "1 year" },
            { "label": "Entregado", "value": 17, "desc": "El producto se entrego al cliente con éxito", "us_group": "warehouse", "wo_prevstatus": [14, 15], "interval": "6 week" },
            { "label": "Cancelada", "value": 18, "desc": "La orden de trabajo fue cancelada", "us_group": "admin", "wo_prevstatus": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], "interval": "1 year" }
        ]
    }
}