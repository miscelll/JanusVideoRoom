
var seatStatusImg = {'free' : 'assets/img/seat_free_deselected.svg',
                    'locked' : 'assets/img/seat_locked.svg',
                    'booked' : 'assets/img/seat_booked.svg',
                    'selected' : 'assets/img/seat_free_selected.svg',
                    'deselected' : 'assets/img/seat_free_deselected.svg'};


//QUERY UPDATE

function toggleSeatCell(seatDiv){

    verifyToken(isVerified=>{
        if(!isVerified) return;
    });

    var seatImg = seatDiv.childNodes[1].childNodes[0].src;
    var seatLabel = seatDiv.childNodes[3].childNodes[0];
    var row = seatLabel.innerText[0].charCodeAt(0)-65;
    var column = Number(seatLabel.innerText.substring(1,seatLabel.innerText.length))-1;
    var seat = {row: row, column: column};

    //Seat deselected
    if(seatImg.includes('assets/img/seat_free_selected.svg')){
        updateSeatStatus(row, column, false);
        seatDiv.childNodes[1].childNodes[0].src = 'assets/img/seat_free_deselected.svg';
        const index = selectedSeats.findIndex(x => x.row == row && x.column == column);
        if (index !== undefined) selectedSeats.splice(index, 1);
        
    //Seat selected
    }else if(seatImg.includes('assets/img/seat_free_deselected.svg')){
        updateSeatStatus(row, column, true);
        seatDiv.childNodes[1].childNodes[0].src = 'assets/img/seat_free_selected.svg';
        selectedSeats.push(seat);
    }
}


function updateSeatStatus(row, column, isSelected){

    var req = newXMLHttpRequest();
    req.onreadystatechange = function() {
        if (req.readyState == 4) {
            if(req.status==200){
                //TODO
            }else{
                //TODO 
            }
        }
    }
    req.open("POST","/updateSeatStatus",true);

    var params = {
        "schedule": selectedSchedule, 
        "isSelected" : isSelected,
        "user": JSON.parse(userInfo)._id,
        "row": row,
        "column": column};

    req.setRequestHeader("Content-Type","application/json"); 
    req.send(JSON.stringify(params));
}

//LISTNER UPDATE

function seatLockManager(row, column, seatStatus){

    var userId = userInfo == null? "":
     JSON.parse(userInfo)._id;

    var temp = row + column;

    switch (seatStatus) {
        case "free":
            $("[name='"+temp+"'").attr('src', seatStatusImg['free']);
            const index = selectedSeats.findIndex(x => x.row == row && x.column == column);
            if (index !== undefined) selectedSeats.splice(index, 1);
            break;
        case "booked":
            $("[name='"+temp+"'").attr('src', seatStatusImg['booked']);
            break;
        case userId:
            break;
        default:
            $("[name='"+temp+"'").attr('src', seatStatusImg['locked']);
            break;
      }
}


function attachListener(){
    socket = io.connect('http://localhost:8080', {reconnection: false});
    socket.emit('attachListener');
    socket.on("seats", function(seatsMod){

        if(seatsMod.seatsId == selectedSeatsId){
            var seatsSplitted = Object.keys(seatsMod.seats)[0].split('.');
            var seatStatus = seatsMod.seats[Object.keys(seatsMod.seats)[0]];
            var row = seatsSplitted[1];
            var column = seatsSplitted[2];  
            
            seatLockManager(row, column, seatStatus);
        }
    })
}