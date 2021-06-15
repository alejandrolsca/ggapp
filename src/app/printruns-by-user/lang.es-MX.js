module.exports = {
    "title": "Tirajes por usuario",
    "labels": {
        "wo-updatedby": "Usuario",
        "wo-id": "Orden",
        "pr-process": "Proceso",
        "ma-name": "Maquina",
        "wo-status": "Estatus",
        "print-runs": "Tirajes",
        "wo-qty": "Cantidad",
        "wo-price": "Precio",
        "wo-currency": "Moneda",
        "wo-total": "Total"
    },
    "columns": [
        { "binding": "wo_updatedby", "type": "Number", "width": 120, "html": false, "format": "string", "aggregate": "None" },
        { "binding": "wo_id", "type": "Number", "width": 80, "html": false, "format": "D", "aggregate": "None" },
        { "binding": "ma_name", "type": "String", "width": 200, "html": false, "format": "string", "aggregate": "None" },
        { "binding": "pr_process", "type": "String", "width": 150, "html": false, "format": "string", "aggregate": "None" },
        { "binding": "wo_status", "type": "String", "width": 120, "html": false, "format": "string", "aggregate": "None" },
        { "binding": "print_runs", "type": "Number", "width": 100, "html": false, "format": "n2", "aggregate": "Sum" },
        { "binding": "wo_qty", "type": "Number", "width": 100, "html": false, "format": "n2", "aggregate": "Sum" },
        { "binding": "wo_price", "type": "Number", "width": 100, "html": false, "format": "c6", "aggregate": "None" },
        { "binding": "wo_currency", "type": "String", "width": 100, "html": false, "format": "string", "aggregate": "None" },
        { "binding": "wo_total", "type": "Number", "width": 100, "html": false, "format": "c2", "aggregate": "Sum" }
    ],
    "fields": {
    }
}