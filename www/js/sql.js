var db = null;

//Database & Tables initialization
var Database = Class.extend({
  init: function(){
    db = window.openDatabase("moneyspark", "1.0", "moneyspark db", 1000000);
    db.transaction(function(tx){
    	tx.executeSql('CREATE TABLE IF NOT EXISTS CFG (id INTEGER NOT NULL, "key" VARCHAR(255), value VARCHAR(255), PRIMARY KEY (id), UNIQUE ("key"))');
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
                        	success(rs.rows.item(0));
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
    			object = $.parseJSON(o);     
                db.transaction(function(tx){
                	tx.executeSql('INSERT INTO CFG VALUES (NULL, "'+object.key+'", "'+object.value+'")');
    			}, function(e){
    				console.log(e.message);
    			}, function(){
    				console.log("Pair key/value successfully added");
    			});
    },
    delete: function(key, success, error){     
                db.transaction(function(tx){
                	tx.executeSql('DELETE FROM CFG WHERE key="'+key+'" ');
    			}, function(e){
    				console.log(e.message);
    			}, function(){
    				console.log("Pair key/value successfully deleted");
    			});
    },
    updateValue: function(key, value, success, error){     
                db.transaction(function(tx){
                	tx.executeSql('UPDATE CFG SET value="'+value+'" WHERE key="'+key+'"');
    			}, function(e){
    				console.log(e.message);
    			}, function(){
    				console.log("Pair key/value successfully updated");
    			});
    }


});


$(function(){

	// PhoneGap is ready
	function onDeviceReady() {    
	    var c = new TableConfiguration();
    	//Find One
	    /*c.findValueByKey("name", function(result) {
	    	console.log("result : "+result["value"])
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