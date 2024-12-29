import "./marksBreakUp.css";
import React from 'react';
import { Divider } from "@mui/material";

import { GredbookStudentList } from '../interface/assesment-interface';
import AvtarSection from '../components/QuestionPaperContainer/QuestionPaperAdminTable/TemplateCreation/AvtarSection';
import TeacherRemark from "./TeacherRemark";
import MarksBreakupTable from "./MarksBreakupTable";
import ButtonColorComponent from "../components/SharedComponents/ButtonColorComponent/ButtonColorComponent";
import Avatar from "@mui/material/Avatar";
interface MraksBreakUpPropsInterface {
  data?: any;
  studentData: any;
  isEditable: boolean;
  remarks: string;
  handleRemarksChange?: (newRemarks: string) => void; // Optional prop
  tableData: any[]; // Replace 'any' with your specific type
  handleChangeMarks?: (e: any, index: number, item: any) => void; // Optional prop
  handleMultiSelectChange?: (e: any, index: number, item: any) => void; // Optional prop
  isReport?: boolean
  handleViewQuestionPaper?: () => void
  handleAnswerModal?: () => void
}

const MraksBreakUp: React.FC<MraksBreakUpPropsInterface> = (props) => {
  return (
    <div className='marks-breakup-container'>
      {/* Header section */}
      <div className="inner-container-header" style={{paddingBottom:"10px"}}>
        <div className="table-name-avatars" style={{ display: 'flex', gap: '20px' }}>
          {!props?.isReport && props?.isReport === undefined && 
          <Avatar src={props?.studentData?.studentProfileImg} />
          // <AvtarSection
          //   firstName={props?.studentData?.studentName || ""}
          //   profile={props?.studentData?.studentProfileImg} // Pass the profile URL or identifier here
          // />
          }
          {props?.isReport && props?.isReport && <div style={{ fontWeight: "700", fontSize: "18px" }}>
            Marks Breakup & Analytics
          </div>}
          {!props?.isReport && props?.isReport === undefined && <div className="table-name-avatars-title">
            <div className="evaluate-std-name">{`${props?.studentData?.studentName || ""} ${props?.studentData?.lastName || ""}`}</div>
            <div className="evaluate-std-class">{props?.studentData?.className || ""} | Roll No .{props?.studentData?.rollNo || ""}</div>
          </div>}
        </div>
        {!props?.isReport && props?.isReport === undefined && <div className="inner-container-header-right-side">
          <div className="status-div" style={{background:props?.studentData?.status === "Publish" ? "rgba(1, 181, 138, 0.1)" : ''}}>
            <span style={{color: props?.studentData?.status === "Publish" ? "#01B58A" : ''}}>
              {props?.studentData?.status === "Publish" ? "Published" : props?.studentData?.status || "NA"}
            </span>
          </div>
          <div className="percentage-div">
            <span>Percentage</span>
            <span style={{ fontWeight: 700, fontSize: '18px' }}>
              {Math.round(props?.studentData?.percentage) || 0}%
            </span>
          </div>
          <div className="marks-scored-div">
            <span>Marks Scored</span>
            <span >
              <span style={{ fontWeight: 700, fontSize: '18px' }}>{props?.studentData?.obtainedMarks || 0}</span>
              /{props?.studentData?.marks || 0}
            </span>
          </div>
        </div>}

        {props?.isReport && props?.isReport && <div className="inner-container-header-right-side">
          <ButtonColorComponent
            buttonVariant='outlined'
            textColor={"#000000"}
            borderColor={"#01B58A"}
            label={"View Question Paper"}
            width='200px'
            height='36px'
            onClick={() => { props?.handleViewQuestionPaper && props?.handleViewQuestionPaper() }}
            backgroundColor=""
            disabled={false}
          />
          {/* View Modal Ans Button */}
          <ButtonColorComponent
            buttonVariant='outlined'
            textColor={"#000000"}
            borderColor={"#385DDF"}
            label={"View Model Answer Paper"}
            width='200px'
            height='36px'
            onClick={() => { props?.handleAnswerModal && props?.handleAnswerModal() }}
            backgroundColor=""
            disabled={false} // Disable if isMarksPublish is true or items is undefined
          />
        </div>}
      </div>
      <div style={{ border: "1px solid #DEDEDE", opacity: "60%" }}></div>
      {/* main section  */}

      {/* Render MarksBreakupTable component */}
      <MarksBreakupTable
        tableData={props.tableData}
        isEditMode={props.isEditable}
        handleChangeMarks={props.handleChangeMarks}
        handleMultiSelectChange={props.handleMultiSelectChange}
        isReport={props?.isReport}
      />

      {/* footer section */}
      {props?.isReport && props.remarks && <TeacherRemark
        value={props.remarks}
        isEditMode={props.isEditable}
        onChange={props.handleRemarksChange}
      /> }
      {!props?.isReport && <TeacherRemark
        value={props.remarks}
        isEditMode={props.isEditable}
        onChange={props.handleRemarksChange}
      /> }
    </div>
  );
}

export default MraksBreakUp;
