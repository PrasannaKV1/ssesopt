import React, { useEffect, useState } from 'react';
import { Container, FormControl, InputAdornment, MenuItem, OutlinedInput, Select, Typography } from '@mui/material';
import { styled } from '@mui/system';
import ButtonComponent from '../../../../SharedComponents/ButtonComponent/ButtonComponent';
import './ChapterWiseAnalysis.css'
import CircularProgressBar from './CircularProgressBar';
import MOVE_RIGHT from "../../../../../../src/assets/images/MOVE_RIGHT.svg";
import MOVE_LEFT from "../../../../../../src/assets/images/MOVE_LEFT.svg"
import ChapterWiseAnalysis from './ChapterWiseAnalysis';


const StyledContainer = styled(Container)({
    padding: '20px',
    textAlign: 'center',
    borderRadius: '16px',
    backgroundColor: 'white',
    maxWidth: '94% !important',
    margin: '1% 1% 1% 1.6% !important',
});

interface ChapterWiseMajorAnalysis {
    analysisName: string,
    subjectDetails: any
}

function getChapterDetails(data: any) {
    const subjectData = data;
    const strongestChapterId = subjectData?.strongestChapterId;
    const weakestChapterId = subjectData?.weakestChapterId;

    const strongestChapter = subjectData?.chapterWiseDetails?.find((chapter: any) => chapter.chapterId === strongestChapterId);
    const weakestChapter = subjectData?.chapterWiseDetails?.find((chapter: any) => chapter.chapterId === weakestChapterId);

    return {
        strongestChapter,
        weakestChapter
    };
}


const ChapterWiseMajorAnalysis: React.FC<ChapterWiseMajorAnalysis> = ({ analysisName, subjectDetails }) => {
    const [selectedSubject, setSelectedSubject] = useState(null) as any;
    const [chapterDetails, setChapterDetails] = useState<{ strongestChapter: any; weakestChapter: any } | null>(null);
    const [currentChapters, setCurrentChapters] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const chaptersPerPage = 4;
    useEffect(() => {
        if (subjectDetails?.length > 0) {
            const details = getChapterDetails(selectedSubject);
            setChapterDetails(details);
        }
    }, [selectedSubject]);
    const handleNext = () => {
        if (selectedSubject && (((currentPage + 1) * chaptersPerPage) < selectedSubject?.chapterWiseDetails.length - 2)) {
            setCurrentPage(currentPage + 1);
        } else {
            setCurrentPage(currentPage)
        }
    };

    const handlePrev = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    useEffect(() => {
        if (selectedSubject) {
            const start = currentPage * chaptersPerPage;
            const end = start + chaptersPerPage;
            setCurrentChapters(selectedSubject?.chapterWiseDetails?.filter((chapter: any) =>
                chapter?.chapterId !== selectedSubject?.strongestChapterId && chapter?.chapterId !== selectedSubject?.weakestChapterId
            ).slice(start, end));
        }
    }, [selectedSubject, currentPage]);
    useEffect(() => {
        if (subjectDetails && subjectDetails.length > 0) {
            setSelectedSubject(subjectDetails[0]);
        }
    }, [subjectDetails]);

    const handleChange = (event: any) => {
        const selectedId = event.target.value;
        const selectedSubject = subjectDetails.find((subject: any) => subject.subjectId === selectedId);
        setSelectedSubject(selectedSubject);
        setCurrentPage(0);
    };

    return (
        <div className='chapterChallengeMainDiv'>
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width:"60%" }}>
                    <Typography variant="h2" className='chapterName'>{analysisName}</Typography>
                    <div className='prefixSelectThings'>
                        {subjectDetails?.length >1 && <FormControl sx={{ m: 1, width: 300 }} >
                            <Select
                                labelId="demo-prefixmultiple-checkbox-label"
                                id="demo-prefixmultiple-checkbox"
                                value={selectedSubject ? selectedSubject?.subjectId : ''}
                                onChange={handleChange}
                                label="Subject"
                                fullWidth
                                input={<OutlinedInput
                                    startAdornment={<InputAdornment position="start">{'Subject: '}</InputAdornment>}
                                />}
                            >{subjectDetails.map((subject: any) => (
                                <MenuItem key={subject.subjectId} value={subject.subjectId}>
                                    {subject.subjectName}
                                </MenuItem>
                            ))}
                            </Select>
                        </FormControl>}
                    </div>
                    {/* <ButtonComponent type={'contained'} label={'Download Report'} textColor={'white'} buttonSize={'Large'} minWidth={'250'} backgroundColor='#01B58A' /> */}
                </div>
                {selectedSubject?.chapterWiseDetails?.length==1 ? <ChapterWiseAnalysis analysisName={'Chapter-Wise Analysis'} subjectDetails={selectedSubject?.chapterWiseDetails?.[0]} /> :
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px' }}>
                        {chapterDetails && (
                            <>
                                <div>
                                    <CircularProgressBar heading={'Highest Scoring Chapter'} width={150} height={150} subjectDetails={chapterDetails.strongestChapter} isFlag={true} strokeWidth={15} />
                                </div>
                                <div>
                                    <CircularProgressBar heading={'Lowest Scoring Chapter'} width={150} height={150} subjectDetails={chapterDetails.weakestChapter} isFlag={true} strokeWidth={15} />
                                </div>
                            </>
                        )}
                    </div>

                    {currentChapters?.length > 0 && <div style={{ position: 'relative' }}>
                        <button onClick={handlePrev} disabled={currentPage === 0} style={{ position: 'absolute', left: '-20px', top: '40%', border: 'none', background: "none", zIndex: 1 }}>
                            <img src={MOVE_LEFT} alt="prev" style={{ opacity: currentPage === 0 ? "0.4" : "1" }} />
                        </button>

                        <div style={{ display: 'flex', justifyContent: 'space-around', margin: '30px 10px' }}>
                            {currentChapters?.map((chapterData: any, index: number) => (
                                <div key={chapterData.chapterId}>
                                    <CircularProgressBar heading={`Chapter ${currentPage * chaptersPerPage + index + 1}`} width={100} height={100} subjectDetails={chapterData} isFlag={false} strokeWidth={12} />
                                </div>
                            ))}
                        </div>

                        <button style={{ position: 'absolute', right: 0, top: '40%', border: 'none', background: "none" }} onClick={handleNext} disabled={selectedSubject && (currentPage + 1) * chaptersPerPage >= selectedSubject.chapterWiseDetails.length - 2}>
                            <img src={MOVE_RIGHT} alt="Next" style={{ opacity: selectedSubject && (currentPage + 1) * chaptersPerPage >= selectedSubject.chapterWiseDetails.length - 2 ? 0.4 : 1 }} />
                        </button>
                    </div>}
                </>
                }

            </div>

        </div>
            
        
    );
};

export default ChapterWiseMajorAnalysis;
