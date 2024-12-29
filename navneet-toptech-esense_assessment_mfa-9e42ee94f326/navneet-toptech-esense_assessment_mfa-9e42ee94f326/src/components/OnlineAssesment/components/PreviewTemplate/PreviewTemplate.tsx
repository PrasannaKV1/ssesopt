import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import ClearIcon from '@mui/icons-material/Clear';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useEffect, useState } from 'react';
import { radioGetAPICall } from '../../../../Api/QuestionPaper';
import { QuestionPaperFontDetails } from '../../../QuestionPaperContainer/QuestionPaperOPTScreen/QuestionPaperFontDetails';
import { QuestionPaperViewApi } from '../../../../Api/QuestionTypePaper';
type props = {
    open: boolean,
    handleClose:  () => void,
    previewJson: any,
}

const PreviewTemplate : React.FC<props> = ({open,handleClose,previewJson}) => {
    const [stepCPreviewBody, setStepCPreviewBody] = useState();
    const [initialFormDefault,setInitialFormDefault] = useState();
    const [previewData,setPreviewData]= useState() as any;

    useEffect(() => {
        const fetchData = async () => {
          try {
            let dataModel:any= {}
              const response = await QuestionPaperViewApi(previewJson?.id, false);
              setPreviewData(response?.data?.generatedQuestionPaper);
              //const templateParts = response?.data?.bodyTemplate?.templateBuilderInfo?.questionPaperFontMetaData;
            // {templateParts && 
            //     Object.keys(templateParts).forEach(function (key, value) {
            //         dataModel[key] = "0"
            //     })
            // }
            setInitialFormDefault(dataModel)
          } catch (error) {
            console.error('Error fetching radioResponse: ', error);
          }
        };
      
        fetchData();
    }, [previewJson?.templateID]);
    
    return (
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className="previewTemplateSect">
                    <div className='previewTemplateHeader'>
                        <p>Total questions: {previewData?.bodyTemplate?.templateBuilderInfo?.paperLevelIndexSequence?.question}</p>
                        <p className='m-0 closePreviewTemp' onClick={handleClose}><ClearIcon /></p>
                    </div>
                    <div className='previewTemplateBody'>
                        {initialFormDefault && <QuestionPaperFontDetails setBodyTemplate={setStepCPreviewBody} initialFormDefault={initialFormDefault} successJson={previewData} previewMode={"templateMode"} onlineAssessmentData={previewJson} />}
                    </div>                    
                    <div className='previewTemplateFooter'>
                        <p onClick={handleClose}><KeyboardBackspaceIcon /> Go Back</p>
                    </div>
                </Box>
            </Modal>
    );
}

export default PreviewTemplate;
