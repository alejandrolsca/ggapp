const labels = require('../workflow/lang.es-MX').fields.wo_statusoptions
module.exports = {
    "title": "Ganancias por estatus",
    "labels": {
        "cl-corporatename": "Cliente",
        "total": "Total",
        "0": labels[0].label,
        "1": labels[1].label,
        "2": labels[2].label,
        "3": labels[3].label,
        "4": labels[4].label,
        "5": labels[5].label,
        "6": labels[6].label,
        "7": labels[7].label,
        "8": labels[8].label,
        "9": labels[9].label,
        "10": labels[10].label,
        "11": labels[11].label,
        "12": labels[12].label,
        "13": labels[13].label,
        "14": labels[14].label,
        "15": labels[15].label,
        "16": labels[16].label,
        "17": labels[17].label,
        "18": labels[18].label,
        "wo-currency": "moneda",
        "target-date": "Fec. de Creación"
    },
    "columns": [
        { "binding": "cl_corporatename", "type": "String", "width": 300, "html": false, "format": "string", "aggregate": "None" },
        { "binding": "total", "type": "Number", "width": 300, "html": false, "format": "n2", "aggregate": "Sum" },
        { "binding": "0", "type": "Number", "width": 150, "html": false, "format": "n2", "aggregate": "Sum" },
        { "binding": "1", "type": "Number", "width": 150, "html": false, "format": "n2", "aggregate": "Sum" },
        { "binding": "2", "type": "Number", "width": 150, "html": false, "format": "n2", "aggregate": "Sum" },
        { "binding": "3", "type": "Number", "width": 150, "html": false, "format": "n2", "aggregate": "Sum" },
        { "binding": "4", "type": "Number", "width": 150, "html": false, "format": "n2", "aggregate": "Sum" },
        { "binding": "5", "type": "Number", "width": 150, "html": false, "format": "n2", "aggregate": "Sum" },
        { "binding": "6", "type": "Number", "width": 150, "html": false, "format": "n2", "aggregate": "Sum" },
        { "binding": "7", "type": "Number", "width": 150, "html": false, "format": "n2", "aggregate": "Sum" },
        { "binding": "8", "type": "Number", "width": 150, "html": false, "format": "n2", "aggregate": "Sum" },
        { "binding": "9", "type": "Number", "width": 150, "html": false, "format": "n2", "aggregate": "Sum" },
        { "binding": "10", "type": "Number", "width": 150, "html": false, "format": "n2", "aggregate": "Sum" },
        { "binding": "11", "type": "Number", "width": 150, "html": false, "format": "n2", "aggregate": "Sum" },
        { "binding": "12", "type": "Number", "width": 150, "html": false, "format": "n2", "aggregate": "Sum" },
        { "binding": "13", "type": "Number", "width": 150, "html": false, "format": "n2", "aggregate": "Sum" },
        { "binding": "14", "type": "Number", "width": 150, "html": false, "format": "n2", "aggregate": "Sum" },
        { "binding": "15", "type": "Number", "width": 150, "html": false, "format": "n2", "aggregate": "Sum" },
        { "binding": "16", "type": "Number", "width": 150, "html": false, "format": "n2", "aggregate": "Sum" },
        { "binding": "17", "type": "Number", "width": 150, "html": false, "format": "n2", "aggregate": "Sum" },
        { "binding": "18", "type": "Number", "width": 150, "html": false, "format": "n2", "aggregate": "Sum" }
    ],
    "fields": {
        wo_currencyoptions: [
            { "label": "MXN", "value": "MXN" },
            { "label": "DLLS", "value": "DLLS" }
        ],
        target_dateoptions: [
            { "label": "Creación", "value": "wo_date" },
            { "label": "Compromiso", "value": "wo_commitmentdate" }
        ],
    }
}