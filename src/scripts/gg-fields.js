(function (angular) {
    'use strict';

    angular.module('gg-fields', [])

        .constant('validTypes', {
            "singlespaces": /^([-,a-zA-Z0-9ÁáÉéÍíÓóÚú\.](.[-,a-zA-Z0-9ÁáÉéÍíÓóÚú\.])*)*$/,
            "partno": /^([-,\.:a-zA-Z0-9](.[-,\.:a-zA-Z0-9])*)*$/,
            "prcode": /^[-_\.,#:a-zA-Z0-9]{0,}$/,
            "papercode": /^[a-zA-Z0-9]{1,}$/,
            "inkcode": /^[a-zA-Z0-9]{1,}$/,
            "machinetotalinks": /^[1-8]{1}$/,
            "rfc": /^[A-Za-z]{3,4}\-\d{6}(?:\-[A-Za-z\d]{3})?$/,
            "email": /^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*$/i,
            "decimal": /^(\d+\.\d{2,5})$/,
            "discount": /^(0\.\d{2,2})$/,
            "integer": /^\d{1,}$/,
            "zipcode": /^\d{5,5}$/,
            "date": /^\d{4}-\d{2}-\d{2}$/,
            "user": /^\w{4,16}$/,
            "password": /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/,
            "phone": /^([+])?(\d{2,}-)*(\d{2,}-\d{2,})$/,
            "wo_id": /^(\d+)(,\s*\d+)*$/,            
            "uppercase": /^[A-Z]{0,}$/
        })

        .directive('ggInput', ['validTypes', function (validTypes) {
            return {
                restrict: "E",
                require: '^ngModel',
                scope: {
                    errClass: '@',
                    lbl: '@',
                    lblClass: '@',
                    fldClass: '@',
                    formGroupClass: '@',
                    reqMsg: '@',
                    regexpMsg: '@',
                    ngChange: '&',
                    name: '@',
                    isDisabled: '=',
                    isRequired: '=ngRequired',
                    ngModel: '='
                },
                template: function (elem, attrs) {

                    return '<div class="form-group {{formGroupClass}}">\
                                <label class="{{lblClass}} control-label">{{lbl}} <span class="glyphicon glyphicon-asterisk" aria-hidden="true" ng-show="required"></span></label>\
                                <div class="{{fldClass}}">\
                                    <input id="'+ attrs.ngModel + '" class="form-control red-tooltip" type="text" name="name" ng-model="ngModel" ng-change="ngChange()" ng-required="required" ng-disabled="isDisabled"/>\
                                </div>\
                          </div>';
                },
                link: function (scope, elem, attrs, ctrl) {

                    var validator = function (value) {

                        if (!!value || !ctrl.$pristine) {
                            ctrl.$setViewValue(value);
                        };

                        var required = (!value && attrs.isRequired === 'true');
                        var invalid = (!!value && !validTypes[attrs.regexp].test(value));

                        elem.toggleClass('has-error', (required || invalid));
                        elem.toggleClass('has-success', !(required || invalid));

                        scope.required = required;
                        scope.invalid = invalid;

                        ctrl.$setValidity('valid', ((required || invalid) ? false : true))

                        //if valid value
                        if (invalid) {
                            //validate if tooltip is shown
                            if (!($('[id="' + attrs.ngModel + '"]').data('bs.tooltip') && $('[id="' + attrs.ngModel + '"]').data('bs.tooltip').$tip.is(':visible'))) {
                                $('[id="' + attrs.ngModel + '"]').tooltip({
                                    placement: "bottom",
                                    title: attrs.regexpMsg,
                                    trigger: 'manual'
                                });
                                $('[id="' + attrs.ngModel + '"]').tooltip('show');
                            }
                        } else {
                            $('[id="' + attrs.ngModel + '"]').tooltip('destroy')
                        }

                        return value;
                    }
                    //format text going to user (model to view)
                    ctrl.$formatters.unshift(validator);
                    //format text from the user (view to model)
                    ctrl.$parsers.unshift(validator);
                }
            };
        }])

        .directive('ggPhone', ['validTypes', function (validTypes) {
            return {
                restrict: "E",
                require: '^ngModel',
                scope: {
                    errClass: '@',
                    lbl: '@',
                    formGroupClass: '@',
                    lblClass: '@',
                    fldClass: '@',
                    reqMsg: '@',
                    regexpMsg: '@',
                    ngChange: '&',
                    name: '@',
                    isDisabled: '=',
                    isRequired: '=ngRequired',
                    ngModel: '='
                },
                template: function (elem, attrs) {


                    return '<div class="form-group {{formGroupClass}}">\
                                <label class="{{lblClass}} control-label">{{lbl}} \
                                    <span class="glyphicon glyphicon-asterisk" aria-hidden="true" ng-show="required"></span>\
                                    <span id="'+ attrs.ngModel + '.phones" class="glyphicon glyphicon-phone-alt" aria-hidden="true" ng-show="validPhone"></span>\
                                </label>\
                                <div class="{{fldClass}}">\
                                    <input id="'+ attrs.ngModel + '" class="form-control red-tooltip" type="text" name="name" ng-model="ngModel" ng-change="ngChange()" ng-required="required" ng-disabled="isDisabled"/>\
                                </div>\
                          </div>';
                },
                link: function (scope, elem, attrs, ctrl) {

                    var validator = function (value) {

                        if (!!value || !ctrl.$pristine) {
                            ctrl.$setViewValue(value);
                        };

                        var required = (!value && attrs.isRequired === 'true');
                        var invalid = (!!value && !phoneUtils.isValidNumber(value, 'MX')),
                            validPhone;


                        elem.toggleClass('has-error', (required || invalid));
                        elem.toggleClass('has-success', !(required || invalid));

                        scope.required = required;
                        scope.invalid = invalid;

                        //if valid value
                        if (invalid) {
                            //validate if tooltip is shown
                            if (!($('[id="' + attrs.ngModel + '"]').data('bs.tooltip') && $('[id="' + attrs.ngModel + '"]').data('bs.tooltip').$tip.is(':visible'))) {
                                $('[id="' + attrs.ngModel + '"]').tooltip({
                                    placement: "bottom",
                                    title: attrs.regexpMsg,
                                    trigger: 'manual'
                                });
                                $('[id="' + attrs.ngModel + '"]').tooltip('show');
                            }
                        } else {
                            $('[id="' + attrs.ngModel + '"]').tooltip('destroy')
                        }

                        ctrl.$setValidity('valid', ((required || invalid) ? false : true))

                        if (angular.isDefined(value)) {
                            validPhone = phoneUtils.isValidNumber(value, 'MX');
                        } else {
                            validPhone = false;
                        }
                        scope.validPhone = validPhone;
                        if (validPhone) {
                            scope.validPhone = true;
                            scope.phone1 = phoneUtils.formatE164(value, 'MX');
                            scope.phone2 = phoneUtils.formatNational(value, 'MX');
                            scope.phone3 = phoneUtils.formatInternational(value, 'MX');
                            scope.phone4 = phoneUtils.formatInOriginalFormat(value, 'MX');
                        } else {
                            scope.validPhone = false;
                            scope.phone1 = undefined;
                            scope.phone2 = undefined;
                            scope.phone3 = undefined;
                            scope.phone4 = undefined;
                        }

                        if (validPhone) {
                            $('[id="' + attrs.ngModel + '.phones"]').popover({
                                placement: "top",
                                trigger: "click",
                                title: "Como marcar",
                                html: true,
                                content: '<p>E164: <a href="tel:' + scope.phone1 + '">' + scope.phone1 + '</a></p>\
                                         <p>Nacional: <a href="tel:'+ scope.phone2 + '">' + scope.phone2 + '</a></p>\
                                         <p>Internacional: <a href="tel:'+ scope.phone3 + '">' + scope.phone3 + '</a></p>\
                                         <p>Original: <a href="tel:'+ scope.phone4 + '">' + scope.phone4 + '</a></p>'

                            });
                            $('[id="' + attrs.ngModel + '.phones"]').popover('show');
                        } else {
                            $('[id="' + attrs.ngModel + '.phones"]').popover('destroy')
                        }

                        return value;
                    }
                    //format text going to user (model to view)
                    ctrl.$formatters.unshift(validator);
                    //format text from the user (view to model)
                    ctrl.$parsers.unshift(validator);
                }
            };
        }])

        .directive('ggSelect', ['validTypes', function (validTypes) {
            return {
                restrict: "E",
                require: '^ngModel',
                scope: {
                    errClass: '@',
                    lbl: '@',
                    formGroupClass: '@',
                    lblClass: '@',
                    fldClass: '@',
                    reqMsg: '@',
                    regexpMsg: '@',
                    options: '=',
                    ngChange: '&',
                    name: '@',
                    isDisabled: '=',
                    isRequired: '=ngRequired',
                    ngModel: '='
                },
                template: function (elem, attrs) {

                    var multiple = attrs.hasOwnProperty('multiple') ? 'multiple' : ''; //requires field

                    return '<div class="form-group {{formGroupClass}}">\
                                    <label class="{{lblClass}} control-label">{{lbl}} <span class="glyphicon glyphicon-asterisk" aria-hidden="true" ng-show="required"></span></label>\
                                    <div class="{{fldClass}}">\
                                        <select id="'+ attrs.ngModel + '" class="form-control red-tooltip" name="name" ng-model="ngModel" ng-change="ngChange()" ng-options="item.value as item.label disable when item.notAnOption for item in options" ng-required="required" ' + multiple + ' ng-disabled="isDisabled">\
                                        </select>\
                                    </div>\
                              </div>';
                },
                link: function (scope, elem, attrs, ctrl) {

                    var validator = function (value) {

                        if (!!value || !ctrl.$pristine) {
                            ctrl.$setViewValue(value);
                        };

                        var required = ((!value && value !== 0) && attrs.isRequired === 'true');
                        var invalid = (!!value && !validTypes[attrs.regexp].test(value));

                        elem.toggleClass('has-error', (required || invalid));
                        elem.toggleClass('has-success', !(required || invalid));

                        scope.required = required;
                        scope.invalid = invalid;

                        ctrl.$setValidity('valid', ((required || invalid) ? false : true))

                        //if valid value
                        if (invalid) {
                            //validate if tooltip is shown
                            if (!($('[id="' + attrs.ngModel + '"]').data('bs.tooltip') && $('[id="' + attrs.ngModel + '"]').data('bs.tooltip').$tip.is(':visible'))) {
                                $('[id="' + attrs.ngModel + '"]').tooltip({
                                    placement: "bottom",
                                    title: attrs.regexpMsg,
                                    trigger: 'manual'
                                });
                                $('[id="' + attrs.ngModel + '"]').tooltip('show');
                            }
                        } else {
                            $('[id="' + attrs.ngModel + '"]').tooltip('destroy')
                        }

                        return value;
                    }
                    //format text going to user (model to view)
                    ctrl.$formatters.unshift(validator);
                    //format text from the user (view to model)
                    ctrl.$parsers.unshift(validator);
                }
            };
        }])

        .directive('ggCountries', ['validTypes', function (validTypes) {
            return {
                restrict: "E",
                require: '^ngModel',
                scope: {
                    errClass: '@',
                    lbl: '@',
                    formGroupClass: '@',
                    lblClass: '@',
                    fldClass: '@',
                    reqMsg: '@',
                    regexpMsg: '@',
                    options: '=',
                    ngChange: '&',
                    name: '@',
                    isDisabled: '=',
                    isRequired: '=ngRequired',
                    ngModel: '='
                },
                template: function (elem, attrs) {

                    var multiple = attrs.hasOwnProperty('multiple') ? 'multiple' : ''; //requires field

                    return '<div class="form-group {{formGroupClass}}">\
                                    <label class="{{lblClass}} control-label">{{lbl}} <span class="glyphicon glyphicon-asterisk" aria-hidden="true" ng-show="required"></span></label>\
                                    <div class="{{fldClass}}">\
                                        <select id="'+ attrs.ngModel + '" class="form-control red-tooltip" name="name" ng-model="ngModel" ng-change="ngChange()" ng-options="item.geonameId as item.countryName for item in options" ng-required="required" ' + multiple + ' ng-disabled="isDisabled">\
                                        </select>\
                                    </div>\
                              </div>';
                },
                link: function (scope, elem, attrs, ctrl) {

                    var validator = function (value) {

                        if(!!value || !ctrl.$pristine) {
                            ctrl.$setViewValue(value);
                        };

                        var required = (!value && attrs.isRequired==='true');
                        var invalid = (!!value && !validTypes[attrs.regexp].test(value));

                        elem.toggleClass('has-error', (required || invalid));
                        elem.toggleClass('has-success', !(required || invalid));

                        scope.required = required;
                        scope.invalid = invalid;

                        //if valid value
                        if (invalid) {
                            //validate if tooltip is shown
                            if (!($('[id="' + attrs.ngModel + '"]').data('bs.tooltip') && $('[id="' + attrs.ngModel + '"]').data('bs.tooltip').$tip.is(':visible'))) {
                                $('[id="' + attrs.ngModel + '"]').tooltip({
                                    placement: "bottom",
                                    title: attrs.regexpMsg,
                                    trigger: 'manual'
                                });
                                $('[id="' + attrs.ngModel + '"]').tooltip('show');
                            }
                        } else {
                            $('[id="' + attrs.ngModel + '"]').tooltip('destroy')
                        }


                        return value;
                    }
                    //format text going to user (model to view)
                    ctrl.$formatters.unshift(validator);
                    //format text from the user (view to model)
                    ctrl.$parsers.unshift(validator);
                }
            };
        }])

        .directive('ggStates', ['validTypes', function (validTypes) {
            return {
                restrict: "E",
                require: '^ngModel',
                scope: {
                    errClass: '@',
                    lbl: '@',
                    formGroupClass: '@',
                    lblClass: '@',
                    fldClass: '@',
                    reqMsg: '@',
                    regexpMsg: '@',
                    options: '=',
                    ngChange: '&',
                    name: '@',
                    isDisabled: '=',
                    isRequired: '=ngRequired',
                    ngModel: '='
                },
                template: function (elem, attrs) {

                    var multiple = attrs.hasOwnProperty('multiple') ? 'multiple' : ''; //requires field

                    return '<div class="form-group {{formGroupClass}}">\
                                    <label class="{{lblClass}} control-label">{{lbl}} <span class="glyphicon glyphicon-asterisk" aria-hidden="true" ng-show="required"></span></label>\
                                    <div class="{{fldClass}}">\
                                        <select id="'+ attrs.ngModel + '" class="form-control red-tooltip" name="name" ng-model="ngModel" ng-change="ngChange()" ng-options="item.geonameId as item.toponymName for item in options" ng-required="required" ' + multiple + ' ng-disabled="isDisabled">\
                                        </select>\
                                    </div>\
                              </div>';
                },
                link: function (scope, elem, attrs, ctrl, ggStatesCtrl) {

                    var validator = function (value) {

                        if(!!value || !ctrl.$pristine) {
                            ctrl.$setViewValue(value);
                        };

                        var required = (!value && attrs.isRequired==='true');
                        var invalid = (!!value && !validTypes[attrs.regexp].test(value));

                        elem.toggleClass('has-error', (required || invalid));
                        elem.toggleClass('has-success', !(required || invalid));

                        scope.required = required;
                        scope.invalid = invalid;

                        ctrl.$setValidity('valid', ((required || invalid) ? false : true))

                        //if valid value
                        if (invalid) {
                            //validate if tooltip is shown
                            if (!($('[id="' + attrs.ngModel + '"]').data('bs.tooltip') && $('[id="' + attrs.ngModel + '"]').data('bs.tooltip').$tip.is(':visible'))) {
                                $('[id="' + attrs.ngModel + '"]').tooltip({
                                    placement: "bottom",
                                    title: attrs.regexpMsg,
                                    trigger: 'manual'
                                });
                                $('[id="' + attrs.ngModel + '"]').tooltip('show');
                            }
                        } else {
                            $('[id="' + attrs.ngModel + '"]').tooltip('destroy')
                        }

                        return value;
                    }
                    //format text going to user (model to view)
                    ctrl.$formatters.unshift(validator);
                    //format text from the user (view to model)
                    ctrl.$parsers.unshift(validator);
                }
            };
        }])

        .directive('ggCityCounty', ['validTypes', function (validTypes) {
            return {
                restrict: "E",
                require: '^ngModel',
                scope: {
                    errClass: '@',
                    lbl: '@',
                    formGroupClass: '@',
                    lblClass: '@',
                    fldClass: '@',
                    reqMsg: '@',
                    regexpMsg: '@',
                    options: '=',
                    ngChange: '&',
                    name: '@',
                    isDisabled: '=',
                    isRequired: '=ngRequired',
                    ngModel: '='
                },
                template: function (elem, attrs) {

                    var multiple = attrs.hasOwnProperty('multiple') ? 'multiple' : ''; //requires field

                    return '<div class="form-group {{formGroupClass}}">\
                                    <label class="{{lblClass}} control-label">{{lbl}} <span class="glyphicon glyphicon-asterisk" aria-hidden="true" ng-show="required"></span></label>\
                                    <div class="{{fldClass}}">\
                                        <select id="'+ attrs.ngModel + '" class="form-control red-tooltip" name="name" ng-model="ngModel" ng-change="ngChange()" ng-options="item.geonameId as item.toponymName for item in options" ng-required="required" ' + multiple + ' ng-disabled="isDisabled">\
                                        </select>\
                                    </div>\
                              </div>';
                },
                link: function (scope, elem, attrs, ctrl, ggStatesCtrl) {

                    var validator = function (value) {

                        if(!!value || !ctrl.$pristine) {
                            ctrl.$setViewValue(value);
                        };

                        var required = (!value && attrs.isRequired==='true');
                        var invalid = (!!value && !validTypes[attrs.regexp].test(value));

                        elem.toggleClass('has-error', (required || invalid));
                        elem.toggleClass('has-success', !(required || invalid));

                        scope.required = required;
                        scope.invalid = invalid;

                        ctrl.$setValidity('valid', ((required || invalid) ? false : true))

                        //if valid value
                        if (invalid) {
                            //validate if tooltip is shown
                            if (!($('[id="' + attrs.ngModel + '"]').data('bs.tooltip') && $('[id="' + attrs.ngModel + '"]').data('bs.tooltip').$tip.is(':visible'))) {
                                $('[id="' + attrs.ngModel + '"]').tooltip({
                                    placement: "bottom",
                                    title: attrs.regexpMsg,
                                    trigger: 'manual'
                                });
                                $('[id="' + attrs.ngModel + '"]').tooltip('show');
                            }
                        } else {
                            $('[id="' + attrs.ngModel + '"]').tooltip('destroy')
                        }

                        return value;
                    }
                    //format text going to user (model to view)
                    ctrl.$formatters.unshift(validator);
                    //format text from the user (view to model)
                    ctrl.$parsers.unshift(validator);
                }
            };
        }])

        .directive('ggTextarea', ['validTypes', function (validTypes) {
            return {
                restrict: "E",
                require: '^ngModel',
                scope: {
                    errClass: '@',
                    fldClass: '@',
                    lbl: '@',
                    formGroupClass: '@',
                    lblClass: '@',
                    name: '@',
                    isDisabled: '=',
                    isRequired: '=ngRequired',
                    ngModel: '=',
                    options: '=',
                    reqMsg: '@',
                    regexpMsg: '@',
                    height: '@'
                },
                template: function (elem, attrs) {


                    return '<div class="form-group {{formGroupClass}}">\
                                    <label class="{{lblClass}} control-label">{{lbl}}  <span class="glyphicon glyphicon-asterisk" aria-hidden="true" ng-show="required"></span></label>\
                                    <div class="{{fldClass}}">\
                                        <textarea id="'+ attrs.ngModel + '" class="form-control red-tooltip" name="name" ng-model="ngModel" style="height:{{height}}px;" ng-required="required" ng-disabled="isDisabled">\
                                        </textarea>\
                                    </div>\
                              </div>';
                },
                link: function (scope, elem, attrs, ctrl) {

                    var validator = function (value) {

                        if(!!value || !ctrl.$pristine) {
                            ctrl.$setViewValue(value);
                        };

                        var required = (!value && attrs.isRequired==='true');
                        var invalid = (!!value && !validTypes[attrs.regexp].test(value));

                        elem.toggleClass('has-error', (required || invalid));
                        elem.toggleClass('has-success', !(required || invalid));

                        scope.required = required;
                        scope.invalid = invalid;

                        ctrl.$setValidity('valid', ((required || invalid) ? false : true))

                        //if valid value
                        if (invalid) {
                            //validate if tooltip is shown
                            if (!($('[id="' + attrs.ngModel + '"]').data('bs.tooltip') && $('[id="' + attrs.ngModel + '"]').data('bs.tooltip').$tip.is(':visible'))) {
                                $('[id="' + attrs.ngModel + '"]').tooltip({
                                    placement: "bottom",
                                    title: attrs.regexpMsg,
                                    trigger: 'manual'
                                });
                                $('[id="' + attrs.ngModel + '"]').tooltip('show');
                            }
                        } else {
                            $('[id="' + attrs.ngModel + '"]').tooltip('destroy')
                        }

                        return value;
                    }
                    //format text going to user (model to view)
                    ctrl.$formatters.unshift(validator);
                    //format text from the user (view to model)
                    ctrl.$parsers.unshift(validator);
                }
            };
        }])

        .directive('ggCheckbox', ['validTypes', function (validTypes) {
            return {
                restrict: "E",
                require: '^ngModel',
                scope: {
                    fldClass: '@',
                    lbl: '@',
                    lblClass: '@',
                    name: '@',
                    isDisabled: '=',
                    ngModel: '='
                },
                template: function (elem, attrs) {


                    return '<div class="form-group">\
                                    <div class="{{lblClass}} {{fldClass}}">\
                                        <div class="checkbox" ng-disabled="isDisabled">\
                                            <label>\
                                            <input type="checkbox" name="name" ng-model="ngModel" ng-disabled="isDisabled"> {{lbl}}\
                                            </label>\
                                        </div>\
                                    </div>\
                              </div>';
                }
            };
        }])

        .directive('ggRadio', ['validTypes', function (validTypes) {
            return {
                restrict: "E",
                require: '^ngModel',
                scope: {
                    fldClass: '@',
                    lbl: '@',
                    lblClass: '@',
                    name: '@',
                    isDisabled: '=',
                    ngModel: '=',
                    val: '@'
                },
                template: function (elem, attrs) {


                    return '<div class="form-group">\
                                    <div class="{{lblClass}} {{fldClass}}">\
                                        <div class="radio" ng-disabled="isDisabled">\
                                            <label>\
                                            <input type="radio" name="name" ng-model="ngModel" value="{{val}}" ng-disabled="isDisabled"> {{lbl}}\
                                            </label>\
                                        </div>\
                                    </div>\
                              </div>';
                }
            };
        }])

        .directive('ggSubmit', ['validTypes', function (validTypes) {
            return {
                restrict: "E",
                require: '^ngModel',
                scope: {
                    fldClass: '@',
                    lbl: '@',
                    formGroupClass: '@',
                    fieldWrapperClass: '@',
                    lblClass: '@',
                    ngDisabled: '=',
                    btnClass: '@'
                },
                template: function (elem, attrs) {

                    return '<div class="form-group {{formGroupClass}}">\
                                    <div class="{{lblClass}} {{fldClass}}">\
                                            <button type="submit" class="btn btn-success {{btnClass}}" ng-disabled="ngDisabled">{{lbl}}</button>\
                                    </div>\
                              </div>';
                }
            };
        }])
        .directive('ggActionButton', ['validTypes', function (validTypes) {
            return {
                restrict: "E",
                require: '^ngModel',
                scope: {
                    fldClass: '@',
                    lbl: '@',
                    formGroupClass: '@',
                    fieldWrapperClass: '@',
                    lblClass: '@',
                    ngDisabled: '=',
                    ngClick: '&',
                    btnClass: '@'
                },
                template: function (elem, attrs) {

                    return '<div class="form-group {{formGroupClass}}">\
                                    <div class="{{lblClass}} {{fldClass}}">\
                                            <button type="button" ng-click="ngClick" class="btn btn-primary {{btnClass}}" ng-disabled="ngDisabled">{{lbl}}</button>\
                                    </div>\
                              </div>';
                }
            };
        }])

})(angular);