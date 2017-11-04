module.exports = {
    "title": "Reporte Semaforo",
    "labels": {
        "wo-id": "No. orden",
        "cl-id": "cliente",
        "cl-corporatename": "Razón social",
        "cl-name": "Nombre(s)",
        "cl-firstsurname": "1er apellido",
        "cl-secondsurname": "2do apellido",
        "cl-type": "Tipo de Cliente",
        "zo-id": "zona",
        "wo-orderedby": "Ordenado por",
        "wo-attention": "Atención",
        "ma-id": "Maquina",
        "wo-release": "Release",
        "wo-po": "Orden de compra",
        "wo-line": "Linea",
        "wo-linetotal": "De",
        "pr-id": "Producto",
        "wo-qty": "Cantidad",
        "wo-packageqty": "Cantidad x paquete",
        "wo-excedentqty": "Excedente",
        "wo-foliosperformat": "Folios x formato",
        "wo-foliosseries": "Serie",
        "wo-foliosfrom": "Del",
        "wo-foliosto": "Al",
        "wo-type": "Tipo",
        "wo-commitmentdate": "Fecha compromiso",
        "wo-deliverydate": "Fecha de entrega",
        "wo-previousid": "ID anterior",
        "wo-previousdate": "Fecha anterior",
        "wo-notes": "Notas",
        "wo-price": "Precio",
        "wo-currency": "Moneda",
        "wo-email": "Enviar Correo",
        "wo-status": "Estatus del proceso",
        "wo-date": "Fecha"
    },
    "columns": [
        { "binding": "wo_status", "type": "String" },    
        { "binding": "wo_id", "type": "Number" },
        { "binding": "cl_corporatename", "type": "String" },
        { "binding": "pr_id", "type": "Number" },
        { "binding": "wo_qty", "type": "Number" },
        { "binding": "wo_commitmentdate", "type": "Date" },
        { "binding": "wo_deliverydate", "type": "Date" },    
        { "binding": "cl_id", "type": "Number" },
        { "binding": "cl_name", "type": "String" },
        { "binding": "cl_firstsurname", "type": "String" },
        { "binding": "cl_secondsurname", "type": "String" },
        { "binding": "cl_type", "type": "String" },
        { "binding": "zo_id", "type": "Number" },
        { "binding": "wo_orderedby", "type": "String" },
        { "binding": "wo_attention", "type": "String" },
        { "binding": "ma_id", "type": "Number" },
        { "binding": "wo_release", "type": "String" },
        { "binding": "wo_po", "type": "String" },
        { "binding": "wo_line", "type": "Number" },
        { "binding": "wo_linetotal", "type": "Number" },   
        { "binding": "wo_packageqty", "type": "Number" },
        { "binding": "wo_excedentqty", "type": "Number" },
        { "binding": "wo_foliosperformat", "type": "Number" },
        { "binding": "wo_foliosseries", "type": "String" },
        { "binding": "wo_foliosfrom", "type": "Number" },
        { "binding": "wo_foliosto", "type": "Number" },
        { "binding": "wo_type", "type": "String" },
        { "binding": "wo_previousid", "type": "Number" },
        { "binding": "wo_previousdate", "type": "Date" },
        { "binding": "wo_notes", "type": "String" },
        { "binding": "wo_price", "type": "Number" },
        { "binding": "wo_currency", "type": "String" },
        { "binding": "wo_email", "type": "String" },
        { "binding": "wo_date", "type": "Date" }
    ],
    "fields": {
        wo_statusoptions: [
            { "label": "Activo", "value": 0, "desc": "Orden Activa", "us_group": "sales", "wo_prevstatus": [] },
            { "label": "En espera de material", "value": 1, "desc": "No hay material en el almacén", "us_group": "warehouse", "wo_prevstatus": [0, 4, 6, 9, 16] },
            { "label": "Material disponible", "value": 2, "desc": "Hay material en el almacén pero aun no se ha iniciado el trabajo", "us_group": "warehouse", "wo_prevstatus": [0, 1] },
            { "label": "En producción", "value": 3, "desc": "En producción", "us_group": "production", "wo_prevstatus": [2,4] },
            { "label": "Detenido en Producción", "value": 4, "desc": "La orden se detuvo en producción", "us_group": "production", "wo_prevstatus": [3] },
            { "label": "Acabados", "value": 5, "desc": "Procesando Acabados", "us_group": "production", "wo_prevstatus": [3, 6] },
            { "label": "Detenido en Acabados", "value": 6, "desc": "La orden se detuvo en producción", "us_group": "production", "wo_prevstatus": [5] },
            { "label": "Terminado", "value": 7, "desc": "Terminado en producción", "us_group": "production", "wo_prevstatus": [5] },
            { "label": "Departamento de calidad", "value": 8, "desc": "Inspeccion de calidad en proceso", "us_group": "quality_assurance", "wo_prevstatus": [7] },
            { "label": "Rechazado por calidad", "value": 9, "desc": "Rechazado por calidad", "us_group": "quality_assurance", "wo_prevstatus": [8] },
            { "label": "Aprobado por calidad", "value": 10, "desc": "Aprobado por calidad", "us_group": "quality_assurance", "wo_prevstatus": [8] },
            { "label": "Empaque", "value": 11, "desc": "En proceso de empaque", "us_group": "packaging", "wo_prevstatus": [10] },
            { "label": "Inspección Final", "value": 12, "desc": "Listo para embarque", "us_group": "packaging", "wo_prevstatus": [11] },
            { "label": "Facturación/Lista de Embarque", "value": 13, "desc": "Facturado", "us_group": "warehouse", "wo_prevstatus": [12] },
            { "label": "Enviado", "value": 14, "desc": "Los articulos fueron enviados", "us_group": "warehouse", "wo_prevstatus": [13] },
            { "label": "No se pudo entregar", "value": 15, "desc": "El producto no se pudo entregar", "us_group": "warehouse", "wo_prevstatus": [14] },
            { "label": "Rechazado por el cliente", "value": 16, "desc": "El producto fue rechazado por el cliente", "us_group": "warehouse", "wo_prevstatus": [14, 15] },
            { "label": "Entregado", "value": 17, "desc": "El producto se entrego al cliente con éxito", "us_group": "warehouse", "wo_prevstatus": [14, 15] },
            { "label": "Cancelada", "value": 18, "desc": "La orden de trabajo fue cancelada", "us_group": "admin", "wo_prevstatus": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,17,18] }
        ]
    }
}