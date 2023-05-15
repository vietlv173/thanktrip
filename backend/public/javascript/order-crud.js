/**
 * Created by vietlv on 6/3/2020.
 */

let orderCrudApp = angular.module('orderCrudApp', []).run(function ($rootScope) {
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

orderCrudApp.controller('orderCrudCtrl', ['$scope', '$http', '$filter', '$httpParamSerializer', function ($scope, $http, $filter, $httpParamSerializer) {

    $scope.tours = {};
    $scope.hotels = {};

    $scope.minDate1 = [];
    $scope.minDate2 = [];

    $scope.service_detail = [];

    $scope.addDetail = function (service_type) {
        $scope.minDate1.push(new Date());
        $scope.minDate2.push(new Date());

        if (service_type === 1) {
            $scope.service_detail.push({
                service_type: 1,
                start: null,
                tour_id: null,
                surcharge: null,
                commission: null,
                detail: []
            });
        } else if (service_type === 2) {
            $scope.service_detail.push({
                service_type: 2,
                start: null,
                end: null,
                surcharge: null,
                commission: null,
                hotel_id: null,
                detail: [],
                services: [],
            });
        } else {
            $scope.service_detail.push({
                service_type: 3,
                flight_id: null,
                quantity: null,
                price: null,
                commission: null,
            });
        }
    }

    $scope.updateMinDate2 = function (detail, key) {
        $scope.minDate2[key] = detail.from;
    }

    $scope.deleteDetail = function (key) {
        if ($scope.service_detail.length > 1) {
            $scope.service_detail.splice(key, 1);
        }
    }

    $scope.queries = {
        status: 2
    };

    $scope.selectTour = function (detail) {
        detail.detail = [];
        for (let i = 0; i < $scope.tours.length; i++) {
            if ($scope.tours[i]._id === detail.tour_id) {
                let tour = $scope.tours[i];
                detail.surcharge = tour.surcharge;
                detail.commission = tour.commission;
                for (let j = 0; j < tour.price_detail.length; j++) {
                    let detail2 = tour.price_detail[j];
                    detail.detail.push({
                        title: (detail2.age_type === 1 ? 'Người lớn' : 'Trẻ con') + ' từ ' + detail2.from + ' đến ' + detail2.to + ' tuổi',
                        from: detail2.from,
                        to: detail2.to,
                        price_normal: detail2.price_normal,
                        price_weekend: detail2.price_weekend,
                        price_lunar: detail2.price_lunar,
                        quantity: 0,
                        price_type: 1
                    });
                }
                break;
            }
        }
    }

    $scope.selectHotel = function (detail) {
        detail.detail = [];
        detail.services = [];
        for (let i = 0; i < $scope.hotels.length; i++) {
            if ($scope.hotels[i]._id === detail.hotel_id) {
                let hotel = $scope.hotels[i];
                detail.surcharge = hotel.surcharge;
                detail.commission = hotel.commission;
                for (let j = 0; j < hotel.room_detail.length; j++) {
                    let detail2 = hotel.room_detail[j];
                    detail.detail.push({
                        title: detail2.room_type + ', ' + (detail2.bed_type === 1 ? 'TWIN (TWN)' : 'Double (DBL)'),
                        price_normal: detail2.price_normal,
                        price_weekend: detail2.price_weekend,
                        price_lunar: detail2.price_lunar,
                        quantity: 0,
                        price_type: 1
                    });
                }

                for (let j = 0; j < hotel.service_detail.length; j++) {
                    let detail3 = hotel.service_detail[j];
                    detail.services.push({
                        title: detail3.title,
                        price: detail3.price,
                        quantity: 0,
                    });
                }

                break;
            }
        }

        console.log(detail);
    }

    $scope.getTours = function () {
        $http.get('/api/tour/?' + $httpParamSerializer($scope.queries)).success(function (response) {
            $scope.tours = response.tours;
        });
    };

    $scope.getHotels = function () {
        $http.get('/api/hotel/?' + $httpParamSerializer($scope.queries)).success(function (response) {
            $scope.hotels = response.hotels;
        });
    };

    $scope.tpe = null;

    $scope.getTours();
    $scope.getHotels();
    $scope.getHotels();

    $scope.getStatistical = function (orderId) {

        $http.get('/api/order/?' + $httpParamSerializer({
            id: orderId
        })).success(function (response) {
            $scope.responses = response;

            $scope.service_detail = response.orders[0].service_detail;

            for (let i = 0; i < $scope.service_detail.length; i++) {
                $scope.service_detail[i].to = new Date($scope.service_detail[i].to);
                $scope.service_detail[i].from = new Date($scope.service_detail[i].from);
            }
        });
    };

    let orderId = $('#orderId').val();

    if (orderId) {
        $scope.getStatistical(orderId);
    }
}]);