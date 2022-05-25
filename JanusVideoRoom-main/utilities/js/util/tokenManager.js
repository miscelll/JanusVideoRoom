
 function verifyToken(callback){
            
    var req = newXMLHttpRequest();

    req.onreadystatechange = function() {
        if (req.readyState == 4) {
            if(req.status==200){
                callback(true);
            }else{
                if(req.status == 400 || req.status == 401){
                    swal({title: "Warning", text: "Login to book a ticket", icon: "warning"})
                    .then(function(){
                        window.sessionStorage.setItem("bookTicket","bookTicket");
                        window.location = "/login.html";
                        callback(false);
                    });
                }
            }
        }
    }
    req.open("GET","/verifyTkn",true);
    req.setRequestHeader("auth-token",window.sessionStorage.getItem("auth-token"));
    req.send();
}