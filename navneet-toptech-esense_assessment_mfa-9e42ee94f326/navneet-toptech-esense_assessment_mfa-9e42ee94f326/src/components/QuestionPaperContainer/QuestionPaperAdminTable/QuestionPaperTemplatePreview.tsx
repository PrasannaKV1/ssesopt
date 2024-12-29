import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import "../QuestionPaperOPTScreen/TemplatePreview/WarningModal.css"
import ClearIcon from '@mui/icons-material/Clear';
import "../QuestionPaperOPTScreen/TemplatePreview/PreviewTemplate.css"
import ButtonComponent from '../../SharedComponents/ButtonComponent/ButtonComponent';
import QuestionPaperTemplate from '../QuestionPaperOPTScreen/TemplatePreview/QuestionPaperTemplate';
import { fontDeatailsDropdown } from '../../../Api/QuestionPaper';
import VersionHistory from '../../SharedComponents/VersionHistory/VersionHistory';
import Spinner from '../../SharedComponents/Spinner';
type props = {
    open: boolean,
    handleClose:  () => void,
    previewJson: any,
    print?:()=>void,
    type?:string,
    qpId?:any;
    setPrintWithAnswer?:any;
    directPrint?:any;
    printConfig?:any
    isWorksheetSet?:boolean
}

const QuestionPaperTemplatePreview : React.FC<props> = ({directPrint,open,handleClose,previewJson,print,type , qpId, setPrintWithAnswer,printConfig, isWorksheetSet}) => {
    const [templateFontDetails, setTemplateFontDetails] = React.useState()
    const [printConfigData,setPrintConfigData] = React.useState(printConfig)
    const [spinnerStatus, setSpinnerStatus] = React.useState(false);
    const fontDetailsSelectValue = async () => {
        if("printConfig" in printConfig) setPrintConfigData(printConfig?.printConfig)      
        const response = await fontDeatailsDropdown()
        if (response?.result?.responseCode == 0) {
          setTemplateFontDetails(response?.data)
        }
      }

      React.useEffect(() => {
        fontDetailsSelectValue()
      },[])
      React.useEffect(()=>{
      if(type == "print"){
        print && print()
      }
      },[type && type])
    return (
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className="previewTemplateSect">
                    <div className='previewTemplateHeader d-flex pe-5' style={{justifyContent: "space-between", alignItems:"center"}}>
                        <p>Total questions: {previewJson?.bodyTemplate?.templateBuilderInfo?.paperLevelIndexSequence?.question}</p>
                        <ButtonComponent type={"outlined"} label={'Print Model Answer Paper'} backgroundColor={"#385DDF"} textColor={'#1B1C1E'} buttonSize={"Medium"} minWidth={'140'} image={""} onClick={() => { setPrintWithAnswer(true);setSpinnerStatus(true); setTimeout(()=>{directPrint && directPrint();setSpinnerStatus(false)},1000);console.log('Print Model Answer Paper')}} btnToolTipText={"Print Model Answer Paper"}/>
                        <p className='m-0 closePreviewTemp' onClick={handleClose}><ClearIcon /></p>
                    </div>
                    
                    <div className='previewTemplateBody qpPreviewTemplateBody quePapPreviewforPrintContent qpPrintSubSet'>
                        {qpId &&  
                            <VersionHistory questionPaperId={qpId}/>
                        }
                        <QuestionPaperTemplate templateFontDetails={templateFontDetails} ReqBody={previewJson} printConfig={printConfigData} workbookStyle={isWorksheetSet} />
                    </div>                    
                    <div className='previewTemplateFooter d-flex gap-2 justify-content-end'>
                        <ButtonComponent backgroundColor="#01B58A" type="outlined" label={'Close Preview'} textColor={'#000'} buttonSize="Medium" minWidth="200" onClick={handleClose} />
                        <ButtonComponent backgroundColor="#01B58A" type="contained" label={'Print'} textColor={''} buttonSize="Medium" minWidth="200" onClick={()=>{setPrintWithAnswer(false);setSpinnerStatus(true); setTimeout(()=>{print && print();setSpinnerStatus(false)},1000)}}/>
                    </div>
                    {spinnerStatus && <Spinner/>}
                </Box>
            </Modal>
    );
}

export default QuestionPaperTemplatePreview;
