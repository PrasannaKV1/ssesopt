import "../style/onlineAssesmentQp.css";
import React, { useState } from 'react';
import { Box, Typography, IconButton, Avatar, Menu, MenuItem, Tooltip, Checkbox } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import dayjs from 'dayjs';

import { QuestionPaperInterface } from "../interface/online-assesment-interface";
import EDIT_QP from "../assets/edit.svg";
import DELETE_QP from "../assets/delete.svg";
import COPY_QP from "../assets/Rrounded-actions.svg";
import VIEW_QP from "../assets/view_eye_icon.svg"
import DuplicateTestModal from "../modals/DuplicateTestModal";
import { chapterChallenge, deleteQuestionPaper, markComplete } from "../../../Api/OnlineAssements";
import { useDispatch, useSelector } from "react-redux";
import { RootStore } from "../../../redux/store";
import { currentGradeSectionName, Loader, onlineAssementQpList, onlinedeleteCurrentQP, onlineUpdateCurrentQpDetails, questionPaperID } from "../../../redux/actions/onlineAssement";
import DeleteModalComponent from "../../SharedComponents/DeleteModalComponent/DeleteModalComponent";
import { SnackbarEventActions } from "../../../redux/actions/snackbarEvent";
import PreviewTemplate from "./PreviewTemplate/PreviewTemplate";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { getLocalStorageDataBasedOnKey } from "../../../constants/helper";
import { State } from "../../../types/assessment";
import { QuestionPaperViewApi } from "../../../Api/QuestionTypePaper";
import { sendRemainder } from "../../../Api/ChapterChallenge";
import MarkCompleted from "./MarkCompleted/MarkCompleted";
import Spinner from "../../SharedComponents/Spinner";

interface OnlineQpCardsPropsInterface {
    data: QuestionPaperInterface | any
    selectedQuestion?: QuestionPaperInterface | any
    key: number
    setSelectedQuestion?: any
    qpList?: QuestionPaperInterface[]
    handleQuestionMenuEvent:any;
    selectedTabVal?:string;
    selectedOption?: any;
    chapterSearchFilter?: any
    setQpList: any
    lmsAssessData?:any
    isFromTeacherWeb?: any
}
const OnlineQpCards = (props: OnlineQpCardsPropsInterface) => {
    const { data, selectedQuestion, key, setSelectedQuestion, handleQuestionMenuEvent, selectedTabVal, selectedOption, chapterSearchFilter, setQpList, lmsAssessData, isFromTeacherWeb } = props;
    const dispatch = useDispatch();
    let history = useNavigate();

    const currentQuestionPaper = useSelector((state: RootStore) => state?.onlineAssesmentMenuEvent?.currentQp);
    const allQpList = useSelector((state: RootStore) => state?.onlineAssesmentMenuEvent?.qpListOnlineAssesment);
    const completedIds = allQpList
        .filter((item: any) => item.isCompleted) // Filter for items where isCompleted is true and id is present
        .map((item: any) => item.curriculumId); // Extract the id

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // State for anchor element of menu
    const [duplicateTestModal, setDuplicateTestModal] = useState<boolean>(false);
    const [isDelete, setIsDelete] = useState<boolean>(false);
    const [previewTemplateOpenStatus, setPreviewTemplateOpenStatus] = useState<boolean>(false)
    const [selected, setSelected] = useState<any[]>(completedIds);
    const [markCompleted,setMarkCompleted] = useState({
        open:false,
        info:{}
    })
    const [spinnerStatus, setSpinnerStatus] = useState(false);
    const stateDetails = JSON.parse(
        getLocalStorageDataBasedOnKey("state") as string
      ) as State;
    const options: string[] = [
        'View Online Test report'
    ];

    const chapterChallengeItem = [
        {
            title: "View Chapter Challenge report",
            disable: !(data?.isMarksUploaded)
        },
        {
            title: "Remind Students",
            disable: !((data?.isAssigned && data?.isCompleted) && (data?.isReminderApplicable)),
        }
    ];



    const courseDetails = (data?.questionPaperCourseDetails || []).map((course: { courseName: any; }) => course.courseName).join(",");
    const coursesCount = courseDetails.split(',').map((course: string) => course.trim());
    const displayCount = coursesCount.length > 1 ? `+${coursesCount.length - 1}` : '';

    const firstCourseDetail = coursesCount[0];
    const remainingCourseDetails = coursesCount.slice(1).join(', ');

    const transformGradeToClass = (grade: any) => {
        const mainClassName = grade.map((item: any) => item?.className).join(",")
        return mainClassName
    };

    const classNames = transformGradeToClass(data?.questionPaperClassDetails || []);
    const classNamesArray = classNames.split(',').map((className: any) => className.trim());

    const displaySectionCount = classNamesArray.length > 1 ? `+${classNamesArray.length - 1}` : '';
    const firstSectionDetail = classNamesArray[0];
    const remainingSectionDetails = classNamesArray.slice(1).join(', ');

    const testStartDate = dayjs(`${data?.startDate} ${data?.startTime}`, 'YYYY-MM-DD h:mm A');
    const currentTime = dayjs();
    const fiveMinutesBefore = testStartDate.subtract(5, 'minute');
    const isDeleteIconVisible = currentTime.isBefore(fiveMinutesBefore);
    const isEditIconVisible = currentTime.isBefore(fiveMinutesBefore);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget); // Set anchor element to current target (icon button)
    };

    const handleClose = () => {
        setAnchorEl(null); // Close the menu by resetting anchor element to null
    };

    const handleTestModalClose = () => {
        setDuplicateTestModal(false)
    }

    const handleTestModalOpen = () => {
        setDuplicateTestModal(true)
    }

    const hasOnlyIsDeletePopUp = () => {
        setIsDelete(true);
    }

    const handleDeletdQp = async () => {
        try {
            const apiPayload = {
                questionPaperIds: data?.id
            }

            const response = await deleteQuestionPaper(apiPayload);
            // ! Removing The QP paper from the list
            //  After this we need to call the student Listing api and QP and Need to Set the QP indexing 
            if (response && response?.result?.responseDescription === "Success") {
                dispatch(onlinedeleteCurrentQP({ qpID: currentQuestionPaper?.id }));
                dispatch(SnackbarEventActions({
                    snackbarOpen: true,
                    snackbarType: "success",
                    snackbarMessage: `${data?.name} has been deleted Successfully`,
                }));

                // After Deleteting the QP select the new Question Paper 
                const index = allQpList.findIndex((qp: any) => qp.id === data.id);

                let newSelectedQuestion;

                if (index > 0) {
                    // Select the previous question paper if available
                    newSelectedQuestion = allQpList[index - 1];
                } else if (index < allQpList.length - 1) {
                    // Select the next question paper if available
                    newSelectedQuestion = allQpList[index + 1];
                } else {
                    // No other question papers left
                    newSelectedQuestion = {};
                }

                dispatch(Loader(true));
                setSelectedQuestion(newSelectedQuestion);
                dispatch(onlineUpdateCurrentQpDetails(newSelectedQuestion));
                localStorage.setItem('onlineCurrentQp', JSON.stringify(newSelectedQuestion));
                setIsDelete(false);
            }

            if (response && response?.response?.data?.responseDescription !== undefined && response?.response?.data?.responseDescription !== "Success") {
                dispatch(SnackbarEventActions({
                    snackbarOpen: true,
                    snackbarType: "error",
                    snackbarMessage: `${response?.response?.data?.responseDescription}`,
                }));
            };
        } catch (error) {
            console.error("Error while deleting the Question Paper");
            dispatch(SnackbarEventActions({
                snackbarOpen: true,
                snackbarType: "error",
                snackbarMessage: `Someting went wrong while deleting the ${data?.name} paper`,
            }));
        }
        dispatch(Loader(false));
    }
    
    const handleEdit = (data: any) => {
        history(
            `${'/assess/evaluation/onlineAssesment/printforpreview'}`,
            {
            state: {
              state: true,
              templateId: data?.id,
                    showAssignBtn: data?.studentsCount > 0 ? false : true,
              print: false,
                    questionPaperTypeID: data.questionPaperTypeID,
              enablebtnPrint:
                data?.questionPaperTypeID == 2 ? (data.statusID === 2 || data.statusID === 6 ? false : true) : false,
              disableBtnPrint:
                data?.questionPaperTypeID == 2
                  ? data.statusID === 2 || data.statusID === 6 || data.statusID === 5
                    ? true
                    : false
                  : false,
            onlineAssessmentData: data      
            },
          },
        );
      };

    const formatDate = (dateString: string): string => {
        const date = moment(dateString, 'YYYY-MM-DD');
        return date.format('DD MMM');
    };


    const handleOPenToaster = (messageType: string, message: string) => {
                dispatch(SnackbarEventActions({
                    snackbarOpen: true,
                    snackbarType: messageType,
                    snackbarMessage: message,
                }));
    };
   
    const sendRemainderToStudent = async (id: number) => {
        setSpinnerStatus(true)
        const response = await sendRemainder(id);//id->question paper id
        if (response?.result?.responseCode == 0) {
            handleOPenToaster("success", response?.result.responseDescription)
        }
        setSpinnerStatus(false)
    }

      const handelMenu = async (menuValue: { option: string;data:any }) => {
        await handleQuestionMenuEvent(menuValue);
        await handleClose();
    };

    const handleChapterChallenge = async (menuValue: { option: string; data: any }) => {
        if (menuValue.option === 'Remind Students') {
            if (data?.id) {
                sendRemainderToStudent(data?.id);
            }
        }
        await handleQuestionMenuEvent(menuValue);
        await handleClose();
    };

    const handleMarkCompleteCheckBox = async (e:any,data: any) => {
        if (e.target.checked) {
            const response = await markComplete({
                "curriculumId": data.curriculumId,
                "staffId": stateDetails.login.userData.userRefId,
                "userId": stateDetails.login.userData.userId,
                "classId": parseInt( lmsAssessData ? lmsAssessData?.classId : chapterSearchFilter?.classId),
                "academicId": stateDetails?.currentAcademic?.acadamicId
            })
            if( response.status == 200 ){
                const markUpdate = allQpList.map((item: any) => {
                    if (item.curriculumId === data.curriculumId) {
                        return { ...item, isCompleted: true };
                    }
                    return item;
                });
                dispatch(onlineAssementQpList(markUpdate));
                setQpList(markUpdate)
                dispatch(SnackbarEventActions({
                    snackbarOpen: true,
                    snackbarType: "success",
                    snackbarMessage: `Successfully marked all topics for this chapter as complete!`,
                }));
                setMarkCompleted({
                    open: true,
                    info: {
                        chapterSearchFilter,data,lmsAssessData,stateDetails
                    }
                });
            }
        }
        const newSelected = selected.includes(data.curriculumId)
            ? selected.filter(item => item !== data.curriculumId)
            : [...selected, data.curriculumId];
        setSelected(newSelected);
    }

    const handleViewModal = async (id: string) => {
        if (selectedOption == "1") {
            const response = await QuestionPaperViewApi(id, false);
            if (response?.result?.responseCode == 0) {
                history(`${'/asses/onlineTest/preview'}`,
                    {
                        state: {
                            questionPaperID: id,
                            previewJson: response?.data?.generatedQuestionPaper,
                            questionPaperDetails: response?.data,
                            isAfterGenQP: true,
                            isFromTeacherWeb: isFromTeacherWeb,
                            isFromChapterChallenge: true,
                            isChapterChallenge:true
                        },
                    },
                );
            }
        } else {
            setPreviewTemplateOpenStatus(true);
        }
    }


    return (
        <div className="online-questions-card" style={{ position: "relative" }} data-active={selectedOption == "1" ? selectedQuestion?.chapterId === data?.chapterId : selectedQuestion?.id === data?.id}>
            {spinnerStatus && <Spinner />}
            <Box className="card-container">
                <Box className="card-header">
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <Typography className="card-title" dangerouslySetInnerHTML={{ __html: data?.name || "" }}></Typography>
                    </div>
                    <div className="menu" style={{ marginTop: "-8px" }}>
                        <IconButton
                            aria-label="more"
                            id="long-button"
                            aria-controls="long-menu"
                            aria-haspopup="true"
                            onClick={handleClick} // Open menu on click
                        >
                            <MoreVertIcon />
                        </IconButton>
                        <Menu
                            id="long-menu"
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose} // Close menu on clickaway or ESC key
                            PaperProps={{
                                elevation: 0,
                                sx: {
                                    overflow: 'visible',
                                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                    mt: 1.5,
                                    '& .MuiAvatar-root': {
                                        width: 32,
                                        height: 32,
                                        ml: -0.5,
                                        mr: 1,
                                    },
                                    '&::before': {
                                        content: '""',
                                        display: 'block',
                                        position: 'absolute',
                                        top: 0,
                                        right: 14,
                                        width: 10,
                                        height: 10,
                                        bgcolor: 'background.paper',
                                        transform: 'translateY(-50%) rotate(45deg)',
                                        zIndex: 0,
                                    },
                                },
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >

                            {(selectedOption == "0") && options.map((option: string, index: number) => (
                                <MenuItem key={index}  
                                 onClick={() => handelMenu({ option,data })}
                                 disabled={!data.isMarksUploaded || data?.disableQPOptions}
                                 >
                                    {option}
                                </MenuItem>
                            ))}

                            {selectedOption == "1" && chapterChallengeItem?.map((el: { title: string, disable: boolean }, index: number) => (
                                <MenuItem key={index} disabled={el?.disable} onClick={() => handleChapterChallenge({ option: el.title, data })}>
                                    {el?.title}
                                </MenuItem>
                            ))}

                        </Menu>
                    </div>
                </Box>
                {(selectedOption == "0") &&
                <Box className="card-grade" sx={{ marginBottom: isEditIconVisible ? "0px" : "20px" }}>
                    <Typography className="clamped-text card-help-text" style={{ maxWidth: "90px", minWidth: "60px" }}>
                        {firstSectionDetail}
                    </Typography>
                    {displaySectionCount && (
                        <Tooltip title={remainingSectionDetails} arrow placement="bottom-start">
                            <Typography className="card-help-text" sx={{ marginLeft: '-15px', cursor: "pointer" }}>
                                {displaySectionCount}
                            </Typography>
                        </Tooltip>
                    )}
                    <Typography className="clamped-text card-help-text">
                        {firstCourseDetail}
                    </Typography>
                    {displayCount && (
                        <Tooltip title={remainingCourseDetails} arrow placement="bottom-start">
                            <Typography className="card-help-text" sx={{ marginLeft: '-10px', cursor: "pointer" }}>
                                {displayCount}
                            </Typography>
                        </Tooltip>
                    )}
                    </Box>}
                {selectedOption == "1" &&
                    <Box className="card-grade">
                        {/* need to changes with Chapter name */}
                        <Typography className="card-help-text">
                            {data?.chapterName}
                        </Typography>
                    </Box>
                }
                {(selectedOption == "0") && <Box className="card-body">
                    <Typography className="small-text">{data?.marks || 0} Marks</Typography>|
                    <Typography className="small-text">{data?.time || 0} Mins</Typography>|
                    <Typography className="small-text">{formatDate(data?.startDate)}</Typography>
                </Box>}

                {selectedOption == "1" &&
                    <Box className="card-body" sx={{ marginBottom: "0px" }}>
                        <Typography className="small-text">{data?.marks || 0} Marks</Typography>|
                        <Typography className="small-text">{data?.time || 0} Mins</Typography>
                        {data?.assignedDate && '|'}
                        {data?.assignedDate && <Typography className="small-text">{formatDate(data?.assignedDate)}</Typography>}
                    </Box>}
                <Box className="online-card-footer">

                    <div >
                        {(selectedOption == "0") &&
                            <Typography className="small-text">{data?.studentsCount || 0} Students</Typography>}

                        {selectedOption == "1" &&
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", opacity: (data?.isCompleted) ? "0.6" : "1" }} >
                                <Checkbox
                                    sx={{ width: "23px" }}
                                    checked={data?.isCompleted}
                                    disabled={data?.isCompleted}
                                    onChange={(e:any) => handleMarkCompleteCheckBox(e,data)}
                                />
                                <span>
                                    {data?.isCompleted ? "Complete" : "Mark Complete"}
                                </span>
                            </div>
                        }   
                    </div>
                    <div className="online-icons-div">

                        {isEditIconVisible && (selectedOption == "0") && !data?.disableQPOptions && 
                            <Tooltip title={"Edit"} arrow placement="bottom">
                                <img src={EDIT_QP} alt="Edit Qp" style={{cursor: data?.disableQPOptions ? "default" : "pointer" }} onClick={() =>{ if(!data?.disableQPOptions){ handleEdit(selectedQuestion)}}} />
                            </Tooltip>
                        }
                    {/*  Delete Icon */}
                        {isDeleteIconVisible && selectedOption == "0" && !data?.disableQPOptions && (
                            <Tooltip title={"Delete"} arrow placement="bottom">
                            <img src={DELETE_QP} alt="Delete Qp" style={{cursor: data?.disableQPOptions ? "default" : "pointer" }}  onClick={() =>{ if(!data?.disableQPOptions){ hasOnlyIsDeletePopUp()}}} />
                            </Tooltip>
                    )}
                        {selectedOption == "0" && !data?.disableQPOptions && 
                        <Tooltip title={"Duplicate"} arrow placement="bottom">
                                <img src={COPY_QP} alt="Copy Qp" style={{cursor: data?.disableQPOptions ? "default" : "pointer" }} onClick={() => { if(!data?.disableQPOptions){handleTestModalOpen()}}} /></Tooltip>}

                        {data?.id && !data?.disableQPOptions &&
                        <Tooltip title={"View"} arrow placement="bottom">
                                {<img src={VIEW_QP} alt="View Qp" style={{cursor: data?.disableQPOptions ? "default" : "pointer" }} onClick={() =>{ if(!data?.disableQPOptions){ handleViewModal(data?.id)} }}/>}</Tooltip>
                        }
                    </div>
                </Box>
            </Box>
            {duplicateTestModal &&
                <DuplicateTestModal duplicateTestModal={duplicateTestModal} handleTestModalClose={handleTestModalClose} selectedQuestion={selectedQuestion} />
            }
            <DeleteModalComponent open={isDelete} onClose={() => { setIsDelete(false) }} descriptionText={`Selected test will be deleted for all,`} subText={"Do you wish to continue?"} title={`Delete Test?`} deleteHandler={handleDeletdQp} />
            {previewTemplateOpenStatus && <PreviewTemplate open={previewTemplateOpenStatus} handleClose={() => { setPreviewTemplateOpenStatus(false) }} previewJson={selectedQuestion} />}
            {markCompleted.open && <MarkCompleted open={markCompleted.open} onClose={() => setMarkCompleted((prev) => ({ ...prev, open: false }))} onAssignData={markCompleted.info} setQpList={setQpList} setSelectedQuestion={setSelectedQuestion} questionPaper={selectedQuestion} />}    
        </div>
    );
};

export default OnlineQpCards;
