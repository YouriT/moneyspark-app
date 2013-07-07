$(function(){
document.addEventListener("deviceready", onDeviceReady, false);
            function onDeviceReady() {
                navigator.splashscreen.hide();
                console.log(parseInt( device.version, 10 ));
                //parseInt( device.version, 10 ) < 4
            }
});