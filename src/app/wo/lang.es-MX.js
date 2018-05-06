module.exports = {
    "title": "Ordenes de Trabajo",
    "labels": {
        //"wo-id": "No. orden",
        "wo-shippinglist": "L. Emb.",
        "wo-exportationinvoice": "F. exp.",
        "cl-id": "ID cliente",
        "cl-corporatename": "cliente",
        "zo-id": "ID zona",
        "zo-zone": "zona",
        "wo-orderedby": "Ordenado por",
        "wo-attention": "Atención",
        "pr-id": "ID Producto",
        "pr-code": "Codigo de Producto",
        "file1": "Archivo 1",
        "file2": "Archivo 2",
        "pr-weight": "Peso (kg)",
        "pr-name": "Producto",
        "pr-partno": "No. parte",
        "ma-id": "ID Maquina",
        "ma-name": "Maquina",
        "wo-release": "Release",
        "wo-po": "Orden de compra",
        "wo-line": "Linea",
        "wo-linetotal": "De",
        "wo-qty": "Cantidad",
        "wo-packageqty": "Cantidad x paq/rollo",
        "wo-foliosperformat": "Folios x formato",
        "wo-foliosseries": "Serie",
        "wo-foliosfrom": "Del",
        "wo-foliosto": "Al",
        "wo-type": "Tipo",
        "wo-commitmentdate": "Fecha compromiso",
        "wo-deliverydate": "Fecha de Entrega",
        "wo-previousid": "ID anterior",
        "wo-previousdate": "Fecha anterior",
        "wo-notes": "Notas",
        "wo-price": "Precio",
        "wo-currency": "Moneda",
        "wo-email": "Enviar Correo",
        "wo-status": "Estatus",
        "wo-createdby": "Creado por",
        "wo-updatedby": "Actualizado por",
        "wo-updated": "Fecha de Actualizacion",
        "wo-date": "Fecha"
    },
    "columns": [
        //{ "binding": "wo_id", "type": "Number" , "width": 100 , "isReadOnly": true, "filterType": 0},
        //{ "binding": "wo_shippinglist", "type": "Boolean" , "width": 80 , "isReadOnly": true, "filterType": 0},
        //{ "binding": "wo_exportationinvoice", "type": "Boolean" , "width": 80 , "isReadOnly": true, "filterType": 0},
        { "binding": "cl_corporatename", "type": "String" , "width": 200 , "isReadOnly": true, "filterType": 0},
        { "binding": "zo_zone", "type": "String" , "width": 150 , "isReadOnly": true, "filterType": 2},
        { "binding": "pr_name", "type": "String" , "width": 200 , "isReadOnly": true, "filterType": 0},
        { "binding": "pr_partno", "type": "String" , "width": 100 , "isReadOnly": true, "filterType": 2},
        { "binding": "wo_release", "type": "String" , "width": 100 , "isReadOnly": true, "filterType": 2},
        { "binding": "wo_po", "type": "String" , "width": 100 , "isReadOnly": true, "filterType": 0},       
        { "binding": "pr_code", "type": "String" , "width": 200 , "isReadOnly": true, "filterType": 0},
        { "binding": "file1", "type": "String" , "width": 200 , "isReadOnly": true, "filterType": 0},
        { "binding": "file2", "type": "String" , "width": 200 , "isReadOnly": true, "filterType": 0},
        { "binding": "pr_weight", "type": "Number" , "width": 100 , "isReadOnly": true, "filterType": 0},
        { "binding": "ma_name", "type": "String" , "width": 200 , "isReadOnly": true, "filterType": 0},
        { "binding": "wo_orderedby", "type": "String" , "width": 100 , "isReadOnly": true, "filterType": 0},
        { "binding": "wo_attention", "type": "String" , "width": 100 , "isReadOnly": true, "filterType": 0},
        { "binding": "wo_line", "type": "Number" , "width": 100 , "isReadOnly": true, "filterType": 0},
        { "binding": "wo_linetotal", "type": "Number" , "width": 100 , "isReadOnly": true, "filterType": 0},
        { "binding": "wo_qty", "type": "Number" , "width": 100 , "isReadOnly": true, "filterType": 0},
        { "binding": "wo_packageqty", "type": "Number" , "width": 100 , "isReadOnly": true, "filterType": 0},
        { "binding": "wo_foliosperformat", "type": "Number" , "width": 100 , "isReadOnly": true, "filterType": 0},
        { "binding": "wo_foliosseries", "type": "String" , "width": 100 , "isReadOnly": true, "filterType": 0},
        { "binding": "wo_foliosfrom", "type": "Number" , "width": 100 , "isReadOnly": true, "filterType": 0},
        { "binding": "wo_foliosto", "type": "Number" , "width": 100 , "isReadOnly": true, "filterType": 0},
        { "binding": "wo_type", "type": "String" , "width": 100 , "isReadOnly": true, "filterType": 0},
        { "binding": "wo_commitmentdate", "type": "Date" , "width": 150 , "isReadOnly": true, "filterType": 0},
        { "binding": "wo_deliverydate", "type": "Date" , "width": 150 , "isReadOnly": true, "filterType": 0},
        { "binding": "wo_previousid", "type": "Number" , "width": 100 , "isReadOnly": true, "filterType": 0},
        { "binding": "wo_previousdate", "type": "Date" , "width": 150 , "isReadOnly": true, "filterType": 0},
        { "binding": "wo_notes", "type": "String" , "width": 100 , "isReadOnly": true, "filterType": 0},
        { "binding": "wo_price", "type": "Number" , "width": 100 , "isReadOnly": true, "filterType": 0},
        { "binding": "wo_currency", "type": "Number" , "width": 100 , "isReadOnly": true, "filterType": 0},
        { "binding": "wo_email", "type": "String" , "width": 100 , "isReadOnly": true, "filterType": 0},
        { "binding": "wo_status", "type": "String" , "width": 200 , "isReadOnly": true, "filterType": 0},
        { "binding": "wo_createdby", "type": "String" , "width": 100 , "isReadOnly": true, "filterType": 0},
        { "binding": "wo_updatedby", "type": "String" , "width": 100 , "isReadOnly": true, "filterType": 0},
        { "binding": "wo_updated", "type": "Date" , "width": 150 , "isReadOnly": true, "filterType": 0},
        { "binding": "wo_date", "type": "Date" , "width": 150 , "isReadOnly": true, "filterType": 0}
    ],
    "fields": {
        wo_dateoptions: [
            { "label": "1 mes", "value": '1 month' },
            { "label": "2 meses", "value": '2 month' },
            { "label": "3 meses", "value": '3 month' },
            { "label": "6 meses", "value": '6 month' },
            { "label": "12 meses", "value": '1 year' }
        ]
    }
}