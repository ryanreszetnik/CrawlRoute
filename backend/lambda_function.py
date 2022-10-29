from overlap import get_combo_overlaps, get_accurate_route_combo_overlap_with_offsets
from arriveTimes import generate_route_arrive_times, getStrippedRouteTotalTime
from createRoutes import (
    generateRoutes,
    createRouteCombos,
    split_into_routes,
    createTimeOffsetCombos,
)
from itertools import permutations
import json


def getBestRouteCombos(
    timeMatrix,
    doubleStops,
    numBetweenDouble,
    foodStops,
    numBetweenFood,
    foodRange,
    walkRange,
    maxTotalTime,
    timeAtStop,
    numRoutes,
    num_groups,
    ignoreFirstStop,
    ignoreLastStop,
):
    maxTotalTime -= (len(timeMatrix) + len(doubleStops) - 1) * timeAtStop
    numStops = len(timeMatrix)
    routes = list(
        filter(
            lambda x: getStrippedRouteTotalTime(x, timeMatrix) <= maxTotalTime,
            generateRoutes(
                timeMatrix,
                walkRange,
                doubleStops,
                numBetweenDouble,
                foodStops,
                numBetweenFood,
                foodRange,
                ignoreFirstStop,
                ignoreLastStop,
            ),
        )
    )
    print("#Routes: ", len(routes))
    if len(routes) > 1000:
        return {"error": "Too Many Routes: " + str(len(routes)), "value": len(routes)}
    if len(routes) == 0:
        return {"error": "No Valid Routes", "value": 0}
    numTeamsPerRoute = num_groups / numRoutes
    route_arrive_times = [
        generate_route_arrive_times(
            r,
            timeMatrix,
            timeAtStop,
            numTeamsPerRoute,
            ignoreFirstStop,
            ignoreLastStop,
            0,
            numStops,
        )
        for r in routes
    ]
    combos = createRouteCombos(routes, numRoutes)
    bestCombos = get_combo_overlaps(route_arrive_times, combos)[:20]
    print("Improving now")
    betterEstimations = []

    num_teams_per_group_combos = list(
        set(map(tuple, list(permutations(split_into_routes(num_groups, numRoutes)))))
    )
    maxTimeOffset = 0
    if numRoutes == 2:
        maxTimeOffset = 20
    elif numRoutes == 3:
        maxTimeOffset = 10
    elif numRoutes == 4:
        maxTimeOffset = 3
    allTimeOffsets = createTimeOffsetCombos(numRoutes, maxTimeOffset)
    for i, combo in enumerate(bestCombos):
        print("Improving combo: ", i, end="\r")
        betterEstimations.append(
            get_accurate_route_combo_overlap_with_offsets(
                [routes[i] for i in combo[0]],
                timeMatrix,
                timeAtStop,
                ignoreFirstStop,
                ignoreLastStop,
                num_teams_per_group_combos,
                allTimeOffsets,
                numStops,
            )
        )
    betterEstimations.sort(key=lambda x: (x[1], sum(x[3])))
    return betterEstimations


def lambda_handler(event, context):
    # print("Received event: " + json.dumps(event, indent=2))
    print(event.keys())
    body = json.loads(event["body"])
    print(body)
    return getBestRouteCombos(
        body.get("timeMatrix"),
        body.get("doubleStops"),
        body.get("numBetweenDouble"),
        body.get("foodStops"),
        body.get("numBetweenFood"),
        body.get("foodRange"),
        body.get("walkRange"),
        body.get("maxTotalTime"),
        body.get("timeAtStop"),
        body.get("numRoutes"),
        body.get("numGroups"),
        body.get("ignoreFirstStop"),
        body.get("ignoreLastStop"),
    )


doubleStops = [1, 4]
numBetweenDouble = 4
foodStops = [2, 3]
numBetweenFood = 4
foodRange = [2, 7]
walkRange = [5, 15]
maxTotalTime = 200
timeAtStop = 10
numRoutes = 2
num_groups = 30

timeMatrix = [
    [0, 10, 15, 3, 11, 20, 12, 11, 12, 13, 14, 15],
    [10, 0, 35, 11, 15, 3, 11, 15, 13, 14, 15, 16],
    [15, 35, 0, 12, 20, 7, 19, 14, 15, 16, 17, 18],
    [3, 11, 12, 0, 3, 11, 12, 11, 12, 13, 14, 15],
    [11, 15, 20, 3, 0, 25, 31, 11, 12, 13, 25, 15],
    [20, 3, 7, 11, 25, 0, 11, 11, 12, 13, 25, 15],
    [12, 11, 19, 12, 31, 11, 0, 11, 12, 13, 25, 15],
    [11, 15, 14, 11, 11, 11, 11, 0, 12, 13, 17, 20],
    [12, 13, 15, 12, 12, 12, 12, 12, 0, 13, 22, 15],
    [13, 14, 16, 13, 13, 13, 13, 13, 13, 0, 30, 15],
    [14, 15, 17, 14, 25, 25, 25, 17, 22, 30, 0, 15],
    [15, 16, 18, 15, 15, 15, 15, 20, 15, 15, 15, 0],
]


for i in getBestRouteCombos(
    timeMatrix,
    doubleStops,
    numBetweenDouble,
    foodStops,
    numBetweenFood,
    foodRange,
    walkRange,
    maxTotalTime,
    timeAtStop,
    numRoutes,
    num_groups,
    True,
    False,
):
    print(i)
