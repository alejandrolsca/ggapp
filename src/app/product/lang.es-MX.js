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
        "pr-material": "Material",
        "wo-previousid": "Orden Anterior",
        "tc-code": "Fracción",
        "tc-description": "Fracción Desc.",
        "pr-weight": "Peso",
        "pr-status": "Estatus",
        "pr-date": "Fec. de Creación",
    },
    "columns": [
        //{ "binding": "pr_id", "type": "Number", "width": 100, "visible": true, "html": false },
        { "binding": "wo_previousid", "type": "Number", "width": 140, "visible": true, "html": false },
        { "binding": "cl_id", "type": "Number", "width": 100, "visible": false, "html": false },
        { "binding": "cl_corporatename", "type": "String", "width": 200, "visible": true, "html": false },
        { "binding": "pr_partno", "type": "String", "width": 150, "visible": true, "html": false },
        { "binding": "pr_code", "type": "String", "width": 250, "visible": true, "html": false },
        { "binding": "pr_name", "type": "String", "width": 100, "visible": true, "html": false },
        { "binding": "pr_process", "type": "String", "width": 100, "visible": true, "html": false },
        { "binding": "pr_type", "type": "String", "width": 100, "visible": true, "html": false },
        { "binding": "pr_material", "type": "String", "width": 250, "visible": true, "html": true },
        { "binding": "pr_weight", "type": "Number", "width": 100, "visible": true, "html": false },
        { "binding": "tc_code", "type": "String", "width": 250, "visible": true, "html": true },
        { "binding": "tc_description", "type": "String", "width": 250, "visible": true, "html": true },
        { "binding": "pr_status", "type": "String", "width": 100, "visible": true, "html": false },
        { "binding": "pr_date", "type": "Date", "width": 150, "visible": true, "html": false }
    ],
    "fields": {

    }
}