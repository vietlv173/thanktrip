/**
 * Created by vietlv on 6/3/2020.
 */

let hotelApp = angular.module('hotelApp', ["xeditable"]).run(function ($rootScope) {
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

hotelApp.controller('hotelCtrl', ['$scope', '$http', '$filter', '$httpParamSerializer', '$sce', function ($scope, $http, $filter, $httpParamSerializer, $sce) {

    $scope.responses = {};

    $scope.provinces = [];

    $http.get('/json/provinces.json').then(r => {
        $scope.provinces = r.data;
    });

    let roomDetailDefault = {
        bed_type: null,
        room_type: null,
        price_normal: null,
        price_weekend: null,
        price_lunar: null,
        from: null,
        to: null,
    };

    $scope.room_detail = [roomDetailDefault];

    $scope.addDetail = function () {
        $scope.room_detail.push(roomDetailDefault);
    }

    $scope.deleteDetail = function (key) {
        if ($scope.room_detail.length > 1) {
            $scope.room_detail.splice(key, 1);
        }
    }

    $scope.queries = {
        page: 1,
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
        {value: 2, text: 'Mở bán'},
        {value: 3, text: 'Đã đóng'}
    ];

    $scope.showStatus = function (status) {
        let selected = $filter('filter')($scope.statuses, {value: status});
        return (status && selected.length) ? selected[0].text : 'Not set';
    };

    $scope.updateStatus = function (id, data) {
        return $http.post('/api/hotel/update-status', {id: id, status: data});
    };

    $scope.getStatistical = function () {
        if ($scope.queries.searchDateAdvanced && (!$scope.queries.startDate || !$scope.queries.endDate)) {
            return;
        }

        $scope.searching = true;
        $scope.pageLoading = true;

        $http.get('/api/hotel/?' + $httpParamSerializer($scope.queries)).success(function (response) {
            $scope.responses = response;

            $scope.searching = false;
            $scope.pageLoading = false;
        });
    };

    $scope.getStatistical();

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

    $scope.showAndHideSearchDate = function () {
        $scope.queries.searchDateAdvanced = $scope.queries.searchDateAdvanced === 1 ? 0 : 1;
    };

    $scope.highlight = function (text, search) {
        if (!search) {
            return $sce.trustAsHtml(text);
        }
        return $sce.trustAsHtml(text.replace(new RegExp(search, 'gi'), '<span class="highlightedText">$&</span>'));
    };
}]);