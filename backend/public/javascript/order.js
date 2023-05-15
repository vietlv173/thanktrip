/**
 * Created by vietlv on 6/3/2020.
 */

let orderApp = angular.module('orderApp', ["xeditable"]).run(function ($rootScope) {
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

orderApp.controller('orderCtrl', ['$scope', '$http', '$filter', '$httpParamSerializer', '$sce', function ($scope, $http, $filter, $httpParamSerializer, $sce) {

    $scope.responses = {};
    $scope.responses2 = {};

    $scope.queries = {
        page: 1,
        child: false,
        status: "all",
        endDate: null,
        startDate: null,
        dateQuick: "all",
        flightSearch: null,
        searchDateAdvanced: 0,
        collaboratorCode: null
    };

    $scope.queries2 = {
        page: 1,
        child: true,
        status: "all",
        endDate: null,
        startDate: null,
        dateQuick: "all",
        flightSearch: null,
        searchDateAdvanced: 0,
        collaboratorCode: null
    };

    $scope.searching = false;

    $scope.pageLoading = true;

    $scope.statuses = [
        {value: 1, text: 'Pending'},
        {value: 2, text: 'Đã thanh toán'},
        {value: 3, text: 'Đã hoàn thành'},
        {value: 4, text: 'Đã hủy'}
    ];

    $scope.showStatus = function (status) {
        let selected = $filter('filter')($scope.statuses, {value: status});
        return (status && selected.length) ? selected[0].text : 'Not set';
    };

    $scope.updateStatus = function (id, data) {
        return $http.post('/api/order/update-status', {id: id, status: data});
    };

    $scope.getStatistical = function () {
        $scope.searching = true;
        $scope.pageLoading = true;

        $http.get('/api/order/?' + $httpParamSerializer($scope.queries)).success(function (response) {
            $scope.responses = response;

            $scope.searching = false;
            $scope.pageLoading = false;
        });
    };

    $scope.getStatistical2 = function () {
        $scope.searching = true;
        $scope.pageLoading = true;

        $http.get('/api/order/?' + $httpParamSerializer($scope.queries2)).success(function (response) {
            $scope.responses2 = response;

            $scope.searching = false;
            $scope.pageLoading = false;
        });
    };

    $scope.getStatistical();
    $scope.getStatistical2();

    $scope.$watch('pageLoading', function () {
        if (!$scope.pageLoading) {
            $('#res-view').css('display', 'block');
        } else {
            $('#res-view').css('display', 'none');
        }
    });

    $scope.changePageActive = function (page) {
        $scope.queries.page = page;

        $scope.getStatistical();
    };

    $scope.changePageActive2 = function (page) {
        $scope.queries2.page = page;

        $scope.getStatistical2();
    };

    $scope.highlight = function (text, search) {
        if (!search) {
            return $sce.trustAsHtml(text);
        }
        return $sce.trustAsHtml(text.replace(new RegExp(search, 'gi'), '<span class="highlightedText">$&</span>'));
    };
}]);