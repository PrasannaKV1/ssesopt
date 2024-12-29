import React from "react";
import '../teacher-centric/ExpandableListComponent.css';
import { MultipleAttemptsReports } from "../../../interface/AssessmentReportsResponses";
import ProgressBar from "../Progressbar";

interface Props{
    data:MultipleAttemptsReports
}
const AllReportAttempts: React.FC<Props> = ( data ) => {
    console.log("MultipleAttemptsReportsData",data);
    return (
        <div className="allReportAttemptSect div-expandable-box-shadow">
            <h2>Multiple Attempts on a Single Question Paper Report</h2>
            <h3>View multiple attempts at the same assessment for a single student.</h3>
            <div className="scrollable-table">
                <table className="table-expandable">
                    <tr>
                        <th>Assessment Name</th>
                        <th>Score</th>
                        <th>Date Name</th>
                    </tr>
                    {data?.data?.scoreWithDate?.map(attempt => (
                        <tr>
                            <td>{data?.data?.assessmentName}</td>
                            <td><div className="d-flex justify-content-center gap-2"><ProgressBar score={attempt} /></div></td>
                            <td>{attempt.date}</td>
                        </tr>
                    ))}
                </table>
            </div>
        </div>
    )
}

export default AllReportAttempts;