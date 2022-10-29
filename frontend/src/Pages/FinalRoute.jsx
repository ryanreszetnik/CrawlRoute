import { Button, IconButton } from "@mui/material";
import React, { useContext, useMemo } from "react";
import { useState } from "react";
import LocationPreview from "../Components/LocationPreview";
import { appContext } from "../utils/AppContext";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import RouteMap from "../Components/RouteMap";
import { useEffect } from "react";
import CustomTimePicker from "../Components/CustomTimePicker";
import SliderInput from "../Components/SliderInput";

export default function FinalRoute({ onSubmit }) {
  const {
    bestRoutes,
    locations,
    setSelectedRouteIndex,
    setEndTime,
    endTime,
    timeMatrix,
    params,
    setNumGroupsPerRoute,
    setOffsetTimes,
  } = useContext(appContext);
  const [currentRouteIndex, setCurrentRouteIndex] = useState(0);
  const [arriveTimes, setArriveTimes] = useState([]);
  const [overlapTimes, setOverlapTimes] = useState([]);
  const [offsetTimes, setTempOffsetTimes] = useState([]);
  const [totalOverlap, setTotalOverlap] = useState(0);

  const divideGroups = (numGroups, numRoutes) => {
    const participantsPerGroup = new Array(numRoutes).fill(0);
    for (let i = 0; i < numGroups; i++) {
      participantsPerGroup[i % numRoutes]++;
    }
    // console.log("split", participantsPerGroup);
    return participantsPerGroup;
  };

  useEffect(() => {
    setSelectedRouteIndex(currentRouteIndex);
  }, [currentRouteIndex]);
  const handleTimeChange = (hr, min) => {
    setEndTime({ hr, min });
  };
  const combo = bestRoutes ? bestRoutes[currentRouteIndex] : null;
  const numGroupsInRoute = combo ? combo[2] : [];
  useEffect(() => {
    if (combo) {
      setTempOffsetTimes(combo[3]);
    }
  }, [combo]);
  const updateOffset = (index, value) => {
    const newOffsetTimes = [...offsetTimes];
    newOffsetTimes[index] = value;
    setTempOffsetTimes(newOffsetTimes);
  };
  useEffect(() => {
    // console.log("end times", endTime, combo, timeMatrix, locations);
    const arriveTimes = combo[0]
      .map((r) => r.reverse())
      .map((r, ri) => {
        let time = offsetTimes[ri];
        let output = [[time, time + params.timeAtStop * numGroupsInRoute[ri]]];
        r.forEach((l, i) => {
          if (i !== 0) {
            time -= timeMatrix[r[i - 1]][l] + params.timeAtStop;
            output.push([
              time,
              time + params.timeAtStop * numGroupsInRoute[ri],
            ]);
          }
        });
        return output.reverse();
      });
    const extendedCombo = combo[0].map((r) => r.reverse());
    const flatLocations = extendedCombo.flat();
    // console.log("flat", flatLocations, arriveTimes);

    const overlapTimes = arriveTimes.map((r, ri) =>
      r.map((stop, si) => {
        const otherTimes = arriveTimes
          .map((r2, r2i) =>
            r2.filter(
              (stop2, s2i) =>
                extendedCombo[r2i][s2i] === extendedCombo[ri][si] &&
                (r2i !== ri || si !== s2i)
            )
          )
          .flat()
          .map((stop2) =>
            Math.max(
              0,
              Math.min(stop[1], stop2[1]) - Math.max(stop[0], stop2[0])
            )
          )
          .filter((t) => t > 0 && si !== 0 && si !== r.length - 1);
        return otherTimes;
      })
    );
    const totalOverlap =
      overlapTimes.reduce(
        (prev, arr) =>
          prev + arr.reduce((p, i) => p + i.reduce((p2, k) => p2 + k, 0), 0),
        0
      ) / 2;
    // console.log("overlap", totalOverlap);
    setTotalOverlap(totalOverlap);
    setArriveTimes(arriveTimes);
    setOverlapTimes(overlapTimes);
  }, [endTime, combo, timeMatrix, offsetTimes]);
  const routes =
    !locations || !combo
      ? []
      : combo[0].map((routes) => routes.map((r) => locations[r]));
  const handleSubmit = () => {
    setNumGroupsPerRoute(combo[2]);
    setOffsetTimes(offsetTimes);
    onSubmit();
  };
  const getTime = (i, j) => {
    // console.log(i, j, arriveTimes[i][j][0]);
    // return 0;
    if (arriveTimes.length === 0) return null;
    // console.log(arriveTimes, i, j, numGroupsInRoute);
    const date = new Date();
    date.setHours(endTime.hr);
    date.setMinutes(endTime.min + arriveTimes[i][j][0]);
    var hh = date.getHours();
    var mm = date.getMinutes();
    const isPm = hh >= 12;
    if (isPm) {
      hh -= 12;
    }
    const date2 = new Date();
    date2.setHours(endTime.hr);
    date2.setMinutes(endTime.min + arriveTimes[i][j][1]);
    // console.log(date, arriveTimes[i][j][1]);
    var hh2 = date2.getHours();
    const isPm2 = hh2 >= 12;
    var mm2 = date2.getMinutes();
    if (isPm2) {
      hh2 -= 12;
    }

    return `${hh}:${mm < 10 ? "0" : ""}${mm}-${hh2}:${
      mm2 < 10 ? "0" : ""
    }${mm2}`;
  };
  return (
    <div>
      {combo && overlapTimes.length > 0 && (
        <div style={{ padding: "10px" }}>
          <CustomTimePicker
            label="Final Location Arrive Time"
            onChange={handleTimeChange}
          />
          <div
            style={{ display: "flex", margin: "auto", width: "fit-content" }}
          >
            <div>
              <IconButton
                disabled={currentRouteIndex == 0}
                onClick={() => setCurrentRouteIndex((i) => i - 1)}
              >
                <ChevronLeftIcon />
              </IconButton>
            </div>
            <div>
              <div>Combo {currentRouteIndex + 1}</div>
              <div>Overlap {totalOverlap} min</div>
            </div>

            <div>
              <IconButton
                disabled={currentRouteIndex == bestRoutes.length - 1}
                onClick={() => setCurrentRouteIndex((i) => i + 1)}
              >
                <ChevronRightIcon />
              </IconButton>
            </div>
          </div>

          {routes.map((route, j) => (
            <div
              style={{
                padding: "10px",
                display: "flex",
                width: "fit-content",
                margin: "auto",
                paddingRight: "100px",
              }}
            >
              {route.map((stop, k) => (
                <LocationPreview
                  location={stop}
                  disableDouble={true}
                  timeAtStop={getTime(j, k)}
                  overlapTimes={overlapTimes[j][k]}
                />
              ))}
              <div style={{ position: "absolute", right: 0 }}>
                <SliderInput
                  label="Offset Time"
                  min={0}
                  max={30}
                  value={offsetTimes[j]}
                  setValue={(val) => updateOffset(j, val)}
                />
              </div>
            </div>
          ))}
          {/* {JSON.stringify(routes)} */}
        </div>
      )}
      <Button
        variant="contained"
        size="large"
        sx={{ marginBottom: "10px" }}
        onClick={handleSubmit}
      >
        Select This Route Combo
      </Button>
      <RouteMap routes={routes} />
    </div>
  );
}
