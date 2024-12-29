import ExpandableListComponent from "./ExpandableListComponent";
import QuestionReport from "./QuestionReport";
import '../student-centric/studentcentric.css';
import goBack from '../../../assets/images/goBack.svg';
import { useLocation, useNavigate } from "react-router-dom";
import {useState , useEffect } from 'react';
import { selectApi } from "../../../Api";
import {
    getQuestionWiseReport,
    getTopicWiseReport
} from '../../../Api/AssessmentReports';
import { QuestionWiseReports, TopicWiseReports } from "../../../interface/AssessmentReportsResponses";
import { log } from "console";
interface RequestParams{
    allocationGroupId : number
}
const TeacherCentricComponent = () => {
    let navigate = useNavigate();
    const[topicWiseReportData,setTopicWiseReportData] = useState<TopicWiseReports[]>([]);
    const[questionWiseReportData, setQuestionWiseReportData] = useState<QuestionWiseReports[]>([]);
    let location = useLocation();
    let allocationGroupId = location?.state?.allocationGroupId;
    console.log("Inside Teacher Centric Component",location);
    const goBackFn = () =>{
        let data = {allocationGroupId : allocationGroupId}
        navigate("/assess/assessmentReports/showReports",{state:data});
    }
    const getTopicWiseData = async (allocationGroupId : number) => {
        const resp = await getTopicWiseReport(allocationGroupId);
        if(resp){
            setTopicWiseReportData(resp || []);
        }
    }
    const getQuestionWiseData =async (allocationGroupId:number) => {
        const resp = await getQuestionWiseReport(allocationGroupId);
        console.log("getQuestionWiseData response",resp);
        if (resp) {
          setQuestionWiseReportData(resp || []);
          //setQuestionWiseReportData([]);
        }
    }
    useEffect(() =>{
        getQuestionWiseData(allocationGroupId);
    },[]);
    useEffect(() =>{
        getTopicWiseData(allocationGroupId);
    },[]);
    return(
        <>
            <div className='teacherCentricReports'>
                <h4 className='cursorPointer' onClick={() => { goBackFn() }}><img src={goBack} />Go Back</h4>
                <div className="container">
                    <h1 className="teacherCentricReportsTitle">Teacher Centric Reports</h1>
                    <ExpandableListComponent props={topicWiseReportData}/>
                    <QuestionReport data={questionWiseReportData}/>
                </div>
            </div>
        </>
    );
}
export default TeacherCentricComponent;