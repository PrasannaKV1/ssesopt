import React, { useState } from "react";
import "./EvaluationTableMobile.css";
import { Box, TextField, Modal, Avatar, SelectChangeEvent } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import ButtonComponent from "../../../SharedComponents/ButtonComponent/ButtonComponent";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
// import chevronright from "../../assets/images/chevronright.svg";
import chevronright from "../../../../assets/images/chevronright.svg";

interface StudentInterface {
  // handelClosePopUp: () => void;
  studentData: any;
  tableData: any[]; // selectedQuestion: any;
  allocationID:any;
  selectedQuestion:any
  setStudentData:any
  setStudentModalOpen:any
  handleMultiSelectChange?: (e: SelectChangeEvent<{ value: unknown }>, index: number, item: any) => void; 
  handleChangeMarks?: (e: React.ChangeEvent<HTMLInputElement>, index: number, item: any) => void;
  handleEditClick?:any
  isEditMode:boolean
  handleRemarksChange?: (newRemarks: string) => void;
  value:string


}
const style = {
  width: "100%",
  background: "#ffffff",
  height: "100vh",
  overflowY: "auto",
};
const EvaluationTableMobile = (props: StudentInterface) => {
  const [selectedValue, setSelectedValue] = useState("");
  const [value, setValue] = useState("");
  const [tab, setTab] = React.useState("1");
  // const [isEditMode, setIsEditMode] = useState(false);
  const [spinnerStatus, setSpinnerStatus] = useState(false);
   const handleChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSelectedValue(event.target.value);
  };
  const handleChangeInput = (e:any) => {
    if(props?.handleRemarksChange){
      props?.handleRemarksChange(e)
    }
  };
  const handleChangeTabs = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  const handleChevronClick = () => {
    props?.setStudentModalOpen(false)
  };
    
const handleMarksChange = (e: any, itemIndex: number) => {
  if (props?.handleChangeMarks) {
    props.handleChangeMarks(e, itemIndex, props?.tableData[itemIndex]);
  }
};
const getMaxLength = (actualMarks: any) => {
  return actualMarks <= 9 ? 3 : 4;
};
  return (
    <>
      <Modal
        open={true}
        // onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="preview-container" sx={style}>
          <div className="preview-sets">
            <div style={{ display: "flex", gap: 10 }}>
              <div className="preview-image">
                <img
                  src={chevronright}
                  alt="arrow"
                  onClick={handleChevronClick}
                  // className={styles.arrowIcon}
                />
              </div>
              <div>
                <div style={{ display: "flex", gap: 10 }}>
                  <span>Test</span>
                  <span>|</span>
                  <span>Mathematics</span>
                </div>
                <div>
                  <span>30 marks | Informal | Offline</span>
                </div>
              </div>
            </div>
            <div className="preview-sets">
              <div style={{ width: "100%" }} className="preview-tabs">
                <Tabs
                  value={tab}
                  onChange={handleChangeTabs}
                  aria-label="wrapped label tabs example"
                >
                  <Tab value="1" label="Set 1" wrapped />
                  <Tab value="2" label="Set 2" />
                  <Tab value="3" label="Set 3" />
                  <Tab value="4" label="Set 4" />
                </Tabs>
              </div>
              <div
                style={{
                  marginTop: 20,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <ButtonComponent
                  type={"outlined"}
                  label={"Upload Sheet"}
                  textColor={""}
                  buttonSize={"Medium"}
                  minWidth={"390"}
                />
              </div>
            </div>
          </div>
          <div
            className="table-name-avatars preview-avatars"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", gap: 20 }}>
              <div>
                <Avatar src={props?.studentData?.studentProfileImg} />
              </div>
              <div className="table-name-avatars-title">
                <div className="evaluate-std-name">{`${
                  props?.studentData?.studentName || ""
                } ${props?.studentData?.lastName || ""}`}</div>
                <div className="evaluate-std-class">
                  {props?.studentData?.className || ""} | Roll No .
                  {props?.studentData?.rollNo || ""}
                </div>
              </div>
            </div>
            <div
              className="status-div preview-status"
              style={{
                background:
                  props?.studentData?.status === "Publish"
                    ? "rgba(1, 181, 138, 0.1)"
                    : "",
              }}
            >
              <span
                style={{
                  color:
                    props?.studentData?.status === "Publish" ? "#01B58A" : "",
                }}
              >
                {props?.studentData?.status === "Publish"
                  ? "Published"
                  : props?.studentData?.status || "Draft"}
              </span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px",
            }}
          >
            <div className="preview-percentage">
              <span>Percentage</span>
              <span style={{ fontWeight: 700, fontSize: "18px" }}>
                {Math.round(props?.studentData?.percentage) || 0}%
              </span>
            </div>
            <div className="preview-marks">
              <span>Marks Scored</span>
              <span>
                <span style={{ fontWeight: 700, fontSize: "18px" }}>
                  {props?.studentData?.obtainedMarks || 0}
                </span>
                /{props?.studentData?.marks || 0}
              </span>
            </div>
          </div>

          {/* )} */}
          <div className="dashed-line"></div>
          <p className="preview-heading">Marks Breakup & Analytics</p>
          {props?.tableData.length > 0 &&
            props.tableData?.map((item: any,index: any) => (
              <Box className="card-container" key={item.questionId}>
                <CardContent>
                  <div className="question-section">
                    <span className="question-sec-heading">Question No.01</span>
                    <span className="question-sec-part">
                      PART 1 - SECTION 2
                    </span>
                  </div>
                  <div>
                    <span className="question-sec-marks">Marks</span>
                    <div>
                      <input
                        type="text"
                        className="question-sec-input"
                        value={item.obtainedMarks}
                        onChange={(e) => {
                          let inputValue: any = e.target.value.replace(/[^0-9.]/g, '');
                          const maxLength = getMaxLength(item.actualMarks);
                          if (inputValue.length > maxLength) {
                            inputValue = inputValue.slice(0, maxLength);
                          }
                          const [integerPart, decimalPart] = inputValue.split('.');
                          if (decimalPart && decimalPart.length > 1) {
                            inputValue = `${integerPart}.${decimalPart.slice(0, 1)}`;
                          }
                          // const value = e.target.value.slice(0, 3);
                          handleMarksChange({ ...e, target: { ...e.target, value: inputValue } }, index);
                        }}
                        disabled={!props?.isEditMode}
                        style={{ width: "30px" }}
                      />
                      <span>
                        <span>
                          {" "}
                          / {parseFloat(item.actualMarks).toFixed(0)}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="dashed-line"></div>
                  <div>
                    <span className="question-sec-error">Error</span>
                    <div>
                      <FormControl fullWidth>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={selectedValue}
                          onChange={handleChange}
                        >
                          <MenuItem value={10}>Option 1</MenuItem>
                          <MenuItem value={20}>Option 2</MenuItem>
                          <MenuItem value={30}>Option 3</MenuItem>
                        </Select>
                      </FormControl>{" "}
                    </div>
                  </div>
                </CardContent>
              </Box>
            ))}
          <Box className="preview-teacher">
            <p className="preview-teacher-head">Teacher Remarks</p>
            <Box>
              <TextField
                className="preview-teacher-area"
                // label="Your Message"
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                value={props?.value}
                onChange={handleChangeInput}
                margin="normal"
              />
            </Box>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <ButtonComponent
                icon={""}
                disabled={props?.studentData?.status === "Publish" || spinnerStatus}
                onClick={props?.handleEditClick}
                image={""}
                textColor="#FFFFFF"
                backgroundColor=" #01B58A"
                buttonSize="Medium"
                type="contained"
                label={!props?.isEditMode ? "Edit" : "Save"}
                minWidth="150"
              />
              <ButtonComponent
                icon={""}
                image={""}
                textColor="#FFFFFF"
                backgroundColor=" #01B58A"
                disabled={false}
                buttonSize="Medium"
                type="contained"
                label="Unpublish"
                minWidth="150"
              />
            </div>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default EvaluationTableMobile;
