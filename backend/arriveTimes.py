def getStrippedRouteTotalTime(route, timeMatrix):
    totalTime = 0

    for i in range(len(route) - 1):
        totalTime += timeMatrix[route[i]][route[i + 1]]
    return totalTime


def generate_route_arrive_times(
    route,
    timeMatrix,
    timeAtStop,
    numTeamsPerRoute,
    ignoreFirstStop=False,
    ignoreLastStop=False,
    timeOffset=0,
    numStops=0,
):
    output = []
    for i in range(numStops):
        output.append([])
    currTime = timeOffset
    for i in range(len(route) - 1, -1, -1):
        output[route[i]].extend(
            [(currTime, 1), (currTime + timeAtStop * numTeamsPerRoute, -1)]
        )
        currTime -= timeAtStop + timeMatrix[route[i]][route[i - 1]]
    if ignoreFirstStop:
        output.pop(0)
    if ignoreLastStop:
        output.pop()

    return output
