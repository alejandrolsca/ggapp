module.exports = {
    "title": "Agregar producto",
    "labels": {
        "pr-id": "ID producto",
        "cl-id": "ID cliente",
        "pr-process": "Proceso",
        "pr-type": "Tipo",
        "pr-partno": "No. parte",
        "pr-code": "Codigo",
        "pr-weight": "Peso (kg)",
        "pr-name": "Nombre",
        "pr-description": "Descripcion",
        "mt-id": "ID material",
        "pr-finalsizewidth": "Ancho",
        "pr-finalsizeheight": "Largo",
        "pr-finalsizemeasure": "U. de medida",
        "pr-engravingwidth": "Ancho",
        "pr-engravingheight": "Largo",
        "pr-engravingmeasure": "U. de medida",
        "pr-surface": "Superficie",
        "pr-othersurface": "Nombre Sup.",
        "pr-time": "Tiempo (min)",
        "tc-id": "Fracción",
        "pr-status": "Estatus",
        "pr-date": "Fec. de Creación",
    },
    "columns": [
        "pr_id",
        "cl_id",
        "pr_process",
        "pr_type",
        "pr_partno",
        "pr_code",
        "pr_weight",
        "pr_description",
        "mt_id",
        "pr_finalsizewidth",
        "pr_finalsizeheight",
        "pr_finalsizemeasure",
        "pr_engravingwidth",
        "pr_engravingheight",
        "pr_engravingmeasure",
        "pr_surface",
        "pr_othersurface",
        "pr_time",
        "pr_status",
        "pr_date",
    ],
    "fields": {
        pr_finalsizemeasureoptions: [
            { "label": "cm", "value": "cm" },
            { "label": "pulgadas", "value": "in" }
        ],
        pr_engravingmeasureoptions: [
            { "label": "cm", "value": "cm" },
            { "label": "pulgadas", "value": "in" }
        ],
        pr_inkfrontoptions: [
            { "label": "0 tintas", "value": 0 },
            { "label": "1 tinta", "value": 1 },
            { "label": "2 tintas", "value": 2 },
            { "label": "3 tintas", "value": 3 }
        ],
        pr_statusoptions: [
            { "label": "Activo", "value": "A" },
            { "label": "Inactivo", "value": "I" }
        ]
    }
}