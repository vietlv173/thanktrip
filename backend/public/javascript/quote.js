/**
 * Created by vietlv on 6/3/2020.
 */

let quoteApp = angular.module('quoteApp', []).run(function ($rootScope) {
    $rootScope.typeOf = function (value) {
        return typeof value;
    };
}).directive('stringToNumber', function () {
    return {
        require: 'ngModel', link: function (scope, element, attrs, ngModel) {
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
        require: '?ngModel', link: function (scope, elem, attrs, ctrl) {
            if (!ctrl) return;
            ctrl.$formatters.unshift(function () {
                return $filter(attrs.format)(ctrl.$modelValue)
            });

            elem.bind('blur', function () {
                let plainNumber = elem.val().replace(/[^\d|\-+|\.+]/g, '');
                elem.val($filter(attrs.format)(plainNumber));
            });
        }
    };
}]).directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
});

quoteApp.controller('quoteCtrl', ['$scope', '$http', '$filter', '$httpParamSerializer', function ($scope, $http) {

    $scope.responses = {};

    $scope.queries = {
        status: 2
    };

    $scope.getStatistical = function () {
        $http.get('/api/quote').success(function (response) {
            $scope.responses = response;
        });
    };

    $scope.getStatistical();

}]);