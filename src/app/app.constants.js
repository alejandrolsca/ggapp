module.exports = (function (angular) {
    'use strict';

    return angular.module('app.constants', [])

        .constant('roles', [
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
        ])
})(angular);