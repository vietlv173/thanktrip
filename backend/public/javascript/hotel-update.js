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

    $scope.banks = [];
    $scope.provinces = [];
    $scope.room_detail = [];

    $scope.currentTpe = $('#tpe-id').val();
    $scope.currentBank = $('#bank-id').val();
    $scope.currentProvince = $('#province-id').val();

    $scope.beds = [
        {
            id: 0, name: 'Chọn loại gường',
        }, {
            id: 1, name: 'TWIN (TWN)',
        }, {
            id: 2, name: 'Double (DBL)',
        }, {
            id: 3, name: 'DBL/TWN',
        }
    ];

    $scope.tpes = [
        {
            id: 3, name: '3 sao',
        }, {
            id: 4, name: '4 sao',
        }, {
            id: 5, name: '5 sao',
        }, {
            id: 6, name: '6 sao',
        }, {
            id: 7, name: 'Resort',
        }, {
            id: 8, name: 'Villa',
        }, {
            id: 9, name: 'Homestay',
        },
    ];

    $scope.service_detail = [];

    $scope.addDetail = function () {
        let maxId = 0;

        for (let i = 0; i < $scope.room_detail.length; i++) {
            if (maxId < $scope.room_detail.id) {
                maxId = $scope.room_detail.id;
            }
        }

        $scope.room_detail.push({
            id: maxId + 1,
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

    $http.get('/json/vietnam-banks.json').then(r => {
        $scope.banks = r.data.banksnapas;

        r.data.banksnapas.forEach(x => {
            if (parseInt(x.bankCode) === parseInt($('#bank-id').val())) {
                $scope.currentBank = x;
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

            let maxId = 0;

            for (let i = 0; i < $scope.room_detail.length; i++) {
                if (maxId < $scope.room_detail.id) {
                    maxId = $scope.room_detail.id;
                }
            }

            for (let i = 0; i < $scope.room_detail.length; i++) {
                if (!('id' in $scope.room_detail[i] && $scope.room_detail[i].id)) {
                    maxId++;

                    $scope.room_detail[i].id = maxId;
                }

                if (i === 0) {
                    $scope.room_detail[i].to = new Date($scope.room_detail[i].to);
                    $scope.room_detail[i].from = new Date($scope.room_detail[i].from);
                }

                $scope.beds.forEach(x => {
                    if (parseInt(x.id) === $scope.room_detail[i].bed_type) {
                        $scope.room_detail[i].bed_type = x;
                    }
                });
            }

            $scope.tpes.forEach(t => {
                if (t.id === parseInt($('#tpe-id').val())) {
                    $scope.currentTpe = t;
                }
            })

            $scope.searching = false;
            $scope.pageLoading = false;
        });
    };

    $scope.getStatistical();
}]);