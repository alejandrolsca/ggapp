module.exports = {
    "title": "Productos",
    "labels": {
        "pr-id": "ID producto",
        "cl-id": "ID Cliente",
        "cl-corporatename": "Cliente",
        "pr-partno": "No. Parte",
        "pr-code": "Codigo",
        "pr-name": "Nombre",
        "pr-process": "Proceso",
        "pr-type": "Tipo",
        "wo-previousid": "Orden Anterior",
        "tc-id": "Fracción",
        "pr-weight": "Peso",
        "pr-status": "Estatus",
        "pr-date": "Fec. de Creación",
    },
    "columns": [
        { "binding": "pr_id", "type": "Number", "width": 100 },
        { "binding": "wo_previousid", "type": "Number", "width": 100 },
        { "binding": "cl_id", "type": "Number", "width": 100 },
        { "binding": "cl_corporatename", "type": "String", "width": 250 },
        { "binding": "pr_partno", "type": "String", "width": 150 },
        { "binding": "pr_code", "type": "String", "width": 250 },
        { "binding": "pr_name", "type": "String", "width": 100 },
        { "binding": "pr_process", "type": "String", "width": 100 },
        { "binding": "pr_type", "type": "String", "width": 100 },
        { "binding": "pr_weight", "type": "Number", "width": 100 },
        { "binding": "pr_status", "type": "String", "width": 100 },
        { "binding": "pr_date", "type": "Date", "width": 150 }
    ],
    "fields": {

    }
}