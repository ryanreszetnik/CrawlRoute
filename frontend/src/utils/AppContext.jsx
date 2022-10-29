import { createContext, useEffect, useState } from "react";

let appContext = createContext(); // you can optionally pass it a default value // it returns a "provider" object

const loadPlaces = () => {
  const places = JSON.parse(window.localStorage.getItem("places"));
  // console.log(places, "STORAGE");
  if (!!places) {
    return places;
  }
  return [];
};

let AppContext = (props) => {
  const [locations, setLocations] = useState(null);
  useEffect(() => {
    setLocations(loadPlaces());
  }, []);
  const [timeMatrix, setTimeMatrix] = useState([]);
  const [params, setParams] = useState({});
  const [bestRoutes, setBestRoutes] = useState([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [endTime, setEndTime] = useState({ hr: 21, min: 0 });
  const [offsetTimes, setOffsetTimes] = useState([]);
  const [numGroupsPerRoute, setNumGroupsPerRoute] = useState([]);

  return (
    <div>
      <appContext.Provider
        value={{
          locations,
          setLocations,
          timeMatrix,
          setTimeMatrix,
          setParams,
          params,
          bestRoutes,
          setBestRoutes,
          setSelectedRouteIndex,
          selectedRouteIndex,
          setEndTime,
          endTime,
          offsetTimes,
          setOffsetTimes,
          numGroupsPerRoute,
          setNumGroupsPerRoute,
        }}
      >
        {locations !== null && props.children}
      </appContext.Provider>
    </div>
  );
};

export { appContext };
export default AppContext;
