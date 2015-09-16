'use strict';

angular.module('vtigerChallengeApp')
  .controller('MainCtrl', function ($scope, $http, $sessionStorage, $httpParamSerializerJQLike) {
    $scope.awesomeThings = [{'title':'Vtiger Challenge', 'description':'WebChallenge that uses get method to return a promise', 'status':'Ok'},
    {'title':'Vtiger Session Storage', 'description':'Store the session token on the broswer tab', 'status':'Ok'},
    {'title':'Login Sucess/fail', 'description':'Add the warnings', 'status':'Ok'}
    ];
    $('#loginSuccess').hide();
    $('#loginFail').hide();
    var user;
    var accessKey;
    var domain;
    $scope.userInfo = function (user){
      accessKey = user.keyProfile;
      domain = user.domain;
      user = user.username;

    $http.get(domain+"/webservice.php?operation=getchallenge&username="+user).success(function(data){
      var token = data.result.token;
      var toHash = token+accessKey;
      var hash = md5(toHash);

      $http({
        url:domain+'/webservice.php',
        method:'POST',
        data: $httpParamSerializerJQLike({
          "operation": "login",
          "username": user,
          "accessKey": hash
        }),
        headers:{
          'Content-Type':'application/x-www-form-urlencoded'
        }
      }).success(function(data){
        var loginData = data.result.sessionName;
        $sessionStorage.sessionName = loginData;
        if($sessionStorage){
          $('#loginSuccess').show();
          $('#loginFail').hide;
        }
        else {
          $('#loginFail').show;
          $('#loginSuccess').hide();
        }
      })
      });
    };
  });
