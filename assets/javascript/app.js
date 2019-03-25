// Initialize Firebase
var config = {
    apiKey: "AIzaSyCRY0Mt2f3YWwT4BWjojHu7-zp5H73ysSE",
    authDomain: "train-schedule-eg.firebaseapp.com",
    databaseURL: "https://train-schedule-eg.firebaseio.com",
    projectId: "train-schedule-eg",
    storageBucket: "train-schedule-eg.appspot.com",
    messagingSenderId: "725773838864"
};
firebase.initializeApp(config);

var database = firebase.database();

var trainName, trainDest, startTrain  = "";
var trainFrequency = 0;

//add train on click event
$("#addTrain").on("click", function (event) {
    event.preventDefault();

    //grab user input
    trainName = $("#trainName").val().trim();
    trainDest = $("#destination").val().trim();
    startTrain = $("#firstTrain").val().trim();
    trainFrequency = $("#frequency").val().trim();

    //alert user if fields are blank
    if (trainName == "") {
        alert("Enter a train name.");
        return false;
    }
    if (trainDest == "") {
        alert("Enter a destination.");
        return false;
    }
    if (startTrain == "") {
        alert("Enter a first train time.");
        return false;
    }
    if (trainFrequency == "") {
        alert("Enter a frequency");
        return false;
    }

    //create local temp object for holding train data
    var newTrain = {
        name: trainName,
        destination: trainDest,
        firstTrain: startTrain,
        frequency: trainFrequency
    };
    console.log("New train info: " + newTrain.name);

    //upload train data to the db
    database.ref().push(newTrain);

    //clear all text boxes
    $("#trainName").val("");
    $("#destination").val("");
    $("#firstTrain").val("");
    $("#frequency").val("");
});

database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var destination = childSnapshot.val().destination;
    var firstTrain = childSnapshot.val().firstTrain;
    var frequency = childSnapshot.val().frequency;

    // train info
    console.log(trainName);
    console.log(destination);
    console.log(firstTrain);
    console.log(frequency);


    var timeConverted = moment(firstTrain, "hh:mm").subtract(1, "years");
    var timeDiff = moment().diff(moment(timeConverted), "minutes");
    console.log(timeDiff);

    var tRemainder = timeDiff % frequency;
    console.log(tRemainder);

    var tArrival = frequency - tRemainder;
    console.log(tArrival);

    var tMinutes = moment().add(tArrival, "minutes");

    var newRow = $("<tr>").append(
            $("<td>").text(trainName),
            $("<td>").text(destination),
            $("<td>").text(frequency),
            $("<td>").text(tArrival),
            $("<td>").text(tMinutes)
        );


    // var tRemainder = moment().diff(moment.unix(firstTrain), "minutes") % frequency;
    // console.log("time remainder " + tRemainder);

    // var tMinutes = frequency - tRemainder;
    // console.log("time minutes " + tMinutes);

    // // To calculate the arrival time, add the tMinutes to the currrent time
    // var tArrival = moment().add(tMinutes, "m").format("hh:mm A");
    // console.log("time arrival " + tArrival);

    // // Create the new row
    // var newRow = $("<tr>").append(
    //     $("<td>").text(trainName),
    //     $("<td>").text(destination),
    //     $("<td>").text(frequency),
    //     $("<td>").text(tArrival),
    //     $("<td>").text(tMinutes)
    // );

    // Append the new row to the table
    $("#train-schedule > tbody").append(newRow);
});