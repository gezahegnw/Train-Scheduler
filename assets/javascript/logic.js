 // Initialize Firebase
 var config = {
  apiKey: "AIzaSyC-meoMUnOwj3WDydGY_s9mhH3pGHc6chE",
  authDomain: "train-schedule-b5c96.firebaseapp.com",
  databaseURL: "https://train-schedule-b5c96.firebaseio.com",
  projectId: "train-schedule-b5c96",
  storageBucket: "train-schedule-b5c96.appspot.com",
  messagingSenderId: "905633595351",
  appId: "1:905633595351:web:a8833f7ea8bef16e"
};
firebase.initializeApp(config);
// Create a variable to reference the database.
var database = firebase.database();
// Global Variables

function checkTime(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

function startTime() {
  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();
  var s = today.getSeconds();
  // add a zero in front of numbers<10
  m = checkTime(m);
  s = checkTime(s);
  document.getElementById('timer').innerHTML = h + ":" + m + ":" + s;
  t = setTimeout(function() {
    startTime()
  }, 500);
}
startTime(); 

  // 2. Button for adding train scheduler
  $("#btn-add").on("click", function(e) {
      e.preventDefault();
  // alert("button cliked");
      // Grabs user input
    var trainName = $("#train-name").val().trim();
    var trainDestination = $("#train-destination").val().trim();
    var firstTrainTime = moment($("#train-time").val().trim(), "HH:mm").subtract(10, "years").format("X");
    var trainFrequency = $("#time-frequency").val().trim();

  // Creates local "temporary" object for holding train schedule data
  var newTrain = {
    nameOfTrain: trainName,
    trainDest: trainDestination,
    trainTime: firstTrainTime,
    trainFrqnc: trainFrequency
  };

  //get timer functioning
    // Uploads train schedule data to the database
    database.ref().push(newTrain);
  
    let trainAdded = document.getElementById('train-added').innerHTML = 'Train has been successfully added';
    document.getElementById('train-added').setAttribute("class", "add-train");
  // alert(" has been successfully added");
      

  // Clears all of the text-boxes
  $("#train-name").val("");
  $("#train-destination").val("");
  $("#train-time").val("");
  $("#time-frequency").val("");

  return false;
  });
  // 3. Create Firebase event for adding train schedule to the database and a row in the html when a user adds an entry
  database.ref().on("child_added", function(childSnapshot) {
  // console.log(childSnapshot.val());
  
  
    // Store everything into a variable.
  var data = childSnapshot.val();
  var nameTrainName = data.nameOfTrain;
  var trainDestination= data.trainDest;
  var trainFrequency= data.trainFrqnc;
  var firstTrain = data.trainTime;
// assign firebase variables to snapshots.


    let tRemainder = moment().diff(moment.unix(firstTrain), "minutes") % trainFrequency;
    let remaingMinutes = trainFrequency - tRemainder;
  //    // To calculate the arrival time, add the remaingMinutes to the currrent time
      let trainArrival = moment().add(remaingMinutes, "m").format("HH:mm");
     // Create the new rowre
    var newRow = $("<tr>").append(
      $("<td>").text(nameTrainName),
      $("<td>").text(trainDestination),
      $("<td>").text(trainFrequency),
      $("<td>").text(remaingMinutes),
      $("<td>").text(trainArrival)

    );

    // Append the new row to the table
    $("#train-table > tbody").append(newRow);


 });