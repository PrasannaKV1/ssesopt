import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import closeIcon from "../../../assets/images/closeIcon.svg";
import Modal from '@mui/material/Modal';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import "./MIFReplaceQuestionModal.css";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ButtonComponent from '../../SharedComponents/ButtonComponent/ButtonComponent';
import { getReplaceQnsTableApi, getReplaceQnsTablePreview } from '../../../Api/QuestionPaper';
import DropdownWithCheckbox from '../../SharedComponents/DropdownWithCheckbox/DropdownWithCheckbox';
import Spinner from '../../SharedComponents/Spinner';
import { baseFilterApi, createdByReplaceApi, getQuestionMIFApi, getThemesApi, putReplaceApi, selectFieldApi, selectFieldQueTypeApi } from '../../../Api/AssessmentTypes';
import { getLocalStorageDataBasedOnKey } from '../../../constants/helper';
import { State } from '../../../types/assessment';
import { useForm, FormProvider } from "react-hook-form";
import PointFilter from '../../AssessmentsContainer/pointerFilter';
import ReplacePreviewModalComponent from '../MIFQuestionPaperOPTScreen/MIFReplacePreviewModalComponent';
import InputFieldComponentForForm from '../../SharedComponents/FormFieldComponents/InputFieldComponent';
import { FormControlLabel, RadioGroup } from "@mui/material";
import Radio from '@mui/material/Radio';
import PreviewModalImage from '../../AssessmentsContainer/CreateNewQuestion/PreviewModalComponent/PreviewModalImage';
import ClearFilter from "../../../assets/images/ClearFilter.svg"
import BlurClearFilter from "../../../assets/images/BlurClearFilter.svg"
import EmptyScreen from '../../SharedComponents/EmptyScreen/EmptyScreen';
import DropdownWithExpandCheckbox from '../../SharedComponents/DropdownWithCheckbox/DropdownWithExpandedCheckbox';
import SingleSelect from '../../SharedComponents/DropdownWithCheckbox/SingleSelect';
import CheckBoxComponent from '../../SharedComponents/CheckBoxComponent/CheckBoxComponent';
import ModalQuestion from '../MIFCustomInputModal/ModalQuestion';
import InfiniteScroll from 'react-infinite-scroll-component';
const questionFormat= {
    "id": 2846,
    "name": null,
    "ques": null,
    "type": "Question",
    "marks": "5",
    "subQue": "",
    "manQues": null,
    "children": [],
    "courseId": "771",
    "isHidden": 0,
    "parentID": null,
    "showMarks": null,
    "categoryId": "2",
    "chapterIds": [
        6554
    ],
    "optionType": "",
    "sequenceNo": "2",
    "instruction": null,
    "marksFormat": "0",
    "orAlignment": "1",
    "elementTitle": "Question",
    "orSequencing": "0",
    "sequenceText": "2)",
    "templateType": 2,
    "difficultyIds": [
        2
    ],
    "partAlignment": "1",
    "questionOrder": {
        "lang": "English",
        "langId": 1,
        "option": "1)",
        "optionId": 0
    },
    "orOptionConfig": {
        "show": false,
        "text": "OR",
        "alignment": null,
        "sequenceType": "continue"
    },
    "questionTypeIds": [
        111
    ],
    "marksWithOptions": null,
    "sectionAlignment": "1",
    "mainQuestionOrder": "0",
    "isSequenceCustomized": false,
    "marksAgainstQuestion": "0",
    "noOfOrOptionsInChildren": 0,
    "marksAgainstMainQuestion": "0",
    "questionInfo": {
        "question": "<h3 class=\"ql-align-justify\"><strong style=\"color: rgb(74, 74, 74);\">What are the different methods of testing?</strong></h3><p><br></p>",
        "id": 4075,
        "questionObjectiveId": 1,
        "questionLevelId": 2,
        "questionTypeMasterId": 5092,
        "questionTypeName": "Subjective",
        "completionTime": 10,
        "isPublic": true,
        "marks": 5,
        "solution": "<p class=\"ql-align-justify\"><span style=\"color: rgb(74, 74, 74);\">There are three methods of&nbsp;software testing&nbsp;and they are as follows:</span></p><ol><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span><strong style=\"color: rgb(74, 74, 74);\">Black-box testing:</strong><span style=\"color: rgb(74, 74, 74);\">&nbsp;It is a testing strategy based solely on requirements and specifications. In this strategy, it requires no knowledge of internal paths, structures, or implementation of the software being tested.</span></li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span><strong style=\"color: rgb(74, 74, 74);\">White box</strong><span style=\"color: rgb(74, 74, 74);\">&nbsp;</span><strong style=\"color: rgb(74, 74, 74);\">testing:</strong><span style=\"color: rgb(74, 74, 74);\">&nbsp;It is a testing strategy based on internal paths, code structures, and implementation of the software being tested. White box testing generally requires detailed programming skills.</span></li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span><strong style=\"color: rgb(74, 74, 74);\">Gray box testing:</strong><span style=\"color: rgb(74, 74, 74);\">&nbsp;It is a strategy for software debugging in which the tester has limited knowledge of the internal details of the program</span></li></ol><p><br></p>",
        "questionTextWithoutImages": "<h3 class=\"ql-align-justify\"><strong style=\"color: rgb(74, 74, 74);\">What are the different methods of testing?</strong></h3><p><br></p>",
        "gradeId": 45,
        "subjectId": 771,
        "themeId": 6553,
        "chapterId": 6554,
        "topicId": 6555,
        "questionErrorTypes": [{
            "errorTypeId": 664,
            "errorName": null,
            "active": true
        }],
        "questionTypeWithTemplate": "pr_subjective",
        "questionTypeActive": true,
        "createdByUser": "Ritesh Patel",
        "createdBy": 1,
        "isNTTAdmin": true,
        "isNTTQuestion": true,
        "isPublished": true
    },
    "sequenceCustomized": false,
    "typeOfLines": null
};

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    height:"650px"
};
type props = {
    open: boolean,
    handleClose:  () => void,
    replaceFilterObj:any,
    replace?:any,
    replaceQp?:any,
    ReqBody:any,
    modalType?:string,
    PopUpModal?:(count: number)=>void
}

const MIFReplaceQuestionModal : React.FC<props> = ({open,handleClose,replaceFilterObj,ReqBody,replace,replaceQp,modalType="REPLACE_QUESTION",PopUpModal}) => {
    const [preSetVal,setPreSetVal]=React.useState<any|null>({
        subjectId: [],
        themeId: [],
        chapterId: [],
        topicId: [],
        questionTypeIds:[],
        questionLevelIds:[],  
        minMarks:"",
        maxMarks:"",
        createdById:[],
      })
    const [compPresetval,setCompval]=React.useState<any|null>({
        subjectId: [],
        themeId: [],
        chapterId: [],
        topicId: [],
        questionTypeIds:[],
        questionLevelIds:[],  
        minMarks:"",
        maxMarks:"",
        createdById:[],
      })
    const [trigger,setTrigger]=React.useState<boolean>(false)
    const [marksPreSet,setMarksPreSet]=React.useState<any|null>(null)
    const [paperId,setPaperId]=React.useState<any|null>(null)
    const [initialValues, setInitialValues] = React.useState({
        subjectId: [],
        themeId: [],
        chapterId: [],
        topicId: [],
        questionTypeIds:[],
        questionLevelIds:[],  
        minMarks:"",
        maxMarks:"",
        createdById:[],
        radioValue:"",
        textReplace:""
      })
    const methods = useForm<any>({
        defaultValues: initialValues,
        mode: "onBlur",
        reValidateMode: "onChange"
      });
    const [pgNo,setPgNo]=React.useState<number>(0)
    const [spinnerStatus, setSpinnerStatus] =React.useState(false);
    const [subject, setSubject] = React.useState<any[]>([])
    const [chapter, setChapter] = React.useState<any[]>([])
    const [theme, setTheme] = React.useState<any[]>([])
    const [topics, setTopics] = React.useState<any[]>([])
    const [QuestionType,setQuestionTypeData]= React.useState<any>([])
    const[questionLevel,setQuestionLevel] = React.useState<string[]>([])
    const [createdBy,setCreatedBy]=React.useState<any[]>([])
    const [minMaxCall,setMinMaxCall]=React.useState<boolean>(false)
    const [selectedRadioValue, setSelectedRadioValue] = React.useState({id:''})
    const [openPreviewImg, setOpenPreviewImg] = React.useState<boolean>(false)
    const [imgContent, setImgContent] = React.useState<string>("")
    const [selectedQuestions,setSelectedQuestions]= React.useState<any>([]);
    const [maxQuestionModal,setMaxQuestionModal]= React.useState<any>(false);
    const [searchData,setSearchData]= React.useState<any>('')
    const [loadMore, setLoadMore] = React.useState(true)
    const[totalPage,setTotalPage]=React.useState<number>(0)
    const [reorderStatus, setReorderStatus] = React.useState(false)
    const [postObj,setpostObj]=React.useState<any>({
        subjectId:[],
        chapterId:[],
        themeId:[],
        topicId:[],
        questionTypeIds:[],
        questionLevelIds:[],
        minMarks:"",
        maxMarks:"",
        createdById:[],
        radioValue:"",
        textReplace:""
    })
    let excludeId:any=[];
       
    const stateDetails = JSON.parse(getLocalStorageDataBasedOnKey('state') as string) as State;
    const [allFilters, setAllFilters] = React.useState<any>()

   const [tabledata,setTabledata]=React.useState<any[]>([])
    const maxGreatMin=( +postObj?.maxMarks >+postObj?.minMarks || +postObj?.minMarks == +postObj?.maxMarks)?true:false;
    const mincondiCheck=postObj?.minMarks && +postObj?.minMarks>0 && (maxGreatMin)?true:false;
    const maxcondiCheck=postObj?.maxMarks && +postObj?.maxMarks>0 &&(maxGreatMin)?true:false;

    const replaceModalData ={
        title :"Replace Questions",
        subDescription:"Select the question that you want to replace on the generated question paper",
        isQuestionCount:false,
        isMultiSelect:false,
        type:"Replace",
    } 
    const addModalData ={
        title :"Add Questions",
        subDescription:"Select the question that you want to add on the generated question paper",
        isQuestionCount:true,
        isMultiSelect:true,
        type:"Add",
    } 
    const modalData = modalType === "REPLACE_QUESTION" ? replaceModalData: addModalData;
     const handlechange = (qp:any) => {
        console.log(qp,"qp..")
     };
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

    const excludeQns = ( ) => {
        const traverseJson = (obj:any) => {
          for (const key in obj) {
            if (typeof obj[key] === "object" && obj[key] !== null) {
              if (
                obj[key].hasOwnProperty("questionInfo") && obj[key]?.type === "Question"
              ) {
                if( obj[key]?.questionInfo && obj[key]?.questionInfo?.id){
                    excludeId = Array.from(
                        new Set([...excludeId,obj[key]?.questionInfo?.id]))
                }
                
              }
              traverseJson(obj[key]);
            }
          }
        };
        traverseJson(ReqBody);
      };

     const getReplaceQnsTableData=async(isScroll?:boolean)=>{
         excludeQns();
        const markHandler=minMaxApiHandler();
        if(methods?.getValues("createdById").length>0){
            setSpinnerStatus(true)
         const params={
            "pageNo":isScroll?pgNo:0,
            "pageSize":100,
            "questionTypeIds":methods?.getValues("questionTypeIds").toString()||null,
            "published":true,
            "gradeIds":replace?.gradeID,
            "subjectIds":methods?.getValues("subjectId").toString()||null,
            "chapterIds":methods?.getValues("chapterId").toString()||null,
            "themeIds":methods?.getValues("themeId").toString()||null,
            "topicIds":methods?.getValues("topicId").toString()||null,
            "minMarks":mincondiCheck? postObj?.minMarks:null,
            "maxMarks": maxcondiCheck? postObj?.maxMarks:null,
            "questionLevelIds":methods?.getValues("questionLevelIds").toString()||null,
            "createdByIds":methods?.getValues("createdById").toString()||null,
            "text":methods?.getValues("textReplace")||null,
            "forQPListing":true,
            "isPublic":true,
            "excludedQIds": excludeId.toString()
         }
        if (!params.maxMarks) {
            params.minMarks = null
        }
        if (!params.minMarks) {
            params.maxMarks = null
        }
         const res=await getReplaceQnsTableApi(params)
         methods?.setValue("radioValue","")
         if(res?.baseResponse?.data){
         setSelectedRadioValue({id:''})
         const mergeSelected = res?.baseResponse?.data?.map((data:any)=>({...data,checked:selectedQuestions.includes(data.id)})).sort((x:any,y:any)=>(x.checked === y.checked)? 0 : x.checked? -1 : 1);
         setTabledata(isScroll?[...tabledata,...mergeSelected]:(mergeSelected ||[]))
         setTotalPage(res.totalPages)
         setTimeout(()=>{
             setSpinnerStatus(false)
         },300)
        }
        else {
            setSpinnerStatus(false)
            setTabledata([]);
        }
    }
     }
    
     const subApiCall = async (gradeId:any) => {
         setSpinnerStatus(true)
        if(replace?.gradeID ){
            const response:any = await baseFilterApi("subjects", { "gradeId": replace?.gradeID && [replace?.gradeID], "publicationId": 0, "staffId": stateDetails.login.userData.userRefId  })
            if (response.status == '200') {
                setSubject(response.data)
                setCompval((prev:any)=>({...prev,"subjectId":response.data.map((el: any) => el.courseId)}))
            } 
        }
        setTimeout(()=>{
            setSpinnerStatus(false)
        },2000)
    }
    const getThemes = async (value: any) => {
        setSpinnerStatus(true)
        if(value){
            try {
                const response: any = await getThemesApi({ "subjectId": value})
                if (response?.status == 200) {           
                  let subjectWithTheme =[] as any;
                  value?.map((ele: number) => {
                   let subWithTheme = {
                label: subject?.find((x: any) =>(ele==(x?.courseId)))?.courseName,
                value: ele,
                childOptions: response?.data?.filter((b: any) => (b?.courseID == ele)).map((x: any) => {
              return { label: x?.syllabusName, value: x?.syllabusID }
            })
          }
          subjectWithTheme.push(subWithTheme)
        })
        setTheme(subjectWithTheme?.filter((x:any)=> x?.childOptions?.length > 0))
                }
              } catch (err) {
                console.log(err)
              }
            }     
            setTimeout(()=>{
              setSpinnerStatus(false)
          },2000)
      }
    const chapterApi = async (list: any[] | null, element: number[]) => {
        setSpinnerStatus(true)
        if(element?.length > 0){
        const response = await baseFilterApi("chapters", { "gradeId":replace?.gradeID && [replace?.gradeID], "courseId": element, "staffId": stateDetails.login.userData.userRefId})
        if (response.status == 200) {
            let subjectWithChapter =[] as any;
            element?.map((ele: number) => {
              let courseAndChapter =
              {
                label: subject?.find((x: any) => (ele == x?.courseId))?.courseDisplayName,
                value: ele,
                childOptions: response?.data?.filter((b: any) => (b?.courseId == ele)).map((x: any) => {
                  return { label: x?.chapterName, value: x?.chapterId }
                })
              }
              subjectWithChapter.push(courseAndChapter)
            })      
            setChapter(subjectWithChapter?.filter((x:any)=> x?.childOptions?.length > 0)) 
        }    
        //   await getThemes(element)
        }else{
            setChapter([]) 
            setTheme([])
            setTopics([])
            methods.setValue("topicId",'')
            methods.setValue("themeId",'')
            methods.setValue("chapterId",'')
        }   
        setTimeout(()=>{
            setSpinnerStatus(false)
        },2000)
      }
      const TopicApi = async (list: any[] | null, element: number[]) => {
        if(element?.length > 0){
        setSpinnerStatus(true)
        const response = await baseFilterApi("topics", { "gradeId": replace?.gradeID && [replace?.gradeID], "courseId": methods.getValues("subjectId") && methods.getValues("subjectId") , "chapterId": element, "staffId": stateDetails.login.userData.userRefId })
        if (response.status == 200) {
          setTopics(response.data)
        }
        setTimeout(()=>{
            setSpinnerStatus(false)
        },2000)
    }else{
        setTopics([])
        methods.setValue("topicId",'')
    }
      }

      const addCourseNameQT = ((QTData:any) => {
        QTData.map((items:any) => {
            items.title = items.title + " ( "+ items.courseName + " )"
        })
        return QTData
    }) 
      const QuestionTypeApi = async (param:string) => {
        setSpinnerStatus(true)
        try {
            const response = await selectFieldQueTypeApi(`&subjectIds=${param}`)
            if (response && response?.baseResponse && response?.baseResponse?.data?.length) {
                setQuestionTypeData(addCourseNameQT(response?.baseResponse?.data))
            } else {
                setQuestionTypeData([])
            }
        } catch (err) {
            console.log(err)
        }
        setTimeout(()=>{
            setSpinnerStatus(false)
        },2000)
    }
    const QuestionLevelApi =async()=>{
        setSpinnerStatus(true)
        try {
            const response = await selectFieldApi("referencedata/question/levels")
            if(response && response !== undefined){
                setQuestionLevel(response)
            }else{
                setQuestionLevel([])
            }
        } catch (err) {
            console.log(err)
        }
        setTimeout(()=>{
            setSpinnerStatus(false)
        },2000)
    }
    const createdByApi=async()=>{
        setSpinnerStatus(true)
        try {
            const response = await createdByReplaceApi("referencedata/question/createdBy")
            if(response && response !== undefined){
                setCreatedBy(response)
                // const val:any = (typeof(replaceFilterObj?.questionInfo?.isNTTQuestion)=== 'boolean') ? (replaceFilterObj?.questionInfo?.isNTTQuestion? 1: 2 ) :null
                // const createBy:any =val? response?.filter((x:any)=>(x?.id == val)).map((y:any)=>y.id):response?.map((x:any)=>x?.id)
                setPreSetVal((prev:any)=>({...prev,"createdById":response.map((el: any) => el.id)}))
                setCompval((prev:any)=>({...prev,"createdById":response.map((el: any) => el.id)}))
            }else{
                setCreatedBy([])
            }
        } catch (err) {
            console.log(err)
        } 
        setTimeout(()=>{
            setSpinnerStatus(false)
        },2000)
    }
    const filterPostObj={
        subjectId: methods?.getValues("subjectId"),
        themeId: methods?.getValues("themeId")?methods?.getValues("themeId"):[],
        chapterId: methods?.getValues("chapterId"),
        topicId: methods?.getValues("topicId"),
        questionTypeIds:methods?.getValues("questionTypeIds"),
        questionLevelIds:methods?.getValues("questionLevelIds"),  
        minMarks:postObj?.minMarks,
        maxMarks:postObj?.maxMarks,
        createdById:methods?.getValues("createdById")
    }
    const enableOverAllClearFilter :boolean=JSON.stringify(compPresetval) === JSON.stringify(filterPostObj) ? false :true;

    const changeHandler = async (e: any, data: string) => {
    switch (data as string) {
    case 'textReplace':
            methods?.setValue('textReplace',e)
            setpostObj((prev:any)=>({...prev,text:e}))
            // setSearchData(e)
            break
    case 'subject':
        methods?.setValue('subjectId',e)
        setpostObj((prev:any)=>({...prev,subjectId:e}))
        chapterApi(null, e);
        break
    case 'theme':
        methods?.setValue('themeId',e)
        setpostObj((prev:any)=>({...prev,themeId:e}))
        break
    case 'Chapter':
        methods?.setValue('chapterId',e)
        setpostObj((prev:any)=>({...prev,chapterId:e}))
        TopicApi(null, e)
        break
    case 'topic':
        methods?.setValue('topicId',e)
        setpostObj((prev:any)=>({...prev,topicId:e}))
        break
    case 'questionTypeIds':
        methods?.setValue('questionTypeIds',e)
        setpostObj((prev:any)=>({...prev,questionTypeIds:e}))
        break
    case 'questionLevelIds':
        methods?.setValue('questionLevelIds',e)
        setpostObj((prev:any)=>({...prev,questionLevelIds:e}))
        break
    case 'createdBy':
        methods?.setValue('createdById',e)
        setpostObj((prev:any)=>({...prev,createdById:e}))
        break
    }
 }
 const getQueryPoints = (param: string, type: string) => {
    setMinMaxCall(true)
    if (type == "min") {
        setpostObj((prev:any)=>({...prev, minMarks: param }))
    }
    if (type == "max") {
        setpostObj((prev:any)=>({...prev,  maxMarks: param }))
    }
    if (type == "empty") {
        setpostObj((prev:any)=>({...prev , maxMarks: "", minMarks:""}))
        if ((postObj?.minMarks == "" && postObj?.maxMarks == "")) {
            getReplaceQnsTableData()
            setMinMaxCall(false)
        }
    }
}
const updateSelection = (event: any, value: any) => {
    if(typeof(event)!=="string"){
        event.persist();
    }
    setSelectedRadioValue({id:value});
    methods?.setValue('radioValue',value);
    if(event === "prev"){
        setSpinnerStatus(true)
        putReplaceApiCall()
    }
  };

const findAndReplaceData = (
    json:any,
    mainKey:any,
    mainValue:any,
    secondKey:any,
    secondValue:any
  ) => {
    const traverseJson = (obj:any) => {
      for (const key in obj) {
        if (typeof obj[key] === "object" && obj[key] !== null) {
          if (
            obj[key][mainKey] &&
            obj[key][mainKey][secondKey] === mainValue[secondKey]
          ) {
            const {checked,...replacementObject} = tabledata.find(
              (item:any) => item[secondKey] === secondValue
            );
            if (replacementObject) {
              obj[key][mainKey] = replacementObject;
            }
          }
          traverseJson(obj[key]);
        }
      }
    };

    // Create a deep copy of the json object
    const updatedJson = JSON.parse(JSON.stringify(json));

    traverseJson(updatedJson);
    return { updatedJson, originalJson: json };
  };


const putReplaceApiCall=async()=>{
    const id = methods?.getValues("radioValue")
    const newQuestion = await getQuestionMIFApi(id)
    let jsonBody =  JSON.parse(JSON.stringify(ReqBody));
    if(selectedRadioValue && paperId && replaceFilterObj?.id){
    const templateBuilderInfo = jsonBody.bodyTemplate.templateBuilderInfo 
    const templateParts = templateBuilderInfo.templateParts
    if (templateBuilderInfo.rootType === "Main Question") {
        const mainQuestionIndex = templateParts.findIndex((el: any) => el.id === replaceFilterObj.parentID)
        const mainQuestion = templateParts[mainQuestionIndex]
        const newQuestions = mainQuestion.children.map((que:any,index:number)=>que.id === replaceFilterObj?.id ? questionFormatter(newQuestion, index, mainQuestion.id) : que)
        mainQuestion.children = newQuestions
        templateBuilderInfo.templateParts[mainQuestionIndex] = mainQuestion;
    } else {
        const newQuestions = templateParts.map((que:any,index:number)=> que.id === replaceFilterObj?.id ? questionFormatter(newQuestion, index, null) : que)
        templateBuilderInfo.templateParts = newQuestions;
    }
     replaceQp(jsonBody)
     handleClose()
     setSpinnerStatus(false)
    }
}
const questionFormatter = (questionData:any,index:number, parentID: number | null)=>({
    ...questionFormat,
    id:questionData.id,
    marks:questionData.marks,
    chapterIds:[questionData.chapterId],
    courseId:questionData.subjectId,
    difficultyIds :[questionData.questionLevelIds],
    sequenceNo:`${index + 1}`,
    sequenceText:`${index + 1})`,
    questionTypeIds:[questionData.questionTypeIdWithTemplate],
    parentID,
    questionInfo:questionData,
    typeOfLines:replaceFilterObj?.typeOfLines ?? null
})
const addQuestionApiCall=async()=>{
    if(PopUpModal){
        PopUpModal(selectedQuestions.length)
    }
    let updateJSON =  JSON.parse(JSON.stringify(ReqBody));
    const res = await Promise.all(
        selectedQuestions.map((id:any)=>getQuestionMIFApi(id))
      );
   if (res) {
    const templateBuilderInfo = updateJSON.bodyTemplate.templateBuilderInfo 
    const templateParts = templateBuilderInfo.templateParts
    const templatePartsLength = templateParts.length
    if (templateBuilderInfo.rootType === "Main Question") {
        const mainQuestion = templateParts[templatePartsLength - 1]
        const newQuestions = res.map((queResponse:any,index:number)=>questionFormatter(queResponse, mainQuestion.children.length + index, mainQuestion.id))
        mainQuestion.children = [...mainQuestion.children, ...newQuestions]
        templateBuilderInfo.templateParts[templatePartsLength - 1] =  mainQuestion;
        templateBuilderInfo.paperLevelIndexSequence.question = templateBuilderInfo.templateParts.reduce((acc: number, cur: any) => acc + cur.children.length, 0)
    } else {
        const newQuestions = res.map((queResponse:any,index:number)=>questionFormatter(queResponse, templatePartsLength + index, null))
        templateBuilderInfo.templateParts =  [...templateParts ,...newQuestions];
        templateBuilderInfo.paperLevelIndexSequence.question = templateBuilderInfo.templateParts.length
    }
   }
     replaceQp(updateJSON)
     handleClose()
     setSpinnerStatus(false)

}

(window as any).handleClick = (key: any, event: any) => {
    event.preventDefault()
    setOpenPreviewImg(true)
    setImgContent(key)
};

const getQuestionTitle = (dataList: any) => {
    let str = dataList?.question;
    dataList?.questionImageDetails?.forEach((questionImage: any) => { 
      str = str?.replace(
        `{{${questionImage?.key}}}`,
        `<a href="${questionImage?.src}" onclick="handleClick('${questionImage?.src}',event)" style="margin-top:10px">${questionImage?.tag}</a>`
      );
    });
    return str;
  };
  const randomSelection=(n:number, data:any[])=> {
    let array:number[] = [];
    
    while (array.length < n) {
      let randomNumber = Math.floor(Math.random() * (data.length));
      if(!array.includes(data[randomNumber].id))array.push(data[randomNumber].id);
    }
    setSelectedQuestions(array);
    setTabledata((prev:any)=>prev.map((question:any)=>({...question,checked: array.includes(question.id)})))
  }
    const selectRandomHandler=()=>{
        if(modalData.isMultiSelect){
            setMaxQuestionModal(true);
        }else{
        const availarrLen=tabledata?.length;
        const random = Math.floor(Math.random() * availarrLen);
        setSelectedRadioValue({id:tabledata[random]?.id});
        methods?.setValue('radioValue',tabledata[random]?.id);
    }
}
React.useEffect(() => {
        const section = document?.getElementById(selectedRadioValue.id);
        section?.scrollIntoView( { behavior: 'smooth', block: 'start' } );
}, [selectedRadioValue,tabledata])
React.useEffect(() => {
    const timer = setTimeout(() => {
    if (postObj?.minMarks && postObj?.maxMarks) {
        getReplaceQnsTableData();
    }
        if (postObj?.minMarks == "" && postObj?.maxMarks == "") {
        getReplaceQnsTableData();
            setMinMaxCall(false);
    }
    }, 1000);
    return () => clearTimeout(timer);
}, [postObj?.minMarks, postObj?.maxMarks]);

    React.useEffect(()=>{
    if(replace?.gradeID){
        subApiCall(replace?.gradeID)
        QuestionLevelApi()
        createdByApi()
    }
    },[replace?.gradeID])

    React.useEffect(() => {
        if (replace?.gradeID) {
            const timer = setTimeout(() => {
                getReplaceQnsTableData();
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [postObj, replace]);

    React.useEffect(()=>{
     setPaperId(replace?.paperId)
    },[replace?.paperId])

    React.useEffect(()=>{
        presetValueHandler()
    },[replaceFilterObj])

    React.useEffect(()=>{
        QuestionTypeApi(methods?.getValues("subjectId"))
        chapterApi(null, methods?.getValues("subjectId"));
    },[methods?.getValues("subjectId")])

    React.useEffect(()=>{
        TopicApi(null, methods?.getValues("chapterId"))
    },[methods?.getValues("chapterId")])

    React.useEffect(() => {
        const timer = setTimeout(() => {
        getReplaceQnsTableData(true);
        }, 1000);

        return () => clearTimeout(timer);
    }, [pgNo]);
    const [replacePreviewClose, setReplacePreviewClose] = React.useState(false)
    const [replacePreviewData, setReplacePreviewData] = React.useState<any>();

    const replacePreview = async (id:string) => {
        excludeQns();
        const params={
            "questionTypeIds":methods?.getValues("questionTypeIds").toString()||"",
            "published":true,
            "gradeIds":replace?.gradeID,
            "subjectIds":methods?.getValues("subjectId").toString()||"",
            "chapterIds":methods?.getValues("chapterId").toString()||"",
            "themeIds":methods?.getValues("themeId").toString()||"",
            "topicIds":methods?.getValues("topicId").toString()||"",
            "minMarks":mincondiCheck? postObj?.minMarks:"",
            "maxMarks": maxcondiCheck? postObj?.maxMarks:"",
            "questionLevelIds":methods?.getValues("questionLevelIds").toString()||"",
            "createdByIds":methods?.getValues("createdById").toString()||"",
            "text":methods?.getValues("textReplace")||"",
            "forQPListing":true,
            "isPublic":true,
            "excludedQIds": excludeId.toString()
        }
        setAllFilters(params)
        const previewData =await getReplaceQnsTablePreview(id)
        setReplacePreviewData(previewData?.data)
        setReplacePreviewClose(true)
    }
    const presetValueHandler=()=>{
        setTrigger((prev:boolean)=>!prev)
        setPreSetVal((prev:any)=>({
            ...prev,
            "subjectId":[...(replaceFilterObj?.courses?.map((data:any)=>data.courseID) || []),replaceFilterObj?.courseId],
            "themeId":[...(replaceFilterObj?.themes?.map((data:any)=>data.themeID) || []),replaceFilterObj?.questionInfo?.themeId],
            "chapterId":replaceFilterObj?.chapterIds || replaceFilterObj?.chapters?.map((data:any)=>data.chapterID),
            "topicId":[replaceFilterObj?.questionInfo?.topicId],
            "questionTypeIds":[replaceFilterObj?.questionInfo?.questionTypeMasterId],
            "questionLevelIds":replaceFilterObj?.difficultyIds,
            "minMarks":replaceFilterObj?.marks,
            "maxMarks":replaceFilterObj?.marks,
        }))
        setMarksPreSet({
            min:replaceFilterObj?.marks,
            max:replaceFilterObj?.marks})
         setCompval((prev:any)=>({
            ...prev,
            "minMarks":replaceFilterObj?.marks,
            "maxMarks":replaceFilterObj?.marks,
         }))
    }

    const handleCheck = (questionId:any) => {
        setSelectedQuestions((prev:any[])=>{
            if(prev.includes(questionId))return prev.filter((id:any)=> id !== questionId);
            return [...prev,questionId];
        });
        const newValues = tabledata.map((question:any)=>{
            if(questionId === question.id) question.checked = !question.checked;
            return question;
        });
        setTabledata(newValues);
    };
    const handleSelected=(data:any)=>{
        handleCheck(data.id)
    }

    const renderList = (list: any[]) => {
        // const filteredData =list?.map((data:any)=>({...data,question:data.question.match(/<p>(.*?)<\/p>/)[1]}))?.filter((i:any)=>i?.question?.toLowerCase().includes(searchData.toLowerCase()))
        return list?.map((data: any) => (
            <TableRow key={data.id} id={data.id}>
                <TableCell >
                    {modalData.isMultiSelect ? <CheckBoxComponent
                        checkLabel="Label"
                        disable={false}
                        key={`checkbox-${data.id}`}
                        checkStatus={data.checked}
                        onChangeHandler={(e: any) => handleCheck(data.id)}
                    /> : <RadioGroup
                        name="value"
                        value={selectedRadioValue?.id}
                        onChange={updateSelection}
                    >
                        <FormControlLabel
                            label={''}
                            key={data.id}
                            value={data.id}
                            control={
                                <Radio
                                    sx={{
                                        ' &.Mui-checked': {
                                            color: '#01B58A !important',
                                        },
                                    }}
                                />}

                        />
                    </RadioGroup>
                    }
                </TableCell>
                <TableCell>
                    <div className={`${data?.question.indexOf("<table>") > -1 ? "replaceQuestionListSect tableDataQuestion" : "tableDataQuestion"}`} style={{ height: '38px', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
                        <div style={{ flex: '1', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, textOverflow: 'ellipsis', whiteSpace: 'normal', wordWrap: 'break-word' }}>
                            <div dangerouslySetInnerHTML={{ __html: getQuestionTitle(data) }}></div>
                        </div>
                    </div>
                </TableCell>
                <TableCell>
                    <div>
                        {data.marks}
                    </div>
                </TableCell>

                <TableCell>
                    <div className='tableDataCreatedBy'>
                        {data.createdByUser}
                    </div>
                </TableCell>
                <TableCell align="left">
                    <div onClick={() => { replacePreview(data?.id) }} style={{ display: "flex", color: "#01B58A", gap: '1px', cursor:"pointer", marginLeft: "-20px" }}>
                        Preview
                        <KeyboardArrowRightIcon />
                    </div>
                </TableCell>
            </TableRow>
        ))
    }
    const fetchMoreData = async () => {
        if (pgNo+1 >= totalPage) {

            setLoadMore(false)
        } else {
            setPgNo((totalPage) > pgNo ? pgNo + 1 : pgNo);
        }
    };
    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div >
                    <Box sx={style} className='replaceQuestionModal'>
                    <FormProvider {...methods} >
                        <div className='replaceQuestionsContent'>
                            <h2 className='replaceQuestionsHeading'>{modalData.title}</h2>
                            <p className='replaceQuestionsSubHeading'>{modalData.subDescription}</p>
                            <div className="closeDeleteIcon" onClick={handleClose}>
                                <img src={closeIcon} style={{ width: "16px" }} />
                            </div>
                            <div className='d-flex replaceSearchSect mt-4 pt-3' style={{gap:"10px"}}>
                                <div className='w-70'><InputFieldComponentForForm registerName={'textReplace'} inputType={"text"} label={"Search for Questions..."} required={false} onChange={()=>{}} onChangehandle={(e: any) => changeHandler(e, 'textReplace')} inputSize={"Large"} variant={""}/></div>
                                <div className='selectMultiCreatedBy w-30'><DropdownWithCheckbox trigger={trigger} setCompval={setCompval} setpostObj={setpostObj} preSetVal={preSetVal} registerName="createdById"  required={true}  value={methods?.getValues('createdById')} variant={'fill'} selectedValue={''} clickHandler={(e: any) => changeHandler(e, 'createdBy')} selectLabel={'Created By'} selectList={createdBy} disabled={createdBy.length > 0 ? false : true} mandatory={true} showableLabel={"title"} showableData={"id"} menuHeader={"Select Created By"} /></div>
                            </div>
                            {methods?.getValues("createdById").length===0 && !spinnerStatus &&<div style={{"textAlign":"right","fontSize":"14px","color":"red","paddingRight":"5px"}}><span>*Atleast one selection is mandatory</span></div>}
                            <div className='col-12 d-flex justify-content-between py-3' style={{ gap: '10px' }}>
                                    {modalData.isMultiSelect ? <div className='selectMultiSubject w-100'> <DropdownWithCheckbox preSetVal={preSetVal} registerName="subjectId" required={true} variant={'fill'} value={methods?.getValues('subjectId')} selectedValue={''} clickHandler={(e: any) => { setReorderStatus(false);changeHandler(e, 'subject') }} selectLabel={'Subject'} selectList={subject} disabled={!modalData.isMultiSelect} mandatory={true} showableLabel={"courseDisplayName"} showableData={"courseId"} menuHeader={"Select Subject"} /> </div>
                                        : <div className='selectMultiSubject w-100'><DropdownWithCheckbox trigger={trigger} setCompval={setCompval} setpostObj={setpostObj} preSetVal={preSetVal} registerName="subjectId" required={true} value={methods?.getValues('subjectId')} variant={'fill'} selectedValue={''} clickHandler={(e: any) => changeHandler(e, 'subject')} selectLabel={'Subject'} selectList={subject} mandatory={true} showableLabel={"courseDisplayName"} showableData={"courseId"} menuHeader={"Select Subject"} /></div>}

                                {/* <div className={`selectMultiTheme w-100 ${(theme.length == 0 && methods?.getValues('subjectId')?.length > 0) ? 'd-none' : ''}`}><DropdownWithExpandCheckbox trigger={trigger} setCompval={setCompval} setpostObj={setpostObj} preSetVal={preSetVal} registerName="themeId"  required={(theme?.length > 0 && methods?.getValues('subjectId')?.length > 0) ? true : false} variant={'fill'} value={methods?.getValues('themeId')} selectedValue={''} clickHandler={(e: any) => changeHandler(e,'theme')} selectLabel={'Theme'} selectList={theme} disabled={theme.length > 0 ? false : true} mandatory={true} showableLabel={"syllabusName"} showableData={"syllabusID"} menuHeader={"Select Theme*"} /></div> */}
                                <div className='selectMultiChapter w-100'><DropdownWithExpandCheckbox   setCompval={setCompval} setpostObj={setpostObj} trigger={trigger} preSetVal={preSetVal} registerName="chapterId"  required={true} variant={'fill'} value={methods?.getValues('chapterId')} selectedValue={''} clickHandler={(e: any) => changeHandler(e, 'Chapter')} selectLabel={'Chapter'} selectList={chapter} disabled={chapter.length > 0 ? false : true} mandatory={true} showableLabel={"chapterName"} showableData={"chapterId"} menuHeader={"Select Chapter"} reorderStatus={reorderStatus} setReorderStatus={setReorderStatus}/></div>
                                <div className='selectMultiTopic w-100'><DropdownWithCheckbox  setCompval={setCompval}  setpostObj={setpostObj} trigger={trigger} preSetVal={preSetVal} registerName="topicId" required={true} variant={'fill'} value={methods?.getValues('topicId')} selectedValue={''} clickHandler={(e: any) => { changeHandler(e, 'topic') }} selectLabel={'Topic'} selectList={topics} disabled={topics.length > 0 ? false : true} mandatory={true} showableLabel={"topicNameWithChapter"} showableData={"topicId"} menuHeader={"Select Topic"} /></div>
                            </div>
                            <div className='col-12 d-flex ' style={{ gap: '10px' }}>
                                <div className='selectMultiQuestionType w-100'><DropdownWithCheckbox  setCompval={setCompval} trigger={trigger} setpostObj={setpostObj} preSetVal={preSetVal} registerName="questionTypeIds" required={true} variant={'fill'} value={methods?.getValues('questionTypeIds')} selectedValue={''} selectList={QuestionType} clickHandler={(e: any) => changeHandler(e, "questionTypeIds")} selectLabel={"Question Type"} disabled={false}  mandatory={true} showableLabel={"title"} showableData={"id"} menuHeader={"Select Question Type"}/></div>
                                <div className='selectMultiQuestionLevel w-100'><DropdownWithCheckbox setCompval={setCompval}  trigger={trigger} setpostObj={setpostObj} preSetVal={preSetVal} registerName="questionLevelIds" required={true} variant={'fill'} value={methods?.getValues('questionLevelIds')} selectedValue={''} selectList={questionLevel} clickHandler={(e: any) => changeHandler(e, "questionLevelIds")} selectLabel={"Difficulty"} disabled={false}  mandatory={true} showableLabel={"level"} showableData={"id"} menuHeader={"Select Question Type"}/></div>
                                <div className='selectMultiMarks w-70'><PointFilter trigger={trigger} getQueryPoints={(param: string, type: string) => { getQueryPoints(param, type) }} disable={false} preSetVal={marksPreSet} label={"marks"} nullable={true} /></div>
                                <div>{enableOverAllClearFilter ? <img src={ClearFilter} onClick={()=>{presetValueHandler()}} style={{cursor:'pointer'}} /> :<img src={BlurClearFilter} /> } </div>
                            </div>
                                {maxQuestionModal && <ModalQuestion type="Text" open={maxQuestionModal} onClose={() => { setMaxQuestionModal(false) }} onDone={(data) => {
                                    randomSelection(data, tabledata)
                                    setMaxQuestionModal(false);
                                    }}
                                    totalLength={tabledata?.length}
                                    title='Select Random' subDescription='Enter the no of question you want to select randomly' />}
                                {tabledata?.length > 0 ?
                                    <InfiniteScroll
                                        dataLength={tabledata.length}
                                        next={fetchMoreData}
                                        hasMore={loadMore}
                                        loader={spinnerStatus && <Spinner />}
                                        height={280}
                                        //  endMessage={
                                        //     <p style={{ textAlign: 'center'}}>
                                        //       <b>Yay! You have seen it all</b>
                                        //     </p>
                                        //   }
                                        className="infiniteGridView"
                                    >
                            <TableContainer>
                                <Table>
                                    <TableHead sx={{ height: '52px', '& .MuiTableCell-root': { padding: "7px" } }}>
                                        <TableRow>
                                            <TableCell ></TableCell>
                                            <TableCell >
                                                <div className="tableheaddata">
                                                    question
                                                </div>
                                            </TableCell>
                                            <TableCell >
                                                <div className="tableheaddata">
                                                    marks
                                                </div>
                                            </TableCell>
                                            <TableCell >
                                                <div className="tableheaddata">
                                                    created by
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="tableheaddata">Actions</div>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody sx={{ '& .MuiTableCell-root': { height: '52px', padding: '7px', verticalAlign: 'middle' } }}>
                                        {!spinnerStatus && modalData.isMultiSelect && renderList(tabledata)}
                                        {!spinnerStatus && !modalData.isMultiSelect && renderList(tabledata)}
                                    </TableBody>

                                </Table>
                                    </TableContainer>
                                    </InfiniteScroll>
                                    :
                                    <EmptyScreen style={{ "height": "200px" }} title={'No available questions'} desc={'Please contact your Navneet TopTech Representative'} />
                                }

                            <div>

                            </div>
                        </div>
                        <div className='tableFooter'>
                            { modalData.isQuestionCount && <div className="col-4 d-flex justify-content-start mt-4">
                                Selected: {selectedQuestions.length} Questions
                            </div>}
                            <div className={`${modalData.isQuestionCount ? 'col-8' : 'col-12'} d-flex justify-content-end mt-4`} style={{ gap: '10px', margin:'20px' }}>
                                <ButtonComponent type={'outlined'} label={'Cancel'} backgroundColor={'#01B58A'} textColor={'#1B1C1E'} buttonSize={'Medium'} minWidth={'201'} onClick={handleClose} />
                                <ButtonComponent type={'contained'} label={'Select Random'} backgroundColor={'#01B58A'} textColor={''} buttonSize={'Medium'} minWidth={'201'} disabled={tabledata.length>0?false:true} onClick={(e:any)=>{selectRandomHandler()}}/>
                                <ButtonComponent type={'contained'} label={modalData.type == "Add" ? 'Add Selected' : 'Replace'} backgroundColor={'#01B58A'} textColor={''} disabled={((methods.getValues("radioValue") || selectedQuestions.length > 0)&& tabledata.length > 0)?false:true} buttonSize={'Medium'} minWidth={'201'} onClick={(e:any)=>{
                                  if(modalData.isMultiSelect){
                                    addQuestionApiCall()
                                  }else{
                                    putReplaceApiCall()
                                  }
                                
                                }}/>
                            </div>
                        </div>
                    </FormProvider>
                        {spinnerStatus && <Spinner/>}   
                    </Box>

                </div>
            </Modal>
            {openPreviewImg && <PreviewModalImage header={''} openPreview={openPreviewImg} setOpenPreview={setOpenPreviewImg} content={imgContent} setContent={setImgContent} />}
            {(replacePreviewClose && replacePreviewData) && <ReplacePreviewModalComponent checked={selectedQuestions.includes(replacePreviewData?.id)} header={''} modelOpen={replacePreviewClose} setOpenPreview={setReplacePreviewClose} selectedData={replacePreviewData} manual={modalType === "REPLACE_QUESTION" ? 'Replace': 'Add'}  updateSelection={ updateSelection} setSelected={(selectedData)=> handleSelected(selectedData)} allFilters={allFilters} />}
        </div>
    );

}
   


export default MIFReplaceQuestionModal;