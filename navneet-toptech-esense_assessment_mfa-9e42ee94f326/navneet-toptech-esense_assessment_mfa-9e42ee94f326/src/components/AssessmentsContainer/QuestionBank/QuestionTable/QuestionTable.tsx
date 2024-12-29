import { AlertColor, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import React, { useEffect, useState,useRef } from 'react';
import UpPolygon from "../../../../assets/images/UpPolygon.svg";
import Polygon from "../../../../assets/images/Polygon.svg";
import ActionButtonComponent from '../../../SharedComponents/ActionButtonComponent/ActionButtonComponent';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import styles from "./QuestionTable.module.css"
import CheckBoxCompleted from "../../../SharedComponents/CheckBoxComponent/CheckBoxComponent"
import ButtonComponent from '../../../SharedComponents/ButtonComponent/ButtonComponent';
import DeleteIcon from '@mui/icons-material/Delete';
import { Question } from '../../../../interface/filters';
import DeleteModalComponent from '../../../SharedComponents/DeleteModalComponent/DeleteModalComponent';
import { deleteApi, getQuestionApi } from '../../../../Api/AssessmentTypes';
import Toaster from '../../../SharedComponents/Toaster/Toaster';
import Spinner from '../../../SharedComponents/Spinner';
import PreviewModalComponent from '../../CreateNewQuestion/PreviewModalComponent/PreviewModalComponent';
import { useNavigate } from 'react-router';
import { getLocalStorageDataBasedOnKey, htmlTagRegex, removeNbpsRegex } from '../../../../constants/helper';
import PreviewModalImage from '../../CreateNewQuestion/PreviewModalComponent/PreviewModalImage';
interface Props {
    questionData: Question[],
    searchKey: string,
    getAllQuestionswithFilter?:any,
    setPageNumber?: any ;
    pageCount?:number;
    pageNumber?:any;
    accessFilter?:any;
    qbListHistoryHandler?:()=>void
    allFilters?:any;
}
interface ScrollType {
    current: any
    [key: string]: any
}

const QuestionTable: React.FC<Props> = ({qbListHistoryHandler,questionData,searchKey,getAllQuestionswithFilter,pageCount,setPageNumber,pageNumber,accessFilter,allFilters}) => {    
    const navigate = useNavigate()
    const tableScroll: ScrollType = useRef();
    const [searchText, setSearchText] = useState<string>()
    const [openPreview, setOpenPreview] = useState<boolean>(false)
    const [tableData, setTableData] = useState<Question[]>([])
    const [tableRowSelected, setTableRowSelected] = useState<number[]>([])
    const [tableAllRowSelected, setTableAllRowSelected] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [bulkDelete, setBulkDelete] = useState(false)
    const [questionId, setQuestionId] = useState<Number | null>(null);
    const [questionText, setQuestionText] = useState<string>("");
    const [snackBar, setSnackBar] = useState<boolean>(false);
    const [snackBarText, setSnackBarText] = useState<string>("");
    const [SnackBarSeverity, setSnackBarSeverity] = useState<AlertColor>("success");
    const [spinnerStatus, setSpinnerStatus] = useState(false);
    const [selectedData, setSelectedData] = useState({})
    const [selectedRow, setSelectedRow] = useState<any>([])
    const [sortMarksToggle,setSortMarksToggle]=useState<string>("");
    const [questionToggle,setQuestionToggle]=useState<string>("");
    const [openPreviewImg, setOpenPreviewImg] = useState<boolean>(false)
    const [imgContent, setImgContent] = useState<string>("")
    const handleEdit = (data: any) => {
        navigate(
            '/assess/editnewquestion',
            {
                state: {
                    data: data
                }
            }
        )
    }
    const duplicateQuestion=(data:any)=>{
        navigate(
            '/assess/duplicateQuestion',
            {
                state: {
                    data: data
                }
            }
        )
    }

    const handleCheck = (checkStatus: boolean, index: number) => {
        let tableRowList = JSON.parse(JSON.stringify(tableRowSelected));
        if (tableRowList.includes(index)) {
            tableRowList = tableRowList.filter((e: any) => e !== index)
        } else {
            tableRowList.push(index)
        }
        setTableRowSelected(tableRowList)
        let array = [] as any;
        tableData?.forEach((a:any,i:number)=>{
             if(tableRowList.includes(i)){
                array.push(a?.id)
             }
        })
    };

    const filterTableData = (searchText: any) => {
        let tableDataObj = JSON.parse(JSON.stringify(tableData));
        // tableDataObj = tableDataObj.filter((d: any) => )
    }

    const handleAllCheck = (checkStatus: boolean) => {
        let tableRowList: any = [];
        var tableDataListArray = JSON.parse(JSON.stringify(tableData));
        tableDataListArray?.filter((a:any,i:number)=>JSON.parse(getLocalStorageDataBasedOnKey('state') as string)?.login?.userData?.userId === a?.createdBy).map((data: any, index: number) => {
            data.select = checkStatus;
            data.Marks = 40;
            checkStatus ? tableRowList.push(index) : tableRowList = [];
        })
        setTableData(tableDataListArray)
        setTableRowSelected(tableRowList)
    }
    const deleteQuestion = () => {
        setBulkDelete(true)
        setDeleteModalOpen(true)
    }

    /*To maintain the status of Select all button*/
    useEffect(() => {
        if (tableRowSelected?.length && tableRowSelected?.length === tableData?.filter((a:any,i:number)=>JSON.parse(getLocalStorageDataBasedOnKey('state') as string)?.login?.userData?.userId === a?.createdBy)?.length) {
            setTableAllRowSelected(true)
        } else {
            setTableAllRowSelected(false)
        }
    }, [tableRowSelected])

    useEffect(() => {
        filterTableData(searchText)
    }, [searchText])


    /*To maintain the status of Each checkbox when getting TableData */
    useEffect(() => {
        const initalSelected: number[] = []
        tableData.forEach((ele: any, index: number) => {
            if (ele.select === true) {
                initalSelected.push(index)
            }
        })
        setTableRowSelected(initalSelected)
    }, [tableData])

    useEffect(() => {
        setSearchText(searchKey)
    }, [])

    const deleteQuestionHandler = async (data: any) => {
        setSpinnerStatus(true)
        let res = await deleteApi(!bulkDelete ? questionId : tableData.filter((e:any,i:any) => tableRowSelected.includes(i)).map((a:any,i:any)=> a?.id).toString());
        if ((res?.result?.responseCode == 0 || res?.result?.responseDescription === "Success")) {
            setSnackBar(true);
            setSnackBarSeverity('success');
            setSnackBarText(`Question deleted successfully`)
            setDeleteModalOpen(false)
            setSpinnerStatus(false)
            setTableRowSelected([])
            setTableAllRowSelected(false)
            setBulkDelete(false)
            await getAllQuestionswithFilter();
        } else {
            setSnackBar(true);
            setSnackBarSeverity('error');
            setSnackBarText(`something went wrong`)
            setDeleteModalOpen(false)
            setSpinnerStatus(false)
            setTableRowSelected([])
            setTableAllRowSelected(false)
            setBulkDelete(false)
        }
    }

    const getKeyHandler = (d: any) => {
        setQuestionId(d?.id)
        setQuestionText(d?.question)
    }
        
    useEffect(() => {   
        if(questionData?.length > 0){
            setTableData(questionData)
        }else{
            setTableData([])
        }    
    }, [questionData])  

    const removeTagsFromString =(str:any) =>{
        if ((str===null) || (str===''))
            return false;
        else
        str = str.toString();
        return str.replace(/<[^>]*>/g, '');
    }
    const handleMarksToggle = (type: string, module: string) => {
        if (type === "asc") {
            if (module === "marks") {
                setSortMarksToggle("asc")
            }
            else {
                setQuestionToggle("asc")
            }
        }
        else if (type === "desc") {
            if (module === "marks") {
                setSortMarksToggle("desc")
            }
            else {
                setQuestionToggle("desc")
            }
        }
        else {
            setSortMarksToggle("");
        }
    }

    (window as any).handleClick = (key: any, event: any) => {
        setTimeout(()=>{
            setOpenPreview(false)
        },1)
        setOpenPreviewImg(true)
        setImgContent(key)
    };

    const getQuestionTitle = (dataList: any) => {
        let str = dataList?.question;
        
        if (str.includes("{{") || str.includes("<img")) {
            dataList?.questionImageDetails?.forEach((questionImage: any) => {
                let replaceImageKey = str.replace(`{{${questionImage?.key}}}`, "") //Replace Image uploadPath with empty string
                let removedHtmlTags = replaceImageKey.replace(/(<([^>]+)>)/gi, "") //Remove all HTML tags & get only words
                if (removedHtmlTags.trim() == "") {
                    str = `<span class="listImageTag" onclick="handleClick('${questionImage?.src}')">${questionImage?.tag}</span>`
                } else {
                    str = replaceImageKey
                }
            });
        }
        return str;
      };

    useEffect(() => {
        if (sortMarksToggle != "") {
            accessFilter(sortMarksToggle, "marks")
        }
    }, [sortMarksToggle])
    useEffect(() => {
        if (questionToggle != "") {
            accessFilter(questionToggle, "questions")
        }
    }, [questionToggle])
    return (
        <div className={`${styles.questionBankContSect} ${tableRowSelected.length > 0 ? styles.questionBankFooterAdded : ""}`} ref={tableScroll} >
            <div className={styles.questionBankContScroll}>
                <TableContainer className="assessmentTableSect" >
                    <div style={{ padding: "10px 20px 20px 20px" }}>
                        <Table sx={{ width: "100%" }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ width: "70px", textAlign: 'center' }}>
                                        <CheckBoxCompleted
                                            checkLabel="Label"
                                            disable={false}
                                            checkStatus={tableAllRowSelected}
                                            onChangeHandler={handleAllCheck}                                            
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className='tableHeadArrowSect'>
                                            Questions
                                            {/* <span className={`resrTableSortArrow`}>
                                                <img
                                                    width="10px"
                                                    alt=""
                                                    src={UpPolygon}
                                                    style={questionToggle==="desc"?{opacity:"1"}:{}}
                                                    onClick={()=>handleMarksToggle("desc","question")}
                                                />
                                                <img
                                                    width="10px"
                                                    alt=""
                                                    src={Polygon}
                                                    style={questionToggle==="asc"?{opacity:"1"}:{}}
                                                    onClick={()=>handleMarksToggle("asc","question")}
                                                />
                                            </span> */}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className='tableHeadArrowSect'>
                                            created by
                                            {/* <span className={`resrTableSortArrow activeUpArrow`}>
                                                <img
                                                    width="10px"
                                                    alt=""
                                                    src={UpPolygon}
                                                   
                                                />
                                                <img
                                                    width="10px"
                                                    alt=""
                                                    src={Polygon}
                                                    
                                                />
                                            </span> */}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className='tableHeadArrowSect'>
                                            Question Type
                                            {/* <span className={`resrTableSortArrow activeUpArrow`}>
                                                <img
                                                    width="10px"
                                                    alt=""
                                                    src={UpPolygon}
                                                />
                                                <img
                                                    width="10px"
                                                    alt=""
                                                    src={Polygon}
                                                />
                                            </span> */}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className='tableHeadArrowSect'>
                                            Marks
                                            <span className={`resrTableSortArrow`}>
                                                <img
                                                    width="10px"
                                                    alt=""
                                                    src={UpPolygon}
                                                    style={sortMarksToggle==="desc"?{opacity:"1"}:{}}
                                                    onClick={()=>handleMarksToggle("desc","marks")}
                                                />
                                                <img
                                                    width="10px"
                                                    alt=""
                                                    src={Polygon}
                                                    style={sortMarksToggle==="asc"?{opacity:"1"}:{}}
                                                    onClick={()=>handleMarksToggle("asc","marks")}
                                                />
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell style={{ width: "170px" }}>
                                        <div className='tableHeadArrowSect'>
                                            Actions
                                        </div>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tableData?.map((dataList: any, index: any) => {
                                    return(
                                    <TableRow style={{cursor: "pointer"}} onClick={() => { setTimeout(()=>{setOpenPreview(true)},0); setSelectedData(dataList)}}>
                                        <TableCell style={{ width: "70px", textAlign: 'center' }}>
                                            <CheckBoxCompleted
                                                checkLabel="Label"
                                                disable={(JSON.parse(getLocalStorageDataBasedOnKey('state') as string)?.login?.userData?.userId === dataList?.createdBy) ? false : true}
                                                checkStatus={tableRowSelected.includes(index)}
                                                onChangeHandler={(e: any) => handleCheck(e, index)}                                               
                                            />
                                        </TableCell>
                                        <TableCell>
                                        <Tooltip title={getQuestionTitle(dataList).replace(htmlTagRegex, "").replace(removeNbpsRegex,"")} placement="bottom-start">
                                            <p className={`mb-0 pe-3 ${styles.ellipseText}`} title={removeTagsFromString(getQuestionTitle(dataList))} dangerouslySetInnerHTML={{ __html: getQuestionTitle(dataList).replaceAll("color:#f00", "color:#000000")}}></p>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell>                                            
                                            {dataList?.createdByUser}
                                        </TableCell>
                                        <TableCell>
                                            {dataList?.questionTypeWithTemplate.replace(htmlTagRegex, "")}
                                        </TableCell>
                                        <TableCell>
                                            {dataList?.marks}
                                        </TableCell>
                                        <TableCell>
                                            <div className={styles.actionBtnSect}>
                                                <ActionButtonComponent disableBtn={JSON.parse(getLocalStorageDataBasedOnKey('state') as string)?.login?.userData?.userId === dataList?.createdBy ? false : true} dataList={dataList} modalOpen={(param: boolean) => setDeleteModalOpen(param)} getKeyId={(a: any) => getKeyHandler(a)} editKey={(e: any) => {qbListHistoryHandler&&qbListHistoryHandler();handleEdit(e)}} duplicateKey={(e: any) => {qbListHistoryHandler&&qbListHistoryHandler();duplicateQuestion(e)}} isActive={dataList?.questionTypeActive && (dataList?.questionTypeName == 'Comprehensive' ? dataList?.isSubQuestionTypeActive : true)} disableKey={[]}/>
                                                <KeyboardArrowRightIcon />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )})
                                }
                            </TableBody>
                        </Table>
                    </div>
                </TableContainer>
            </div>
            {tableRowSelected.length > 0 &&
                <div className={styles.tableFooter}>
                    <h4 className='fontW800 mb-0'>{tableRowSelected.length} Question{tableRowSelected.length > 1 ? "s" : ""} Selected</h4>
                    <ButtonComponent icon={<DeleteIcon />} image={""} textColor="#9A9A9A" backgroundColor="#01B58A" disabled={false} buttonSize="" type="transparent" onClick={deleteQuestion} label={`Delete Question${tableRowSelected.length > 1 ? "s" : ""}`} minWidth="" hideBorder={true} />
                </div>
            }
            {openPreviewImg && <PreviewModalImage header={''} openPreview={openPreviewImg} setOpenPreview={setOpenPreviewImg} content={imgContent} setContent={setImgContent} />}
            {openPreview && <PreviewModalComponent qbListHistoryHandler={qbListHistoryHandler} header={''} modelOpen={true} setOpenPreview={setOpenPreview} selectedData={selectedData} allFilters={allFilters} />}
            <DeleteModalComponent open={deleteModalOpen} onClose={() => { setDeleteModalOpen(false); setBulkDelete(false) }} descriptionText={`${(tableRowSelected?.length > 1 && bulkDelete) ? `You selected ${tableRowSelected?.length} Questions which will be deleted from the list for everyone,do you wish to continue?` : 'Selected Question will be deleted from the list for everyone, do you wish to continue?' }`} title={`Delete ${(tableRowSelected?.length > 1 && bulkDelete) ? tableRowSelected?.length.toString() + ' Questions?' : 'Question?'}`} deleteHandler={deleteQuestionHandler}/>
            <Toaster onClose={() => { setSnackBar(false) }} severity={SnackBarSeverity} text={snackBarText} snakeBar={snackBar} />
            {spinnerStatus && <Spinner />}
        </div>
    );
};

export default QuestionTable;