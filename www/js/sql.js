function populateDB(tx) {
     //tx.executeSql('DROP TABLE IF EXISTS CFG');
     tx.executeSql('CREATE TABLE IF NOT EXISTS CFG (INTEGER id, TEXT key, TEXT val, PRIMARY KEY(id ASC), unique(key))');
     tx.executeSql('INSERT INTO CFG (id, key, val) VALUES ('', "key name", "my val")');
}

function errorCB(err) {
    alert("Error processing SQL: "+err.code);
}

function successCB() {
    alert("success!");
}

// PhoneGap is ready
function onDeviceReady() {
    var db = window.openDatabase("moneyspark", "1.0", "moneyspark db", 1000000);
    db.transaction(populateDB, errorCB, successCB);
}
// Wait for PhoneGap to load
document.addEventListener("deviceready", onDeviceReady, false);
