from collections import Counter
from itertools import combinations


def createRouteCombos(routes, numRoutes):
    return list(combinations(range(len(routes)), numRoutes))


def split_into_routes(num_groups, num_routes):
    return [
        (num_groups // num_routes) + (1 if i < (num_groups % num_routes) else 0)
        for i in range(num_routes)
    ]


def createTimeOffsetCombos(numRoutes, maxTime):
    if numRoutes == 1:
        return [[0]]
    output = []
    for j in range(maxTime + 1):
        output.append([j])
    for i in range(numRoutes - 1):
        nextOutput = []
        for o in output:
            if not 0 in o and i == numRoutes - 2:
                nextOutput.append(o + [0])
            else:
                for j in range(maxTime + 1):
                    nextOutput.append(o + [j])
        output = nextOutput
    return output


def generateRoutes(
    timeMatrix,
    walkRange,
    doubleStops,
    numBetweenDouble,
    foodStops,
    numBetweenFood,
    foodRange,
    ignoreFirstStop,
    ignoreLastStop,
):

    locations = list(range(len(timeMatrix)))

    disabledPaths = []
    for i in range(len(timeMatrix)):
        disabledPaths.append([])
    for i, arr in enumerate(timeMatrix):
        for p, val in enumerate(arr):
            if val > walkRange[1] or val < walkRange[0]:
                disabledPaths[i].append(p)
    start_arr = []
    numStops = len(timeMatrix) + len(doubleStops)
    if ignoreFirstStop:
        start_arr.append(0)
        locations.pop(0)
    if ignoreLastStop:
        locations.pop()
        numStops -= 1
    locations.extend(doubleStops)

    # print("Starting", locations, start_arr)
    routes = generateRoutesRecursive(
        locations,
        numStops,
        doubleStops,
        numBetweenDouble,
        foodStops,
        numBetweenFood,
        foodRange,
        disabledPaths,
        start_arr,
    )
    if ignoreLastStop:
        routes = [r + [len(timeMatrix) - 1] for r in routes]
    return routes


def generateRoutesRecursive(
    allLocations,
    lengthOfRoute,
    doubleStops,
    numBetweenDouble,
    foodStops,
    numBetweenFood,
    foodRange,
    disabledPaths,
    currRoute,
):

    notAllowed = []
    if len(currRoute) > 0:
        notAllowed.extend(disabledPaths[currRoute[-1]])
    if len(currRoute) < foodRange[0] or len(currRoute) > foodRange[1]:
        notAllowed.extend(foodStops)
    for i in range(max(0, len(currRoute) - numBetweenDouble), len(currRoute)):
        if currRoute[i] in doubleStops:
            notAllowed.append(currRoute[i])
    for i in range(max(0, len(currRoute) - numBetweenFood), len(currRoute)):
        if currRoute[i] in foodStops:
            notAllowed.extend(foodStops)
            break
    nextPossibleLocations = list(
        set((Counter(allLocations) - Counter(currRoute)).elements()) - set(notAllowed)
    )
    if len(nextPossibleLocations) == 0:
        if len(currRoute) == lengthOfRoute:
            return [currRoute]
        return []
    return [
        el
        for arr in [
            generateRoutesRecursive(
                allLocations,
                lengthOfRoute,
                doubleStops,
                numBetweenDouble,
                foodStops,
                numBetweenFood,
                foodRange,
                disabledPaths,
                currRoute + [i],
            )
            for i in nextPossibleLocations
        ]
        for el in arr
    ]
