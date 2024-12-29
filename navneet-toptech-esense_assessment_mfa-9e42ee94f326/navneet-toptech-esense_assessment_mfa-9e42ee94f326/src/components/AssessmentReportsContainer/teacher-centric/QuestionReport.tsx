import React from "react";
import './QuestionReport.css'
import { QuestionWiseReports, TopicWiseReports } from "../../../interface/AssessmentReportsResponses";
import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
interface Props{
    data: QuestionWiseReports[];
}
const QuestionReport:React.FC<Props> = (data) => {
    const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
        <Tooltip {...props} classes={{ popper: className }} />
      ))(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
          backgroundColor: 'rgba(97, 97, 97, 0.92)',
          color: '#fff',
          maxWidth: 220,
          fontSize: theme.typography.pxToRem(12),
          border: '1px solid #dadde9',
        },
      }));
    console.log(data);
    const questions = new Set(data?.data?.flatMap(reportData => (
        reportData.questionMetaInfo.map(questionNumber => (
            questionNumber.questionNumber
        ))
    )));
    const uniqueQuestionNumber = Array.from(questions);
    function getCorrectOrIncorrect(score:number,statusId:number){
        if(statusId === 3){
            if(score === 0){
                return 2
            }else{
                return 1
            }
        }else{
            return statusId;
        }
    }
    return (
        <div className="div-box-shadow lastScoreByItem">
            <h2>Last Score on Question paper per question level</h2>
            <h3>Drill down and see exactly how each student did, per item. Helpful for identifying specific knowledge or understanding gaps in your group.</h3>
            <div className="scrollable-table">
                <table className="table-question">
                    <tr>
                        <th>Student</th>
                        <th>Score</th>
                        {uniqueQuestionNumber.map((data,index:number) =>
                            <th key={index}>{index+1}</th>
                        )}
                    </tr>
                    {data?.data?.map(data => (
                        <tr key={data.studentName}>
                            <td> {data.studentName}</td>
                            <td>{data.score} Marks</td>
                            {data.questionMetaInfo.map(question => (
                                <td>
                                    <HtmlTooltip
                                        title={
                                        <React.Fragment>
                                            <p className="m-0 text-center">Score: {question.score} <br/> Time Spend: {question.timeSpent} sec(s)</p>
                                        </React.Fragment>
                                        }
                                    >
                                        <span className={`status-dot status-dot-${getCorrectOrIncorrect(question.score,question.statusId)}`}></span>
                                    </HtmlTooltip>
                                </td>
                            ))}
                        </tr>
                    ))}
                </table>
            </div>
        </div>
    );
}

export default QuestionReport;