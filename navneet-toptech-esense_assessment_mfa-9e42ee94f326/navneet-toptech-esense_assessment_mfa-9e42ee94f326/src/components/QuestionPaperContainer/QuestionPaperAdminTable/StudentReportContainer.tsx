import "./studentReportContainer.css";
import React, { useCallback, useEffect, useState } from 'react';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from 'react-router';

import { assessmentDataOfStudents, onlineStudentAssessmentData, studentAssessmentByAllocationId } from "../../../Api/QuestionTypePaper";
import MraksBreakUp from "../../../common/MraksBreakUp";
import ErrorAnalysisModal from "./ErrorAnalysisModal";
import StudentSheetInfo from "../../../common/StudentSheetInfo";
import QuestionPaperOverview from "./QuestionPaperOverview";
import BackIcon from '../../../assets/images/BackIcon.svg';
import { RootStore } from "../../../redux/store";
import { studentOnlineQuestionWiseAnalysis, studentOvewViewReports } from "../../../Api/AssessmentReports";
import { StudentOverViewEventActions } from "../../../redux/actions/studentOverview";
import EvaluationPractice from "./EvaluationPractice";
import ChapterWiseAnalysis from "./EvaluationPopUpModels/ChapterWiseAnalysis/ChapterWiseAnalysis";
import ChapterWiseMajorAnalysis from "./EvaluationPopUpModels/ChapterWiseAnalysis/ChapterWiseMajorAnalysis";
import MarksAndBreakupAnalysis from "../../OnlineAssesment/components/MarksAndBreakupAnalysis";
import Spinner from "../../SharedComponents/Spinner";

interface Item {
  id: string;
  sequenceText: string;
  type: "Part" | "Section" | "Main Question" | "Question";
  obtainedMarks?: any;
  actualMarks?: any;
  errors?: string[];
  children?: Item[];
  questionText?: string;
  sequenceNo?:number;
}

interface FlattenedItem {
  part: string;
  section: string;
  questionNo: string;
  subQuestionNo: string;
  questionId: string;
  obtainedMarks: any;
  actualMarks: any;
  error: string[];
  sequenceNo?: number;
  questionText?: string;
}

const StudentReportContainer = () => {
  const history = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  let onlineStudentReportAnalysis = location?.state?.isOnlineTestReport;
  const isFromTeacherWeb = location.state?.isFromTeacherWeb;

  const currentQuestionPaper = useSelector((state: RootStore) => state?.qMenuEvent?.currentQp);
  const studnetOverviews = useSelector((state: RootStore) => state?.studentOverviewEvent?.studentOvewrview);

  const [tableData, setTableData] = useState<any[]>([]);
  const [studentSheetData, setStudentSheetData] = useState<any>();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [studentQuestionAnswerOverview, setStudentQuestionAnswerOverview] = useState<any[]>([]);
  const [teacherRemark, setTeacherRemark] = useState<any>()
  const [assessmentData, setAssessmentdata] = useState() as any
  const [setName, setSetName] = useState('');
  const [isErrorDisplay, setIsErrorDisplay] = useState(true);
  const [studentDetails,setStudentDetails] = useState()
  const [isLoading, setLoading] = useState(false);
  const [reasonforLateSub, setReasonforLateSub] = useState("");
  const [onlineStudentQuestionWiseAnalysis, setOnlineStudentQuestionWiseAnalysis] = useState([])

  const flattenData = (data: Item[]): FlattenedItem[] => {
    let result: FlattenedItem[] = [];

    const addItem = (
      part: string,
      section: string,
      mainQuestion: string,
      subQuestion: string,
      item: Item,
      questionText?: string,
    ) => {
      result.push({
        part,
        section,
        questionNo: mainQuestion,
        subQuestionNo: subQuestion,
        questionId: item.id,
        obtainedMarks: item?.obtainedMarks ,
        actualMarks: item?.actualMarks,
        error: item.errors || [],
        questionText: item?.questionText,
        sequenceNo:item?.sequenceNo
      });
    };

    const processItem = (
      item: Item,
      part: string,
      section: string,
      mainQuestion: string,
      subQuestion: string,
      questionText?: string,
    ) => {
      if (item.type === 'Question') {
        addItem(part, section, mainQuestion, item.sequenceText.replace(/(<([^>]+)>)/gi, ""), item,questionText);
      } else {
        item.children?.forEach((child) => {
          const newPart = item.type === 'Part' ? item.sequenceText.replace(/(<([^>]+)>)/gi, "") : part;
          const newSection = item.type === 'Section' ? item.sequenceText.replace(/(<([^>]+)>)/gi, "") : section;
          const newMainQuestion = item.type === 'Main Question' ? item.sequenceText.replace(/(<([^>]+)>)/gi, "") : mainQuestion;

          processItem(child, newPart, newSection, newMainQuestion, subQuestion,questionText);
        });
      }
    };

    data?.forEach(item => processItem(item, '', '', '', '',''));
    return result;
  };

  const seeStudentDetails = async (allocationId: any) => {
    setLoading(true);
    try {
      const response = await studentAssessmentByAllocationId(
        allocationId,
        onlineStudentReportAnalysis
      );
      // Assigning the student sheet data
      if (response?.data) {
        setReasonforLateSub(response?.data?.reasonForLateSubmission);
        setTeacherRemark(response?.data?.teacherRemarks)
        setStudentDetails(response?.data)
        setSetName(response?.data?.setName);
        setStudentSheetData(response?.data);
        const payload: any[] = await flattenData(response?.data?.answerSheetInfo);
        if (payload.length) {
          const filteredData = payload.filter((data: any) => data?.obtainedMarks != null);
          setTableData(filteredData);
        }
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error While Loading the Student data")
    }
  }
  const handleNext = () => {
    if (currentIndex < studentSheetData?.answerSheets?.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  let StudentID = location?.state?.studentDetails?.studentId

  /**
 *  @developer dharmikshah@navneettoptech.com
 *  @function qustionPaperPreview
 *  @description this function return for preview the question Paper
 */
  const qustionPaperPreview = useCallback((payload: any, isAnswerModel: boolean) => {
    history('/MIFprintForPreview',
      {
        state: {
          state: false,
          templateId: payload?.id,
          print: false,
          questionPaperTypeID: payload?.questionPaperTypeID,
          enablebtnPrint:
            payload?.questionPaperTypeID === 2
              ? payload.statusID === 2 || payload.statusID === 6
                ? false
                : true
              : false,
          disableBtnPrint:
            payload?.questionPaperTypeID === 2
              ? payload.statusID === 2 || payload.statusID === 6 || payload.statusID === 5
                ? true
                : false
              : false,
          editStatus: false,
          isAssesment: true,
          isAnswerModel: false,
          viewAnswer: isAnswerModel
        },
      }
    );
  }, [history]);

  /**
   *  @function handleViewQuestionPaper 
   *  @description this function is responsible for view the Question paper details
   */

  const handleViewQuestionPaper = useCallback(async () => {
    try {
      const storageValue = localStorage.getItem('currentQp');
      const qp = JSON.parse(storageValue ? storageValue : '');
      if (qp && Object.keys(qp).length > 0) {
        await qustionPaperPreview(qp, false);
      }
    } catch (error) {
      console.error("Error while Preview the Question Paper");
    }
  }, []);

  const handleAnswerModal = useCallback(async () => {
    const storageValue = localStorage.getItem('currentQp');
    const qp = JSON.parse(storageValue ? storageValue : '');
    if (qp && Object.keys(qp).length > 0) {
      await qustionPaperPreview(qp, true); // Assuming this function makes an API call or some async operation
    }
  }, [currentQuestionPaper]);

  function sortByQuestionSequence(arr: any) {
    return arr.sort((a: any, b: any) => {
      const seqA = parseInt(a.questionSequence, 10);
      const seqB = parseInt(b.questionSequence, 10);
      return seqA - seqB;
    });
  }
  /**
   * @function getOverviewDetails
   * @description this function is for get the student overview details
   */

  const getOverviewDetails = async () => {
    setLoading(true);
    try {
      const apiPayload = {
        qpId: location?.state?.selectedQp || "",
        studentId: location?.state?.studentDetails?.studentId || "",
        onlineStudentReportAnalysis
      }
      const response = await studentOvewViewReports(apiPayload);
      if (response?.length > 0) {
        const sortedArray = await sortByQuestionSequence(response);
        const filteredData = sortedArray?.filter((item: any) => item?.marksObtained >= 0)
        if (location?.state?.studentDetails?.allocationId) {
          dispatch(StudentOverViewEventActions({ allocationId: location?.state?.studentDetails?.allocationId, data: filteredData }));
        }
        setStudentQuestionAnswerOverview(filteredData);
        setLoading(false);
      } else {
        setLoading(false);
        console.error("Something is wrong at student question & answer overview")
      }
    } catch (error) {
      setLoading(false);
      console.error("Error while fetching the student ovewview details");
    }
  }

  useEffect(() => {
    if (location?.state?.studentDetails?.allocationId) {
      seeStudentDetails(location?.state?.studentDetails?.allocationId)
    }
  }, [])

  useEffect(() => {
    if (location?.state?.selectedQp && location?.state?.studentDetails?.studentId) {
      assessmentDataApi();
      const overview = studnetOverviews[location?.state?.studentDetails?.allocationId];
      if (location?.state?.studentDetails?.allocationId && overview?.length) {
        setStudentQuestionAnswerOverview(overview);
      } else {
        getOverviewDetails();
      }
    }
  }, []);

  const assessmentDataApi = async () => {
    if (location?.state?.selectedQp && location?.state?.studentDetails?.studentId) {
      const response = await assessmentDataOfStudents(
        location.state?.selectedQp,
        location.state.studentDetails.studentId,
        onlineStudentReportAnalysis
      );
      setAssessmentdata(response.data);
    }
  }

  async function onlineStudentQuestionWiseAnalysisFn (){
     const apiPayload = {
        qpId: location?.state?.selectedQp || "",
        studentId: location?.state?.studentDetails?.studentId || "",
        onlineStudentReportAnalysis
      }
    const response = await studentOnlineQuestionWiseAnalysis(apiPayload);
    setOnlineStudentQuestionWiseAnalysis(sortByQuestionSequence(response));
  }

  useEffect(()=>{
    if(onlineStudentReportAnalysis){
       onlineStudentQuestionWiseAnalysisFn();
    }
  },[])

  return (
    <div className='student-report-container'>  
      {isLoading && <Spinner />}
      {assessmentData &&
      <div className='inner-content'>
        <Box
          className="student-preview-container qpCustomFontPopup assement-q-modal"
        >
          <div style={{padding:"0px 60px 0px 75px", position:"sticky", top:"0px", zIndex:"99"}}>
          <div style={{background:"white", borderRadius:"14px"}}>
          <IconButton
            className='go-back-button'
                  onClick={() => {
                    if (location?.state?.hasOwnProperty("tabSelected")) {
                      if (isFromTeacherWeb) {
                        history('/assess/teacher', {
                          state: { selectedTab: location?.state?.tabSelected, },
                        });
                      } else {
                        history('/assess/evaluation/onlineAssesment', {
                          state: { selectedTab: location?.state?.tabSelected, },
                        });
                      }
                    } else {
                      navigate(-1)
                    }
                  }}
            sx={{
              width: 100,
              height: 50,
              '&:hover': {
                backgroundColor: 'transparent',
              }
            }}
          >
            <img src={BackIcon} alt="Go Back arrow"></img>
          </IconButton>
          <div className="evaluation__student">
            <EvaluationPractice assessmentData={assessmentData} downloadText={"Download Student Summary"} studentData={location?.state?.studentDetails} setName={setName} studentAnalysisOnlineReport={onlineStudentReportAnalysis} isOnlineTestReport={true} studentDetails={studentDetails}/>
          </div>
          </div>
          </div>

          <div style={{ overflowY: 'auto' }}>
            {/* MraksBreakUp sections */}
            <div className="student-report-inner-container">
              {!onlineStudentReportAnalysis && (
                <MraksBreakUp isEditable={false} tableData={tableData} remarks={studentSheetData?.teacherRemarks} studentData={[]} isReport={true} handleViewQuestionPaper={handleViewQuestionPaper} handleAnswerModal={handleAnswerModal} />
              )}

              {onlineStudentReportAnalysis && (
                <MarksAndBreakupAnalysis
                  tableData={studentSheetData?.answerSheetInfo}
                  isOnlineTestReport={onlineStudentReportAnalysis}
                    reasonforLateSub={reasonforLateSub}
                />
              )}
            </div>
            {/* ChapterWise-section */}
            <div className="evaluation__student_data">
              {assessmentData?.subjectWiseDetails && <ChapterWiseMajorAnalysis analysisName={'Chapter-Wise Analysis'} subjectDetails={assessmentData?.subjectWiseDetails} />}
            </div>
            {/* ErrorAnalysisModal sections */}
            {isErrorDisplay && !onlineStudentReportAnalysis && (  <ErrorAnalysisModal questionId={location?.state?.selectedQp} studentId={StudentID} setIsErrorDisplay={setIsErrorDisplay} />)}

            {/* Question Paper Overview*/}
            <div className="student-report-inner-container" style={{borderRadius:"16px" ,border:"1px solid #DEDEDE"}}>
              <QuestionPaperOverview
                qpDetails={onlineStudentReportAnalysis?onlineStudentQuestionWiseAnalysis : studentQuestionAnswerOverview } onlineStudentReportAnalysis={onlineStudentReportAnalysis}
              />
            </div>

            {/* ErrorAnalysisModal sections */}
            {studentSheetData?.answerSheets && studentSheetData?.answerSheets?.length && ( <div className="student-report-answer-sheet viewDetailsAlign" style={{borderRadius:"16px" ,border:"1px solid #DEDEDE"}}><StudentSheetInfo isEditable={false} handlePrevious={handlePrevious} currentIndex={currentIndex} handleNext={handleNext} studentData={studentSheetData}/> </div>)}
          </div>
        </Box>
        </div>}
    </div>
  );
}

export default StudentReportContainer;