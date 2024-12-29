/* eslint-disable no-use-before-define */
import React, { useState,useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete, {
  createFilterOptions
} from "@material-ui/lab/Autocomplete";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { Checkbox } from "@material-ui/core";
import { retainDataHandler } from "../../../constants/helper";

interface Props {
  items: any,
  label: any,
  selectAllLabel?: any,
  noOptionsText?: any,
  limitTags?: any,
  onChange?: any,
  disable?: any,
  multiType?: any,
  lsName?:any
}

const MultiSelectWithCheckbox: React.FC<Props> = ({
  items,
  label,
  selectAllLabel,
  noOptionsText,
  limitTags,
  onChange,
  disable,
  multiType,
  lsName
}) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const allSelected = items.length === selectedOptions.length;
  const handleToggleOption = (selectedOptions: any) =>
    setSelectedOptions(selectedOptions);
  const handleClearOptions = () => setSelectedOptions([]);
  const getOptionLabel = (option: any) => `${option.label}`;
  const handleSelectAll = (isSelected: any) => {
    if (isSelected) {
      setSelectedOptions(items);
    } else {
      handleClearOptions();
    }
  };

  const handleToggleSelectAll = () => {
    handleSelectAll && handleSelectAll(!allSelected);
  };

  const handleChange = (event: any, selectedOptions: any, reason: any) => {
    if (reason === "select-option" || reason === "remove-option") {
      if (selectedOptions.find((option: any) => option.value === "select-all")) {
        handleToggleSelectAll();
        diableOptions(true)
        let result = [];
        result = items.filter((el: any) => el.value !== "select-all");
        return onChange(result);
      } else {
        diableOptions(false)
        handleToggleOption && handleToggleOption(selectedOptions);
        return onChange(selectedOptions);
      }
    } else if (reason === "clear") {
        diableOptions(false)
        onChange([]);
        handleClearOptions && handleClearOptions();
    }
  };

  const diableOptions = (isDisabled:boolean) => {
    [...items].forEach((opt) => {
      opt.disabled = isDisabled;
      return opt;
    });
  }

  const [key,setKey]=useState(Math.random())
  useEffect(()=>{
    if(lsName && items?.length>0){
      let data= retainDataHandler(items,"value",lsName,"qbList_history")
        if(data && data?.length>0){
            if(Array.from(new Set([...data]))?.length=== (Array.from(new Set([...items]))?.length-1)){
                onChange(data??[])
                setSelectedOptions(data??[])
            }else{
                onChange(data??[])
                setSelectedOptions(data??[])
            }
            setKey(Math.random())
        }
    }

},[items])

  const optionRenderer = (option: any, { selected }: any) => {
    const selectAllProps =
      option.value === "select-all" // To control the state of 'select-all' checkbox
        ? { checked: allSelected }
        : {};
    return (
      <>
        <Checkbox
          color="primary"
          icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
          checkedIcon={<CheckBoxIcon fontSize="small" />}
          style={{ marginRight: 8 }}
          checked={selected}
          {...selectAllProps}
        />
        {getOptionLabel(option)}
      </>
    );
  };
  const inputRenderer = (params: any) => (
    <TextField {...params} label={label} />
  );
  const getOptionSelected = (option: any, anotherOption: any) =>
    option.value === anotherOption.value;
  const filter = createFilterOptions();
  return (
    <div className={`${disable ? "disableWrapper" : ""} ${multiType == "Multi1" ? "multiSelectDropdown" : "multiSelectDefaultCheck"}`}>
      <Autocomplete
        key={key}
        multiple
        //   size="small"
        limitTags={limitTags}
        options={items}
        value={selectedOptions.length == items.length ? [{ label: selectAllLabel, value: "select-all" }] : selectedOptions  }
        disableCloseOnSelect
        getOptionLabel={getOptionLabel}
        getOptionDisabled={(option:any) => !!option.disabled}
        getOptionSelected={getOptionSelected}
        noOptionsText={noOptionsText}
        filterOptions={(options: any, params: any) => {
          const filtered = filter(options, params);
          return filtered.length == 0 ? filtered : [{ label: selectAllLabel, value: "select-all" }, ...filtered];
        }}
        onChange={handleChange}
        renderOption={optionRenderer}
        renderInput={inputRenderer}
      />
    </div>
  );
};

export default MultiSelectWithCheckbox;
