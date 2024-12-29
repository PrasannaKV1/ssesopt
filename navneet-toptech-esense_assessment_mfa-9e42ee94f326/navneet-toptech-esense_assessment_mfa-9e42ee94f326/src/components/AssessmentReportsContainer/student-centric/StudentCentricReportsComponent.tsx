import goBack from '../../../assets/images/goBack.svg';
import StudentLatestAttemptComponent from "./StudentLatestAttemptComponent";
import Accordion from "./Accordion";
import AllReportAttempts from './AllReportAttempts';
import './studentcentric.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState , useEffect } from 'react';
import {
    getChapterTopicWiseReport,
    getMultipleAttemptsReport,
    getStudentLatestAttempt
} from '../../../Api/AssessmentReports';
import { LatestAttemptReports , MultipleAttemptsReports , ChapterTopicWiseReports } from '../../../interface/AssessmentReportsResponses';
const StudentCentricReportsComponent = () =>{
    let navigate = useNavigate();
    const[chapterTopicWiseData,setChapterTopicWiseData] = useState<ChapterTopicWiseReports[]>([]);
    const[multipleAttemptsData,setMultipleAttemptsData] = useState<MultipleAttemptsReports>(Object);
    const[studentLastAttemptData,setStudentLastAttemptData] = useState<LatestAttemptReports>(Object);
    const goBackFn = () =>{
        let data = {allocationGroupId:allocationGroupId};
        navigate("/assess/assessmentReports/showReports",{state:data});
    }
    let location = useLocation();
    console.log("Inside StudentCentricReportsComponent Location",location);
    const allocationGroupId = location?.state?.allocationGroupId;
    const studentId = location?.state?.studentId;
    const getChapterTopicWiseData = async () =>{
        let requestParams = {
            allocationGroupId : allocationGroupId,
            studentId : studentId
        }
        const resp = await getChapterTopicWiseReport(requestParams);
        if(resp){
            console.log("Inside getChapterTopicWiseReport",resp);
            let response = resp;
            setChapterTopicWiseData(response || []);
        }
    }
    const getMultipleAttemptsData = async () =>{
        let requestParams = {
            allocationGroupId : allocationGroupId,
            studentId : studentId
        }
        const resp = await getMultipleAttemptsReport(requestParams);
        if(resp){
            console.log("Inside getMultipleAttemptsData",resp);
            let response = resp;
            setMultipleAttemptsData(response || []);
        }
    }
    const getStudentLatestAttemptData = async () =>{
        let requestParams = {
            studentId : studentId,
            allocationGroupId : allocationGroupId
        }
        const resp = await getStudentLatestAttempt(requestParams);
        if(resp){
            console.log("Inside getStudentLatestAttemptData",resp);
            let response = resp;
            setStudentLastAttemptData(response || []);
        }
    }
    useEffect(() =>{
        getChapterTopicWiseData();
    },[])
    useEffect(() =>{
        getMultipleAttemptsData();
    },[])
    useEffect(() =>{
        getStudentLatestAttemptData();
    },[])
    return(
        <>
            <div className='studentCentricReports'>
                <h4 className='cursorPointer' onClick={() => { goBackFn() }}><img src={goBack} />Go Back</h4>
                <div className="container">
                    <h1 className='studentCentricReportsTitle'>StudentCentricReports</h1>
                    <StudentLatestAttemptComponent data={studentLastAttemptData}/>
                    <Accordion data={chapterTopicWiseData}/>
                    <AllReportAttempts data={multipleAttemptsData}/>
                </div>
            </div>
        </>
    );
}
export default StudentCentricReportsComponent;