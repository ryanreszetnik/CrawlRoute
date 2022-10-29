import React, { useContext } from "react";
import LocationInputs from "../Components/LocationInputs";
import { appContext } from "../utils/AppContext";

export default function LocationSelection({ onSubmit }) {
  const AppContext = useContext(appContext);
  const handleSubmit = (locations, timeMatrix) => {
    AppContext.setLocations(locations);
    AppContext.setTimeMatrix(timeMatrix);
    onSubmit();
  };
  return (
    <div style={{ paddingBottom: "150px" }}>
      <LocationInputs
        initialLocations={AppContext.locations}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
