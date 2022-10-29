export const findPermutations = (numbers) => {
  if (numbers.length < 2) {
    return numbers;
  }

  let permutationsArray = [];

  for (let i = 0; i < numbers.length; i++) {
    let place = numbers[i];

    let remainingChars = numbers.filter((n) => n != place);

    for (let permutation of findPermutations(remainingChars)) {
      permutationsArray.push([place, permutation].flat());
    }
  }
  // console.log("permutationsArray", permutationsArray.length, numbers);
  return permutationsArray;
};
function getCombos(routesLength, numRoutes) {
  let result = 1;
  for (let i = routesLength; i > routesLength - numRoutes; i--) {
    result *= i;
  }
  return result / numRoutes;
}
function getFactorial(n) {
  let result = 1;
  if (n > 1) {
    for (let i = 1; i <= n; i++) {
      result = result * i;
    }
    return result;
  } else {
    return "n has to be positive";
  }
}
export const getNumPossibilities = () => {};
export const getNumValidWalkingTimes = (timeMatrix, walkingRange) => {
  let numValid = 0;
  let count = 0;
  for (let i = 0; i < timeMatrix.length; i++) {
    for (let j = 0; j < i; j++) {
      count++;
      if (
        timeMatrix[i][j] <= walkingRange[1] &&
        timeMatrix[i][j] >= walkingRange[0]
      ) {
        numValid++;
      }
    }
  }
  //   console.log(findPermutations([1, 2, 3]));
  return `${numValid}/${count} paths, ${getAllWalkingTimeRoutes(
    timeMatrix,
    walkingRange
  )}`;
};
const getAllWalkingTimeRoutes = (timeMatrix, walkingRange) => {
  const routes = new Array(timeMatrix.length - 2).fill(0).map((_, i) => i + 1);
  const permutations = findPermutations(routes);
  const allRoutes = permutations
    .map((p) => [0, ...p, timeMatrix.length - 1])
    .filter((r) => {
      for (let i = 0; i < r.length - 1; i++) {
        if (
          timeMatrix[r[i]][r[i + 1]] < walkingRange[0] ||
          timeMatrix[r[i]][r[i + 1]] > walkingRange[1]
        ) {
          return false;
        }
      }
      return true;
    });
  return `${allRoutes.length}/${permutations.length} routes `;
};
export const getAllCrawlTimeRoutes = (
  timeMatrix,
  maxCrawlTime,
  timeAtStop,
  numTeams
) => {
  const routes = new Array(timeMatrix.length - 2).fill(0).map((_, i) => i + 1);
  const permutations = findPermutations(routes);
  const allRoutes = permutations
    .map((p) => [0, ...p, timeMatrix.length - 1])
    .filter((r) => {
      let totalTime = timeAtStop * (r.length - 2);
      for (let i = 0; i < r.length - 1; i++) {
        totalTime += timeMatrix[r[i]][r[i + 1]];
      }
      return totalTime < maxCrawlTime;
    });
  return `${allRoutes.length}/${permutations.length} routes`;
};
export const foodStopsValid = (
  route,
  foodStops,
  foodStopRange,
  minDistance,
  duplicates,
  minDupeDistance
) => {
  for (let i = 0; i < route.length; i++) {
    if (
      foodStops.includes(route[i]) &&
      (i < foodStopRange[0] || i > foodStopRange[1])
    ) {
      return false;
    }
  }
  for (let i = 0; i < route.length - 1; i++) {
    for (let p = i + 1; p < route.length; p++) {
      if (foodStops.includes(route[i]) && foodStops.includes(route[p])) {
        if (p - i < minDistance + 1) {
          return false;
        }
      }
      if (duplicates.some((d) => d[0] == route[i] && d[1] == route[p])) {
        if (p - i < minDupeDistance + 1) {
          return false;
        }
      }
    }
  }
  return true;
};
export const getOverallNumPossibleRoutes = (
  timeMatrix,
  foodStops,
  maxCrawlTime,
  timeAtStop,
  walkingRange,
  numTeams,
  foodStopRange,
  foodStopMinDistance,
  numRoutes,
  duplicates,
  minBetweenDuplicates
) => {
  const extraTime = Math.ceil(numTeams / numRoutes) * timeAtStop;

  const routes = new Array(timeMatrix.length - 2).fill(0).map((_, i) => i + 1);
  const permutations = findPermutations(routes);
  const allRoutes = permutations
    .map((p) => [0, ...p, timeMatrix.length - 1])
    .filter((r) => {
      if (
        !foodStopsValid(
          r,
          foodStops,
          foodStopRange,
          foodStopMinDistance,
          duplicates,
          minBetweenDuplicates
        )
      ) {
        return false;
      }
      for (let i = 0; i < r.length - 1; i++) {
        if (
          timeMatrix[r[i]][r[i + 1]] < walkingRange[0] ||
          timeMatrix[r[i]][r[i + 1]] > walkingRange[1]
        ) {
          return false;
        }
      }
      let totalTime = timeAtStop * (r.length - 2);
      for (let i = 0; i < r.length - 1; i++) {
        totalTime += timeMatrix[r[i]][r[i + 1]];
      }
      return totalTime < maxCrawlTime;
    });
  const totalNumCombos = getCombos(allRoutes.length, numRoutes);
  return `${allRoutes.length}/${
    permutations.length
  } routes, ${totalNumCombos} combos (@~25k/sec = ${
    totalNumCombos / 25000
  } sec)`;
};
