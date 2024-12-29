import "./EvaluationStudentModal.css";
import React, { useEffect, useState } from 'react';
import { Box, Modal, Select, InputLabel, FormControl, MenuItem } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import ButtonComponent from '../../../SharedComponents/ButtonComponent/ButtonComponent';
import FileUploadPopup, { OptionsInterface } from "../EvaluationPopUpModels/FileUploadPopUp";
import DeleteModalComponent from "../../../SharedComponents/DeleteModalComponent/DeleteModalComponent";
import { assignEditSets, getAllStudentListApi1, publishMark, studentAssessmentByAllocationId, updateMarksErrorType } from "../../../../Api/QuestionTypePaper";
import { deleteAnsSheetApi } from "../../../../Api/QuestionTypePaper";
import { qPaperStudentEventActions, qStudentListEventActions, updateAnswerSheetDetails, updatePublishMarksDetails, updateQpDetails, updateUnPublishMarksDetails } from "../../../../redux/actions/assesmentQListEvent";
import { SnackbarEventActions } from "../../../../redux/actions/snackbarEvent";
import { RootStore } from "../../../../redux/store";
import MraksBreakUp from "../../../../common/MraksBreakUp";
import StudentSheetInfo from "../../../../common/StudentSheetInfo";
import { removeStudentOverViewEventActions } from "../../../../redux/actions/studentOverview";
import UnPublishModal from "../EvaluationPopUpModels/UnPublishModal";
import Spinner from '../../../SharedComponents/Spinner/index';
import WarningModal from "../EvaluationPopUpModels/WarningModal/WarningModal";
import EvaluationTableMobile from "../TemplateCreation/EvaluationTableMobile";
import { ReduxStates } from "../../../../redux/reducers";

interface StudentInterface {
    handelClosePopUp: () => void
    studentData: any
    selectedQuestion: any
    allocationID?: any
    setStudentData: any
    individualStudentData?: any
    setStudentModalOpen:any
}

interface Error {
    error: string;
    errorId: number;
    sequenceId: number | null;
    isSelected: boolean;
}

interface Item {
    id: string;
    sequenceText: string;
    type: 'Part' | 'Section' | 'Main Question' | 'Question';
    obtainedMarks?: any;
    actualMarks?: any;
    errors?: string[];
    children?: Item[];
}

interface FlattenedItem {
    part: string;
    section: string;
    questionNo: string;
    subQuestionNo: string;
    questionId: string;
    obtainedMarks: any;
    actualMarks: any;
    error: string[];
}

const flattenData = (data: Item[]): FlattenedItem[] => {
    let result: FlattenedItem[] = [];

    const addItem = (
        part: string,
        section: string,
        mainQuestion: string,
        subQuestion: string,
        item: Item
    ) => {
        result.push({
            part,
            section,
            questionNo: mainQuestion,
            subQuestionNo: subQuestion,
            questionId: item.id,
            obtainedMarks: item?.obtainedMarks,
            actualMarks: item?.actualMarks,
            error: item.errors || []
        });
    };

    const processItem = (
        item: Item,
        part: string,
        section: string,
        mainQuestion: string,
        subQuestion: string
    ) => {
        if (item.type === 'Question') {
            addItem(part, section, mainQuestion, item.sequenceText.replace(/(<([^>]+)>)/gi, ""), item);
        } else {
            item.children?.forEach((child) => {
                const newPart = item.type === 'Part' ? item.sequenceText.replace(/(<([^>]+)>)/gi, "") : part;
                const newSection = item.type === 'Section' ? item.sequenceText.replace(/(<([^>]+)>)/gi, "") : section;
                const newMainQuestion = item.type === 'Main Question' ? item.sequenceText.replace(/(<([^>]+)>)/gi, "") : mainQuestion;

                processItem(child, newPart, newSection, newMainQuestion, subQuestion);
            });
        }
    };

    data?.forEach(item => processItem(item, '', '', '', ''));
    return result;
};


const StudentViewModal = (props: StudentInterface) => {
  const isMobileView = useSelector(
    (state: ReduxStates) => state?.mobileMenuStatus?.isMobileView
  );
    const { handelClosePopUp, studentData, selectedQuestion, allocationID, setStudentData, individualStudentData ,setStudentModalOpen} = props;
    const buttonLabel = studentData?.answerSheets?.length > 0 ? "Re-upload sheet" : "Upload Sheet";
    const dispatch = useDispatch();
    const initialStudentList = useSelector((state: RootStore) => state?.qMenuEvent?.qStudentList) || [];
    const setMap = useSelector((state: RootStore) => state?.qMenuEvent?.setsmapped);

    const [open, setOpen] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [uploadSheet, setUploadSheet] = useState<boolean>(false);
    const [options, setOptions] = useState<OptionsInterface | any>({});
    const [deleteModalPopup, setDeleteModalPopup] = useState<boolean>(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [tableData, setTableData] = useState(flattenData(studentData?.answerSheetInfo))
    const [preExistingAnswerSheets, setPreExistingAnswerSheets] = useState<any[]>(studentData?.answerSheets || []);
    const [remarks, setRemarks] = useState(studentData?.teacherRemarks)
    const [isUploadSheet, SetIsUploadSheet] = useState<boolean>(false)
    const [errorMessages, setErrorMessages] = useState(() =>
        //     tableData?.map((item:any) => item?.error?.map((err:any) => err.errorId))
        tableData?.map((item: any) => item?.error?.length > 0 ? [item?.error[0]?.errorId] : [])
    );
    const [changedItems, setChangedItems] = useState([]);
    const [selectionOrder, setSelectionOrder] = useState<string[]>([]);
    const [studentSetsDropDown, setStudentSetsDropDown] = useState<any>([]);
    const [studentSetVal, setStudentSetVal] = useState('') as any;
    const [unPublishModal, setUnPublishModal] = useState<boolean>(false);
    const [spinnerStatus, setSpinnerStatus] = useState(false);
    const [fileWarnContent, setFileWarnContent] = useState<any>()
    const [errorWarnModalOpen, setErrorWarnModalOpen] = useState<boolean>(false)

    const handleNext = () => {
        if (currentIndex < studentData.answerSheets.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleButtonClickEvent = () => {
        // if we are Clicking individual button then we need to clear
        setUploadSheet(true);
        SetIsUploadSheet(true);
        setOptions({
            data: {
                qId: selectedQuestion?.id,
                sId: studentData?.studentId,  //sId - StudentId
                studentDetails: studentData
            },
            title: "Upload Sheet",
            subtitle: "Upload answer sheets of the student",
            description: "",
            allocationID: allocationID
        });
    };

    const handleClose = () => {
        handelClosePopUp();
        setOpen(false)
    }
    const handleSheetModal = () => {
        setUploadSheet(false)
    }

    // for open delete popUP
    const handleDeleteSheet = () => {
        setDeleteModalPopup(true)
    }

    const handleWarnModalClose = () => {
        setErrorWarnModalOpen(false)
    }

    // TODO - need to implement delete Sheet API
    const deleteConfirmBtn = async () => {
        try {
            setDeleteModalPopup(false)
            const obj = studentData?.answerSheets[currentIndex].id;
            const deleteResponse = await deleteAnsSheetApi(obj);
            if (deleteResponse?.result?.responseDescription === "Success") {
                const updatedSheets = preExistingAnswerSheets?.filter(sheet => sheet?.id != studentData?.answerSheets[currentIndex].id);
                setPreExistingAnswerSheets(updatedSheets);
                dispatch(updateAnswerSheetDetails({
                    qId: selectedQuestion?.id,
                    sId: studentData?.studentId, data: updatedSheets || [], isDelete: true
                }))
                setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : currentIndex);
                const response = await studentAssessmentByAllocationId(allocationID);
                setStudentData(response?.data);
            }
        } catch (error) {
            console.error("Error while Deleting Sheet", error);
        }
    }
    let controller = new AbortController();
    const handleEditClick = async () => {
        setSpinnerStatus(true)
        if (!isEditMode) setIsEditMode(true);
        if (isEditMode) {
            // if (tableData?.some(item => item?.obtainedMarks == undefined || item?.obtainedMarks === '')) {
            //     setSpinnerStatus(false)
            //     dispatch(SnackbarEventActions({
            //         snackbarOpen: true,
            //         snackbarType: "error",
            //         snackbarMessage: "Please enter marks For all questions",
            //     }));
            //     return;
            // }
            let reqObj: any = {
                "allocationId": allocationID,
                "studentId": studentData.studentId,
                "teacherRemarks": remarks,
                "qpEvaluationUpdates": changedItems,
            }
            // Marks Update 
            const response = await updateMarksErrorType(reqObj);

            if (response?.result?.responseCode === 400 && response?.result?.responseDescription === "BadRequest") {
                setSpinnerStatus(false)
                setFileWarnContent(response?.data)
                setErrorWarnModalOpen(true)
            }

            if (response?.result?.responseDescription && response.result.responseDescription.toLowerCase() === "success") {
                setIsEditMode(prevIsEditMode => !prevIsEditMode);
                if (studentData?.setId && studentData?.setId !== studentSetVal) {
                    let payload = {
                        "questionPaperId": selectedQuestion?.id,
                        "questionPaperSetId": studentSetVal,
                        "studentIds": [
                            studentData?.studentId
                        ]
                    }

                    if (controller) {
                        controller.abort();
                    }

                    // Create a new AbortController instance for the current call
                    controller = new AbortController();
                    const signal = controller.signal;

                    const newSetApi = await assignEditSets([payload], signal);
                } else {
                    // TODO : once we call the bulk upload api we are removing the studentOverviewdetails against the allocationId from the store 
                    dispatch(removeStudentOverViewEventActions({ allocationIds: [allocationID] || [] }))
                    dispatch(updateQpDetails({ qpParer: `${selectedQuestion?.id}`, key: "isMarksUploaded", updatePayload: true }));
                    const response2 = await studentAssessmentByAllocationId(allocationID);
                    setStudentData(response2?.data);
                    setRemarks(response2?.data?.teacherRemarks)
                    const updatedStudents = initialStudentList?.map((student: any) => {
                        if (student?.allocationId == allocationID) {
                            return {
                                ...student, obtainedMarks: response2?.data?.obtainedMarks, isMarksUploaded: student.isMarksUploaded = true, status:
                                    student.status = "Draft", setId: studentSetVal
                            };
                        }
                        return student;
                    });
                    dispatch(qStudentListEventActions(updatedStudents));
                    dispatch(SnackbarEventActions({
                        snackbarOpen: true,
                        snackbarType: "success",
                        snackbarMessage: "Student marks updated successfully",
                    }));

                }

                const setIds2 = selectedQuestion?.questionPaperSetsInfo ? selectedQuestion.questionPaperSetsInfo.map((set: { id: any; }) => set.id) : [];

                let apiPayload = {
                    qpId: selectedQuestion?.id,
                    setId: setIds2
                }
                const response = await getAllStudentListApi1(apiPayload);
                if (response?.result?.responseDescription === "Success" && response?.data) {
                    const sortedData = response?.data?.sort((a: any, b: any) => {
                        const rollNumberA = parseInt(a?.rollNumber, 10);
                        const rollNumberB = parseInt(b?.rollNumber, 10);
                        return rollNumberA - rollNumberB;
                    });
                    dispatch(qStudentListEventActions(sortedData));
                    dispatch(qPaperStudentEventActions({ qId: selectedQuestion?.id, data: sortedData }));
                    // TODO : Updated the Student id 
                    // dispatch(updateStudentDetails({ qId: selectedQuestion?.id,  data: studentSetVal, studentIds : studentData?.studentId ,keys :  "setID"  }))
                }
                handleClose()
            }
            if (response?.response?.status == 400) {
                // setIsEditMode(prevIsEditMode => !prevIsEditMode);
                setIsEditMode(true);
                dispatch(SnackbarEventActions({
                    snackbarOpen: true,
                    snackbarType: "error",
                    snackbarMessage: response?.response?.data?.result?.responseDescription || response?.response?.data?.responseDescription,
                }));
            }
        }
        setSpinnerStatus(false)
    };

    const handleMultiSelectChange = (event: any, index: any, item: any) => {
        const { value } = event.target;
        setTableData((prevTableData: any) => {
            const updatedTableData = [...prevTableData];

            // Update the isSelected property for each error
            updatedTableData[index].error = updatedTableData[index].error.map((error: any) => {
                const isSelected = value.includes(error.errorId);
                return {
                    ...error,
                    isSelected
                };
            });
            // new changes  for sequenceIDs
            setSelectionOrder((prevSelectionOrder) => {
                const newSelectionOrder = [...prevSelectionOrder];
                // Update the selection order based on current selections
                value.forEach((errorId: string) => {
                    if (!newSelectionOrder.includes(errorId)) {
                        newSelectionOrder.push(errorId);
                    }
                });
                // Remove deselected errors from the order
                newSelectionOrder.forEach((errorId, idx) => {
                    if (!value.includes(errorId)) {
                        newSelectionOrder.splice(idx, 1);
                    }
                });
                // Assign sequenceId based on the updated selection order
                let sequenceIdMap = new Map<string, number>();
                newSelectionOrder.forEach((errorId, idx) => {
                    sequenceIdMap.set(errorId, idx + 1);
                });
                updatedTableData[index].error.forEach((error: any) => {
                    if (error.isSelected) {
                        error.sequenceId = sequenceIdMap.get(error.errorId);
                    } else {
                        delete error.sequenceId;
                    }
                });
                // Update the changed items with the new sequence order
                setChangedItems((prevChangedItems) => {
                    const updatedChangedItems: any = [...prevChangedItems];
                    const itemIndex = updatedChangedItems.findIndex((changedItem: any) => changedItem.index === index);
                    const selectedErrors = updatedTableData[index].error.filter((i: any) => i.isSelected);
                    if (itemIndex >= 0) {
                        updatedChangedItems[itemIndex].errors = { errors: selectedErrors };
                    } else {
                        updatedChangedItems.push({
                            index,
                            errors: { errors: selectedErrors },
                            questionId: item.questionId,
                            actualMarks: item.actualMarks,
                            obtainedMarks: item.obtainedMarks
                        });
                    }

                    return updatedChangedItems;
                });

                return newSelectionOrder;
            });

            return updatedTableData;
        });
    };

    const handleChangeMarks = (e: any, index: number, item: any) => {
        let currentObtainedMarks = flattenData(studentData?.answerSheetInfo)
        const obtainedMarkObj = currentObtainedMarks.find((qpId: any) => qpId?.questionId === item?.questionId)
        const actualMarks = parseFloat(item?.actualMarks);
        const newValue = e.target.value;
        if (newValue > actualMarks) {
            dispatch(SnackbarEventActions({
                snackbarOpen: true,
                snackbarType: "error",
                snackbarMessage: "Obtained marks cannot be greater than actual marks",
            }));
        }
        if (individualStudentData && individualStudentData?.isMarksUploaded && e.target.value == "" && obtainedMarkObj?.obtainedMarks !== newValue) {
            setTableData(prevTableData => {
                const updatedTableData: any = [...prevTableData];
                updatedTableData[index].obtainedMarks = null;
                updatedTableData[index].isEdited = true;

                setChangedItems((prevChangedItems) => {
                    const updatedChangedItems: any = [...prevChangedItems];
                    const itemIndex: any = updatedChangedItems.findIndex((changedItem: any) => changedItem.index === index);
                    if (itemIndex >= 0) {
                        updatedChangedItems[itemIndex].obtainedMarks = null;
                        updatedChangedItems[itemIndex].isEdited = true;
                    } else {
                        updatedChangedItems.push({
                            index,
                            errors: { errors: updatedTableData[index].error?.filter((i: any) => i.isSelected) },
                            questionId: item?.questionId,
                            actualMarks: item?.actualMarks,
                            obtainedMarks: null,
                            isEdited: true
                        });
                    }
                    return updatedChangedItems;
                });
                return updatedTableData;
            });
        } else {
        setTableData(prevTableData => {
            const updatedTableData: any = [...prevTableData];
            updatedTableData[index].obtainedMarks = newValue;

            setChangedItems((prevChangedItems) => {
                const updatedChangedItems: any = [...prevChangedItems];
                const itemIndex: any = updatedChangedItems.findIndex((changedItem: any) => changedItem.index === index);

                if (itemIndex >= 0) {
                    updatedChangedItems[itemIndex].obtainedMarks = newValue;
                    delete updatedChangedItems[itemIndex].isEdited
                } else {
                    updatedChangedItems.push({
                        index,
                        errors: { errors: updatedTableData[index].error?.filter((i: any) => i.isSelected) },
                        questionId: item?.questionId,
                        actualMarks: item?.actualMarks,
                        obtainedMarks: newValue
                    });
                }

                return updatedChangedItems;
            });

            return updatedTableData;
        });
    }
    }

    const handlePublish = async () => {
        try {
            // TODO: Call the Upload API
            setSpinnerStatus(true)
            const payload = {
                allocationIDs: [allocationID],
                statusID: 11
            };
            const response = await publishMark(payload);
            if (response?.result?.responseDescription && response.result.responseDescription.toLowerCase() === "success") {
                const response2 = await studentAssessmentByAllocationId(allocationID);
                setStudentData(response2?.data);
                const studentId = [response2?.data?.studentId]
                dispatch(updatePublishMarksDetails({ qpId: selectedQuestion?.id, studentId: studentId, obtainedMarks: [response2?.data?.obtainedMarks] }));
                dispatch(SnackbarEventActions({
                    snackbarOpen: true,
                    snackbarType: "success",
                    snackbarMessage: `Students' marks published successfully`,
                }));
                handleClose();
            } else {
                dispatch(SnackbarEventActions({
                    snackbarOpen: true,
                    snackbarType: "error",
                    snackbarMessage: "Error while Publishing the Marks",
                }));
            }
        } catch (error) {
            console.error("Error while publishing the marks:", error);
        }
        setSpinnerStatus(false)
    };

    const handleUnPublish = async () => {
        try {
            const payload = {
                "allocationIDs": [allocationID],
                "statusID": 10
            }
            const response = await publishMark(payload)
            if (response?.result?.responseDescription && response.result.responseDescription.toLowerCase() === "success") {
                const response2 = await studentAssessmentByAllocationId(allocationID);
                setStudentData(response2?.data);
                const studentId = [response2?.data?.studentId]
                dispatch(updateUnPublishMarksDetails({ qpId1: selectedQuestion?.id, studentId1: studentId }));
                dispatch(SnackbarEventActions({
                    snackbarOpen: true,
                    snackbarType: "success",
                    snackbarMessage: `Marks unpublished successfully`,

                }));
                setUnPublishModal(false)
            } else {
                dispatch(SnackbarEventActions({
                    snackbarOpen: true,
                    snackbarType: "error",
                    snackbarMessage: response?.response?.data?.responseDescription || "Error while Un-Publishing the mark",
                }));
            }
        } catch (error) {
            console.error("Error while Unpublishing the marks")
        }
    }

    const handleSetChange = (event: any) => {
        setStudentSetVal(event.target.value)
    }

    const handleUnPublishMarkModal = () => {
        setUnPublishModal(true)
    }

    useEffect(() => {
        setRemarks(remarks)
        setStudentSetVal(studentData?.setId ?? "NA")
    }, [studentData])

    useEffect(() => {
        if (setMap) {
            // Create a new object to avoid mutating the original setMap
            const setsValues = { ...setMap };
            // Remove the entry with key "1"
            delete setsValues["1"];
            // Transform the object into the desired array format
            const formattedSets = Object.entries(setsValues).map(([key, value]) => ({
                setId: key,
                name: value
            }));
            setStudentSetsDropDown(formattedSets);
        }
    }, []); // Ensure setMap is in the dependency array

    useEffect(() => {
        const allData = flattenData(studentData?.answerSheetInfo)
        if (allData && !individualStudentData?.isMarksUploaded) {
            const updatedItems = changedItems.filter((item: any) => item?.obtainedMarks != "")
            setChangedItems(updatedItems)
        }

    }, [tableData])


    return (
        <React.Fragment>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className="student_preview_container qpCustomFontPopup assement-q-modal"
                    sx={{ width: '100%', height: '100%' }}
                >
                    <div className="student-main-container">
                        <div className="student-header">
                            <div className="header-left-side">
                                <span className="ques-header-title" dangerouslySetInnerHTML={{ __html: studentData?.questionPaperName }}>
                                    {/* {studentData?.questionPaperName} */}
                                </span>
                                <span className="ques-header-subTitle">
                                    {studentData?.marks} marks | {studentData?.paperType} | {studentData?.examMode}
                                </span>
                                <div style={{ maxWidth: "900px" }}>
                                    {studentData?.courseName}
                                </div>
                            </div>
                            <div className="header-right-side">
                                {/* TODO - need to Update this set-info */}
                                <div className="select-set">
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-autowidth-label" style={{ fontSize: '10px' }}>Select Set</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-autowidth-label"
                                            id="SetId"
                                            name="SetId"
                                            disabled={!isEditMode || studentData?.setId === null}
                                            value={studentData?.setId ? studentSetVal : "NA"}
                                            onChange={handleSetChange}
                                            label="Set"
                                            fullWidth
                                            sx={{ width: '171px', height: "45px" }}
                                        >
                                            {studentData?.setId && studentSetsDropDown?.length > 0 ? (
                                                studentSetsDropDown.map((set: any) => (
                                                    <MenuItem key={set.setId} value={set.setId}>
                                                        {set.name}
                                                    </MenuItem>
                                                ))
                                            ) : (
                                                <MenuItem value="NA">NA</MenuItem>
                                            )}
                                        </Select>
                                    </FormControl>
                                </div>
                                <div className={studentData?.status === "Publish" ? "upload-btn-2" : "upload-btn"}>
                                    <ButtonComponent
                                        icon={''}
                                        image={""}
                                        textColor="#1B1C1E"
                                        backgroundColor="#01B58A"
                                        disabled={studentData?.status === "Publish"}
                                        buttonSize="Medium"
                                        type="outlined"
                                        label={buttonLabel}
                                        minWidth="200"  // Adjusted minWidth to provide more space for text
                                        // style={{ fontSize: '14px', padding: '8px 16px' }} // Adjust font size and padding if needed
                                        onClick={handleButtonClickEvent}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="student-inner-container">
                            <MraksBreakUp
                                isEditable={isEditMode}
                                remarks={isEditMode ? remarks : studentData?.teacherRemarks}
                                tableData={tableData}
                                studentData={studentData}
                                handleRemarksChange={(e: any) => setRemarks(e.target.value)}
                                handleChangeMarks={(e: any, index: number, item: any) => handleChangeMarks(e, index, item)}
                                handleMultiSelectChange={(e: any, index: number, item: any) => handleMultiSelectChange(e, index, item)}
                            />
                            {studentData?.answerSheets?.length > 0 && (
                                <StudentSheetInfo
                                    isEditable={isEditMode}
                                    handlePrevious={handlePrevious}
                                    currentIndex={currentIndex}
                                    handleNext={handleNext}
                                    studentData={studentData}
                                    handleDeleteSheet={handleDeleteSheet}
                                />)}
                        </div>
                    </div>

                    <div className="student-footer">
                        <div>
                            Total Questions: {studentData?.totalQuestions}
                        </div>
                        <div style={{ display: "flex", gap: "24px" }}>
                            <ButtonComponent icon={''} image={""} textColor="#FFFFFF" backgroundColor=" #01B58A" disabled={studentData?.status === "Publish" || spinnerStatus} buttonSize="Medium" type="contained" label={!isEditMode ? "Edit" : "Save"} minWidth="150" onClick={handleEditClick} />
                            {studentData?.status && <ButtonComponent icon={''} image={""} textColor="#FFFFFF" backgroundColor=" #01B58A" disabled={spinnerStatus} buttonSize="Medium" type="contained" label={studentData?.status === "Publish" ? "Un-Publish" : "Publish"} minWidth="150" onClick={studentData?.status === "Publish" ? handleUnPublishMarkModal : handlePublish} />}
                            <ButtonComponent icon={''} image={""} textColor="#1B1C1E" backgroundColor="#01B58A" disabled={false} buttonSize="Medium" type="outlined" label="Cancel" minWidth="150" onClick={handleClose} />
                        </div>

                    </div>
                </Box>
            </Modal>
            {(isMobileView)&& (
        <EvaluationTableMobile
          tableData={tableData}
          studentData={studentData}
          allocationID={allocationID}
          selectedQuestion={selectedQuestion}
          setStudentData={setStudentData}
          handleChangeMarks={(e: any, index: number, item: any) => handleChangeMarks(e, index, item)}       
          setStudentModalOpen={setStudentModalOpen}
          handleMultiSelectChange={(e: any, index: number, item: any) => handleMultiSelectChange(e, index, item)}
          handleEditClick={handleEditClick}
          isEditMode={isEditMode}
          handleRemarksChange={(e: any) => setRemarks(e.target.value)}
          value={remarks}


        />
      )}
            <DeleteModalComponent
                open={deleteModalPopup}
                descriptionText={''}
                deleteHandler={deleteConfirmBtn}
                title={"Are you sure you want to delete the file"}
                onClose={() => setDeleteModalPopup(false)}
                lables={{
                    "Delete": "Yes",
                    "Cancel": "No"
                }
                }
            />
            {uploadSheet && <FileUploadPopup
                options={options}
                isSheetUpload={uploadSheet}
                handleClose={handleSheetModal}
                setStudentData={setStudentData}
                isUploadSheet={isUploadSheet}
            />}
            {spinnerStatus && <Spinner />}
            {
                unPublishModal &&
                <UnPublishModal open={unPublishModal} title={"Un-publish Student Marks?"} onClose={() => setUnPublishModal(false)} deleteHandler={() => handleUnPublish()} SubTitle1={"Marks already published for the students."} SubTitle2={"Do you wish to un-publish"} btnlabel={"Un-Publish"} />
            }

            {errorWarnModalOpen && <WarningModal open={errorWarnModalOpen} handleClose={handleWarnModalClose} warnContent={fileWarnContent} FromStudentEditMark={true} />}

        </React.Fragment>
    )
}

export default StudentViewModal;