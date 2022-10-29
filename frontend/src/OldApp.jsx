import logo from "./logo.svg";
import "./App.css";
import ControlInputs from "./Components/ControlInputs";
import LocationInputs from "./Components/LocationInputs";
import { useState } from "react";
import GeneratePDF from "./Components/GeneratePDF";

function App() {
  const [timeMatrix, setTimeMatrix] = useState([]);
  const [locations, setLocations] = useState([]);
  const [foodStops, setFoodStops] = useState([]);
  const [doubleStops, setDoubleStops] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [numTeams, setNumTeams] = useState(0);
  const [timeAtStop, setTimeAtStop] = useState(0);

  const onSubmit = (locations, distanceMatrix) => {
    const foodStops = locations
      .map((l, i) => ({ index: i, food: l.food }))
      .filter((l) => l.food)
      .map((l) => l.index);
    const doubleStops = [];
    for (let i = 0; i < locations.length - 1; i++) {
      for (let j = i + 1; j < locations.length; j++) {
        if (locations[i].id == locations[j].id) {
          doubleStops.push([i, j]);
        }
      }
    }

    setDoubleStops(doubleStops);
    setFoodStops(foodStops);
    setLocations(locations);
    setTimeMatrix(distanceMatrix);
    console.log(JSON.stringify(distanceMatrix), JSON.stringify(locations));
  };
  const finalCalculation = (bestCombos, numTeams, timeAtStop) => {
    console.log(bestCombos[0], locations);
    setRoutes(bestCombos[0].routes);
    setNumTeams(numTeams);
    setTimeAtStop(timeAtStop);
  };
  return (
    <div className="App">
      <LocationInputs onSubmit={onSubmit} />
      {timeMatrix.length > 0 && (
        <ControlInputs
          timeMatrix={timeMatrix}
          foodStops={foodStops}
          numFoodStops={foodStops.length}
          numStops={timeMatrix.length}
          duplicates={doubleStops}
          onSubmit={finalCalculation}
        />
      )}
      <GeneratePDF
        timeMatrix={timeMatrix}
        locations={locations}
        routes={routes}
        numTeams={numTeams}
        timeAtStop={timeAtStop}
        endTime={9}
      />
    </div>
  );
}

export default App;
