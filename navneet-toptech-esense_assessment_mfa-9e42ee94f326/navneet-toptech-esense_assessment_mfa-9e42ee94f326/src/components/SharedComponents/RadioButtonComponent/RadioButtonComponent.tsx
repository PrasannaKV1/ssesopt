import React from "react";
import "./RadioButtonComponent.css";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
type props={
    radiolabel:string,
    disable: boolean,
    changeradio:any,
}
    const RadioButtonComponent:React.FC<props> = ({radiolabel, disable, changeradio}) => {
      const handleradio=()=>{
        changeradio();
      }
  return (
    <>
    <div className="radio" style={{width:"20px"}}>
      <RadioGroup>
        <FormControlLabel
        value="female"
        control={<Radio />}
        label={radiolabel}
        disabled={disable}
        onChange={handleradio}
        /> 
      </RadioGroup>
      </div>
    </>
  );
};
export default RadioButtonComponent;