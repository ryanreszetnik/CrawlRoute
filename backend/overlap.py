from itertools import permutations
import numpy as np
from createRoutes import createTimeOffsetCombos, split_into_routes
from arriveTimes import generate_route_arrive_times


def get_combo_overlaps(arrive_times, combos):
    times = []
    distance_arr = []

    for i in range(len(arrive_times[0])):
        times.append(set())
    for stopIndex in range(len(arrive_times[0])):
        for allStops in arrive_times:
            for k in allStops[stopIndex]:
                times[stopIndex].add(k[0])
    times = [list(i) for i in times]

    for t in times:
        t.sort()

    time_map = [{t[i]: i for i in range(len(t))} for t in times]

    for timesArr in times:
        distances = []
        for i in range(len(timesArr) - 1):
            distances.append(timesArr[i + 1] - timesArr[i])
        distance_arr.append(np.array(distances))
    # get each route thing
    flat_times = np.concatenate(distance_arr)
    route_matrix = []
    for route in arrive_times:
        individual_route_matrix = []
        for stopIndex, stop in enumerate(route):
            route_stop_matrix = np.zeros(len(times[stopIndex]) - 1)
            num_groups_at_stop = 0
            for k in range(len(stop) - 1):
                num_groups_at_stop += stop[k][1]
                start_time = stop[k][0]
                end_time = stop[k + 1][0]
                start_index = time_map[stopIndex][start_time]
                end_index = time_map[stopIndex][end_time]
                for j in range(start_index, end_index):
                    route_stop_matrix[j] += num_groups_at_stop
            individual_route_matrix.append(route_stop_matrix)
        route_matrix.append(np.concatenate(individual_route_matrix))

    output_routes = []
    for index, combo in enumerate(combos):
        summed = np.sum([route_matrix[i] for i in combo], axis=0) - 1
        summed[summed < 0] = 0
        overlap = np.dot(flat_times, summed)
        output_routes.append((combo, overlap, index))

    output_routes.sort(key=lambda x: x[1])
    return output_routes


def get_accurate_route_combo_overlap_with_offsets(
    combo,
    timeMatrix,
    timeAtStop,
    ignoreFirstStop,
    ignoreLastStop,
    num_teams_per_group_combos,
    allTimeOffsets,
    numStops,
):
    arrive_times = []
    offsets = []
    combos = []
    num_teams_per_group_list = []

    for offset in allTimeOffsets:
        for num_teams_per_group in num_teams_per_group_combos:
            combos.append(
                list(range(len(arrive_times), len(arrive_times) + len(combo)))
            )
            num_teams_per_group_list.append(num_teams_per_group)
            offsets.append(offset)
            for i in range(len(combo)):

                arrive_times.append(
                    generate_route_arrive_times(
                        combo[i],
                        timeMatrix,
                        timeAtStop,
                        num_teams_per_group[i],
                        ignoreFirstStop,
                        ignoreLastStop,
                        offset[i],
                        numStops,
                    )
                )
    best_overlap = get_combo_overlaps(arrive_times, combos)[0]

    return (
        combo,
        best_overlap[1],
        num_teams_per_group_list[best_overlap[2]],
        offsets[best_overlap[2]],
    )
