
import React from 'react';
import { Box, Typography, Button, CircularProgress, List, ListItemText } from '@mui/material';
import { styled } from '@mui/system';
import './ChapterWiseAnalysis.css'
import { CircularProgressbar } from 'react-circular-progressbar';


const ProgressBox = styled(Box)({
    position: 'relative',
    display: 'inline-flex',
    marginBottom: '20px',
});

const ProgressText = styled(Box)({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
});

const TopicsListBox = styled(Box)({
    textAlign: 'left',
});
interface CircularProgressBar {
    width: number;
    height: number;
    subjectDetails: any;
    isFlag: boolean;
    heading: string;
    strokeWidth: number;
    isQpOverview?: boolean;
    footerText?: string;
    isOnlineTestReport?: boolean;
}
const CircularProgressBar: React.FC<CircularProgressBar> = ({ width, height, subjectDetails, isQpOverview, heading, isFlag, strokeWidth, footerText, isOnlineTestReport }) => {
    return (
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <Typography variant="subtitle1" gutterBottom>
                <h2 style={{ padding: '10px', fontWeight: isOnlineTestReport ? "bolder" : "normal" }}>{heading}</h2>
            </Typography>
            <ProgressBox>
                <div style={{ width: width, height: height }}>
                    {!isQpOverview && <CircularProgressbar value={subjectDetails?.percentage == null ? 'NA' : subjectDetails?.percentage} strokeWidth={strokeWidth} styles={{
                        path: {
                            stroke: subjectDetails?.percentage >= 50 ? "#01B58A" : subjectDetails?.percentage === null ? 'rgba(1, 181,138, 0.1)' : '#F95843',
                            transition: 'stroke-dashoffset 0.5s ease 0s',
                        },
                        trail: {
                            stroke: subjectDetails?.percentage >= 50 ? '#d7f7f0' : subjectDetails?.percentage === null ? 'rgba(1, 181,138, 0.1)' : 'rgba(249, 88, 67, 0.1)',
                            strokeLinecap: 'butt',
                            transform: 'rotate(0.25turn)',
                            transformOrigin: 'center center',
                        },
                        background: {
                            fill: '#01B58A',
                        },
                    }} />}
                    {isQpOverview && <CircularProgressbar value={subjectDetails?.averageScore} strokeWidth={strokeWidth} styles={{
                        path: {
                            stroke: subjectDetails?.averageScore >= 50 ? "#01B58A" : '#F95843',
                            transition: 'stroke-dashoffset 0.5s ease 0s',
                        },
                        trail: {
                            stroke: subjectDetails?.averageScore >= 50 ? '#d7f7f0' : 'rgba(249, 88, 67, 0.1)',
                            strokeLinecap: 'butt',
                            transform: 'rotate(0.25turn)',
                            transformOrigin: 'center center',
                        },
                        background: {
                            fill: '#01B58A',
                        },
                    }} />}
                </div>
                <ProgressText>
                    {!isQpOverview && <Typography variant={subjectDetails?.percentage == null ? 'h2' : strokeWidth == 12 ? 'h5' : 'h2'} style={{ color: '#1B1C1E', fontWeight: '800', fontSize: '14px' }}>
                        {subjectDetails?.percentage == null ? 'NA' : Math.round(subjectDetails?.percentage) + '%' }
                    </Typography>}
                    {!isQpOverview && !isOnlineTestReport && subjectDetails?.percentage !== null && <Typography variant="body2" style={{ color: '#1B1C1E', fontWeight: '400', fontSize: '12px' }}>
                        Correct Answers
                    </Typography>}
                    {isQpOverview && <Typography variant="body2" style={{ color: '#1B1C1E', fontWeight: '600', fontSize: '26px' }}>
                        {subjectDetails?.percentage}
                    </Typography>}
                </ProgressText>
            </ProgressBox>
            {!!footerText && <Typography gutterBottom>
                <h2 style={{ fontWeight: "400", fontSize: "10px" }}>{footerText}</h2>
            </Typography>}
            {!isQpOverview && !isOnlineTestReport && <Typography variant="subtitle1" gutterBottom>
                <h4>{'Chapter : '}</h4>
                <h2> {subjectDetails?.chapterName} </h2>
            </Typography>}
            {
                isFlag && subjectDetails?.topicWiseDetails?.length > 0 && <TopicsListBox className='topicsListBox'>
                    <span className='topic-coverage'>Topics Covered:</span>
                    {subjectDetails?.topicWiseDetails?.map((topic: any, index: number) =>
                        <List className='topic_List'>
                            <ListItemText key={topic.topicId} primary={`${index + 1}. ${topic.topicName} - ${topic.noOfQuestions} Q(s)`} />
                        </List>
                    )}
                </TopicsListBox>
            }
        </div >
    )
}

export default CircularProgressBar