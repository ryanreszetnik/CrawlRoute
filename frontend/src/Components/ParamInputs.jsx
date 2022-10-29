import { Button, Typography } from "@mui/material";
import React, { useState } from "react";
import { useContext } from "react";
import { useMemo } from "react";
import { appContext } from "../utils/AppContext";
import {
  getRouteOrders,
  getRouteTimes,
  getTimeFilteredPaths,
} from "../utils/route.utils";
import SliderInput from "./SliderInput";

const getInitialParams = (numStops, includeFirst, includeLast, appParams) => {
  const defaults = {
    numBetweenDouble: 0,
    numBetweenFood: 0,
    foodRange: [
      includeFirst ? 0 : 1,
      includeLast ? numStops - 1 : numStops - 2,
    ],
    walkRange: [2, 20],
    maxTotalTime: 240,
    timeAtStop: 10,
    numRoutes: 2,
    numGroups: 20,
  };

  const params = {
    ...appParams,
    ...(appParams.hasOwnProperty("foodRange")
      ? {
          foodRange: appParams.foodRange.map((x) => x + 1),
        }
      : {}),
  };
  return { ...defaults, ...params };
};

export default function ParamInputs({
  numFoodStops,
  numStops,
  timeMatrix,
  onSubmit,
  includeFirst,
  includeLast,
}) {
  const AppContext = useContext(appContext);
  const [params, setParams] = useState(
    getInitialParams(numStops, includeFirst, includeLast, AppContext.params)
  );
  const walkingNumPaths = useMemo(
    () =>
      getTimeFilteredPaths(
        timeMatrix,
        params.walkRange[0],
        params.walkRange[1]
      ),
    [timeMatrix, params.walkRange]
  );
  const allCrawlRoutes = useMemo(
    () =>
      getRouteTimes(
        getRouteOrders(timeMatrix.length, includeFirst, includeLast),
        timeMatrix,
        AppContext.locations.filter((l) => l.double).length,
        params.timeAtStop
      ),
    [timeMatrix, params.timeAtStop, includeFirst, includeLast]
  );
  const numValidRoutes = useMemo(
    () => allCrawlRoutes.filter((t) => t <= params.maxTotalTime).length,
    [allCrawlRoutes, params.maxTotalTime]
  );
  const handleSubmit = () => {
    const submittingParams = {
      ...params,
      foodRange: [params.foodRange[0] - 1, params.foodRange[1] - 1],
    };
    AppContext.setParams(submittingParams);
    onSubmit(submittingParams);
  };
  const updateParam = (param, value) => {
    setParams({ ...params, [param]: value });
  };
  const maxMinStopsBetweenFood =
    numFoodStops == 1
      ? 0
      : Math.floor(
          (params.foodRange[1] - params.foodRange[0]) / (numFoodStops - 1) - 1
        );

  return (
    <div>
      <Typography sx={{ fontSize: 30 }}>Route Parameters</Typography>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <SliderInput
          label="Walking Time Between Stops"
          value={params.walkRange}
          setValue={(val) => updateParam("walkRange", val)}
          min={0}
          max={60}
          isTime
          rightLabel={`(${walkingNumPaths.count}/${walkingNumPaths.total}) paths`}
        />
        <SliderInput
          label="Time At Stop"
          value={params.timeAtStop}
          setValue={(val) => updateParam("timeAtStop", val)}
          min={1}
          max={60}
          isTime
        />
        <SliderInput
          label="# Walking Teams"
          value={params.numGroups}
          setValue={(val) => updateParam("numGroups", val)}
          min={1}
          max={50}
        />

        <SliderInput
          label="# Routes"
          value={params.numRoutes}
          setValue={(val) => updateParam("numRoutes", val)}
          min={1}
          max={5}
          marks
        />
        <SliderInput
          label="Max Individual Crawl Time"
          value={params.maxTotalTime}
          setValue={(val) => updateParam("maxTotalTime", val)}
          min={0}
          max={420}
          isTime
          rightLabel={`(${numValidRoutes}/${allCrawlRoutes.length}) routes`}
        />
      </div>
      <Typography sx={{ fontSize: 30 }}>Food and Double Stops</Typography>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <SliderInput
          label="Food Stop Number Range"
          value={params.foodRange}
          setValue={(val) => updateParam("foodRange", val)}
          min={includeFirst ? 0 : 1}
          max={includeLast ? numStops - 1 : numStops - 2}
          marks
        />

        {numFoodStops > 1 && (
          <SliderInput
            label="Min # Stops Between Food Stops"
            value={params.numBetweenFood}
            setValue={(val) => updateParam("numBetweenFood", val)}
            min={0}
            max={maxMinStopsBetweenFood}
            marks
          />
        )}
        <SliderInput
          label="Min # Stops Between Duplicates"
          value={params.numBetweenDouble}
          setValue={(val) => updateParam("numBetweenDouble", val)}
          min={0}
          max={numStops - 4}
          marks
        />
      </div>
      <Button variant="contained" size="large" onClick={handleSubmit}>
        Submit
      </Button>
    </div>
  );
}
