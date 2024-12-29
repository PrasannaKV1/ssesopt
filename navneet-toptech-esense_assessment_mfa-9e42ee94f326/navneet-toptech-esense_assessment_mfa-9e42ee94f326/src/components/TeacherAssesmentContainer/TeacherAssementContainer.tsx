import { Box, dividerClasses, Tab, Tabs, Typography } from '@mui/material'
import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import "./TeacherAssementContainer.css";
import styles from "./TeacherAssementContainer.module.css";
import { dayNames, monthNames } from '../../constants/helper';
import overAllAttendance from "../../assets/images/overAllAttendance.svg";
import OnlineAssesment from '../OnlineAssesment/OnlineAssesment';
enum TabHeader {
    overView = "Overview",
    students = "Students",
    mileStone = "Milestones",
    timeTable = "Timetable",
    classwork = "Classwork",
    doubts = "Doubts",
    tests = "Tests",
    liveClass = "Live Classes"
}

var date = new Date();
var day = date.getDate();
var year = date.getFullYear();
var month = monthNames[date.getMonth()];
var dayname = dayNames[date.getDay()];

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}


function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box>
                    {children}
                </Box>
            )}
        </div>
    );
}
const TeacherAssementContainer = () => {
    const [value, setValue] = React.useState(5);
    const lmsStorageData: any = JSON.parse(localStorage.getItem("topAssessData") as string);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(value);
        localStorage.removeItem("topAssessData");
        switch (newValue) {
            case 0:
                window.location.href = window.location.origin + `${lmsStorageData?.url}/overview`;
                break;

            case 1:
                window.location.href = window.location.origin + `${lmsStorageData?.url}/students`;
                break;

            case 2:
                window.location.href = window.location.origin + `${lmsStorageData?.url}/milestones`;
                break;

            case 3:
                window.location.href = window.location.origin + `${lmsStorageData?.url}/timetable`;
                break;

            case 4:
                window.location.href = window.location.origin + `${lmsStorageData?.url}/assessments`;
                break;

            case 6:
                window.location.href = window.location.origin + `${lmsStorageData?.url}/discussions`;
                break;

            case 7:
                window.location.href = window.location.origin + `${lmsStorageData?.url}/liveclass`;
                break;

            default:
                setValue(value);
        }
    };


    return (
        <div className={styles.classDashboardContainer}>
            <div className={styles.classDashboardHeader}>
                <p className={styles.classDashboardTitle}>
                    {(lmsStorageData?.hasOwnProperty("subject") && lmsStorageData?.subject !== "") ? lmsStorageData?.subject : (lmsStorageData?.grade + " " + lmsStorageData?.section)} {(!lmsStorageData?.hasOwnProperty("subject") && lmsStorageData?.coursedisplayname !== " ") ? `${lmsStorageData?.coursedisplayname}` : ""}
                </p>
                <div className={styles.classDashboardFlex}>
                    <div className={styles.classDashboardDate}>
                        <div className={styles.classDashboardDay}>{dayname}</div>
                        <Typography className="h2" style={{ textTransform: "uppercase" }}>
                            <span className={styles.dayFormat}>{day}&nbsp;</span>
                            <span className={styles.monthFormat}>{month}&nbsp;</span>
                            <span className={styles.yearFormat}>{year}&nbsp;</span>
                        </Typography>
                    </div>
                    <div className={styles.addUserIcon}>
                        <img src={overAllAttendance} />
                        <Typography className={styles.userCount}>
                            <span>{lmsStorageData?.presentAtt}</span>/{" "}
                            {lmsStorageData?.totalNumOfStudents}
                        </Typography>
                        <Typography className={styles.userStd}>STUDENTS PRESENT</Typography>
                    </div>
                </div>
            </div>
            <div className="classDashboardTopNav live_cls_tabs">
                <Box sx={{ width: "100%" }}>
                    <Box className="w-100">
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                            <Tab label={TabHeader.overView} className={styles.routeDesign} {...a11yProps(0)} />
                            <Tab label={TabHeader.students} className={styles.routeDesign} {...a11yProps(1)} />
                            <Tab label={TabHeader.mileStone} className={styles.routeDesign} {...a11yProps(2)} />
                            <Tab label={TabHeader.timeTable} className={styles.routeDesign} {...a11yProps(3)} />
                            <Tab label={TabHeader.classwork} className={styles.routeDesign} {...a11yProps(4)} />
                            <Tab label={TabHeader.tests} className={styles.routeDesign} {...a11yProps(5)} />
                            <Tab label={TabHeader.doubts} className={styles.routeDesign} {...a11yProps(6)} />
                            <Tab label={TabHeader.liveClass} className={styles.routeDesign} {...a11yProps(7)} />
                        </Tabs>
                    </Box>

                    <TabPanel value={value} index={5}>
                        <OnlineAssesment isFromTeacherWeb={true} />
                    </TabPanel>
                </Box>
            </div>
        </div>
    )
}

export default TeacherAssementContainer
