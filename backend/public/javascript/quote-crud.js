/**
 * Created by vietlv on 6/3/2020.
 */

let quoteCrudApp = angular.module('quoteCrudApp', []).run(function ($rootScope) {
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

quoteCrudApp.controller('quoteCrudCtrl', ['$scope', '$http', '$filter', '$httpParamSerializer', function ($scope, $http, $filter, $httpParamSerializer) {

    $scope.hotels = {};
    $scope.hotels1 = {};
    $scope.details = [];
    $scope.provinces = [];

    $http.get('/json/provinces.json').then(r => {
        $scope.provinces = r.data;
    });

    $scope.deleteDetail = function (key) {
        if ($scope.details.length > 1) {
            $scope.details.splice(key, 1);
        }
    }

    $scope.downloadPdf = function (id) {
        let link = document.createElement('a');
        link.href = '/uploads/quotes/' + id + '.pdf';
        link.download = id + '.pdf';
        link.dispatchEvent(new MouseEvent('click'));
    }

    $scope.queries = {
        status: 2
    };

    $scope.hotelSearch = {
        title: null,
        province_id: null,
        hotelSelectedList: []
    }

    $scope.hotelSearchSubmit = function () {
        $scope.hotelSearch.hotelSelectedList = [];

        $scope.hotels = $scope.hotels1.filter(h => h.province_id === parseInt($scope.hotelSearch.province_id));
    }

    $scope.onSelectHotel = function (id) {
        if ($scope.hotelSearch.hotelSelectedList.includes(id)) {
            for (let i = 0; i < $scope.hotelSearch.hotelSelectedList.length; i++) {
                if ($scope.hotelSearch.hotelSelectedList[i] === id) {
                    $scope.hotelSearch.hotelSelectedList.splice(i, 1);
                }
            }
        } else {
            $scope.hotelSearch.hotelSelectedList.push(id);
        }
    }

    $scope.onConfirmSelectHotel = function () {
        for (let i = 0; i < $scope.hotelSearch.hotelSelectedList.length; i++) {
            $scope.addHotel($scope.hotelSearch.hotelSelectedList[i]);
        }

        $scope.hotelSearch.hotelSelectedList = [];

        $('#myModal').modal('hide');
    }

    $scope.addHotel = function (hotel_id, rooms = []) {
        let detail = {
            title: '',
            rooms: [],
            services: [],
            hotel_id: hotel_id
        }

        for (let i = 0; i < $scope.hotels.length; i++) {
            if ($scope.hotels[i]._id === hotel_id) {
                let hotel = $scope.hotels[i];
                detail.hotel = hotel;
                detail.title = hotel.title;
                for (let j = 0; j < hotel.room_detail.length; j++) {
                    let detail2 = hotel.room_detail[j];
                    detail.rooms.push({
                        id: detail2.id,
                        title: detail2.room_type + ', ' + (detail2.bed_type === 1 ? 'TWIN (TWN)' : 'Double (DBL)'),
                        price_normal: detail2.price_normal + hotel.surcharge,
                        price_weekend: detail2.price_weekend + hotel.surcharge,
                        price_lunar: detail2.price_lunar + hotel.surcharge,
                        visible: rooms.includes(hotel.room_detail[j].id)
                    });
                }

                for (let j = 0; j < hotel.service_detail.length; j++) {
                    let detail3 = hotel.service_detail[j];
                    detail.services.push({
                        title: detail3.title,
                        price: detail3.price,
                    });
                }

                break;
            }
        }

        $scope.details.push(detail);
    }

    $scope.getHotels = function () {
        $http.get('/api/hotel/?' + $httpParamSerializer($scope.queries)).success(function (response) {
            $scope.hotels = response.hotels;
            $scope.hotels1 = response.hotels;
        });
    };

    $scope.tpe = null;

    $scope.getHotels();

    $scope.getStatistical = function (quoteId) {
        $http.get('/api/quote/?' + $httpParamSerializer({
            id: quoteId
        })).success(function (response) {
            $scope.responses = response;

            for (let i = 0; i < response.quotes[0].details.length; i++) {
                let detail = response.quotes[0].details[i];

                $scope.addHotel(detail.hotel_id, detail.rooms);
            }
        });
    };

    let quoteId = $('#quoteId').val();

    if (quoteId) {
        $scope.getStatistical(quoteId);
    }
}]);