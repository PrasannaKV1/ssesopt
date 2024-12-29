import React, { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Spinner from '../components/SharedComponents/Spinner/index';
import {FeeAllocationLayout as LHS} from '../layout/FeeAllocationLayout';
import Assessment from '../components/AssessmentReportsContainer/Assesment';
import Assessments from '../components/AssessmentReportsContainer/Assessments';
import ReportComponent from '../components/AssessmentReportsContainer/ReportComponent';
import TeacherCentricComponent from '../components/AssessmentReportsContainer/teacher-centric/TeacherCentricComponent';
import StudentCentricReportsComponent from '../components/AssessmentReportsContainer/student-centric/StudentCentricReportsComponent';
import CourseWorkReportComponent from '../components/AssessmentReportsContainer/CourseWorkProgress';
import GroupReportComponent from '../components/AssessmentReportsContainer/GroupReport';
import AnalysisReportComponent from '../components/AssessmentReportsContainer/AnalysisReport';
import LearningOutcomeReport from '../components/AssessmentReportsContainer/LearningOutcomeReport';
import LiveProgressReporting from '../components/AssessmentReportsContainer/LiveProgressReporting';
import ViewModal from '../components/QuestionPaperContainer/QuestionPaperAdminTable/EvaluationPopUpModels/ViewModal';
import StudentWiseAnalysis from '../components/QuestionPaperContainer/QuestionPaperAdminTable/EvaluationPopUpModels/StudentWiseAnalysis';
import StudentReportContainer from '../components/QuestionPaperContainer/QuestionPaperAdminTable/StudentReportContainer';
import CreateNewOnlineTest from '../components/OnlineTest/CreateNewOnlineTest/CreateNewOnlineTest';
import TeacherAssementContainer from '../components/TeacherAssesmentContainer/TeacherAssementContainer';
import OnlineTestPreview from '../components/OnlineTest/OnlineTestPreview/OnlineTestPreview';

const QuestionBankContainer = lazy(
  () => import('../components/AssessmentsContainer/QuestionBankContainer') as any,
);
const CreateNewQuestion = lazy(
    () => import('../components/AssessmentsContainer/CreateNewQuestion/CreateNewQuestion') as any,
  );
const QuestionPaper = lazy(
  () => import('../components/QuestionPaperContainer/QuestionPaperContainer') as any,
);
const QuestionPaperOnline = lazy(
  () => import('../components/QuestionPaperContainer/CreateOnlineQuestionPaper/CreateOnlineQuestionPaper') as any,
);
const QuestionPaperAssessOnline = lazy(
  () => import('../components/QuestionPaperContainer/CreateOnlineQuestionPaperPreview/CreateOnlineQuestionPaperPreview') as any,
);
const QuestionPaperAutoGenerate = lazy(
  () => import('../components/QuestionPaperContainer/QuestionPaperOPTScreen/QuestionPaperAutoGenerate') as any,
)
const MIFQuestionPaperotp1 = lazy(
  () => import('../components/ManualQuestionPaperContainer/MIFQuestionPaperOPTScreen/MIFQuestionPaperOPT1') as any,
)
// const QuestionPaper18 = lazy(
//   () => import('../components/QuestionPaperContainer/Questionpaper18/QuestionPaper') as any,
// )
// const AdminquestionPaper = lazy(
//   () => import('../components/QuestionPaperContainer/QuestionPaperAdminTable/AdminQuestionPaperTable') as any,
// )
// const QuestionPaper13 = lazy(
//   () => import('../components/QuestionPaperContainer/QuestionPaper13/QuestionPaper13') as any,
// )
// const ReplaceQuestionModal = lazy(
//   () => import('../components/QuestionPaperContainer/ReplaceQuestionModal/ReplaceQuestionModal') as any,
// )
const PrintForPreview = lazy(
  () => import('../components/QuestionPaperContainer/QuestionPaperPreviewforPrint/QuestionPaperPreviewforPrint') as any,
)
const MIFPrintForPreview = lazy(
  () => import('../components/ManualQuestionPaperContainer/MIFQuestionPaperPreviewforPrint/MIFQuestionPaperPreviewforPrint') as any,
)

const OnlineAssesment = lazy(()=>import("../components/OnlineAssesment/OnlineAssesment"));

const CustomRoutes = () => {

  return (
    <>
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/" element={<Navigate to={`/assess/questionpaper`} />} />
          <Route path="/assess" element={<Navigate to={`/assess/questionpaper`} />} />
          <Route path="/assess/questionpaper" element={<LHS><QuestionBankContainer/></LHS>} /> 
          <Route path="/assess/evaluation" element={<LHS><QuestionBankContainer/></LHS>} />            
          <Route path="/assess/questionbank" element={<LHS><QuestionBankContainer/></LHS>} />          
          <Route path="/assess/assessmentReports" element={<LHS><QuestionBankContainer/></LHS>} />          
          <Route path="/assess/createnewquestion" element={<CreateNewQuestion />} />
          <Route path="/assess/editnewquestion" element={<CreateNewQuestion edit={true}/>} />
          <Route path="/assess/duplicateQuestion" element={<CreateNewQuestion edit={true} isDuplicate={true}/>} />
          <Route path="/questionpaper" element={<LHS><QuestionPaper /></LHS>} />
          <Route path="/questionpaper/onlineassessment" element={<QuestionPaperOnline />} />
          <Route path="/questionpaper/onlineassessmentPreview" element={<QuestionPaperAssessOnline />} />
          <Route path="/MIFQuestionpaper" element={<MIFQuestionPaperotp1/>} />
          {/* <Route path="questionpaper18" element={<QuestionPaper18 />} />
          <Route path="adminquestionpaper" element={<AdminquestionPaper/>} />
          <Route path="QuestionPaper13" element={<QuestionPaper13/>} />
          <Route path="replacequestion16" element={<ReplaceQuestionModal/>} /> */}
          <Route path="/assess/questionpaper/informal-autoflow/new" element={<QuestionPaperAutoGenerate/>} />
          <Route path="/assess/questionpaper/formal-autoflow/new" element={<QuestionPaperAutoGenerate/>} />
          <Route path="/assess/questionpaper/informal-autoflow/printforpreview" element={<PrintForPreview/>} />
          <Route path="/assess/questionpaper/formal-autoflow/printforpreview" element={<PrintForPreview/>} />
          <Route path="MIFprintForPreview" element={<MIFPrintForPreview/>} />
          <Route path="/questionapaperAutoGenerate" element={<QuestionPaperAutoGenerate/>} />
          <Route path="printForPreview" element={<PrintForPreview/>} />
          <Route path="evaluationReport" element={<Assessment/>} />
          <Route path="/assess/assessmentReports/showReports/questionPaperReports" element={<ReportComponent/>}/>
          <Route path="/assess/assessmentReports/showReports" element={<Assessments/>}/>
          <Route path="/assess/assessmentReports/showReports/teacherCentric" element={<TeacherCentricComponent/>}/>
          <Route path="/assess/assessmentReports/showReports/studentCentric" element={<StudentCentricReportsComponent/>}/>
          <Route path="/assess/assessmentReports/showReports/courseWorkProgress" element={<CourseWorkReportComponent/>}/>
          <Route path="/assess/assessmentReports/showReports/groupReport" element={<GroupReportComponent/>}/>
          <Route path="/assess/assessmentReports/showReports/analysisReport" element={<AnalysisReportComponent/>}/>
          <Route path="/assess/assessmentReports/showReports/learningOutcomeReport" element={<LearningOutcomeReport/>}/>
          <Route path="/assess/assessmentReports/showReports/liveProgressReporting" element={<LiveProgressReporting/>}/>
          <Route path="/assess/evaluation/teacherReport" element ={<LHS><ViewModal/></LHS> } />
          <Route path="/assess/evaluation/schoolReport" element ={<StudentReportContainer />} />
          <Route path="/assess/evaluation/onlineAssesment" element ={<LHS><OnlineAssesment /></LHS>} />
          <Route path="/assess/evaluation/onlineTest/:gradeId?/:sectionId?/:courseId?" element={<CreateNewOnlineTest />} />
          <Route path="/assess/evaluation/onlineAssesment/printforpreview" element={<PrintForPreview/>} />
          <Route path="/assess/teacher" element={<LHS><TeacherAssementContainer /></LHS>} />
          <Route path="/asses/onlineTest/preview" element={<OnlineTestPreview />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default CustomRoutes;
