import React, { useEffect, useState } from 'react'
import "./EvaluationPractice.css"
import Button from '@mui/material/Button';
import CardComp from './CardComp';
import { assessmentDataOfStudents } from '../../../Api/QuestionTypePaper';
import AvgScore from '../../../assets/images/numbers-fill 1.svg'
import AssignedStudents from '../../../assets/images/user-2-fill 1.svg'
import Answer from '../../../assets/images/focus-3-line 11.svg'
import Marks from '../../../assets/images/focus-3-line 1.svg'
import HighestVsLowest from '../../../assets/images/highestLowestIcon.svg'
import AverageTimeTaken from '../../../assets/images/averageTimeIcon.svg'
import UserAttempted from '../../../assets/images/userAttemptedIcon.svg'
import ChapterWiseAnalysis from './EvaluationPopUpModels/ChapterWiseAnalysis/ChapterWiseAnalysis';
import ChapterWiseMajorAnalysis from './EvaluationPopUpModels/ChapterWiseAnalysis/ChapterWiseMajorAnalysis';
import AvtarSection from './TemplateCreation/AvtarSection';
import { transformGradeToClass } from '../../../constants/helper';
import ButtonComponent from '../../SharedComponents/ButtonComponent/ButtonComponent';
import Avatar from "@mui/material/Avatar";
import { useSelector } from 'react-redux';
import { ReduxStates } from '../../../redux/reducers';
interface EvaluationProps{
    assessmentData: any,
    downloadText:string,
    studentData?:any,
    setName?:string,
    isOnlineTestReport?:boolean,
    studentAnalysisOnlineReport?:boolean,
    studentDetails?:any
}

const EvaluationPractice: React.FC<EvaluationProps> = ({assessmentData, downloadText, studentData, setName,isOnlineTestReport,studentAnalysisOnlineReport,studentDetails}) => {  
   const isMobileView = useSelector((state: ReduxStates) => state?.mobileMenuStatus?.isMobileView);
  const details = isOnlineTestReport ? [
      assessmentData?.marks && `${assessmentData.marks} marks`,
      "Online"
    ].filter(Boolean)
    .join(" | ") : [
      assessmentData?.marks && `${assessmentData.marks} marks`,
      assessmentData?.type,
      isOnlineTestReport && assessmentData?.classes,
      assessmentData?.mode,
      assessmentData?.courseNames,
      assessmentData?.setName,
    ]
      .filter(Boolean)
      .join(" | ");

    const onlineReportCardsData = [
      {
        text: "Avg Class Score",
        textNumber: Math.round(assessmentData?.averageScore) ?? 0,
        icon: AvgScore,
        backgroundColor: "#E1F6F1",
      },
      {
        text: "Avg Attempt Time",
        textNumber: Math.round((assessmentData?.avgAttemptTime) / 60) + " m", 
        icon: AverageTimeTaken,
        backgroundColor: "#FEF8E7",
      },
      {
        text: "Highest VS Lowest",
        textNumber:
          assessmentData?.highestScore + " VS " + assessmentData?.lowestScore, 
        icon: HighestVsLowest,
        backgroundColor: "rgba(110, 85, 213, 0.1)",
      },
      {
        text: "Students Attempted VS Total",
        textNumber:
        assessmentData?.noOfStudentsAttempted + 
        " VS " +
        assessmentData?.assignedStudents ,
        icon: UserAttempted,
        backgroundColor: "#FEEEEC",
      },
    ];
    
    return (
        <>
        {assessmentData &&
            <div className='evaluation-asses1-container'>
                <div className='evaluation-ass-child-cont'>
                    <div className='assess-cont d-flex justify-content-between'>
                        {!studentData && <div className='assessment-details'>
                            <div>{assessmentData?.questionPaperName}</div>
                            <div className='marks-details'>{details}</div>
                            <div><Button variant="contained" style={{ background: "blue", fontSize:"11px",
                                padding:"2px"
                             }}>{isOnlineTestReport ? assessmentData.classes + " " + assessmentData?.courseNames : assessmentData?.classes}</Button></div>
                        </div>}
                        {studentData && <div>
                            <div className="table-name-avatars" style={{display:'flex', gap:'10px'}}>
                                <Avatar src={studentData?.studentProfileLink} />
                                {/* <AvtarSection
                                    firstName={studentData?.studentName}
                                    profile={studentData?.studentProfileLink}
                                /> */}
                                <div className="table-name-avatars-title">
                                    <div>{`${studentData?.studentName}`}</div>
                      <div>{!isOnlineTestReport && "Grade"}
                        {transformGradeToClass(studentData?.className, studentData?.rollNo, setName)}
                      </div>  
                                </div>
                            </div>
                        </div>}
                        {/* <div>
                            <ButtonComponent type={"contained"} label={downloadText} textColor={'white'} buttonSize={'Medium'} minWidth={'200'} backgroundColor={'#01B58A'}/>
                        </div> */}
            </div>
            {!studentData &&!isOnlineTestReport &&!studentAnalysisOnlineReport && !isMobileView && (
                <div className="assess-card-cont mt-3"> 
                  
                  <div className="card-data" style={{ height: '61px' }}><CardComp text={"Avg Class Score"} textNumber={Math.round(assessmentData?.averageScore) ?? 0} image={AvgScore} background={"#E1F6F1"} /></div>
                  <div className="card-data" style={{ height: '61px' }}><CardComp text={"Highest / Lowest"} textNumber={`${assessmentData?.highestScore ?? 0} / ${assessmentData?.lowestScore ?? 0}`} image={Marks} background={"#6E55D51A"} />
                  </div>
                  
                  <div className="card-data" style={{ height: '61px' }}> <CardComp text={"Assigned Students"} textNumber={assessmentData?.assignedStudents ?? 0} image={AssignedStudents} background={"#FEEEEC"} /></div>
                  {/* <div className="card-data" style={{ height: '61px' }}><CardComp text={"Avg Answer Accuracy"} textNumber={`${Math.round(assessmentData?.avgAnswerAccuracy)} %` ?? 0} image={Answer} background={"#E7EEFD"} /> */}
                  {/* </div> */}
                </div>
              )}

              {!studentData &&!isOnlineTestReport &&!studentAnalysisOnlineReport && isMobileView &&(
                <div className="assess-card-cont-mobile mt-3"> 
                  <div style={{display:'flex', gap: '10px',width:'100%',marginBottom:'1rem'}}>
                  <div  style={{ height: '61px',width:'50%'}}><CardComp text={"Avg Class Score"} textNumber={Math.round(assessmentData?.averageScore) ?? 0} image={AvgScore} background={"#E1F6F1"} /></div>
                  <div style={{ height: '61px',width:'50%' }}><CardComp text={"Highest / Lowest"} textNumber={`${assessmentData?.highestScore ?? 0} / ${assessmentData?.lowestScore ?? 0}`} image={Marks} background={"#6E55D51A"} /></div>
                  </div>
                  
                  <div className="card-data" style={{ height: '61px',marginTop:'10px' }}> <CardComp text={"Assigned Students"} textNumber={assessmentData?.assignedStudents ?? 0} image={AssignedStudents} background={"#FEEEEC"} /></div>
                  {/* <div className="card-data" style={{ height: '61px' }}><CardComp text={"Avg Answer Accuracy"} textNumber={`${Math.round(assessmentData?.avgAnswerAccuracy)} %` ?? 0} image={Answer} background={"#E7EEFD"} /> */}
                  {/* </div> */}
                </div>
                
              )}

            {isOnlineTestReport && studentAnalysisOnlineReport && (
              <div className="assess-card-cont mt-3">
                <div className="card-data">
                  <CardComp
                    text={"Avg Score"}
                    subText={"Student VS Class"}
                    textNumber={`${Math.round(studentDetails?.averageStudentScore)} VS ${Math.round(studentDetails?.averageScore)}`}
                    image={AvgScore}
                    background={"#E1F6F1"}
                  />
                </div>
                <div className="card-data">
                  <CardComp
                    text={"Avg Attempt Time"}
                    subText={"Student VS Class"}
                    textNumber={
                      `${Math.round(studentDetails?.studentAvgAttemptTime/60)} m VS ${Math.round(studentDetails?.classAvgAttemptTime/60)} m` || `0 m VS 0m` 
                    }
                    image={AverageTimeTaken}
                    background={"#FEF8E7"}
                  />
                </div>
              </div>
            )}

            {!studentData &&
              isOnlineTestReport &&
              !studentAnalysisOnlineReport && (
                <div className="assess-card-cont mt-3">
                  {onlineReportCardsData?.map((cardDetails, index) => {
                    return (
                      <div className="card-data" style={{width:"25%"}} key={index}>
                        <CardComp
                          text={cardDetails.text}
                          textNumber={cardDetails.textNumber}
                          image={cardDetails.icon}
                          background={cardDetails.backgroundColor}
                        />
                      </div>
                    );
                  })}
                </div>
              )}

            {studentData && !studentAnalysisOnlineReport && (
<div className='assess-card-cont mt-3'>
                        <div className='card-data' style={{width:"33%"}}><CardComp text={`Avg Score \n Class / Student`} textNumber={`${Math.round(assessmentData?.averageScore) ?? 0} / ${Math.round(assessmentData?.averageStudentScore) ?? 0}`} image={AvgScore} background={'#E1F6F1'} /></div>
                        <div className='card-data' style={{width:"33%"}}><CardComp text={"Total Score \n Highest / Lowest"} textNumber={`${assessmentData?.highestScore ?? 0} / ${assessmentData?.lowestScore ?? 0}`} image={Marks} background={'#6E55D51A'} /></div>
                        {/* <div className='card-data' style={{width:"33%"}}><CardComp text={"Average Answer \n Accuracy Class / Student"} textNumber={`${Math.round(assessmentData?.avgAnswerAccuracy) ?? 0} / ${Math.round(assessmentData?.avgStudentAnswerAccuracy) ?? 0}`} image={Answer} background={'#E7EEFD'} /></div> */}
                    </div>
            )}
          </div>
          </div>}
      </>
    );
}

export default EvaluationPractice