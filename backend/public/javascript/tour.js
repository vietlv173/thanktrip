/**
 * Created by vietlv on 6/3/2020.
 */

let tourApp = angular.module('tourApp', ["xeditable"]).run(function ($rootScope) {
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

tourApp.controller('tourCtrl', ['$scope', '$http', '$filter', '$httpParamSerializer', '$sce', function ($scope, $http, $filter, $httpParamSerializer, $sce) {

    $scope.responses = {};
    $scope.provinces = [];

    $scope.toId = null;
    $scope.fromId = null;

    let priceDetailDefault = {
        age_type: {id: 1, name: 'Người lớn'},
        price_normal: null,
        price_weekend: null,
        price_lunar: null,
        from: null,
        to: null,
    };

    $scope.price_detail = [priceDetailDefault];

    $scope.addDetail = function () {
        $scope.price_detail.push(priceDetailDefault);
    }

    $scope.deleteDetail = function (key) {
        if ($scope.price_detail.length > 1) {
            $scope.price_detail.splice(key, 1);
        }
    }

    $scope.queries = {
        page: 1,
        status: "all",
        id: $('#tourId').val()
    };

    $http.get('/json/provinces.json').then(r => {
        $scope.provinces = r.data;

        r.data.forEach(x => {
            if (parseInt(x.code) === parseInt($('#from-id').val())) {
                $scope.fromId = x;
            }

            if (parseInt(x.code) === parseInt($('#to-id').val())) {
                $scope.toId = x;
            }
        });
    });

    $scope.searching = false;

    $scope.pageLoading = true;

    $scope.statuses = [
        {value: 1, text: 'Pending'},
        {value: 2, text: 'Mở bán'},
        {value: 3, text: 'Đã đóng'}
    ];

    $scope.ages = [
        {
            id: 1, name: 'Người lớn',
        }, {
            id: 2, name: 'Trẻ em',
        }
    ];

    $scope.showStatus = function (status) {
        let selected = $filter('filter')($scope.statuses, {value: status});
        return (status && selected.length) ? selected[0].text : 'Not set';
    };

    $scope.updateStatus = function (id, data) {
        return $http.post('/api/tour/update-status', {id: id, status: data});
    };

    $scope.getStatistical = function () {
        if ($scope.queries.searchDateAdvanced && (!$scope.queries.startDate || !$scope.queries.endDate)) {
            return;
        }

        $scope.searching = true;
        $scope.pageLoading = true;

        $http.get('/api/tour/?' + $httpParamSerializer($scope.queries)).success(function (response) {
            $scope.responses = response;

            if ($('#tourId').val()) {
                $scope.price_detail = response.tours[0].price_detail;

                for (let i = 0; i < $scope.price_detail.length; i++) {
                    if ($scope.price_detail[i].age_type === 1) {
                        $scope.price_detail[i].age_type = {id: 1, name: 'Người lớn'};
                    } else {
                        $scope.price_detail[i].age_type = {id: 2, name: 'Trẻ em'};
                    }
                }
            }

            $scope.searching = false;
            $scope.pageLoading = false;
        });
    };

    $scope.getTours = function () {
        $http.get('/api/tour/?' + $httpParamSerializer({status: 2})).success(function (response) {
            $scope.tours = response;
        });
    };

    $scope.getTours();
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