import React, { useState, useEffect } from 'react';
import styles from "../AssessmentsContainer/AssessmentsContainer.module.css";
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import SelectBoxComponent from '../SharedComponents/SelectBoxComponent/SelectBoxComponent';
import EmptyScreen from '../SharedComponents/EmptyScreen/EmptyScreen';
import MultiSelectComponent from '../SharedComponents/MultiSelectComponent/MultiSelectComponent';
import { MultiSelectDropdown } from '../../constants';
import { tabQuestionPaperElement, tabQuestionPaperInnerElm } from '../../constants/urls';
import { Button, Typography } from '@mui/material';
import overAllAttend from "../../assets/images/overAllAttend.svg";
import CreateNewQuestionPaperModal from '../SharedComponents/QuestionPaperSharedComponent/CreateNewQuestionPaperModal/CreateNewQuestionPaperModal';
import QuestionPaperIcon from '../../assets/images/QuestionPaperIcon.svg';
import QuestionPaperIconwithApprove from '../../assets/images/QuestionPaperIconwithApprove.svg';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';

const QuestionPaperContainer = () => {
    const [value, setValue] = useState<string>('4');
    const [createNewQuestionModalStatus, setCreateNewQuestionModalStatus] = useState(false)
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue)
    };

    const [value1, setValue1] = useState<string>('2');
    const toggleHandleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue1(newValue)
    };
    let history = useNavigate();

    const handleButtonClick = () => {
        history("/questionpaper/onlineassessment")
    } 
    // for ModalFormalInformalComponent 
    const modalData = [
        {
            header: "Informal Test",
            image: QuestionPaperIcon,
            content: "You will be able to create a question paper used to conduct class tests or informal tests.",
            buttons: [
                {
                    label: "Create Online Informal Test",
                    type: "contained",
                    textColor: "white",
                    backgroundColor: "#01B58A",
                    minWidth: "182px",
                    buttonSize: "Medium",
                    icon: <ArrowForwardIcon />, //icon need to be passed as a component
                    onClick: () =>  handleButtonClick() ,
                },
                {
                    label: "Create Offline Informal Test",
                    type: "contained",
                    textColor: "white",
                    backgroundColor: "#01B58A",
                    minWidth: "182px",
                    buttonSize: "Medium",
                    icon: <ArrowForwardIcon />,
                    onClick: () =>  handleButtonClick(),
                }
            ]
        },
        {
            header: "Formal Test",
            image: QuestionPaperIconwithApprove,
            content: "Question paper will need to be approved by the HOD before publishing.",
            buttons: [
                {
                    label: "Create Online Formal Test",
                    type: "contained",
                    textColor: "white",
                    backgroundColor: "#01B58A",
                    minWidth: "182px",
                    buttonSize: "Medium",
                    icon: <ArrowForwardIcon />,
                    onClick: () =>  handleButtonClick() ,
                    
                },
                {
                    label: "Create Offline Formal Test",
                    type: "contained",
                    textColor: "white",
                    backgroundColor: "#01B58A",
                    minWidth: "182px",
                    buttonSize: "Medium",
                    icon: <ArrowForwardIcon />,
                    onClick: () =>  handleButtonClick() ,
                }
            ]
        }
    ]
    return (
        <div className={styles.assessmentContainerSect}>
            <div className='d-flex justify-content-between me-4 pe-3'>
                <h1 className='assessmentTitles'>VII B Science</h1>
                <div className={styles.classDashboardFlex}>
                    <div className={styles.classDashboardDate}>
                        <div className={styles.classDashboardDay}>MON</div>
                        <Typography className="h2" style={{ textTransform: "uppercase" }}>
                            <span className={styles.dayFormat}>6&nbsp;</span>
                            <span className={styles.monthFormat}>MAR&nbsp;</span>
                            <span className={styles.yearFormat}>2023&nbsp;</span>
                        </Typography>
                    </div>
                    <div className={styles.addUserIcon}>
                        <img src={overAllAttend} />
                        <Typography className={styles.userCount}>
                            <span>0</span>/{" "}
                            29
                        </Typography>
                        <Typography className={styles.userStd}>STUDENTS PRESENT</Typography>
                    </div>
                </div>
            </div>

            <Box className={`${styles.assessmentTabPadd} assessmentTabStyling mt-4`} sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleChange} aria-label="lab API tabs example">
                            {tabQuestionPaperElement.map((tab, index) => <Tab key={index} label={tab.label} value={`${index + 1}`} />)}
                        </TabList>
                    </Box>
                    <TabPanel value="1" className="px-0">
                    </TabPanel>
                    <TabPanel value="2" className="px-0">
                    </TabPanel>
                    <TabPanel value="3" className="px-0">
                    </TabPanel>
                    <TabPanel value="4" className="px-0">
                        <div className={`${styles.questionPaperToggleBtn} questionPaperToggleTab`}>
                            <TabContext value={value1}>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <TabList onChange={toggleHandleChange} aria-label="lab API tabs example">
                                        {tabQuestionPaperInnerElm.map((tab, index) => <Tab key={index} label={tab.label} value={`${index + 1}`} />)}
                                    </TabList>
                                </Box>
                                <TabPanel value="1" className="px-0">
                                </TabPanel>
                                <TabPanel value="2" className="px-0 pt-2 pb-0">
                                    <div className={styles.questionBankContSect}>
                                        <div className={styles.questionBankCont}>
                                            {/* {questionTable.length ?
                                            <QuestionBank questionData={questionTable} accessFilter={(e:boolean)=>updateUser(e ? "public" : "private","access")}/>
                                            : */}
                                            <EmptyScreen emptyBtnTxt={"Create New Question Paper"} title={"Create New Question Paper"} desc={"Press the button below to create a new question paper"} onClickBtn={() => setCreateNewQuestionModalStatus(true)} />
                                            {/* } */}
                                        </div>
                                    </div>
                                </TabPanel>
                                <TabPanel value="3" className="px-0">
                                </TabPanel>
                                <TabPanel value="4" className="px-0">
                                </TabPanel>
                            </TabContext>
                        </div>

                    </TabPanel>
                    <TabPanel value="5" className="px-0">
                    </TabPanel>
                </TabContext>
            </Box>
            {createNewQuestionModalStatus && 
                <CreateNewQuestionPaperModal modalData={modalData} onClose={() => setCreateNewQuestionModalStatus(false)} />
            }
            
        </div>
    );
};

export default QuestionPaperContainer;