var Ajax = Class.extend({
  init: function(urlRequest, successCallBack, params, typeRequest, apiKey){
    TableConfiguration = new TableConfiguration();
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
            success: function(r){ 
                if(r.error != undefined  && r.error.code == 1200){ 
                    TableConfiguration.delete("token", function(){ console.log("token deleted because expired"); }, function(e){ console.log("error while deleting expired token"); }); 
                } else{ successCallBack(r); }  0
            }
            });
    
  }
});

var Auth = Class.extend({
    init:function(emailRequest, passwordRequest){
        c = new TableConfiguration();
        params = {email: emailRequest, password: passwordRequest};
        new Ajax("http://api.moneyspark/auth", function(r){ 
            if(r != undefined && r.token != undefined){
                c.insert({key:"token",value:r.token}, function(){
                     console.log("Token "+r.token+" added to database");
                }, function(e){ console.log("token not added"); });
            }
        }, params, 'POST');
    }
});



$(function(){
   /* new Ajax("http://api.moneyspark/product", 
        function(r){ alert(r); }, "", "GET", "ktVVPqNL2I0viGhv6BNm8xzwG8iF7SuQUxcZhQ6lgukNQfua6zowgwB5KblWoAMVSPuBhG");*/
    c = new TableConfiguration();
	// PhoneGap is ready
	function onDeviceReady() {
        new Auth("lcyril@gmail.com", "lala");

        //if lastRetrieving exists && too old
        c.findValueByKey("lastRetrieving", function(v){
            var d = new Date();
            var n = d.getTime();
            if(v < (n-3600*6)){
                //==>UPDATE table products, update lastRetrieving products
                //if token exists, UPDATE investments, profile
            }
        }, function(e){ //if lastRetrieving does not exists
            //==>UPDATE only table products, insert lastRetrieving products
        });

	}
	// Wait for PhoneGap to load
	document.addEventListener("deviceready", onDeviceReady, false);
});