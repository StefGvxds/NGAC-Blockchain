        //Activate handleErrorPSC eventlistener to listen for event Messages
        //handleErrorPSC();

          // Errormessage
  const handleErrorPSC = () => {
    if (!PSC) {
      console.error("PSC is not initialized yet.");
      return;
    }

    PSC.getPastEvents(
      "StringEvent",
      {
        fromBlock: 0,
        toBlock: "latest",
      },
      function (error, events) {
        console.log(events);
      }
    ).then(function (events) {
      console.log(events);
    });
  };


  <div>_______________________</div>
  <div>
    <button className="generalButton" onClick={handleErrorPSC}>
      Error Feedback?
    </button>
  </div>