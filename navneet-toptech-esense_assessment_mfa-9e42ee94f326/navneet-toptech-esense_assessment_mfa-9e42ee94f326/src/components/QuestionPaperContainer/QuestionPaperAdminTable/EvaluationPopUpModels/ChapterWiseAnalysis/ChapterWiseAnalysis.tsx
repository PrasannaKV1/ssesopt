import React from 'react';
import { Container, Box, Typography, Button, CircularProgress, List, ListItem, ListItemText } from '@mui/material';
import { styled } from '@mui/system';
import ButtonComponent from '../../../../SharedComponents/ButtonComponent/ButtonComponent';
import './ChapterWiseAnalysis.css'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


const StyledContainer = styled(Container)({
    padding: '20px',
    textAlign: 'center',
    borderRadius: '16px',
    backgroundColor: 'white',
    maxWidth: '95% !important',
    margin: '1% !important',
});

const ProgressBox = styled(Box)({
    position: 'relative',
    display: 'inline-flex',
    marginBottom: '20px',
});

const StyledCircularProgress = styled(CircularProgress)({
    color: '#4caf50',
});

const ProgressText = styled(Box)({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
});

const TopicsListBox = styled(Box)({
    textAlign: 'left',
    marginTop: '5px',
});

interface ChapterWiseAnalysis{
    analysisName: string,
    subjectDetails:any
}


const ChapterWiseAnalysis: React.FC<ChapterWiseAnalysis> = ({analysisName, subjectDetails}) => {
    return (
        <StyledContainer>
            <div>
                <ProgressBox>
                    <div style={{ width: 200, height: 200 }}>
                        <CircularProgressbar value={subjectDetails?.percentage} strokeWidth={15} styles={{
                            path: {
                                // Path color
                                stroke: subjectDetails?.percentage >= 50 ? "#01B58A" : '#F95843',
                                transition: 'stroke-dashoffset 0.5s ease 0s',
                              },
                            trail: {
                                stroke: subjectDetails?.percentage >= 50 ? '#d7f7f0' : 'rgba(249, 88, 67, 0.1)',
                                strokeLinecap: 'butt',
                                transform: 'rotate(0.25turn)',
                                transformOrigin: 'center center',
                              },
                              background: {
                                fill: '#01B58A',
                              },
                         }}
                        />
                    </div>
                    <ProgressText>
                        <Typography variant="h1" style={{ color: '#1B1C1E', fontWeight: '800', fontSize: '16px' }}>
                            {Math.round(subjectDetails?.percentage)}%
                        </Typography>
                        <Typography variant="body2" style={{ color: '#1B1C1E', fontWeight: '400', fontSize: '14px' }}>
                            Correct Answers
                        </Typography>
                    </ProgressText>
                </ProgressBox>
                <Typography variant="subtitle1" gutterBottom>
                    <h4> {'Chapter : '} </h4>
                    <h2> {subjectDetails?.chapterName} </h2>
                </Typography>
                {subjectDetails?.topicWiseDetails?.length > 0 && (
                    <TopicsListBox style={{ marginLeft: "15rem" }}>
                        <span className='topic-coverage'>Topics Covered:</span>
                        <div className="topics-grid">
                            {subjectDetails.topicWiseDetails.map((topic: any, index: number) => (
                                <List className='topic_List' key={topic.topicId}>
                                    <ListItemText primary={`${index + 1}. ${topic.topicName} - ${topic.noOfQuestions} Q(s)`} />
                                </List>
                            ))}
                        </div>
                    </TopicsListBox>
                )}
            </div>
        </StyledContainer>
    );
};

export default ChapterWiseAnalysis;
