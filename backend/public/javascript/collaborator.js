/**
 * Created by vietlv on 6/3/2020.
 */

let collaboratorApp = angular.module('Application', []).run(function ($rootScope) {
    $rootScope.typeOf = function (value) {
        return typeof value;
    };
}).directive('stringToNumber', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function (value) {
                return '' + value;
            });
            ngModel.$formatters.push(function (value) {
                return parseFloat(value);
            });
        }
    };
}).directive('format', ['$filter', function ($filter) {
    return {
        require: '?ngModel',
        link: function (scope, elem, attrs, ctrl) {
            if (!ctrl) return;
            ctrl.$formatters.unshift(function (a) {
                return $filter(attrs.format)(ctrl.$modelValue)
            });

            elem.bind('blur', function (event) {
                let plainNumber = elem.val().replace(/[^\d|\-+|\.+]/g, '');
                elem.val($filter(attrs.format)(plainNumber));
            });
        }
    };
}]);

collaboratorApp.controller('collaboratorCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.searching = false;

    $scope.pageLoading = true;

    $scope.responses = {};

    $scope.filterDate = null;

    $scope.getStatistical = function () {
        $scope.searching = true;

        $http.get('/api/collaborator/5e6138c8c766ec25b356d28c/'+ (!$('#filterDate').val() ? 'today' : $('#filterDate').val())).success(function (response) {
            $scope.responses = response;

            $scope.searching = false;
            $scope.pageLoading = false;
        });
    };

    $scope.getStatistical();

    $scope.$watch('pageLoading', function () {
        if (!$scope.pageLoading) {
            $('#ui-view').css('display', 'block');
        }
    });
}]);