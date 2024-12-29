import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import "./QuestionPaperPreviewforPrint.css";
import ButtonComponent from '../../SharedComponents/ButtonComponent/ButtonComponent';
import undo from "../../../assets/images/Undo.svg";
import Redo from "../../../assets/images/Redo.svg";
import schoolLogo from "../../../assets/images/schoollogo.svg";
import Tooltip from '@mui/material/Tooltip';
import { ReactComponent as QuestionPaperDeleteIcon } from "../../../assets/images/delete.svg";
import { ReactComponent as Refresh } from "../../../assets/images/refresh.svg";
import { ReactComponent as EditIcon } from "../../../assets/images/edit.svg";
import QuestionPaperTemplate from '../QuestionPaperOPTScreen/TemplatePreview/QuestionPaperTemplate';
//import { ReactComponent as Refresh } from "../../../../../assets/.svg";
import { QuestionPaperViewApi, QuestionPaperRandomize, DonePutApi, setsPostAPI, statusPostAPI, getAllStudentListApi } from '../../../Api/QuestionTypePaper';
import DropDownButtonComponent from '../../SharedComponents/DropDownButtonComponent/DropDownButtonComponent';
import QuillToolbarPopover from '../../SharedComponents/QuillToolbarPopover/QuillToolbarPopover';
import ChangeFieldModalPopup from '../../SharedComponents/ModalPopup/ChangeFieldModalPopup';
import { AlertColor } from "@mui/material";
import Toaster from '../../SharedComponents/Toaster/Toaster';
import Spinner from '../../SharedComponents/Spinner';
import { useLocation, useNavigate } from 'react-router';
import GeneratePrintForPreview from '../QuestionPaperOPTScreen/GeneratePrintForPreview';
import { fontDeatailsDropdown } from '../../../Api/QuestionPaper';
import PrintDateFieldModalPopup from '../../SharedComponents/ModalPopup/PrintDateFieldModalPopup';
import { useReactToPrint } from 'react-to-print';
import PrintQuestionPaperTemplate from '../../ManualQuestionPaperContainer/MIFQuestionPaperPreviewforPrint/printDoc/PrintQuestionPaperTemplate';
import { getVersionHistory, getadminList, postApproval } from '../../../Api/AssessmentTypes';
import VersionHistory from '../../SharedComponents/VersionHistory/VersionHistory';
import { getLocalStorageDataBasedOnKey, availableModules, istypeOflinesPresent, updateArrayObj, findFirstQuestionBorderType } from '../../../constants/helper';
import QuestionPaperCustomizeFontPopup from '../QuestionPaperCustomizeFontPopup/QuestionPaperCustomizeFontPopup';
import { getPreviewTemplate } from '../../../Api/templateManage';
import { State } from '../../../types/assessment';
import AssignStudentListModal from '../../OnlineAssesment/modals/AssignStudentListModal';
import CloseWorkSheetModal from '../../SharedComponents/ModalPopup/CloseWorkSheetModal';

interface actionsContentType {
  undo:{},
  redo:{}
}
interface MessageContextType {
  actions: actionsContentType;
  reqBody: any;
  setStateFunction: (key: string, state: any, redo?: any,isDraggable?:boolean) => void;
  // questionPaperFieldOrder:
}

export const MessageContext = createContext<MessageContextType | undefined>(undefined);


const QuestionPaperPreviewforPrint : React.FC = () => {
  let history = useNavigate();
  let shouldLog = useRef(true);
  let location = useLocation();
  const [reqBody, setReqBody] = useState<any>();
  const [templateJson, setTemplateJson] = useState<any>();
  const [undoDisable,setUndoDisable]=useState<boolean>(true)
  const [redoDisable,setredoDisable]=useState<boolean>(true)
  const [actions,setActions]=useState<any>({
    undo:{},
    redo:{}
  })
  const stateDetails = JSON.parse(getLocalStorageDataBasedOnKey("state") as string) as State;
  const [printForPreviewEdit, setPrintForPreviewEdit] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<any>(null);
  const [changedPopoverValue, setChangedPopoverValue] = React.useState<any>({});
  const [quillPopupOpen, setQuillPopupOpen] = React.useState(false);
  const [replace,setReplace]=useState<any|null>(null)
  const [questionPaperId,setQuestionPaperId]=useState<string>('')
  const [intialLoadData,setIntialLoadData]=useState<any>({})
  const [snackBar, setSnackBar] = useState<boolean>(false);
  const [snackBarText, setSnackBarText] = useState<string>("");
  const [SnackBarSeverity, setSnackBarSeverity] = useState<AlertColor>("success");
  const [spinnerStatus, setSpinnerStatus] = useState(false);
  const [continueEditing,setcontinueEditing] = useState<boolean>(false);
  const [generateLoader, setGenerateLoader] = useState(false);
  let versionShowStatus: any = process.env.REACT_APP_VERSION_SHOW_STATUS
  versionShowStatus = (versionShowStatus + '').toLowerCase() === 'true'
  const [previewTitle, setPreviewTitle] = useState("Preview Question Paper")
  const [dragPositionHeader, setDragPositionHeader] = useState({})
  const [templateFontDetails ,setTemplateFontDetails] = useState()
  const [openPrintModel,setOpenPrintModel]=useState<boolean>(false)
  const [cancelStatus,setCancelStatus]=useState<boolean>(false)
  const [printedData,setPrintedData]=useState<string>('')
  const [enableDone,setEnableDone]=useState<boolean>(false)
  const [isFormal,setIsFormal]=useState<boolean>(false)
  const [adminList,setAdminList]=useState<any>([])
  const [versionHistoryData,setVersionHistoryData]=useState<any>([])
  const [hideBtn,setHideBtn]=useState<boolean>(false)
  const [hideBtnsave,setHideBtnsave]=useState<boolean>(false)
  const [printWithAnswer,setPrintWithAnswer]=useState<boolean>(false)
  const [validatePopup,setValidatePopup]=useState<boolean>(false)
  const [invalidQpcount, setinvalidQpcount] = useState<number>(0);
  const [count,setCount]=useState<number>(0)
  const [qpName,setQpName]=useState<any>("")
  const [key, setKey] = useState<number>(0)
  const [qpCourses,setQpCourses]=useState<any>([])
  const [printConfig,setPrintConfig] = useState()
  const [sections, setSections] = useState([]);
  const [dragPositionHeaderDetails, setDragPositionHeaderDetails] = useState<any>([])
  const [hideSetButton, setHideSetButton] = useState<boolean>(true);
  const [studentListModal, setStudentListModal] = useState<boolean>(false)
  const [studentList, setStudentList] = useState<any>();
  const clonedValue =  intialLoadData?.generatedQuestionPaper?.headerDetails?.find((x: any) => x?.sectionTypeKey == "instructionsSection")?.sectionDetails?.sectionFields[0]?.fieldValue
  const replaceQp=(newQp:any)=>{
    setReqBody(newQp)
    setUndoDisable(false)
    setredoDisable(true);
    setActions({
      undo:reqBody,
      redo:newQp
    });
  }
  const [questionPaperCustomStatus, setQuestionPaperCustomStatus] = useState(false)
  const [questionPaperCustomData, setQuestionPaperCustomData] = useState()
  const [highlightstartTime, setHighlightStartTime] = useState(false);
  const [fieldItemData, setFieldItemData] = useState()
  const [customFontStyle, setCustomFontStyle] = useState<any>({})
  const [showAssignBtn, setShowAssignBtn] = useState(location?.state?.showAssignBtn);
  const [totalTime, setTotalTime] = useState<any>();
  const [typeOfLine, setTypeOfLine] = useState('')
  const [workbookStyle, setWorkbookStyle] = useState(false);
  const [doneworkbookCheck, setDoneworkbookCheck] = useState(false);
  const [isWorksheetEdit, setIsWorksheetEdit] = useState(false)

  const [continueEditingWorksheet,setContinueEditingWorksheet]= useState(false);

  const questionPaperCustomFontHandler = (async (questionId:number) => {
    // const previewTemplateData = await getPreviewTemplate(questionId);
    setFieldItemData(Object.keys(customFontStyle).length > 0 ? customFontStyle : intialLoadData?.generatedQuestionPaper?.bodyTemplate?.templateBuilderInfo?.questionPaperFontMetaData)
    setQuestionPaperCustomData(templateJson?.generatedQuestionPaper)
    setQuestionPaperCustomStatus(true)
  })
  const [changedReqBody, setChangedReqBody] = useState<any>();
  const [compMarkValue,setCompMarkValue] = useState<any>()

  const replaceNestedObjectByIdField = (template:any, id: string, replacement: any, type:any)=> {
    if (template?.templateBuilderInfo && template?.templateBuilderInfo?.templateParts) {
      const parts = template.templateBuilderInfo.templateParts;
      replaceNestedObject(parts, id, replacement, type);
    }
  }
  const replaceNestedObject = (parts:any, id: string, replacement: any, questionType:any)=> {
    for (let i = 0; i < parts?.length; i++) {
      if (parts[i].id === id && parts[i].type == questionType) {
        parts[i] = replacement;
        setChangedReqBody(JSON.parse(JSON.stringify(reqBody)))
        return;
      } else if (parts[i]?.children) {
        replaceNestedObject(parts[i].children, id, replacement, questionType);
      }
    }
  }

  useEffect(() => {
    if(compMarkValue != undefined){
      let modifiedJsonObj = JSON.parse(JSON.stringify(compMarkValue))
      replaceNestedObjectByIdField(reqBody?.bodyTemplate, modifiedJsonObj?.id, modifiedJsonObj, modifiedJsonObj.type)
    }      
  },[compMarkValue])

  const printQuesion = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: `
    @page {
      size: auto;
      margin: 1cm 1cm 1cm 1cm;

      @bottom-right {
          content: "Page " counter(page);
      }
    }`,
    documentTitle: '',
    copyStyles: true
  });


  const getPreviewQuestions = useCallback(async (id:string,print?:boolean) => {
    const res:any = await QuestionPaperViewApi(id, (location?.state?.print || print) ?? false);
    if (res?.data) {
      setQpCourses(res?.data?.courses?.map((x:any)=>x?.courseID)||[])
      setSections(res?.data?.sections?.map((x: any) => x?.sectionID) || []);
      setIntialLoadData(JSON.parse(JSON.stringify(res?.data)))
      setReqBody(res?.data?.generatedQuestionPaper);
      if("printConfig" in res?.data) setPrintConfig(res?.data?.printConfig)      
      setQpName(res?.data?.name)
      setTemplateJson(res?.data)
      setWorkbookStyle(res?.data?.isWorkSheetStyle);
      setDoneworkbookCheck(res?.data.isWorkSheetStyle)
      setActions({
        undo:{},
        redo:res?.data?.generatedQuestionPaper
      })
      const replaceQns={
        gradeID:res?.data?.gradeID,
        courses:res?.data?.courses,
        themes:res?.data?.themes,
        chapters:res?.data?.chapters,
        topics:res?.data?.topics,
        questionPaperTypeID:res?.data?.questionPaperTypeID,
        paperId:id
      }
      setReplace(replaceQns)
      print && setTimeout(()=>{printQuesion();setSpinnerStatus(false)},1000)
    }
    const getHeaderDetails = res?.data?.generatedQuestionPaper.headerDetails?.map((header:any) => ({
      sectionSequence: header?.sectionSequence,
      sectionTypeKey: header?.sectionTypeKey,
    }));
  },[location?.state?.print, printQuesion]);

  const getRandomizePreviewQuestions = async () => {
    if(questionPaperId != ''){
      setGenerateLoader(true)
      const res = await QuestionPaperRandomize({"questionPaperID": Number(questionPaperId)});
      if (res?.result?.responseCode == 0 || res?.result?.responseDescription === "Success") {
        if (res?.data) {
          setTimeout(() => {
            setGenerateLoader(false)
          },1000)
          setPrintForPreviewEdit(true)
          const randomizeData = {
            bodyTemplate: res.data?.templateMetaInfo?.bodyTemplate,
            headerDetails: reqBody?.headerDetails
          }
          setReqBody({...randomizeData})
          setTemplateJson(res?.data)
          setUndoDisable(false)
          setredoDisable(true);
          setActions({
            undo:reqBody,
            redo:{...randomizeData}
          });
        }
      }else{
        setGenerateLoader(false)
        setSnackBar(true);
        setSnackBarSeverity('error');
        setSnackBarText(`something went wrong`)
        setSpinnerStatus(false)
      }
    }
  };

  const getadminListForFormal = async() => {
    let data = await getadminList()

    let adminListData: any = []
    if(data && data.length>0 ){
      data.forEach((e:any) => {
        let options = {
          label: (e.firstName??"") + " " + (e.lastName??"") + " (" + e.userCustomRole + ")",
          value: e.userId
        }
        adminListData.push(options)
      })
    }
    setAdminList(adminListData)
  }

  const getVersions = async() => {
    let res = await getVersionHistory(Number(questionPaperId))
    setVersionHistoryData(res?.data)
  }

  useEffect(() => {
    if( Number(questionPaperId) >0)  getVersions()
  },[questionPaperId])

  useEffect(() => {
    if(isFormal)  getadminListForFormal()
  },[isFormal])

  useEffect(() => {
    if (shouldLog.current) {
      shouldLog.current = false
      getPreviewQuestions(location?.state?.templateId);
      setQuestionPaperId(location?.state?.templateId);
    }
  },[])
  useEffect(()=>{
  if(reqBody && Object.keys(reqBody)?.length>0 && count==0){
    location?.state?.print &&  printOpenHandler()
    setCount((prev:any)=>prev+1)
  }
    if (reqBody && Object.keys(reqBody)?.length > 0) {
      const section = reqBody?.headerDetails?.find((section: any) => section.sectionTypeKey === 'subjectSection'); // Find the section
      const totalTimeField = section?.sectionDetails.sectionFields.find((field: any) => field.fieldKey === 'totalTime'); // Find the field
      const totalTime = totalTimeField?.fieldValue;
      setTotalTime(totalTime);
    }
  },[reqBody])

    useEffect(() => {
      setTimeout(() => {
        if (anchorEl == null || anchorEl == "") {
          setQuillPopupOpen(false)
        }else{
          setQuillPopupOpen(true)
        }
      },100)
    },[anchorEl])

    useEffect(() => {
      if (!quillPopupOpen) {
        setAnchorEl("")
      }
    },[quillPopupOpen])


  const undoRedoFn = (action: string) => {
    switch (action) {
      case 'undo':
        setSpinnerStatus(true)
        setTimeout(()=>{
          setReqBody({ ...actions?.undo });
          setTypeOfLine(findFirstQuestionBorderType(actions?.undo.bodyTemplate.templateBuilderInfo.templateParts));
          setredoDisable(false);
          setUndoDisable(true)
          setSpinnerStatus(false)
          setKey(Math.random())
        },250)
        break;
      case 'redo':
        setSpinnerStatus(true)
        setTimeout(()=>{
        setReqBody({ ...actions?.redo });
        setTypeOfLine(findFirstQuestionBorderType(actions?.undo.bodyTemplate.templateBuilderInfo.templateParts));
        setredoDisable(true)
        setUndoDisable(false)
        setSpinnerStatus(false)
        setKey(Math.random())
        },250)
        break;
    }
  }

  const examNameGet = (examName:string, data:any) => {
    let examNameText = "";
    data?.headerDetails.map((items:any) => {
      if(examName == items?.sectionTypeKey){
        items?.sectionDetails?.sectionFields.map((sectionItem:any) => {
          if(sectionItem?.fieldKey == "examName"){
            examNameText = sectionItem.fieldValue
            }
          })
        }
      })
      return examNameText
  }

  const [markerrorQnsIds,setmarkerrorQnsIds]=useState<any>([])
  const [grperrorQnsIds,setgrperrorQnsIds]=useState<any>([])
  let grpQP:any[]=[];
  let qpId:any[]=[];
  let res:any[]=[];
const identifyChildQPId=(data:any,errId:any)=>{
  res=[];
    const traverseJson = (obj:any) => {
      for (const key in obj) {
        if ((typeof obj[key] === "object" || typeof obj[key] === "number") && obj[key] !== null) {
          if (
            obj[key] &&
            key === "id" &&
            obj["type"] !=="Question" &&
            errId.includes(obj[key])
          ) {
            grpQP=[]
            qpId=[]
            setmarkerrorQnsIds((prev:any)=>(Array.from(new Set([...prev,obj[key]]))))
            grpQP.push(obj[key])
            const returnVal=subTraverse(obj)
            const subQPid=Array.from(new Set(returnVal))
            grpQP.push(...subQPid)
            res.push(grpQP)
          }else if (obj[key] &&
            key === "id" &&
            obj["type"] =="Question" &&
            errId.includes(obj[key])){
              setmarkerrorQnsIds((prev:any)=>((Array.from(new Set([...prev,obj[key]])))))
              res.push([obj[key]])
            }
          traverseJson(obj[key]);
        }
      }
    };
    const subTraverse=(subObj:any)=>{
      for (const key in subObj) {
        if ((typeof subObj[key] === "object" || typeof subObj[key] === "number") && subObj[key] !== null) {
          if (
            subObj[key] &&
            subObj.hasOwnProperty("type") &&
            subObj["type"] === "Question"
          ){
            setmarkerrorQnsIds((prev:any)=>( (Array.from(new Set([...prev,subObj["id"]])))))
            qpId.push(subObj["id"])
          }
          subTraverse(subObj[key]);
        }
      }
      return (qpId)
    }
    traverseJson(data);
    setgrperrorQnsIds(res)
}

  const doneAPIFn = async (id: number, body: any, isCancel: boolean) => {
    body.generatedQuestionPaper.headerDetails = updateArrayObj(dragPositionHeaderDetails?.headerDetails, reqBody?.headerDetails, "fieldValue");
    const valRes=validateQns()
    if(valRes?.length == 0){
    setmarkerrorQnsIds([])
    setgrperrorQnsIds([])
    body.name = examNameGet("examNameSection", body.generatedQuestionPaper)
    body.isEdit =true
    // body.isWorkSheetStyle = istypeOflinesPresent(reqBody?.bodyTemplate, 'Question');
    body.isWorkSheetStyle= workbookStyle
    body.isActualEdit = isWorksheetEdit;
    if(isOnlineAssesssment){
      const isInstructionPresent = body?.generatedQuestionPaper?.headerDetails?.some((el: any) => el.sectionTypeKey == "instructionsSection");
      const onlineAssesmentInfo =  JSON.parse(localStorage.getItem('onlineAssessment') as any);
      body.startTime= onlineAssesmentInfo.startTime
      body.endTime= onlineAssesmentInfo.endTime
      body.startDate= onlineAssesmentInfo.startDate
      body.endDate= onlineAssesmentInfo.endDate

      if (changedPopoverValue?.sectionName === 'instructionsSection' && !isInstructionPresent) {
        const onlineInstructionObj = {
          "sectionDetails": {
            "sectionFields": [
              {
                "fieldKey": "instructions",
                "fieldName": "Instructions",
                "fieldValue": changedPopoverValue?.value,
                "fieldDefault": false,
                "fieldSelected": false,
                "fieldSequence": 0,
                "fieldType": "textarea",
                "fieldMaxLength": 0,
                "fieldValidation": ""
              }
            ]
          },
          "sectionTypeKey": "instructionsSection",
          "sectionSequence": body?.generatedQuestionPaper?.headerDetails.length + 1
        }
        body?.generatedQuestionPaper?.headerDetails.push(onlineInstructionObj);
      }
    }
    setSpinnerStatus(true)
    if (JSON.stringify(intialLoadData?.generatedQuestionPaper) !== JSON.stringify(body?.generatedQuestionPaper) || isOnlineAssesssment || (workbookStyle != doneworkbookCheck)) {
      const res = await DonePutApi(id, body);
      if (res?.result?.responseCode == 0 || res?.result?.responseDescription === "Success") {
        if (!isCancel) {
          setSnackBar(true);
          setSnackBarSeverity('success');
          setSnackBarText(workbookStyle ? 'Worksheet saved Successfully' : `Question Paper updated Successfully`)
        }
        setPrintForPreviewEdit(false)
        localStorage.removeItem('onlineAssessment');
        if (isOnlineAssesssment) {
          history(-1);
        }
        await getPreviewQuestions(location?.state?.templateId);
        await getVersions()
      } else if (res?.response?.status == 400 && res?.response?.data?.ids?.length > 0) {
        identifyChildQPId(templateJson?.generatedQuestionPaper, res?.response?.data?.ids)
        setSnackBar(true);
        setSnackBarSeverity('error');
        setSnackBarText(`Please re-validate the marks`)
      } else if (res?.response?.status == 400 && !(res?.response?.data?.ids?.length > 0)) {
        setHighlightStartTime(true);
        setSnackBar(true);
        setSnackBarSeverity('error');
        setSnackBarText(res?.response?.data?.responseDescription)
      }
      else {
        setSnackBar(true);
        setSnackBarSeverity('error');
        setSnackBarText(`something went wrong`)
      }
      setSpinnerStatus(false)
    }else{
      setPrintForPreviewEdit(false)
      setSpinnerStatus(false)
    }
  }else if(valRes?.length >0){
      setValidatePopup(true)
  }
  }

  const cancelFn = async (e: boolean) => {
    if (e) {
      setcontinueEditing(false)
    } else {
      if(cancelStatus){
      setPrintForPreviewEdit(false)
      setChangedPopoverValue(false)
      setcontinueEditing(false);
      setReqBody(intialLoadData?.generatedQuestionPaper)
      setCustomFontStyle({})
      }else{
        //history(-1);
        isOnlineAssesssment ? history("/assess/evaluation/onlineAssesment")  :  history("/assess/questionpaper");
      }
    }
  }
const cancelFnWorksheet= async (e: boolean) => {
  if (e) {
    setContinueEditingWorksheet(false)
    setReqBody(intialLoadData?.generatedQuestionPaper)
    setWorkbookStyle(false)
  } else {
    setContinueEditingWorksheet(false);
  }
}  

  const setsApi = async(e:number) =>{
    setSpinnerStatus(true)
    const response = await setsPostAPI({"questionPaperId": Number(questionPaperId),"numberOfSets": e});
    if (response?.result?.responseCode == 0 || response?.result?.responseDescription === "Success") {
      setSnackBar(true);
      setSnackBarSeverity('success');
      setSnackBarText(`Question Paper Saved Successfully with ${e} sets`);
      setSpinnerStatus(false)
      setTimeout(()=>{
        history("/assess/questionpaper")
      },2500)
    }else{
      setSnackBar(true);
      setSnackBarSeverity('error');
      setSnackBarText(`something went wrong`)
      setSpinnerStatus(false)
    }
  }

  const [triggerReqBody, setTriggerReqBody] = useState<any>()
  useEffect(() => {
    if (changedPopoverValue?.sectionName == 'instructionsSection') {
      reqBody?.headerDetails.map((items: any) => {
        if (changedPopoverValue?.sectionName == items?.sectionTypeKey) {
          items?.sectionDetails?.sectionFields.map((sectionItem: any) => {
            if (sectionItem?.fieldKey == changedPopoverValue?.fieldKey) {
              sectionItem.fieldValue = changedPopoverValue.value
            }
            return;
          })
        }
      })
      setReqBody(reqBody)
    }
  }, [changedPopoverValue])

  const removeHTMLTags=(inputString:any)=> {
    return inputString.replace(/<[^>]*>/g, '');
  }

  const printAnsHandler=()=>{
    const valRes=validateQns()
    if(valRes?.length == 0){
    setPrintWithAnswer(true);
    setSpinnerStatus(true);
    setTimeout(()=>{ printQuesion();setSpinnerStatus(false)},1000)
    }else if(valRes?.length >0){
      setValidatePopup(true)
    }
  }

  const statusApi = () =>{
    const valRes=validateQns()
    if(valRes?.length == 0){
      setSpinnerStatus(true)
        setSnackBar(true);
        setSnackBarSeverity('success');
        if(isFormal && qpName){
          setSnackBarText(`${removeHTMLTags(qpName)} Saved Successfully`)
        }else{
          setSnackBarText(workbookStyle ? 'Worksheet saved Successfully' : `Question Paper Saved Successfully`)
        }
        setTimeout(()=>{
          setSpinnerStatus(false)
          history("/assess/questionpaper")
        },2500)
    }else if(valRes?.length >0){
      setValidatePopup(true)
    }

  }

  useEffect(()=>{
      setPrintForPreviewEdit(location?.state?.state)
      setIsFormal(location?.state?.questionPaperTypeID == 2 ? true : false)
      setHideBtn(location?.state?.enablebtnPrint)
      setHideBtnsave(location?.state?.disableBtnPrint)
      setHideSetButton(location?.state?.markStatus);
  },[location?.state && location?.state?.state])

  useEffect(() => {
    if(Object?.keys(dragPositionHeaderDetails)?.length > 0){
      setReqBody({...dragPositionHeaderDetails})
    }
  },[dragPositionHeaderDetails])

  const fontDetailsSelectValue = async () => {
    const response = await fontDeatailsDropdown()
    if (response?.result?.responseCode == 0) {
      setTemplateFontDetails(response?.data)
    }
  }

  useEffect(() => {
    fontDetailsSelectValue()
  },[])

  const sendForApproval = async(e :any) => {
    let postObj = {
      "questionPaperId": Number(questionPaperId),
      "approverId": e?.value
    }
    setGenerateLoader(true)
    let result = await postApproval(postObj);
    if ( result?.responseCode == 0 || result?.responseDescription === "Success") {
      setGenerateLoader(false)
      setSnackBar(true);
      setSnackBarSeverity('success');
      setSnackBarText(`’${templateJson?.name.replace(/<\/?[^>]+(>|$)/g, "")}’ sent for Review Successfully`);
      setTimeout(()=>{
        history("/assess/questionpaper")
      },2500)
    }
    else{
      setGenerateLoader(false)
      setSnackBar(true);
      setSnackBarSeverity('error');
      setSnackBarText(`Something went wrong`)
      setSpinnerStatus(false)
    }
  }

  useEffect(() => {
    if(!localStorage.hasOwnProperty('show_version_history')) localStorage.setItem('show_version_history','false')
  },[])

  useEffect(()=>{
    setPreviewTitle(printForPreviewEdit ? 'Edit Question Paper' : 'Preview Question Paper')
  },[printForPreviewEdit])

  const componentRef:any = useRef();

  const editFn = () =>{
    setPreviewTitle("Edit Question paper");
    setPrintForPreviewEdit(true);
    setCancelStatus(true);
    setredoDisable(true);
    setUndoDisable(true)
  }

const validateQns = ( ) => {
  const validQuestionPaper:any[]=[]
  const traverseJson = (obj:any) => {
    for (const key in obj) {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        if (
          obj[key].hasOwnProperty("questionInfo") && obj[key]?.type === "Question"
        ) {
          if( obj[key]?.questionInfo == null ||obj[key]?.questionInfo == undefined){
            validQuestionPaper.push(false)
          }
        }
        traverseJson(obj[key]);
      }
    }
  };
  traverseJson(reqBody);
  setinvalidQpcount(validQuestionPaper?.length||0)
  return validQuestionPaper;
};
   const printOpenHandler=()=>{
    const valRes=validateQns()
    if(valRes?.length == 0){
    setOpenPrintModel(true);
    }else if(valRes?.length >0){
      setValidatePopup(true)
      setOpenPrintModel(false);
    }
   }

  const instructionUndoRedo = useCallback((arg:string) => {
    const reformedState = reqBody?.headerDetails?.map((items: any) => {
      if (items?.sectionTypeKey == 'instructionsSection') {
        const changedInstructionValue = items?.sectionDetails?.sectionFields.map((sectionItem: any) => {
          if (sectionItem?.fieldKey == 'instructions') {
            sectionItem.fieldValue = arg;
            return sectionItem;
          }
        })
        return { ...items, sectionDetails: { sectionFields: changedInstructionValue } }
      } else {
        return items;
      }
    })
    return {bodyTemplate:reqBody?.bodyTemplate,headerDetails:reformedState}
  },[reqBody?.bodyTemplate, reqBody?.headerDetails])

  const setStateFunction = useCallback((key: string, state: any, redo?: any, isDraggable?:boolean) => {
    switch (key) {
      case 'done':
        setEnableDone(state)
        break;
      case 'undo':
        setUndoDisable(state)
        break;
      case 'redo':
        setredoDisable(state)
        break;
      case 'actions':
        if ((state == null) && (typeof redo == "string")) {
          const undoObject = JSON.parse(JSON.stringify(instructionUndoRedo(clonedValue as any)));
          const redoObject = JSON.parse(JSON.stringify(instructionUndoRedo(redo)));
          setActions({ undo: undoObject, redo: redoObject });
          return;
        }
        if ((state != null) && (typeof redo != "string")) {
          if(isDraggable) setDragPositionHeaderDetails(JSON.parse(JSON.stringify(redo)))       
          setActions({ undo: state, redo: redo ?? reqBody })
        }
        break;
    }
  },[clonedValue, instructionUndoRedo, reqBody])


  const enableDoneBtnByValue = (value:boolean,questionData:any) => {
    setEnableDone(value)
    if(questionData ){
      questionData.forEach((i: any) => {
        if(i.children.some((elem: any) => !elem.marks || elem.marks ==0 || elem.marks =='' || parseInt(elem.marks) <=0  )) setEnableDone(true)
        else setEnableDone(false)
      })
    }
  }

  const customFontApplyHandler = ((customFontStyleData:any) => {
    setCustomFontStyle(customFontStyleData.bodyTemplate.templateBuilderInfo.questionPaperFontMetaData)
    let initialReqBodyObj = JSON.parse(JSON.stringify(reqBody));
    initialReqBodyObj.bodyTemplate.templateBuilderInfo.questionPaperFontMetaData = customFontStyleData.bodyTemplate.templateBuilderInfo.questionPaperFontMetaData;
    setReqBody(initialReqBodyObj);
    setQuestionPaperCustomStatus(false)
    //setPrintForPreviewEdit(false)
  })

  const isOnlineAssesssment= window.location.href.includes('onlineAssesment/printforpreview');
  const handleWorkbook = () => {
    if (workbookStyle == false) {
      const valRes = validateQns();
      if (valRes?.length > 0) {
        setValidatePopup(true)
      }
      else {
        setWorkbookStyle(!workbookStyle)
      }
    }
    else{
      if (JSON.stringify(intialLoadData?.generatedQuestionPaper?.bodyTemplate?.templateBuilderInfo?.templateParts) !== JSON.stringify(reqBody?.bodyTemplate?.templateBuilderInfo?.templateParts)) {
        setContinueEditingWorksheet(true)
      }
      else{
        setWorkbookStyle(false)
      }
    }
  }

  const handleWorksheetGlobal = (e: any) => {
    const updatedJson: any = JSON.parse(JSON.stringify(reqBody)); 

    const checkTypeOfLines = (parts: any) => {
      const validTypes = ['Solid Line(s)', '2 Lines', 'Rectangle(s)'];
      let hasValidType = false;
      const checkParts = (partsList: any) => {
        partsList.forEach((part: any) => {
          if (part.typeOfLines && Object.keys(part.typeOfLines).some(key => validTypes.includes(key))) {
            hasValidType = true; 
          }
          // Recursive check for nested parts
          if (part.children && part.children.length > 0) {
            checkParts(part.children);
          }
        });
      };
      checkParts(parts);
      return hasValidType;
    };
  
    const hasValidTypeInBody = checkTypeOfLines(updatedJson.bodyTemplate?.templateBuilderInfo?.templateParts);
  
    if (!hasValidTypeInBody) {
      setSnackBar(true);
      setSnackBarSeverity('error');
      setSnackBarText(`No questions with applicable line styles found. Please ensure questions have lines or rectangles to apply this change.`);
    }
  
    else setTypeOfLine(e);
  };
  


  const handleStudentModalCLose = () => {
    setStudentListModal(false)
  }
  const emptyQuestionPresent = reqBody?.bodyTemplate?.templateBuilderInfo?.templateParts?.some((data: any) => data?.questionInfo == null)

  //calling the Done API
  const saveData = async (id: number, body: any) => {
    setSpinnerStatus(true)
    body.generatedQuestionPaper.headerDetails = updateArrayObj(dragPositionHeaderDetails?.headerDetails, reqBody?.headerDetails, "fieldValue");
    const valRes = validateQns()
    if (valRes?.length == 0) {
      setmarkerrorQnsIds([])
      setgrperrorQnsIds([])
      body.name = examNameGet("examNameSection", body.generatedQuestionPaper)
      body.isEdit = true
      if (isOnlineAssesssment) {
        const isInstructionPresent = body?.generatedQuestionPaper?.headerDetails?.some((el: any) => el.sectionTypeKey == "instructionsSection");
        const onlineAssesmentInfo = JSON.parse(localStorage.getItem('onlineAssessment') as any);
        body.startTime = onlineAssesmentInfo.startTime
        body.endTime = onlineAssesmentInfo.endTime
        body.startDate = onlineAssesmentInfo.startDate
        body.endDate = onlineAssesmentInfo.endDate

        if (changedPopoverValue?.sectionName === 'instructionsSection' && !isInstructionPresent) {
          const onlineInstructionObj = {
            "sectionDetails": {
              "sectionFields": [{
                "fieldKey": "instructions",
                "fieldName": "Instructions",
                "fieldValue": changedPopoverValue?.value,
                "fieldDefault": false,
                "fieldSelected": false,
                "fieldSequence": 0,
                "fieldType": "textarea",
                "fieldMaxLength": 0,
                "fieldValidation": ""
              }
              ]
            },
            "sectionTypeKey": "instructionsSection",
            "sectionSequence": body?.generatedQuestionPaper?.headerDetails.length + 1
          }
          body?.generatedQuestionPaper?.headerDetails.push(onlineInstructionObj);
        }
      }

      if (JSON.stringify(intialLoadData?.generatedQuestionPaper) !== JSON.stringify(body?.generatedQuestionPaper) || isOnlineAssesssment) {
        const res = await DonePutApi(id, body);
        return res;
      }
    }
  }

  const handleAssignStudent = async () => {
    const res: any = await saveData(Number(questionPaperId), { ...intialLoadData, generatedQuestionPaper: reqBody });
    if (res?.result?.responseCode == 0 || res?.result?.responseDescription === "Success") {
    try {
      const apiPayload = {
        "staffId": stateDetails.login.userData.userRefId,
        "courseId": qpCourses,
        "sectionId": sections,
        "gradeId": [location?.state?.onlineAssessmentData?.gradeID],
        "qpId": location?.state?.templateId,
        "qpTypeId": 1,
        "isStudentCourse": true
      }
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
    }
    catch (error) {
      console.log(error);
    }
  }
  }


  return (
    <MessageContext.Provider value={{ actions, reqBody, setStateFunction }}>
      <div className={`quePapPreviewforPrint qpPreviewforPrintPrev`}>
        {quillPopupOpen && <QuillToolbarPopover anchorTag={anchorEl} quillPopupOpen={quillPopupOpen} setQuillPopupOpen={setQuillPopupOpen} changedPopoverValue={changedPopoverValue} reqBody={reqBody} setmarkerrorQnsIds={setmarkerrorQnsIds} grperrorQnsIds={grperrorQnsIds} setTriggerReqBody={setTriggerReqBody} setTotalTime={setTotalTime} />}
        <div className='questionPaperPreviewSect'>
          <div className='questionPaperPreviewSectLeft'>
            <h2 className='questionPaperPreviewTitle'>{previewTitle}</h2>
            <p>You can make edits to the generated question paper here</p>
          </div>
          <div className='questionPaperPreviewSectRight'>
            {printForPreviewEdit ?
            <>
              <div className='d-flex gap-3'>
              {!isOnlineAssesssment && <ButtonComponent type={"outlined"} label={'Customise Fonts'} backgroundColor={"#01B58A"} textColor={'#1B1C1E'} buttonSize={"Medium"} minWidth={'140'} image={""} onClick={() => questionPaperCustomFontHandler(intialLoadData?.templateID)} btnToolTipText={"Customise Question Paper Fonts"}/>}
              {!isOnlineAssesssment && <ButtonComponent type={"outlined"} label={workbookStyle ? 'Make Question Paper Style' : 'Convert to  Worksheet Style'} backgroundColor={"#01B58A"} textColor={'#1B1C1E'} buttonSize={"Medium"} minWidth={'140'} image={""} onClick={()=> handleWorkbook()} />}
                <ButtonComponent type={"outlined"} label={'Randomize'} backgroundColor={"#01B58A"} textColor={'#1B1C1E'} buttonSize={"Medium"} minWidth={'140'} image={""} onClick={() => getRandomizePreviewQuestions()} btnToolTipText={"Randomly select new Questions"}/>
              </div>
              {!isOnlineAssesssment && <div className='questionPaperPreviewSectRightAction'>
                <ButtonComponent type={'button'} label={'Undo'} textColor={''} buttonSize={"Medium"} minWidth={''} image={undo} disabled={undoDisable} onClick={()=>{undoRedoFn('undo')}} hideBorder={true}/>
                <ButtonComponent type={'button'} label={'Redo'} textColor={''} buttonSize={"Medium"} minWidth={''} image={Redo} disabled={redoDisable} onClick={()=>{undoRedoFn('redo')}} hideBorder={true}/>
              </div>}
            </>
            :
            <>
             <div className='questionPaperPreviewSectPrintSolution'>
             {(!isFormal || isFormal && (!hideBtnsave||!hideBtn)) &&
              <ButtonComponent type={"outlined"} label={'Print Model Answer Paper'} backgroundColor={"#385DDF"} textColor={'#1B1C1E'} buttonSize={"Medium"} minWidth={'140'} image={""} onClick={() => {printAnsHandler()}} btnToolTipText={"Print Model Answer Paper"}/>
             }
              {(!isFormal || isFormal && !hideBtnsave) &&
                    <ButtonComponent type={"outlined"} label={'Edit'} backgroundColor={"#01B58A"} textColor={'#1B1C1E'} buttonSize={"Medium"} minWidth={'140'} image={""} onClick={() => { editFn() }} disabled={location?.state?.editStatus || location?.state?.markStatus} />
            }
            </div>
            </>
            }
          </div>
        </div>


        {/* <ButtonComponent backgroundColor="#01B58A" type="outlined" label={'Randomize'} textColor={''} buttonSize="Large" minWidth="226"/> */}
        <div style={{ display: "flex", gap: "32%" }}>


        </div>
        <div className={!isOnlineAssesssment ? "quePapPreviewforPrintContent" :"quePapPreviewforPrintContentOnline"}>
          {versionHistoryData && versionHistoryData.length>0 && !isOnlineAssesssment &&
            <VersionHistory questionPaperId={questionPaperId} historyData={versionHistoryData}/>
          }
          <div style={{width:"100%"}} className={`quePapPreviewforPrintPreview ${printForPreviewEdit ? "printForPreviewEditEnable" : ""}`}>
            <QuestionPaperTemplate templateFontDetails={templateFontDetails} ReqBody={reqBody} replace={replace} replaceQp={replaceQp} templatePrintEdit={printForPreviewEdit} previewMode={"templateMode"} setAnchorEl={setAnchorEl} markerrorQnsIds={markerrorQnsIds} templateJson={templateJson} changedPopoverValue={changedPopoverValue} setChangedPopoverValue={setChangedPopoverValue} triggerReqBody={triggerReqBody} dragPositionHeader={setDragPositionHeader} setStateFunction={setStateFunction} key={key} qpCourses={qpCourses} setmarkerrorQnsIds={setmarkerrorQnsIds} grperrorQnsIds={grperrorQnsIds} enableDoneBtnByValue={enableDoneBtnByValue} setCompMarkValue={setCompMarkValue} printConfig={printConfig} highlightstartTime={highlightstartTime} setHighlightStartTime={setHighlightStartTime} totalTime={totalTime} typeOfLine={typeOfLine} workbookStyle={workbookStyle} isWorksheetEdit={setIsWorksheetEdit}  />
            <div id="quePapPreviewforPrintPreviewContent" >
              <div id="pageFooter">

              </div>
          </div>
          </div>
        </div>
      </div>

      <div className='quesPaperPreviewPrintFooter'>
        <div className='quesPaperPreviewPrintFooterSect'>
          <h5 className='m-0'>Total questions: {reqBody?.bodyTemplate?.templateBuilderInfo?.paperLevelIndexSequence?.question}</h5>
          <div className='d-flex gap-4'>
            {!printForPreviewEdit ?
            <>
              {(!isFormal || isFormal && !hideBtnsave) && !hideSetButton && <ButtonComponent backgroundColor="#01B58A" type="contained" label={isFormal ? 'Save as Draft' : 'Save'} textColor={''} buttonSize="Large" minWidth="226" onClick={()=>{statusApi()}}/>}
              {!hideBtn && !hideSetButton && <DropDownButtonComponent buttonName={'Save with Sets'} minWidth="226" buttonOptions={[1,2,3,4]} onChangeHandler={(e:any)=>{setsApi(e)}} validateQns={validateQns} setValidatePopup={setValidatePopup}/>}
              {isFormal && !hideBtnsave && <DropDownButtonComponent buttonName={'Send for Approval'} minWidth="226" buttonOptions={(adminList.length>0 ? adminList : [{ "label": "No Data Found", "value": 0 }] )} onChangeHandler={(e:any)=>{sendForApproval(e)}} validateQns={validateQns} setValidatePopup={setValidatePopup}/>}
              {!hideBtn && <ButtonComponent backgroundColor="#01B58A" type="contained" label={'Print'} textColor={''} buttonSize="Large" minWidth="226" onClick={()=>{ setPrintWithAnswer(false);printOpenHandler() }}/>}
                <ButtonComponent backgroundColor="#01B58A" type="outlined" label={hideBtnsave && hideBtn ? 'Close Preview' : 'Cancel'} textColor={'#000'} buttonSize="Large" minWidth="226" onClick={() => { history("/assess/questionpaper") }} />
            </>
            :
            <>
                {showAssignBtn && !emptyQuestionPresent && <ButtonComponent backgroundColor="#01B58A" type="contained" label={'Assign Students '} disabled={false} textColor={''} buttonSize="Large" minWidth="150" onClick={handleAssignStudent} />}
            {/* {availableModules.includes(20) && <DropDownButtonComponent buttonName={'Add WorkBook'} minWidth="226" buttonOptions={[0,1,2,3,4,5,6,7,8,9,10]}  onChangeHandler={(e:any)=>{ handleWorkbook(e)}} />} */}
            <ButtonComponent backgroundColor="#01B58A" type="contained" label={'Done'} disabled={enableDone||markerrorQnsIds?.length>0} textColor={''} buttonSize="Large" minWidth="150" onClick={()=>{doneAPIFn(Number(questionPaperId),{...intialLoadData,generatedQuestionPaper:reqBody},false)}}/>
            <ButtonComponent backgroundColor="#01B58A" type="outlined" label={'Cancel'} textColor={'#000'} buttonSize="Large" minWidth="150" onClick={() => {setcontinueEditing(true)}} />
            {availableModules.includes(20) && workbookStyle && <span className="workBook-btn-auto"> <DropDownButtonComponent buttonName={'Type Of Lines'} minWidth="226" buttonOptions={['SOLID UPPER LINE', 'SOLID LOWER LINE', 'DOTTED UPPER LINE', 'DOTTED LOWER LINE']}  onChangeHandler={(e:any)=> handleWorksheetGlobal(e)} /> </span>}
            </> }
            </div>
        </div>
      </div>
      {spinnerStatus && <Spinner />}
      <Toaster onClose={() => { setSnackBar(false) }} severity={SnackBarSeverity} text={snackBarText} snakeBar={snackBar} />
      {/* {changePopup && <ChangeFieldModalPopup open={changePopup} clickHandler={(e:boolean)=>{popupHandler(e,popupTitle)}} header={`Reset ${popupTitle}`} label1='Continue' label2='Cancel' onClose={()=>{setChangePopup(false)}} subHeader1={`You are about to reset your ${popupTitle} to default`} subHeader2="Are you sure you want to continue?"/>} */}
      {continueEditing && <ChangeFieldModalPopup open={continueEditing} clickHandler={(e:boolean)=>{cancelFn(e)}} header={`Unsaved Changes`} label1='Continue Editing' label2='Exit' onClose={()=>{setcontinueEditing(false)}} subHeader1={`You have unsaved changes that will be lost if you decide to exit.`} subHeader2="Are you sure you want to exit?"/>}
      {continueEditingWorksheet && <CloseWorkSheetModal open={continueEditingWorksheet} clickHandler={(e:boolean)=>{cancelFnWorksheet(e)}} header={`Convert to question Paper?`} label1='Continue' label2='Cancel' onClose={()=>{setContinueEditingWorksheet(false)}} subHeader1={`You will loose all edits made to your worksheet.`} subHeader2="Are you sure you want to Continue?"/>}
      <GeneratePrintForPreview open={generateLoader} handleClose={()=>{setGenerateLoader(false)}} generateText={"Randomly Selecting Questions..."} />
      { openPrintModel && <PrintDateFieldModalPopup open={openPrintModel} onClose={() => setOpenPrintModel(false)}  questionPaperId={Number(questionPaperId)} previewData={intialLoadData} printedData={(e: any) => setPrintedData(e) } openPrintwindow={()=>{ setSpinnerStatus(true);getPreviewQuestions(location?.state?.templateId,true)}}
      errorMsg = {()=>{
        setSnackBar(true);
        setSnackBarSeverity('error');
        setSnackBarText(`Something went wrong!`)
        setSpinnerStatus(false)
      }
      } getVersions = {getVersions} />}

      <div className="preview-eval-hidden">
            <PrintQuestionPaperTemplate markerrorQnsIds={markerrorQnsIds} previewDate={printedData} ref={componentRef} printForPreviewEdit={printForPreviewEdit} templateFontDetails={templateFontDetails} ReqBody={reqBody} replace={replace} replaceQp={replaceQp} templatePrintEdit={printForPreviewEdit} previewMode={"templateMode"} setAnchorEl={setAnchorEl} templateJson={templateJson} changedPopoverValue={changedPopoverValue} setChangedPopoverValue={setChangedPopoverValue} triggerReqBody={triggerReqBody} dragPositionHeader={setDragPositionHeader} setStateFunction={setStateFunction}  versionHistoryData={versionHistoryData} printWithAnswer={printWithAnswer} printConfig={printConfig} workbookStyle={workbookStyle} />
      </div>
      {validatePopup &&
      <ChangeFieldModalPopup open={validatePopup} clickHandler={()=>{setValidatePopup(false)}}  header="Replace Empty Questions" label2='Close' onClose={()=>{setValidatePopup(false);}} subHeader1={`${invalidQpcount} Questions needs to be added manually.`} subHeader2="Please add missing Questions by click on Edit."/>
      }
        

      <QuestionPaperCustomizeFontPopup open={questionPaperCustomStatus} handleClose={() => {setQuestionPaperCustomStatus(false)}} questionPaperCustomData={questionPaperCustomData} fieldItemData={fieldItemData} applyClosePopup={(e:any) => {customFontApplyHandler(e)}}/>
      {studentListModal &&
        <AssignStudentListModal studentListModal={studentListModal} studentList={studentList} selectedQuestion={templateJson} handleClose={() => { }} handleStudentModalCLose={handleStudentModalCLose} questionPaperID={location?.state?.templateId} setShowAssignBtn={setShowAssignBtn} />
      }
      </MessageContext.Provider>
  )
}

export default QuestionPaperPreviewforPrint;
