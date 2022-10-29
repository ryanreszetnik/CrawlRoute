import React, { useContext, useEffect } from "react";
import { useMemo } from "react";
import ControlInputs from "../Components/ControlInputs";
import Loading from "../Components/Loading";
import LocationPreview from "../Components/LocationPreview";
import ParamInputs from "../Components/ParamInputs";
import { getAcurateBestRoutes, getBestRoutes } from "../utils/api";
import { appContext } from "../utils/AppContext";

export default function ParameterInputs({ onSubmit }) {
  const { locations, timeMatrix, setBestRoutes } = useContext(appContext);
  const [loading, setloading] = React.useState(false);

  const foodStops = useMemo(
    () =>
      locations
        .map((s, i) => ({
          s,
          i,
        }))
        .filter((l) => l.s.food)
        .map((l) => l.i),
    [locations]
  );
  const doubleStops = useMemo(
    () =>
      locations
        .map((s, i) => ({
          s,
          i,
        }))
        .filter((l) => l.s.double)
        .map((l) => l.i),
    [locations]
  );

  const handleSubmit = async (params) => {
    console.log(params);
    setloading(true);
    const req = {
      ...params,
      foodStops,
      doubleStops,
      timeMatrix,
      ignoreFirstStop: locations.some((l) => l.first),
      ignoreLastStop: locations.some((l) => l.last),
    };

    try {
      const res = await getAcurateBestRoutes(req);
      if (res.error) {
        alert(res.error);
      } else {
        setBestRoutes(res);
        onSubmit();
      }
      console.log(res);
    } catch (e) {
      console.log(e);
      alert(
        "Was not able to compute routes within 30s max time, please adjust the parameters and try again"
      );
    }

    setloading(false);
  };
  if (loading) {
    return <Loading message="This can take up to 30s to complete" />;
  }
  return (
    <div style={{ padding: "20px" }}>
      {/* <div>{JSON.stringify(submitParams)}</div> */}
      <div style={{ display: "flex", paddingBottom: "10px" }}>
        {locations.map((l, i) => (
          <LocationPreview
            key={i}
            location={l}
            stopNumber={
              (i !== 0 || !locations[0].first) &&
              (i !== locations.length - 1 ||
                !locations[locations.length - 1].last)
                ? i + locations.filter((l, j) => j < i && l.double).length
                : null
            }
          />
        ))}
      </div>

      <ParamInputs
        timeMatrix={timeMatrix}
        numFoodStops={
          foodStops.length + locations.filter((l) => l.food && l.double).length
        }
        includeFirst={!locations.some((l) => l.first)}
        includeLast={!locations.some((l) => l.last)}
        numStops={locations.length + doubleStops.length}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
