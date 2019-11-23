module.exports = {
    "title": "Tirajes",
    "labels": {
        "wo-id": "Orden",
        "mt-id": "ID Material",
        "mt-type": "ID Tipo",
        "maty-label": "Tipo",
        "mt-code": "Codigo",
        "mt-description": "Descripción",
        "wo-materialqty": "Mat. Ordenado",
        "wo-status": "Estatus",
        "mt-count": "Incidencias"
    },
    "columns": [
        { "binding": "wo_id", "type": "Number", "width": 80, "html": false, "format": "n0", "aggregate": "None" },
        { "binding": "mt_id", "type": "Number", "width": 100, "html": false, "format": "n0", "aggregate": "None" },
        { "binding": "mt_code", "type": "String", "width": 120, "html": false, "format": "string", "aggregate": "None" },
        { "binding": "mt_type", "type": "Number", "width": 80, "html": false, "format": "n0", "aggregate": "None" },
        { "binding": "maty_label", "type": "String", "width": 120, "html": false, "format": "string", "aggregate": "None" },
        { "binding": "mt_description", "type": "String", "width": 400, "html": false, "format": "string", "aggregate": "None" },
        { "binding": "wo_materialqty", "type": "Number", "width": 120, "html": false, "format": "n2", "aggregate": "Sum"},
        { "binding": "wo_status", "type": "String", "width": 180, "html": false, "format": "string", "aggregate": "None" },
        { "binding": "mt_count", "type": "Number", "width": 100, "html": false, "format": "n0", "aggregate": "None" },
    ],
    "fields": {
    }
}