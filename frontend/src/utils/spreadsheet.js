const divideGroups = (numGroups, numRoutes) => {
  const participantsPerGroup = new Array(numRoutes).fill(0);
  for (let i = 0; i < numGroups; i++) {
    participantsPerGroup[i % numRoutes]++;
  }
  return participantsPerGroup;
};

const getTeamRoutes = (
  timeMatrix,
  routes,
  timeAtStop,
  dividedGroups,
  timeOffsets
) => {
  const teamRoutes = [];
  // console.log("Divided groups", dividedGroups, numTeams, routes);
  let teamNumber = 1;
  for (let i = 0; i < dividedGroups.length; i++) {
    for (let j = 0; j < dividedGroups[i]; j++) {
      const backwardsRoute = [...routes[i]].reverse();
      const teamRoute = [];
      let currTime = j * timeAtStop + timeOffsets[i];
      for (let k = 0; k < backwardsRoute.length; k++) {
        teamRoute.push({
          arrival: currTime,
          departure: currTime + timeAtStop,
          locationId: backwardsRoute[k],
          teamNumber,
        });
        currTime -=
          timeMatrix[backwardsRoute[k]][backwardsRoute[k + 1]] + timeAtStop;
      }
      teamRoutes.push(teamRoute.reverse());
      teamNumber++;
      // console.log("generated team route", teamRoute);
    }
  }
  return teamRoutes;
};
const getTimeFromOffset = (endTime, offset) => {
  const originalDate = new Date();
  originalDate.setHours(endTime["hr"], endTime["min"], 0, 0);

  var MS_PER_MINUTE = 60000;
  const date = new Date(originalDate.valueOf() + offset * MS_PER_MINUTE);
  return `${date.getHours()}:${
    date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
  }`;
};

const formatRoutes = (routes, locations, endTime) => {
  // console.log("format routes", routes);
  return routes.map((r) => {
    return r.map((loc) => {
      return {
        name: locations[loc.locationId].name,
        arrival: getTimeFromOffset(endTime, loc.arrival),
        departure: getTimeFromOffset(endTime, loc.departure),
        address: locations[loc.locationId].address,
      };
    });
  });
};
const formatStops = (routes, locations, endTime) => {
  // console.log(routes, locations, endTime);
  const testMap = {};
  locations.forEach((loc, ind) => {
    if (testMap.hasOwnProperty(loc.id)) {
      testMap[loc.id] = [...testMap[loc.id], ind];
    } else {
      testMap[loc.id] = [ind];
    }
  });
  // console.log();
  return Object.entries(testMap)
    .map(([key, value]) => {
      const location = locations.find((l) => l.id == key);
      return {
        name: location.name,
        address: location.address,
        location: location.location,
        first: location.first,
        last: location.last,
        value,
      };
    })
    .map((location) => {
      return {
        name: location.name,
        address: location.address,
        locId: location.id,
        first: location.first,
        last: location.last,
        teams: routes
          .filter((r) => location.value.includes(r.locationId))
          .sort((a, b) => a.arrival - b.arrival)
          .map((team) => {
            return {
              teamNumber: team.teamNumber,
              arrival: getTimeFromOffset(endTime, team.arrival),
              departure: getTimeFromOffset(endTime, team.departure),
            };
          }),
      };
    });
};

const timeMatrix = [
  [0, 7, 9, 9, 16, 5, 9, 5, 19, 9, 15],
  [7, 0, 12, 5, 12, 12, 14, 7, 23, 12, 19],
  [10, 13, 0, 17, 23, 12, 9, 6, 12, 0, 14],
  [9, 5, 16, 0, 8, 14, 18, 12, 27, 16, 24],
  [16, 12, 22, 8, 0, 21, 24, 18, 33, 22, 30],
  [5, 12, 11, 13, 21, 0, 6, 7, 15, 11, 11],
  [10, 14, 9, 18, 24, 6, 0, 7, 10, 9, 7],
  [5, 8, 5, 12, 18, 8, 7, 0, 17, 5, 13],
  [19, 23, 12, 28, 34, 16, 11, 17, 0, 12, 5],
  [10, 13, 0, 17, 23, 12, 9, 6, 12, 0, 14],
  [15, 19, 13, 24, 30, 12, 7, 13, 5, 13, 0],
];
const routes = [
  [0, 3, 4, 1, 7, 9, 8, 6, 5, 2, 10],
  [0, 7, 2, 8, 6, 5, 3, 4, 1, 9, 10],
  [0, 9, 5, 3, 4, 1, 2, 7, 6, 8, 10],
];
const numTeams = 20;
const timeAtStop = 10;
const locations = [
  {
    location:
      "McConnell Engineering Building, Boulevard Robert-Bourassa, Montreal, QC, Canada",
    name: "McConnell Engineering Building",
    address: "3380 Blvd Robert-Bourassa, Montréal, QC H2X 2G6, Canada",
    lat: 45.5060618,
    lng: -73.57643200000001,
    first: true,
    last: false,
    food: false,
    double: false,
    id: 1,
  },
  {
    location: "Ôfour, Park Avenue, Montreal, QC, Canada",
    name: "Ôfour",
    address: "3452 Av du Parc, Montréal, QC H2X 2H5, Canada",
    lat: 45.5088195,
    lng: -73.57268479999999,
    first: false,
    last: false,
    food: true,
    double: false,
    id: 0,
  },
  {
    name: "Piranha Bar",
    location: "Piranha Bar, Saint-Catherine Street West, Montreal, QC, Canada",
    address: "680 Sainte-Catherine O, Montréal, QC H3B 1C2, Canada",
    lat: 45.5028519,
    lng: -73.5699419,
    first: false,
    last: false,
    food: false,
    double: true,
    id: 2,
  },
  {
    name: "Bar Tipsy Cow",
    location: "Bar Tipsy Cow, Park Avenue, Montreal, QC, Canada",
    address: "3575 Av du Parc, Montréal, QC H2X 3P9, Canada",
    lat: 45.5106171,
    lng: -73.575124,
    first: false,
    last: false,
    food: false,
    double: false,
    id: 3,
  },
  {
    name: "Bar Bifteck St-Laurent",
    location:
      "Bar Bifteck St-Laurent, Saint Laurent Boulevard, Montreal, QC, Canada",
    address: "3702 Boul. Saint-Laurent, Montréal, QC H2X 2V4, Canada",
    lat: 45.5145656,
    lng: -73.57438499999999,
    first: false,
    last: false,
    food: false,
    double: false,
    id: 4,
  },
  {
    name: "Gert's Bar & Café",
    location: "Gert's Bar & Café, Mc Tavish Street, Montreal, QC, Canada",
    address: "3480 Rue McTavish, Montréal, QC H3A 1X9, Canada",
    lat: 45.5036082,
    lng: -73.5781314,
    first: false,
    last: false,
    food: false,
    double: false,
    id: 5,
  },
  {
    name: "M4 Burritos Peel",
    location: "M4 Burritos Peel, Peel Street, Montreal, QC, Canada",
    address: "2053 Rue Peel, Montréal, QC H3A 1T6, Canada",
    lat: 45.5014586,
    lng: -73.5755732,
    first: false,
    last: false,
    food: true,
    double: false,
    id: 6,
  },
  {
    name: "Basha Sherbrooke",
    location: "Basha Sherbrooke, Sherbrooke Street West, Montreal, QC, Canada",
    address: "666 Rue Sherbrooke O, Montréal, QC H3A 1E7, Canada",
    lat: 45.5049667,
    lng: -73.573189,
    first: false,
    last: false,
    food: false,
    double: false,
    id: 7,
  },
  {
    name: "Brutopia",
    location: "Brutopia, Crescent Street, Montreal, QC, Canada",
    address: "Brutopia, Rue Crescent, Montréal, QC H3G 2B1, Canada",
    lat: 45.4967389,
    lng: -73.574433,
    first: false,
    last: false,
    food: false,
    double: false,
    id: 8,
  },
  {
    name: "Piranha Bar",
    location: "Piranha Bar, Saint-Catherine Street West, Montreal, QC, Canada",
    address: "680 Sainte-Catherine O, Montréal, QC H3B 1C2, Canada",
    lat: 45.5028519,
    lng: -73.5699419,
    first: false,
    last: false,
    food: false,
    double: true,
    id: 2,
  },
  {
    name: "Jet Night Club",
    location: "Jet Night Club, Crescent Street, Montreal, QC, Canada",
    address: "2020 Rue Crescent, Montréal, QC H3G 2B8, Canada",
    lat: 45.4980837,
    lng: -73.577844,
    first: false,
    last: true,
    food: false,
    double: false,
    id: 9,
  },
];
const END_TIME = 9;

export const createSpreadsheet = (
  timeMatrix,
  routes,
  timeAtStop,
  locations,
  endTime,
  dividedGroups,
  timeOffsets
) => {
  const teamRoutes = getTeamRoutes(
    timeMatrix,
    routes,
    timeAtStop,
    dividedGroups,
    timeOffsets
  );
  const spreadSheetRoutes = formatRoutes(teamRoutes, locations, endTime);
  const spreadSheetStops = formatStops(teamRoutes.flat(), locations, endTime);
  return { spreadSheetRoutes, spreadSheetStops };
};
