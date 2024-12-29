import React, { useState } from 'react'
import MOVE_RIGHT from "../assets/images/move-right.svg"
import MOVE_LEFT from "../assets/images/move-left.svg"
import DELETE_ICON from "../assets/images/deleteIcon.svg"
import { IconButton, Typography } from '@mui/material'
import ChevronUpIcon from '@mui/icons-material/ExpandLess';
import ChevronDownIcon from '@mui/icons-material/ExpandMore';
import { useLocation } from 'react-router'
interface StudentSheetInfoInterface {
    isEditable?: boolean
    handleDeleteSheet?: () => void; // Optional prop
    handlePrevious?: () => void; // Optional prop
    handleNext?: () => void; // Optional prop
    currentIndex?: any
    studentData?: any
}

const StudentSheetInfo: React.FC<StudentSheetInfoInterface> = ({ isEditable, handleDeleteSheet, handlePrevious, currentIndex, handleNext, studentData }) => {
    const location = useLocation();
    const [view, setView] = useState(location?.state === null ? true : false)

    const renderAnswerSheet = () => {
        if (!studentData?.answerSheets || studentData.answerSheets.length === 0) {
            return null;
        }

        const answerSheet = studentData.answerSheets[currentIndex];

        if (!answerSheet) {
            return null;
        }

        const { type, url } = answerSheet;

        if (type === 'jpg' || type === 'png') {
            return (
                <img
                    src={url}
                    alt="Answer Sheet"
                    className="uploaded-sheet-img"
                />
            );
        } else if (type === 'pdf') {
            return (

                <object
                    data={url + "#toolbar=0"}
                    type="application/pdf"
                    height="800"
                    width="100%"
                >
                </object>

            );
        } else {
            return <div>Unsupported file type: {type}</div>;
        }
    };
    return (
        <div className="upload-sheet-div">
            <div className="upload-header-div" style={{ margin: "1rem" }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', width:'100%'}}>
                    <div style={{ fontWeight: "700", fontSize: "18px" }}>
                        Uploaded Answer Sheet
                    </div>
                    {location?.state !== null &&
                    <div>
                        <Typography sx={{ color: '#01B58A', cursor: 'pointer', fontWeight: '600' }} onClick={()=> setView(!view)}>
                            View Details
                            <IconButton>
                            { !view ? <ChevronDownIcon fontSize='large' /> : <ChevronUpIcon fontSize='large'/> }
                            </IconButton>
                        </Typography> 
                        </div>}
            </div>
                {isEditable && (
                    <img
                        src={DELETE_ICON}
                        alt=""
                        style={{ height: "20px", width: "20px", cursor: "pointer" }}
                        onClick={handleDeleteSheet}
                    />
                )}
            </div>
           {view && <div style={{ display: "flex", justifyContent: "center", position: "relative" }}>
                {renderAnswerSheet()} {/* Render answer sheet if provided */}
                {!studentData?.answerSheets || studentData.answerSheets.length !== 0 && <React.Fragment>
                    <button
                        className="sheet-prev-btn"
                        onClick={handlePrevious}
                        disabled={currentIndex === 0}
                    >
                        <img
                            src={MOVE_LEFT}
                            alt="prev"
                            style={{ opacity: currentIndex === 0 ? "0.4" : "1" }}
                        />
                    </button>
                    <button
                        className="sheet-next-btn"
                        onClick={handleNext}
                        disabled={currentIndex === studentData?.answerSheets?.length - 1}
                    >
                        <img
                            src={MOVE_RIGHT}
                            alt="Next"
                            style={{ opacity: currentIndex === studentData?.answerSheets?.length - 1 ? "0.4" : "1" }}
                        />
                    </button></React.Fragment>}

            </div>}
        </div>
    )
}

export default StudentSheetInfo