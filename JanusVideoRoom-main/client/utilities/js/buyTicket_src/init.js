
$(document).ready(function(){
    navbarToggle();
    if(movieSchedule == null){
        swal({title: "Schedule not found", text: "Please select another movie", icon: "error"})
        .then(function(){
            window.location="index.html";
        });
    }

    window.sessionStorage.removeItem("bookTicket");
    $("#paypal-button-container").hide();

    for(index in movieSchedule){
        if(!availableTheater.includes(movieSchedule[index].theater))
            availableTheater.push(movieSchedule[index].theater);            
    }

    var theaterDropdown = $('#theater_menu');
    $.each(availableTheater, function(val, text) {
        theaterDropdown.append(
            $('<a class="dropdown-item" onclick= "theaterSelected(this)" ></a>').val(val).html(text)
        );
    });
});


function theaterSelected(item){
    //Clean-up
    $("#tableSeatRow").empty();
    $("#theater_button").text(item.text);
    $("#time_button").prop("disabled", false);
    $("#time_button").css("background", "#f4476b" );
    $("#time_button").text('Time');

    selectedSeats = [];
    var availableTime = [];

    for(index in movieSchedule){
        if(movieSchedule[index].theater == item.text){
            var time = formatTime(movieSchedule[index].time);  
            availableTime.push(time);  
        }          
    }

    var timeDropdown = $('#time_menu').empty();
    $.each(availableTime, function(val, text) {
        timeDropdown.append(
            $('<a class="dropdown-item" onclick= "timeSelected(this)" ></a>').val(val).html(text)
        );
    });
}


function timeSelected(item){
    //Clean-up
    $("#tableSeatRow").empty();
    $("#paypal-button-container").show();
    $("#time_button").text(item.text);

    for(index in movieSchedule){             
        if(movieSchedule[index].theater == $('#theater_button').text() && formatTime(movieSchedule[index].time) == $('#time_button').text() ){
            selectedSchedule = movieSchedule[index].schedule;

            var req = newXMLHttpRequest();
            req.onreadystatechange = function() {
                if (req.readyState == 4) {
                    if(req.status==200){
                        price = JSON.parse(req.response).price;
                        selectedSeatsId = JSON.parse(req.response)._id;
                        populateTableSeat(JSON.parse(req.response).status);
                        attachListener();
                    }else{
                        //TODO: Manage error status codes
                    }
                }
            }
            req.open("GET","/seats?schedule="+selectedSchedule,true);
            req.send();
        }            
    }
}


function populateTableSeat(seats){

    var userId = userInfo == null? "": JSON.parse(userInfo)._id;

    for(i in seats){
        for(j in seats[i]){

            var seatCell = document.querySelector('#seatCell');
            if(seats[i][j] == "free" || seats[i][j] == "booked") {
                seatCell.content.querySelector('#seatImg').src = seatStatusImg[seats[i][j]];
            }else if(seats[i][j] != String(userId)){
                seatCell.content.querySelector('#seatImg').src = seatStatusImg['locked'];
            }else{
                seatCell.content.querySelector('#seatImg').src = seatStatusImg['selected'];
                selectedSeats.push({row:i, column:j});
            }

            seatCell.content.querySelector('#seatImg').name = String(i)+String(j);
            var column = Number(j) + 1
            seatCell.content.querySelector('#seatLabel').innerText = String.fromCharCode(65+Number(i)) + column;
            var cloneCell = document.importNode(seatCell.content, true); 
            $('#tableSeatRow').append(cloneCell);
        }
    }
    $('#paypal-button-container').empty();
    initPayPalButton();
}