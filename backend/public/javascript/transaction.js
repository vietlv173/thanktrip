/**
 * Created by vietlv on 6/3/2020.
 */

let transactionApp = angular.module('transactionApp', []).run(function ($rootScope) {
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

transactionApp.controller('transactionCtrl', ['$scope', '$http', '$httpParamSerializer', function ($scope, $http, $httpParamSerializer) {
    $scope.tranId = null;
    $scope.status = null;
    $scope.previewImage = null;

    $scope.selectTran = function (tranId, status) {
        $scope.tranId = tranId;
        $scope.status = status;
    }

    $scope.selectPreviewImage = function (image) {
        $scope.previewImage = image;
    }

    $scope.updateStatus = function () {
        const files = document.getElementById("input-file");
        const formData = new FormData();
        formData.append('image', files.files[0]);

        let settings = {
            "url": "/api/transaction/update-status/" + $scope.tranId + "/" + $scope.status,
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": formData
        };

        $.ajax(settings).done(function () {
            window.location.reload();
        });
    };

    $scope.responses = {};

    $scope.queries = {
        page: 1,
        status: "all"
    };

    $scope.getStatistical = function () {
        $scope.searching = true;
        $scope.pageLoading = true;

        $http.get('/api/transaction/index?' + $httpParamSerializer($scope.queries)).success(function (response) {
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
}]);