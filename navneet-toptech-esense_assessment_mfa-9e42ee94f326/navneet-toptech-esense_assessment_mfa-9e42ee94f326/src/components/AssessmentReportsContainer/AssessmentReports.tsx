import React, { useEffect, useRef, useState } from 'react';
import styles from '../QuestionPaperContainer/QuestionPaperAdminTable/QuestionPaperTable.module.css'
import TableStyles from "../QuestionPaperContainer/QuestionPaperAdminTable/QuestionTable.module.css"
import InputFieldComponent from "../../../src/components/SharedComponents/InputFieldComponent/InputFieldComponent";
import { Pagination, Table, AlertColor, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Box from '@mui/material/Box';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import CheckBoxCompleted from "../../../src/components/SharedComponents/CheckBoxComponent/CheckBoxComponent";
import DeleteIcon from '@mui/icons-material/Delete';
import { getReportList } from '../../../src/Api/QuestionTypePaper';
import EmptyScreen from '../../../src/components/SharedComponents/EmptyScreen/EmptyScreen';
import ButtonComponent from '../../../src/components//SharedComponents/ButtonComponent/ButtonComponent';
import Spinner from "../../../src/components/SharedComponents/Spinner/index";
import useDebounce from '../../../src/hooks/useDebounce';
import { Route, Routes , useNavigate } from 'react-router-dom';
import Toaster from '../../../src/components/SharedComponents/Toaster/Toaster';
import AutoGeneration from "../../../src/assets/images/Auto_generation.svg"
import MaualGeneration from "../../../src/assets/images/Manual_generation.svg"
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import DeleteModalComponent from '../SharedComponents/DeleteModalComponent/DeleteModalComponent';
import { Button } from 'react-bootstrap';
import Assessments from './Assessments';

const AssessmentReports = () => {
    const [tableAllRowSelected, setTableAllRowSelected] = useState(false);
    const [value, setValue] = useState<string>('1');
    const [questionpaperData, setQuestionpaperData] = useState([] as any);
    const [tableRowSelected, setTableRowSelected] = useState<number[]>([]);
    const [questionId, setQuestionId] = useState<any>([]);
    const [searchTerm, setSearchTerm] = useState("")
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [bulkDelete, setBulkDelete] = useState(false)
    const deBounceSearchterm = useDebounce(searchTerm, 500)
    const [pgNo, setPgNo] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0)
    const [createnewquespaper, setCreatenewquespaper] = useState(false);
    const [spinnerStatus, setSpinnerStatus] = useState(true);
    const [snackBar, setSnackBar] = useState<boolean>(false);
    const [snackBarText, setSnackBarText] = useState<string>("");
    const [SnackBarSeverity, setSnackBarSeverity] = useState<AlertColor>("success");
    

    let navigate = useNavigate();
    const [anchorElCreatePopup, setAnchorElCreatePopup] = React.useState<HTMLButtonElement | null>(null);
    const [createButtonActionObj, setCreateButtonActionObj] = useState([
        {
            icon: AutoGeneration,
            headerContent: "Auto generation",
            desciption: "Recommended ",
            id: 2,
        },
        {
            icon: MaualGeneration,
            headerContent: "Manual generation",
            desciption: "",
            id: 1
        }
    ])
    const [generationQpId, setGenerationQpId] = useState()


    const buttonPopupHandler = (dataValue: string, dataList: any) => {
        setGenerationQpId(dataList[dataValue].id)
        setAnchorElCreatePopup(null)
        setTimeout(() => {
            setCreatenewquespaper(true)
        }, 200)
    }

    const handleCheck = (checkStatus: boolean, index: number) => {
        let selectedPaper = tableRowSelected;
        if (selectedPaper.includes(index)) {
            selectedPaper = selectedPaper.filter((e: any) => e !== index)
        } else {
            selectedPaper.push(index);
        }
        setTableRowSelected([...selectedPaper]);
        let array = [] as any;
        questionpaperData?.forEach((a: any, i: number) => {
            if (selectedPaper.includes(i)) {
                array.push(a?.id)
            }
        })
        if (array.length > 0) {
            setQuestionId([array]);
        }
    }

    const handleAllCheck = (checkStatus: boolean) => {
        let tableRowList: any = [];
        let tableDataListArray: any = questionpaperData;
        tableDataListArray?.map((data: any, index: number) => {
            checkStatus ? tableRowList.push(data?.statusID != 5 ? index : null) : tableRowList = [];
        })
        setTableRowSelected(tableRowList.filter((x: any) => x != null))
        let array = [] as any;
        questionpaperData?.forEach((a: any, i: number) => {
            array.push(a?.id)
        })
        if (array.length > 0) {
            setQuestionId([array]);
        } else {
            setQuestionId([]);
        }
    }

    useEffect(() => {
        if (tableRowSelected?.length && tableRowSelected?.length === questionpaperData?.map((a: any, i: number) => a?.statusID == 5 ? null : i)?.filter((x: any) => x != null)?.length) {
            setTableAllRowSelected(true)
        } else {
            setTableAllRowSelected(false)
        }
    }, [tableRowSelected])


    const deleteQuestion = () => {
        setBulkDelete(true)
        setDeleteModalOpen(true)
    }
    const deleteQuestionHandler = async () => {
        let res: any;
        
        setDeleteModalOpen(false)
        setBulkDelete(false)
        setTableAllRowSelected(false)
        setTableRowSelected([])
        if (res?.result?.responseCode == 0) {
            setPgNo(0)
            getquestionPaperCall(true)
            setSnackBar(true);
            setSnackBarSeverity('success');
        } else {
            setSnackBar(true);
            setSnackBarSeverity('error');
            setSnackBarText(`Something went wrong!`)
        }
    }

    const getquestionPaperCall = async (pgreset: boolean) => {
        console.log('deBounceSearchterm: ', deBounceSearchterm);
        let postObj = {
            "searchKey":  deBounceSearchterm ? deBounceSearchterm.trim().toLowerCase() : "",
            "pageNo": pgreset ? 0 : pgNo,
            "pageSize": 10,
        }
        const resp = await getReportList(postObj);
        if (resp) {
            let response = resp?.baseResponse?.data
            setQuestionpaperData(response || []);
            setTotalPages(resp?.totalPages)
        }
    }
    const handleShowReportsClick = (event:any)=>{
        console.log("Show Reports Button Clicked!");
    }


    // const [timeoutId, setTimeoutId] = React.useState(null);
    // let newTimeoutId: any;
    useEffect(() => {
        // if (timeoutId) {
        //     clearTimeout(timeoutId);
        // }
        // newTimeoutId = setTimeout(() => {
        getquestionPaperCall(false);
        // }, 500);
        // setTimeoutId(newTimeoutId);
    }, [pgNo, deBounceSearchterm]);

    useEffect(() => {
        setTableAllRowSelected(false)
        setTableRowSelected([])
    }, [pgNo])

    setTimeout(() => {
        setSpinnerStatus(false);
        localStorage.removeItem("qpList_history");
    }, 1500)
    const handleShowReportsButtonClick = (allocationGroupId:number) =>{
        const data={allocationGroupId:allocationGroupId}
        navigate('/assess/assessmentReports/showReports',{state:data})
    }
    return (
        <>
            <div className='questionPaperAcademicTable'>
                {/* <SelectBoxComponent variant={'fill'} selectedValue={academicYearDataSelected} clickHandler={(e: number) => { AcademicYearSelectHandler(e) }} selectLabel={'Academic Year:'} selectList={academicYearDataInfo} mandatory={false} /> */}
            </div>

            <Box className={`${styles.assessmentTabPadd} assessmentTabStyling assessmentReportBlk mt-2`} sx={{ width: '100%' }}>
                <TabContext value={value}>
                    <TabPanel value="1" className="px-0">
                        {questionpaperData?.length == 0 && !searchTerm ?
                            <EmptyScreen emptyBtnTxt={"Create New Question Paper"} title={'You haven’t created any question papers yet'} desc={'Press the button below to create a new question Paper'} onClickBtn={() => setCreatenewquespaper(true)} btnDisable={false} createButtonActionObj={createButtonActionObj} buttonPopupHandler={(param: any, data: any) => { buttonPopupHandler(param, data) }} /> :
                            <>
                                <div className='questionPaperTableSect'>
                                    <div className="searchAndBtn">
                                        <InputFieldComponent label={'Search Question Papers...'} required={false} inputType={"text"} defaultval={searchTerm} onChange={(e: any) => setSearchTerm(e.target.value)} inputSize={"Medium"} variant={"searchIcon"} />

                                    </div>
                                    <div className="questionPaperTableScroll">
                                        <TableContainer className="assessmentTableSect ps-3">
                                            <Table sx={{ width: "100%" }}>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell align='center'>
                                                            <CheckBoxCompleted
                                                                checkLabel="Label"
                                                                disable={false}
                                                                checkStatus={tableAllRowSelected}
                                                                onChangeHandler={handleAllCheck}
                                                            />
                                                        </TableCell>
                                                        <TableCell align='center'>
                                                            Question Paper Name
                                                        </TableCell>
                                                        <TableCell align='center'>
                                                            Question Paper Description
                                                        </TableCell>
                                                        <TableCell align='center'>
                                                            Question Paper ID
                                                        </TableCell>
                                                        <TableCell align='center'>
                                                            Actions
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {questionpaperData?.length > 0 ?
                                                        questionpaperData?.map((dataList: any, index: any) => {
                                                            return (
                                                                <>
                                                                    <TableRow style={{ cursor: "pointer" }}
                                                                        // onClick={(event: any) => {
                                                                        //     if (!!dataList?.allocationGroupID) {
                                                                        //         history(`/evaluationReport`, { state: { allocationGroupID: dataList?.allocationGroupID } })
                                                                        //     }
                                                                        // }}
                                                                        key={index}>
                                                                        <TableCell align='center'>
                                                                            <CheckBoxCompleted
                                                                                checkLabel="Label"
                                                                                disable={(dataList?.statusID == 5) ? true : false}
                                                                                checkStatus={tableRowSelected.includes(index)}
                                                                                onChangeHandler={(e: any) => handleCheck(e, index)}
                                                                            />
                                                                        </TableCell>
                                                                        <TableCell align='center'>
                                                                            {dataList?.questionPaperName}
                                                                        </TableCell>
                                                                        <TableCell align='center'>{dataList.questionPaperDescription}</TableCell>
                                                                        <TableCell align='center'>{dataList.questionPaperID}</TableCell>
                                                                        <TableCell align='center'>
                                                                            <ButtonComponent
                                                                            image={''}
                                                                            textColor=''
                                                                            backgroundColor='#01B58A'
                                                                            buttonSize='Medium'
                                                                            type='contained'
                                                                            onClick={() => {handleShowReportsButtonClick(dataList.allocationGroupID)}}
                                                                            label='Show Reports'
                                                                            minWidth='100'
                                                                            />
                                                                        </TableCell>
                                                                    </TableRow>
                                                                </>
                                                            )
                                                        }) : (
                                                            <TableRow>
                                                                <TableCell colSpan={7}>
                                                                    <div
                                                                        className=""
                                                                        style={{ textAlign: "center" }}
                                                                    >
                                                                        {"No Match Found"}
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        )}
                                                </TableBody>
                                            </Table>

                                        </TableContainer>
                                    </div>
                                    <DeleteModalComponent open={deleteModalOpen} onClose={() => { setDeleteModalOpen(false); setBulkDelete(false) }} descriptionText={`${(tableRowSelected?.length > 1 && bulkDelete) ? `You selected ${tableRowSelected?.length} Question papers which will be deleted from the list,do you wish to continue?` : 'Selected Question paper will be deleted from the list, do you wish to continue?'}`} title={`Delete ${(tableRowSelected?.length > 1 && bulkDelete) ? tableRowSelected?.length.toString() + ' Question Papers?' : 'Question Paper?'}`} deleteHandler={deleteQuestionHandler} />
                                    {tableRowSelected.length > 0 &&
                                        <div className={TableStyles.tableFooter}>
                                            <h4 className='fontW800 mb-0'>{tableRowSelected.length} Question Paper{tableRowSelected.length > 1 ? "s" : ""} Selected</h4>
                                            <ButtonComponent icon={<DeleteIcon />} image={""} textColor="#9A9A9A" backgroundColor="#01B58A" disabled={false} buttonSize="" type="transparent" onClick={deleteQuestion} label={`Delete Question Paper${tableRowSelected.length > 1 ? "s" : ""}`} minWidth="" hideBorder={true} />
                                        </div>
                                    }
                                </div>
                                <div className="assessPagenation" style={{ display: "flex", justifyContent: "start", paddingTop: "1rem" }}>
                                    <Pagination
                                        count={totalPages}
                                        page={pgNo + 1}
                                        onChange={(e, p: number) => {
                                            setPgNo(p - 1);
                                            // setSupportPg(true)
                                        }}
                                        shape="rounded"
                                    />
                                </div>
                            </>
                        }
                    </TabPanel>
                </TabContext>
            </Box>
            
            {spinnerStatus && <Spinner />}
            <Toaster onClose={() => { setSnackBar(false) }} severity={SnackBarSeverity} text={snackBarText} snakeBar={snackBar} />


        </>
    )
}

export default AssessmentReports