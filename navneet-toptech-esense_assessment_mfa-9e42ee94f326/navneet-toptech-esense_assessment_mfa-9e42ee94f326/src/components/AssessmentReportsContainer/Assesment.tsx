import React, { useEffect, useState } from 'react';
// import './AssessmentReports.css';
import { Collapse, IconButton, Pagination, Table, AlertColor, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import CheckBoxCompleted from "../../../src/components/SharedComponents/CheckBoxComponent/CheckBoxComponent";
import { getAssesmentAllocationtList } from '../../Api/QuestionTypePaper';
import { useLocation, useNavigate } from 'react-router';
import ButtonComponent from '../SharedComponents/ButtonComponent/ButtonComponent';
import * as XLSX from 'xlsx'
import FileSaver from 'file-saver'
import moment from 'moment'

const Assessment = () => {
    const [tableAllRowSelected, setTableAllRowSelected] = useState(false);
    const [questionpaperData, setQuestionpaperData] = useState([] as any);
    const [tableRowSelected, setTableRowSelected] = useState<number[]>([]);
    const [questionId, setQuestionId] = useState<any>([]);
    const location = useLocation()
    const history = useNavigate();

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

    const getassessmentReport=async()=>{
        const response = await getAssesmentAllocationtList(location.state.allocationGroupID)
        if(response){
            setQuestionpaperData(response?.data?.questionMetaInfoObjects || [])
        }
    }

    useEffect(() => {
        if (tableRowSelected?.length && tableRowSelected?.length === questionpaperData?.map((a:any,i:number)=> a?.statusID == 5 ? null : i)?.filter((x:any) => x != null)?.length) {
            setTableAllRowSelected(true)
        } else {
            setTableAllRowSelected(false)
        }
    }, [tableRowSelected])
    useEffect(()=>{
        if(!!location.state.allocationGroupID){
            getassessmentReport()
        }
    },[location.state.allocationGroupID])

    const handleDownload=()=>{
        const selectedData = tableRowSelected.length ? questionpaperData.filter((_:any, index:any) => tableRowSelected.includes(index)): questionpaperData;

        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(selectedData);
        const workbook: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');
        const excelBuffer: Uint8Array = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob: Blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const currentDateTime = moment().format('DD-MM-YYYY HH_mm_ss');
        FileSaver.saveAs(blob, `Assessment Report ${currentDateTime}.xlsx`);
    }

  return (
        <>
            {questionpaperData?.length>0 &&
                <>
                    <div className='questionPaperTableMainSectReports'>
                        <div style={{display:'flex', justifyContent: 'space-between'}}>
                        <ButtonComponent type={'contained'} label={'Go Back'} textColor="white" backgroundColor="#01B58A" buttonSize={'Medium'} minWidth={'150'} onClick={()=>  history('/assess/assessmentReports')}/>
                        <ButtonComponent type={'contained'} label={'Download'} textColor="white" backgroundColor="#01B58A" buttonSize={'Medium'} minWidth={'160'} onClick={handleDownload} />
                        </div>
                        <div className="assessmentTableSectRepot mt-3">
                            <TableContainer className="assessmentTableSectReport">
                                <Table stickyHeader aria-label="sticky table" sx={{ width: "100%" }}>
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
                                            Question Id
                                            </TableCell>
                                            <TableCell align='center'>
                                            Total Skipped Count
                                            </TableCell>
                                            <TableCell align='center'>
                                            Total Revised Count
                                            </TableCell>
                                            <TableCell align='center'>
                                            Total InCorrect Count
                                            </TableCell>
                                            <TableCell align='center'>
                                            Total Correct Count
                                            </TableCell>
                                            <TableCell align='center'>
                                            Total Attempted Count
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {questionpaperData?.length > 0 ?
                                            questionpaperData?.map((dataList: any, index: any) => {
                                                return (
                                                    <>
                                                        <TableRow style={{ cursor: "pointer" }}
                                                            key={index}>
                                                            <TableCell align='center'>
                                                                <CheckBoxCompleted
                                                                    checkLabel="Label"
                                                                    disable={false}
                                                                    checkStatus={tableRowSelected.includes(index)}
                                                                    onChangeHandler={(e: any) => handleCheck(e, index)}
                                                                />
                                                            </TableCell>
                                                            <TableCell align='center'>{dataList?.questionId}</TableCell>
                                                            <TableCell align='center'>{dataList.totalSkippedCountByStudents}</TableCell>
                                                            <TableCell align='center'>{dataList.totalRevisedCountByStudents}</TableCell>
                                                            <TableCell align='center'>{dataList.totalInCorrectCountByStudents}</TableCell>
                                                            <TableCell align='center'>{dataList.totalCorrectCountByStudents}</TableCell>
                                                            <TableCell align='center'>{dataList.totalAttemptedCountByStudents}</TableCell>
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
                    </div>
                </>    
            }
        </>
    )
                    
}
export default Assessment