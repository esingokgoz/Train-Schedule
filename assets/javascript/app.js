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

  var trainName, trainDest, startTrain, trainFrequency = "";
  
  //add train on click event
  $("#addTrain").on("click", function(event) {
    event.preventDefault();
  
    trainName = $("#trainName").val().trim();
    trainDest = $("#destination").val().trim();
    startTrain = $("#firstTrain").val().trim();
    trainFrequency = $("#frequency").val().trim();

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
  
    //push data to db
    var newTrain = {
      name: trainName,
      destination: trainDest,
      firstTrain: startTrain,
      frequency: trainFrequency
    };
    console.log("New train info: " + newTrain);

    database.ref().push(newTrain);
  
    $("#trainName").val("");
    $("#destination").val("");
    $("#firstTrain").val("");
    $("#frequency").val("");
  });
  
  database.ref().on("child_added", function(childSnapshot) {
    // console.log(childSnapshot.val());
    console.log("inside childadded");

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
  
    var currentTime = moment();
    console.log("current time is: " + currentTime);
    

    var tRemainder = moment().diff(moment.unix(firstTrain), "minutes") % frequency;
    console.log("time remainder " + tRemainder);

    var tMinutes = frequency - tRemainder;
    console.log("time minutes " + tMinutes);
  
    // To calculate the arrival time, add the tMinutes to the currrent time
    var tArrival = moment().add(tMinutes, "m").format("hh:mm A");
    console.log("time arrival " +tArrival);
  
    // Create the new row
    var newRow = $("<tr>").append(
      $("<td>").text(trainName),
      $("<td>").text(destination),
      $("<td>").text(frequency),
      $("<td>").text(tArrival),
      $("<td>").text(tMinutes)
    );
  
    // Append the new row to the table
    $("#train-schedule > tbody").append(newRow);
  });