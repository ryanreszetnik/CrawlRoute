import { findPermutations } from "./estimations";

export const getRouteOrders = (numStops, includeFirst, includeLast) => {
  const actualNum = numStops - (includeFirst ? 0 : 1) - (includeLast ? 0 : 1);
  return findPermutations([
    ...new Array(actualNum).fill(0).map((_, i) => (includeFirst ? i : i + 1)),
  ]).map((arr) => [
    ...(includeFirst ? [] : [0]),
    ...arr,
    ...(includeLast ? [] : [numStops - 1]),
  ]);
};

export const getTimeFilteredPaths = (timeMatrix, min, max) => {
  let count = 0;
  let total = 0;
  for (let i = 1; i < timeMatrix.length; i++) {
    for (let j = 0; j < i; j++) {
      if (timeMatrix[i][j] > min && timeMatrix[i][j] < max) {
        count++;
      }
      total++;
    }
  }
  return { count, total };
};

export const getRouteTimes = (
  routeOrders,
  timeMatrix,
  numDouble,
  timeAtStop
) => {
  return routeOrders.map((route) => {
    let totalTime = 0;
    for (let i = 0; i < route.length - 1; i++) {
      totalTime += timeMatrix[route[i]][route[i + 1]];
    }
    return totalTime + (timeMatrix.length + numDouble - 1) * timeAtStop;
  });
};
