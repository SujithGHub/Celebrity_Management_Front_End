import React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { IconButton, InputAdornment, Typography } from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, selectedNames, theme) {
  return {
    fontWeight:
      selectedNames.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function MultipleSelect({ label, data, names, handleChange, keyName, handleClear }) {
  const theme = useTheme();

  return (
    <div>
      <FormControl sx={{ m: 1, width: 400 }}>
        <InputLabel id="demo-multiple-chip-label">{label}</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={names}
          onChange={(e)=>handleChange(e, keyName)}
          input={
            <OutlinedInput id="select-multiple-chip" endAdornment={
              (names.length > 0 && keyName != 'topics') && (
                <InputAdornment position="end">
                  <IconButton onClick={handleClear} edge="start">
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              )
            } label={label} />
          }
          renderValue={() => {
            return (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {names.map((name) => (
                  <Chip key={name.id} label={name.name} />
                ))}
              </Box>
            )
          }}
          MenuProps={MenuProps}
        >
          {data.map((rec) => (
            <MenuItem
              key={rec.id}
              value={rec}
              style={getStyles(rec.name, names, theme)}
            >
              {rec.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}