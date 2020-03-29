/**
 * Created by vietlv on 6/3/2020.
 */

let flightApp = angular.module('flightApp', []).run(function ($rootScope) {
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

flightApp.controller('flightCtrl', ['$scope', '$http','$httpParamSerializer','$sce', function ($scope, $http, $httpParamSerializer, $sce) {

    $scope.responses = {};

    $scope.queries = {
        page: 1,
        status: 0,
        endDate: null,
        startDate: null,
        dateQuick: "all",
        flightSearch: null,
        searchDateAdvanced: 0,
        collaboratorCode: null
    };

    $scope.searching = false;

    $scope.pageLoading = true;

    $scope.getStatistical = function () {
        if($scope.queries.searchDateAdvanced && (!$scope.queries.startDate || !$scope.queries.endDate)){
            return;
        }

        $scope.searching = true;
        $scope.pageLoading = true;

        $http.get('/api/flight/?'+$httpParamSerializer($scope.queries)).success(function (response) {
            $scope.responses = response;

            $scope.searching = false;
            $scope.pageLoading = false;
        });
    };

    $scope.getStatistical();

    $scope.$watch('pageLoading', function () {
        if (!$scope.pageLoading) {
            $('#res-view').css('display', 'block');
        }
        else{
            $('#res-view').css('display', 'none');
        }
    });

    $scope.changePageActive = function (page) {
        $scope.queries.page = page;

        $scope.getStatistical();
    };

    $scope.showAndHideSearchDate = function () {
        $scope.queries.searchDateAdvanced = $scope.queries.searchDateAdvanced === 1 ? 0 : 1;
    };

    $scope.highlight = function(text, search) {
        if (!search) {
            return $sce.trustAsHtml(text);
        }
        return $sce.trustAsHtml(text.replace(new RegExp(search, 'gi'), '<span class="highlightedText">$&</span>'));
    };
}]);