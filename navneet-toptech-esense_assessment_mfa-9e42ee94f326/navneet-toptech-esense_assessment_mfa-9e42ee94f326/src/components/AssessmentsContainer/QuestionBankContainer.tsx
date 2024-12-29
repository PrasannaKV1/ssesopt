import React, { useEffect } from 'react';
import styles from "./AssessmentsContainer.module.css";
import Box from '@mui/material/Box';
import { Tabs, Tab } from '@mui/material';
import { useLocation, useNavigate } from 'react-router';
import { Link, Route, Routes } from 'react-router-dom';
import QuestionPaperTable from '../QuestionPaperContainer/QuestionPaperAdminTable/QuestionPaperTable';
import AssessmentReports from '../AssessmentReportsContainer/AssessmentReports';
import AssessmentsContainer from './AssessmentsContainer';
import Evaluation from '../QuestionPaperContainer/QuestionPaperAdminTable/Evaluation';
import { parseJwt, routeList } from '../../constants/helper';
import chevronright from '../../assets/images/chevronright.svg';
import { ReduxStates } from '../../redux/reducers';
import { useSelector } from 'react-redux';
 
const QuestionbankContainer = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();  // useNavigate hook
    const [activeTab, setActiveTab] = React.useState(0);
    const authToken = localStorage.getItem("auth_token");
    const availableModules = authToken !== null ? parseJwt(authToken)?.data?.availableModules ?? [] : [];
    const isOffline = availableModules.includes(routeList["offline"]);
    const isMobileView = useSelector((state: ReduxStates) => state?.mobileMenuStatus?.isMobileView);
 
    useEffect(() => {
        if (pathname) {
            switch (pathname.substring(8)) {
                case 'questionpaper':
                    setActiveTab(0);
                    break;
                case 'evaluation':
                    setActiveTab(1);
                    break;
                case 'questionbank':
                    isOffline ? setActiveTab(2) : setActiveTab(1);
                    break;
                case 'assessmentReports':
                    setActiveTab(3);
                    break;
                default:
                    setActiveTab(0);
                    break;
            }
        }
    }, [pathname]);
 
    const handleTabChange = (event: any, newValue: any) => {
        setActiveTab(newValue);
        if (localStorage.getItem('qbList_history')) {
            localStorage.removeItem('qbList_history');
        }
        if (localStorage.getItem('qpList_history')) {
            localStorage.removeItem('qpList_history');
        }
    };
 
    const handleChevronClick = () => {
        if (activeTab === 0) {
            navigate('/teacher/dashboard');  // Navigate to dashboard route if on Question Papers tab
        } else {
            navigate('/assess/questionpaper');  // Navigate to questionpaper route otherwise
        }
    };
 
    return (
        <div className={styles.assessmentContainerSect}>
             {isMobileView ?
                <div className={styles.assessment1}>
                   <img src={chevronright} alt='arrow' onClick={handleChevronClick} className={styles.arrowIcon} />
                    <h1 className={styles.assessmentTitles}>Assessments</h1>
                </div>
                :
                <h1 className={styles.assessmentTitles}>Assessments</h1>
            }
            {
                isOffline ? <>
                    <Box className={`${styles.assessmentTabPadd} assessmentTabStyling assessmentQbTab mt-4`} sx={{ width: '100%', typography: 'body1' }}>
                        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                            <Tabs
                                value={activeTab}
                                onChange={handleTabChange}
                                sx={{
                                    '& .MuiTab-root': {
                                        textTransform: 'capitalize',
                                        fontWeight: '650'
                                    }
                                }}
                            >
                                <Tab key={0} label="Question Papers" component={Link} to="/assess/questionpaper" style={{ color: activeTab == 0 ? 'black' : 'grey' }} />
                                <Tab key={1} label="Evaluation" component={Link} to="/assess/evaluation" style={{ color: activeTab == 1 ? 'black' : 'grey' }} />
                               {!isMobileView?    <Tab key={2} label="Question Bank" component={Link} to="/assess/questionbank" style={{ color: activeTab == 2 ? 'black' : 'grey' }} />:""}
                            </Tabs>
                        </Box>
                        <Routes>
                            <Route path="/assess/questionpaper" element={<QuestionPaperTable />} key={0} />
                            <Route path="/assess/evaluation" element={<Evaluation />} key={1} />
                            <Route path="/assess/questionbank" element={<AssessmentsContainer />} key={2} />
                            <Route path="/assess/assessmentReports" element={<AssessmentReports />} key={3} />
                        </Routes>
                        {activeTab == 0 && <QuestionPaperTable />}
                        {activeTab == 1 && <Evaluation />}
                        {activeTab == 2 && <AssessmentsContainer />}
                        {activeTab == 3 && <AssessmentReports />}
                    </Box>
                </> :
                <>
                    <Box className={`${styles.assessmentTabPadd} assessmentTabStyling assessmentQbTab mt-4`} sx={{ width: '100%', typography: 'body1' }}>
                        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                            <Tabs
                                value={activeTab}
                                onChange={handleTabChange}
                                sx={{
                                    '& .MuiTab-root': {
                                        textTransform: 'capitalize',
                                        fontWeight: '650'
                                    }
                                }}
                            >
                                <Tab key={0} label="Question Papers" component={Link} to="/assess/questionpaper" style={{ color: activeTab == 0 ? 'black' : 'grey' }} />
                                <Tab key={1} label="Question Bank" component={Link} to="/assess/questionbank" style={{ color: activeTab == 1 ? 'black' : 'grey' }} />
                            </Tabs>
                        </Box>
                        <Routes>
                            <Route path="/assess/questionpaper" element={<QuestionPaperTable />} key={0} />
                            <Route path="/assess/questionbank" element={<AssessmentsContainer />} key={1} />
                            <Route path="/assess/assessmentReports" element={<AssessmentReports />} key={2} />
                        </Routes>
                        {activeTab == 0 && <QuestionPaperTable />}
                        {activeTab == 1 && <AssessmentsContainer />}
                        {activeTab == 2 && <AssessmentReports />}
                    </Box>
                </>
            }
        </div>
    );
};
 
export default QuestionbankContainer;
 