import { Checkbox, TableBody, TableCell, TableContainer, TableHead, TableRow, Table, Grid, InputLabel, Select, FormControl, MenuItem, IconButton, TextField } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import Modal from '@mui/material/Modal';


import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import AvtarSection from "../../QuestionPaperContainer/QuestionPaperAdminTable/TemplateCreation/AvtarSection";
import DOWNPOLYGON from "../../OnlineAssesment/assets/Polygon.svg"
import UPPOLYGON from "../../OnlineAssesment/assets/UpPolygon.svg"
import ButtonComponent from "../../SharedComponents/ButtonComponent/ButtonComponent";
import { useDispatch } from "react-redux";
import { GredbookStudentList } from "../../../interface/assesment-interface";
import { assignStudentToPaper } from "../../../Api/OnlineAssements";
import { Loader, onlineAssementQpList } from "../../../redux/actions/onlineAssement";
import { getQuestionPaperList } from "../../../Api/OnlineAssements";
import styles from "../../OnlineAssesment/style/duplicateTestModal.module.css"
import closeIcon from "../../../assets/images/closeIcon.svg";
import { useLocation, useNavigate } from 'react-router-dom';
import NewAssignTimeModal from "./NewAssignTimeModal";
import { SnackbarEventActions } from "../../../redux/actions/snackbarEvent";
import { useForm, FormProvider } from "react-hook-form";
import DropdownWithCheckbox from "../../SharedComponents/DropdownWithCheckbox/DropdownWithCheckbox";
import Avatar from "@mui/material/Avatar";

type studentListType = {
    studentList: any
    selectedQuestion: any
    studentListModal: boolean
    handleClose: () => void,
    handleStudentModalCLose: () => void
    questionPaperID: any,
    setShowAssignBtn?: any,
};


const AssignStudentListModal = (props: studentListType) => {
    const { studentList, selectedQuestion, studentListModal, handleClose, handleStudentModalCLose, questionPaperID, setShowAssignBtn } = props
    const { state }: any = useLocation();
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const [sortDetails, setSortDetails] = useState<any>({
        sortColName: 'firstName',
        sortColOrder: 'Asc',
    });
    const [studentImg, setStudentImg] = useState<boolean>(true)
    const [sortedStudentList, setSortedStudentList] = useState(studentList)
    const [searchTimeout, setSearchTimeout] = useState<number | null | any>(null);
    const [searchStudentQuery, setSearchStudentQuery] = useState<string | undefined>();
    const [sectionType, setSectionType] = useState<any[]>([]);
    const [selected, setSelected] = useState<number[]>([]); // Array of selected student indices
    const [selectAll, setSelectAll] = useState(false); // Whether all checkboxes are selected
    const [newTimeModal, setNewTimeModal] = useState(false)
    const [initialValues, setInitialValues] = useState<any>({
        sectionId: [],
    })
    const methods = useForm<any>({
        defaultValues: initialValues,
        mode: "onBlur",
        reValidateMode: "onChange"
    });

    const timeoutRef = useRef<any>(null);

    const getClassName = (key: keyof GredbookStudentList) => {
        return key === sortDetails.sortColName ? (sortDetails.sortColOrder === 'Asc' ? 'activeUpArrow' : 'activeDownArrow') : '';
    };

    const handleCloseTimeModal = () => {
        setNewTimeModal(false)
    }

    const changeHandler = async (e: any, data: string) => {
        switch (data as string) {
            case 'section':
                methods.reset({
                    ...methods?.getValues(),
                    sectionId: e
                });
                break;
        }
    }

    const handleCheckBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        const { checked } = event.target;
        setSelectAll(checked);
        setSelected(checked ? fetchFilteredStudent.map((i: any) => i.studentId) : []);
    };
    const handleIndividualCheckboxChange = (index: number, studentId: number) => {
        const newSelected = selected.includes(studentId)
            ? selected.filter(i => i !== studentId)
            : [...selected, studentId];
        setSelected(newSelected);
        setSelectAll(newSelected.length === studentList.length);
    };

    const handleStudentNameSearch = useCallback((value: string) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current); // Clear the previous timeout
        }
        timeoutRef.current = setTimeout(() => {
            setSearchStudentQuery(value); // Update search query after the delay
        }, 30); // 300 milliseconds delay
    }, []);

    const handleStudentSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchStudentQuery(event.target.value); 
    };

    const sortToggle = (colName: any) => {
        const sortColOrder = sortDetails.sortColOrder === 'Asc' ? 'Desc' : 'Asc';
        const sortedStudents = [...studentList].sort((a, b) => {
            if (colName === 'rollNumber') {
                const rollNumberA = parseInt(a[colName], 10);
                const rollNumberB = parseInt(b[colName], 10);
                return sortColOrder === 'Asc' ? rollNumberA - rollNumberB : rollNumberB - rollNumberA;
            } else if (colName === 'firstName') {
                return sortColOrder === 'Asc' ? a[colName].localeCompare(b[colName]) : b[colName].localeCompare(a[colName]);
            } else {
                if (a[colName] < b[colName]) return sortColOrder === 'Asc' ? -1 : 1;
                if (a[colName] > b[colName]) return sortColOrder === 'Asc' ? 1 : -1;
                return 0;
            }
        });
        setSortDetails({ sortColName: colName, sortColOrder });
        setSortedStudentList(sortedStudents)
    };

    const fetchFilteredStudent = useMemo(() => {
        let result = [...sortedStudentList]; // Create a copy to avoid mutating the original array

        // Filter by selected section
        const sectionIds = methods.getValues("sectionId");
        if (sectionIds.length > 0) {
            const studentSectionIds = sectionIds.map((id: any) => `${id}`);
            result = result.filter((student) => {
                return student?.sectionId && studentSectionIds.includes(`${student.classId}`);
            });
        }

        // Filter by search query
        if (searchStudentQuery) {
            const query = searchStudentQuery.toLowerCase();
            result = result.filter((student) => (
                student?.firstName?.toLowerCase().includes(query) ||
                student?.rollNumber?.toString().startsWith(query)
            ));
        }

        return result;
    }, [searchStudentQuery, methods.getValues("sectionId"), sortedStudentList]);


    const handleAssignStudent = async () => {
        try {
            const studentId = [
                {
                    studentInfo: selected.map(studentId => ({ studentId }))
                }
            ]
            const obj = {
                "questionPaperID": questionPaperID,
                "gradeID": selectedQuestion?.gradeID,
                "allocationInfo": studentId,
            }
            dispatch(Loader(true));
            const response = await assignStudentToPaper(obj);
            if (response && response?.result?.responseCode === 0 && response?.result?.responseDescription.toLowerCase() === 'success') {
                dispatch(SnackbarEventActions({
                    snackbarOpen: true,
                    snackbarType: "success",
                    snackbarMessage: "Online Test Created successfully",
                }));
                handleStudentModalCLose();
                    if (state?.isFromTeacherWeb) {
                        navigate('/assess/teacher');
                    } else {
                        navigate('/assess/evaluation/onlineAssesment', {
                            state: { reloadStudentList: true }
                        });
                    }
                const apiPayload = {
                    searchKey: "",
                    sortKey: "",
                    sortKeyOrder: "",
                    questionPaperTypeId: "",
                    questionPaperStatus: "",
                    gradeIds: "",
                    courseIds: "",
                    pageNo: 0,
                    pageSize: 100,
                    chapterIds: "",
                    academicYearIds: "",
                    startDate: "",
                    endDate: "",
                    examModeId: 1, // Online Question paper pass the value as 1 
                }
                const newResponse = await getQuestionPaperList(apiPayload);
                if (newResponse?.data && newResponse?.result?.responseDescription === "Success") {
                    dispatch(Loader(true))
                    dispatch(onlineAssementQpList(newResponse?.data));
                }
            }
            if (response && ((response?.response?.data?.responseCode === 100183) || (response?.response?.data?.responseCode === 100188))) {
                dispatch(SnackbarEventActions({
                    snackbarOpen: true,
                    snackbarType: "error",
                    snackbarMessage: response?.response?.data?.responseDescription,
                }));
                setNewTimeModal(true)
            }
            if (response.response.status == 400) {

                dispatch(SnackbarEventActions({
                    snackbarOpen: true,
                    snackbarType: "error",
                    snackbarMessage: response?.response?.data?.responseDescription,
                }));
            }
        } catch (error) {
            console.error("Error while fetching the queation peaper listing api");
        }
        dispatch(Loader(false));
    }

    useEffect(() => {
        if (selectedQuestion && selectedQuestion?.sections) {
            const sectionDetails = selectedQuestion?.sections;
            const sectionIds = sectionDetails?.map((id: any) => id?.sectionID)
            setSectionType(sectionDetails);
            methods.setValue("sectionId", sectionIds)
        } 
    }, [selectedQuestion]);

    return (
        <>
            <Modal
                open={studentListModal}
                onClose={() => { handleStudentModalCLose() }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <>
                    <FormProvider {...methods} >
                    <form className={[styles.popupBackground].join(" ")} style={{ height: "739px" }}>
                        <div style={{ padding: "25px 40px 0px 40px", width: "100%" }}>
                            <div className={styles.duplicateTestContentParent} style={{ display: "flex", flexDirection: "column" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                                    <div className={styles.duplicateTestContent}>
                                        <h2 className={styles.duplicateOnlineTest}>Assign Question Paper to Students</h2>
                                        <div className={styles.changeSomeDetails}>
                                            Select students you want to assign this question paper to
                                        </div>
                                    </div>
                                    <div className={styles.frameWrapper}>
                                        <img
                                            className={styles.frameChild}
                                            loading="lazy"
                                            alt=""
                                            src={closeIcon}
                                            onClick={() => { handleStudentModalCLose() }}
                                        />
                                    </div>
                                </div>
                                <div style={{ width: "100%" }}>
                                    <Grid container xs={12} spacing={2} pt={2} pb={2} pr={2} pl={0} ml={0} mr={0} width="100%" className="bg-color-white">
                                        <Grid item xs={8} style={{ paddingTop: '8px', }} className="evaluate_searchField">
                                            <TextField id="search-for-student"
                                                name="SearchForStudent"
                                                variant="outlined"
                                                sx={{ width: "100%" }}
                                                onChange={handleStudentSearch}
                                                value={searchStudentQuery}
                                                placeholder="Search for Student"
                                                InputProps={{
                                                    startAdornment: (
                                                        <IconButton>
                                                            <SearchIcon />
                                                        </IconButton>
                                                    ),
                                                    endAdornment: (
                                                        searchStudentQuery &&
                                                        <IconButton onClick={() => setSearchStudentQuery('')}>
                                                            <ClearIcon />
                                                        </IconButton>
                                                    )
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={4} style={{ paddingTop: '8px', }} className="evaluate_searchField">
                                                <DropdownWithCheckbox registerName="sectionId" required={true} value={methods.getValues("sectionId")} variant={'fill'} selectedValue={''} clickHandler={(e: any) => { changeHandler(e, 'section') }} selectLabel={'Section'} disabled={false} selectList={sectionType} mandatory={true} showableLabel={"sectionName"} showableData={"sectionID"} menuHeader={"Select Section"} />

                                        </Grid>
                                    </Grid>
                                    {/* </div> */}

                                    <div className='student-list-main-inner-div'>

                                        <TableContainer sx={{ maxHeight: "440px", height: "440px" }}>
                                            <Table stickyHeader aria-label="sticky table">
                                                <TableHead>
                                                    <TableRow>
                                                        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #E0E0E0" }}>
                                                            <div>
                                                                <TableCell style={{ borderBottom: "none" }}>
                                                                    <Checkbox checked={selectAll} onChange={handleCheckBoxChange} />
                                                                </TableCell>
                                                                <TableCell style={{ borderBottom: "none", maxHeight: "45px", padding: "4px", backgroundColor: "none", cursor: "pointer" }}>
                                                                    <div className='tableHeadArrowSect'>
                                                                        <span
                                                                            className={`resrTableSortArrow questionPaperArrow ${getClassName('firstName')}`}
                                                                            onClick={() => sortToggle('firstName')}
                                                                            style={{ display: "flex", gap: "12px", flexDirection: "row" }}
                                                                        >
                                                                            NAME & CLASS
                                                                            <div className="sorting-img-div">
                                                                                <img width='10px' alt='' src={UPPOLYGON} />
                                                                                <img width='10px' alt='' src={DOWNPOLYGON} />
                                                                            </div>
                                                                        </span>
                                                                    </div>
                                                                </TableCell>
                                                            </div>
                                                            <div>
                                                                <TableCell style={{ cursor: 'pointer', borderBottom: "none", maxHeight: "45px", padding: "4px", backgroundColor: "none" }}>
                                                                    <div className='tableHeadArrowSect' style={{ marginTop: "22px", marginRight: "8px" }}>
                                                                        <span
                                                                            className={`resrTableSortArrow questionPaperArrow ${getClassName('rollNumber')}`}
                                                                            onClick={() => sortToggle('rollNumber')}
                                                                            style={{ display: "flex", gap: "12px", flexDirection: "row" }}

                                                                        >
                                                                            ROLL NUMBER
                                                                            <div className="sorting-img-div">
                                                                                <img width='10px' alt='' src={UPPOLYGON} />
                                                                                <img width='10px' alt='' src={DOWNPOLYGON} />
                                                                            </div>
                                                                        </span>
                                                                    </div>
                                                                </TableCell>
                                                            </div>
                                                        </div>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody sx={{ background: "#fff" }}>
                                                    <TableRow>
                                    {fetchFilteredStudent && fetchFilteredStudent.map((item: any, index) => (
                                        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #E0E0E0", height: "59px" }}>


                                            <div key={index}>
                                                <TableCell style={{ borderBottom: "none", paddingLeft: "16px" }}>
                                                    <Checkbox
                                                        checked={selected.includes(item.studentId)}
                                                        onChange={() => handleIndividualCheckboxChange(index, item.studentId)}
                                                    />
                                                </TableCell>
                                                <TableCell style={{ borderBottom: "none", lineHeight: "initial", padding: "0px" }}>
                                                    <div className="table-name-avatars" style={{ display: "flex", gap: "12px", marginLeft: "12px", alignItems: "center" }}>
                                                        {/* <AvtarSection
                                                            firstName={item?.firstName}
                                                            lastName={item?.lastName}
                                                            profile={item?.photo}
                                                            studentImg={studentImg}
                                                        /> */}
                                                        <Avatar src={item?.photo} />
                                                        <div className="table-name-avatars-title">
                                                            <div>{`${item?.firstName} ${item?.lastName || ''}`}</div>
                                                            {item?.className}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </div>
                                            <div style={{ marginRight: "80px", marginTop: "16px" }}>

                                                <TableCell style={{ borderBottom: "none", lineHeight: "initial", padding: "0px" }}>{item?.rollNumber}</TableCell>
                                            </div>

                                        </div>))}
                                                    </TableRow>

                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </div>

                                </div>
                                <div style={{ display: "flex", gap: "24px", position: "absolute", right: "42px", bottom: "42px" }}>
                                    <ButtonComponent icon={''} image={""} textColor="#1B1C1E" backgroundColor="#01B58A" disabled={false} buttonSize="Medium" type="outlined" label="Cancel" minWidth="150" onClick={() => { handleStudentModalCLose() }} />
                                    <ButtonComponent icon={''} image={""} textColor="#FFFFFF" backgroundColor=" #01B58A" disabled={selected.length === 0} buttonSize="Medium" type="contained" label={"Assign"} minWidth="150" onClick={(() => { handleAssignStudent() })} />
                                </div>
                            </div>
                        </div>
                    </form>
                    {newTimeModal &&
                        <NewAssignTimeModal open={newTimeModal} onClose={handleCloseTimeModal} selectedQuestion={selectedQuestion} questionPaperID={questionPaperID} />
                    }
                    </FormProvider >
                </>
            </Modal>
        </>
    )
}

export default AssignStudentListModal