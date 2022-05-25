function newXMLHttpRequest() {
    var request = null;
    var browser = navigator.userAgent.toUpperCase();
    if(typeof(XMLHttpRequest) === "function" || typeof(XMLHttpRequest) === "object") {
        request = new XMLHttpRequest();
    } else if(window.ActiveXObject && browserUtente.indexOf("MSIE 4") < 0) {
        if(browser.indexOf("MSIE 5") < 0) {
            request = new ActiveXObject("Msxml2.XMLHTTP");
        } else {
            request = new ActiveXObject("Microsoft.XMLHTTP");
        }
    }
    return request;
}