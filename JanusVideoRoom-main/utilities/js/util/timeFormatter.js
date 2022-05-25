function formatTime(time){

    var splittedTime = time.split('T');

    var date = splittedTime[0];
    var hour = splittedTime[1].substring(0,5);

    return date + " " + hour;
}
