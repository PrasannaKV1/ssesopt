import React, { useEffect, useState } from "react";
import './ExpandableListComponent.css';
import ProgressBar from "../Progressbar";
import { QuestionWiseReports, TopicWiseReports } from "../../../interface/AssessmentReportsResponses";
interface Props{
    props:TopicWiseReports[]
}
const ExpandableListComponent:React.FC<Props> = ( props ) => {
    const topicNames = new Set(props?.props?.flatMap((data )=> (
        data?.topicReporting.map((topic) => topic.topicName)
    )));
    const uniqueTopicNames = Array.from(topicNames);
    console.log(uniqueTopicNames);
    const studentNames = props?.props?.flatMap(student => (
        student.studentName
    ));
    console.log(studentNames)
    return (
        <div className="lastScore reports mb-4">
            <h2>Last Score on Question paper</h2>
            <div className="scrollable-table">
                <table>
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            {uniqueTopicNames.map(topicName => (
                                <th key={topicName}>{topicName}</th>
                            ))}
                        </tr>

                        {props?.props?.map(a => (
                            <tr key={a.studentName}>
                                <td>{a.studentName}</td>
                                {a.topicReporting.map(score => (
                                    <td><ProgressBar score={score}/></td>
                                ))}
                            </tr>
                        ))}


                    </thead>
            </table>
            </div>
        </div>

    )
};

export default ExpandableListComponent;