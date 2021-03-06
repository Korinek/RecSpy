(function() {
    'use strict';
    /* jshint ignore:start */
    angular.module('app').value('toastr', toastr);
    /* jshint ignore:end */

    angular.module('app').factory('notifierService', ['toastr',
        function(toastr) {
            return {
                success: function(message) {
                    toastr.success(message);
                },
                error: function(message) {
                    toastr.error(message);
                }
            };
        }
    ]);
}());
