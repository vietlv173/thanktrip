/**
 * Created by vietlv on 6/3/2020.
 */

let hotelCrudApp = angular.module('hotelCrudApp', []).run(function ($rootScope) {
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

hotelCrudApp.controller('hotelCrudCtrl', ['$scope', '$http', function ($scope, $http) {

    $scope.responses = {};

    $scope.banks = [];
    $scope.provinces = [];

    $http.get('/json/provinces.json').then(r => {
        $scope.provinces = r.data;
    });

    $http.get('/json/vietnam-banks.json').then(r => {
        $scope.banks = r.data.banksnapas;
    });

    $scope.room_detail = [{
        id: 1,
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
            id: $scope.room_detail.length,
            bed_type: null,
            room_type: null,
            price_normal: null,
            price_weekend: null,
            price_lunar: null,
            from: null,
            to: null,
        });
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

    $scope.deleteDetail = function (key) {
        if ($scope.room_detail.length > 1) {
            $scope.room_detail.splice(key, 1);
        }
    }
}]);