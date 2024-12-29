import React, { Component } from "react";
import ButtonComponent from "../../../src/components//SharedComponents/ButtonComponent/ButtonComponent";
import { Route, Routes, useLocation,useNavigate } from "react-router-dom";
import TeacherCentricComponent from "./teacher-centric/TeacherCentricComponent";
import {useState, useEffect} from 'react';
import StudentListingModalPopUp from "./student-centric/StudentListingModalPopUp";
const Assess =  (props:any) => {
  const[close, setClose] = useState<boolean>(false);
  const[open,setOpen] = useState<boolean>(false);
  let navigate = useNavigate();
  const handleClick = (navigation: string) => {
    console.log("Props inside Assess",props);
    let data = {allocationGroupId : props.allocationGroupId}
    if (navigation === "studentCentric") {
      console.log("inside studentCentric");
      setOpen(true);
    } else {
      console.log("outside student centric");
      navigate(`/assess/assessmentReports/showReports/${navigation}`,{state:data})
    }
  };
  return (
    <>
    <div className="reportComponent">
      <div className="title">{props?.reportData?.title}</div>
      <div className="description">{props?.reportData?.description}</div>
      <div className="demoButton">
        <ButtonComponent
          image={""}
          textColor=""
          backgroundColor="#ff4d4d"
          buttonSize="Medium"
          type="contained"
          label="View"
          hideBorder={true}
          onClick={() => {
              handleClick(props?.reportData?.typeOfReport);
          }}
          minWidth="100"
        />
      </div>
    </div>
    {
      open && <div><StudentListingModalPopUp open={open} allocationGroupId={props?.allocationGroupId} onClose={()=>setOpen(false)}/></div>
    }
    </>
  );
}
export default Assess;
