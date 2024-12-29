import React, { useEffect, useState } from 'react';
import './MIFQuestionPaperTable.css';
import styles from './MIFQuestionPaperTable.module.css'
import TableStyles from "./MIFQuestionTable.module.css"
import InputFieldComponent from "../../SharedComponents/InputFieldComponent/InputFieldComponent";
import { Collapse, IconButton, Pagination, Table,AlertColor, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import CheckBoxCompleted from "../../SharedComponents/CheckBoxComponent/CheckBoxComponent";
import AddIcon from '@mui/icons-material/Add';
import UpPolygon from "../../../assets/images/UpPolygon.svg";
import Polygon from "../../../assets/images/Polygon.svg";
import ActionButtonComponent from "../../SharedComponents/ActionButtonComponent/ActionButtonComponent";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import DeleteIcon from '@mui/icons-material/Delete';
import { tabElement } from '../../../constants/urls';
import MultiSelectComponentforFilters from '../../SharedComponents/MultiSelectComponent/MultiSelectComponentNew';
import { getQuestionPaperList, QuestionPaperTypeapi, QuestionPaperModeApi, delQuestionPaperApi, GetQuestionPaperAcademicId, delSetQuestionPaperApi } from '../../../Api/QuestionTypePaper';
import DeleteModalComponent from '../../SharedComponents/DeleteModalComponent/DeleteModalComponent';
import { getLocalStorageDataBasedOnKey } from '../../../constants/helper';
import { State } from '../../../types/assessment';
import { baseFilterApi, baseGradeApi } from '../../../Api/AssessmentTypes';
import EmptyScreen from '../../SharedComponents/EmptyScreen/EmptyScreen';
import MultiSelectComponent from '../../SharedComponents/MultiSelectComponent/MultiSelectComponent';
import CreateNewQuestionPaperModal from '../../SharedComponents/QuestionPaperSharedComponent/CreateNewQuestionPaperModal/CreateNewQuestionPaperModal';
import QuestionPaperIcon from '../../../assets/images/QuestionPaperIcon.svg';
import QuestionPaperIconwithApprove from "../../../assets/images/QuestionPaperIconwithApprove.svg";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import offline from "../../../assets/images/offline.svg";
import Desktop from "../../../assets/images/Desktop.svg";
import ButtonComponent from '../../SharedComponents/ButtonComponent/ButtonComponent';
import Spinner from "../../SharedComponents/Spinner/index";
import ButtonColorComponent from '../../SharedComponents/ButtonColorComponent/ButtonColorComponent';
import useDebounce from '../../../hooks/useDebounce';
import { ReactComponent as Chevrondown } from "../../../assets/images/chevrondown.svg";
import { useLocation, useNavigate } from 'react-router-dom';
import PointFilter from '../../AssessmentsContainer/pointerFilter';
import Toaster from '../../SharedComponents/Toaster/Toaster';
import SelectBoxComponent from '../../SharedComponents/SelectBoxComponent/SelectBoxComponent';
import { Buffer } from 'buffer';

const QuestionPaperTable = () => {
    const [tableAllRowSelected, setTableAllRowSelected] = useState(false);
    const [value, setValue] = useState<string>('1');
    const [questionpaperData, setQuestionpaperData] = useState([] as any);
    const [tableRowSelected, setTableRowSelected] = useState<number[]>([]);
    const [questionId, setQuestionId] = useState<any>([]);
    const [searchTerm, setSearchTerm] = useState("")
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [bulkDelete, setBulkDelete] = useState(false)
    const [grade,setGrade]=useState<any>([])
    const [subjectFilter,setSubjectFilter] = useState<any>([])
    const [questionpapermode,setQuestionpapermode] = useState<any>([])
    const [questionpaperstatus,setQuestionpaperstatus] = useState<any>([])
    const [QuestionPaperType,setQuestionPaperType]= useState<any>([])
    const deBounceSearchterm = useDebounce(searchTerm, 500)
    const [pgNo,setPgNo]=useState<number>(0);
    const [totalPages,setTotalPages]=useState<number>(0)
    const stateDetails = JSON.parse(getLocalStorageDataBasedOnKey('state') as string) as State;
    const [createnewquespaper, setCreatenewquespaper] = useState(false);
    const [showgoback,setshowgoBack]= useState(false);
    const [spinnerStatus, setSpinnerStatus] = useState(false);
    const [snackBar, setSnackBar] = useState<boolean>(false);
    const [snackBarText, setSnackBarText] = useState<string>("");
    const [SnackBarSeverity, setSnackBarSeverity] = useState<AlertColor>("success");
    const [sortDetails, setSortDetails] = useState({
        sortColName: "",
        sortColOrder: ""
    });
    const [academicYearData, setAcademicYearData] = useState<any>({});
    const [academicYearDataInfo, setAcademicYearDataInfo] = useState([]);
    const [academicYearDataSelected, setAcademicYearDataSelected] = useState("")
    const [delSet,setDel]=useState<any>({set:null,parentId:null})
    const [openDel,setOpenDel]=useState<boolean>(false)
    let history = useNavigate();
    const [allFilters,setAllFilters]=useState({
        gradeId: "",
        subjectId: "",
        questionPaperTypeId:"", 
        minMarks:"",
        maxMarks:""
    })
    const cloneObj = {
        gradeId: "",
        subjectId: "",
        questionPaperTypeId:"", 
        minMarks:"",
        maxMarks:""
    } as any;
    const [minMaxCall,setMinMaxCall]=useState<boolean>(false)
    const [expanded, setExpanded] = useState(false)
    const [multifileID, setMultifileID] = useState(null)
     const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue)
    };
    const [subList,setSubList]=useState<any>([])

    const sortToggle = (data: string) => {
        const sortdata: any = {
            sortColName: data,
            sortColOrder: sortDetails.sortColOrder === "Asc" ? "Desc" : "Asc",
        };
        setSortDetails(sortdata);
    }
    const getClassName = (key: string) => {
        if (key === sortDetails.sortColName) {
          return sortDetails.sortColOrder === "Asc"
            ? "activeUpArrow"
            : "activeDownArrow";
        }
        return "";
      }

    const handleGetGrade =async () =>{
        try {
            const response = await baseGradeApi("grade", stateDetails.login.userData.userRefId)
            if (response?.status === "200") {
                setGrade(response?.data)
        }
        } catch (err) {
            console.log(err)
        }
    }

    const handleQuestionPaperMode = async () =>{
        const mode = await QuestionPaperModeApi();
        if(mode?.length>0){
            setQuestionpapermode(mode)
        }else{
            setQuestionpapermode([]);
        }
    }
    
    let findDuplicates = (arr:any) => arr.filter((item:any, index:any) => arr.indexOf(item) !== index)

    const getSubjectByApi=async()=>{
        const gradePostObj={
           "gradeIds": allFilters?.gradeId?.split(",").map((e:any)=>+e)
        }
        const response = await baseFilterApi("subjects", { "gradeId": gradePostObj.gradeIds ,"staffId":stateDetails.login.userData.userRefId ,"publicationId": 0 })
        const courseList= response?.data?.map((x:any)=>x.courseName)
        const dupli=findDuplicates(courseList)
        if(dupli.length >0){
            const newSearchValue=response?.data?.map((item:any)=>{if(dupli?.includes(item?.courseName)){
                return({...item,"courseName":`${item.courseName}(${item.grade})`})
              }else{
                return item
              }})
        setSubjectFilter(newSearchValue)
        }else{
            setSubjectFilter(response?.data)
        }
        // setAllFilters({...allFilters, subjectId: "" })
    }


    const updateUser = (data: any,filter:string) => {
        switch (filter) {
            case "gradeId":
                let gradeFilter = ""
                data.forEach((ele: number) => {gradeFilter += `${ele},`})
                setAllFilters({...allFilters, gradeId: gradeFilter.slice(0,-1),subjectId:'' })
                break;
            case "subjectId":
                let subFilter = ""
                data.forEach((ele: number) => { subFilter += `${ele},` })
                setAllFilters({ ...allFilters, subjectId: subFilter.slice(0, -1) })
                break;  
            case "questionPaperTypeId":
                let typeFilter = ""
                data.forEach((ele: number) => { typeFilter += `${ele},` })
                setAllFilters({ ...allFilters, questionPaperTypeId: typeFilter.slice(0, -1) })
                break;
        }
    }

    const handleButtonClick = () => {
        console.log("buttonclick");
    }

    const handleEdit = (data: any) => { 
       history(`/printForPreview?${data?.id}`, {state:true})
    }

    const handleDuplicate = async (data: any) => {               
        history(`/questionapaperotp1`, { state: data })
    }

    const hanldecreatequestionpaper = () =>{
        setCreatenewquespaper(true);
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
        questionpaperData?.forEach((a:any,i:number)=>{
            if(selectedPaper.includes(i)){
               array.push(a?.id)
            }
      })
       if(array.length>0){
        setQuestionId([array]);
       }
    }

    const handleAllCheck = (checkStatus: boolean) => {
        let tableRowList: any = [];
        let tableDataListArray: any = questionpaperData;
        tableDataListArray?.map((data: any, index: number) => {
            checkStatus ? tableRowList.push(index) : tableRowList = [];
        })
        setTableRowSelected(tableRowList)
        let array = [] as any;
        questionpaperData?.forEach((a: any, i: number) => {
            array.push(a?.id)
        })
        if (array.length > 0) {
            setQuestionId([array]);
            setTableAllRowSelected(true)
        }else{
            setTableAllRowSelected(false)
        }
    }


    const deleteQuestion = () => {
        setBulkDelete(true)
        setDeleteModalOpen(true)
    }

    const getKeyHandler = (data: any) => {
        setQuestionId(data?.id)
    }
  const qpSetDelHandler=(setId:any,parentID:any)=>{
       setOpenDel(true)
       setDel({set:setId?.id,parentId:parentID}) 
  }
    const maxGreatMin=( +allFilters?.maxMarks >+allFilters?.minMarks || +allFilters?.minMarks == +allFilters?.maxMarks)?true:false;
    const mincondiCheck=allFilters?.minMarks && +allFilters?.minMarks>0 && (maxGreatMin)?true:false;
    const maxcondiCheck=allFilters?.maxMarks && +allFilters?.maxMarks>0 &&(maxGreatMin)?true:false;

    const minMaxApiHandler=()=>{
        if(minMaxCall){
           if(mincondiCheck && maxcondiCheck){
            return false
           }else{
            return true
           }
        }else{
            return false
        }
    }
    const getquestionPaperCall = async (pgreset:boolean) => {
        const markHandler=minMaxApiHandler();
        if(!markHandler){
        let postObj = {
            "gradeIds": allFilters.gradeId ?allFilters.gradeId?.split(",")?.map((e:any) => +e) : [],
            "courseIds": allFilters.subjectId ? allFilters.subjectId?.split(",")?.map((e: any) => +e) : [],
            "searchKey": deBounceSearchterm ? Buffer.from(deBounceSearchterm.trim()).toString('base64') : "",
            "sortKeyName": sortDetails?.sortColName || "",
            "sortKeyOrder": sortDetails?.sortColOrder || "",
            "questionPaperTypeId": allFilters.questionPaperTypeId ? allFilters.questionPaperTypeId?.split(",")?.map((e:any) => + e):[],
            "questionPaperStatus": "",
            "pageNo": pgreset?0:pgNo,
            "pageSize":10,
            "minMarks":mincondiCheck?allFilters?.minMarks:"",
            "maxMarks": maxcondiCheck?allFilters?.maxMarks:"",
            "academicYearIds":academicYearData[academicYearDataSelected]?.acadamicId ? academicYearData[academicYearDataSelected]?.acadamicId : ""
        }
        setSpinnerStatus(true);
        if(academicYearData[academicYearDataSelected]?.acadamicId){
            const resp = await getQuestionPaperList(postObj);
            if (resp) {
                let response = resp?.baseResponse?.data
                           setQuestionpaperData(response || []);
                //setQuestionpaperData([]);
                setTotalPages(resp?.totalPages)
                // setPgNo(resp?.pageNo)
            }
            setSpinnerStatus(false);
        }        
        
    }
    }
    const deleteQuestionHandler = async () => {
        let res:any;
        if(openDel){
            setOpenDel(false)
            res= await delSetQuestionPaperApi(delSet?.parentId,delSet?.set)
            if(res?.result?.responseCode == 0){
                setSnackBarText('Question paper has been deleted');
                setSubList([])
                setExpanded(false)
                setMultifileID(null)
            }
        }else{
             res= await delQuestionPaperApi(questionId)
             if(res?.result?.responseCode == 0){
                 setSnackBarText(`${(tableRowSelected?.length && bulkDelete) ? `${tableRowSelected?.length} Question papers has been deleted`: `${questionpaperData?.find((x:any)=> x?.id == questionId)?.name} has been deleted`}`)
                }
            }
            setDeleteModalOpen(false)
            setBulkDelete(false)
            setTableAllRowSelected(false)
            setTableRowSelected([])
            if(res?.result?.responseCode == 0){
                setPgNo(0)
                getquestionPaperCall(true)
                setSnackBar(true);
                setSnackBarSeverity('success');
            }else{
                setSnackBar(true);
                setSnackBarSeverity('error');
                setSnackBarText(`Something went wrong!`)
            }
    }

    const QuestionPaperTypeAPi= async()=>{
        const res= await QuestionPaperTypeapi()
        if(res){
            setQuestionPaperType(res)
        }
    }

    const getQueryPoints = (param: string, type: string) => {
        setMinMaxCall(true)
        if (type == "min") {
            setAllFilters({...allFilters, minMarks: param })
        }
        if (type == "max") {
            setAllFilters({...allFilters, maxMarks: param })
        }
        if (type == "empty") {
            setAllFilters({...allFilters, maxMarks: "", minMarks:""})
            if ((allFilters?.minMarks == "" && allFilters?.maxMarks == "")) {
                getquestionPaperCall(false)
                setMinMaxCall(false)
            }
        }
    }
    const disableFilter = (type: string) => {
        switch (type) {
          case "grade":
            if (
              (!questionpaperData?.length &&
                JSON.stringify(cloneObj) === JSON.stringify(allFilters)) ||
              !grade?.length
            ) {
              return true;
            } else {
              return false;
            }
          case "subject":
            if (
              (!questionpaperData?.length &&
                JSON.stringify(cloneObj) === JSON.stringify(allFilters)) ||
              !grade?.length ||
              !subjectFilter?.length ||
              !allFilters?.gradeId?.split(",")?.length ||
              (allFilters?.gradeId?.split(",")?.length == 1 &&
                allFilters?.gradeId?.split(",")[0] == "")
            ) {
              return true;
            } else {
              return false;
            }
      }};
    useEffect(() => {
            if (allFilters?.minMarks && allFilters?.maxMarks) {
                getquestionPaperCall(false);
            }
            if ((allFilters?.minMarks == "" && allFilters?.maxMarks == "")) {
                getquestionPaperCall(false);
                setMinMaxCall(false)
            }
    }, [allFilters?.minMarks, allFilters?.maxMarks,academicYearDataSelected])

    useEffect(() => {
        getquestionPaperCall(false);
    }, [pgNo,allFilters,sortDetails,deBounceSearchterm]);

    useEffect(()=>{
        handleGetGrade();
        handleQuestionPaperMode();
        QuestionPaperTypeAPi()
    },[])
    useEffect(()=>{
        if(allFilters?.gradeId){
            getSubjectByApi()
        }else{
            setAllFilters({...allFilters, subjectId: "" })
            setSubjectFilter([])
        }
    },[allFilters?.gradeId])
    useEffect(()=>{
        setPgNo(0)
      },[allFilters])
    useEffect(()=>{
   setTableAllRowSelected(false) 
   setTableRowSelected([])
    },[pgNo])
    const handleAssementorExaminationclick = (id:number) =>{
        // setshowgoBack(true);
        history("/questionapaperotp1",{state:{questionPaperTypeID:id}});
    }

    //required for createnew question paper modal 
    const modalData = [
        {
            header: "Formative (Informal)",
            image: QuestionPaperIcon,
            content: "Create question paper to conduct class tests/informal tests",
            buttons: [
                {
                    label: "Create Assessment",
                    type: "contained",
                    textColor: "white",
                    backgroundColor: "#01B58A",
                    minWidth: "182px",
                    buttonSize: "Medium",
                    icon: <ArrowForwardIcon />, //icon need to be passed as a component
                    onClick: () =>  handleAssementorExaminationclick(1) ,
                }
            ]
        },
        {
            header: "Summative (Formal)",
            image: QuestionPaperIconwithApprove,
            content: "Create question paper and send for approval to HOD before assigning",
            buttons: [
                {
                    label: "Create Assessment",
                    type: "contained",
                    textColor: "white",
                    backgroundColor: "#01B58A",
                    minWidth: "182px",
                    buttonSize: "Medium",
                    icon: <ArrowForwardIcon />,
                    onClick: () =>  handleAssementorExaminationclick(2) ,
                    
                }
            ]
        }
    ]

    const modalDatagoback = [
        {
            header: "Online",
            image: Desktop,
            content: "Assign and track students progress online",
            buttons: [
                {
                    label: "Create Assessment",
                    type: "contained",
                    textColor: "white",
                    backgroundColor: "#01B58A",
                    minWidth: "182px",
                    buttonSize: "Medium",
                    icon: <ArrowForwardIcon />, //icon need to be passed as a component
                    onClick: () =>  handleButtonClick() ,
                }
            ]
        },
        {
            header: "offline",
            image:offline ,
            content: "Print question for in class test",
            buttons: [
                {
                    label: "Create Assessment",
                    type: "contained",
                    textColor: "white",
                    backgroundColor: "#01B58A",
                    minWidth: "182px",
                    buttonSize: "Medium",
                    icon: <ArrowForwardIcon />,
                    onClick: () =>  handleButtonClick() ,
                    
                }
            ]
        }
    ]

    const histroy = [
        {
          date: "Cycle Test (Set 1)",
          mode: "Offline",
          type: "Informal",
          marks: 20,
          status: "Print"
        },
        {
          date: "Cycle Test (Set 2)",
          mode: "Offline",
          type: "Formal",
          marks: 20,
          status: "Print"
        }
      ]

      const handleToggle = ( id: any,list:any) =>{         
        setSubList(list)
        if (multifileID === id) {
            if (expanded) {
                setExpanded(false)
                setMultifileID(null)
            }
            if (!expanded) {
                setExpanded(true)
                setMultifileID(id)
            }
        } else {
            setExpanded(true)
            setMultifileID(id)
        }       
      }

      const getAcademicYear = async () => {        
        const response = await GetQuestionPaperAcademicId()
            if (response?.status === "200") {
                let academicYears = response?.data?.academicData?.filter((year: any) => year?.academicStatusId < 1)
                academicYears = academicYears.sort((a: any, b: any) => b?.academicStatusId - a?.academicStatusId)
                setAcademicYearData(academicYears)
                let academicData:any = []
                academicYears.map((e:any, index:number) => {
                    let academicLabel = e.acadamicYear +(e.academicStatusId == 0 ? " (Current)" : "");
                    academicData.push(academicLabel);
                    if(e?.academicStatusId == 0)setAcademicYearDataSelected(index.toString())
                });
                setAcademicYearDataInfo(academicData)
        }
      }

      const AcademicYearSelectHandler = (indexData:number) => {
        setAcademicYearDataSelected(indexData.toString())
      }

      useEffect(() => {
        getAcademicYear()
      },[])
    return (
        <> 
        <div className='questionPaperAcademicTable'>
            <SelectBoxComponent variant={'fill'} selectedValue={academicYearDataSelected} clickHandler={(e:number) => {AcademicYearSelectHandler(e)}} selectLabel={'Academic Year:'} selectList={academicYearDataInfo} mandatory={false} />
        </div>
            {/* <div className='assessmentParentContainer'> */}
                {/* <div className={styles.assessmentContainerSect}> */}
                    {/* <h1 className='assessmentTitles'>Assessments</h1> */}
                    <Box className={`${styles.assessmentTabPadd} assessmentTabStyling mt-2`} sx={{ width: '100%' }}>
                        <TabContext value={value}>
                            {/* <Box >
                                <TabList onChange={handleTabChange} aria-label="lab API tabs example">
                                    {tabElement.map((tab:any, index:any) => <Tab key={index} label={tab.label} value={`${index + 1}`} />)}
                                </TabList>
                            </Box> */}
                            <TabPanel value="1" className="px-0">
                                <div className='d-flex filter-file' style={{ justifyContent: "space-between" }} >
                                    <div className='selectTransBtnSect createNewTemplateSelectLeft' style={{ display: "flex", gap: "10px" }}>
                                    <MultiSelectComponentforFilters options={grade} disable={disableFilter("grade")} values={allFilters.gradeId} onChange={(e: any) => { updateUser(e, "gradeId") }} multiType={"Multi1"} addableFiled="All Grades" showableField="grade" selectableField="es_gradeid"  />
                                    <MultiSelectComponentforFilters options={subjectFilter} disable={disableFilter("subject")} values={allFilters.subjectId} onChange={(e: any) => { updateUser(e, "subjectId") }} multiType={"Multi1"} addableFiled="All Subject" showableField="courseDisplayName" selectableField="courseId" />
                                    </div>
                                    <div className='d-flex gap-2'>
                                        <div className='selQuesPaperFilter'>
                                        <MultiSelectComponentforFilters options={QuestionPaperType} disable={(JSON.stringify(allFilters) == JSON.stringify(cloneObj) && questionpaperData?.length == 0) ? true : false} onChange={(e: any) => { updateUser(e, "questionPaperTypeId") }} multiType={"Multi1"} addableFiled="All Question Paper Types" showableField="name" selectableField="id" values={allFilters.questionPaperTypeId} />                                    
                                        </div>
                                        <PointFilter getQueryPoints={(param: string, type: string) => { getQueryPoints(param, type) }} disable={(JSON.stringify(allFilters) == JSON.stringify(cloneObj) && questionpaperData?.length == 0) ? true : false} label={"marks"}/>
                                    </div>
                                    
                                </div>
                                {questionpaperData?.length == 0 && (!allFilters.gradeId && !allFilters.questionPaperTypeId && !allFilters.questionPaperTypeId  && !searchTerm && !allFilters?.minMarks && !allFilters?.maxMarks) ?  
                                <EmptyScreen emptyBtnTxt={"Create New Question Paper"} title={'You haven’t created any question papers yet'} desc={'Press the button below to create a new question Paper'} onClickBtn={() =>setCreatenewquespaper(true)} btnDisable={academicYearData[academicYearDataSelected]?.academicStatusId != 0}/> :
                                <>
                                <div className='questionPaperTableSect'>
                                    <div className="searchAndBtn">
                                        <InputFieldComponent label={'Search Question Papers...'} required={false} inputType={"text"} onChange={(e:any) => setSearchTerm(e.target.value)} inputSize={"Medium"} variant={"searchIcon"} />
                                        <ButtonComponent icon={<AddIcon />} image={""} textColor="" backgroundColor="#01B58A" disabled={academicYearData[academicYearDataSelected]?.academicStatusId != 0} buttonSize="Medium" type="contained" onClick={hanldecreatequestionpaper} label="Create New Question Paper" minWidth="200" />
                                    </div>
                                    <div className="questionPaperTableScroll">
                                        <TableContainer className="assessmentTableSect">
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
                                                        <TableCell style={{ width: "25%", cursor: "pointer"  }}>
                                                            <div className='tableHeadArrowSect'>
                                                                Question Papers
                                                                {/* <span className={`resrTableSortArrow ${getClassName(
                                                                            "name"
                                                                          )}`}>
                                                                    <img width="10px" alt="" src={UpPolygon} onClick={(e) => sortToggle("name")}/>
                                                                    <img width="10px" alt="" src={Polygon} onClick={(e) => sortToggle("name")}/>
                                                                </span> */}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell style={{ width: "10%" }}>
                                                            <div className='tableHeadArrowSect'>
                                                                Mode
                                                                {/* <span className={`resrTableSortArrow ${getClassName(
                                                                            "mode"
                                                                          )}`}>
                                                                    <img width="10px" alt="" src={UpPolygon} onClick={(e) => sortToggle("mode")} />
                                                                    <img width="10px" alt="" src={Polygon} onClick={(e) => sortToggle("mode")}/>
                                                                </span> */}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell style={{ width: "10%" }}>
                                                            <div className='tableHeadArrowSect'>
                                                                Type
                                                                {/* <span className={`resrTableSortArrow ${getClassName(
                                                                            "type"
                                                                          )}`}>
                                                                    <img width="10px" alt="" src={UpPolygon} onClick={(e) => sortToggle("type")}/>
                                                                    <img width="10px" alt="" src={Polygon} onClick={(e) => sortToggle("type")}/>
                                                                </span> */}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell style={{ width: "10%", cursor: "pointer" }}>
                                                            <div className='tableHeadArrowSect'>                                                                
                                                                <span className={`resrTableSortArrow questionPaperArrow ${getClassName(
                                                                            "marks"
                                                                          )}`} onClick={(e) => sortToggle("marks")}>
                                                                            Marks
                                                                            <div>                                                                                
                                                                                <img width="10px" alt="" src={UpPolygon}  />
                                                                                <img width="10px" alt="" src={Polygon} />
                                                                            </div>
                                                                      
                                                                </span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell style={{ width: "25%" }}>
                                                            <div className='tableHeadArrowSect'>
                                                                Status
                                                                {/* <span className={`resrTableSortArrow activeUpArrow`}>
                                                                    <img width="10px" alt="" src={UpPolygon} />
                                                                    <img width="10px" alt="" src={Polygon} />
                                                                </span> */}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell style={{ width: "100px" }}>
                                                            <div className='tableHeadArrowSect'>
                                                                Actions
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    { questionpaperData?.length>0 ?
                                                        questionpaperData?.map((dataList: any, index: any) => {
                                                        let data =questionpaperstatus?.filter((e:any)=>e?.id == dataList?.statusID)
                                                        let typeName=QuestionPaperType?.filter((e:any)=>e?.id == dataList?.questionPaperTypeID)
                                                        let modeName=questionpapermode?.filter((e:any)=>e?.id == dataList?.examTypeID)
                                                        return (
                                                            <>
                                                        <TableRow style={{ cursor: "pointer" }} 
                                                        onClick={(event:any) => {if(dataList?.questionPaperSetsInfo?.length >0 ){
                                                                                        handleToggle( dataList.id,dataList?.questionPaperSetsInfo) 
                                                                                        event.stopPropagation() 
                                                                                    } else{
                                                                                        history(`/printForPreview?${dataList?.id}`, {state:false})            
                                                                                    }}} 
                                                                                    key={index}>
                                                            <TableCell style={{ width: "70px", textAlign: 'center' }}>
                                                                <CheckBoxCompleted
                                                                    checkLabel="Label"
                                                                    disable={false}
                                                                    checkStatus={tableRowSelected.includes(index)}
                                                                    onChangeHandler={(e: any) => handleCheck(e, index)}
                                                                />
                                                            </TableCell>
                                                            <TableCell >
                                                                <p className={`mb-0  ${TableStyles.ellipseText}`} title={dataList?.name} dangerouslySetInnerHTML={{ __html: dataList?.name }}></p>
                                                            </TableCell>
                                                            <TableCell>{modeName[0]?.name}</TableCell>
                                                            <TableCell>{typeName[0]?.name}</TableCell>
                                                            <TableCell>{dataList?.marks}</TableCell>
                                                                    <TableCell>
                                                                        {(dataList?.statusID == 3 || dataList?.statusID == 1) ?
                                                                            <ButtonColorComponent buttonVariant="contained" textColor='#01B58A !important' label={dataList?.statusName} width="150px" height="25px" backgroundColor="rgba(1, 181, 138, 0.1) !important" /> :
                                                                            <ButtonColorComponent buttonVariant="outlined" textColor='#01B58A !important' label={dataList?.statusName} width="154px" height="25px" backgroundColor="" />
                                                                        }
                                                                    </TableCell>
                                                            <TableCell>
                                                                <div className={TableStyles.actionBtnSect}>
                                                                            {dataList?.questionPaperSetsInfo?.length >0 ?  <p className='m-0 viewAllSet'>View all Sets</p>:
                                                                            <ActionButtonComponent disableBtn={false} dataList={dataList} modalOpen={(param: boolean) => setDeleteModalOpen(param)} getKeyId={(a: any) => getKeyHandler(a)} editKey={(e: any) => handleEdit(e)} duplicateKey={(e) => {handleDuplicate(e) }} isActive={true} /> 
                                                                           }
                                                                            <IconButton
                                                                                onClick={(event:any) => {
                                                                                    if(dataList?.questionPaperSetsInfo?.length >0 ){
                                                                                        handleToggle( dataList.id,dataList?.questionPaperSetsInfo) 
                                                                                        event.stopPropagation() 
                                                                                    } else{
                                                                                        history(`/printForPreview?${data?.id}`, {state:true})              
                                                                                    }
                                                                                }}
                                                                            >
                                                                                { expanded && multifileID === dataList.id ? <Chevrondown /> :  <KeyboardArrowRightIcon /> }
                                                                                {/* <KeyboardArrowRightIcon /> */}
                                                                            </IconButton>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                        {
                                                            (expanded&& multifileID === dataList.id)  && 
                                                            <TableRow >
                                                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                                                                <Collapse in={expanded} timeout="auto" unmountOnExit>
                                                                    <Box sx={{ margin: 1 }}>
                                                                        <Table size="small" aria-label="purchases">
                                                                            <TableBody>
                                                                                {subList && subList?.map((historyRow: any, index: number) => {
                                                                                    let subtypeName=QuestionPaperType?.filter((e:any)=>e?.id == historyRow?.questionPaperTypeID)
                                                                                    return(
                                                                                    <TableRow key={index} style={{ cursor: "pointer" }} onClick={() => {history(`/printForPreview?${dataList?.id}`, {state:false})}} >
                                                                                        <TableCell style={{ width: "70px", textAlign: 'center' }}>
                                                                                            <CheckBoxCompleted
                                                                                                checkLabel="Label"
                                                                                                disable={false}
                                                                                                checkStatus={false}
                                                                                                onChangeHandler={() => {}}
                                                                                            />
                                                                                        </TableCell>
                                                                                        <TableCell style={{ width: "25%" }} component="th" scope="row">
                                                                                            {historyRow?.name}
                                                                                        </TableCell>
                                                                                        <TableCell style={{ width: "10%" }}>{modeName[0]?.name}</TableCell>
                                                                                        <TableCell style={{ width: "10%" }}>{subtypeName[0]?.name}</TableCell>
                                                                                        <TableCell style={{ width: "10%" }}>{historyRow.marks}</TableCell>
                                                                                       
                                                                                       
                                                                                        <TableCell className='listExpandTd' style={{ width: "26%" }}>
                                                                                        {(historyRow?.statusID == 3 || historyRow?.statusID == 1) ?
                                                                            <ButtonColorComponent buttonVariant="contained" textColor='#01B58A !important' label={historyRow?.statusName} width="150px" height="25px" backgroundColor="rgba(1, 181, 138, 0.1) !important" /> :
                                                                            <ButtonColorComponent buttonVariant="outlined" textColor='#01B58A !important' label={historyRow?.statusName} width="154px" height="25px" backgroundColor="" />
                                                                        }
                                                                                        </TableCell>
                                                                                        <TableCell style={{ width: "90px" }}>
                                                                                            <div className={TableStyles.actionBtnSect}>
                                                                                                        <ActionButtonComponent disableBtn={false} dataList={historyRow} modalOpen={(param: boolean) => setDeleteModalOpen(param)} getKeyId={(a: any) => qpSetDelHandler(a,dataList.id)} editKey={() => handleEdit(dataList)} duplicateKey={(e) => {handleDuplicate(dataList)}} isActive={true} />
                                                                                                        <IconButton
                                                                                onClick={(event:any) => { 
                                                                                    history(`/printForPreview?${dataList?.id}`, {state:true})              
                                                                                }}
                                                                            >
                                                                                                             <KeyboardArrowRightIcon />
                                                                                                        </IconButton>
                                                                                            </div>
                                                                                        </TableCell>
                                                                                    </TableRow>
                                                                                )})}
                                                                            </TableBody>
                                                                        </Table>
                                                                    </Box>
                                                                </Collapse>
                                                            </TableCell>
                                                        </TableRow>
                                                        }
                                                               
                                                       </>
                                                    )
                                                }):(
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
                                    <DeleteModalComponent open={deleteModalOpen} onClose={() => { setDeleteModalOpen(false); setBulkDelete(false) }} descriptionText={`${(tableRowSelected?.length > 1 && bulkDelete) ? `You selected ${tableRowSelected?.length} Question papers which will be deleted from the list,do you wish to continue?` : 'Selected Question paper will be deleted from the list, do you wish to continue?' }`} title={`Delete ${(tableRowSelected?.length > 1 && bulkDelete) ? tableRowSelected?.length.toString() + ' Question Papers?' : 'Question Paper?'}`} deleteHandler={deleteQuestionHandler}/>
                                    {tableRowSelected.length > 0 &&
                                        <div className={TableStyles.tableFooter}>
                                            <h4 className='fontW800 mb-0'>{tableRowSelected.length} Question Paper{tableRowSelected.length > 1 ? "s" : ""} Selected</h4>
                                            <ButtonComponent icon={<DeleteIcon />} image={""} textColor="#9A9A9A" backgroundColor="#01B58A" disabled={false} buttonSize="" type="transparent" onClick={deleteQuestion} label={`Delete Question Paper${tableRowSelected.length > 1 ? "s" : ""}`} minWidth="" />
                                        </div>
                                    }
                                </div>  
                                <div className="assessPagenation" style={{ display: "flex", justifyContent: "start", paddingTop: "1rem" }}>
                                    <Pagination
                                        count={totalPages}
                                        page={pgNo+1}
                                        onChange={(e, p: number) => {setPgNo(p-1) ;
                                            // setSupportPg(true)
                                        }}
                                        shape="rounded"
                                        />
                                </div>
                                </>
                                }
                            </TabPanel>
                            {/* <TabPanel value="2" className="px-0">
                            </TabPanel>
                            <TabPanel value="3" className="px-0">
                            </TabPanel>
                            <TabPanel value="4" className="px-0">
                            </TabPanel> */}
                        </TabContext>
                    </Box>
                {/* </div> */}
            {/* </div> */}
            {createnewquespaper && 
                <CreateNewQuestionPaperModal modalData={modalData} onClose={() => setCreatenewquespaper(false)} gobackreq={false}/>
            }
            {/* {showgoback &&
                <CreateNewQuestionPaperModal modalData={modalDatagoback} onClose={() => {setshowgoBack(false);setCreatenewquespaper(false)}} gobackreq={true}/>
             } */}
             {spinnerStatus && <Spinner />}
            <Toaster onClose={() => { setSnackBar(false) }} severity={SnackBarSeverity} text={snackBarText} snakeBar={snackBar} />
        </>
    )
}

export default QuestionPaperTable