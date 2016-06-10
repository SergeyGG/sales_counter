/**
 * Created by whoishe on 10.06.2016.
 */

var app = angular.module('salesCounter', ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'public/app/views/sales.html',
        controller: 'SalesController'
    });
    $routeProvider.when('/sale/new', {
        templateUrl: 'public/app/views/edit_sale.html',
        controller: 'EditSaleController'
    });
    $routeProvider.when('/sale/:uid', {
        templateUrl: 'public/app/views/show_sale.html',
        controller: 'ShowSaleController'
    });
    $routeProvider.when('/sale/edit/:uid', {
        templateUrl: 'public/app/views/edit_sale.html',
        controller: 'EditSaleController'
    });
});

app.controller('SalesController', ['$scope', '$http', function ($scope, $http) {
    $scope.deleteSale = function (index) {
        if (confirm('Вы действительно хотите удалить продажу?')) {
            $http.get('/sales/delete/' + $scope.sales[index]._id['$oid']).then(function (response) {
                $scope.succ = true;
                console.log(response);
                $scope.sales.splice(index, 1);
            }, function (response) {
                $scope.err = true;
                console.log(response);
            });
        }
    };
    $http.get('/sales').then(function (response) {
        console.log(response.data.sales);
        $scope.sales = response.data.sales;
    });
}]);

app.controller('ShowSaleController', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
    $http.get('/sales/' + $routeParams.uid).then(function (response) {
        console.log(response.data.sale);
        $scope.sale = response.data.sale;
    });
}]);

app.controller('EditSaleController', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
    $scope.createGood = function () {
        $scope.sale.goods.push({'cost': '', 'name': '', 'quantity': ''});
        console.log($scope.sale);
    };
    $scope.removeGood = function (index) {
        $scope.sale.goods.splice(index, 1);
    };
    $scope.saveGood = function () {
        var sale = JSON.parse(JSON.stringify($scope.sale));
        delete sale._id;
        var date = sale.date;
        console.log(date);
        delete sale.date;
        var date_array = date.split('.');
        console.log(date_array[2] + '-' + date_array[1] + '-' + date_array[0]);
        sale.date = date_array[2] + '-' + date_array[1] + '-' + date_array[0];
        console.log(sale.date);
        console.log(sale);
        if (!$routeParams.uid) {
            var action = 'add';
            var id = '';
        }
        else {
            var action = 'edit/';
            var id = $scope.sale._id['$oid'];
        }
        $http.post('/sales/' + action + id, sale).then(function (response) {
            $scope.succ = true;
            console.log(response);
        }, function (response) {
            $scope.err = true;
            console.log(response);
        });
    };
    if (!$routeParams.uid) {
        $scope.sale = {
            'title': '',
            'date': '',
            'number': '',
            'goods': []
        }
    } else {
        $http.get('/sales/' + $routeParams.uid).then(function (response) {
            console.log(response.data.sale);
            sale = response.data.sale;
            var date = sale.date['$date'];
            delete sale.date;
            sale.date = new Date(date).toLocaleString('ru-RU').slice(0, 10);
            $scope.sale = sale;
            $scope.sale = response.data.sale;
        });
    }
}]);


app.filter('count', function () {
    return function (goods) {
        return goods.reduce(function (previousValue, currentItem) {
            return previousValue + currentItem.cost * currentItem.quantity;
        }, 0);
    }
});