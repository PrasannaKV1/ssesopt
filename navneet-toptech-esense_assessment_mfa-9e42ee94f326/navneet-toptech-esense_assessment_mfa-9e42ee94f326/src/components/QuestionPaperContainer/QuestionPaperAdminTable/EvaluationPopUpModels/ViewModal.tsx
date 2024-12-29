import React, { useEffect, useState } from 'react';
import { Button, Box } from '@mui/material';
import { qListMenuEventActions } from '../../../../redux/actions/assesmentQListEvent';
import { useDispatch, useSelector } from 'react-redux';
import "./studentReportView.css";
import BackIcon from '../../../../../src/assets/images/BackIcon.svg'
import { useLocation, useNavigate } from 'react-router';
import EvaluationPractice from '../EvaluationPractice';
import StudentWiseAnalysis from './StudentWiseAnalysis';
import ErrorAnalysisModal from '../ErrorAnalysisModal';
import QuestionOverview from '../QuestionPaperOverview';
import { teacherQAovewview } from '../../../../Api/AssessmentReports';
import { assessmentDataOfStudents, onlineQpOnlineAnalysis } from '../../../../Api/QuestionTypePaper';
import ChapterWiseMajorAnalysis from './ChapterWiseAnalysis/ChapterWiseMajorAnalysis';
import Spinner from '../../../SharedComponents/Spinner';
import chevronright from '../../assets/images/chevronright.svg';
import { ReduxStates } from '../../../../redux/reducers';
// Define the Student interface

interface ViewModalProps {
}

const ViewModal: React.FC<ViewModalProps> = () => {
    const isMobileView = useSelector((state: ReduxStates) => state?.mobileMenuStatus?.isMobileView);
    const dispatch = useDispatch();
    const location = useLocation();
    let history = useNavigate();
    const isOnlineTestReport = location.state?.onlineReport;
    const isFromTeacherWeb = location.state?.isFromTeacherWeb;
    const [assessmentData, setAssessmentdata] = useState() as any
    const [teacherQuestionAnswerOverview, setTeacherQuestionAnswerOverview] = useState<any[]>([]);
    const [isTeacher, serIsTeacher] = useState<boolean>(false);
    const [spinnerStatus, setSpinnerStatus] = useState(false);

    const assessmentDataApi = async () => {
        {
        setSpinnerStatus(true)
        const response = isOnlineTestReport
          ? await onlineQpOnlineAnalysis(location.state.id)
          : await assessmentDataOfStudents(location?.state?.id);
        setAssessmentdata(response?.data);
       }
       setSpinnerStatus(false)
    }

    function sortByQuestionSequence(arr: any) {
        return arr.sort((a: any, b: any) => {
            const seqA = parseInt(a.questionSequence, 10);
            const seqB = parseInt(b.questionSequence, 10);
            return seqA - seqB;
        });
    }

    /**
     * @description this api for fetching the teach question and answer 
     */
    const fetchTeacherQuestionAndAnswerOverview = async () => {
        try {
            const apiPayload = {
                qpId: location?.state?.id,
                isOnlineTestReport:isOnlineTestReport
            }
            const response = await teacherQAovewview(apiPayload);
            if (response && response?.length > 0) {
                const sortedArray = await sortByQuestionSequence(response);
                setTeacherQuestionAnswerOverview(sortedArray);
                serIsTeacher(true)
            } else {
                console.log("Error in teacher question and answer overview api ");
            }
        } catch (error) {
            console.error("Error while fetching the teachers question and answer overview ", error);
        }
    }

    useEffect(() => {
        if (location?.state?.id) {
            assessmentDataApi()
            fetchTeacherQuestionAndAnswerOverview()
        }
    }, [])

    return (
        <Box sx={{ width: '100%', padding: '10px' }}>
            {spinnerStatus && <Spinner />}
            <div className='padding-data' style={{padding:!isMobileView ? "0px 60px 0px 20px" :"0px", position:"sticky", top:"0px", zIndex:"99"}}>
            <div className='padding-div' style={{background:"white", borderRadius:"14px"}}>
                
                    <Button className='go_back_btn' onClick={() => {
                        if (isFromTeacherWeb) {
                            history('/assess/teacher', {
                                state: { selectedTab: location?.state?.tabSelected, },
                            });
                        } else if (location?.state?.tabSelected) {
                            history('/assess/evaluation/onlineAssesment', {
                                state: { selectedTab: location?.state?.tabSelected, },
                            });
                        } else {
                            window.history.back();
                        }
                        dispatch(qListMenuEventActions(null)); serIsTeacher(false)
                    }}> <img src={BackIcon} alt='img' /> </Button>
            <div>
                <EvaluationPractice assessmentData={assessmentData} downloadText={'Download Assessment Summary'} isOnlineTestReport={isOnlineTestReport}/>
            </div>
            </div>
            </div>
            {/* chapter wise Data */}
            <div style={{ overflowY: 'auto' }}>
                <div className='teacherChapterAnalysis'>
                    { assessmentData?.subjectWiseDetails && <ChapterWiseMajorAnalysis analysisName={'Chapter-Wise Analysis'} subjectDetails={assessmentData?.subjectWiseDetails} /> }
                </div>
                <div>
                    <StudentWiseAnalysis questionId={location?.state?.id} isOnlineTestReport={isOnlineTestReport}/>
                </div>
                    <ErrorAnalysisModal questionId={location?.state?.id} />
                {/*  TODO : this is teacher quesiton and answer  */}
                <div className='error-evaluation-asses1-container' style={{borderRadius:"16px" ,border:"1px solid #DEDEDE"}}>
                    <QuestionOverview qpDetails={teacherQuestionAnswerOverview} isRoleTeacher={isTeacher} isOnlineTestReport={isOnlineTestReport}/>
                </div>
            </div>
        </Box>
    );
};

export default ViewModal;