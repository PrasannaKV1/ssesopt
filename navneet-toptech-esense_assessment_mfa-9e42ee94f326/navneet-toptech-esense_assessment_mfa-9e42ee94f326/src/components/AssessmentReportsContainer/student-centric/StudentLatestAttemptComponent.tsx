import React from "react";
import '../teacher-centric/ExpandableListComponent.css';
import { LatestAttemptReports } from "../../../interface/AssessmentReportsResponses";
import ProgressBar from "../Progressbar";
interface Props{
   data: LatestAttemptReports
}
const StudentLatestAttemptComponent: React.FC<Props> = ( data ) => {
   console.log("LatestAttemptReportsData",data);
   return (
      <div className="latestSession reports mb-4 div-expandable-box-shadow">
         <h2>Latest Session Summary Report</h2>
         <h3>See a running total of correct, incorrect , skipped and not attempted questions for an individual student.</h3>
         <ProgressBar score={data?.data} />
         <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <table className="table-expandable">
            <tr>
               <td>Total number of questions:</td>
               <td>{data?.data?.totalQuestionCount}</td>
            </tr>
            <tr>
               <td>Total number of correct questions:</td>
               <td>{data?.data?.correctQuestionCount}</td>
            </tr>
            <tr>
               <td>Total number of incorrect questions:</td>
               <td>{data?.data?.incorrectQuestionCount}</td>
            </tr>
            <tr>
               <td>Total number of revised questions:</td>
               <td>{data?.data?.revisedQuestionsCount}</td>
            </tr>
            <tr>
               <td>Total number of skipped questions:</td>
               <td>{data?.data?.skippedQuestionCount}</td>
            </tr>
            </table>
         </div>
      </div>
   )
};

export default StudentLatestAttemptComponent;