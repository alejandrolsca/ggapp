module.exports = {
    "title": "Tintas",
    "labels": {
        "in-id": "ID tinta",
        "su-id": "ID proveedor",
        "su-name": "proveedor",
        "in-code": "Codigo (Referencia de Guía)",
        "in-type": "Tipo",
        "in-description": "Descripcion",
        "in-status": "Estatus",
        "in-date": "Fec. de Creación"
    },
    "columns": [
        "in_id",
        "in_description",
        "su_name",
        "in_code",
        "in_type",
        "in_status",
        "in_date"
    ],
    "fields": {
        in_typeoptions: [
            { "label": "Offset", "value": "offset" },
            { "label": "Flexo", "value": "flexo" },
            { "label": "Plotter", "value": "plotter" },
            { "label": "Serigrafía", "value": "serigraphy" },
            { "label": "Digital", "value": "digital" },
            { "label": "Sellos", "value": "stamps" },
            { "label": "Otros", "value": "other" },
        ],
        in_statusoptions: [
            { "label": "Activo", "value": "A" },
            { "label": "Inactivo", "value": "I" }
        ]
    }
}