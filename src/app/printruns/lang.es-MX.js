module.exports = {
    "title": "Tirajes",
    "labels": {
        "ma-id": "ID Maquina",
        "ma-name": "Maquina",
        "print-runs": "Tirajes",
        "print-time": "Tiempo (Horas)",
        "wo-status": "Estatus"
    },
    "columns": [
        { "binding": "ma_id", "type": "Number", "width": 100, "html": false, "format": "None", "aggregate": "None" },
        { "binding": "ma_name", "type": "String", "width": 300, "html": false, "format": "string", "aggregate": "None" },
        { "binding": "print_runs", "type": "Number", "width": 100, "html": false, "format": "n2", "aggregate": "Sum" },
        { "binding": "print_time", "type": "Number", "width": 100, "html": false, "format": "n2", "aggregate": "Sum" },
        { "binding": "wo_status", "type": "String", "width": 200, "html": false, "format": "string", "aggregate": "None" }
    ],
    "fields": {
    }
}