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
import "./ReplaceQuestionModal.css";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import RadioButtonComponent from '../../SharedComponents/RadioButtonComponent/RadioButtonComponent';
import PreviewMultiSelectComponent from '../../SharedComponents/PrefixMultiSelectComponent/PrefixMultiSelectComponent';
import ButtonComponent from '../../SharedComponents/ButtonComponent/ButtonComponent';
import { getReplaceQnsTableApi, getReplaceQnsTablePreview } from '../../../Api/QuestionPaper';
import DropdownWithCheckbox from '../../SharedComponents/DropdownWithCheckbox/DropdownWithCheckbox';
import Spinner from '../../SharedComponents/Spinner';
import { baseFilterApi, createdByReplaceApi, getThemesApi, putReplaceApi, selectFieldApi, selectFieldQueTypeApi } from '../../../Api/AssessmentTypes';
import { getLocalStorageDataBasedOnKey } from '../../../constants/helper';
import { State } from '../../../types/assessment';
import { useForm, FormProvider } from "react-hook-form";
import PointFilter from '../../AssessmentsContainer/pointerFilter';
import ReplacePreviewModalComponent from '../QuestionPaperOPTScreen/ReplacePreviewModalComponent';
import InputFieldComponentForForm from '../../SharedComponents/FormFieldComponents/InputFieldComponent';
import { FormControlLabel, RadioGroup } from "@mui/material";
import Radio from '@mui/material/Radio';
import PreviewModalImage from '../../AssessmentsContainer/CreateNewQuestion/PreviewModalComponent/PreviewModalImage';
import ClearFilter from "../../../assets/images/ClearFilter.svg"
import BlurClearFilter from "../../../assets/images/BlurClearFilter.svg"
import EmptyScreen from '../../SharedComponents/EmptyScreen/EmptyScreen';
import DropdownWithExpandCheckbox from '../../SharedComponents/DropdownWithCheckbox/DropdownWithExpandedCheckbox';
import SingleSelect from '../../SharedComponents/DropdownWithCheckbox/SingleSelect';
import { useLocation } from 'react-router';

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
    qpCourses?:any
}

const ReplaceQuestionModal : React.FC<props> = ({qpCourses,open,handleClose,replaceFilterObj,ReqBody,replace,replaceQp}) => {
    const [preSetVal,setPreSetVal]=React.useState<any|null>({
        subjectId: [],
        themeId: [],
        chapterId: [],
        topicId: [],
        questionTypeId:[],
        questionLevelId:[],  
        minMarks:"",
        maxMarks:"",
        createdById:[],
      })
    const [compPresetval,setCompval]=React.useState<any|null>({
        subjectId: [],
        themeId: [],
        chapterId: [],
        topicId: [],
        questionTypeId:[],
        questionLevelId:[],  
        minMarks:"",
        maxMarks:"",
        createdById:[],
      })
    const location = useLocation();

    let isOnlineAssessment = location?.pathname?.split('/')?.includes("onlineAssesment");
    const [trigger,settrigger]=React.useState<boolean>(false)
    const [marksPreSet,setMarksPreSet]=React.useState<any|null>(null)
    const [paperId,setPaperId]=React.useState<any|null>(null)
    const [initialValues, setInitialValues] = React.useState({
        subjectId: [],
        themeId: [],
        chapterId: [],
        topicId: [],
        questionTypeId:[],
        questionLevelId:[],  
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
    let minMaxCall:boolean=false;
    const [selectedRadioValue, setSelectedRadioValue] = React.useState({id:''})
    const [openPreviewImg, setOpenPreviewImg] = React.useState<boolean>(false)
    const [imgContent, setImgContent] = React.useState<string>("")
    const [allFilters, setAllFilters] = React.useState<any>()
    const [postObj,setpostObj]=React.useState<any>({
        subjectId:[],
        chapterId:[],
        themeId:[],
        topicId:[],
        questionTypeId:[],
        questionLevelId:[],
        minMarks:"",
        maxMarks:"",
        createdById:[],
        radioValue:"",
        textReplace:""
    })
    let excludeId:any=[];
    const [themeData, setThemeData] = React.useState<any[]>([])
    const [chapterDataArr,setChapterDataArr]=React.useState<any>([])     
    const stateDetails = JSON.parse(getLocalStorageDataBasedOnKey('state') as string) as State;
    const [timeoutId, setTimeoutId] = React.useState(null);
    const [reorderStatus, setReorderStatus] = React.useState(false)
   const [tabledata,settabledata]=React.useState<any[]>([])
    const maxGreatMin=( +postObj?.maxMarks >+postObj?.minMarks || +postObj?.minMarks == +postObj?.maxMarks)?true:false;
    const mincondiCheck=postObj?.minMarks && +postObj?.minMarks>0 && (maxGreatMin)?true:false;
    const maxcondiCheck=postObj?.maxMarks && +postObj?.maxMarks>0 &&(maxGreatMin)?true:false;
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

     const getReplaceQnsTableData=async()=>{
         excludeQns();
        const markHandler=minMaxApiHandler();
        if(!markHandler && methods?.getValues("createdById").length>0){
            const questionIds = QuestionType && QuestionType?.length > 0 && QuestionType?.map((el: any) => el?.id);
            setSpinnerStatus(true)
         const params={
            "pageNo":pgNo,
            "pageSize":1000,
             "questionTypeIds": isOnlineAssessment ? (methods?.getValues("questionTypeId").length === 0 ? questionIds.toString() : methods?.getValues("questionTypeId").toString()) : methods?.getValues("questionTypeId").toString() || null,
            "published":true,
            "gradeIds":replace?.gradeID,
            "subjectIds":methods?.getValues("subjectId").toString()||null,
            "chapterIds":methods?.getValues("chapterId").toString()||null,
            "themeIds":methods?.getValues("themeId").toString()||null,
            "topicIds":methods?.getValues("topicId").toString()||null,
            "minMarks":mincondiCheck? postObj?.minMarks:null,
            "maxMarks": maxcondiCheck? postObj?.maxMarks:null,
            "questionLevelIds":methods?.getValues("questionLevelId").toString()||null,
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
         setSelectedRadioValue({id:''})
         settabledata(res?.baseResponse?.data??[])
         setTimeout(()=>{
             setSpinnerStatus(false)
         },300)
        }
     }
    
     const subApiCall = async (gradeId:any) => {
         setSpinnerStatus(true)
        if(replace?.gradeID ){
            const response:any = await baseFilterApi("subjects", { "gradeId": replace?.gradeID && [replace?.gradeID], "publicationId": 0, "staffId": stateDetails.login.userData.userRefId  })
            if (response.status == '200') {
                if(qpCourses && qpCourses?.length >0){
                    setSubject(response?.data?.filter((x:any)=>qpCourses?.includes(x?.courseId))||[])
                }else{
                    setSubject(response?.data)
                }
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

      const getFilteredChapterThemeData = (themeData:any, chapterData:any) => {
        let filterchapterData = themeData?.map((x:any) => x?.chapters)?.flat()       
        let chapterAndThemeData:any = chapterData?.map((ele:any,i:number)=>{
          const formedObj = ele?.childOptions?.map((subEle:any,i:number)=>{
            const isIncludedObj = filterchapterData.find((obj:any) => obj.id === subEle?.value);      
            if(isIncludedObj){
               return {...subEle,label:isIncludedObj?.name}
            }else{
              return {...subEle}
            }
          })
          return {...ele , childOptions: [...formedObj]};
        })
        return chapterAndThemeData
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
            const chaptersWithTheme = await baseFilterApi("chaptersWithTheme", { "gradeId": [replace?.gradeID], "courseId": replace?.courses?.map((x: any) => x?.courseID) })
            setChapter(getFilteredChapterThemeData(chaptersWithTheme.data, subjectWithChapter))
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
    const addCourseNameQT = ((QTData: any) => {
        QTData.map((items: any) => {
            items.title = items.title + " ( " + items.courseName + " )"
        })
        return QTData
    }) 
      const QuestionTypeApi = async (param:any) => {
        if(param.length >0){
            setSpinnerStatus(true)
            try {
                const response = await selectFieldQueTypeApi(`&subjectIds=${param}`)
                if (response && response?.baseResponse && response?.baseResponse?.data?.length) {
                    if (isOnlineAssessment) {
                        setQuestionTypeData(addCourseNameQT(response?.baseResponse?.data.filter((i:any)=>i.type == 'MCQ')));
                    } else {
                    setQuestionTypeData(addCourseNameQT(response?.baseResponse?.data))
                    }
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
                const createBy:any =response?.map((x:any)=>(x?.id))
                setPreSetVal((prev:any)=>({...prev,"createdById":createBy}))
                setCompval((prev:any)=>({...prev,"createdById":createBy}))
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
        questionTypeId:methods?.getValues("questionTypeId"),
        questionLevelId:methods?.getValues("questionLevelId"),  
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
    case 'questionTypeId':
        methods?.setValue('questionTypeId',e)
        setpostObj((prev:any)=>({...prev,questionTypeId:e}))
        break
    case 'questionLevelId':
        methods?.setValue('questionLevelId',e)
        setpostObj((prev:any)=>({...prev,questionLevelId:e}))
        break
    case 'createdBy':
        methods?.setValue('createdById',e)
        setpostObj((prev:any)=>({...prev,createdById:e}))
        break
    }
 }
 const getQueryPoints = (param: string, type: string) => {
    minMaxCall=true
    if (type == "min") {
        setpostObj((prev:any)=>({...prev, minMarks: param }))
    }
    if (type == "max") {
        setpostObj((prev:any)=>({...prev,  maxMarks: param }))
    }
    if (type == "empty") {
        setpostObj((prev:any)=>({...prev , maxMarks: "", minMarks:""}))
        if ((postObj?.minMarks == "" && postObj?.maxMarks == "")) {
            minMaxCall=false
            getReplaceQnsTableData()
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
    secondValue:any,
    replacementObject:any
  ) => {
    const traverseJson = (obj:any) => {
      for (const key in obj) {
        if ((typeof obj[key] === "object" || typeof obj[key] === "number") && obj[key] !== null) {
          if (
            obj[key] &&
            obj[key] === mainValue[secondKey] &&
            obj.hasOwnProperty("type") &&
            obj["type"] === "Question"
          ) {
            // const replacementObject = tabledata.find(
            //   (item:any) => item[secondKey] === secondValue
            // );
            if (replacementObject) {
              obj["marks"]= replacementObject?.marks
              obj[mainKey] = replacementObject;
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
    if(methods?.getValues("radioValue") && paperId && replaceFilterObj?.id){
    const previewData =await getReplaceQnsTablePreview(methods?.getValues("radioValue")) 
    const { updatedJson, originalJson } = findAndReplaceData(
        ReqBody,
        "questionInfo",
        { id: replaceFilterObj?.id },
        "id",
        +methods?.getValues("radioValue"),
        previewData?.data
      );
     replaceQp(updatedJson)
     handleClose()
     setSpinnerStatus(false)
    }
}
(window as any).handleClick = (key: any, event: any) => {
    setOpenPreviewImg(true)
    setImgContent(key)
};

const getQuestionTitle = (dataList: any) => {
    let str = dataList?.question;
    dataList?.questionImageDetails?.forEach((questionImage: any) => { 
      str = str?.replace(
        `{{${questionImage?.key}}}`,
        `<span class="listImageTag" onclick="handleClick('${questionImage?.src}',event)">${questionImage?.tag}</span>`
      );
    });
    return str;
  };
const selectRandomHandler=()=>{
    const availarrLen=tabledata?.length
    const random = Math.floor(Math.random() * availarrLen);
    setSelectedRadioValue({id:tabledata[random]?.id});
    methods?.setValue('radioValue',tabledata[random]?.id);
}
React.useEffect(() => {
    if (postObj?.minMarks && postObj?.maxMarks) {
        getReplaceQnsTableData();
    }
    if ((postObj?.minMarks == "" && postObj?.maxMarks == "")) {
        minMaxCall=false
        getReplaceQnsTableData();
    }
}, [postObj?.minMarks, postObj?.maxMarks])

    const getChaperWithTheme = async (replace: any) => {
        const chaptersWithTheme = await baseFilterApi("chaptersWithTheme", { "gradeId": [replace?.gradeID], "courseId": replace?.courses?.map((x: any) => x?.courseID) })
        setThemeData(chaptersWithTheme?.data ?? []);
    }


    React.useEffect(() => {
        if(replace) getChaperWithTheme(replace)
    }, [replace])

    const getFilteredChapterData = () => {
        let filterThemeData:any = [];
        if(themeData.length>0){
          filterThemeData = themeData.filter((e) => { return e.themes })
          filterThemeData = filterThemeData.map((e:any) => {return e.themes})
        }
        let chapterData = []
        if(filterThemeData.length>0){
          for (let x of filterThemeData) {
            for (let y of x) {
              y.chapters.forEach((e:any) => {
                 e.themeName = y.name
                 e.themeId = y.id
              })
              chapterData.push(y.chapters)
            }
          }
          setChapterDataArr(chapterData?.flat())
        }
      }

      React.useEffect(() => {
        if(themeData?.length > 0){
          getFilteredChapterData();
        }
      },[themeData])
    
    React.useEffect(()=>{
    if(replace?.gradeID){
        subApiCall(replace?.gradeID)
        QuestionLevelApi()
        createdByApi()
    }
    },[replace?.gradeID])

    let newTimeoutId:any;
    React.useEffect(()=>{
        if(replace?.gradeID){
    if (timeoutId) {
        clearTimeout(timeoutId);
      }
      newTimeoutId = setTimeout(() => {
        getReplaceQnsTableData();
      }, 500);
      setTimeoutId(newTimeoutId); 
        }
     },[postObj])

     React.useEffect(() => {
        return () => {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
        };
      }, [timeoutId]);

    React.useEffect(()=>{
     setPaperId(replace?.paperId)
    },[replace?.paperId])

    React.useEffect(()=>{
        presetValueHandler()
    },[replaceFilterObj])

    React.useEffect(()=>{
        if (QuestionType?.length === 0) {
            QuestionTypeApi(methods?.getValues("subjectId"));
          }
        chapterApi(null, methods?.getValues("subjectId"));
    },[methods?.getValues("subjectId")])

    React.useEffect(()=>{
        TopicApi(null, methods?.getValues("chapterId"))
    },[methods?.getValues("chapterId")])


    const [replacePreviewClose, setReplacePreviewClose] = React.useState(false)
    const [replacePreviewData, setReplacePreviewData] = React.useState();

    const replacePreview = async (id:string) => {
        await excludeQns();
        const questionIds = QuestionType && QuestionType?.length > 0 && QuestionType?.map((el: any) => el?.id);
        const params = {
            "questionTypeIds": isOnlineAssessment ? (methods?.getValues("questionTypeId") ? questionIds?.toString() : methods?.getValues("questionTypeId").toString()) : methods?.getValues("questionTypeId").toString() || "",
            "published":true,
            "gradeIds":replace?.gradeID,
            "subjectIds":methods?.getValues("subjectId").toString()||"",
            "chapterIds":methods?.getValues("chapterId").toString()||"",
            "themeIds":methods?.getValues("themeId").toString()||"",
            "topicIds":methods?.getValues("topicId").toString()||"",
            "minMarks":mincondiCheck? postObj?.minMarks:"",
            "maxMarks": maxcondiCheck? postObj?.maxMarks:"",
            "questionLevelIds":methods?.getValues("questionLevelId").toString()||"",
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
        const chapterIDs = replace?.chapters?.map((el: any) => el?.chapterID);
        const QuestionTypeID= QuestionType?.find((i:any)=> i.questionTypeId === replaceFilterObj?.questionTypeIds?.[0])?.id;

        settrigger((prev:boolean)=>!prev)
        setPreSetVal((prev:any)=>({
            ...prev,
            "subjectId":[replaceFilterObj?.courseId],
            "themeId":[replaceFilterObj?.questionInfo?.themeId],
            "chapterId": replaceFilterObj?.questionInfo == null ? chapterIDs : replaceFilterObj?.questionInfo?.chapterId ? [replaceFilterObj?.questionInfo?.chapterId] : replaceFilterObj?.chapterIds,
            "topicId":[replaceFilterObj?.questionInfo?.topicId],
            "questionTypeId":[replaceFilterObj?.questionInfo?.questionTypeMasterId || QuestionTypeID],
            "questionLevelId":[replaceFilterObj?.questionInfo?.questionLevelId || replaceFilterObj?.difficultyIds],
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
    React.useEffect(() => {
        if (QuestionType?.length > 0) {
          presetValueHandler();
        }
      }, [QuestionType]);
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
                                <h2 className='replaceQuestionsHeading'>Replace Questions</h2>
                            <p className='replaceQuestionsSubHeading'>Select the question that you want to replace on the generated question paper</p>
                            <div className="closeDeleteIcon" onClick={handleClose}>
                                <img src={closeIcon} style={{ width: "16px" }} />
                            </div>
                            <div className='d-flex replaceSearchSect mt-4 pt-3' style={{gap:"10px"}}>
                                <div className='w-70'><InputFieldComponentForForm registerName={'textReplace'} inputType={"text"} label={"Search for Questions..."} required={false} onChange={()=>{}} onChangehandle={(e: any) => changeHandler(e, 'textReplace')} inputSize={"Large"} variant={""}/></div>
                                <div className='selectMultiCreatedBy w-30'><DropdownWithCheckbox trigger={trigger} setCompval={setCompval} setpostObj={setpostObj} preSetVal={preSetVal} registerName="createdById"  required={true}  value={methods?.getValues('createdById')} variant={'fill'} selectedValue={''} clickHandler={(e: any) => changeHandler(e, 'createdBy')} selectLabel={'Created By'} selectList={createdBy} disabled={createdBy.length > 0 ? false : true} mandatory={true} showableLabel={"title"} showableData={"id"} menuHeader={"Select Created By"} /></div>
                            </div>
                            {methods?.getValues("createdById").length===0 && !spinnerStatus &&<div style={{"textAlign":"right","fontSize":"14px","color":"red","paddingRight":"5px"}}><span>*Atleast one selection is mandatory</span></div>}
                            <div className='col-12 d-flex justify-content-between py-3' style={{ gap: '10px' }}>
                                <div className='selectMultiSubject w-100'><SingleSelect  trigger={trigger} setCompval={setCompval} setpostObj={setpostObj}preSetVal={preSetVal} registerName="subjectId"  required={true}  value={methods?.getValues('subjectId')} variant={'fill'} selectedValue={''} clickHandler={(e: any) => {setReorderStatus(false);changeHandler(e, 'subject')}} selectLabel={'Subject'} selectList={subject} disabled={false} mandatory={true} showableLabel={"courseDisplayName"} showableData={"courseId"} menuHeader={"Select Subject"} /></div>
                                {/* <div className={`selectMultiTheme w-100 ${(theme.length == 0 && methods?.getValues('subjectId')?.length > 0) ? 'd-none' : ''}`}><DropdownWithExpandCheckbox trigger={trigger} setCompval={setCompval} setpostObj={setpostObj} preSetVal={preSetVal} registerName="themeId"  required={(theme?.length > 0 && methods?.getValues('subjectId')?.length > 0) ? true : false} variant={'fill'} value={methods?.getValues('themeId')} selectedValue={''} clickHandler={(e: any) => changeHandler(e,'theme')} selectLabel={'Theme'} selectList={theme} disabled={theme.length > 0 ? false : true} mandatory={true} showableLabel={"syllabusName"} showableData={"syllabusID"} menuHeader={"Select Theme*"} /></div> */}
                                <div className='selectMultiChapter w-100'><DropdownWithExpandCheckbox   setCompval={setCompval} setpostObj={setpostObj} trigger={trigger} preSetVal={preSetVal} registerName="chapterId"  required={true} variant={'fill'} value={methods?.getValues('chapterId')} selectedValue={''} clickHandler={(e: any) => changeHandler(e, 'Chapter')} selectLabel={'Chapter'} selectList={chapter} disabled={chapter.length > 0 ? false : true} mandatory={true} showableLabel={"chapterName"} showableData={"chapterId"} menuHeader={"Select Chapter"} reorderStatus={reorderStatus} setReorderStatus={setReorderStatus}/></div>
                                <div className='selectMultiTopic w-100'><DropdownWithCheckbox  setCompval={setCompval}  setpostObj={setpostObj} trigger={trigger} preSetVal={preSetVal} registerName="topicId" required={true} variant={'fill'} value={methods?.getValues('topicId')} selectedValue={''} clickHandler={(e: any) => { changeHandler(e, 'topic') }} selectLabel={'Topic'} selectList={topics} disabled={topics.length > 0 ? false : true} mandatory={true} showableLabel={"topicNameWithChapter"} showableData={"topicId"} menuHeader={"Select Topic"} /></div>
                            </div>
                            <div className='col-12 d-flex ' style={{ gap: '10px' }}>
                                <div className='selectMultiQuestionType w-100'><DropdownWithCheckbox  setCompval={setCompval} trigger={trigger} setpostObj={setpostObj} preSetVal={preSetVal} registerName="questionTypeId" required={true} variant={'fill'} value={methods?.getValues('questionTypeId')} selectedValue={''} selectList={QuestionType} clickHandler={(e: any) => changeHandler(e, "questionTypeId")} selectLabel={"Question Type"} disabled={false}  mandatory={true} showableLabel={"title"} showableData={"id"} menuHeader={"Select Question Type"}/></div>
                                <div className='selectMultiQuestionLevel w-100'><DropdownWithCheckbox setCompval={setCompval}  trigger={trigger} setpostObj={setpostObj} preSetVal={preSetVal} registerName="questionLevelId" required={true} variant={'fill'} value={methods?.getValues('questionLevelId')} selectedValue={''} selectList={questionLevel} clickHandler={(e: any) => changeHandler(e, "questionLevelId")} selectLabel={"Difficulty"} disabled={false}  mandatory={true} showableLabel={"level"} showableData={"id"} menuHeader={"Select Question Type"}/></div>
                                    <div className='selectMultiMarks w-70'><PointFilter trigger={trigger} getQueryPoints={(param: string, type: string) => { getQueryPoints(param, type) }} disable={isOnlineAssessment} preSetVal={marksPreSet} label={"marks"} /></div>
                                <div>{enableOverAllClearFilter ? <img src={ClearFilter} onClick={()=>{presetValueHandler()}}/> :<img src={BlurClearFilter} /> } </div>
                            </div>
                            
                            {!spinnerStatus && tabledata?.length >0 ?
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
                                        {!spinnerStatus && tabledata?.map((data) => (
                                            <TableRow>
                                                <TableCell >
                                                <RadioGroup
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
                                                </TableCell>
                                                <TableCell>
                                                    <div className={`${data?.question.indexOf("<table>") > -1 ? "replaceQuestionListSect tableDataQuestion" : "tableDataQuestion"}`} style={{ height: '38px', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
                                                        <div style={{ flex: '1', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, textOverflow: 'ellipsis', whiteSpace: 'normal', wordWrap: 'break-word' }}>
                                                            <div dangerouslySetInnerHTML={{ __html: getQuestionTitle(data).replaceAll("color:#f00", "color:#000000")}}></div>
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
                                                    <div onClick={() => {replacePreview(data?.id)}} className='replacePreviewTtx' style={{ display: "flex", color: "#01B58A", gap: '17px', cursor: "pointer",alignItems:"center" }}>
                                                        Preview
                                                        <KeyboardArrowRightIcon />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}

                                    </TableBody>

                                </Table>
</TableContainer>
:
<EmptyScreen style={{"height":"200px"}} title={'No available questions'} desc={'Please contact your Navneet TopTech Representative'} /> 
}

                            <div>

                            </div>
                        </div>
                        <div className='tableFooter'>
                            <div className='col-12 d-flex justify-content-end mt-4' style={{ gap: '10px', margin:'20px' }}>
                                <ButtonComponent type={'outlined'} label={'Cancel'} backgroundColor={'#01B58A'} textColor={'#1B1C1E'} buttonSize={'Medium'} minWidth={'201'} onClick={handleClose} />
                                <ButtonComponent type={'contained'} label={'Select Random'} backgroundColor={'#01B58A'} textColor={''} buttonSize={'Medium'} minWidth={'201'} disabled={tabledata.length>0?false:true} onClick={(e:any)=>{selectRandomHandler()}}/>
                                <ButtonComponent type={'contained'} label={'Replace'} backgroundColor={'#01B58A'} textColor={''} disabled={(methods.getValues("radioValue")&& tabledata.length > 0)?false:true} buttonSize={'Medium'} minWidth={'201'} onClick={(e:any)=>{putReplaceApiCall()}}/>
                            </div>
                        </div>
                    </FormProvider>
                        {spinnerStatus && <Spinner/>}   
                    </Box>

                </div>
            </Modal>
            {openPreviewImg && <PreviewModalImage header={''} openPreview={openPreviewImg} setOpenPreview={setOpenPreviewImg} content={imgContent} setContent={setImgContent} />}
            {(replacePreviewClose && replacePreviewData) && <ReplacePreviewModalComponent header={''} modelOpen={replacePreviewClose} setOpenPreview={setReplacePreviewClose} selectedData={replacePreviewData} allFilters={allFilters} updateSelection={ updateSelection}/>}
        </div>
    );

}
   


export default ReplaceQuestionModal;