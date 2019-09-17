module.exports = {
    "title": "Proveedores",
    "labels": {
        "su-id": "id proveedor",
        "su-corporatename": "razón social",
        "su-rfc": "RFC",
        "su-name": "nombre",
        "su-firstsurname": "1er apellido",
        "su-secondsurname": "2do apellido",
        "su-street": "calle",
        "su-streetnumber": "num. ext.",
        "su-suitenumber": "num. int.",
        "su-neighborhood": "colonia",
        "su-addressreference": "referencia",
        "su-country": "país",
        "su-state": "estado",
        "su-city": "ciudad/delegacion",
        "su-county": "municipio/condado",
        "su-zipcode": "codigo postal",
        "su-email": "correo electrónico",
        "su-phone": "teléfono",
        "su-phoneextension": "Ext.",
        "su-mobile": "móvil",
        "su-status": "estatus",
        "su-type": "Tipo",
        "su-date": "Fec. de Creación",
    },
    "columns": [
        "su_id",
        "su_corporatename",
        "su_rfc",
        "su_name",
        "su_firstsurname",
        "su_secondsurname",
        "su_street",
        "su_streetnumber",
        "su_suitenumber",
        "su_neighborhood",
        "su_addressreference",
        "su_zipcode",
        "su_email",
        "su_phone",
        "su_phoneextension",
        "su_mobile",
        "su_status",
        "su_type",
        "su_date",
    ],
    "fields": {
        su_statusoptions: [
            { "label": "Activo", "value": "A" },
            { "label": "Inactivo", "value": "I" }
        ],
        su_typeoptions: [
            { "label": "Fisica", "value": "natural" },
            { "label": "Moral", "value": "legal" }
        ]
    }
}