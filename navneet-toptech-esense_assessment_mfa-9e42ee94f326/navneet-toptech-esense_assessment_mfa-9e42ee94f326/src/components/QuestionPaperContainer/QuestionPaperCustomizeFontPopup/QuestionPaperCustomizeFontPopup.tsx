import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import "../QuestionPaperOPTScreen/TemplatePreview/WarningModal.css"
import ClearIcon from '@mui/icons-material/Clear';
import "../QuestionPaperOPTScreen/TemplatePreview/PreviewTemplate.css"
import { useEffect, useState } from 'react';
import { QuestionPaperFontDetails } from '../QuestionPaperOPTScreen/QuestionPaperFontDetails';
import ButtonComponent from '../../SharedComponents/ButtonComponent/ButtonComponent';
import ChangeFieldModalPopup from '../../SharedComponents/ModalPopup/ChangeFieldModalPopup';
type props = {
    open: boolean,
    handleClose:  () => void,
    questionPaperCustomData?: any,
    fieldItemData?:any,
    applyClosePopup?:any
}

const QuestionPaperCustomizeFontPopup : React.FC<props> = ({open,handleClose,questionPaperCustomData,fieldItemData,applyClosePopup}) => {
    const [stepCPreviewBodyCopy, setStepCPreviewBodyCopy] = useState();
    const [applyBtnApprovedStatus, setApplyBtnApprovedStatus] = useState()
    const [stepCPreviewBody, setStepCPreviewBody] = useState<any>();
    const [resetHandleStatus, setResetHandleStatus] = useState(false)
    const [disableAction, setDisableAction] = useState({"reset": true,"apply":true})
    const [cancelHandlerStatus, setCancelHandlerStatus] = useState(false)
    useEffect(() =>{
        setResetHandleStatus(false)
        if(stepCPreviewBody != undefined && fieldItemData != undefined){
            if(JSON.stringify(stepCPreviewBody.bodyTemplate.templateBuilderInfo.questionPaperFontMetaData) !== JSON.stringify(fieldItemData)){
                setDisableAction({"reset": false,"apply":false})
            }else{
                setDisableAction({"reset": true,"apply":true})
            }
        }
    },[stepCPreviewBody])

    const resetFontQP = (() =>{
        setResetHandleStatus(true)
    })

    const applyFontQP = (() => {
            applyClosePopup(stepCPreviewBody)
        })

    const cancelHandler = (() => {
        if(stepCPreviewBody != undefined && fieldItemData != undefined){
            if(JSON.stringify(stepCPreviewBody.bodyTemplate.templateBuilderInfo.questionPaperFontMetaData) !== JSON.stringify(fieldItemData)){
                setCancelHandlerStatus(true)
            }else{
                handleClose()
            }
        }
        else{
            handleClose()
        }
    })
    const cancelConfirmationHandler = ((cancelStatus:boolean) => {
        if(cancelStatus){
            setCancelHandlerStatus(false)
        }else{
            setCancelHandlerStatus(false);handleClose() 
        }
    })
    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className="previewTemplateSect qpCustomFontPopup">
                    <div className='previewTemplateHeader'>
                        <p>Customise Font</p>
                        <p className='m-0 closePreviewTemp' onClick={()=>{cancelHandler()}}><ClearIcon /></p>
                    </div>
                    <div className='previewTemplateBody' style={{paddingLeft: "30px",paddingRight:"10px"}}>
                        <QuestionPaperFontDetails setStepCPreviewBodyCopy={setStepCPreviewBodyCopy} setBodyTemplate={setStepCPreviewBody} enableSubmitHandler={(e)=>{}} successJson={questionPaperCustomData} initialFormDefault={fieldItemData} previewMode={"customStyle"} resetHandleStatus={resetHandleStatus} applyBtnApprovedStatus={setApplyBtnApprovedStatus}/>
                    </div>                    
                    <div className='previewTemplateFooter d-flex gap-3 justify-content-end'>
                        <ButtonComponent icon={''} image={""} textColor ="#1B1C1E" backgroundColor="#01B58A" disabled={false} buttonSize="Medium" type="outlined" onClick={() => {cancelHandler()}} label="Cancel" minWidth="220" />
                        <ButtonComponent icon={''} image={""} textColor ="#1B1C1E" backgroundColor="#01B58A" disabled={disableAction.reset} buttonSize="Medium" type="outlined" onClick={() => {resetFontQP()}} label="Reset" minWidth="220" />
                        <ButtonComponent icon={''} image={""} textColor ="#fff" backgroundColor="#01B58A" disabled={disableAction.apply} buttonSize="Medium" type="contained" onClick={() => {applyFontQP()}} label="Apply" minWidth="220" />                        
                    </div>
                </Box>                
            </Modal>
            <ChangeFieldModalPopup open={cancelHandlerStatus} clickHandler={(e:boolean)=>{cancelConfirmationHandler(e)}}  header="Are you sure?" label1='Continue Editing' label2='Exit' onClose={()=>{}} subHeader1="You have unsaved changes that will be lost if you decide to exit" subHeader2="Are you sure you want to exit?"/>
    </>
    );
}

export default QuestionPaperCustomizeFontPopup;
