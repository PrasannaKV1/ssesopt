import * as React from 'react';
import {
  ListSubheader,
  TextField
} from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { ReactComponent as Chevrondown } from "../../../assets/images/chevrondown.svg";
import "../InputFieldComponent/InputFieldComponent.css"
import { retainDataHandler } from '../../../constants/helper';

interface Props {
  options:any[],
  onChange:any,
  disable: boolean | undefined,
  addableFiled?:string,
  showableField:string,
  selectableField:string,
  values:string,
  lsName?:string
}

const MultiSearchFilter: React.FC<Props> = ({lsName,options, onChange,disable,addableFiled,showableField,selectableField,values}) => {
  const OptionsArr = options?.map((x:any)=>x?.[selectableField])
  const [selectedMenuItem, setSelectedMenuItem] = React.useState<string[]>([]);
  const [searchText, setSearchText] = React.useState("");
  const containsText = (text: string, searchText: string) => text?.toLowerCase()?.indexOf(searchText?.toLowerCase()) > -1;
  const displayedOptions = React.useMemo(() => {    
    if (searchText?.length > 0) {
      let filteredArr = options?.filter((option: any) => containsText(option?.[showableField], searchText));
      return filteredArr?.map((x:any)=>x?.[selectableField])
    } else {
      return OptionsArr
    }
  }, [searchText,OptionsArr]);

  const handleChange = (e: any) => {
    if (e.target.value.includes("All")) {
      if (selectedMenuItem?.length != OptionsArr?.length) {
        setSelectedMenuItem(OptionsArr);
        onChange(OptionsArr)
      } else {
        setSelectedMenuItem([]);
        onChange([])
      }
    } else {
      handleSelectGrade(e);
    }
  };

  React.useEffect(()=>{
    if(values == '') setSelectedMenuItem([])    
  },[values])

  const handleSelectGrade = (e: any) => {    
    let value = e.target.value;
    setSelectedMenuItem(value);
    onChange(value)
  }

  React.useEffect(()=>{
    if(lsName && options.length>0){
     const populateData= retainDataHandler(options,selectableField,lsName,"qbList_history")
     setSelectedMenuItem(populateData ?? [])
     onChange(populateData)
    }
  },[options])

  return (
    <div className={`${disable ? "disableWrapper" : ""} `}>
      <FormControl sx={{ m: 1, width: 160 }}>
        <InputLabel shrink={false} style={{ color: 'black' }}>{selectedMenuItem?.length > 0 ? '' : addableFiled?.replace('All','Select')}</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          MenuProps={{
            autoFocus: false,
            PaperProps: {
              style: {
                maxHeight:'250px',
                overflowY:'auto',
                width:'auto',
                boxShadow: '0px 2.85981px 15.729px rgba(0, 0, 0, 0.12)'
              }
            }
          }}
          multiple
          value={selectedMenuItem}
          onChange={(e: any) => { handleChange(e) }}
          onClose={() => setSearchText("")}
          IconComponent={Chevrondown}
          renderValue={(selected: string[]) => {
            return(
              <div className='d-flex'>
                <div className={options?.length == selectedMenuItem?.length ? '' :'textWrap'}>{options?.length == selectedMenuItem?.length ? addableFiled : options?.find((x) => (x?.[selectableField] == selected[0]))?.[showableField]}</div>
                <div>{options?.length == selectedMenuItem?.length ? '' : <span style={{ marginLeft: '5px' }}>{selected?.length > 1 ? `+${selected.length - 1}` : ''}</span>}</div>
              </div>
          )}}
          sx={{
            boxShadow: "none",
            ".MuiOutlinedInput-notchedOutline": { border: 0 },
            "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
            {
              border: 0,
            },
            "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
            {
              border: 0,
            },
            '& .MuiSelect-icon': {
              top: "1.4rem",
              paddingLeft:'2px'              
           }
          }}
        >
          <ListSubheader>
            <TextField  
              className={`inputFieldStyling mediumSize`}
              label={`Search ${addableFiled?.replace('All','').toLowerCase()}...`}         
              autoComplete='off'
              size="small"                           
              fullWidth
              onChange={(e) => setSearchText(e.target.value)}
              value={searchText}
              onKeyDown={(e) => {
                if (e.key !== "Escape") {
                  e.stopPropagation();
                }
              }}
             style={{ marginTop: '7px'}}
            />
          </ListSubheader>
          { searchText?.length == 0 && displayedOptions?.length > 0 &&
            <MenuItem key={'All'} value={'All'} style={{ background: 'none' }}>
              <Checkbox size="small" checked={selectedMenuItem?.length > 0 && selectedMenuItem?.length === OptionsArr?.length}
              />
              <ListItemText primary={addableFiled} />
            </MenuItem>
          }         
          {displayedOptions?.length > 0 ? displayedOptions?.map((id:string, i:number) => {
            return (<MenuItem key={i} value={id} style={{ background: 'none' }}>
              <Checkbox size="small" checked={selectedMenuItem?.indexOf(id) > -1} />
              <ListItemText primary={options?.find((x)=>(x?.[selectableField] == id))?.[showableField]} />
            </MenuItem>
            )
          }) : <MenuItem disabled>No data found</MenuItem> }
        </Select>
      </FormControl>
    </div>
  );
};

export default MultiSearchFilter;