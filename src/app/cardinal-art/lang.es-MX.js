module.exports = {
    "title": "Cardinal - Arte",
    "labels": {
        "wo-id": "No. orden",
        "pr-code": "Codigo de Producto",
        "pr-process": "Proceso",
        "pr-name": "Producto",
        "wo-qty": "Cantidad",
    },
    "columns": [
        { "binding": "pr_process", "type": "String", "width": 80, "html": false },
        { "binding": "pr_code", "type": "String", "width": 200, "html": false },
        { "binding": "pr_name", "type": "String", "width": 200, "html": false },
        { "binding": "wo_qty", "type": "Number", "width": 100, "html": false }
    ]
}