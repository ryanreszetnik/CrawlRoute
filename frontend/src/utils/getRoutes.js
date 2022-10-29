import { findPermutations, foodStopsValid } from "./estimations";
const getNPermutations = (input, maxLength) => {
  const permute = (l) => {
    if (l === maxLength - 1) return input.map((i) => [i]);
    return input
      .map((i) =>
        permute(l + 1)
          .filter((p) => i > p[p.length - 1])
          .map((p) => [...p, i])
      )
      .flat();
  };
  return permute(0);
};
// const getNPermutations = (inputArr, numElements) => {
//   let result = [];

//   const permute = (arr, m = []) => {
//     if (arr.length === inputArr.length - numElements) {
//       result.push(m);
//     } else {
//       for (let i = 0; i < arr.length; i++) {
//         let curr = arr.slice();
//         let next = curr.splice(i, 1);
//         permute(curr.slice(), m.concat(next));
//       }
//     }
//   };

//   permute(inputArr);

//   return result.filter(
//     (p) =>
//       p.reduce(function (acc, el, i, arr) {
//         if (arr.indexOf(el) !== i && acc.indexOf(el) < 0) acc.push(el);
//         return acc;
//       }, []).length == 0 && arrIsIncrementing(p)
//   );
// };
// var getNPermutations = function (list, maxLen) {
//   // Copy initial values as arrays
//   var perm = list.map(function (val) {
//     return [val];
//   });
//   // Our permutation generator
//   var generate = function (perm, maxLen, currLen) {
//     // Reached desired length
//     if (currLen === maxLen) {
//       return perm;
//     }
//     // For each existing permutation
//     for (var i = 0, len = perm.length; i < len; i++) {
//       var currPerm = perm.shift();
//       // Create new permutation
//       for (var k = 0; k < list.length; k++) {
//         perm.push(currPerm.concat(list[k]));
//       }
//     }
//     // Recurse
//     return generate(perm, maxLen, currLen + 1);
//   };
//   // Start with size 1 because of initial values
//   console.log("About to filter", generate(perm, maxLen, 1));
//   return generate(perm, maxLen, 1).filter(
//     (p) =>
//       p.reduce(function (acc, el, i, arr) {
//         if (arr.indexOf(el) !== i && acc.indexOf(el) < 0) acc.push(el);
//         return acc;
//       }, []).length == 0 && arrIsIncrementing(p)
//   );
// };
const arrIsIncrementing = (arr) => {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] >= arr[i + 1]) {
      return false;
    }
  }
  return true;
};
export const divideGroups = (numGroups, numRoutes) => {
  const participantsPerGroup = new Array(numRoutes).fill(0);
  for (let i = 0; i < numGroups; i++) {
    participantsPerGroup[i % numRoutes]++;
  }
  return participantsPerGroup;
};
const getRouteOverlap = (times, route1, route2, minTimeAtStop, num1, num2) => {
  let overlap = 0;
  // console.log(route1, route2);
  const places = new Array(route1.length - 1); //ignore index 0
  const places2 = new Array(route1.length - 1);
  let currTime = times[route1[0]][route1[1]];
  let currTime2 = times[route2[0]][route2[1]];
  for (let i = 1; i < route1.length - 1; i++) {
    places[route1[i]] = [currTime, currTime + minTimeAtStop * num1];
    currTime += times[route1[i]][route1[i + 1]] + minTimeAtStop;
    places2[route2[i]] = [currTime2, currTime2 + minTimeAtStop * num2];
    currTime2 += times[route2[i]][route2[i + 1]] + minTimeAtStop;
  }
  // console.log(places, places2);
  for (let i = 1; i < route1.length - 1; i++) {
    if (places[i][0] < places2[i][0]) {
      const overlapAmt = Math.max(0, places[i][1] - places2[i][0]);
      // console.log("overlap", i, overlapAmt);
      overlap += overlapAmt;
    } else {
      const overlapAmt = Math.max(0, places2[i][1] - places[i][0]);
      // console.log("overlap", i, overlapAmt);
      overlap += overlapAmt;
    }
  }
  return overlap;
};

const calculateGroupRouteOverlap = (
  travelTimes,
  routes,
  numGroupsOnRoute,
  stopTime
) => {
  let totalOverlap = 0;
  for (let i = 0; i < routes.length - 1; i++) {
    for (let j = i + 1; j < routes.length; j++) {
      totalOverlap += getRouteOverlap(
        travelTimes,
        routes[i],
        routes[j],
        stopTime,
        numGroupsOnRoute[i],
        numGroupsOnRoute[j]
      );
    }
  }
  return totalOverlap;
};
export const getBestCombosInOrder = (
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
  console.log("GOT ALL GROUPS");
  const routeGroups = new Array(allRoutes.length).fill(0).map((_, i) => i);
  const groupPerms = getNPermutations(routeGroups, numRoutes);
  const numGroupsPerRoute = divideGroups(numTeams, numRoutes);
  console.log("SORTING BY TIME");
  let allPossibleRouteCombos = groupPerms.map((p) => {
    const routes = p.map((i) => allRoutes[i]);
    const routesReverse = p.map((i) => [...allRoutes[i]].reverse());
    return {
      routes,
      overlap: calculateGroupRouteOverlap(
        timeMatrix,
        routesReverse,
        numGroupsPerRoute,
        timeAtStop
      ),
    };
  });
  console.log("CALCULATING DONE");
  allPossibleRouteCombos = allPossibleRouteCombos.sort(
    (a, b) => a.overlap - b.overlap
  );
  console.log("Combos", allPossibleRouteCombos);
  return allPossibleRouteCombos;
};
