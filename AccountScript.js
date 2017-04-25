var app = angular.module('AccountApp', []);
app.controller("displayData", ['$scope', '$http', function ($scope, $http) {
	console.log("hello");
	var accountId = window.location.search.split("=")[1];
	$scope.loadHello = function() {
		// $scope.initMap();
		// console.log("enter hello");
		$http({
			 method: 'POST',
			 url: "http://45.55.3.71:9001/readOne",
			 headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			 transformRequest: function() {
			  var str = [];
			  str.push(encodeURIComponent("collection") + "=" + encodeURIComponent("account"));
			  // str.push(encodeURIComponent("_id") + "=" + encodeURIComponent("58a68347466990761ce43f3b"));//for test only
			 str.push(encodeURIComponent("_id") + "=" + encodeURIComponent(accountId)); //
			  return str.join("&");
			 }
		}).success(function (response) {
				// console.log("success in hello");
				$scope.name = response.fname + " " + response.lname;
				$scope.licensePlateNo = response.licensePlate;
				$scope.phoneNo = response.phone;
				$scope.rewards = response.rewards;
				$scope.zipcode = response.zipcode;
				$scope.getReports();


		}).error(function(){});
	};

	var reportsIdList = [];	//getting all reports objects under this user
	var AllReportsUrlList = [];//collecting link url
	var failedUrlList = [];//failed reports url list
	var successUrlList = [];//success reports url list
	var pendingUrlList = [];//under audit prograss reports url list

    var reportsIndex;// All reports url index, remove later if no use
	var pendingUrlIndex;// pending reports url index
	var passedUrlIndex;// passed reports url index
	var failedUrlIndex;//failed reports url index
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
			// console.log("getting reports...");
            pendingUrlIndex = 0;
            passedUrlIndex = 0;
            failedUrlIndex = 0;
			for(reportsIndex = 0; reportsIndex < response.length; reportsIndex++){
                //TODO: the link should be only view mode, now the link is connected to the report page
                reportsIdList[reportsIndex] = response[reportsIndex]._id;
                if(response[reportsIndex].status == "uploaded") {// collect pending reports
					pendingUrlList[pendingUrlIndex++] = "http://baddriverreports.com/post-report.html?_id=" + reportsIdList[reportsIndex];//test only
                    //add account_id to Sharath, when get dynamic account, use below
					// pendingUrlList[pendingUrlIndex++] = "http://baddriverreports.com/post-report.html?_id=" + reportsIdList[reportsIndex] + "?" + accountId;

                }
                if(response[reportsIndex].status == "reported") {// collect passed reports
                    successUrlList[passedUrlIndex++] = "http://baddriverreports.com/post-report.html?_id=" + reportsIdList[reportsIndex];//test only
                    //add account_id to Sharath, when get dynamic account, use below
                    // successUrlList[passedUrlIndex++] = "http://baddriverreports.com/post-report.html?_id=" + reportsIdList[reportsIndex] + "?" + accountId;

                }
                if(response[reportsIndex].status == "reported") {// collect failed reports
                    failedUrlList[failedUrlIndex++] = "http://baddriverreports.com/post-report.html?_id=" + reportsIdList[reportsIndex];//test only
                    //add account_id to Sharath, when get dynamic account, use below
                    // failedUrlList[failedUrlIndex++] = "http://baddriverreports.com/post-report.html?_id=" + reportsIdList[reportsIndex] + "?" + accountId;

                }

                //collect all reports under this account, remove later if no use
                AllReportsUrlList[reportsIndex] = "http://baddriverreports.com/post-report.html?_id=" + reportsIdList[reportsIndex];//for test
				//add account_id to Sharath, when get dynamic account, use below
				//AllReportsUrlList[reportsIndex] = "http://baddriverreports.com/post-report.html?_id=" + reportsIdList[reportsIndex] + "?" + accountId;
				// reportStatusList[reportsIndex] = response[reportsIndex].status;
			}
            $scope.reportSum = response.length;
			$scope.pendingSum = pendingUrlList.length;
			$scope.passedSum = successUrlList.length;
			$scope.failedSum = failedUrlList.length;
			$scope.allReportsUrl = AllReportsUrlList;
            $scope.pendingReportsUrl = pendingUrlList;
			$scope.passedReportsUrl = successUrlList;
			$scope.failedReportsUrl = failedUrlList;
		}).error(function(){});

	};
	// leave it alone, maybe later will move initMap script from HTML page to here
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

