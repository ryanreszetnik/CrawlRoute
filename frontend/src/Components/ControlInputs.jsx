import React from "react";
import { Slider, Switch, Box, Typography, Button } from "@mui/material";
import SliderInput from "./SliderInput";
import { useEffect } from "react";
import {
  getAllCrawlTimeRoutes,
  getNumPossibilities,
  getNumValidWalkingTimes,
  getOverallNumPossibleRoutes,
} from "../utils/estimations";
import { getBestCombosInOrder } from "../utils/getRoutes";

export default function ControlInputs({
  timeMatrix,
  foodStops,
  numStops,
  numFoodStops,
  duplicates,
  onSubmit,
}) {
  const [walkingRange, setWalkingRange] = React.useState([1, 25]);
  const [timeAtStop, setTimeAtStop] = React.useState(10);
  const [maxCrawlTime, setMaxCrawlTime] = React.useState(210);
  const [numRoutes, setNumRoutes] = React.useState(1);
  const [numWalking, setNumWalking] = React.useState(20);
  const [foodStopRange, setFoodStopRange] = React.useState([1, numStops]);
  const [stopsBetweenFood, setStopsBetweenFood] = React.useState(1);
  const [numRunning, setNumRunning] = React.useState(0);
  const [runningSpeedMultiplier, setRunningSpeedMultiplier] =
    React.useState(1.6);
  const [runningCrawlTime, setRunningCrawlTime] = React.useState([60, 120]);
  const [runningTimeAtStop, setRunningTimeAtStop] = React.useState(5);
  const [runningSendOffInterval, setRunningSendOffInterval] =
    React.useState(10);
  const [stopsBetweenDuplicates, setStopsBetweenDuplicates] = React.useState(2);
  //Calculated Values
  const [numValidWalkingTimes, setNumValidWalkingTimes] = React.useState(0);
  const [numCrawlTimeRoutes, setNumCrawlTimeRoutes] = React.useState(0);
  const [overallNumRoutes, setOverallNumRoutes] = React.useState(0);
  const maxMinStopsBetweenFood =
    numFoodStops == 1
      ? 0
      : Math.floor(
          (foodStopRange[1] - foodStopRange[0]) / (numFoodStops - 1) - 1
        );
  const [changed, setChanged] = React.useState(false);
  const handleChange = () => {
    if (!changed) {
      return;
    }
    console.log("change");
    if (maxMinStopsBetweenFood < stopsBetweenFood) {
      setStopsBetweenFood(maxMinStopsBetweenFood);
    }
    setNumValidWalkingTimes(getNumValidWalkingTimes(timeMatrix, walkingRange));
    setNumCrawlTimeRoutes(
      getAllCrawlTimeRoutes(timeMatrix, maxCrawlTime, timeAtStop, numWalking)
    );
    setOverallNumRoutes(
      getOverallNumPossibleRoutes(
        timeMatrix,
        foodStops,
        maxCrawlTime,
        timeAtStop,
        walkingRange,
        numWalking,
        foodStopRange,
        stopsBetweenFood,
        numRoutes,
        duplicates,
        stopsBetweenDuplicates
      )
    );
  };

  const finalCalulations = async () => {
    onSubmit(
      getBestCombosInOrder(
        timeMatrix,
        foodStops,
        maxCrawlTime,
        timeAtStop,
        walkingRange,
        numWalking,
        foodStopRange,
        stopsBetweenFood,
        numRoutes,
        duplicates,
        stopsBetweenDuplicates
      ),
      numWalking,
      timeAtStop
    );
  };

  return (
    <div style={{ width: "fit-content" }}>
      <Typography sx={{ fontSize: "20px" }}>General Parameters</Typography>
      <Typography>{overallNumRoutes}</Typography>
      <SliderInput
        label="Walking Time Between Stops"
        value={walkingRange}
        setValue={setWalkingRange}
        min={0}
        max={60}
        isTime
        rightLabel={numValidWalkingTimes}
      />
      <SliderInput
        label="Time At Stop"
        value={timeAtStop}
        setValue={setTimeAtStop}
        min={1}
        max={60}
        isTime
      />
      <SliderInput
        label="# Walking Teams"
        value={numWalking}
        setValue={setNumWalking}
        min={1}
        max={50}
      />

      <SliderInput
        label="# Routes"
        value={numRoutes}
        setValue={setNumRoutes}
        min={1}
        max={5}
      />
      <SliderInput
        label="Max Individual Crawl Time"
        value={maxCrawlTime}
        setValue={setMaxCrawlTime}
        min={0}
        max={420}
        isTime
        rightLabel={numCrawlTimeRoutes}
      />
      <Typography sx={{ fontSize: "20px" }}>
        Food Stops ({numFoodStops})
      </Typography>
      <SliderInput
        label="Food Stop Number Range"
        value={foodStopRange}
        setValue={setFoodStopRange}
        min={1}
        max={numStops - 2}
      />
      <SliderInput
        label="Min # Stops Between Food Stops"
        value={stopsBetweenFood}
        setValue={setStopsBetweenFood}
        min={0}
        max={maxMinStopsBetweenFood}
      />
      <Typography sx={{ fontSize: "20px" }}>Double Stops</Typography>
      <SliderInput
        label="Min # Stops Between Duplicates"
        value={stopsBetweenDuplicates}
        setValue={setStopsBetweenDuplicates}
        min={0}
        max={numStops - 1}
      />
      <Typography sx={{ fontSize: "20px" }}>Running Teams</Typography>
      <SliderInput
        label="# Running Teams"
        value={numRunning}
        setValue={setNumRunning}
        min={0}
        max={25}
      />
      <SliderInput
        label="Running Speed Multiplier"
        value={runningSpeedMultiplier}
        setValue={setRunningSpeedMultiplier}
        min={1}
        max={2.5}
        step={0.1}
      />
      <SliderInput
        label="Running Crawl Time"
        value={runningCrawlTime}
        setValue={setRunningCrawlTime}
        min={0}
        max={300}
        isTime
      />
      <SliderInput
        label="Running Time At Stop"
        value={runningTimeAtStop}
        setValue={setRunningTimeAtStop}
        min={0}
        max={30}
        isTime
      />
      <SliderInput
        label="Running Send Off Interval"
        value={runningSendOffInterval}
        setValue={setRunningSendOffInterval}
        min={0}
        max={30}
        isTime
      />
      <Button onClick={finalCalulations} variant="contained">
        START
      </Button>
    </div>
  );
}
