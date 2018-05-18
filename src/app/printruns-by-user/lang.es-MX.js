module.exports = {
    "title": "Tirajes",
    "labels": {
        "wo-updatedby": "Usuario",
        "wo-id": "Orden",
        "pr-name": "Producto",
        "pr-code": "Codigo",
        "ma-name": "Maquina",
        "wo-status": "Estatus",
        "print-runs": "Tirajes",
        "wohi-date": "Entregado",
    },
    "columns": [
        { "binding": "wo_updatedby", "type": "Number", "width": 120, "html": false, "format": "string", "aggregate": "None" },
        { "binding": "wo_id", "type": "Number", "width": 80, "html": false, "format": "n0", "aggregate": "None" },
        { "binding": "pr_name", "type": "String", "width": 180, "html": false, "format": "string", "aggregate": "None" },
        { "binding": "pr_code", "type": "String", "width": 150, "html": false, "format": "string", "aggregate": "None" },
        { "binding": "ma_name", "type": "String", "width": 200, "html": false, "format": "string", "aggregate": "None" },
        { "binding": "wo_status", "type": "String", "width": 120, "html": false, "format": "string", "aggregate": "None" },
        { "binding": "print_runs", "type": "Number", "width": 100, "html": false, "format": "n2", "aggregate": "Sum" },
        { "binding": "wohi_date", "type": "Date", "width": 200, "html": false, "format": "string", "aggregate": "None" }
    ],
    "fields": {
    }
}