import React, { FC, useEffect, useState } from 'react'
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Container} from '@mui/material';
import ButtonComponent from '../../../SharedComponents/ButtonComponent/ButtonComponent';
import Divider from '@mui/material/Divider';
import './PreviewModalComponent.css';
import { useNavigate } from 'react-router';
import {  previewQuestionBankWithScroll, qbPreviewGetApi } from '../../../../Api/AssessmentTypes';
import { Topics, Subject, Question, Chapter,Theme } from '../../../../interface/filters';
import PreviewContentComponent from './PreviewContentComponent/PreviewContentComponent';
import { getLocalStorageDataBasedOnKey } from '../../../../constants/helper';
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
const style = {
    position: 'absolute' as 'absolute',
    top: "50%",
    left: "50%",
    transform: 'translate(-50%, -50%)',
    width: "778px",
    height: "calc(100vh - 10px)",
    background: "#FFFFFF",
    borderRadius: "12px",
    p: 4,
};
type Props = {
    header: string,
    modelOpen: boolean,
    setOpenPreview: (e: boolean) => void,
    selectedData: any,
    qbListHistoryHandler?:()=>void
    allFilters: any
}
const PreviewModalComponent: FC<Props> = ({ qbListHistoryHandler,header, modelOpen, setOpenPreview, selectedData, allFilters }) => {
    const navigate = useNavigate()
    const [questionDetails, setQuestionDetails] = useState<any>()
    const [openModal, setOpenModal] = React.useState(modelOpen);
    const [topics, setTopics] = useState<Topics[]>([])
    const [subject, setSubject] = useState<Subject[]>([])
    const [theme, setTheme] = useState<Theme[]>([])
    const [questionTypes, setQuestionTypes] = useState<Question[]>([])
    const [chapter, setChapter] = useState<Chapter[]>([])
    const [grades, setGrades] = useState<any[]>([])
    const [selectedAPIData, setSelectedAPIData] = useState<any>()
    const [changeViewId, setChangeViewId] = useState<any>(selectedData?.id);
    const [changeViewMarks, setChangeViewMarks] = useState<any>(selectedData?.marks);
    const [viewPreviousData, setPreviousViewData] = useState<any>();
    const [viewNextData, setNextViewData] = useState<any>();

    useEffect(() => {
        updatedPreviewGetAPI();
    }, [changeViewId,changeViewMarks]);

    const handleClose = () => {
        setOpenModal(false);
        setOpenPreview(false)
    }

    const updatedPreviewGetAPI = async () => {
        let apiSearchparams: any = allFilters;
        apiSearchparams.questionId = changeViewId;
        apiSearchparams.marks = changeViewMarks;
        apiSearchparams.courseIds = selectedData?.subjectId;
        const response = await previewQuestionBankWithScroll(apiSearchparams);

        if( response?.result?.responseDescription === "Success" ){
            setSelectedAPIData(response?.data?.current);
            setPreviousViewData(response?.data?.previous);
            setNextViewData(response?.data?.next);
        }else{
            setSelectedAPIData([])
            setPreviousViewData([])
            setNextViewData([])
        }
    }

    const previewGetAPI = async (listId:number) => {
        const response = await qbPreviewGetApi(listId)
        setSelectedAPIData(response.data)
    }

    const handleEdit = () => {
        qbListHistoryHandler && qbListHistoryHandler()
        navigate( '/assess/editnewquestion',{
        state: {
            data: selectedAPIData
        }
    })}

    const duplicateQuestion=()=>{
        qbListHistoryHandler && qbListHistoryHandler()
        navigate(
            '/assess/duplicateQuestion',
            {
                state: {
                    data: selectedAPIData
                }
            }
        )
    }
    const comprehensiveDetails =(data:any, param:string) =>{
        let difficuty:any ={
            "Easy": 0,
            "Moderate": 0,
            "Hard": 0,
            "Very Hard":0
        }
        let difficutyData = ""
        let skillArray:any=[];
        data?.metaInfo?.map((question:any) => {
            if(param == "difficulty"){
                difficuty[question?.questionLevelName] = difficuty[question?.questionLevelName] + 1
            }else{
                if(question?.questionObjectiveName != undefined) skillArray.push(question?.questionObjectiveName)
            }           
        })
        if(param == "difficulty"){                   
            Object.keys(difficuty).forEach(function (key, value) {
                if(difficuty[key] != 0) difficutyData += "<span>"+key+": "+difficuty[key] +"</span>"
            })            
            return <div className='compreDiffData' dangerouslySetInnerHTML={{__html: difficutyData}}></div>
        }else{
            return <>{skillArray.length > 0 ? <div className='compreDiffData'><span>{skillArray[0]} {skillArray.length > 1 ? "+"+(skillArray.length - 1) : ""}</span></div>: ""}</>
        }       
    }

    return (
        <div>
            <Modal
                open={openModal}
                onClose={handleClose}>
                <Container sx={style}>
                    <div className={`sup_tic_modpop`}>
                    <div className="alignHeader">
                        <Box>
                            <Typography id="modal-modal-title">
                                Preview Question
                            </Typography>
                        </Box>
                        <Box>
                            <CloseIcon style={{cursor: "pointer"}} onClick={handleClose} />
                        </Box>
                    </div><br />
                    <div className="toggler_prev" aria-disabled={!viewPreviousData?.id} style={viewPreviousData?.id? {opacity:1} : {opacity:0.5}} onClick={() => {
                        if (viewPreviousData?.id) {
                            setChangeViewMarks(viewPreviousData?.marks)
                            setChangeViewId(viewPreviousData?.id)
                        }
                    }}>
                        <KeyboardArrowRightIcon data-testid="prev_slide" className='arrow-view' />
                    </div>
                    <div className="toggler_next" aria-disabled={!viewNextData?.id} style={viewNextData?.id? {opacity:1} : {opacity:0.5}} onClick={() => {
                        if (viewNextData?.id) {
                            setChangeViewMarks(viewNextData?.marks)
                            setChangeViewId(viewNextData?.id)
                        }
                    }}>
                        <KeyboardArrowRightIcon data-testid="next_slide" className='arrow-view' />
                    </div>
                    </div>
                    <Divider className="divider" />
                    <div className='previewQuestionScroll'>
                        <Box sx={{ marginTop: '25px' }}>
                            <div className='d-flex align-items-start mx-0'>
                                <div className="leftsideHeader">
                                    Question Tag:
                                </div>
                                <Box className="rightsideHeader" >
                                    <div className='col d-flex flex-wrap'>
                                    {selectedAPIData?.gradeName && <span className="questionTag">{selectedAPIData?.gradeName}</span>}
                                    {selectedAPIData?.subjectName && <span className="questionTag">{selectedAPIData?.subjectName}</span>}
                                    
                                    </div>
                                    <div className='row'>
                                        <div className="col align-items-center d-flex flex-wrap">
                                        {selectedAPIData?.themeName && <span className="questionTag">{selectedAPIData?.themeName}</span>}
                                        {selectedAPIData?.chapterName && <span className="questionTag">{selectedAPIData?.chapterName}</span>}
                                        {selectedAPIData?.topicName && <span className="questionTag">{selectedAPIData?.topicName}</span>}
                                        </div>
                                    </div>
                                </Box>
                            </div>
                            <Box className="d-flex align-items-start mx-0" sx={{ marginTop: "11px" }}>
                                <div className="leftsideHeader">
                                    Question Details:
                                </div>
                                <Box className='rightsideHeader d-flex flex-wrap' >
                                {selectedAPIData?.questionTypeName && <span className="questionDetails d-flex">Question type: <span dangerouslySetInnerHTML={{__html:selectedAPIData?.questionTypeWithTemplate}} /></span>}
                                {/* {(selectedAPIData?.questionLevelName) ? <span className="questionDetails">{selectedAPIData?.questionLevelName} </span> : <>{comprehensiveDetails(selectedAPIData, "difficulty")}</>} */}
                                {(selectedAPIData?.questionLevelName) ? <span className="questionDetails">{selectedAPIData?.questionLevelName} </span> : ""}
                                {selectedAPIData?.marks && <span className="questionDetails">{selectedAPIData?.marks} Marks</span>}
                                {selectedAPIData?.completionTime && <span className="questionDetails">{selectedAPIData?.completionTime} Mins</span>}
                                {/* {(selectedAPIData?.questionObjectiveName) ? <span className="questionDetails">{selectedAPIData?.questionObjectiveName}</span> : <>{comprehensiveDetails(selectedAPIData, "skills")}</>} */}
                                {(selectedAPIData?.questionObjectiveName) ? <span className="questionDetails">{selectedAPIData?.questionObjectiveName}</span> : ""}
                                </Box>
                            </Box>
                            <Box sx={{ marginTop: "10px" }} className="d-flex align-items-start mx-0">
                                <div className="leftsideHeader">
                                    Privacy:
                                </div>
                                <Box className='rightsideHeader' >
                                    <span className='privacy'>{selectedAPIData?.isPublic == true ? "Public" : "Private"}</span>
                                </Box>
                            </Box><br />
                            <Divider className="divider" />
                        </Box>
                        <Box sx={{ marginTop: "25px" }}>
                            {selectedAPIData?.questionTypeName == "Comprehensive" &&
                                <div className='d-flex align-items-start mx-0'>
                                    <div className="leftsideHeader ">
                                        Passage/ Extract :
                                    </div>
                                    <Box className='rightsideHeader' >
                                        <div className='questionContent d-flex flex-column justify-content-start'>                                        
                                            <span className='questionContent' dangerouslySetInnerHTML={{ __html: selectedAPIData?.question.replace("<p><br></p>", "")}}></span>    
                                        </div>
                                    </Box>
                                </div>
                            }
                            
                            {selectedAPIData?.questionTypeName !== "Comprehensive" && <PreviewContentComponent questionType={selectedAPIData} comprehensiveTypeStatus={false} comprehensiveTypeIndex={0} />}
                            {(selectedAPIData?.questionTypeName == "Comprehensive" && selectedAPIData?.metaInfo) && 
                                <>                            
                                    {selectedAPIData?.metaInfo.map((section: any, index: number) => {
                                        return (
                                            <>
                                            <div className='ComprehensionBorderDash'></div>
                                            <PreviewContentComponent comprehensiveTypeStatus={true} comprehensiveTypeIndex={index} questionType={section} />
                                            </>
                                        )

                                    })}
                                </>
                            }
                            
                           
                        </Box>
                    </div>
                    <Box className="d-flex justify-content-end mt-4" style={{gap: "15px"}}>
                        {((JSON.parse(getLocalStorageDataBasedOnKey('state') as string)?.login?.userData?.userId === selectedData?.createdBy)&&(selectedData?.questionTypeActive)&&(selectedData?.questionTypeName == 'Comprehensive' ? selectedData?.isSubQuestionTypeActive : true)) &&
                        <Box>
                            <ButtonComponent type="contained" buttonSize="Large" label="Edit" onClick={() => { handleEdit() }}
                                textColor=" " minWidth="150" backgroundColor="#01B58A"
                            />
                        </Box>
                        }
                        {(selectedData?.questionTypeActive && (selectedData?.questionTypeName == 'Comprehensive' ? selectedData?.isSubQuestionTypeActive : true)) &&
                        <Box>
                            <ButtonComponent type="outlined" buttonSize="Large" label="Duplicate" onClick={() => { duplicateQuestion() }}
                                textColor="black" minWidth="150" backgroundColor="#01B58A"
                            />
                        </Box>
                        }
                        <Box>
                            <ButtonComponent type="outlined" buttonSize="Large" label="Close" onClick={handleClose}
                                textColor="black" minWidth="150" backgroundColor="#01B58A"
                            />
                        </Box>
                    </Box>
                </Container>
            </Modal>
        </div>
    )
}
export default PreviewModalComponent;