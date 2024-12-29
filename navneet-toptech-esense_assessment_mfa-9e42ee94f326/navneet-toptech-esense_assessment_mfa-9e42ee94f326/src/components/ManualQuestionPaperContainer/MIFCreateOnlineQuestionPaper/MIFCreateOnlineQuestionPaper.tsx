import React, { useEffect, useState } from 'react';
import FooterComponent from '../../SharedComponents/QuestionPaperSharedComponent/Footer/FooterComponent';
import SwitchComponent from '../../SharedComponents/SwitchComponent/SwitchComponent';
import "../MIFQuestionPaperContainer.css";
import "./MIFCreateOnlineQuestionPaper.css";
import MyTemplate from  "../../../assets/images/MyTemplate.png"
import ButtonComponent from '../../SharedComponents/ButtonComponent/ButtonComponent';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {getTemplateListApi} from "../../../Api/QuestionPaper"

const CreateOnlineQuestionPaper = () => {
    const [templateSelectObj, setTemplateSelectObj] = useState([])
    const [selectedTemplate, setSelectedTemplate] = useState<any>({})
    const assessmentFilters = async () => {
        const response = await getTemplateListApi()
        setTemplateSelectObj(response)
    }
    useEffect(() => {
        assessmentFilters();
    },[])

    const selectTemplateHandler = (marks:number, time:number) => {
        setSelectedTemplate({"totalMarks": marks,"totalTime": time})
    }
    const secConvertion = (sec:number) => {
        let secCount = sec/60;
        return secCount;
    }
    return (
        <div className='questionPaperContainer createQuestOnlineSect'>
            <h1>Create Online Assessment Question Paper</h1>
            <h3>We use automation to help you quickly generate question papers.</h3>
            <div className='createQuestOnlineSectTemplateSect mt-4'>
                <SwitchComponent onChangeSwitch={() => {}}  checked={false} disabled={false} beforeLabel={'Auto'} afterLabel={'Manual'} />
                <div className='createQuestOnlineSectTemplateSectBlck'>
                    <h3 className='m-0'>Select a template from below or create your own</h3>
                    <div className='templateSelectSectWrapper'>
                        <form>
                        <>
                        {templateSelectObj?.map((dataList: any, index: any) => (
                             <div className='templateSelectSect'>
                                <div className='templateSelectSectWrapper'>
                                    <input onClick={() => selectTemplateHandler(dataList.totalMarks, dataList.totalTime)} type="radio" id={dataList.templateId} name="radioType" value={dataList.templateId}></input>                        
                                    <label htmlFor={dataList.templateId}><img src={MyTemplate} /></label><br></br>
                                    <h3>{dataList.templateName}</h3>
                                </div>                                
                            </div>
                        ))
                        }
                        </>
                        </form>
                    </div>
                </div>
                <div className='createOnlineFooterSect'>
                    <div className='createOnlineFooterSectLeft'>
                        {(Object.keys(selectedTemplate).length > 0) && 
                            <>
                                <p className='m-0'>Total Marks: <span>{selectedTemplate.totalMarks}</span></p>
                                <p className='m-0'>Total Time: <span>{secConvertion(selectedTemplate.totalTime)} mins</span></p>
                            </>
                        }
                        
                    </div>
                    <div className='createOnlineFooterSectRight'>
                        <ButtonComponent endIcon={""} image={""} textColor ="#01B58A" backgroundColor="#01B58A" disabled={false} buttonSize="Medium" type="transparent" onClick={() => {}} label="Preview Template" minWidth="100" />
                        <ButtonComponent endIcon={""} image={""} textColor ="#000" backgroundColor="#9A9A9A" disabled={false} buttonSize="Medium" type="outlined" onClick={() => {}} label="Exit" minWidth="120" />
                        <ButtonComponent endIcon={<ArrowForwardIcon/>} image={""} textColor ="" backgroundColor="#01B58A" disabled={false} buttonSize="Medium" type="contained" onClick={() => {}} label="Next" minWidth="150" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateOnlineQuestionPaper;