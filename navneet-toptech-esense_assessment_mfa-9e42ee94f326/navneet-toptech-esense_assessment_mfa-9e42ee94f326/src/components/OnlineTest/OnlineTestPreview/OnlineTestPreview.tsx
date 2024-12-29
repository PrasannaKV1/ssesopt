import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import "../../QuestionPaperContainer/QuestionPaperOPTScreen/TemplatePreview/WarningModal.css"
import ClearIcon from '@mui/icons-material/Clear';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "../../QuestionPaperContainer/QuestionPaperOPTScreen/TemplatePreview/PreviewTemplate.css";
import { getLocalStorageDataBasedOnKey } from '../../../constants/helper';
import ButtonComponent from '../../SharedComponents/ButtonComponent/ButtonComponent';
import { QuestionPaperFontDetails } from '../../QuestionPaperContainer/QuestionPaperOPTScreen/QuestionPaperFontDetails';
import EditingModal from '../../SharedComponents/ModalPopup/EditingModal';
import AssignStudentListModal from '../../OnlineAssesment/modals/AssignStudentListModal';
import { State } from '../../../types/assessment';
import { getAllStudentListApi, QuestionPaperViewApi } from '../../../Api/QuestionTypePaper';
import { SnackbarEventActions } from '../../../redux/actions/snackbarEvent';
import { useDispatch } from 'react-redux';

const OnlineTestPreview = () => {
    const [stepCPreviewBody, setStepCPreviewBody] = useState();
    const [initialFormDefault, setInitialFormDefault] = useState()
    const [continueEditing, setcontinueEditing] = useState<boolean>(false);
    const [studentListModal, setStudentListModal] = useState<boolean>(false)
    const [studentList, setStudentList] = useState<any>();
    const [viewModalAnswer, setViewModalAnswer] = useState(false);
    const [previewJson, setPreviewJson] = useState<any>();
    const [questionPaperDetails, setquestionPaperDetails] = useState<any>();
    let history = useNavigate();
    const { state: { questionPaperID, isAfterGenQP, isFromTeacherWeb, isFromChapterChallenge } }: any = useLocation();
    const stateDetails = JSON.parse(getLocalStorageDataBasedOnKey("state") as string) as State;
    const dispatch = useDispatch()


    const getQuestionPaper = async () => {
        const response = await QuestionPaperViewApi(questionPaperID, false);
        if (response?.result?.responseCode == 0) {
            setPreviewJson(response?.data?.generatedQuestionPaper);
            setquestionPaperDetails(response?.data);
        }
    };
    useEffect(() => {
        getQuestionPaper();
    }, [questionPaperID])

    useEffect(() => {
        let dataModel: any = {}
        const templateParts = previewJson?.bodyTemplate?.templateBuilderInfo?.questionPaperFontMetaData;
        {
            templateParts &&
                Object.keys(templateParts).forEach(function (key, value) {
                    dataModel[key] = "0"
                })
        }
        setInitialFormDefault(dataModel)
    }, [])

    const handleStudentModalCLose = () => {
        setStudentListModal(false)
    }

    const handleAssignStudent = async () => {
        try {
            const courseIDs = questionPaperDetails?.courses.map((id: any) => id?.courseID)
            const sectionIDs = questionPaperDetails?.sections.map((id: any) => id?.sectionID)
            const apiPayload = {
                "staffId": stateDetails.login.userData.userRefId,
                "courseId": courseIDs,
                "sectionId": sectionIDs,
                "gradeId": [questionPaperDetails.gradeID],
                "qpId": questionPaperID,
                "qpTypeId": 1,
                "isStudentCourse": true
            }
            const studentList = await getAllStudentListApi(apiPayload);
            if (studentList?.data && studentList?.data.length > 0) {
                const uniqueClassNames = Array.from(
                    new Set(studentList?.data?.map((item: any) => item?.className) || [])
                );

                const isSingleClass = uniqueClassNames.length === 1;
                const getClassOrder = (className: string): number => {
                    return uniqueClassNames.indexOf(className);
                };
                const sortedData = studentList?.data?.sort((a: any, b: any) => {
                    const rollNumberA = parseInt(a?.rollNumber, 10);
                    const rollNumberB = parseInt(b?.rollNumber, 10);

                    if (isSingleClass) {
                        return rollNumberA - rollNumberB;
                    } else {
                        const classOrderA = getClassOrder(a?.className || "");
                        const classOrderB = getClassOrder(b?.className || "");

                        const adjustedOrderA = classOrderA === -1 ? uniqueClassNames.length : classOrderA;
                        const adjustedOrderB = classOrderB === -1 ? uniqueClassNames.length : classOrderB;

                        if (adjustedOrderA !== adjustedOrderB) {
                            return adjustedOrderA - adjustedOrderB;
                        }

                        return rollNumberA - rollNumberB;
                    }
                });
                setStudentListModal(true)
                setStudentList(sortedData)
            } else {
                dispatch(SnackbarEventActions({
                    snackbarOpen: true,
                    snackbarType: "error",
                    snackbarMessage: "Students are not available for the class and subject.",
                }));
            }
        }
        catch (error) {
        }
    }

    const handleViewModalAnswer = () => {
        setViewModalAnswer(!viewModalAnswer)
    }

    const handleEdit = (data: any) => {
        history(
            `${'/assess/evaluation/onlineAssesment/printforpreview'}`,
            {
                state: {
                    state: true,
                    templateId: questionPaperID,
                    print: false,
                    questionPaperTypeID: data.questionPaperTypeID,
                    enablebtnPrint: false,
                    disableBtnPrint: false,
                    onlineAssessmentData: data
                },
            },
        );
    };

    const handleClose = () => { };

    const handleDoneChange = () => {
        if (isFromTeacherWeb) {
            history('/assess/teacher', {
                state: {
                    selectedTab: '1',
                },
            });
        } else {
            history('/assess/evaluation/onlineAssesment', {
                state: {
                    selectedTab: '1',
                },
            });
        }
    }

    return (
        <Box className="previewTemplateSect">
            <div className='previewTemplateHeader'>
                {isAfterGenQP &&
                    <div className='genQpHeaderContainer'>
                        <div>
                            <h2 className='genQpHeaderPreview'>Preview</h2>
                            <p className='mt-2'>You can preview the generated question paper here</p></div>
                        <div className='genQpHeaderBtn'>
                            {!viewModalAnswer && <>
                                {!isFromChapterChallenge && <ButtonComponent type={"outlined"} label={"Edit"} textColor={"black"} buttonSize={"medium"} minWidth={"91px"} onClick={() => handleEdit(questionPaperDetails)} />}
                                <ButtonComponent type={"outlined"} label={"View Model Answers"} textColor={"black"} buttonSize={"medium"} minWidth={"180"} onClick={() => handleViewModalAnswer()} /></>}
                            {viewModalAnswer && <ButtonComponent type={"outlined"} label={"Hide Model Answers"} textColor={"black"} buttonSize={"medium"} minWidth={"180"} onClick={() => handleViewModalAnswer()} />}
                        </div>
                    </div>
                }
                {!isAfterGenQP && <p>Total questions: {previewJson?.bodyTemplate?.templateBuilderInfo?.paperLevelIndexSequence?.question}</p>}
                {!isAfterGenQP && <p className='m-0 closePreviewTemp' onClick={handleClose}><ClearIcon /></p>}
            </div>
            <div className='previewTemplateBody'>
                {initialFormDefault && <QuestionPaperFontDetails setBodyTemplate={setStepCPreviewBody} initialFormDefault={initialFormDefault} successJson={previewJson} previewMode={"templateMode"} viewAnswer={viewModalAnswer} onlineAssessmentData={questionPaperDetails} />}
            </div>
            <div className='previewTemplateFooter'>
                {(!isAfterGenQP && !isFromChapterChallenge) && <p onClick={handleClose}><KeyboardBackspaceIcon /> Go Back</p>}
                    <div className='genQpFooterSec'>
                        <p className='mt-3'>Total questions: {previewJson?.bodyTemplate?.templateBuilderInfo?.paperLevelIndexSequence?.question}</p>
                    {isAfterGenQP && !isFromChapterChallenge && 
                        <div className='genQpFooterBtnAlign'>
                            <ButtonComponent type={"contained"} label={"Assign Students"} textColor={"white"} buttonSize={"Large"} minWidth={"256"} backgroundColor={"#01B58A"} disabled={false} onClick={handleAssignStudent} />
                            <ButtonComponent type={"outlined"} label={"Cancel"} textColor={"black"} buttonSize={"Large"} minWidth={"150"} onClick={() => { setcontinueEditing(true) }} />
                        </div>}
                    {isFromChapterChallenge &&
                        <ButtonComponent type={"contained"} label={"Done"} textColor={"white"} buttonSize={"Large"} minWidth={"150"} onClick={() => { handleDoneChange() }} backgroundColor={"#01B58A"} />
                    }
                </div>

            </div>
            {continueEditing && <EditingModal open={continueEditing} onClose={() => { setcontinueEditing(false) }} pathname={'/assess/evaluation/onlineAssesment'} search={'?tab=questionPapers'} />}
            {studentListModal &&
                <AssignStudentListModal studentListModal={studentListModal} studentList={studentList} selectedQuestion={questionPaperDetails} handleClose={handleClose} handleStudentModalCLose={handleStudentModalCLose} questionPaperID={questionPaperID} />
            }
        </Box>
    )
}

export default OnlineTestPreview
