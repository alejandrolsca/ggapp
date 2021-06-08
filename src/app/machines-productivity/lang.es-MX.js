module.exports = {
    "title": "Productividad de las maquinas",
    "labels": {
        "ma-id": "ID Maquina",
        "ma-name": "Maquina",
        "ma-velocity": "Velocidad",
        "work-orders": "Ordenes",
        "print-runs": "Tirajes",
        "print-time": "Horas",
        "working-days": "Dias Lab.",
        "working-hours": "Horas Lab.",
        "usage-percentage": "Uso",
    },
    "columns": [
        { "binding": "ma_id", "type": "Number", "width": 120, "html": false, "format": "D", "aggregate": "None" },
        { "binding": "ma_name", "type": "String", "width": 200, "html": false, "format": "string", "aggregate": "None" },
        { "binding": "ma_velocity", "type": "Number", "width": 100, "html": false, "format": "n2", "aggregate": "None" },
        { "binding": "work_orders", "type": "Number", "width": 80, "html": false, "format": "n0", "aggregate": "None" },
        { "binding": "print_runs", "type": "Number", "width": 80, "html": false, "format": "n2", "aggregate": "None" },
        { "binding": "print_time", "type": "Number", "width": 80, "html": false, "format": "n2", "aggregate": "None" },
        { "binding": "working_days", "type": "Number", "width": 100, "html": false, "format": "n0", "aggregate": "None" },
        { "binding": "working_hours", "type": "Number", "width": 100, "html": false, "format": "n0", "aggregate": "None" },
        { "binding": "usage_percentage", "type": "Number", "width": 80, "html": false, "format": "p2", "aggregate": "None" }
    ],
    "fields": {
    }
}