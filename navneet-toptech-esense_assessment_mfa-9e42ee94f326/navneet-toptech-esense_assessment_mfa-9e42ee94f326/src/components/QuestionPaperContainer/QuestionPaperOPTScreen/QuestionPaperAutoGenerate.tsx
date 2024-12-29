import React, { useState, useEffect, useRef } from "react";
import "./QuestionPaperAutoGenerate.css";
import { AlertColor, Box, Button, FormControlLabel, RadioGroup } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import SwitchComponent from "../../SharedComponents/SwitchComponent/SwitchComponent";
import Divider from "@mui/material/Divider";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import checkMark from "../../../assets/images/checkMark.svg";
import Polygon from "../../../../src/assets/images/Polygon.svg";
import UpPolygon from "../../../../src/assets/images/UpPolygon.svg";
import ButtonComponent from "../../SharedComponents/ButtonComponent/ButtonComponent";
import { Subject, Chapter, Theme, Grade } from '../../../interface/filters';
import { baseFilterApi, baseGradeApi, getThemesApi } from "../../../Api/AssessmentTypes";
import { alphanumericNameRegex, getLocalStorageDataBasedOnKey } from "../../../constants/helper";
import { State } from "../../../types/assessment";
import SelectBoxComponentForForm from "../../SharedComponents/FormFieldComponents/SelectBoxComponent";
import { useForm, FormProvider } from "react-hook-form";
import { useLocation, useNavigate } from 'react-router-dom';
import Spinner from "../../SharedComponents/Spinner";
import { getPreviewTemplate, getTemplateData } from "../../../Api/templateManage";
import { QuestionPaperViewApi, QuestionPapervalidateName, sectionAPI } from "../../../Api/QuestionTypePaper";
import { examTableCount } from "../../../constants/helper";
import PreviewTemplate from "./TemplatePreview/PreviewTemplate";
import Radio from '@mui/material/Radio';
import MultiCheckboxSelectComponent from "../../SharedComponents/MultiSelectComponent/MultiCheckboxSelectComponent";
import { QuestionPaperFontDetails } from "./QuestionPaperFontDetails";
import { questionPaperPostAPI, radioGetAPICall } from "../../../Api/QuestionPaper";
import InputFieldComponentForForm from "../../SharedComponents/FormFieldComponents/InputFieldComponent";
import Toaster from "../../SharedComponents/Toaster/Toaster";
import GeneratePrintForPreview from "./GeneratePrintForPreview";
import DropdownWithExpandCheckbox from "../../SharedComponents/DropdownWithCheckbox/DropdownWithExpandedCheckbox";
import DropdownWithCheckbox from "../../SharedComponents/DropdownWithCheckbox/DropdownWithCheckbox";
import DynamicModalPopup from "../../SharedComponents/ModalPopup/DynamicModalPopup";
import ChangeFieldModalPopup from "../../SharedComponents/ModalPopup/ChangeFieldModalPopup";
import DropdownSingleSelect from "../../SharedComponents/DropdownWithCheckbox/DropdownSingleSelect";
import ModalPopup from "../../SharedComponents/ModalPopup/ModalPopup";
import EditingModal from "../../SharedComponents/ModalPopup/EditingModal";

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
  const [changeModal, setChangeModal] = useState(false)
  const [applyBtnApprovedStatus, setApplyBtnApprovedStatus] = useState(false)
  const [initialValues, setInitialValues] = useState<any>({
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
  const [stepCPreviewBodyCopy, setStepCPreviewBodyCopy] = useState();
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
  const [latestId,setLatestId] = useState<any>({})
  const [isChange,setIsChanges] = useState<boolean>(false)
  const [isContinue,setIsContinue] = useState<boolean>(false)
  let chapterCollect:any=[];
  let themeCollect:any=[];
  const [prepopChapthemeId,setprepopChapthemeId]=useState<any>({"themeId":[],"chapterId":[]})
  const [duplithemeChap,setduplithemeChap]=useState<any>([{theme:'',chapter:''}])
  const [initialFormDefault, setInitialFormDefault] = useState({})
  const [continueEditing,setcontinueEditing] = useState<boolean>(false)
  const [enableGen,setEnableGen]=useState<boolean>(false)
  const [chapterDataArr,setChapterDataArr]=useState<any>([])

  const updateSelection = (event: any, value: any) => {
    event.persist();
    setSelectedRadioValue({id:value});
    methods?.setValue('radioValue',value);
  };
  
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
        setStepCPreviewBodyCopy(radioResponse?.data)
        let dataModel:any= {}
        const templateParts = radioResponse?.data?.bodyTemplate?.templateBuilderInfo?.questionPaperFontMetaData;
        Object.keys(templateParts?templateParts:{})?.forEach(function (key, value) {
          dataModel[key] = "0"
        })
        setInitialFormDefault(dataModel)
        }
    }
    const chaptersWithTheme = await baseFilterApi("chaptersWithTheme", { "gradeId": methods.getValues("gradeId") && [methods.getValues("gradeId")] , "courseId": methods.getValues("subjectId") && methods.getValues("subjectId") })
    if(chaptersWithTheme?.data?.length > 0){      
      getFilteredChapterData(chaptersWithTheme?.data);
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
    }
  }

  /*get subject APi call*/
  let subjects:any;
  const subjectApi = async (list: Grade[] | null, element: any, reset?: boolean) => {
    if (reset) {
      methods?.setValue('gradeId', (element || element == 0) ? grades[element]?.es_gradeid : "")
      setTimeout(()=>{
        methods.reset({
          ...methods?.getValues(),
          chapterId: [],
          themeId: [],
          sectionId: [],
          subjectId: [],
          radioValue: ''
        })
      },500)      
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
    if (response.status == 200) {    
      let subjectWithChapter =[] as any;
      element?.map((ele: number) => {
        let courseAndChapter =
        {
          label: subject?.length > 0 ? subject?.find((x: any) => (ele == x?.courseId))?.courseDisplayName : subjects?.find((x: any) => (ele == x?.courseId))?.courseDisplayName ,
          value: ele,
          childOptions: response?.data?.filter((b: any) => (b?.courseId == ele)).map((x: any) => {
            return { label: x?.chapterName, value: x?.chapterId }
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

  const getFilteredChapterData = (themeData:any) => {    
    let filterchapterData = themeData?.map((x:any) => x?.chapters)?.flat()
    let filterThemeData = filterchapterData.filter((x:any,i:number) => chapterCollect?.length && chapterCollect.find((item2:any) => Number(x.id) === Number(item2)))?.map((x:any) => x?.themeId);
    const uniqueThemeIds= Array.from(new Set(filterThemeData));
    methods?.setValue('themeId',uniqueThemeIds);
    methods?.setValue('chapterId',chapterCollect);
    setprepopChapthemeId({"chapterId":chapterCollect,'themeId':uniqueThemeIds});
    let chapterAndThemeData:any = chapter?.map((ele:any,i:number)=>{
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
    setChapter([...chapterAndThemeData])
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

  const onSubmit = async (data: any, status: string) => {
    if(data?.radioValue == ''){
      setSpinnerStatus(true)
      let requestBody = {
        name: data?.nameOfExamination,
        gradeID: methods?.getValues('gradeId'),
        sections: methods?.getValues('sectionId')?.map((x: any) => ({ 'sectionID': x })),
      }
      const examNameValidateAPI = await QuestionPapervalidateName(requestBody)
      if (examNameValidateAPI?.result?.responseCode == 0 || examNameValidateAPI?.result?.responseDescription === "Success") {
        if (examNameValidateAPI?.data?.isAvailable) {
          setEnableSteps([...enableSteps, 'b']);
          setTriggerBtn(false)
          setSpinnerStatus(false)
        } else {
          methods?.setError('nameOfExamination', {type: 'pattern', message: 'Please enter a valid input'})
          setSnackBar(true);
          setSnackBarSeverity('error');
          setSnackBarText(`Exam name should be unique`)
          setSpinnerStatus(false)
        }
      }else {
        setSnackBar(true);
        setSnackBarSeverity('error');
        setSnackBarText(`something went wrong`)
        setSpinnerStatus(false)
      }     
    }
     if(data?.radioValue != ''  && !enableSteps?.includes('c')){
      setEnableSteps([...enableSteps,'c','d']);
      setTriggerBtn(false)
    }    
    if (!generateLoader && methods?.getValues('gradeId') && methods?.getValues("chapterId")?.length > 0 && ((methods?.getValues("themeId")?.length > 0 && (theme?.length > 0 && methods?.getValues('subjectId')?.length > 0) ? true : false) || (theme?.length == 0 && methods?.getValues('subjectId')?.length > 0) ? true : false) && methods?.getValues("subjectId")?.length > 0 && methods?.getValues("sectionId")?.length > 0 && methods?.getValues("nameOfExamination")?.length != 0 && methods?.getValues('radioValue') != '' && triggerBtn && enableSteps?.includes('d')) {    
    let postObj = {
      name: data?.nameOfExamination,
      gradeID: methods?.getValues('gradeId'),
      sections: section?.filter((el: any) => methods.getValues("sectionId")?.includes(el?.sectionid))?.map((id: any) => { return { sectionID: id?.classid } }),
      courses: methods?.getValues('subjectId')?.map((x:any) => ({'courseID': x })),
      themes: methods?.getValues('themeId')?.map((x:any) => ({'themeID': x })),
      chapters: methods?.getValues('chapterId')?.map((x:any) => ({'chapterID': x })),
      templateID: Number(methods?.getValues('radioValue')),
      questionPaperTypeID: state?.questionPaperTypeID,
      examTypeID: state.questionPaperViewMode,
      templateMetaInfo: applyBtnApprovedStatus ? stepCPreviewBody : stepCPreviewBodyCopy,
      generationModeID: state.questionPaperGenerationId,
      academicYearID: stateDetails.currentAcademic.acadamicId
    }
    setGenerateLoader(true)
    const response = await questionPaperPostAPI(postObj);
    if (response?.result?.responseCode == 0 || response?.result?.responseDescription === "Success") {
      setSnackBar(true);
      setSnackBarSeverity('success');
      setSnackBarText(`Question Paper added sucuessfully`);
      methods?.reset({
        ...initialValues
      })
      setSelectedRadioValue({ id: '' })
      setGenerateLoader(false);  
      setTimeout(()=>{
        history(`${ state?.questionPaperTypeID == 1 ?  '/assess/questionpaper/informal-autoflow/printforpreview' :  '/assess/questionpaper/formal-autoflow/printforpreview' }`, { state:{ state:false, templateId:response?.data?.paperId , questionPaperTypeID : state?.questionPaperTypeID,disableBtnPrint : state?.questionPaperTypeID == 1 ? true : false ,enablebtnPrint: state?.questionPaperTypeID == 1 ? false : true } })   
      },3000)
    } else {
      setGenerateLoader(false)
      setGenerateLoader(false)
      setSnackBar(true);
      setSnackBarSeverity('error');
      setSnackBarText(response?.responseDescription)
      setSpinnerStatus(false)
    }
  }
  }

  const changeHandler = async (e: any, data: string) => {
    switch (data as string) {
      case 'switch':
        setChangeModal(true)
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
      methods?.setValue('chapterId',e) 
      setduplithemeChap((pre:any)=>({theme:pre.theme,chapter:e}))
      break  
      case 'theme':
        methods?.setValue('themeId',e)
      setduplithemeChap((pre:any)=>({theme:e,chapter:pre.chapter}))
        break  
      
    }
  }

  const scrollHandler = async () => {
    const { scrollTop, scrollHeight, clientHeight } = tableScroll.current;
    const tableHeight = Math.round(scrollTop) + clientHeight;
    
    if (tableHeight === scrollHeight || tableHeight - 1 === scrollHeight) {
      if (!isLastPage && pageCount >= pageNumber) {
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
    if (enableSteps?.length == 4) {
      setEnableBtn(methods.formState.isValid ? false : true)
    } 
    if(methods.getValues("subjectId")){      
      if(methods?.getValues('radioValue') != '' || methods?.getValues('themeId')?.length != 0|| methods?.getValues('chapterId')?.length != 0){
        setIsChanges(true)
      }else{
        setIsChanges(false)
      }
    }
  }, [pageNumber,sortDetails,methods?.getValues('gradeId'),methods?.getValues("subjectId"),methods?.formState?.isValid])

  useEffect(()=>{
    if (selectedRadioValue?.id) clickActionHandler(selectedRadioValue, false);
  },[selectedRadioValue])

  const popupSelection = (status: boolean, selection: string) => {
    setIsContinue(status)
    switch (selection) {
      case "grade":
        if (status) {
          methods.reset({
            ...methods?.getValues(),
            chapterId: [],
            themeId: [],
            sectionId: [],
            subjectId: [],
            radioValue: ''
          })
          subjectApi(null, latestId?.element, true)
          setGradeChangePopup(false)
        } else {
          // methods.setValue("gradeId", latestId.data)
          setGradeChangePopup(false)
        }
        break
      case "subject":
        if (status) {
          chapterApi(null, latestId.element, true)
          setSubjectChangePopup(false)
        } else {
          methods.setValue("subjectId", latestId.data)
          setSubjectChangePopup(false)
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
      if (methods?.getValues('gradeId') && methods.getValues("subjectId")?.length > 0 && methods.getValues("sectionId")?.length > 0 && methods.getValues("nameOfExamination")?.length != 0 && methods?.getValues('radioValue') != '') {
        setEnableBtn(false)
      } else {
        setEnableBtn(true)
      }
    }else{
        if (methods?.getValues('gradeId') && methods?.getValues("chapterId")?.length > 0 && ( (methods?.getValues("themeId")?.length > 0 && (theme?.length > 0 && methods?.getValues('subjectId')?.length > 0) ? true : false )|| (theme?.length == 0 && methods?.getValues('subjectId')?.length > 0) ? true : false )&& methods?.getValues("subjectId")?.length > 0 && methods?.getValues("sectionId")?.length > 0 && methods?.getValues("nameOfExamination")?.length != 0 && methods?.getValues('radioValue') != '' && enableGen) {
          setEnableBtn(false)
        }else{
          setEnableBtn(true)
        }
      }
    },[methods?.getValues(),duplithemeChap,enableGen])

    const enableSubmitHandler=(enable:boolean)=>{
      setEnableGen(enable)
    }
    const DiffFn = () => {
      if (typeof(methods?.getValues('gradeId')) === 'number' || methods?.getValues("chapterId")?.length > 0 || ( (methods?.getValues("themeId")?.length > 0 && (theme?.length > 0 &&  methods?.getValues('subjectId')?.length > 0) ? true : false )|| (theme?.length == 0 && methods?.getValues('subjectId')?.length > 0) ? true : false )|| methods?.getValues("subjectId")?.length > 0 || methods?.getValues("sectionId")?.length > 0 || methods?.getValues("nameOfExamination")?.length != 0 || methods?.getValues('radioValue') != '') {   
        setcontinueEditing(true)
      }else{           
        setcontinueEditing(false)
        history("/assess/questionpaper")       
      }
    }

   return (
    <div className="questionPaperContainer" >
      <FormProvider {...methods} >
        <form onSubmit={methods.handleSubmit((data: any) => onSubmit(data, ""))}>
          <Box sx={{ display: "flex", alignItems: "center", height: '22px', cursor: 'pointer' }} className="goback" onClick={() => {DiffFn()}}>
            <ArrowBackIosIcon />
            <p className="mt-3">Go back</p>
          </Box>
          <p style={{ fontWeight: "800", fontSize: "24px" }}>Select Question Paper Blueprint to continue</p>
          <p style={{ color: "black", fontSize: "16px", fontWeight: "300", marginTop: "-6px" }}>We use automation to help you quickly generate question papers.</p>
          <div className="steppercontainer">
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
              <h2>Select Question Paper Blueprint</h2>
              <p>Blueprint for question paper generation</p>
              {
            enableSteps?.includes('b') &&
              <Box
                className="questionPaperBluePrintTableContainer"
              >
                <TableContainer
                  ref={tableScroll}
                  onScrollCapture={scrollHandler}
                >
                  <Table stickyHeader >
                    <TableHead>
                      <TableRow>
                        <TableCell></TableCell>
                        {tabValue?.map((headCell: any, index: any) => (
                          <TableCell
                            style={{
                              color: "#a1a1a1",
                              fontWeight: '500',
                              fontSize: '12px',
                              textTransform: "uppercase",
                              whiteSpace: "nowrap",
                              cursor: "pointer"
                            }}
                            key={index}
                            onClick={() => {
                              if (headCell === "TOTAL MARKS") {
                                sortToggle("marks")
                              }
                            }}
                          >
                            <div className="tableHeadArrowSect">
                              {headCell}
                              {
                                headCell === "TOTAL MARKS" &&  (<span className={`resrTableSortArrow ${getClassName(
                                  "marks"
                                )}`}>
                                  <img style={{ paddingLeft: "10px" }} alt="" src={UpPolygon} />
                                  <img style={{ paddingLeft: "10px" }} alt="" src={Polygon} />
                                </span>)}
                            </div>
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tableData?.length > 0 && tableData?.map((data: any, index: any) => (
                        <TableRow>
                          <TableCell align="left">                         
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
                          <TableCell align="left">{data?.templateName}</TableCell>
                            <TableCell align="left">{data?.marks}</TableCell>
                            <TableCell align="left"> {data?.timeInMinutes} {data?.timeInMinutes > 1 ? "mins" : "min"}</TableCell>
                            <TableCell align="left">{data?.customCreatedBy}</TableCell>
                            <TableCell align="left">
                              <div style={{ display: "flex", color: "#01B58A", fontWeight: "600", cursor:'pointer',gap: "10px"}} onClick={()=>{clickActionHandler(data,true)}}>
                                Preview
                                <KeyboardArrowRightIcon />
                              </div>
                            </TableCell>                        
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
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
                <h2>Select Chapters to Generate the Question Paper </h2>
                <p>You can select multiple chapters to generate question papers</p>
                {
            enableSteps?.includes('c') &&
                <Box className="d-flex mt-3">
                  {/* <div className={`col-6 ${(theme.length == 0 && methods?.getValues('subjectId')?.length > 0) ? 'd-none' : ''}`}>
                    <DropdownWithExpandCheckbox  preSetVal={prepopChapthemeId} registerName="themeId"  required={(theme?.length > 0 && methods?.getValues('subjectId')?.length > 0) ? true : false} variant={'fill'} value={methods?.getValues('themeId')} selectedValue={''} clickHandler={(e: any) =>{changeHandler(e,'theme')} } selectLabel={'Theme(s)'} selectList={theme} disabled={theme.length > 0 ? false : true} mandatory={true} showableLabel={"syllabusName"} showableData={"syllabusID"} menuHeader={"Select Theme*"} />
                  </div> */}
                  <div className="w-100 qpAutoGeneChapterField">
                    <DropdownWithExpandCheckbox preSetVal={prepopChapthemeId} registerName="chapterId"  required={true} variant={'fill'} value={methods?.getValues('chapterId')} selectedValue={''} clickHandler={(e: any) => changeHandler(e, 'Chapter')} selectLabel={'Chapter(s)'} selectList={chapter} disabled={chapter.length > 0 ? false : true} mandatory={true} showableLabel={"chapterName"} showableData={"chapterId"} menuHeader={"Select Chapter"} />
                  </div>                
                </Box>
                }
              </Box>
            </Box>
            }
            
            {enableSteps?.includes('c') &&   
            <Box className="questiondetails mt-2 stepperSection">
              <Box className={`circle ${enableSteps?.includes('d') ? "active" : ""}`}>
                <span>D</span>
              </Box>
              <Box className="qsnpaperdetails mt-2 w-100">
                <h2>Question Paper Font Details</h2>
                <p>Select the font and font size you want in your question paper</p>
                {
            enableSteps?.includes('d') &&
                <Box className="qsnmodelSelectField " sx={{ display: "flex", gap: "55px" }}>             
                  {initialFormDefault && <QuestionPaperFontDetails enableSubmitHandler={(e)=>{enableSubmitHandler(e)}} initialFormDefault={initialFormDefault} setBodyTemplate={setStepCPreviewBody} setStepCPreviewBodyCopy={setStepCPreviewBodyCopy} successJson={stepCPreview} isEdit={isEdit} applyBtnApprovedStatus={setApplyBtnApprovedStatus} previewMode={""}/>}
                </Box>
                }
              </Box>
            </Box>
            }
            {enableSteps?.includes('d') &&
            <Box className="checkMark mt-4 mx-2">
              <Box className="checkMarkcircle">
                <img src={checkMark} />
              </Box>
            </Box>
            }
            <Box className="button" style={{ textAlign: "right", paddingTop: "20px" }}>
              <ButtonComponent type={"contained"} status={ 'submit'} label={`${enableSteps?.includes('d') ? "Generate Question paper" : 'Next'}`} textColor={"white"} buttonSize={"Large"} minWidth={"256"} backgroundColor={"#01B58A"} disabled={enableBtn} onClick={()=>{setTriggerBtn(true)}}/>                          
              <ButtonComponent type={"outlined"} label={"Cancel"} textColor={"black"} buttonSize={"Large"} minWidth={"256"} onClick={() => {DiffFn()}}/>
            </Box>
            {spinnerStatus && <Spinner />}
            <Toaster onClose={() => { setSnackBar(false) }} severity={SnackBarSeverity} text={snackBarText} snakeBar={snackBar} />
            {previewTemplateOpenStatus && <PreviewTemplate open={previewTemplateOpenStatus} handleClose={() => { setPreviewTemplateOpenStatus(false) }} previewJson={previewTemplateData} />}
             <GeneratePrintForPreview open={generateLoader} handleClose={() => { }} generateText={"Generating your question paper..."} />
            {subjectChangePopup && <ChangeFieldModalPopup open={subjectChangePopup} clickHandler={(e:boolean)=>popupSelection(e,"subject")}  header="Change Selection?" label1='Continue' label2='Cancel' onClose={()=>{setSubjectChangePopup(false);popupSelection(false,"subject")}} subHeader1="The page will refresh based on new selection." subHeader2="Are you sure you want to continue?"/>}
            {gradeChangePopup && <ChangeFieldModalPopup open={gradeChangePopup} clickHandler={(e:boolean)=>popupSelection(e,"grade")} header="Change Selection?" label1='Continue' label2='Cancel' onClose={()=>{setGradeChangePopup(false);popupSelection(false,"grade")}} subHeader1="The page will refresh based on new selection." subHeader2="Are you sure you want to continue?"/>}
            <ChangeFieldModalPopup open={changeModal} clickHandler={(e: boolean) => e ? history("/MIFQuestionpaper",{state:{questionPaperTypeID:state.questionPaperTypeID}}): setChangeModal(false)} header="Change Selection?" label1='Continue' label2='Cancel' onClose={() => { setChangeModal(false);}} subHeader1="The page will refresh based on new selection." subHeader2="Are you sure you want to continue?" />
          
          </div>
        </form>
      </FormProvider>
    {continueEditing && <EditingModal open={continueEditing} onClose={() => { setcontinueEditing(false)}} pathname={'/assess/questionpaper'} />}
    </div>
  );
};

export default QuestionPaperOPT1;
