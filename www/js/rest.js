//Global variables
var TableConfiguration = c = new TableConfiguration();
var p = new TableProducts();
//var nav = navigator = null;

var Ajax = Class.extend({
  currentRetry:0,
  init: function(urlRequest, successCallBack, params, typeRequest, apiKey){
    aj = this;
    if(params == undefined || params == "")
        params = {};
    if(typeRequest == undefined || typeRequest == "GET"){
        typeRequest = "GET";

/*        if(urlRequest.indexOf("product") !== -1){
            nav.globalization.getLocaleName(function (locale) {
                urlRequest = urlRequest+"?locale="+locale.value;
            }, function () {
                urlRequest = urlRequest+"?locale=en_US";
            });

        }*/

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
            url: "http://api.moneyspark/"+urlRequest,
            dataType: 'json',
            contentType: contentType,
            crossDomain: true,
            success: function(r){ 
                if(r.error != undefined  && r.error.code == 1200){ 
                    TableConfiguration.delete("token", function(){ console.log("token deleted because expired"); }, function(e){ console.log("error while deleting expired token"); }); 
                } else{ successCallBack(r); }  0
            },
            error: function(){
                aj.currentRetry++;
                if(aj.currentRetry == 5){
                    console.log("Request "+urlRequest+" stopped");
                }
                else
                {
                    aj.init(urlRequest, successCallBack, params, typeRequest, apiKey);
                    console.log("Request "+urlRequest+" retried");
                }
                
            }
            });
    
  }
});

var Auth = Class.extend({
    login:function(emailRequest, passwordRequest, successCallBack, errorCallBack){
        params = {email: emailRequest, password: passwordRequest};
        new Ajax("Auth", function(r){ 
            if(r != undefined && r.token != undefined){

                c.findValueByKey("token", function(v){
                    c.delete("token", function(){ console.log("old token deleted from database"); c.insert({key:"token",value:r.token}, function(){ console.log("Token "+r.token+" added to database"); $(window).trigger('askRetrieve'); successCallBack(); }, function(e){ console.log("token not added"); }); }, function(e){});
                }, function(e){
                    c.insert({key:"token",value:r.token}, function(){ console.log("Token "+r.token+" added to database"); $(window).trigger('askRetrieve'); successCallBack(); }, function(e){ console.log("token not added"); });
                });
            }
            else
            {
                errorCallBack();
            }
        }, params, 'POST');
    }
});


var Input = Class.extend({
    inp:null,
    pwd:null,
    set:function(input){
        this.inp = input;
    },
    validate:function(){
        var ibanValidator = function($v){ 
                            function isValidIBAN($v){ //This function check if the checksum if correct
                                $v = $v.replace(/^(.{4})(.*)$/,"$2$1"); //Move the first 4 chars from left to the right
                                $v = $v.replace(/[A-Z]/g,function($e){return $e.charCodeAt(0) - 'A'.charCodeAt(0) + 10}); //Convert A-Z to 10-25
                                var $sum = 0;
                                var $ei = 1; //First exponent 
                                for(var $i = $v.length - 1; $i >= 0; $i--){
                                    $sum += $ei * parseInt($v.charAt($i),10); //multiply the digit by it's exponent 
                                    $ei = ($ei * 10) % 97; //compute next base 10 exponent  in modulus 97
                                }; 
                                return $sum % 97 == 1;
                            }
                            return /^BE\d{14}$/.test($v) && isValidIBAN($v);        
                }
        var dateDDMMYYYRegex = '^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$';
        var emailRegex = '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$';
        var phoneNumberRegex = /[0-9-()+]{3,20}/;
        if(this.inp.is("input[type=text]") && this.inp.val()=="")
            return "empty";
        if(this.inp.attr("name") == "birthdate" && !this.inp.val().match(dateDDMMYYYRegex))
            return "badRegex";
        if(this.inp.attr("name") == "email" && !this.inp.val().match(emailRegex))
            return "badRegex";
        if(this.inp.attr("name") == "phone" && !this.inp.val().match(phoneNumberRegex))
            return "badRegex";
        if(this.inp.attr("name") == "iban" && !ibanValidator(this.inp.val()))
            return "badRegex";
        if(this.inp.attr("name") == "password" && this.inp.val().length < 6)
            return "badRegex";
        if(this.inp.attr("name") == "passwordConfirm" && this.pwd != this.inp.val() )
            return "badConfirm";
        return "good";
    }
});

var Subscribe = Input.extend({
    data:null,
    setData:function(inputs){
        data = inputs;
    },
    send:function(successCallBack, errorCallBack){
        /*new Ajax()
        function(urlRequest, successCallBack, params, typeRequest, apiKey)*/
    }
});


var Retrieve = function retrieve() {
        console.log("Trying to retrieve contents");
        //if lastRetrieving exists && too old
        c.findValueByKey("lastRetrieving", function(v){
            var d = new Date();
            var n = d.getTime();
            if(v < (n-(3600000*6)) ){
                //Update products and lastRetrieving
                new Ajax("Product", function(r){
                    p.insertAll(r, function(){ 
                        //Products added, now update lastRetrieving
                        c.updateValue("lastRetrieving", n, function(){
                            $(window).trigger('productsGranted');
                            console.log("Table products updated");
                        }, function(e){})
                     }, function(e){
                        //Error products not added
                     });
                });
                //if token exists, UPDATE investments, profile
            }
            else
            {
                $(window).trigger('productsGranted');
            }
        }, function(e){ //if lastRetrieving does not exists
            //==>UPDATE only table products, insert lastRetrieving products
        });
    };

$(window).load(function () {
    $(window).on('askRetrieve', function(){ Retrieve(); })
});