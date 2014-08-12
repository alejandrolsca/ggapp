'use strict';

module.exports = function () {
    return {
        restrict: 'E',
        scope: {
            options: '=',
            form: '@'
        },
        template: function(elem, attrs) {
        return '<div class="form-group" ng-class="{\'has-error\': [form].' + attrs.field + '.$invalid && !' + attrs.form + '.' + attrs.field + '.$pristine}"> \
                    <label class="col-sm-2 control-label">{{ "CLIENT.FIELDS.' + attrs.field + '.NAME" | uppercase | i18n}}</label> \
                    <div class="col-sm-4"> \
                        <select class="form-control" name="' + attrs.field + '" ng-model="fmData.' + attrs.field + '" ng-required="' + attrs.required + '"> \
                            <option ng-repeat="opt in options" value="{{opt.value}}">{{opt.label}}</option> \
                        </select> \
                        <p ng-show="' + attrs.form + '.' + attrs.field + '.$invalid && !' + attrs.form + '.' + attrs.field + '.$pristine">' + attrs.msg + '</p> \
                    </div> \
                </div>'
        }
    }
};