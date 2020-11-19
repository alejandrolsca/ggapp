module.exports = {
    "title": "Tirajes por usuario (Producción)",
    "labels": {
        "wo-updatedby": "Usuario",
        "wo-id": "Orden",
        "cl-corporatename": "Cliente",
        "pr-name": "Producto",
        "pr-partno": "No. Parte",
        "pr-code": "Codigo",
        "ma-name": "Maquina",
        "wo-status": "Estatus",
        "print-runs": "Tirajes",
        "wo-qty": "Cantidad",
        "wo-price": "Precio",
        "wo-total": "Total",
        "wo-deliverydate": "Entregado",
    },
    "columns": [
        { "binding": "wo_updatedby", "type": "Number", "width": 120, "html": false, "format": "string", "aggregate": "None" },
        { "binding": "wo_id", "type": "Number", "width": 80, "html": false, "format": "n0", "aggregate": "None" },
        { "binding": "cl_corporatename", "type": "String", "width": 200, "html": false, "format": "string", "aggregate": "None" },
        { "binding": "pr_name", "type": "String", "width": 180, "html": false, "format": "string", "aggregate": "None" },
        { "binding": "pr_partno", "type": "String", "width": 150, "html": false, "format": "string", "aggregate": "None" },
        { "binding": "pr_code", "type": "String", "width": 200, "html": false, "format": "string", "aggregate": "None" },
        { "binding": "ma_name", "type": "String", "width": 200, "html": false, "format": "string", "aggregate": "None" },
        { "binding": "wo_status", "type": "String", "width": 120, "html": false, "format": "string", "aggregate": "None" },
        { "binding": "print_runs", "type": "Number", "width": 100, "html": false, "format": "n2", "aggregate": "Sum" },
        { "binding": "wo_qty", "type": "Number", "width": 100, "html": false, "format": "n2", "aggregate": "Sum" },
        { "binding": "wo_price", "type": "Number", "width": 100, "html": false, "format": "c6", "aggregate": "None" },
        { "binding": "wo_total", "type": "Number", "width": 100, "html": false, "format": "c6", "aggregate": "Sum" },
        { "binding": "wo_deliverydate", "type": "Date", "width": 200, "html": false, "format": "string", "aggregate": "None" }
    ],
    "fields": {
    }
}