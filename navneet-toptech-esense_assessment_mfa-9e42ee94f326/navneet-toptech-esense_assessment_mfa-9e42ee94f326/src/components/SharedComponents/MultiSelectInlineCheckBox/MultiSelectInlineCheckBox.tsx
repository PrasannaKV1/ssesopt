import React, { useState } from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import "./MultiSelectInlineCheckBox.css";
import CheckBoxComponent from "../CheckBoxComponent/CheckBoxComponent";

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

type props={
  label:string,
  dropDownSelectValues:any[],
  dropSelectHandler:any
}

const MultiSelectInlineCheckBox: React.FC<props>= ({label, dropDownSelectValues, dropSelectHandler}) => {
  const [personName, setPersonName] = React.useState<string[]>([]);
  const[count, setCount] = useState<any>();
  const handlAllCheck = (e: any) => {
    console.log(e);
    if (e) {
      setPersonName([...dropDownSelectValues]);
    } else {
      setPersonName([]);
    }
    dropSelectHandler(dropDownSelectValues)
  };
  const handleChange = (event:any ) => {
    console.log(event)
    const {target: { value },} = event;
    setPersonName(typeof value === "string" ? value.split(",") : value);
    console.log(value);
    dropSelectHandler(value)
  };

  return (
    <div >
      <FormControl className="w-100">
        <InputLabel id="demo-multiple-checkbox-label">
          {label}
        </InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={personName}
          onChange={(event)=>handleChange(event)}
          input={<OutlinedInput label={label} />}
          renderValue={(selected) => selected.join(", ")}
          MenuProps={MenuProps}
        >
          <MenuItem>
            <CheckBoxComponent
              checkLabel={""}
              disable={false}
              onChangeHandler={handlAllCheck}
              checkStatus={false}
            />
            Select all
          </MenuItem>
          {dropDownSelectValues.map((value) => (
            <MenuItem
              key={value.section}
              value={value.section}
              sx={{ display: "inline-flex", width: "50%" }}
            >
              <Checkbox checked={personName.indexOf(value.section) > -1} />
              <ListItemText primary={value.section} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default MultiSelectInlineCheckBox;
