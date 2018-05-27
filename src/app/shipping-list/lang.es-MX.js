module.exports = {
    "title": "Listas de Embarque",
    "labels": {
        "sl-id": "No.",
        "cl-corporatename": "Cliente",
        "zo-zone": "Zona",
        "wo-id": "Ordenes",        
        "sl-cancelled": "Cancelada",
        "sl-createdby": "Creado por",
        "sl-date": "Fecha",
        "release-invoice": "Facturar"
    },
    "columns": [
        // { "binding": "sl_id", "type": "Number" , "width": 60 , "isReadOnly": true},
        { "binding": "cl_corporatename", "type": "String" , "width": 200 , "isReadOnly": true},
        { "binding": "zo_zone", "type": "String" , "width": 100 , "isReadOnly": true},
        { "binding": "wo_id", "type": "String" , "width": 100 , "isReadOnly": true},
        { "binding": "sl_cancelled", "type": "Boolean" , "width": 100 , "isReadOnly": true},
        { "binding": "sl_createdby", "type": "String" , "width": 100 , "isReadOnly": true},
        { "binding": "sl_date", "type": "Date" , "width": 150 , "isReadOnly": true}
    ]
}