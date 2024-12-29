
import "../style/onlineAssesmentTable.css";
import React, { useEffect, useState } from 'react';
import { AlertColor, Checkbox, Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import { QuestionPaperInterface, StudentList } from "../interface/online-assesment-interface";
import AvtarSection from "../../QuestionPaperContainer/QuestionPaperAdminTable/TemplateCreation/AvtarSection";
import ButtonColorComponent from "../../SharedComponents/ButtonColorComponent/ButtonColorComponent";
import { useNavigate } from "react-router-dom";
import Toaster from "../../SharedComponents/Toaster/Toaster";
import EmptyScreen from "../../SharedComponents/EmptyScreen/EmptyScreen";
import Avatar from "@mui/material/Avatar";
import { assignChapterChallenge, chapterChallenge, markComplete } from "../../../Api/OnlineAssements";
import { getLocalStorageDataBasedOnKey } from "../../../constants/helper";
import { State } from "../../../types/assessment";
import { useDispatch, useSelector } from "react-redux";
import { RootStore } from "../../../redux/store";
import MarkCompleted from "./MarkCompleted/MarkCompleted";
import { Loader, onlineAssementQpList, onlineUpdateCurrentQpDetails } from "../../../redux/actions/onlineAssement";
import { SnackbarEventActions } from "../../../redux/actions/snackbarEvent";
import Spinner from "../../SharedComponents/Spinner";
import { getAllStudentListApi, QuestionPaperViewApi } from "../../../Api/QuestionTypePaper";
import AssignStudentListModal from "../modals/AssignStudentListModal";

interface OnlineStudentListTablePropsInterface {
    questionPaper: QuestionPaperInterface | undefined | any,
    data: StudentList[]
    selectedOption?: any
    chapterNotCompleted?: boolean
    chapterNotAssigned?: boolean
    chapterSearchFilter?: any
    setQpList?: any
    setChapterNotCompleted?: any
    setChapterNotAssigned?: any
    setSelectedQuestion?: any
    isFromTeacherWeb?: any
}

interface ButtonTypesInterface {
    label: string;
    items: StudentList;
    handleButtonClickEvent: (payload: StudentList) => void;
    disabled?: boolean;
}


interface SortDetails {
    sortColName: keyof StudentList;
    sortColOrder: 'Asc' | 'Desc';
}

const ButtonTypes: React.FC<ButtonTypesInterface> = ({ label, items, handleButtonClickEvent, disabled }) => {
    const getColorStyles = (label: string) => {
        switch (label) {
            case 'Submitted':
                return { textColor: '#01B58A', backgroundColor: '#01B58A1A' };
            case 'Pending':
                return { textColor: '#385DDF', backgroundColor: '#1055EB1A' };
            case 'Not Attempted':
                return { textColor: '#D85564', backgroundColor: '#FEEEEC' };
            case 'In-Progress':
                return { textColor: '#F6BC0C', backgroundColor: '#FFF3CF' };
            default:
                return { textColor: '', backgroundColor: '' }; // Default or fallback colors
        }
    };

    const { textColor, backgroundColor } = getColorStyles(label);

    return (
        <ButtonColorComponent
            buttonVariant='outlined'
            textColor={textColor}
            borderColor='#385DDF' // Example border color, adjust as needed
            label={label}
            width='212px'
            height='25px'
            onClick={() => handleButtonClickEvent(items)}
            backgroundColor={backgroundColor}
            disabled={disabled} // Pass through disabled prop
        />
    );
};

function OnlineStudentListTable(props: OnlineStudentListTablePropsInterface) {
    const navigate = useNavigate()
    const { questionPaper, data, selectedOption, chapterNotCompleted, chapterNotAssigned, chapterSearchFilter, setQpList, setChapterNotAssigned, setChapterNotCompleted, setSelectedQuestion, isFromTeacherWeb } = props;
    const allQpList = useSelector((state: RootStore) => state?.onlineAssesmentMenuEvent?.qpListOnlineAssesment);
    const lmsAssessData: any = isFromTeacherWeb && JSON.parse(localStorage.getItem("topAssessData") as string);
    const dispatch = useDispatch()
    const [page, setPage] = useState<number>(1);
    const rowsPerPage = 10;
    const [studentList, setStudentList] = useState<StudentList[] | any>(data);
    const [sortDetails, setSortDetails] = useState<SortDetails>({
        sortColName: 'studentName',
        sortColOrder: 'Asc',
    });

    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentData = studentList?.slice(startIndex, endIndex);
    const [SnackBarSeverity, setSnackBarSeverity] = useState<AlertColor>("success");
    const [snackBarText, setSnackBarText] = useState<string>("");
    const [snackBar, setSnackBar] = useState<boolean>(false);
    const [markCompleted, setMarkCompleted] = useState({
        open: false,
        info: {}
    })
    const [newAssignQpId, setNewAssignQpId] = useState<any>()
    const [spinnerStatus, setSpinnerStatus] = useState(false);

    const stateDetails = JSON.parse(
        getLocalStorageDataBasedOnKey("state") as string
    ) as State;

    const options: string[] = [
        'View Online Test report'
    ];

    const getClassName = (key: keyof StudentList) => {
        return key === sortDetails.sortColName ? (sortDetails.sortColOrder === 'Asc' ? 'activeUpArrow' : 'activeDownArrow') : '';
    };

    const sortToggle = (colName: keyof StudentList) => {
        const sortColOrder = sortDetails.sortColOrder === 'Asc' ? 'Desc' : 'Asc';
        const sortedStudents = [...studentList].sort((a, b) => {
            if (colName === 'rollNo') {
                const rollNumberA = parseInt(a[colName], 10);
                const rollNumberB = parseInt(b[colName], 10);
                return sortColOrder === 'Asc' ? rollNumberA - rollNumberB : rollNumberB - rollNumberA;
            } else if (colName === 'studentName') {
                return sortColOrder === 'Asc' ? a[colName].localeCompare(b[colName]) : b[colName].localeCompare(a[colName]);
            } else {
                if (a[colName] < b[colName]) return sortColOrder === 'Asc' ? -1 : 1;
                if (a[colName] > b[colName]) return sortColOrder === 'Asc' ? 1 : -1;
                return 0;
            }
        });
        setSortDetails({ sortColName: colName, sortColOrder });
        setStudentList(sortedStudents);
    };

    /**
     * @function handleButtonClickEvent 
     * @param payload  StudentList
     * @description this function is responsible for the button click event from the Student list table
     */
    const handleButtonClickEvent = (payload: any) => {

    }

    /**
     *  @function handleChangePage
     *  @description this function is for pagination 
     */
    const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
        setPage(newPage);
    };

    const handleAssignChapter = async () => {
        try {
            let chaptChallenge: any;
            // dispatch(Loader(true))
            if (!questionPaper?.hasOwnProperty("id")) {
                setSpinnerStatus(true)
                chaptChallenge = await chapterChallenge({
                    "subjectId": isFromTeacherWeb ? parseInt(lmsAssessData?.courseId) : parseInt(chapterSearchFilter?.subjectId),
                    "academicYearId": stateDetails?.currentAcademic?.acadamicId,
                    "chapterId": parseInt(questionPaper?.chapterId),
                    "gradeID": isFromTeacherWeb ? parseInt(lmsAssessData?.gradeId) : parseInt(chapterSearchFilter?.gradeId),
                    "sectionId": isFromTeacherWeb ? parseInt(lmsAssessData?.classId) : parseInt(chapterSearchFilter?.classId),
                    "name": questionPaper?.name
                })
            }
            if (questionPaper?.id || chaptChallenge?.result?.responseDescription == "Success") {
                const response = await assignChapterChallenge(questionPaper?.id || chaptChallenge?.data?.paperId);
                    if (response?.result?.responseCode === 200) {
                        const AssignUpdate = allQpList.map((item: any) => {
                            if (item.curriculumId === questionPaper.curriculumId) {
                                return { ...item, isCompleted: true, isAssigned: true, id: questionPaper?.id || chaptChallenge?.data?.paperId };
                            }
                            return item;
                        });
                        const updatedQP = AssignUpdate.filter((item: any) => item?.curriculumId === questionPaper.curriculumId)
                        setSelectedQuestion(updatedQP[0])
                        dispatch(onlineAssementQpList(AssignUpdate));
                        setQpList(AssignUpdate)
                        dispatch(SnackbarEventActions({
                            snackbarOpen: true,
                            snackbarType: "success",
                            snackbarMessage: `${response?.result?.responseDescription}`,
                        }));
                        setChapterNotAssigned(false)
                        setChapterNotCompleted(false)
                        // dispatch(onlineUpdateCurrentQpDetails(item));
                    }
                    else {
                        dispatch(SnackbarEventActions({
                            snackbarOpen: true,
                            snackbarType: "error",
                            snackbarMessage: `${response?.response?.data?.responseDescription}`,
                        }));
                    }
            }
            if (chaptChallenge?.response && chaptChallenge?.response?.status != 0) {
                dispatch(SnackbarEventActions({
                    snackbarOpen: true,
                    snackbarType: "error",
                    snackbarMessage: chaptChallenge?.response?.data?.responseDescription,
                }));
            }
        } catch (error) {
            console.error("something went wrong");
        }
        // dispatch(Loader(true))
        setSpinnerStatus(false)
    }

    const handleMarkCompleteCheckBox = async () => {
        try {
            // dispatch(Loader(true));
            setSpinnerStatus(true)
        if (questionPaper) {
            const response = await markComplete({
                "curriculumId": questionPaper.curriculumId,
                "staffId": stateDetails.login.userData.userRefId,
                "userId": stateDetails.login.userData.userId,
                "classId": isFromTeacherWeb ? parseInt(lmsAssessData?.classId) : parseInt(chapterSearchFilter?.classId),
                "academicId": stateDetails?.currentAcademic?.acadamicId
            })
            if (response.status == 200) {

                const markUpdate = allQpList.map((item: any) => {
                    if (item.curriculumId === questionPaper.curriculumId) {
                        return { ...item, isCompleted: true };
                    }
                    return item;
                });
                const updatedQP = markUpdate.filter((item: any) => item?.curriculumId === questionPaper.curriculumId)
                setSelectedQuestion(updatedQP[0])
                dispatch(onlineUpdateCurrentQpDetails(updatedQP[0]));
                dispatch(onlineAssementQpList(markUpdate));
                setQpList(markUpdate)
                dispatch(SnackbarEventActions({
                    snackbarOpen: true,
                    snackbarType: "success",
                    snackbarMessage: `Successfully marked all topics for this chapter as complete!`,
                }));
                await handleAssignChapter();
                // const chaptChallenge = await chapterChallenge({
                //     "subjectId": parseInt(chapterSearchFilter?.subjectId),
                //     "academicYearId": stateDetails?.currentAcademic?.acadamicId,
                //     "chapterId": parseInt(questionPaper?.chapterId),
                //     "gradeID": parseInt(chapterSearchFilter?.gradeId),
                //     "sectionId": parseInt(chapterSearchFilter?.sectionId),
                //     "name": questionPaper?.name
                // })
                // dispatch(Loader(false));
                // if (chaptChallenge.result.responseDescription == "Success") {
                //     setMarkCompleted({
                //         open: true,
                //         info: chaptChallenge?.data
                //     });
                //     setNewAssignQpId(chaptChallenge?.data?.paperId)
                // }              
                //}

            }
        }
        }
        catch (error) {
            console.error("Something went wrong");
        }
        // dispatch(Loader(false));
        setSpinnerStatus(false)
    }

    useEffect(() => {
        if (questionPaper && questionPaper?.id) {
            setNewAssignQpId(questionPaper?.id)
        }
    }, [questionPaper])
    useEffect(() => {
        setStudentList(data);
    }, [data]);

    const handleArrowClick = async (data: any) => {
        if (data?.statusId === 6) {//submitted
            navigate("/assess/evaluation/schoolReport", {
                state: {
                    selectedQp: questionPaper?.id,
                    studentDetails: data,
                    isOnlineTestReport: true,
                    tabSelected: selectedOption,
                    isFromTeacherWeb: isFromTeacherWeb
                },
            });
        } else {
            setSnackBar(true);
            setSnackBarSeverity('error');
            setSnackBarText("View report is not possible as student has not yet submitted the Test.")
        }
    }


    const handleEdit = (data: any) => {
        navigate(
            `${'/assess/evaluation/onlineAssesment/printforpreview'}`, {
            state: {
                state: true,
                templateId: data?.id,
                print: false,
                questionPaperTypeID: data.questionPaperTypeID,
                showAssignBtn: data?.studentsCount > 0 ? false : true,
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

    const [studentListModal, setStudentListModal] = useState<boolean>(false)
    const [showAssignBtn, setShowAssignBtn] = useState(false);
    const [templateJson, setTemplateJson] = useState<any>();
    const [questionPaperId , setQuestionPaperId] = useState();
    const handleAssignStudent = async (data: any) => {
        if(!(data?.studentsCount > 0)){
            setShowAssignBtn(true);
        }

        const res:any = await QuestionPaperViewApi(data?.id,false);
        if(res){
            setTemplateJson(res?.data)
        }
        // Extract courseIds, sectionIds, and gradeId from the data
        const courseIds = data.questionPaperCourseDetails.map((course: any) => course.courseID);
        const sectionIds = data.questionPaperClassDetails.map((section: any) => section.classId);
        const gradeId = data.gradeID; 
        setQuestionPaperId(data?.id);
        try {
            const apiPayload = {
                "staffId": stateDetails.login.userData.userRefId,
                "courseId": courseIds,
                "sectionId": sectionIds,
                "gradeId": [gradeId],
                "qpId": data?.id,
                "qpTypeId": 1,
                "isStudentCourse": true
            };
    
            const studentList = await getAllStudentListApi(apiPayload);
    
            if (studentList?.data && studentList?.data.length > 0) {
                setSpinnerStatus(false);
    
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
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleStudentModalCLose = () => {
        setStudentListModal(false)
      }
    

    return (
        <>
       
            {((selectedOption == "0" && (questionPaper && questionPaper?.studentsCount > 0)) || (selectedOption == "1" && !chapterNotAssigned && !chapterNotCompleted)) && 
        <div className='stduent-table-container'>
            <div className='student-table'>
                <TableContainer style={{ height: "calc(100vh - 390px" }} >
                    <Table stickyHeader aria-label="sticky table" className="assesment">
                        <TableHead>
                            <TableRow>
                                {/* <TableCell>
                                    <Checkbox checked={false} onChange={undefined} />
                                </TableCell> */}
                                <TableCell style={{ cursor: 'pointer' }}>
                                    <div className='tableHeadArrowSect'>
                                        <span
                                            className={`resrTableSortArrow questionPaperArrow  ${getClassName('studentName')} `}
                                            style={{ display: 'flex', flexDirection: 'row', gap: '4px', alignItems: 'center' }}
                                            onClick={() => sortToggle('studentName')}
                                        >
                                            STUDENTS
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                <img width='10px' alt='' src={process.env.PUBLIC_URL + '/Images/UpPolygon.svg'} />
                                                <img width='10px' alt='' src={process.env.PUBLIC_URL + '/Images/Polygon.svg'} />
                                            </div>
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell style={{ cursor: 'pointer' }}>
                                    <div className='tableHeadArrowSect'>
                                        <span
                                            className={`resrTableSortArrow questionPaperArrow ${getClassName('rollNo')} `}
                                            style={{ display: 'flex', flexDirection: 'row', gap: '4px', alignItems: 'center' }}
                                            onClick={() => sortToggle('rollNo')}
                                        >
                                            ROLL NUMBER
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                <img width='10px' alt='' src={process.env.PUBLIC_URL + '/Images/UpPolygon.svg'} />
                                                <img width='10px' alt='' src={process.env.PUBLIC_URL + '/Images/Polygon.svg'} />
                                            </div>
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell style={{ cursor: 'pointer', textAlign: "center", width: "20%" }}>
                                    <div className='tableHeadArrowSect'>
                                        <span>STATUS</span>
                                    </div>
                                </TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody sx={{ background: "#fff" }}>
                            {/* Table Body */}
                            {currentData.length > 0 && currentData.map((items: StudentList, index: number) => (
                                <TableRow key={index}>
                                    {/* <TableCell>
                                        <Checkbox
                                            checked={false}
                                            onChange={undefined}
                                        />
                                    </TableCell> */}
                                    <TableCell style={{}}>
                                        <div className="online-table-name-avatars">
                                            {/* <AvtarSection
                                                firstName={items?.studentName}
                                                profile={items?.studentProfileImg}
                                            /> */}
                                            <Avatar src={items?.studentProfileImg} />
                                            <div className="online-table-name-avatars-title">
                                                <div>{`${items?.studentName}`}</div>
                                                <div>{`${items?.className}`}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell style={{ lineHeight: "initial" }}>{items?.rollNo}</TableCell>
                                    <TableCell style={{ height: '70px' }}>
                                        <ButtonTypes label={items?.statusName} items={items} handleButtonClickEvent={handleButtonClickEvent} />
                                    </TableCell>
                                   {questionPaper?.disableQPOptions ? <TableCell> </TableCell> : <TableCell style={{ cursor: 'pointer' }} onClick={() => handleArrowClick(items)}> <KeyboardArrowRightIcon /></TableCell> }
                                </TableRow>
                            ))}
                            {currentData.length === 0 && <TableRow>
                                <TableCell colSpan={6} style={{ textAlign: 'center' }}>No match found!</TableCell>
                            </TableRow>}
                        </TableBody>
                    </Table>
                </TableContainer>
                {currentData.length > 0 &&
                            <div className='online-assess-pagenation ' style={{ display: 'flex', justifyContent: 'start', paddingTop: '3rem' }}>
                    <Pagination
                        count={Math.ceil(studentList?.length / rowsPerPage)}
                        page={page}
                        onChange={handleChangePage}
                        shape="rounded"
                    />
                    </div>}
            </div>
            <Toaster onClose={() => { setSnackBar(false) }} severity={SnackBarSeverity} text={snackBarText} snakeBar={snackBar} />
                </div>
            }
            {selectedOption == "0" && questionPaper && questionPaper?.studentsCount == 0 &&
                <EmptyScreen
                    emptyBtnTxt={'Assign test to students'}
                    title={'Please assign students to this Test'}
                    desc={'After assigning students the test will be published to the selected students'}
                    onClickBtn={() => questionPaper?.disableQPOptions  ? handleAssignStudent(questionPaper) : handleEdit(questionPaper)}
                    btnDisable={false}
                    createButtonActionObj={undefined}
                    style={{ width: "100%", marginTop: "-10px" }}
                />}
            

            {selectedOption == "1" && chapterNotCompleted &&
                <div>
                    <EmptyScreen
                        emptyBtnTxt={'Mark Chapter as Complete and Assign Chapter Challenge'}
                        title={'Chapter Challenge not assigned yet'}
                        desc={'Please mark a chapter complete to view test details'}
                        onClickBtn={() => handleMarkCompleteCheckBox()}
                        btnDisable={spinnerStatus}
                        createButtonActionObj={undefined}
                        style={{ width: "100%", height: "100%", paddingTop: "50px" }}
                    />
                </div>
            }
            {selectedOption == "1" && chapterNotAssigned &&
                <div>
                    <EmptyScreen
                        emptyBtnTxt={'Assign this chapter challenge'}
                        title={'You haven’t assigned this Chapter Challenge yet'}
                        desc={'Press the button below to Assign now'}
                        onClickBtn={() => handleAssignChapter()}
                        btnDisable={spinnerStatus}
                        createButtonActionObj={undefined}
                        style={{ width: "100%", height: "100%", paddingTop: "50px" }}
                    />
                </div>
            }

{studentListModal &&
        <AssignStudentListModal studentListModal={studentListModal} studentList={studentList} selectedQuestion={templateJson} handleClose={() => { }} handleStudentModalCLose={handleStudentModalCLose} questionPaperID={questionPaperId} setShowAssignBtn={setShowAssignBtn} />
      }
            {markCompleted.open && <MarkCompleted open={markCompleted.open} onClose={() => setMarkCompleted((prev) => ({ ...prev, open: false }))} onAssignData={markCompleted.info} questionPaper={questionPaper} setSelectedQuestion={setSelectedQuestion} setQpList={setQpList} />}
            {/* {isLoading && <Spinner />} */}
            {spinnerStatus && <Spinner />}
        </>
    )
}

export default OnlineStudentListTable