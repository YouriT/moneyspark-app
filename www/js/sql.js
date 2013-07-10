/*global Class*/
/*global console*/
var db = null;

//Database & Tables initialization
var Database = Class.extend({
  init: function(){
    db = window.openDatabase("moneyspark", "1.0", "moneyspark db", 1000000);
    db.transaction(function(tx){
        //Mode debug
        // tx.executeSql('DROP TABLE IF EXISTS CFG');
        // tx.executeSql('DROP TABLE IF EXISTS PRODUCTS');
    	tx.executeSql('CREATE TABLE IF NOT EXISTS CFG (id INTEGER NOT NULL,"key" VARCHAR(255), value VARCHAR(255),PRIMARY KEY (id), UNIQUE ("key"))');
        tx.executeSql('CREATE TABLE IF NOT EXISTS PRODUCTS (id INTEGER NOT NULL, title VARCHAR(255), hedgefundTitle VARCHAR(255), dateBeginExpected VARCHAR(25), dateEndExpected VARCHAR(25), description TEXT, profitsRateExpected DOUBLE, lossRateExpected DOUBLE, sumInvestedAmounts DOUBLE, requiredAmount DOUBLE, PRIMARY KEY (id))');
    }, function(e){
    	console.log(e.message);
    }, function(){
    	console.log("Database and its tables successfully initializated");
    });
  }
});


var TableConfiguration = Class.extend({
  init: function(){
  	if(db==null)
  		new Database();
    //this.dancing = isDancing;
  },
  findAll: function(success, error){     
                db.transaction(function(tx) {
                    tx.executeSql('SELECT * FROM CFG', [],function(tx, rs) {
                        success(rs.rows); 
                    }, function(tx, e) {
                        error(e); 
                    });
                });
    },
    findValueByKey: function(key, success, error){     
                db.transaction(function(tx) {
                    tx.executeSql('SELECT * FROM CFG WHERE key="'+key+'"', [],function(tx, rs) {
                    	if(rs.rows.length == 1){
                        	success(rs.rows.item(0)["value"]);
                        }
                        else
                        {
                        	e = new Object();
                        	e.message = "key not found";
                        	error(e);
                        }

                    }, function(tx, e) {
                        error(e); 
                    });
                });
    },
    insert: function(o, success, error){
    			//object = $.parseJSON(o);
                object = o;
                db.transaction(function(tx){
                	tx.executeSql('INSERT INTO CFG VALUES (NULL, "'+object.key+'", "'+object.value+'")');
    			}, function(e){
                    error(e);
    			}, function(){
    				success();
    			});
    },
    delete: function(key, success, error){     
                db.transaction(function(tx){
                	tx.executeSql('DELETE FROM CFG WHERE key="'+key+'" ');
    			}, function(e){
    				error(e);
    			}, function(){
    				success();
    			});
    },
    updateValue: function(key, value, success, error){     
                db.transaction(function(tx){
                	tx.executeSql('UPDATE CFG SET value="'+value+'" WHERE key="'+key+'"');
    			}, function(e){
    				error(e);
    			}, function(){
    				success();
    			});
    }


});


var TableProducts = Class.extend({
  init: function(){
    if(db==null)
        new Database();
    //this.dancing = isDancing;
  },
  findAll: function(success, error){     
                db.transaction(function(tx) {
                    tx.executeSql('SELECT * FROM PRODUCTS', [],function(tx, rs) {
                        success(rs.rows); 
                    }, function(tx, e) {
                        error(e); 
                    });
                });
    },
   insertAll: function(products, success, error){
                this.deleteAll(function(){
                    db.transaction(function(tx){
                        for (var i = 0; i < products.length; i++)
                        {

                            object = products[i];
                            console.log("Product "+object.product.title+" added to database");
                            tx.executeSql("INSERT INTO PRODUCTS VALUES (NULL, ?, ?, '"+object.product.dateBeginExpected.date+"', '"+object.product.dateEndExpected.date+"', ?, '"+object.product.profitsRateExpected+"', '"+object.product.lossRateExpected+"', '"+object.product.sumInvestedAmounts+"', '"+object.product.requiredAmount+"')",
                                [object.product.title,
                                object.hedgefund.title,
                                object.product.description]
                            );
                        }
                    }, function(e){
                        error(e);
                    }, function(){
                        success();
                    });
                }, function(e){});
    },
    deleteAll: function(success, error){     
                db.transaction(function(tx){
                    tx.executeSql('DELETE FROM PRODUCTS');
                }, function(e){
                    console.log("All products from db not deleted because "+e.message);
                    error(e);
                }, function(){
                    success();
                    console.log("All products from db deleted");
                });
    }


});


$(function(){

	// PhoneGap is ready
	function onDeviceReady() {    
	    // var c = new TableConfiguration();
    	//Find One
	    /*c.findValueByKey("name", function(v) {
	    	console.log("result : "+v)
    	}, function(e){
    		console.log("error : "+e.message)
    	});*/

    	//Insert one
    	//c.insert('{"key": "philosophy","value": "16"}', function(){}, function(e){ });
    	//c.insert('{"key": "age","value": "25"}', function(){}, function(e){ });
    	//c.insert('{"key": "age2","value": "16"}', function(){}, function(e){ });

    	//Delete one
    	//c.delete('philosophy', function(){}, function(e){ });

	    //Find all
	   /* c.findAll(function(results) {
	    	console.log("results"+results.length)
    	}, function(e){
    		console.log("errorCode : "+e.message)
    	});*/

	    //Update
	    //c.updateValue('philosophy', 'mynewphilosophy', function(){}, function(e){ });

	}
	// Wait for PhoneGap to load
	document.addEventListener("deviceready", onDeviceReady, false);
});