// import "./styles.css";
import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  ListSubheader,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useFormContext, Controller } from "react-hook-form";
import "../InputFieldComponent/InputFieldComponent.css";

interface Props {
  variant: string;
  selectedValue: string;
  clickHandler: (e: any) => void;
  selectLabel: string;
  selectList: any[];
  mandatory: boolean;
  disabled?: boolean;
  registerName: string;
  showableLabel?: string;
  showableData?: string;
  menuHeader?: string;
}

const Selectsearch: React.FC<Props> = ({
  variant,
  selectedValue,
  clickHandler,
  selectLabel,
  selectList,
  mandatory,
  disabled,
  registerName,
  showableData,
  showableLabel,
  menuHeader,
}) => {
  const containsText = (text: string, searchText: string) =>
    text?.toLowerCase()?.indexOf(searchText?.toLowerCase()) > -1;
  const [selectedOption, setSelectedOption] = useState("");
  const [searchText, setSearchText] = useState("");
  const { register, reset, unregister, getValues, control } = useFormContext();
  const [validation, setValidation] = useState(
    mandatory ? { required: "This field is Required" } : {}
  );

  const displayedOptions = useMemo(() => {
    if (searchText?.length > 0) {
      return selectList?.filter((option: any) =>
        containsText(option?.title + " (" + option.courseName + ")", searchText)
      );
    } else {
      return selectList;
    }
  }, [searchText]);

  useEffect(() => {
    if (getValues(registerName) && selectList?.length > 0) {
      let data = selectList?.find(
        (b: any, i: number) => b?.id == getValues(registerName)
      );
      setSelectedOption(data?.title + " (" + data?.courseName + ")");
    } else {
      setSelectedOption("");
    }
  }, [getValues(registerName), selectList]);

  function extractContent(s: any) {
    var span = document.createElement("span");
    span.innerHTML = s;
    return span.textContent || span.innerText;
  }
  return (
    <div
      className={variant == "fill" ? "selectFillType" : "selectTransparentType"}
    >
      <Controller
        name={registerName}
        rules={validation}
        control={control}
        render={({ field: { onChange, value, ref } }) => {
          return (
            <FormControl fullWidth>
              <InputLabel>
                {selectLabel}
                {mandatory ? "*" : ""}
              </InputLabel>
              <Select
                inputRef={ref}
                // Disables auto focus on MenuItems and allows TextField to be in focus
                MenuProps={{ autoFocus: false }}
                labelId="search-select-label"
                id="search-select"
                value={
                  getValues(registerName)
                    ? extractContent(getValues(registerName))
                    : extractContent(selectedOption)
                }
                label={selectLabel}
                disabled={disabled}
                onChange={(e) => {
                  clickHandler &&
                    clickHandler(
                      selectList.map((el) => el.id).indexOf(e.target.value)
                    );
                  onChange(e.target.value);
                }}
                onClose={() => setSearchText("")}
                // This prevents rendering empty string in Select's value
                // if search text would exclude currently selected option.
                renderValue={() => extractContent(selectedOption)}
              >
                {/* TextField is put into ListSubheader so that it doesn't
              act as a selectable item in the menu
              i.e. we can click the TextField without triggering any selection.*/}
                <ListSubheader>
                  <TextField
                    autoComplete="off"
                    size="small"
                    className={`inputFieldStyling mediumSize`}
                    // Autofocus on textfield
                    autoFocus
                    label={"Type to search..."}
                    fullWidth
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key !== "Escape") {
                        // Prevents autoselecting item while typing (default Select behaviour)
                        e.stopPropagation();
                      }
                    }}
                    style={{ marginTop: "12px", marginBottom: "6px" }}
                  />
                </ListSubheader>
                {displayedOptions?.length == 0 && searchText == "" ? (
                  selectList?.map((option: any, i: number) => (
                    <MenuItem key={i} value={option?.id}>
                      {extractContent(option?.title)}{" "}
                      {option.courseName ? " (" + option.courseName + ")" : ""}
                    </MenuItem>
                  ))
                ) : displayedOptions?.length == 0 && searchText !== "" ? (
                  <MenuItem value={undefined} disabled>
                    No Items Available
                  </MenuItem>
                ) : (
                  displayedOptions?.map((option: any, i: number) => (
                    <MenuItem key={i} value={option?.id}>
                      {extractContent(option?.title)}{" "}
                      {option.courseName ? " (" + option.courseName + ")" : ""}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          );
        }}
      />
    </div>
  );
};
export default Selectsearch;
