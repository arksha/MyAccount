var app = angular.module('AccountApp', []);
app.controller("displayData", ['$scope', '$http', function ($scope, $http) {
	// console.log("hello");

	var accountId = window.location.search.split("=")[1];
    $scope.stack = [];
    $scope.result = [];
    $scope.stac = [];
    $scope.center_lat='';
    $scope.center_lng='';
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

                if(!response.zipcode || response.zipcode == ""){
                    var address = response.zipcode;
                    var geocoder= new google.maps.Geocoder();
                    geocoder.geocode( { 'address': address}, function(results, status) {

			if (status == google.maps.GeocoderStatus.OK) {
				//console.log("success");
				$scope.center_lat = results[0].geometry.location.lat();
				$scope.center_lng = results[0].geometry.location.lng();

			} else {
				alert("Geocode was not successful for the following reason: " + status);
			}
			// console.log("lat "+$scope.center_lat);
			// console.log("long "+$scope.center_lng);
                    });
		
                }
                else{// if there is no zipcode field or zipcode is invalid set default center to campus
                    $scope.center_lat = "34.022352";
                    $scope.center_lng = "-118.285117";

                }

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


			/* Remove lat-lng coordinates that are older than 30 days. */
            var today =  Date.now();
            var dat = new Date(today - (30 * 24 * 60 * 60 * 1000));
            var dd = dat.getDate();
            var mm = dat.getMonth()+1; //January is 0!
            var yyyy = dat.getFullYear();

            if(dd<10) {
                dd='0'+dd
            }

            if(mm<10) {
                mm='0'+mm
            }

            var expire = mm+'/'+dd+'/'+yyyy;
            //console.log("expire "+expire);

            for(var i = 0; i < response.length; i++) {
                $scope.stac.push(response[i].location.split(',')); /*Has all lat-lng coordinates (including older than 30 days) .*/
                //console.log(response[i].date);
                if(response[i].date > expire){
                    $scope.stack.push(response[i].location.split(',')); /*Has coordinates that are only in the last 30 days.*/
                    //console.log("no expire");
                }
            }
			/* Removing duplicate lat-lng coordinates */
            var lookup = {};
            var items = $scope.stack;
            for( var item, i = 0; item = items[i++];){

                var unique_latlng = item;
                if(!(unique_latlng in lookup)){
                    lookup[unique_latlng] = 1;
                    $scope.result.push(unique_latlng);
                }
            }
        }).error(function(){});

	};


}]);

