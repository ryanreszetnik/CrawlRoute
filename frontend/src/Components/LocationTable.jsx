import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import InitialTableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import { Checkbox, IconButton, styled, TextField } from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";

const TableCell = styled(InitialTableCell)({
  padding: 1,
});

export default function LocationTable({ locations, onChange, removeLocation }) {
  const [hasSendOff, setHasSendOff] = useState(false);
  const [hasEnd, setHasEnd] = useState(false);
  useEffect(() => {
    setHasSendOff(locations.some((l) => l.first));
    setHasEnd(locations.some((l) => l.last));
  }, [locations]);
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Number</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Name</TableCell>
            <TableCell align="right">Latitude</TableCell>
            <TableCell align="right">Longitude</TableCell>
            <TableCell align="right">Sendoff</TableCell>
            <TableCell align="right">After</TableCell>
            <TableCell align="right">Food</TableCell>
            <TableCell align="right">Double</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {locations.map((row, i) => (
            <TableRow
              key={i}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row" align="center">
                {i + 1}
              </TableCell>
              <TableCell>{row.location.split(",")[0]}</TableCell>
              <TableCell>{row.address}</TableCell>
              <TableCell width={250}>
                <TextField
                  variant="standard"
                  value={row.name}
                  onChange={(e) => onChange(i, "name", e.target.value)}
                />
              </TableCell>

              <TableCell align="right">
                {Math.round(row.lat * 10000000) / 10000000}
              </TableCell>
              <TableCell align="right">
                {Math.round(row.lng * 10000000) / 10000000}
              </TableCell>
              <TableCell align="right">
                <Checkbox
                  disabled={
                    row.food ||
                    row.double ||
                    (hasSendOff && !row.first) ||
                    row.last
                  }
                  checked={row.first}
                  onChange={(e) => onChange(i, "first", e.target.checked)}
                />
              </TableCell>
              <TableCell align="right">
                <Checkbox
                  disabled={
                    row.food || row.double || (hasEnd && !row.last) || row.first
                  }
                  checked={row.last}
                  onChange={(e) => onChange(i, "last", e.target.checked)}
                />
              </TableCell>
              <TableCell align="right">
                <Checkbox
                  disabled={row.first || row.last}
                  checked={row.food}
                  onChange={(e) => onChange(i, "food", e.target.checked)}
                />
              </TableCell>
              <TableCell align="right">
                <Checkbox
                  disabled={row.first || row.last}
                  checked={row.double}
                  onChange={(e) => onChange(i, "double", e.target.checked)}
                />
              </TableCell>
              <TableCell align="right">
                <IconButton onClick={() => removeLocation(i)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
