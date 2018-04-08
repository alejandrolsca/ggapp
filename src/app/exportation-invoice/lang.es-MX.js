module.exports = {
    "title": "Facturas de exportación",
    "labels": {
        "ei-id": "No.",
        "cl-corporatename": "Cliente",
        "zo-zone": "Zona",
        "wo-id": "Ordenes",        
        "ei-cancelled": "Cancelada",
        "ei-createdby": "Creado por",
        "ei-date": "Fecha"
    },
    "columns": [
        // { "binding": "ei_id", "type": "Number" , "width": 60 , "isReadOnly": true},
        { "binding": "cl_corporatename", "type": "String" , "width": 200 , "isReadOnly": true},
        { "binding": "zo_zone", "type": "String" , "width": 100 , "isReadOnly": true},
        { "binding": "wo_id", "type": "String" , "width": 100 , "isReadOnly": true},
        { "binding": "ei_cancelled", "type": "Boolean" , "width": 100 , "isReadOnly": true},
        { "binding": "ei_createdby", "type": "String" , "width": 100 , "isReadOnly": true},
        { "binding": "ei_date", "type": "Date" , "width": 150 , "isReadOnly": true}
    ]
}