import { FormControlLabel, FormGroup, Switch } from "@mui/material";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";
import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import { createSpreadsheet } from "../utils/spreadsheet";

const COPYRIGHT = "© Ryan Reszetnik";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    color: "black",
    padding: "50px",
    flexDirection: "column",
    flexWrap: "wrap",
  },

  cell: {
    width: "33%",
    fontSize: "10px",
  },
  cellSmall: {
    width: "15%",
    fontSize: "10px",
  },
  cellLarger: {
    width: "30%",
    fontSize: "10px",
  },
  cellTitle: {
    width: "33%",
    fontSize: "14px",
    fontWeight: "800",
  },
  cellSmallTitle: {
    width: "15%",
    fontSize: "14px",
    fontWeight: "bold",
  },
  cellLargerTitle: {
    width: "30%",
    fontSize: "14px",
    fontWeight: "bold",
  },
  addressStyle: {
    fontSize: "14px",
    color: "#555",
    fontWeight: "bold",
    textAlign: "center",
    width: "100%",
  },
  pageTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    textAlign: "center",
    width: "100%",
  },
  section: {
    margin: 1,
    padding: 2,
    display: "flex",
    flexDirection: "row",
  },
  halfPageSecion: {
    margin: 1,
    padding: 2,
    width: "50%",
  },
  viewer: {
    width: window.innerWidth * 0.8, //the pdf viewer will take up all of the width and height
    height: window.innerHeight * 0.5,
    margin: "10px",
  },
});

const numStopsPerColumn = 35;

// Create Document Component
function GeneratePDF({
  spreadSheetRoutes,
  spreadSheetStops,
  numGroupsPerRoute,
}) {
  const splitTeamsPerRoute = useMemo(() => {
    const teamsPerRoute = [];
    let startTeam = 0;
    let teamNumber = 0;
    numGroupsPerRoute.forEach((numGroups, index) => {
      let teamsOnRoute = [];
      for (let i = startTeam; i < startTeam + numGroups; i++) {
        teamsOnRoute.push({
          teamNumber: teamNumber + 1,
          route: spreadSheetRoutes[teamNumber],
        });
        teamNumber += 1;
      }
      teamsPerRoute.push(teamsOnRoute);
      startTeam += numGroups;
    });
    console.log(teamsPerRoute);
    return teamsPerRoute;
  }, [spreadSheetRoutes, numGroupsPerRoute]);

  const [ignoreFirstStop, setIgnoreFirstStop] = useState(true);
  const [ignoreLastStop, setIgnoreLastStop] = useState(true);

  return (
    <>
      <div style={{ width: "fit-content", margin: "auto" }}>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                value={ignoreFirstStop}
                defaultChecked
                onChange={() => setIgnoreFirstStop((t) => !t)}
              />
            }
            label="Remove First Stop Arrive Time"
          />
          <FormControlLabel
            control={
              <Switch
                value={ignoreLastStop}
                defaultChecked
                onChange={() => setIgnoreLastStop((t) => !t)}
              />
            }
            label="Remove Last Stop Departure Time"
          />
        </FormGroup>
      </div>
      <PDFViewer style={styles.viewer}>
        <Document title="Sheets For Teams">
          {spreadSheetRoutes.map((page, index) => (
            <Page size="A4" style={styles.page} key={index}>
              <Text
                style={{
                  position: "absolute",
                  left: 30,
                  bottom: 30,
                  color: "#eee",
                  fontSize: "10px",
                  textAlign: "center",
                  width: "108%",
                }}
              >
                {COPYRIGHT}
              </Text>
              <View style={styles.section}>
                <Text style={styles.pageTitle}>Team {index + 1}</Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.cellTitle}>Location</Text>
                <Text style={styles.cellSmallTitle}>Arrive</Text>
                <Text style={styles.cellSmallTitle}>Departure</Text>
                <Text style={styles.cellTitle}>Address</Text>
              </View>
              {page.map((loc, locIndex) => (
                <View style={styles.section}>
                  <Text style={styles.cell}>{loc.name}</Text>
                  <Text style={styles.cellSmall}>
                    {locIndex !== 0 || !ignoreFirstStop ? loc.arrival : ""}
                  </Text>
                  <Text style={styles.cellSmall}>
                    {locIndex !== page.length - 1 || !ignoreLastStop
                      ? loc.departure
                      : ""}
                  </Text>
                  <Text style={styles.cell}>
                    {loc.address
                      .split(",")
                      .filter((_, i, a) => i < a.length - 3)}
                  </Text>
                </View>
              ))}
            </Page>
          ))}
        </Document>
      </PDFViewer>
      <PDFViewer style={styles.viewer}>
        {/* Start of the document*/}
        <Document title="Sheets For Stops">
          {/*render a single page*/}

          {spreadSheetStops.map((page, index) => (
            <Page size="A4" style={styles.page} key={index}>
              <Text
                style={{
                  position: "absolute",
                  left: 30,
                  bottom: 30,
                  color: "#eee",
                  fontSize: "10px",
                  textAlign: "center",
                  width: "108%",
                }}
              >
                {COPYRIGHT}
              </Text>
              <View style={styles.section}>
                <Text style={styles.pageTitle}>{page.name}</Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.addressStyle}>
                  {page.address
                    .split(",")
                    .filter((_, i, a) => i < a.length - 3)}
                </Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row" }}>
                {[
                  ...new Array(
                    Math.ceil(page.teams.length / numStopsPerColumn)
                  ),
                ].map((_, i) => (
                  <View style={styles.halfPageSecion}>
                    <View style={styles.section}>
                      <Text style={styles.cellLargerTitle}>Team #</Text>
                      {(!page.first || !ignoreFirstStop) && (
                        <Text style={styles.cellLargerTitle}>Arrive</Text>
                      )}
                      {(!page.last || !ignoreLastStop) && (
                        <Text style={styles.cellLargerTitle}>Departure</Text>
                      )}
                    </View>
                    {page.teams
                      .filter((_, p) => Math.floor(p / numStopsPerColumn) == i)
                      .map((team, locIndex) => (
                        <View style={styles.section}>
                          <Text style={styles.cellLarger}>
                            {team.teamNumber}
                          </Text>
                          {(!page.first || !ignoreFirstStop) && (
                            <Text style={styles.cellLarger}>
                              {team.arrival}
                            </Text>
                          )}
                          {(!page.last || !ignoreLastStop) && (
                            <Text style={styles.cellLarger}>
                              {team.departure}
                            </Text>
                          )}
                        </View>
                      ))}
                  </View>
                ))}
              </View>
            </Page>
          ))}
        </Document>
      </PDFViewer>
      <PDFViewer style={styles.viewer}>
        {/* Start of the document*/}
        <Document title="Sheets For Organziers">
          {/*render a single page*/}

          <Page size="A4" style={styles.page} orientation="landscape">
            <Text
              style={{
                position: "absolute",
                left: 50,
                bottom: 30,
                color: "#eee",
                fontSize: "10px",
                textAlign: "center",
                width: "100%",
              }}
            >
              {COPYRIGHT}
            </Text>
            {splitTeamsPerRoute.map((route, index) => (
              <View>
                <Text
                  style={{ textAlign: "center", width: "100%", padding: "5px" }}
                >
                  Route {index + 1}
                </Text>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  {route[0].route.map((stop, si) => (
                    <Text
                      style={{
                        width: `${90 / route[0].route.length}%`,
                        fontSize: "6px",
                        borderRight: "1px solid black",
                        textAlign: "center",
                        paddingBottom: "5px",
                        ...(si === 0 && { marginLeft: "35px" }),
                      }}
                    >
                      {stop.name}
                    </Text>
                  ))}
                </View>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  {route[0].route.map((stop, si) => (
                    <View
                      style={{
                        width: `${90 / route[0].route.length}%`,
                        display: "flex",
                        flexDirection: "row",
                        borderRight: "1px solid black",
                        ...(si === 0 && { marginLeft: "35px" }),
                      }}
                    >
                      {(si !== 0 || !ignoreFirstStop) && (
                        <Text
                          style={{
                            fontSize: "6px",
                            textAlign: "center",
                            borderRight:
                              route[0].route.length - 1 && ignoreLastStop
                                ? "none"
                                : "1px solid black",
                            width:
                              si == route[0].route.length - 1 && ignoreLastStop
                                ? "100%"
                                : "50%",
                          }}
                        >
                          Arrive
                        </Text>
                      )}
                      {(si !== route[0].route.length - 1 ||
                        !ignoreLastStop) && (
                        <Text
                          style={{
                            fontSize: "6px",
                            textAlign: "center",
                            width: si == 0 && ignoreFirstStop ? "100%" : "50%",
                          }}
                        >
                          Depart
                        </Text>
                      )}
                    </View>
                  ))}
                </View>
                {route.map((team, ti) => (
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <Text style={{ fontSize: "8px", width: "35px" }}>
                      Team {team.teamNumber}
                    </Text>
                    {team.route.map((stop, si) => (
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          padding: 0,
                          margin: 0,
                          width: `${90 / route[0].route.length}%`,
                        }}
                      >
                        {(si !== 0 || !ignoreFirstStop) && (
                          <Text
                            style={{
                              width:
                                si == team.route.length - 1 && ignoreLastStop
                                  ? "100%"
                                  : "50%",
                              fontSize: "8px",
                              paddingRight: "2px",
                              borderRight: "1px solid black",
                              borderTop: "1px solid black",
                              borderBottom:
                                ti === route.length - 1
                                  ? "1px solid black"
                                  : "none",
                              textAlign: "center",
                              paddingTop: "1px",
                            }}
                          >
                            {stop.arrival}
                          </Text>
                        )}
                        {(si !== team.route.length - 1 || !ignoreLastStop) && (
                          <Text
                            style={{
                              width:
                                si == 0 && ignoreFirstStop ? "100%" : "50%",
                              fontSize: "8px",
                              paddingRight: "2px",
                              borderRight: "1px solid black",
                              borderTop: "1px solid black",
                              borderBottom:
                                ti === route.length - 1
                                  ? "1px solid black"
                                  : "none",
                              textAlign: "center",
                              paddingTop: "1px",
                            }}
                          >
                            {stop.departure}
                          </Text>
                        )}
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            ))}
          </Page>
        </Document>
      </PDFViewer>
    </>
  );
}
export default GeneratePDF;
