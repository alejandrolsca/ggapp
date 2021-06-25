module.exports = {
    "title": "Conteo de Acabados",
    "labels": {
        "wo-id": "ID Orden",
        "pr-staplingqty": "Total Grapado",
        "pr-boundqty": "Total Encuadernado",
        "pr-foldunit1qty": "Total Doblez",
    },
    "columns": [
        { "binding": "wo_id", "type": "Number", "width": 140, "html": false, "format": "n0", "aggregate": "None" },
        { "binding": "pr_staplingqty", "type": "Number", "width": 120, "html": false, "format": "n0", "aggregate": "Sum" },
        { "binding": "pr_boundqty", "type": "Number", "width": 160, "html": false, "format": "n0", "aggregate": "Sum" },
        { "binding": "pr_foldunit1qty", "type": "Number", "width": 120, "html": false, "format": "n0", "aggregate": "Sum" }
    ],
    "fields": {
    }
}