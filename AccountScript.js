var app = angular.module('AccountApp', []);
app.controller("displayData", ['$scope', '$http', function ($scope, $http) {
	console.log("hello");
	//var accountId = window.location.search.split("=")[1];
	$scope.loadHello = function() {
		// $scope.initMap();
		console.log("enter hello");
		$http({
			 method: 'POST',
			 url: "http://45.55.3.71:9001/readOne",
			 headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			 transformRequest: function() {
			  var str = [];
			  str.push(encodeURIComponent("collection") + "=" + encodeURIComponent("account"));
			  str.push(encodeURIComponent("_id") + "=" + encodeURIComponent("58fe8463feaf695f6648765b"));//for test only
			 //str.push(encodeURIComponent("_id") + "=" + encodeURIComponent(accountId)); //
			  return str.join("&");
			 }
		}).success(function (response) {
				console.log("success in hello");
				$scope.name = response.fname + " " + response.lname;
				$scope.licensePlateNo = response.licensePlate;
				$scope.phoneNo = response.phone;
				$scope.rewards = response.rewards;
				$scope.zipcode = response.zipcode;
				$scope.getReports();


		}).error(function(){});
	};

	var reportsId = [];	//getting all reports objects under this user
	var linkUrl = [];//collecting link url
	var reportStatus = [];//getting all reports status
	$scope.getReports = function() {
		$http({
			 method: 'POST',
			 url: "http://45.55.3.71:9001/readAll",
			 headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			 transformRequest: function() {
			  var str = [];
			  str.push(encodeURIComponent("collection") + "=" + encodeURIComponent("baddriverreports"));
			  str.push(encodeURIComponent("data") + "=" + encodeURIComponent(JSON.stringify({"postingAccount":$scope.phoneNo})));
			  return str.join("&");
			 }
		}).success(function (response) {
			console.log("getting reports...");
			for(var reportsIndex = 0; reportsIndex < response.length; reportsIndex++){
				reportsId[reportsIndex] = response[reportsIndex]._id;
				linkUrl[reportsIndex] = "http://baddriverreports.com/post-report.html?_id=" + response[reportsIndex]._id;
				// needs to add account_id to Sharath
				reportStatus[reportsIndex] = response[reportsIndex].status;
			}
			$scope.url = reportsId;
			$scope.reportSum = response.length;
			$scope.reportStatus = reportStatus;
		}).error(function(){});

	};
	// $scope.initMap = function() {
	// 	var zipCodeLocation;
	// 	zipCodeLocation = {lat: 34.023, lng: -118.283};
	// 	var map = new google.maps.Map(document.getElementById('map'), {
	// 		zoom: 4,
	// 		center: zipCodeLocation
	// 	});
	// 	var marker = new google.maps.Marker({
	// 		position: zipCodeLocation,
	// 		map: map
	// 	});
	// };

}]);

