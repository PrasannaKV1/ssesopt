import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";
import "./MIFCreateOnlineQuestionPaperPreview.css";
import InputFieldComponent from "../../SharedComponents/InputFieldComponent/InputFieldComponent";
import { Dayjs } from "dayjs";
import DatePickerComponent from "../../SharedComponents/DatePickerComponent/DatePickerComponent";
import TimePickerComponent from "../../SharedComponents/TimePickerComponent/TimePickerComponent";
import CheckBoxComponent from "../../SharedComponents/CheckBoxComponent/CheckBoxComponent";
import MultiSelectInlineCheckBox from "../../SharedComponents/MultiSelectInlineCheckBox/MultiSelectInlineCheckBox";
import SelectComponentForSet from "../../SharedComponents/SelectComponentForSet/SelectComponentForSet";
import ButtonComponent from "../../SharedComponents/ButtonComponent/ButtonComponent";
import goBack from "../../../assets/images/goBack.svg";
import { getGradeSectionApi, studentDetailPostApi } from '../../../Api/QuestionPaper';

const CreateOnlineQuestionPaperPreview = () => {
  const [dropDownSelectValues, setDropdownSelectValue] = useState([])
  const [selectedGradeId, setSelectedGradeId] = useState<any>("")
  const [searchDropListArray, setSearchDropListArray] = useState([])
  const handleClick = () => { };
  const [value, setValue] = React.useState<Dayjs | null>(null);
  const checkhandler = () => { };
  const handleselect = () => { };
  const GetGradeSectionData = async () => {
    const response = await getGradeSectionApi(1, 2, 0)
    setDropdownSelectValue(response.classes)
  } 

  const PostGradeSectionData = async (searchKey:string) => {
    const studentDetailData = {
      searchStudent: searchKey,
      classID : selectedGradeId,
      academicId : 2,
      academicStatusId :0
    }

    let studentListArray:any = []
    const gradeStudentListResp = await studentDetailPostApi(studentDetailData);
    gradeStudentListResp.data?.map((studentDetail: any)=>{     
      studentListArray.push({
        section: studentDetail.ClassName,
        StudentName: studentDetail.studentfirstname + (studentDetail.studentlastname != null ? " " : "") + (studentDetail.studentlastname != null ? studentDetail.studentlastname : ""),
      })
    })
    setSearchDropListArray(studentListArray)
  } 

  useEffect(() => {
    GetGradeSectionData()
  },[])

const sectionSelectedHandler = (dropSelect:any) =>{

  if(dropDownSelectValues.length){
    dropDownSelectValues?.map((val: any)=>{     
      if(val.section == dropSelect[0]){
        setSelectedGradeId(val.classId);
      }
    }) 
  }else{
    setSelectedGradeId("")
  }
  }
  useEffect(() => {
    PostGradeSectionData("")
  },[selectedGradeId])
  return (
    <div>
      <Box className='questionPaperPreviewContainer'>
        <h1>Create Online Assessment Question Paper</h1>
        <h3>Assign this assessment to students form them to attempt it online or print it.</h3>
        <Box className="assesContainerQuestionStyling mt-4">
          <Box className="header">
            <p style={{ paddingTop: "20px", marginLeft: "25px" }}>
              This is how the students will see your question paper:
            </p>
            <Box className="numberSetSelectBoxStyling mb-2">
              <SelectComponentForSet />
            </Box>
          </Box>
          <Box className="assessQuestionPaperBoxStyling">
            <Box className="timeAndMarksTrack">
              <p>Total Marks: 50</p>
              <p>Total time: 60 mins</p>
            </Box>
            <Box className="questionPaperandassignBox">
              <Box className="questionPaperBox"></Box>
              <Box className="questionAssignBox">
                <p> How do you want to remember this qusetion paper?*</p>
                <InputFieldComponent
                  label="Start typing here..."
                  required={false}
                  onChange={handleselect}
                  inputSize="40px"
                  variant=""
                  inputType=""
                />
                <p style={{ marginTop: "20px" }}>
                  Assign this assessment to sections:
                </p>
                <div className="multiinlineSelect">
                  <MultiSelectInlineCheckBox
                    label="Select section(s)..."
                    dropDownSelectValues={dropDownSelectValues} dropSelectHandler={sectionSelectedHandler}                  />
                </div>
                <Box className="datetimepickerboxstyling">
                  <Box
                    className="datepickerstyling"
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
                    <DatePickerComponent datetitle="Assign On" />
                    <DatePickerComponent datetitle="Due on " />
                  </Box>
                  <Box
                    className="timepickerstyling"
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
                    <TimePickerComponent />
                    <TimePickerComponent />
                  </Box>
                </Box>
                <Box className="checkBoxStylingwithlabel">
                  <CheckBoxComponent
                    checkLabel="Label"
                    disable={false}
                    onChangeHandler={checkhandler}
                    checkStatus={false}
                  />
                  <p className="mt-1">
                    Allow student to submit even after the last date
                  </p>
                </Box>
                <Box className="searhstudentbox" sx={{ marginTop: "15px" }}>
                  <p>Excluding the following students:</p>
                </Box>
              </Box>
            </Box>
          </Box>
          <div className="autoSelectFooter">
            <div
              className="d-flex"
              style={{ alignItems: "center", justifyContent: "space-between" }}
            >
              <div>
                <h4 className="cursorPointer mt-2">
                  <img src={goBack} alt="Img" />
                  Go Back
                </h4>
              </div>
              <div style={{ display: "flex", gap: "20px" }}>
                <ButtonComponent
                  icon={""}
                  image={""}
                  textColor="#1B1C1E"
                  backgroundColor="#9A9A9A"
                  disabled={false}
                  buttonSize="Medium"
                  type="outlined"
                  onClick={() => { }}
                  label="Exit"
                  minWidth="120"
                />
                <ButtonComponent
                  type="contained"
                  label={"Finish"}
                  textColor={""}
                  buttonSize="Medium"
                  minWidth={"120"}
                  backgroundColor="#01B58A"
                  disabled={false}
                  onClick={handleClick}
                />
              </div>
            </div>
          </div>

        </Box>

      </Box>
    </div>
  );
};

export default CreateOnlineQuestionPaperPreview;
