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

    function ajaxMe() {
        if (apiKey !== undefined) {
            $.ajaxSetup({
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('api-key',apiKey);
                    console.log('called');
                }
            });
        }
        $.ajax({
            type: typeRequest,
            data: params,
            url: "http://api.reonin.com/"+urlRequest,
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

    if(apiKey === undefined){
        TableConfiguration.findValueByKey('token', function(v){
            apiKey=v;
            ajaxMe();
        }, function(e){
            apiKey="";
            ajaxMe();
        });
    }
    else
        ajaxMe();
    
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
    i:null,
    pwd:null,
    set:function(input){
        this.i = input;
    },
    validate:function(){
        var dateDDMMYYYRegex = /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/;
        var emailRegex = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i;
        var phoneNumberRegex = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})([0-9]{3})/;
        if(this.i.is("input[type=text]") && this.i.val()==""){
            return "Please fill in this field";
        }
        if(this.i.is("input[name=terms]") && this.i.val()==0){
            return "notAccepted";
        }
        else if( this.i.attr("name") == "birthDate" && !this.i.val().match(dateDDMMYYYRegex)){
            return "Your birthdate seems to be incorrect";
        }
        else if( this.i.attr("name") == "email" && !this.i.val().match(emailRegex) ){
            return "You email seems to be incorrect";
        }
        else if( this.i.attr("name") == "phone" && !this.i.val().match(phoneNumberRegex) ){
            return "Your phonenumber seems to be incorrect";
        }
        else if( this.i.attr("name") == "password" && this.i.val().length < 6 ){
            return "Your password is too short";
        }
        else if(this.i.attr("name") == "password" && this.i.val().length >= 6){
            this.pwd = this.i.val();
            return "good";
        }
        else if( this.i.attr("name") == "passwordconf" && this.pwd != this.i.val() ){
            return "Please confirm the same password";
        }
        else
            return "good";
    }
});

var Subscribe = Input.extend({
    data:null,
    setData:function(inputs){
        data = inputs;
    },
    send:function(successCallBack, errorCallBack){
        new Ajax("Register", successCallBack, inputs, 'POST');
    }
});


var updateProfile = function updateProfile(r){
    c = new TableConfiguration();
    function insertV(k, v, successCallBack){
        c.insert({key:k,value:v}, function(){ console.log("Update "+k+" "+v); successCallBack(); })
    };
    function updateV(k, v, successCallBack){
        c.updateValue(k,v, function(){ console.log("Insert "+k+" "+v); successCallBack(); })
    };
    c.findValueByKey("firstName", function(r){ updateV("firstName", r.firstName); }, function(e){ insertV("firstName", r.firstName); });
    c.findValueByKey("lastName", function(r){ updateV("lastName", r.lastName); }, function(e){ insertV("lastName", r.lastName); });
    c.findValueByKey("lockboxAmount", function(r){ updateV("lockboxAmount", r.lockboxAmount); }, function(e){ insertV("lockboxAmount", r.lockboxAmount); });
    c.findValueByKey("averageRentability", function(r){ updateV("averageRentability", r.averageRentability); }, function(e){ insertV("averageRentability", r.averageRentability); });
    updateLastRetrieving("meGranted");
};

var updateInvestments = function updateInvestments(r){
    updateLastRetrieving("investmentsGranted");
};


var updateLastRetrieving = function updateLastRetrieving(granted){
    var d = new Date();
    var n = d.getTime();
    c.findValueByKey("lastRetrieving", function(v){
        c.updateValue("lastRetrieving", n, function(){ $(window).trigger(granted);}, function(e){});
    }, function(e){
        c.insert({key:"lastRetrieving",value:n}, function(){ $(window).trigger(granted);}, function(e){});
    });
};


var Retrieve = function retrieve(force) {
        if(force == undefined)
            force = true;
        var d = new Date();
        var n = d.getTime();
        c.findValueByKey("lastRetrieving", function(v){
            if( (v < (n-(3600000*6))) || force ){
                //Update products
                new Ajax("Product", function(r){p.insertAll(r, function(){updateLastRetrieving("productsGranted")}, function(e){});});
                //if token exists, UPDATE investments, profile
                 c.findValueByKey("token", function(v){ new Ajax("Profile/me", function(r){ updateProfile(r); updateInvestments(r);  }); }, function(e){});
            }
            else
            {
                c.findValueByKey("token", function(v){ updateLastRetrieving("meGranted"); updateLastRetrieving("investmentsGranted")  }, function(e){});
                updateLastRetrieving("productsGranted");
            }
        }, function(e){ //if lastRetrieving does not exists
            //Update only table products, insert lastRetrieving products
            new Ajax("Product", function(r){
                p.insertAll(r, function(){ 
                    updateLastRetrieving("productsGranted");
                 }, function(e){
                    //Error products not added
                 });
            });
        });

    };

$(window).load(function () {
    $(window).on('askRetrieve', function(){ Retrieve(); })
});