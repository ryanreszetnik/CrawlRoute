import React, { useContext, useEffect, useMemo, useState } from "react";
import GeneratePDF from "../Components/GeneratePDF";
import Loading from "../Components/Loading";
import { appContext } from "../utils/AppContext";
import { createSpreadsheet } from "../utils/spreadsheet";

export default function PDFOutput() {
  const {
    bestRoutes,
    selectedRouteIndex,
    locations,
    params,
    timeMatrix,
    endTime,
    offsetTimes,
    numGroupsPerRoute,
  } = useContext(appContext);
  const [spreadSheet, setSpreadSheet] = useState(null);
  const combo = useMemo(
    () => bestRoutes[selectedRouteIndex][0],
    [bestRoutes, selectedRouteIndex]
  );
  useEffect(() => {
    setSpreadSheet(
      createSpreadsheet(
        timeMatrix,
        combo,
        params.timeAtStop,
        locations,
        endTime,
        numGroupsPerRoute,
        offsetTimes
      )
    );
  }, [combo, locations]);
  //   const speadSheet = useMemo(() => createSpreadsheet(), []);
  if (spreadSheet == null) {
    return <Loading />;
  }
  return (
    <div>
      <GeneratePDF
        spreadSheetRoutes={spreadSheet.spreadSheetRoutes}
        spreadSheetStops={spreadSheet.spreadSheetStops}
        numGroupsPerRoute={numGroupsPerRoute}
      />
    </div>
  );
}
