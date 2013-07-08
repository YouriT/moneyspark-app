var Ajax = Class.extend({
  init: function(urlRequest, successCallBack, params, typeRequest, apiKey){
    if(params == undefined || params == "")
        params = {};
    if(typeRequest == undefined || typeRequest == "GET"){
        typeRequest = "GET";
        contentType = "application/json; charset=utf-8"
    }
    else if(typeRequest == "POST"){
        contentType = "application/x-www-form-urlencoded; charset=UTF-8";
    }
    if(apiKey == undefined){
        TableConfiguration = new TableConfiguration();
        TableConfiguration.findValueByKey('apiKey', function(v){
            apiKey=v;
        }, function(e){
            apiKey="";
        });
    }
    $.ajax({
            type: typeRequest,
            data: params,
            headers: {'Api-Key': apiKey},
            url: urlRequest,
            dataType: 'json',
            contentType: contentType,
            crossDomain: true,
            success: successCallBack
            });
    
  }
});


var Login = Class.extend({
    init:function(emailRequest, passwordRequest){
        c = new TableConfiguration();
        params = {email: emailRequest, password: passwordRequest};
        new Ajax("http://api.moneyspark/auth", function(r){ 

            if(r != undefined && r.token != undefined){
                c.insert({key:"token",value:r.token}, function(){ alert("token received"+r.token)}, function(e){})
            }
        }, params, 'POST');
    }
});

$(function(){
   /* new Ajax("http://api.moneyspark/product", 
        function(r){ alert(r); }, "", "GET", "ktVVPqNL2I0viGhv6BNm8xzwG8iF7SuQUxcZhQ6lgukNQfua6zowgwB5KblWoAMVSPuBhG");*/
    
    new Login("lcyril@gmail.com", "lala");

	// PhoneGap is ready
	function onDeviceReady() {

        

        
        //if lastRetrieving from Configuration does not exist OR token invalid = USER IS NOT CONNECTED
        //==>UPDATE table products
        //elseif lastRetrieving exists et trop ancienne et que TOKEN valid
        //==>UPDATE table products, investments, profile
	}
	// Wait for PhoneGap to load
	document.addEventListener("deviceready", onDeviceReady, false);
});