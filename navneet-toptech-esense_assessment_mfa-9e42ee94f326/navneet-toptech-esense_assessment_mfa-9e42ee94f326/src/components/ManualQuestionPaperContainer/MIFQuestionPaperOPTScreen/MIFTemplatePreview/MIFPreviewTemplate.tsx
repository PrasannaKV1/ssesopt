import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import "./MIFWarningModal.css"
import ClearIcon from '@mui/icons-material/Clear';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import "./MIFPreviewTemplate.css"
import { QuestionPaperFontDetails } from '../MIFQuestionPaperFontDetails';
import { useEffect, useState } from 'react';
type props = {
    open: boolean,
    handleClose:  () => void,
    previewJson: any,
}

const PreviewTemplate : React.FC<props> = ({open,handleClose,previewJson}) => {
    const [stepCPreviewBody, setStepCPreviewBody] = useState();
    const [initialFormDefault,setInitialFormDefault] = useState()
    useEffect(() => {
        let dataModel:any= {}
        const templateParts = previewJson?.bodyTemplate?.templateBuilderInfo?.questionPaperFontMetaData;
        {templateParts && 
        Object.keys(templateParts).forEach(function (key, value) {
            dataModel[key] = "0"
        })
        }
        setInitialFormDefault(dataModel)
    },[])
    
    return (
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className="previewTemplateSect">
                    <div className='previewTemplateHeader'>
                        <p>Total questions: {previewJson?.bodyTemplate?.templateBuilderInfo?.paperLevelIndexSequence?.question}</p>
                        <p className='m-0 closePreviewTemp' onClick={handleClose}><ClearIcon /></p>
                    </div>
                    <div className='previewTemplateBody'>
                        {initialFormDefault && <QuestionPaperFontDetails setBodyTemplate={setStepCPreviewBody} initialFormDefault={initialFormDefault} successJson={previewJson} previewMode={"templateMode"}/>}
                    </div>                    
                    <div className='previewTemplateFooter'>
                        <p onClick={handleClose}><KeyboardBackspaceIcon /> Go Back</p>
                    </div>
                </Box>
            </Modal>
    );
}

export default PreviewTemplate;
