(function () {
    'use strict';

    angular.module('app').value('toastr', toastr);

    angular.module('app').factory('notifierService', function (toastr) {
        return {
            success: function (message) {
                toastr.success(message);
            },
            failure: function (message) {
                toastr.error(message);
            }
        };
    });
}());
