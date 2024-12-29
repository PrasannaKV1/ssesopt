import React, { FC, ReactEventHandler, useEffect, useState } from 'react'
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import ButtonComponent from '../../../SharedComponents/ButtonComponent/ButtonComponent';
import styles from './MIFquestionPaper.module.css';
import "../../../QuestionPaperContainer/QuestionPaperPreviewforPrint/QuestionPaperPreviewforPrint.css"
import InputFieldComponent from '../../../SharedComponents/InputFieldComponent/InputFieldComponent';
import { DonePutApi } from '../../../../Api/QuestionTypePaper';
import Toaster from '../../../SharedComponents/Toaster/Toaster';
import Spinner from '../../../SharedComponents/Spinner';
import { AlertColor } from "@mui/material";
import { istypeOflinesPresent, updateArrayObj } from '../../../../constants/helper';


type Props = {
  open: boolean,
  onClose: () => void,
  setSnackBar: (snackBar: boolean) => void,
  setSnackBarSeverity: (severity: AlertColor) => void,
  setSnackBarText: (text: string) => void,
  questionPaperId: number,
  previewData: any,
  reqbodys?: any,
  closePopup: any,
  initialBody?:any,
  dragPositionHeaderDetails?:any
  workbookStyle?:boolean
  doneworkbookCheck?:boolean
  setIsWorksheetEdit?:any
  isWorksheetEdit?:any
}
const PrintMarksFieldModalPopup: FC<Props> = ({ open, onClose, questionPaperId, previewData,reqbodys, closePopup,initialBody, setSnackBar, setSnackBarSeverity, setSnackBarText, dragPositionHeaderDetails, workbookStyle, doneworkbookCheck, isWorksheetEdit, setIsWorksheetEdit }) => {
  const [input, setInput] = useState(previewData.totalMarks)
  // const [snackBarText, setSnackBarText] = useState<string>("");
  // const [SnackBarSeverity, setSnackBarSeverity] = useState<AlertColor>("success");
  // const [snackBar, setSnackBar] = useState<boolean>(false);
  const [spinnerStatus, setSpinnerStatus] = useState(false);
  // const [errorState,setErrorState] =useState({
  //   error:false,
  //   errMessage:""
  // })
  const NameofExam = reqbodys.headerDetails.find((i:any) => i.sectionTypeKey === "examNameSection").sectionDetails.sectionFields.find((data:any) => data.fieldKey === "examName").fieldValue;

  // for removing html tag 
  const extractContent = (html: any) => {
    let span = document.createElement('span');
    span.innerHTML = html;
    const text = span.textContent || span.innerText
    span.remove()
    return text;
}
const doneAPIFn = async (id: number, body: any, isCancel: boolean) => {

  /* comparing instruction textfield as on changing it initial body is also getting changed */

  // const initialInstructionField = previewData.generatedQuestionPaper.headerDetails.find((i:any) => i.sectionTypeKey === "instructionsSection")?.sectionDetails.sectionFields[0].fieldValue;
  // const BodyInstructionField = body.generatedQuestionPaper.headerDetails.find((i:any) => i.sectionTypeKey === "instructionsSection")?.sectionDetails.sectionFields[0].fieldValue;
  body.generatedQuestionPaper.headerDetails = updateArrayObj(dragPositionHeaderDetails?.headerDetails, reqbodys?.headerDetails, "fieldValue");

    if((JSON.stringify(previewData.generatedQuestionPaper) === JSON.stringify(body.generatedQuestionPaper)) && (previewData.totalMarks == input) && (initialBody.name === body.name) && (doneworkbookCheck === workbookStyle) ){
      onClose()
      closePopup()
      return
    }
    
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
    setSpinnerStatus(true)
    body.isEdit = true
    // body.isWorkSheetStyle = istypeOflinesPresent(body.generatedQuestionPaper.bodyTemplate, 'Question');
    body.isWorkSheetStyle = workbookStyle
    body.isActualEdit = isWorksheetEdit

    const res = await DonePutApi(id, body);
    if (res?.result?.responseCode == 0 || res?.result?.responseDescription === "Success") {
      if (!isCancel) {
        setSnackBar(true);
        setSnackBarSeverity('success');
        setSnackBarText( workbookStyle ? 'Worksheet saved Successfully ' : `Question Paper updated Successfully`);
      }
      //   setPrintForPreviewEdit(false)
      onClose()
      closePopup()
      setSpinnerStatus(false)
      //   await getPreviewQuestions(location?.state?.templateId);
    } else {
      if(res?.response?.data?.responseCode === 100091 && res?.response?.data?.responseDescription === 
        "Please pass the unique name of examination") {
        setSnackBar(true);
        setSnackBarSeverity('error');
        setSnackBarText(res?.response?.data?.responseDescription)
        setSpinnerStatus(false)
        onClose()
        return
      }
      setSnackBar(true);
      setSnackBarSeverity('error');
      setSnackBarText(`something went wrong`)
      setSpinnerStatus(false)
    }
  }
  const handleSubmit = () => {
    doneAPIFn(Number(questionPaperId), { ...previewData, totalMarks: Number(input) || previewData.totalMarks, name: extractContent(NameofExam) || previewData.name, generatedQuestionPaper: reqbodys }, false)
  }

//   const handleChange = (e: any) => {
  
//   let MinimumValue:any;
//   let MaximumValue:any;
//   let valid = true
//   const value = e.target.value
//   if(reqbodys.bodyTemplate.templateBuilderInfo.rootType == "Main Question"){
//     const templateParts = reqbodys.bodyTemplate.templateBuilderInfo.templateParts
//     const MinimumValueArr= templateParts?.map((i:any)=>parseInt(i.marks));
//     MinimumValue = Math.min(...MinimumValueArr)          
//     MaximumValue = templateParts?.reduce((acc: any, cur: any) => Number(acc) + Number(cur.marks), 0)
//   }
//   if(reqbodys.bodyTemplate.templateBuilderInfo.rootType == "Question"){
//     const templateParts = reqbodys.bodyTemplate.templateBuilderInfo.templateParts
//     const MinimumValueArr= templateParts?.map((i:any)=>parseInt(i.marks));
//     MinimumValue = Math.min(...MinimumValueArr)          
//     MaximumValue = templateParts?.reduce((acc: any, cur: any) => Number(acc) + Number(cur.marks), 0)
//   }
//   if(value < MinimumValue || value > MaximumValue){
//     setErrorState({
//       error:true,
//     errMessage:`please entered valid number between ${MinimumValue} and ${MaximumValue}`
//     })
//     valid = false
//   }
//   else{
//     setErrorState({
//       error:false,
//       errMessage:``
//     })
//   }
//   if(valid){
//     setInput(e.target.value)
//   }
// }

  return (
    <div>
      <Modal open={open} onClose={onClose}>
        <div>

          <div className={`${styles.modalPopupContainer} ${styles.duplicateEntryBlk}`}>
            <div className={`${styles.modalPopupBgSect} printDateFieldPopupSect`}>
              <CloseIcon className={styles.modalPopupCloseIcon} onClick={onClose} />
              <div className={styles.modalPopupBgSectCont} style={{ width: "490px" }}>
                <h2>Enter Marks</h2>
                <h4>Enter the Marks that should appear on the question paper</h4>
                <div className='w-100'>
                  {/* <InputFieldComponent label={'Marks'} required={false} onChange={handleChange} inputSize={''} variant={''} inputType={'tel'} /> */}
                  {/* {errorState.error && <span style={{color:"red",marginLeft:'-25%'}}>{errorState.errMessage}</span>} */}
                  <InputFieldComponent label={'Marks'} required={false} onChange={(e: any) => setInput(e.target.value)} inputSize={''} variant={''} inputType={'tel'} defaultval={input} maxLength={3} />
                </div>
                <div className='d-flex mt-3' style={{ gap: "20px" }}>
                <ButtonComponent icon={''} image={""} textColor="#fff" backgroundColor="#01B58A" disabled={false} buttonSize="Large" type="contained" onClick={handleSubmit} label="Done" minWidth="208" />
                  <ButtonComponent icon={''} image={""} textColor="#1B1C1E" backgroundColor="#9A9A9A" disabled={false} buttonSize="Large" type="outlined" onClick={() => { onClose() }} label="Cancel" minWidth="208" />
                </div>
              </div>
            </div>
          </div>
          {spinnerStatus && <Spinner />}
          {/* <Toaster onClose={() => { setSnackBar(false) }} severity={SnackBarSeverity} text={snackBarText} snakeBar={snackBar} /> */}
        </div>
      </Modal>

    </div>
  )
}
export default PrintMarksFieldModalPopup;