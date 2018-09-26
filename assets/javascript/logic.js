  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCdf-MWRF-tyhgauPeIK2CqScsaUg0b54I",
    authDomain: "train-scheduler-74719.firebaseapp.com",
    databaseURL: "https://train-scheduler-74719.firebaseio.com",
    projectId: "train-scheduler-74719",
    storageBucket: "train-scheduler-74719.appspot.com",
    messagingSenderId: "908607121482"
  };
  firebase.initializeApp(config);
 // Create a variable to reference the database.
 var database = firebase.database();
  // Global Variables


    // 2. Button for adding Employees
    $("#btn-add").on("click", function(event) {
        event.preventDefault();
    // alert("button cliked");
        // Grabs user input
      var trainName = $("#train-name").val().trim();
      var trainDestination = $("#train-destination").val().trim();
      var firstTrainTime = moment($("#train-time").val().trim(), "MM:mm").subtract(1, "years").format("X");
      var trainFrequency = $("#time-frequency").val().trim();

    // Creates local "temporary" object for holding employee data
    var newTrain = {
      nameOfTrain: trainName,
      trainDest: trainDestination,
      trainTime: firstTrainTime,
      trainFrqnc: trainFrequency
    };
    var currentTime = moment();
  
    //get timer functioning
      // Uploads employee data to the database
      database.ref().push(newTrain);
      var currentTime = moment($("#timer").text(currentTime.format("hh:mm a")));

    // alert(newTrain.nameOfTrain + " has been successfully added");
        // Logs everything to console
    console.log(newTrain.nameOfTrain);
    console.log(newTrain.trainDest);
    console.log(newTrain.trainTime);
    console.log(newTrain.trainFrqnc);


    // Clears all of the text-boxes
    $("#train-name").val("");
    $("#train-destination").val("");
    $("#train-time").val("");
    $("#time-frequency").val("");

    return false;
    });
    // 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
    database.ref().on("child_added", function(childSnapshot) {
    // console.log(childSnapshot.val());

      // Store everything into a variable.
      var data = childSnapshot.val();
      var nameTrainName = data.nameOfTrain;
      var trainDestination= data.trainDest;
      var firstTrainTime = data.trainTime;
      var trainFrequency= data.trainFrqnc;

      let tRemainder = moment().diff(moment.unix(firstTrainTime), "minutes") % trainFrequency;
        let tMinutes = trainFrequency - tRemainder;

        // To calculate the arrival time, add the tMinutes to the currrent time
        let trainArrival = moment().add(tMinutes, "m").format("hh:mm A");

        // Create the new row
      var newRow = $("<tr>").append(
        $("<td>").text(nameTrainName),
        $("<td>").text(trainDestination),
        $("<td>").text(trainFrequency),
        $("<td>").text(tMinutes),
        $("<td>").text(trainArrival)
      );

      // Append the new row to the table
      $("#train-table > tbody").append(newRow);





    });