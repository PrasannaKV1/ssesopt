import { Box } from '@mui/material';
import React, { FC } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import "./PreviewContentComponent.css"

type Props = {
    questionType: any,
    comprehensiveTypeStatus: boolean,
    comprehensiveTypeIndex: number,
    viewMode?: string
    isEvaluation?: boolean
}

const PreviewContentComponent: FC<Props> = ({ questionType, comprehensiveTypeStatus, comprehensiveTypeIndex, viewMode, isEvaluation }) => {
    const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    var MTFObject: any = {};
    if (questionType?.questionTypeName == "Match The Following") {
        questionType?.questionMTFOptions && questionType?.questionMTFOptions.map((options: any) => {
            if (!("0" in MTFObject)) MTFObject["0"] = [];
            MTFObject["0"].push(options?.columnLabel)
            options.details.map((details: any, index: number) => {
                if (!((index + 1) in MTFObject)) MTFObject[index + 1] = []
                MTFObject[index + 1].push(details?.question)
            })
        });
    }
    return (
        <div>
            {questionType?.questionTypeName == "Subjective" &&
                <>
                    <div className='d-flex align-items-start mx-0'>
                        <div className="leftsideHeader">
                            Question {comprehensiveTypeStatus ? comprehensiveTypeIndex + 1 : ""}:
                        </div>
                        <Box className='rightsideHeader' >
                            <span className='questionContent' dangerouslySetInnerHTML={{ __html: questionType?.question }}></span>
                        </Box>
                    </div>
                    {!isEvaluation && <div className='d-flex align-items-start mx-0' style={{ marginTop: "14px" }}>
                        <div className="leftsideHeader">
                            Model Answer :
                        </div>
                        <Box className='rightsideHeader' >
                            <span className='questionContent' dangerouslySetInnerHTML={{ __html: questionType?.solution }}></span>
                        </Box>
                    </div>}
                </>
            }
            {questionType?.questionTypeName == "MCQ" &&
                <>
                    <div className='d-flex align-items-start mx-0'>
                        <div className="leftsideHeader ">
                            Question {comprehensiveTypeStatus ? comprehensiveTypeIndex + 1 : ""}:
                        </div>
                        <Box className='rightsideHeader' >
                            <span className='questionContent' dangerouslySetInnerHTML={{ __html: questionType?.question }}></span>
                        </Box>
                    </div>
                    <div className='d-flex align-items-start mx-0' style={{ marginTop: "14px" }}>
                        <div className="leftsideHeader">
                            Options :
                        </div>
                        <Box className='rightsideHeader' >
                            <span className='questionContent'>
                                <ul className='mcqFormulaListSect'>
                                    {questionType?.questionOptions &&
                                        <>
                                            {questionType?.questionOptions.map((ele: any, index: number) => {
                                                return <li><span>{alphabet[index]}{")"}</span><div dangerouslySetInnerHTML={{ __html: ele.text }}></div></li>
                                            })}
                                        </>
                                    }
                                </ul>
                            </span>
                        </Box>
                    </div>
                {!isEvaluation && <div className='d-flex align-items-start mx-0' style={{ marginTop: "14px" }}>
                        <div className="leftsideHeader">
                            Correct Options :
                        </div>
                        <Box className='rightsideHeader' >
                            <span className='questionContent'>
                                <ul className='mcqFormulaListSect'>
                                    {questionType?.questionOptions &&
                                        <>
                                            {questionType?.questionOptions.map((ele: any, index: number) => {
                                                return (
                                                    <>
                                                        {ele.isCorrect &&
                                                            <li><span>{alphabet[index]}{")"}</span><div dangerouslySetInnerHTML={{ __html: ele.text }}></div></li>
                                                        }
                                                    </>
                                                )
                                            })}
                                        </>
                                    }
                                </ul>
                            </span>
                        </Box>
                </div>}
                </>
            }
            {questionType?.questionTypeName == "Fill in the blanks" &&
                <>
                    <div className='d-flex align-items-start mx-0'>
                        <div className="leftsideHeader ">
                            Question {comprehensiveTypeStatus ? comprehensiveTypeIndex + 1 : ""}:
                        </div>
                        <Box className='rightsideHeader' >
                            <span className='questionContent' dangerouslySetInnerHTML={{ __html: questionType.question.replaceAll("color:#f00", "color:#000000") }}></span>
                        </Box>
                    </div>
                {!isEvaluation && questionType?.blankMetaInfo &&
                        <>
                            {questionType?.blankMetaInfo.map((blankList: any, index: number) => {
                                return (
                                    <div className='d-flex align-items-start mx-0' style={{ marginTop: "14px" }}>
                                        <div className="leftsideHeader">
                                            {`Blank ${index + 1} Answer`} :
                                        </div>
                                        <Box className='rightsideHeader' >
                                            <span className='questionContent' dangerouslySetInnerHTML={{ __html: blankList?.text }}></span>
                                        </Box>
                                    </div>
                                )
                            })}
                        </>
                    }
                </>
            }
            {questionType?.questionTypeName == "Match The Following" &&
                <>
                    <div className='d-flex align-items-start mx-0'>
                        <div className="leftsideHeader ">
                            Question {comprehensiveTypeStatus ? comprehensiveTypeIndex + 1 : ""}:
                        </div>
                        <Box className='rightsideHeader' >
                            <span className='questionContent' dangerouslySetInnerHTML={{ __html: questionType?.question }}></span>
                            <div className='matchFollowingTable MtfTable'>
                                <table>
                                    {MTFObject &&
                                        <>
                                            {Object.keys(MTFObject).map((key, value) => {
                                                return (
                                                    <>
                                                        <tr>
                                                            {MTFObject[key].map((column: any, index: number) => {
                                                                return (
                                                                    <>
                                                                        <td style={{ width: `calc((100% / ${questionType.questionMTFOptions.length}) - 5px)` }} className='matchFolText m-0' dangerouslySetInnerHTML={{ __html: column }}></td>
                                                                    </>
                                                                )
                                                            }
                                                            )}
                                                        </tr>
                                                    </>
                                                )
                                            })}
                                        </>
                                    }
                                </table>
                            </div>

                        </Box>
                    </div>
                </>
            }
            {viewMode != "replacePreview" && !isEvaluation &&
                <>
                    <div className='d-flex align-items-start mx-0' style={{ marginTop: "14px" }}>
                        <div className="leftsideHeader">
                            Hint :
                        </div>
                        <Box className='rightsideHeader' >
                            <span className='questionContent' dangerouslySetInnerHTML={{ __html: !questionType?.hint || questionType?.hint === "undefined" || questionType?.hint === "null" ? "-" : questionType?.hint }}></span>
                        </Box>
                    </div>
                   
                
                <div className='d-flex align-items-start mx-0' style={{ marginTop: "14px" }}>
                    <div className="leftsideHeader">
                        Approach :
                    </div>
                    <Box className='rightsideHeader' >
                        {/* <span className='questionContent' dangerouslySetInnerHTML={{ __html: questionType?.approach ? questionType?.approach : "-"}}></span> */}
                        <span className='questionContent' dangerouslySetInnerHTML={{ __html: !questionType?.approach || questionType?.approach === "undefined" || questionType?.approach === "null" ? "-" : questionType?.approach }}></span>
                    </Box>
                </div>
                {/* <div className='d-flex align-items-start mx-0' style={{ marginTop: "14px" }}>
                    <div className="leftsideHeader">
                        Error Tags :
                    </div>
                    <Box className='rightsideHeader' >
                        <span className='questionContent'>
                            <ul className='questionTypeNameErrortagUl'>
                            {questionType?.questionErrorTypes &&
                                <>
                                    {questionType?.questionErrorTypes.map((errorTypeList: any, index: number) => {
                                        return (
                                            <>
                                            {errorTypeList?.errorName && <li dangerouslySetInnerHTML={{__html: errorTypeList?.errorName }} />}
                                            </>
                                        )
                                    })}
                                </>
                            }
                            </ul>
                        </span>
                    </Box>
                </div> */}
                </>
            }

        </div>
    );
};

export default PreviewContentComponent;