module.exports = {
    "title": "Usuarios",
    "labels": {
        "username": "Usuario",
        "email": "Email",
        "last-login": "Ultima sesión",
        "last-ip": "Ultima IP",
        "logins-count": "Sesiones",
        "us-group": "Groups"
    },
    "columns": [
        { "binding": "username", "type": "String", "width": 100, "html": false },
        { "binding": "email", "type": "String", "width": 200, "html": false },
        { "binding": "last_login", "type": "Date", "width": 150, "html": false },
        { "binding": "last_ip", "type": "String", "width": 120, "html": false },
        { "binding": "logins_count", "type": "Number", "width": 80, "html": false },
        { "binding": "us_group", "type": "String", "width": 150, "html": true }
    ],
    "fields": {
        "us_groupoptions": [
            { "label": "owner", "value": "owner" },
            { "label": "admin", "value": "admin" },
            { "label": "admin_support", "value": "admin_support" },
            { "label": "sales", "value": "sales" },
            { "label": "warehouse", "value": "warehouse" },
            { "label": "production", "value": "production" },
            { "label": "production_planner", "value": "production_planner" },
            { "label": "finishing", "value": "finishing" },
            { "label": "quality_assurance", "value": "quality_assurance" },
            { "label": "packaging", "value": "packaging" },
            { "label": "logistics", "value": "logistics" }
        ]
    }
}