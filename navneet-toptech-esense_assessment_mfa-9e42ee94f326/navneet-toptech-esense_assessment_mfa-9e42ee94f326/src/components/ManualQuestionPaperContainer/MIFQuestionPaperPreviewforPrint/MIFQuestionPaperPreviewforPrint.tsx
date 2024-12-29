import React, { createContext, useCallback, useContext, useMemo, useEffect, useRef, useState } from 'react';
import { useReactToPrint } from "react-to-print";
import "./MIFQuestionPaperPreviewforPrint.css";
import ButtonComponent from '../../SharedComponents/ButtonComponent/ButtonComponent';
import undo from "../../../assets/images/Undo.svg";
import Redo from "../../../assets/images/Redo.svg";
import QuestionPaperTemplate from '../MIFQuestionPaperOPTScreen/MIFTemplatePreview/MIFQuestionPaperTemplate';
//import { ReactComponent as Refresh } from "../../../../../assets/.svg";
import { QuestionPaperViewApi, QuestionPaperRandomize, DonePutApi, setsPostAPI, statusPostAPI } from '../../../Api/QuestionTypePaper';
import DropDownButtonComponent from '../../SharedComponents/DropDownButtonComponent/DropDownButtonComponent';
import QuillToolbarPopover from '../../SharedComponents/QuillToolbarPopover/QuillToolbarPopover';
import ChangeFieldModalPopup from '../../SharedComponents/ModalPopup/ChangeFieldModalPopup';
import { AlertColor } from "@mui/material";
import Toaster from '../../SharedComponents/Toaster/Toaster';
import Spinner from '../../SharedComponents/Spinner';
import { useLocation, useNavigate } from 'react-router';
import MIFReplaceQuestionModal from '../MIFReplaceQuestionModal/MIFReplaceQuestionModal';
import { approvalQpAPICall, fetchHodDetailsAPICall, fontDeatailsDropdown } from '../../../Api/QuestionPaper';
import PrintQuestionPaper from './printDoc/PrintQuestionPaper';
import GeneratePrintForPreview from '../MIFQuestionPaperOPTScreen/MIFGeneratePrintForPreview';
import { getVersionHistory } from '../../../Api/AssessmentTypes';
import MIFVersionHistory from '../MIFVersionHistory/MIFversionHistory';
import PrintDateFieldModalPopup from '../../SharedComponents/ModalPopup/PrintDateFieldModalPopup';
import PrintMarksFieldModalPopup from './marksModel/MIFquestionPaperMarks';
import { availableModules, findFirstQuestionBorderType, istypeOflinesPresent, MODULE_ID, updateArrayObj } from '../../../constants/helper';
import QuestionPaperCustomizeFontPopup from '../../QuestionPaperContainer/QuestionPaperCustomizeFontPopup/QuestionPaperCustomizeFontPopup';
import { getPreviewTemplate } from '../../../Api/templateManage';
import CloseWorkSheetModal from '../../SharedComponents/ModalPopup/CloseWorkSheetModal';

interface actionsContentType {
  undo: {},
  redo: {}
}
interface MessageContextType {
  actions: actionsContentType;
  reqBody: any;
  setStateFunction: (key: string, state: any, redo?: any, isDraggable?: boolean) => void;
  // questionPaperFieldOrder:
}

export const MIFMessageContext = createContext<MessageContextType | undefined>(undefined);
const QuestionPaperPreviewforPrint = () => {
  const _ = require("lodash");
  const { isEqual, uniq } = _;
  let history = useNavigate();
  let shouldLog = useRef(true);
  let location = useLocation();
  const [reqBody, setReqBody] = useState<any>();
  const [templateJson, setTemplateJson] = useState<any>();
  const [undoDisable, setUndoDisable] = useState<boolean>(true)
  const [redoDisable, setredoDisable] = useState<boolean>(true)
  const [histroy, setHistroy] = useState({})
  const [actions, setActions] = useState<any>({
    undo: {},
    redo: {}
  })
  const [printForPreviewEdit, setPrintForPreviewEdit] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<any>(null);
  const [changedPopoverValue, setChangedPopoverValue] = React.useState<any>({});
  const [quillPopupOpen, setQuillPopupOpen] = React.useState(false);
  const [replace, setReplace] = useState<any | null>(null)
  const [questionPaperId, setQuestionPaperId] = useState<string>('')
  const [intialLoadData, setIntialLoadData] = useState<any>({})
  const [snackBar, setSnackBar] = useState<boolean>(false);
  const [snackBarText, setSnackBarText] = useState<string>("");
  const [SnackBarSeverity, setSnackBarSeverity] = useState<AlertColor>("success");
  const [spinnerStatus, setSpinnerStatus] = useState(false);
  const [continueEditing, setcontinueEditing] = useState<boolean>(false)
  const [showAddQuestion, setShowAddQuestion] = useState<boolean>(false);
  const [previewTitle, setPreviewTitle] = useState("Preview Question Paper")
  const [dragPositionHeader, setDragPositionHeader] = useState({})
  const [templateFontDetails, setTemplateFontDetails] = useState()
  const [enableDone, setEnableDone] = useState<boolean>(false)
  const [generateLoader, setGenerateLoader] = useState(false);
  const [adminList, setAdminList] = useState<any[]>([]);
  const [versionHistoryData, setVersionHistoryData] = useState<any>([])
  const [openPrintModel, setOpenPrintModel] = useState<boolean>(false)
  const [printedData, setPrintedData] = useState<string>('')
  const [cancelStatus, setCancelStatus] = useState<boolean>(false)
  const [openMarkModel, setOpenMarksModel] = useState(false)
  const [initialBody, setInitialBody] = useState([])
  const [key, setKey] = useState<number>(0)
  const [printWithAnswer, setPrintWithAnswer] = useState<boolean>(false)
  const [dragPositionHeaderDetails, setDragPositionHeaderDetails] = useState<any>([])
  const clonedValue = intialLoadData?.generatedQuestionPaper?.headerDetails?.find((x: any) => x?.sectionTypeKey == "instructionsSection")?.sectionDetails?.sectionFields[0]?.fieldValue;
  const [isAnswerSheetView, setIsAnswerSheetView] = useState(location?.state?.isAnswerModel || false);
  const [hideSetButton, setHideSetButton] = useState<boolean>(true);
  const [typeOfLine, setTypeOfLine] = useState('')
  const [workbookStyle, setWorkbookStyle] = useState(false);
  const [doneworkbookCheck, setDoneworkbookCheck] = useState(false);
  const [isWorksheetEdit, setIsWorksheetEdit] = useState(false)
  const [continueEditingWorksheet,setContinueEditingWorksheet]= useState(false);
  const replaceQp = (newQp: any) => {
    setReqBody(newQp)
    setUndoDisable(false)
    setredoDisable(true);
    setActions({
      undo: histroy,
      redo: newQp
    });
    setHistroy(JSON.parse(JSON.stringify(newQp)))
  }


  const printQuesion = useReactToPrint({
    content: () => componentRef.current,
    onBeforePrint: () => { setSpinnerStatus(true) },
    onAfterPrint: () => { setSpinnerStatus(false) },
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

  const [printConfig, setPrintConfig] = useState()
  const [questionPaperCustomStatus, setQuestionPaperCustomStatus] = useState(false)
  const [questionPaperCustomData, setQuestionPaperCustomData] = useState()
  const [fieldItemData, setFieldItemData] = useState()
  const [customFontStyle, setCustomFontStyle] = useState()
  const questionPaperCustomFontHandler = (async (questionId: number) => {
    // const previewTemplateData = await getPreviewTemplate(questionId);
    setFieldItemData(customFontStyle ? customFontStyle : intialLoadData?.generatedQuestionPaper?.bodyTemplate?.templateBuilderInfo?.questionPaperFontMetaData)
    setQuestionPaperCustomData(templateJson?.generatedQuestionPaper)
    setQuestionPaperCustomStatus(true)
  })

  const getPreviewQuestions = useCallback(async (id: string, print?: boolean) => {
    const res: any = await QuestionPaperViewApi(id, (location?.state?.print || print) ?? false);
    if (res?.data) {
      setIntialLoadData(JSON.parse(JSON.stringify(res?.data)))
      setReqBody(res?.data?.generatedQuestionPaper);
      if ("printConfig" in res?.data) setPrintConfig(res?.data?.printConfig)
      setInitialBody(res?.data)
      setTemplateJson(res?.data)
      setWorkbookStyle(res?.data?.isWorkSheetStyle);
      setDoneworkbookCheck(res?.data?.isWorkSheetStyle);
      setActions({
        undo: {},
        redo: res?.data?.generatedQuestionPaper
      })
      setHistroy(JSON.parse(JSON.stringify(res?.data?.generatedQuestionPaper)))
      const replaceQns = {
        gradeID: res?.data?.gradeID,
        courses: res?.data?.courses,
        themes: res?.data?.themes,
        chapters: res?.data?.chapters,
        topics: res?.data?.topics,
        questionPaperTypeID: res?.data?.questionPaperTypeID,
        paperId: id
      }
      setReplace(replaceQns)
      print && setTimeout(() => { printQuesion(); setSpinnerStatus(false) }, 1000)
    }

    const getHeaderDetails = res?.data?.generatedQuestionPaper.headerDetails?.map((header: any) => ({
      sectionSequence: header?.sectionSequence,
      sectionTypeKey: header?.sectionTypeKey,
    }));

  }, [location?.state?.print, printQuesion]);

  const getRandomizePreviewQuestions = async () => {
    if (questionPaperId != '') {
      setGenerateLoader(true)
      const res = await QuestionPaperRandomize({ "questionPaperID": Number(questionPaperId) });
      if (res?.data) {
        setTimeout(() => {
          setGenerateLoader(false)
        }, 1000)
        setReqBody({
          bodyTemplate: res.data?.templateMetaInfo?.bodyTemplate,
          headerDetails: reqBody?.headerDetails
        })
        setTemplateJson(res?.data)
        setUndoDisable(false)
        setredoDisable(true);
        setActions({
          undo: histroy,
          redo: res.data?.templateMetaInfo
        });
        setHistroy(JSON.parse(JSON.stringify(res.data?.templateMetaInfo)))
      } else {
        setGenerateLoader(false)
        setSnackBar(true);
        setSnackBarSeverity('error');
        setSnackBarText(`something went wrong`)
        setSpinnerStatus(false)
      }
    }
  };

  useEffect(() => {
    if (shouldLog.current) {
      shouldLog.current = false
      if (location?.state?.templateId) {
        getPreviewQuestions(location?.state?.templateId);
        setQuestionPaperId(location?.state?.templateId);
      }
    }
    setOpenPrintModel(location?.state?.print);
  }, [location])

  useEffect(() => {
    setTimeout(() => {
      if (anchorEl == null || anchorEl == "") {
        setQuillPopupOpen(false)
      } else {
        setQuillPopupOpen(true)
      }
    }, 200)
  }, [anchorEl])

  useEffect(() => {
    if (!quillPopupOpen) {
      setAnchorEl("")
    }
  }, [quillPopupOpen])

  const undoRedoFn = (action: string) => {
    switch (action) {
      case 'undo':
        setSpinnerStatus(true)
        setTimeout(() => {
          setReqBody({ ...actions?.undo });
          setTypeOfLine(findFirstQuestionBorderType(actions?.undo.bodyTemplate.templateBuilderInfo.templateParts));
          setredoDisable(false);
          setUndoDisable(true)
          setSpinnerStatus(false)
          setKey(Math.random())
        }, 200)
        break;
      case 'redo':
        setSpinnerStatus(true)
        setTimeout(() => {
          setReqBody({ ...actions?.redo });
          setTypeOfLine(findFirstQuestionBorderType(actions?.undo.bodyTemplate.templateBuilderInfo.templateParts));
          setredoDisable(true)
          setUndoDisable(false)
          setSpinnerStatus(false)
          setKey(Math.random())
        }, 200)
        break;
    }
  }
  const marksHandlefn = () => {
    const body = { ...intialLoadData, generatedQuestionPaper: reqBody }
    if (body.generatedQuestionPaper.bodyTemplate.templateBuilderInfo.templateParts.length === 0) {
      setSnackBar(true);
      setSnackBarSeverity('error');
      setSnackBarText(`atleast one question should be here`);
      return
    }
    if (body.generatedQuestionPaper.bodyTemplate.templateBuilderInfo.rootType === "Main Question") {
      let isInvalid = false
      body.generatedQuestionPaper.bodyTemplate.templateBuilderInfo.templateParts
        .forEach((el: any) => {
          if (!el.elementTitle?.trim()) {
            isInvalid = true
          }
        })
      if (isInvalid) {
        setSnackBar(true);
        setSnackBarSeverity('error');
        setSnackBarText(`Please add main question title`);
        return
      }
    }
    setOpenMarksModel(true)
  }
  const editFn = () => {
    setPrintForPreviewEdit(true);
    setredoDisable(true);
    setUndoDisable(true)
  }

  const doneAPIFn = async (id: number, body: any, isCancel: boolean) => {
    body.generatedQuestionPaper.headerDetails = updateArrayObj(dragPositionHeaderDetails?.headerDetails, reqBody?.headerDetails, "fieldValue");
    if (body.generatedQuestionPaper.bodyTemplate.templateBuilderInfo.templateParts.length === 0) {
      setSnackBar(true);
      setSnackBarSeverity('error');
      setSnackBarText(`atleast one question should be here`);
      return
    }
    if (body.generatedQuestionPaper.bodyTemplate.templateBuilderInfo.rootType === "Main Question") {
      let isInvalid = false
      body.generatedQuestionPaper.bodyTemplate.templateBuilderInfo.templateParts
        .forEach((el: any) => {
          if (!el.elementTitle?.trim()) {
            isInvalid = true
          }
        })
      if (isInvalid) {
        setSnackBar(true);
        setSnackBarSeverity('error');
        setSnackBarText(`Please enter text/title in the Main Question`);
        return
      }
    }
    setSpinnerStatus(true)
    body.isEdit = true
    console.log('istypeOflinesPresent ', istypeOflinesPresent(body.generatedQuestionPaper.bodyTemplate, 'Question'));
    const res = await DonePutApi(id, body);
    if (res?.result?.responseCode == 0 || res?.result?.responseDescription === "Success") {
      if (!isCancel) {
        setSnackBar(true);
        setSnackBarSeverity('success');
        setSnackBarText(`Question Paper updated Successfully`);
      }
      setPrintForPreviewEdit(false)
      setSpinnerStatus(false)
      await getPreviewQuestions(location?.state?.templateId);
    } else {
      setSnackBar(true);
      setSnackBarSeverity('error');
      setSnackBarText(`something went wrong`)
      setSpinnerStatus(false)
    }
  }

  const cancelFn = async (e: boolean) => {
    if (e) {
      setcontinueEditing(false)
    } else {
      if (cancelStatus) {
        await doneAPIFn(Number(questionPaperId), intialLoadData, true)
        setcontinueEditing(false);
        setChangedPopoverValue(false)
      } else {
        setReqBody(intialLoadData?.generatedQuestionPaper)
        if (location.state.state || !printForPreviewEdit) {
          history("/assess/questionpaper")
        }
        else {
          setPrintForPreviewEdit(false)
          setcontinueEditing(false)
        }
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

  const setsApi = async (e: any) => {
    setSpinnerStatus(true);
    if (templateJson?.questionPaperTypeID !== 1 && !approved) {
      const approver = adminList.find(
        ({ firstName, lastName, userCustomRole }: any) =>
          `${firstName} ${lastName || ''} (${userCustomRole})` === e
      );
      if (approver?.userId) {
        const response = await approvalQpAPICall({ approverId: Number(approver.userId), questionPaperId: Number(questionPaperId) });
        if (response?.result?.responseDescription == "Success") {
          history('/assess/questionpaper?saved=true',
            {
              state: {
                severity: true,
                text: `${templateJson.name} sent for Review Successfully`,
              },
            }
          );
        } else {
          history(
            { pathname: "/assess", search: "?tab=questionPapers" },
            {
              state: {
                severity: "error",
                text: "Question Paper send For Approval Failed",
              },
            }
          );
        }
        setSpinnerStatus(false);

      }
      return;
    }
    const response = await setsPostAPI({
      questionPaperId: Number(questionPaperId),
      numberOfSets: e,
    });
    if (
      response?.result?.responseCode == 0 ||
      response?.result?.responseDescription === "Success"
    ) {
      setSnackBar(true);
      setSnackBarSeverity("success");
      setSnackBarText(`Question Paper Saved Successfully with ${e} sets`);
      setSpinnerStatus(false);
      setTimeout(() => {
        history({ pathname: "/assess", search: "?tab=questionPapers" });
      }, 500);
    } else {
      setSnackBar(true);
      setSnackBarSeverity("error");
      setSnackBarText(`something went wrong`);
      setSpinnerStatus(false);
    }
  };

  const [triggerReqBody, setTriggerReqBody] = useState(false)
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
  const statusApi = async () => {
    setSpinnerStatus(true)
    const response = await statusPostAPI({ "statusId": templateJson?.questionPaperTypeID === 2 ? 3 : 2, "questionPaperInfo": [{ "questionPaperId": questionPaperId, "feedback": '' }] });
    if (response?.result?.responseCode == 0 || response?.result?.responseDescription === "Success") {
      setSnackBar(true);
      setSnackBarSeverity('success');
      setSnackBarText(workbookStyle ? 'Worksheet saved Successfully' : `Question Paper Saved Successfully`)
      setSpinnerStatus(false)
      setTimeout(() => {
        history({ pathname: '/assess', search: "?tab=questionPapers" })
      }, 2500)
    } else {
      setSnackBar(true);
      setSnackBarSeverity('error');
      setSnackBarText(`something went wrong`)
      setSpinnerStatus(false)
    }
  }
  const addQuestions = () => {
    setShowAddQuestion(true);
  }

  useEffect(() => {
    setPrintForPreviewEdit(location?.state?.state)
    setHideSetButton(location?.state?.markStatus);
  }, [location.state])

  useEffect(() => {
    if (Object?.keys(dragPositionHeaderDetails)?.length > 0) {
      setReqBody({ ...dragPositionHeaderDetails })
    }
  }, [dragPositionHeaderDetails])

  const fontDetailsSelectValue = async () => {
    const response = await fontDeatailsDropdown()
    if (response?.result?.responseCode == 0) {
      setTemplateFontDetails(response?.data)
    }
  }

  const fetchHodDetails = async () => {
    const response = await fetchHodDetailsAPICall(MODULE_ID);
    if (response.status == "200") {
      setAdminList(response?.data)
    }
  }

  const componentRef: any = useRef();


  const handlePopUp = (count: number) => {
    setSnackBar(true)
    setSnackBarSeverity('success')
    setSnackBarText(`${count} questions added successfully`)
  }
  useEffect(() => {
    fontDetailsSelectValue();
    fetchHodDetails();
  }, [])
  useEffect(() => {
    if (!localStorage.hasOwnProperty('show_version_history')) localStorage.setItem('show_version_history', 'false')
  }, [])

  useEffect(() => {
    setPreviewTitle(printForPreviewEdit ? 'Edit Question Paper' : 'Preview Question Paper')
  }, [printForPreviewEdit])

  const approvalPending = templateJson?.questionPaperTypeID == 2 && templateJson?.statusID == 5;
  const approved = templateJson?.questionPaperTypeID == 2 && (templateJson?.statusID == 6 || templateJson?.statusID == 2);
  const getVersions = async () => {
    let res = await getVersionHistory(Number(questionPaperId))
    setVersionHistoryData(res?.data);
  }

  useEffect(() => {
    if (Number(questionPaperId) > 0) getVersions()
  }, [questionPaperId])

  const renderApprovalButton = () => {
    const data = templateJson?.questionPaperTypeID === 1 || approved ? [1, 2, 3, 4] : adminList.map(({ firstName, lastName, userCustomRole }) => `${firstName} ${lastName || ""} (${userCustomRole})`);
    return !approvalPending || approved ? <DropDownButtonComponent buttonName={templateJson?.questionPaperTypeID === 1 || approved ? 'Save with Sets' : 'Send For Approval'} minWidth="226" buttonOptions={data} onChangeHandler={(e: number) => { setsApi(e) }} /> : null
  }


  const isDisable = useMemo(() => {
    let isDisableDone = false;
    if (reqBody?.bodyTemplate?.templateBuilderInfo?.templateParts?.length > 0) {
      const data = { ...reqBody }
      data.bodyTemplate.templateBuilderInfo.templateParts.forEach((i: any) => {
        if (!i.marks || i.marks == 0) isDisableDone = true;
        if (i?.children.some((elem: any) => !elem.marks || elem.marks == 0)) isDisableDone = true;
        if (i.error == true) isDisableDone = true;
      });
    }
    return isDisableDone;
  }, [reqBody?.bodyTemplate?.templateBuilderInfo?.templateParts]);

  const handleCloseMainPopup = async () => {
    await getVersions()
    await getPreviewQuestions(location?.state?.templateId);
    setPrintForPreviewEdit(false)
  }

  const instructionUndoRedo = useCallback((arg: string) => {
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
    return { bodyTemplate: reqBody?.bodyTemplate, headerDetails: reformedState }
  }, [reqBody?.bodyTemplate, reqBody?.headerDetails])

  const setStateFunction = useCallback((key: string, state: any, redo?: any, isDraggable?: boolean) => {
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
          if (isDraggable) setDragPositionHeaderDetails(JSON.parse(JSON.stringify(redo)))
          setActions({ undo: state, redo: redo ?? reqBody })
        }
        break;
    }
  }, [clonedValue, instructionUndoRedo, reqBody])

  const customFontApplyHandler = ((customFontStyleData: any) => {
    setCustomFontStyle(customFontStyleData.bodyTemplate.templateBuilderInfo.questionPaperFontMetaData)
    let initialReqBodyObj = JSON.parse(JSON.stringify(reqBody));
    initialReqBodyObj.bodyTemplate.templateBuilderInfo.questionPaperFontMetaData = customFontStyleData.bodyTemplate.templateBuilderInfo.questionPaperFontMetaData;
    setReqBody(initialReqBodyObj);
    setQuestionPaperCustomStatus(false)
    //setPrintForPreviewEdit(false)
  })

  const handlePrintWithAnswer = () => {
    setPrintWithAnswer(true);
    setSpinnerStatus(true);
    setTimeout(() => {
      printQuesion();
      setSpinnerStatus(false);
      setIsAnswerSheetView(false);
    }); // Example setTimeout for simulating a printing process
  };

  useEffect(() => {
    let timer: string | number | NodeJS.Timeout | undefined;
    if (isAnswerSheetView) {
      timer = setTimeout(() => {
        handlePrintWithAnswer();
      }, 1000);
    }

    return () => clearTimeout(timer)
  }, [isAnswerSheetView])

  const handleWorkbook = () => {
    if (workbookStyle == false) {
        setWorkbookStyle(!workbookStyle)
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

  return (
    <MIFMessageContext.Provider value={{ actions, reqBody, setStateFunction }}>
      <div className='quePapPreviewforPrint'>
        {quillPopupOpen && <QuillToolbarPopover anchorTag={anchorEl} quillPopupOpen={quillPopupOpen} setQuillPopupOpen={setQuillPopupOpen} changedPopoverValue={changedPopoverValue} reqBody={reqBody} setTriggerReqBody={setTriggerReqBody} isManualFlow={true} />}
        {showAddQuestion && <MIFReplaceQuestionModal ReqBody={reqBody} open={showAddQuestion} handleClose={() => { setShowAddQuestion(false) }} replaceFilterObj={{ courses: templateJson?.courses, themes: templateJson?.themes, chapters: templateJson?.chapters }} replace={replace} replaceQp={replaceQp} modalType='ADD_QUESTION' PopUpModal={(count) => { handlePopUp(count) }} />}
        <div className='questionPaperPreviewSect MIFQuestionPaperPreviewSect'>
          <div className='questionPaperPreviewSectLeft'>
            <h2 className='questionPaperPreviewTitle'>{previewTitle}</h2>
            <p> {location?.state?.isAssesment ? "You can view the question paper here" : "You can make edits to the generated question paper here"}</p>
          </div>
          <div className='questionPaperPreviewSectRight'>
            {printForPreviewEdit ?
              <>
                <div className="d-flex gap-8">
                  <ButtonComponent type={"outlined"} label={'Customise Fonts'} backgroundColor={"#01B58A"} textColor={'#1B1C1E'} buttonSize={"Medium"} minWidth={'140'} image={""} onClick={() => questionPaperCustomFontHandler(intialLoadData?.templateID)} btnToolTipText={"Customise Question Paper Fonts"} />
                  <ButtonComponent type={"outlined"} label={'Add Questions'} backgroundColor={"#01B58A"} textColor={'#1B1C1E'} buttonSize={"Medium"} minWidth={'140'} image={""} onClick={() => addQuestions()} />
                  <ButtonComponent type={"outlined"} label={'Randomize'} backgroundColor={"#01B58A"} textColor={'#1B1C1E'} buttonSize={"Medium"} minWidth={'140'} image={""} onClick={() => getRandomizePreviewQuestions()} btnToolTipText={"Randomly select new Questions"} />
                  <ButtonComponent type={"outlined"} label={workbookStyle ? 'Make Question Paper Style' : 'Convert to  Worksheet Style'}backgroundColor={"#01B58A"} textColor={'#1B1C1E'} buttonSize={"Medium"} minWidth={'140'} image={""} onClick={()=>handleWorkbook()} />
                </div>
                <div className='questionPaperPreviewSectRightAction'>
                  <ButtonComponent type={'button'} label={'Undo'} textColor={''} buttonSize={undefined} minWidth={''} image={undo} disabled={undoDisable} onClick={() => { undoRedoFn('undo') }} hideBorder={true} />
                  <ButtonComponent type={'button'} label={'Redo'} textColor={''} buttonSize={undefined} minWidth={''} image={Redo} disabled={redoDisable} onClick={() => { undoRedoFn('redo') }} hideBorder={true} />
                </div>
              </>
              :
              <div className='questionPaperPreviewSectPrintSolution'>
                {(!(approvalPending || approved) || approved) &&
                  <ButtonComponent type={"outlined"} label={'Print Model Answer Paper'} backgroundColor={"#385DDF"} textColor={'#1B1C1E'} buttonSize={"Medium"} minWidth={'140'} image={""} onClick={() => { handlePrintWithAnswer() }} btnToolTipText={"Print Model Answer Paper"} />}
                {!(approvalPending || approved) && !location?.state?.isAssesment &&
                  <ButtonComponent type={"outlined"} label={'Edit'} backgroundColor={"#01B58A"} textColor={'#1B1C1E'} buttonSize={"Medium"} disabled={location?.state?.markStatus} minWidth={'140'} image={""} onClick={() => { editFn() }} />}
              </div>
            }
          </div>
        </div>

        {/* <ButtonComponent backgroundColor="#01B58A" type="outlined" label={'Randomize'} textColor={''} buttonSize="Large" minWidth="226"/> */}
        <div style={{ display: "flex", gap: "32%" }}>


        </div>
        <div className='quePapPreviewforPrintContent'>
          {versionHistoryData && versionHistoryData.length > 0 && !location?.state?.isAssesment &&
            <MIFVersionHistory questionPaperId={questionPaperId} versionHistoryData={versionHistoryData} />
          }

          <div style={versionHistoryData && versionHistoryData.length > 0 ? {} : { width: '100%' }} className='quePapPreviewforPrintPreview'>

            {/* <QuestionPaperTemplate templateFontDetails={templateFontDetails} ReqBody={reqBody} replace={replace} replaceQp={replaceQp} templatePrintEdit={printForPreviewEdit} previewMode={"templateMode"} setAnchorEl={setAnchorEl} templateJson={templateJson} changedPopoverValue={changedPopoverValue} setChangedPopoverValue={setChangedPopoverValue} triggerReqBody={triggerReqBody} dragPositionHeader={setDragPositionHeader} Handlers={{setUndoDisable:setUndoDisable,setredoDisable:setredoDisable,setActions:setActions}}/> */}
            <QuestionPaperTemplate templateFontDetails={templateFontDetails} ReqBody={reqBody} replace={replace} replaceQp={replaceQp} templatePrintEdit={printForPreviewEdit} previewMode={"templateMode"} setAnchorEl={setAnchorEl} templateJson={templateJson} changedPopoverValue={changedPopoverValue} setChangedPopoverValue={setChangedPopoverValue} triggerReqBody={triggerReqBody} dragPositionHeader={setDragPositionHeader} setStateFunction={setStateFunction} previewDate={printedData} key={key} printConfig={printConfig} viewAnswer={location?.state?.viewAnswer} typeOfLine={typeOfLine} workbookStyle={workbookStyle} setIsWorksheetEdit={setIsWorksheetEdit} />
          </div>
        </div>
      </div>

      <div className='quesPaperPreviewPrintFooter'>
        <div className='quesPaperPreviewPrintFooterSect'>
          <h5 className='m-0'>Total questions: {reqBody?.bodyTemplate?.templateBuilderInfo?.paperLevelIndexSequence?.question}</h5>
          <div className='d-flex gap-4'>
            {!printForPreviewEdit && Object.keys(intialLoadData).length ?
              <>
                {!(approvalPending || approved) && !location?.state?.isAssesment && !hideSetButton && <ButtonComponent backgroundColor="#01B58A" type="contained" label={templateJson?.questionPaperTypeID == 1 || approved ? 'Save' : 'Save As Draft'} textColor={''} buttonSize="Large" minWidth="226" onClick={() => { templateJson?.questionPaperTypeID == 2 ? history('/assess/questionpaper?saved=true', { state: { formalState: true, message: templateJson.name } }) : statusApi() }} />}
                {!location?.state?.isAssesment && !hideSetButton && renderApprovalButton()}
                {(templateJson?.questionPaperTypeID == 1 || approved) && !location?.state?.isAssesment && <ButtonComponent backgroundColor="#01B58A" type="contained" label={'Print'} textColor={''} buttonSize="Large" minWidth="226" onClick={() => { setPrintWithAnswer(false); setOpenPrintModel(true); }} />}
                <ButtonComponent backgroundColor="#01B58A" type="outlined" label={'Cancel'} textColor={'#000'} buttonSize="Large" minWidth="226" onClick={() => { !location?.state?.isAssesment ? history("/assess/questionpaper") : history(-1); setIsAnswerSheetView(false); }} />
              </>
              : Object.keys(intialLoadData).length &&
              <>
                {/* {availableModules.includes(20) && <DropDownButtonComponent buttonName={'Add WorkBook'} minWidth="226" buttonOptions={[0,1,2,3,4,5,6,7,8,9,10]}  onChangeHandler={(e:any)=>{handleWorkbook(e)}} />} */}
                <ButtonComponent backgroundColor="#01B58A" type="contained" label={'Done'} disabled={enableDone || isDisable} textColor={''} buttonSize="Large" minWidth="150" onClick={marksHandlefn} />
                <ButtonComponent backgroundColor="#01B58A" type="outlined" label={'Cancel'} textColor={'#000'} buttonSize="Large" minWidth="150" onClick={() => { setcontinueEditing(true) }} />
                {availableModules.includes(20) && workbookStyle && <span className="workBook-btn-auto"> <DropDownButtonComponent buttonName={'Type Of Lines'} minWidth="226" buttonOptions={['SOLID UPPER LINE', 'SOLID LOWER LINE', 'DOTTED UPPER LINE', 'DOTTED LOWER LINE']}  onChangeHandler={(e:any)=> handleWorksheetGlobal(e)} /> </span>}
              </>}
          </div>
        </div>
      </div>
      {spinnerStatus && <Spinner />}
      <Toaster onClose={() => { setSnackBar(false) }} severity={SnackBarSeverity} text={snackBarText} snakeBar={snackBar} />
      {/* {changePopup && <ChangeFieldModalPopup open={changePopup} clickHandler={(e:boolean)=>{popupHandler(e,popupTitle)}} header={`Reset ${popupTitle}`} label1='Continue' label2='Cancel' onClose={()=>{setChangePopup(false)}} subHeader1={`You are about to reset your ${popupTitle} to default`} subHeader2="Are you sure you want to continue?"/>} */}
      {continueEditing && <ChangeFieldModalPopup open={continueEditing} clickHandler={(e: boolean) => { cancelFn(e) }} header={`Unsaved Changes`} label1='Continue Editing' label2='Exit' onClose={() => { setcontinueEditing(false) }} subHeader1={`You have unsaved changes that will be lost if you decide to exit.`} subHeader2="Are you sure you want to exit?" />}
      {continueEditingWorksheet && <CloseWorkSheetModal open={continueEditingWorksheet} clickHandler={(e:boolean)=>{cancelFnWorksheet(e)}} header={`Convert to question Paper?`} label1='Continue' label2='Cancel' onClose={()=>{setContinueEditingWorksheet(false)}} subHeader1={`You will loose all edits made to your worksheet.`} subHeader2="Are you sure you want to Continue?"/>}
      <GeneratePrintForPreview open={generateLoader} handleClose={() => { setGenerateLoader(false) }} generateText={"Randomly Selecting Questions..."} />
      {openPrintModel && Object.keys(intialLoadData).length > 0 && <PrintDateFieldModalPopup open={openPrintModel} onClose={() => setOpenPrintModel(false)} questionPaperId={Number(questionPaperId)} previewData={intialLoadData} printedData={(e: any) => setPrintedData(e)} openPrintwindow={() => { setSpinnerStatus(true); getPreviewQuestions(location?.state?.templateId, true) }}
        errorMsg={() => {
          setSnackBar(true);
          setSnackBarSeverity('error');
          setSnackBarText(`Something went wrong!`)
          setSpinnerStatus(false)
        }} getVersions={getVersions}
      />}

      {openMarkModel && <PrintMarksFieldModalPopup open={openMarkModel} onClose={() => setOpenMarksModel(false)} questionPaperId={Number(questionPaperId)} previewData={intialLoadData} reqbodys={reqBody} initialBody={initialBody} closePopup={handleCloseMainPopup} setSnackBar={setSnackBar} setSnackBarSeverity={setSnackBarSeverity} setSnackBarText={setSnackBarText} dragPositionHeaderDetails={dragPositionHeaderDetails} workbookStyle={workbookStyle} doneworkbookCheck={doneworkbookCheck} isWorksheetEdit={isWorksheetEdit} setIsWorksheetEdit={setIsWorksheetEdit} />}
      <div className="preview-eval-hidden">
        <PrintQuestionPaper ref={componentRef} previewDate={printedData} templateFontDetails={templateFontDetails} ReqBody={reqBody} replace={replace} replaceQp={replaceQp} templatePrintEdit={printForPreviewEdit} previewMode={"templateMode"} setAnchorEl={setAnchorEl} templateJson={templateJson} changedPopoverValue={changedPopoverValue} setChangedPopoverValue={setChangedPopoverValue} triggerReqBody={triggerReqBody} dragPositionHeader={setDragPositionHeader} Handlers={{ setUndoDisable: setUndoDisable, setredoDisable: setredoDisable, setActions: setActions }} printForPreviewEdit={printForPreviewEdit} versionHistoryData={versionHistoryData} printWithAnswer={printWithAnswer} printConfig={printConfig} workbookStyle={workbookStyle} />
      </div>


      <QuestionPaperCustomizeFontPopup open={questionPaperCustomStatus} handleClose={() => { setQuestionPaperCustomStatus(false) }} questionPaperCustomData={questionPaperCustomData} fieldItemData={fieldItemData} applyClosePopup={(e: any) => { customFontApplyHandler(e) }} />
    </MIFMessageContext.Provider>
  )
}

export default QuestionPaperPreviewforPrint;

