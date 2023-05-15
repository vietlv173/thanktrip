/**
 * Created by vietlv on 6/3/2020.
 */

let hotelUpdateApp = angular.module('hotelUpdateApp', []).run(function ($rootScope) {
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

hotelUpdateApp.controller('hotelUpdateCtrl', ['$scope', '$http', '$httpParamSerializer', function ($scope, $http, $httpParamSerializer) {

    $scope.provinces = [];
    $scope.room_detail = [];

    $scope.currentProvince = $('#province-id').val();

    $scope.beds = [
        {
            id: 1, name: 'TWIN (TWN)',
        }, {
            id: 2, name: 'Double (DBL)',
        }
    ];

    $scope.room_detail = [{
        bed_type: null,
        room_type: null,
        price_normal: null,
        price_weekend: null,
        price_lunar: null,
        from: null,
        to: null,
    }];

    $scope.service_detail = [];

    $scope.addDetail = function () {
        $scope.room_detail.push({
            bed_type: null,
            room_type: null,
            price_normal: null,
            price_weekend: null,
            price_lunar: null,
            from: null,
            to: null,
        });
    }

    $scope.deleteDetail = function (key) {
        if ($scope.room_detail.length > 1) {
            $scope.room_detail.splice(key, 1);
        }
    }

    $scope.addService = function () {
        $scope.service_detail.push({
            title: null,
            price: null,
        });
    }

    $scope.deleteService = function (key) {
        if ($scope.service_detail.length > 1) {
            $scope.service_detail.splice(key, 1);
        }
    }

    $http.get('/json/provinces.json').then(r => {
        $scope.provinces = r.data;

        r.data.forEach(x => {
            if (parseInt(x.code) === parseInt($('#province-id').val())) {
                $scope.currentProvince = x;
            }
        });
    });

    $scope.queries = {
        id: $('#hotelId').val()
    };

    $scope.getStatistical = function () {
        if ($scope.queries.searchDateAdvanced && (!$scope.queries.startDate || !$scope.queries.endDate)) {
            return;
        }

        $scope.searching = true;
        $scope.pageLoading = true;

        $http.get('/api/hotel/?' + $httpParamSerializer($scope.queries)).success(function (response) {
            $scope.room_detail = response.hotels[0].room_detail;

            if ('service_detail' in response.hotels[0]) {
                $scope.service_detail = response.hotels[0].service_detail;
            }

            for (let i = 0; i < $scope.room_detail.length; i++) {
                $scope.room_detail[i].to = new Date($scope.room_detail[i].to);
                $scope.room_detail[i].from = new Date($scope.room_detail[i].from);

                if ($scope.room_detail[i].bed_type === 1) {
                    $scope.room_detail[i].bed_type = {id: 1, name: 'TWIN (TWN)'};
                } else {
                    $scope.room_detail[i].bed_type = {id: 2, name: 'Double (DBL)'};
                }
            }

            $scope.searching = false;
            $scope.pageLoading = false;
        });
    };

    $scope.getStatistical();
}]);