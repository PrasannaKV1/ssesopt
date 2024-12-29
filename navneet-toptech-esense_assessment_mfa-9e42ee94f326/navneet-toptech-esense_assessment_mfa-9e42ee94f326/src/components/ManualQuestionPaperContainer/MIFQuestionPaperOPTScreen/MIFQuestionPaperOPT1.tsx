import React, { useState, useEffect, useRef } from "react";
import "./MIFQuestionPaperOPT1.css";
import { AlertColor, Box} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import SwitchComponent from "../../SharedComponents/SwitchComponent/SwitchComponent";
import Divider from "@mui/material/Divider";
import checkMark from "../../../assets/images/checkMark.svg";
import ButtonComponent from "../../SharedComponents/ButtonComponent/ButtonComponent";
import { Subject, Chapter, Theme, Grade } from '../../../interface/filters';
import { baseFilterApi, baseGradeApi, chaptersWithTheme, getThemesApi, previewGetApi } from "../../../Api/AssessmentTypes";
import { alphanumericNameRegex, getLocalStorageDataBasedOnKey } from "../../../constants/helper";
import { State } from "../../../types/assessment";
import { useForm, FormProvider } from "react-hook-form";
import { useLocation, useNavigate } from 'react-router-dom';
import Spinner from "../../SharedComponents/Spinner";
import { getPreviewTemplate, getTemplateData } from "../../../Api/templateManage";
import { QuestionPaperViewApi, sectionAPI } from "../../../Api/QuestionTypePaper";
import { examTableCount } from "../../../constants/helper";
import PreviewTemplate from "./MIFTemplatePreview/MIFPreviewTemplate";
import { manualQuestionPaperPostAPI, radioGetAPICall } from "../../../Api/QuestionPaper";
import InputFieldComponentForForm from "../../SharedComponents/FormFieldComponents/InputFieldComponent";
import Toaster from "../../SharedComponents/Toaster/Toaster";
import GeneratePrintForPreview from "./MIFGeneratePrintForPreview";
import DropdownWithExpandCheckbox from "../../SharedComponents/DropdownWithCheckbox/MIFDropdownWithExpandedCheckbox";
import DropdownWithCheckbox from "../../SharedComponents/DropdownWithCheckbox/DropdownWithCheckbox";
import ChangeFieldModalPopup from "../../SharedComponents/ModalPopup/ChangeFieldModalPopup";
import DropdownSingleSelect from "../../SharedComponents/DropdownWithCheckbox/DropdownSingleSelect";
import EditingModal from "../../SharedComponents/ModalPopup/EditingModal";
import MIFQuestionsList from "../MIFQuestionsList/MIFQuestionsList";
import { generateQPPayload, templatePart, questionInfo } from "../../../constants/generateQPPayload";

const tabValue = ["QUESTION PAPER BLUEPRINT", 'TOTAL MARKS', "TOTAL TIME", "CREATED BY", "ACTIONS"];

const QuestionPaperOPT1 = () => {
  let shouldLog = useRef(true)
  const { state,pathname } = useLocation();
  const tableScroll: any = useRef();
  const [isEdit, setIsEdit] = useState<number>()  
  const [subject, setSubject] = useState<Subject[]>([])
  const [theme, setTheme] = useState<Theme[]>([])
  const [chapter, setChapter] = useState<Chapter[]>([])
  const [grades, setGrades] = useState<Grade[]>([])
  const [section, setSection] = useState<any[]>([])
  const [spinnerStatus, setSpinnerStatus] = useState(false);
  const stateDetails = JSON.parse(getLocalStorageDataBasedOnKey('state') as string) as State; 
  const [initialValues, setInitialValues] = useState<any>({
    generation: pathname ==="/MIFQuestionpaper" ? 1 : 2,
    nameOfExamination: '',
    gradeId: [],
    subjectId: [],
    themeId: [],
    chapterId: [],   
    sectionId: [],
    radioValue:""
  })
  let history = useNavigate();
  const methods = useForm<any>({
    defaultValues: initialValues,
    mode: "onBlur",
    reValidateMode: "onChange"
  });
  const [tableData, setTableData] = useState<any>([])
  const [isLastPage, setIsLastPage] = useState<boolean>(false);
  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [previewTemplateOpenStatus, setPreviewTemplateOpenStatus] = useState<boolean>(false);
  const [previewTemplateData, setPreviewTemplateData] = useState();
  const [stepCPreview, setStepCPreview] = useState<any>();
  const [stepCPreviewBody, setStepCPreviewBody] = useState();
  const [sortDetails, setSortDetails] = useState<any>({
    sortColName: '',
    sortColOrder: '',
  });
  const [selectedRadioValue, setSelectedRadioValue] = React.useState({id:''})
  const [snackBar, setSnackBar] = useState<boolean>(false);
  const [snackBarText, setSnackBarText] = useState<string>("");
  const [SnackBarSeverity, setSnackBarSeverity] = useState<AlertColor>("success");
  const [generateLoader, setGenerateLoader] = useState(false);
  const [enableBtn, setEnableBtn] = useState(true);
  const [enableSteps, setEnableSteps] = useState<string[]>(['a'])
  const [triggerBtn, setTriggerBtn] = useState(false);
  const [gradeChangePopup,setGradeChangePopup] = useState<boolean>(false)
  const [subjectChangePopup,setSubjectChangePopup] = useState<boolean>(false)
  const [chapterChangePopup,setChapterChangePopup] = useState<boolean>(false)
  const [themeChangePopup,setThemeChangePopup] = useState<boolean>(false)
  const [latestId,setLatestId] = useState<any>({})
  const [isChange,setIsChanges] = useState<boolean>(false)
  const [isContinue,setIsContinue] = useState<boolean>(false)
  let chapterCollect:any=[];
  let themeCollect:any=[];
  const [prepopChapthemeId,setprepopChapthemeId]=useState<any>({"themeId":[],"chapterId":[]})
  const [duplithemeChap,setduplithemeChap]=useState<any>([{theme:'',chapter:''}])
  const [initialFormDefault, setInitialFormDefault] = useState({})
  const [continueEditing,setcontinueEditing] = useState<boolean>(false)
  const [questions, setQuestions] = useState<Array<any>>([])
  const [changeModal, setChangeModal] = useState(false)
  const [tempSelectedChap, setTempSelectedChap] = useState<number[]>([])
  const [tempSelectedTheme, setTempSelectedTheme] = useState<number[]>([])
  
  const updateSelection = (event: any, value: any) => {
    event.persist();
    setSelectedRadioValue({id:value});
    methods?.setValue('radioValue',value);
  };
  const generation=pathname === "/MIFQuestionpaper"
  
  const getTableData = async () => {
    let postObj = {
      'pageNumber': 0,
      "orderByColumn": sortDetails?.sortColName || '',
      "orderBy": sortDetails?.sortColOrder || '',
      "isSchoolTemplate": 0,
      "limit": pageNumber * examTableCount,
      'status':[16],
      "templateType": [2],
      'gradeIds':[methods?.getValues('gradeId')],
      'courseIds':methods?.getValues('subjectId')
    }
    if (postObj?.gradeIds?.length > 0 && postObj?.courseIds?.length > 0) {
    const resp = await getTemplateData({...postObj, courseExactMatch: true})
    setTableData(resp?.data)
    const { totalRecords } = resp || {};
    const count =
      Math.ceil(totalRecords / examTableCount) === 0
        ? 1
        : Math.ceil(totalRecords / examTableCount);
    setIsLastPage(
      totalRecords <= examTableCount || !resp?.data
    );
    if (!isNaN(count)) setPageCount(count);
  }
  else {
    setTableData([])
    setPageNumber(1)
  }
  }

  const findReplaceKey = (ObjKey: any, index:number) => {
    if (ObjKey?.children.length > 0 && ObjKey?.type !== "Question") {
      ObjKey?.children.map((previewObjChild: any,indexLoop:number) => {
        findReplaceKey(previewObjChild,indexLoop)
      })
    }else if(ObjKey?.type === "Question"){
      chapterCollect = Array.from(
        new Set([...chapterCollect,...ObjKey?.chapterIds])
    );
      themeCollect  =Array.from(
        new Set([...themeCollect])
      )
    setprepopChapthemeId((prev:any)=>({"themeId":themeCollect,"chapterId":chapterCollect}))
    }
  }

 const chapThemePrePopulate =(data:any)=>{
  setprepopChapthemeId({"themeId":[],"chapterId":[]})
  chapterCollect=[]
  themeCollect=[]
  data?.bodyTemplate?.templateBuilderInfo?.templateParts.map((previewObj: any,index:number) => {
        findReplaceKey(previewObj, index)
 })
}

  const clickActionHandler = async (d: any, isPreview: boolean) => {
    if (isPreview) {
      const previewTemplateData = await getPreviewTemplate(d?.id);
      if (previewTemplateData.status == '200') {
        if (isPreview) {
          setPreviewTemplateOpenStatus(true)
          setPreviewTemplateData(previewTemplateData?.data);
          return;
        }
      }
    }
    if (!isPreview) {
      const radioResponse = await radioGetAPICall(`templateId=${d?.id}`)
      if (radioResponse?.result?.responseCode == 0) {
        chapThemePrePopulate(radioResponse?.data)
        setStepCPreview(radioResponse?.data)
        setStepCPreviewBody(radioResponse?.data)
        let dataModel:any= {}
        const templateParts = radioResponse?.data?.bodyTemplate?.templateBuilderInfo?.questionPaperFontMetaData;
        Object.keys(templateParts?templateParts:{})?.forEach(function (key, value) {
          dataModel[key] = "0"
        })
        setInitialFormDefault(dataModel)
        }
    }
  };

  /*Grades API*/
  const gradesAPI = async () => {
    try {
      setSpinnerStatus(true)
      const response = await baseGradeApi("staffActiveGrades", stateDetails.login.userData.userRefId)
      if (response?.status === "200") {
        setGrades(response?.data)
        setSpinnerStatus(false)
      }
    } catch (err) {
      setSpinnerStatus(false)
      console.log(err)
    }
  }

  /*get section APi call*/
  const sectionApi = async (e: any) => {
    setSpinnerStatus(true)  
    try {  
      if(e != null){    
      const response = await sectionAPI(stateDetails.login.userData.userRefId)
      if (Object.keys(response)?.length > 0 && Object.keys(response?.data)?.length > 0 && response?.data?.classDetails?.length > 0) {
        let gradeIds = grades[e]?.es_gradeid ? grades[e]?.es_gradeid : e
        const sectionGrades = response?.data?.classDetails?.filter((a: any, i: number) => a?.es_gradeid == gradeIds)
        var result = sectionGrades.reduce((uniqueData: any, o: any) => {
          if (!uniqueData.some((obj: any) => obj.sectionid === o.sectionid)) {
            uniqueData.push(o);
          }
          return uniqueData;
        }, [])       
        setSection(result ?? [])
        setSpinnerStatus(false)
      } else {
        setSection([])
      }}else{
        setSection([])
        setSpinnerStatus(false)
      }
    } catch (err) {
      setSpinnerStatus(false)
      console.log(err)
    }
  }

  /*get subject APi call*/
  let subjects:any;
  const subjectApi = async (list: Grade[] | null, element: any, reset?: boolean) => {
    if (reset) {
      methods?.setValue('gradeId', (element || element == 0) ? grades[element]?.es_gradeid : "")
      // subjectApi(null, element, false);
      // sectionApi(element);
      // setTimeout(()=>{
        methods.reset({
          ...methods?.getValues(),
          chapterId: [],
          themeId: [],
          sectionId: [],
          subjectId: [],
          radioValue: ''
        })
      // },500)    
      setTheme([])
      setChapter([])
      setSection([])
      setSubject([])
      setSelectedRadioValue({ id: '' })
      setEnableSteps(['a'])
      setEnableBtn(true)
      setPageNumber(1)      
      if(element || element == 0){
        const response = await baseFilterApi("subjects", { "gradeId": [grades[element]?.es_gradeid], "publicationId": 0, "staffId": stateDetails.login.userData.userRefId })
        if (response.status == '200') {
          setSpinnerStatus(false)
          setSubject(response.data)
          sectionApi(element);
        } else {
          setSpinnerStatus(false)
        }
      }
    } else {
      setSpinnerStatus(true)     
      if(element != null){
        let gradeIds = grades[element]?.es_gradeid ? grades[element]?.es_gradeid : element
        const response = await baseFilterApi("subjects", { "gradeId":[gradeIds], "publicationId": 0, "staffId": stateDetails.login.userData.userRefId })
        if (response.status == '200') {
          setSpinnerStatus(false)
          setSubject(response.data)
          subjects = response?.data
        } else {
          setSpinnerStatus(false)
        }
      }else{
        setSpinnerStatus(false)
        setSubject([])
        setSection([])
      }      
    }
  }

  /*get Theme APi call*/
  const getThemes = async (value: any) => {    
    try {
      setSpinnerStatus(true)
      const response: any = await getThemesApi({ "subjectId": value})
      if (response?.status == 200) {
        setSpinnerStatus(false)
        let subjectWithTheme =[] as any;
        value?.map((ele: number) => {
          let subWithTheme =
          {
            label: subject?.length > 0 ? subject?.find((x: any) => (ele == x?.courseId))?.courseName : subjects?.find((x: any) => (ele == x?.courseId))?.courseName ,
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
      setSpinnerStatus(false)
    }
  }

  const chapterApi = async (list: Chapter[] | null, element: number[],reset:boolean) => {       
    if(reset){
      methods?.setValue('subjectId',element)      
      methods.reset({
        ...methods?.getValues(),
        subjectId: element,
        chapterId: [],
        themeId: [],
        radioValue:''
      })
      setPageNumber(1)       
      setTheme([])
      setChapter([])
      setSelectedRadioValue({id:''})
      setEnableSteps(['a'])
    }
    if(!reset){
      setSpinnerStatus(true)
    if(element?.length > 0){
    const response = await baseFilterApi("chapters", { "gradeId": methods.getValues("gradeId") && [methods.getValues("gradeId")] , "courseId": element, "staffId": stateDetails.login.userData.userRefId})
    const postObj={
      "gradeId": [methods.getValues("gradeId")],
      "courseId": methods.getValues("subjectId")
  }
  const chapWithTheme = await chaptersWithTheme(postObj)
    if (response.status == 200 && chapWithTheme?.length) {    
      let subjectWithChapter =[] as any;
      element?.map((ele: number) => {
        let courseAndChapter =
        {
          label: subject?.length > 0 ? subject?.find((x: any) => (ele == x?.courseId))?.courseDisplayName : subjects?.find((x: any) => (ele == x?.courseId))?.courseDisplayName ,
          value: ele,
          childOptions: (chapWithTheme?.find((b: any) => (b?.courseId == ele)))?.chapters?.map((x: any) => {
            return { label: x?.name, value: x?.id }
          })
        }
        subjectWithChapter.push(courseAndChapter)
      })      
      setChapter(subjectWithChapter?.filter((x:any)=> x?.childOptions?.length > 0))
    }    
      // await getThemes(element)
    }}
  setSpinnerStatus(false)
  }

  const sortToggle = (data: string) => {
    const sortdata = {
      sortColName: data,
      sortColOrder: sortDetails.sortColOrder === "ASC" ? "DESC" : "ASC",
    };
    setSortDetails(sortdata);
  }

  const getClassName = (key: string) => {
    if (key === sortDetails.sortColName) {
      return sortDetails.sortColOrder === "ASC"
        ? "activeUpArrow"
        : "activeDownArrow";
    }
    return "";
  };

  const generateTemplateMetaInfo = async() => {
    // Generate template structure from questionInfo object
    try {
      const questionsInfo = await Promise.all(questions.map(async(question) => (await previewGetApi(question.id))?.data ))
      const templateMetaInfo = {...generateQPPayload.templateMetaInfo}
      const templateParts = questionsInfo.map((question: any, index: number) => ({...templatePart, questionInfo: Object.assign({...questionInfo}, {...question}), id: question.id, marks: question.marks, courseId: question.subjectId, chapterIds: [question.chapterId], difficultyIds: [question.questionLevelId], questionTypeIds: [question.questionTypeIdWithTemplate], sequenceNo: `${index + 1}`, sequenceText: `${index + 1})` }))
      templateMetaInfo.bodyTemplate.templateBuilderInfo.templateParts = templateParts
      templateMetaInfo.bodyTemplate.templateBuilderInfo.paperLevelIndexSequence.question = templateParts.length
      templateMetaInfo.bodyTemplate.templateBuilderInfo.questionPaperFontMetaData["englishTextFont"] = "1"
      return templateMetaInfo
    } catch (error) {
        console.log(error)
    }
  }

  const onSubmit = async (data: any, status: string) => {
    if(methods?.getValues('gradeId') && methods.getValues("subjectId").length>0 && methods.getValues("sectionId").length>0 && methods.getValues("nameOfExamination") ){
      setEnableSteps([...enableSteps,'b']);
      setTriggerBtn(false)
    }

    if(methods.getValues('chapterId').length > 0 && (theme.length ? methods?.getValues("themeId")?.length > 0 : true)  && enableSteps?.includes('b')){
      setEnableSteps((prev:string[])=>[...prev,'c']);
      setTriggerBtn(false)
      setEnableBtn(true)
    }    
    if(!enableBtn && methods?.getValues('gradeId') && methods?.getValues("chapterId")?.length > 0 && ( (methods?.getValues("themeId")?.length > 0 && (theme?.length > 0 && methods?.getValues('subjectId')?.length > 0) ? true : false )|| (theme?.length == 0 && methods?.getValues('subjectId')?.length > 0) ? true : false )&& methods?.getValues("subjectId")?.length > 0 && methods?.getValues("sectionId")?.length > 0 && methods?.getValues("nameOfExamination")?.length != 0 && triggerBtn && enableSteps?.includes('c')){    
    let postObj = {
      name: data?.nameOfExamination,
      gradeID: methods?.getValues('gradeId'),
      sections: section?.filter((el: any) => methods.getValues("sectionId")?.includes(el?.sectionid))?.map((id: any) => { return { sectionID: id?.classid } }),
      courses: methods?.getValues('subjectId')?.map((x:any) => ({'courseID': x })),
      themes: methods?.getValues('themeId')?.map((x:any) => ({'themeID': x })),
      chapters: methods?.getValues('chapterId')?.map((x:any) => ({'chapterID': x })),
      templateID: 1,
      totalMarks:questions.reduce((prev,next)=>prev + next.marks,0),
      questionPaperTypeID: state?.questionPaperTypeID,
      examTypeID: state.questionPaperViewMode,
      templateMetaInfo: await generateTemplateMetaInfo(),
      generationModeID: state.questionPaperGenerationId,
      academicYearID: stateDetails.currentAcademic.acadamicId
    }
    const response = await manualQuestionPaperPostAPI(postObj);
    if (response?.result?.responseCode == 0 || response?.result?.responseDescription === "Success") {
      setSnackBar(true);
      setSnackBarSeverity('success');
      setSnackBarText(`Question Paper added sucuessfully`);
      methods?.reset({
        ...initialValues
      })
      setSelectedRadioValue({id:''})
      setGenerateLoader(true)
      setTimeout(()=>{
        history(`/MIFprintForPreview`, { state:{ state:false, templateId:response?.data?.paperId, questionPaperTypeID: state?.questionPaperTypeID } })   
      },3000)
    } else {
      setSnackBar(true);
      setSnackBarSeverity('error');
      setSnackBarText(`Please pass the unique name of examination`)
      setEnableBtn(false)
      setSpinnerStatus(false)
    }
  }
  }

  const changeHandler = async (e: any, data: string) => {
    switch (data as string) {
      case 'switch':
        setChangeModal(true)
        // methods.reset({
        //   ...methods?.getValues(),
        //   generation: e
        // });
        // if(e) {
        //   history("/MIFQuestionpaper",{state:{questionPaperTypeID:state.questionPaperTypeID}});
        // }else history("/informal",{state:{questionPaperTypeID:state.questionPaperTypeID}})
         break
      case 'examName':        
        methods.reset({
          ...methods?.getValues(),
          nameOfExamination: e
        });
        break
      case 'grade':
        setLatestId({ data: methods.getValues("gradeId"), element: e })       
        if ((methods.getValues("sectionId")?.length> 0  || methods.getValues("subjectId")?.length> 0  || methods.getValues("themeId")?.length > 0 || methods.getValues("chapterId")?.length > 0 || methods?.getValues('radioValue') != 0 )) {
          setGradeChangePopup(true)
        }else{        
          methods?.setValue('gradeId',e != null ? grades[e].es_gradeid : '')               
          subjectApi(null, e,false);
          sectionApi(e);
        }
        break
      case 'section':
        methods.reset({
          ...methods?.getValues(),
          sectionId: e
        });
        break
      case 'subject':                
        setLatestId({ data: methods.getValues("subjectId"), element: e })
        if (methods.getValues("chapterId")?.length > 0 || methods.getValues("themeId")?.length > 0 || methods?.getValues('radioValue') != 0) {
          setSubjectChangePopup(true)
        } else {
          methods?.setValue('subjectId', e)
          chapterApi(null, e, false);
        }
        break
      case 'Chapter':
        if (enableSteps.includes('c') && methods.getValues('chapterId').length !== e.length) {
          setChapterChangePopup(true)
          setTempSelectedChap(e)
          return
        }
        methods?.setValue('chapterId',e) 
        setduplithemeChap((pre:any)=>({theme:pre.theme,chapter:e}))
        break
      case 'theme':
        if (enableSteps.includes('c') && methods.getValues('themeId').length !== e.length) {
          setTempSelectedTheme(e)
          setThemeChangePopup(true)
          return
        }
        methods?.setValue('themeId',e)
        setduplithemeChap((pre:any)=>({theme:e,chapter:pre.chapter}))
        break
    }
  }

  const scrollHandler = async () => {
    const { scrollTop, scrollHeight, clientHeight } = tableScroll.current;
    const tableHeight = Math.round(scrollTop) + clientHeight;
    
    if (tableHeight === scrollHeight || tableHeight - 1 === scrollHeight) {
      if (!isLastPage && pageCount > pageNumber) {
        setPageNumber((prev) => prev + 1);
      }
    }
  };

  useEffect(() => {
    if (shouldLog.current) {
      shouldLog.current = false
      gradesAPI();
      setIsEdit(state?.isEdit)      
    }
  }, []);

  useEffect(() => {
    if (pageNumber > 1 && !isLastPage) {
      getTableData();
      setIsLastPage(false);
    }
    if (sortDetails?.sortColName && sortDetails?.sortColOrder) getTableData();
    if (methods.getValues("subjectId")?.length > 0 && methods.getValues("gradeId") != '') {
      getTableData();
    }
    if (methods.getValues("subjectId")?.length == 0 || methods.getValues("gradeId") == '') {
      setTableData([])
    }
    if (selectedRadioValue?.id) clickActionHandler(selectedRadioValue, false);
    if (enableSteps?.length == 3) {
      setEnableBtn(methods.formState.isValid ? false : true)
    } 
    if(methods.getValues("subjectId")){      
      if(methods?.getValues('radioValue') != '' || methods?.getValues('themeId')?.length != 0|| methods?.getValues('chapterId')?.length != 0){
        setIsChanges(true)
      }else{
        setIsChanges(false)
      }
    }
  }, [pageNumber,sortDetails,selectedRadioValue,methods?.getValues('gradeId'),methods?.getValues("subjectId"),methods?.formState?.isValid])

  const popupSelection = (status: boolean, selection: string) => {
    switch (selection) {
      case "grade":
        setIsContinue(status)
        if (status) {
          subjectApi(null, latestId?.element, true)
          setGradeChangePopup(false)
        } else {
          setGradeChangePopup(false)
        }
        break
      case "subject":
        setIsContinue(status)
        if (status) {
          chapterApi(null, latestId.element, true)
          setSubjectChangePopup(false)
        } else {
          methods.setValue("subjectId", latestId.data)
          setSubjectChangePopup(false)
        }
        break
      case "theme":
        setThemeChangePopup(false)
        if (status) {
          setEnableSteps(['a', 'b'])
          methods.setValue("themeId", tempSelectedTheme)
        }
        break
      case "chapter":
        setChapterChangePopup(false)
        if (status) {
          setEnableSteps(['a', 'b'])
          methods.setValue("chapterId", tempSelectedChap)
        }
        break
    }
  }

  useEffect(()=>{
    if (enableSteps?.length == 1 && enableSteps?.includes('a')) {
      if (methods?.getValues('gradeId') && methods.getValues("subjectId")?.length > 0 && methods.getValues("sectionId")?.length > 0 && methods.getValues("nameOfExamination")?.length != 0) {
        setEnableBtn(false)
      } else {
        setEnableBtn(true)
      }
    } else if (enableSteps?.length == 2 && enableSteps?.includes('b')) {
      if (methods?.getValues('gradeId') && methods.getValues("subjectId")?.length > 0 && methods.getValues("sectionId")?.length > 0 && methods.getValues("nameOfExamination")?.length != 0 && methods?.getValues("chapterId")?.length > 0 && (theme.length ? methods?.getValues("themeId")?.length > 0 : true)) {
        setEnableBtn(false)
      } else {
        setEnableBtn(true)
      }
    }
    },[methods?.getValues(),duplithemeChap])

    const DiffFn = () => {
      if (typeof(methods?.getValues('gradeId')) === 'number' || methods?.getValues("chapterId")?.length > 0 || ( (methods?.getValues("themeId")?.length > 0 && (theme?.length > 0 &&  methods?.getValues('subjectId')?.length > 0) ? true : false )|| (theme?.length == 0 && methods?.getValues('subjectId')?.length > 0) ? true : false )|| methods?.getValues("subjectId")?.length > 0 || methods?.getValues("sectionId")?.length > 0 || methods?.getValues("nameOfExamination")?.length != 0 || methods?.getValues('radioValue') != '') {   
        setcontinueEditing(true)
      }else{           
        setcontinueEditing(false)
        history("/assess/questionpaper")  
      }
    }

  const duplicateFn = async (res:any) => {
    methods?.setValue('gradeId', res?.gradeID)
    await sectionApi(res?.gradeID);
    await subjectApi(null, res?.gradeID, false);
    // await getThemes(res?.courses?.map((x: any) => x?.courseID))
    await chapterApi(null, res?.courses?.map((x: any) => x?.courseID), false);
    setInitialValues({
      ...methods?.getValues(),
      //generation: res?.generationModeID == 1 ? true : false,
      nameOfExamination: res?.name,
      subjectId: res?.courses?.map((x: any) => x?.courseID),
      themeId: res?.themes?.map((x: any) => x?.themeID),
      chapterId: res?.chapters?.map((x: any) => x?.chapterID),
      sectionId: res?.sections?.map((x: any) => x?.sectionID),
      radioValue: res?.templateID
    })
    setSelectedRadioValue({id:res?.templateID})
    setTimeout(()=>{
      setEnableSteps([...enableSteps,'b','c']);
      methods?.setValue('chapterId', res?.chapters?.map((x: any) => x?.chapterID))
    },1000)
  }

  const getDuplicateResponse = async(state:any) =>{
    if(state){
      const response = await QuestionPaperViewApi(state,false)
      if (response?.result?.responseCode == 0 || response?.result?.responseDescription === "Success") {
        duplicateFn(response?.data); 
      }
    }    
  }

  useEffect(()=>{
    getDuplicateResponse(state.id)    
  },[state])

  useEffect(()=>{
   methods?.reset({...initialValues})
  },[initialValues])

   return (
    <div className="questionPaperContainer" >
      <FormProvider {...methods} >
        <form onSubmit={methods.handleSubmit((data: any) => onSubmit(data, ""))}>
          <Box sx={{ display: "flex", alignItems: "center", height: '22px', cursor: 'pointer' }} className="goback" onClick={() => {DiffFn()}}>
            <ArrowBackIosIcon />
            <p className="mt-3">Go back</p>
          </Box>
          <p style={{ fontWeight: "800", fontSize: "24px" }}>Select Questions to continue</p>
          <p style={{ color: "black", fontSize: "16px", fontWeight: "300", marginTop: "-6px" }}>Manually select questions to generate question papers.</p>
          <div className="MIFsteppercontainer">
            <Box className="stepperqsnpaperDetail stepperSection">
              <Box className={`circle ${enableSteps?.includes('a') ? "active" : ""}`}>
                <span>A</span>
              </Box>
              <Box className="qsnpaperdetails mt-2 w-100">
                <h2>Question Paper Details</h2>
                <p>
                  Specify which grade and subject the generated question paper is
                  for
                </p>
                <Box className="fastmannualgenerationBox mt-4">
              {/* <Box className=" switchfield mb-3">
              <SwitchComponent isControlled={true} onChangeSwitch={(e: any) => { changeHandler(e, 'switch') }} checked={generation} disabled={false} beforeLabel={"Auto"} afterLabel={"Manual"} />
              </Box>
              <Divider className="mb-3" /> */}
              <InputFieldComponentForForm registerName={'nameOfExamination'} inputType={"text"} label={"Name of Examination"} required={true} onChange={(e: any) =>{ changeHandler(e.target.value, 'examName')}} inputSize={"Large"} variant={""} maxLength={50} pattern={alphanumericNameRegex}/>
              <Box className="row mt-4">
                <Box className="col-4">
                  <DropdownSingleSelect registerName="gradeId"  variant={'fill'} selectedValue={''} clickHandler={(e: any) => changeHandler(e, 'grade')} selectLabel={'Grade'} disabled={false} selectList={grades} mandatory={true} showableLabel={"grade"} showableData={"es_gradeid"} menuHeader={"Select Grade"} />
                </Box>
                <Box className="col-4 questionPaperOtpSectSub">
                  <DropdownWithCheckbox registerName="sectionId" required={true} value={methods?.getValues('sectionId')} variant={'fill'} selectedValue={''} clickHandler={(e: any) => { changeHandler(e, 'section') }} selectLabel={'Section(s)'} disabled={section.length > 0 ? false : true} selectList={section} mandatory={true} showableLabel={"section"} showableData={"sectionid"} menuHeader={"Select Grade"}/>
                </Box>
                <Box className="col-4 questionPaperOtpSectSub">
                  <DropdownWithCheckbox registerName="subjectId"  required={true}  value={methods?.getValues('subjectId')} variant={'fill'} selectedValue={''} clickHandler={(e: any) => changeHandler(e, 'subject')} selectLabel={'Subject(s)'} selectList={subject} disabled={!(methods.getValues("sectionId")?.length > 0 && subject?.length > 0)} mandatory={true} showableLabel={"courseDisplayName"} showableData={"courseId"} menuHeader={"Select Subject"} resetObj={{isChange:isChange,isContinue:isContinue,setIsContinue:setIsContinue}}/>
                </Box>
              </Box>
              <Box>               
              </Box>
            </Box>
              </Box>
            </Box>
            
            <Box className="slectquestion mt-4 pb-5 stepperSection">
            <Box className={`circle ${enableSteps?.includes('b') ? "active" : ""}`}>
              <span>B</span>
            </Box>
            
            <Box className="qsnpaperdetails mt-2 w-100">
            <h2>Select Chapters to Generate the Question Paper </h2>
            <p>You can select multiple chapters to generate question papers</p>
            {
            enableSteps?.includes('b') &&
            <Box className="row mt-3">
            {/* <div className={`col-6 ${(theme.length == 0 && methods?.getValues('subjectId')?.length > 0) ? 'd-none' : ''}`}>
             {theme.length && <DropdownWithExpandCheckbox  preSetVal={prepopChapthemeId} registerName="themeId"  required={(theme?.length > 0 && methods?.getValues('subjectId')?.length > 0) ? true : false} variant={'fill'} value={methods?.getValues('themeId')} selectedValue={''} clickHandler={(e: any) =>{changeHandler(e,'theme')} } selectLabel={'Theme(s)'} selectList={theme} disabled={theme.length > 0 ? false : true} mandatory={true} showableLabel={"syllabusName"} showableData={"syllabusID"} menuHeader={"Select Theme*"} />}
            </div> */}
            <div className={`${(theme.length == 0 && methods?.getValues('subjectId')?.length > 0) ? 'col-12' :'col-6'}`}>
              <DropdownWithExpandCheckbox  preSetVal={prepopChapthemeId} registerName="chapterId"  required={true} variant={'fill'} value={methods?.getValues('chapterId')} selectedValue={''} clickHandler={(e: any) => changeHandler(e, 'Chapter')} selectLabel={'Chapter(s)'} selectList={chapter} disabled={chapter.length > 0 ? false : true} mandatory={true} showableLabel={"chapterName"} showableData={"chapterId"} menuHeader={"Select Chapter"} />
            </div>                
          </Box>
              }
            </Box>
          </Box>

          {enableSteps?.includes('b') &&   
            <Box className="questiondetails mt-2 stepperSection">
              <Box className={`circle ${enableSteps?.includes('c') ? "active" : ""}`}>
                <span>C</span>
              </Box>
              <Box className="qsnpaperdetails mt-2 w-100">
                <h2>Select Questions</h2>
                <p>Select your filters to find your Question</p>
                {
            enableSteps?.includes('c') &&
            <Box className="row mt-3 questionBox">
            <>
            <MIFQuestionsList setQuestions={setQuestions} enableBtn={enableBtn} setEnableBtn={setEnableBtn} ReqBody={[]} replace={{gradeID: methods.getValues("gradeId")}} replaceFilterObj={{themeId: methods.getValues("themeId"), chapterIds:methods.getValues("chapterId"), courseId: methods.getValues("subjectId")}}/>
            </>
          </Box>
                }
              </Box>
            </Box>
            }
            
            {enableSteps?.includes('c') &&
            <Box className="checkMark mt-4 mx-2">
              <Box className="checkMarkcircle">
                <img src={checkMark} />
              </Box>
            </Box>
            }
            <Box className="button" style={{ textAlign: "right", paddingTop: "20px" }}>
              <ButtonComponent type={"contained"} status={ 'submit'} label={`${enableSteps?.includes('c') ? "Generate Question paper" : 'Next'}`} textColor={"white"} buttonSize={"Large"} minWidth={"256"} backgroundColor={"#01B58A"} disabled={enableBtn} onClick={()=>{setTriggerBtn(true)}}/>                          
              <ButtonComponent type={"outlined"} label={"Cancel"} textColor={"black"} buttonSize={"Large"} minWidth={"256"} onClick={() => {DiffFn()}}/>
            </Box>
            {spinnerStatus && <Spinner />}
            <Toaster onClose={() => { setSnackBar(false) }} severity={SnackBarSeverity} text={snackBarText} snakeBar={snackBar} />
            {previewTemplateOpenStatus && <PreviewTemplate open={previewTemplateOpenStatus} handleClose={() => { setPreviewTemplateOpenStatus(false) }} previewJson={previewTemplateData} />}
            <GeneratePrintForPreview open={generateLoader} handleClose={()=>{setGenerateLoader(false)}} generateText={"Generating your question paper..."}/>
            <ChangeFieldModalPopup open={subjectChangePopup} clickHandler={(e:boolean)=>popupSelection(e,"subject")}  header="Change Grade/Subject?" label1='Continue' label2='Cancel' onClose={()=>{setSubjectChangePopup(false);popupSelection(false,"subject")}} subHeader1="The page will refresh based on new selection." subHeader2="Are you sure you want to continue?"/>
            <ChangeFieldModalPopup open={gradeChangePopup} clickHandler={(e:boolean)=>popupSelection(e,"grade")} header="Change Grade/Subject?" label1='Continue' label2='Cancel' onClose={()=>{setGradeChangePopup(false);popupSelection(false,"grade")}} subHeader1="The page will refresh based on new selection." subHeader2="Are you sure you want to continue?"/>
            <ChangeFieldModalPopup open={themeChangePopup} clickHandler={(e:boolean)=>popupSelection(e,"theme")} header="Change Theme/Chapter?" label1='Continue' label2='Cancel' onClose={()=>{setThemeChangePopup(false);popupSelection(false,"theme")}} subHeader1="The page will refresh based on new selection." subHeader2="Are you sure you want to continue?"/>
            <ChangeFieldModalPopup open={chapterChangePopup} clickHandler={(e:boolean)=>popupSelection(e,"chapter")} header="Change Theme/Chapter?" label1='Continue' label2='Cancel' onClose={()=>{setChapterChangePopup(false);popupSelection(false,"chapter")}} subHeader1="The page will refresh based on new selection." subHeader2="Are you sure you want to continue?"/>
            <ChangeFieldModalPopup open={changeModal} clickHandler={(e: boolean) => e ?  history(`${ state.questionPaperTypeID == 1  ? '/assess/questionpaper/informal-autoflow/new' : '/assess/questionpaper/formal-autoflow/new'}`,{state:{questionPaperTypeID:state.questionPaperTypeID}}) : setChangeModal(false)}header="Change Selection?" label1='Continue' label2='Cancel' onClose={() => { setChangeModal(false); }} subHeader1="The page will refresh based on new selection." subHeader2="Are you sure you want to continue?" />
          </div>
        </form>
      </FormProvider>
    {continueEditing && <EditingModal open={continueEditing} onClose={() => { setcontinueEditing(false)}} pathname={'/assess'} search={'?tab=questionPapers'}/>}
    </div>
  );
};

export default QuestionPaperOPT1;
