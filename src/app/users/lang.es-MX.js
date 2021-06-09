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
    }
}