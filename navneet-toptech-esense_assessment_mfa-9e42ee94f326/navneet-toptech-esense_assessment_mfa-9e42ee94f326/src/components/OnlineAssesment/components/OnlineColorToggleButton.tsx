import * as React from 'react';
import styles from "../../OnlineAssesment/style/duplicateTestModal.module.css"
import { parseJwt, routeList } from '../../../constants/helper';

interface OnlineColorToggleButtonProps {
    selectedTab: string | null;
    onChange: (newValue: string,tabStringValue: string) => void;
    isFromTeacherWeb?:boolean;
}

const OnlineColorToggleButton: React.FC<OnlineColorToggleButtonProps> = ({ selectedTab, onChange,isFromTeacherWeb }) => {
    const authToken = localStorage.getItem("auth_token");
    const availableModules = authToken !== null ? parseJwt(authToken)?.data?.availableModules ?? [] : [];
    const isChapterChallenge = availableModules.includes(routeList["chapterChallenge"]);
    const lmsAssessData: any = JSON.parse(localStorage.getItem("topAssessData") as string);
    const showOnlineTab:any=isFromTeacherWeb ? lmsAssessData?.isOnlineTestEnable : true;
    const showChapterChallengeTab:any= isFromTeacherWeb ? lmsAssessData?.isChapterChallengeEnable :true;
    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        newValue: string,
        tabStringValue?:string|any,
    ) => {
        onChange(newValue,tabStringValue); // Call the onChange prop with the new value
    };

    return (
        <div className={styles.parentContainer}>

            <div className={styles.tabsContainer}>
                {showOnlineTab && <button
                    className={`${styles.tabButton} ${!selectedTab || selectedTab === "0" ? styles.active : ""
                        }`}
                    onClick={(e) => {
                        handleChange(e, "0", " Online Tests");
                    }}
                >
                    Online Tests
                </button>}
                {/* <button
                    className={`${styles.tabButton} ${selectedTab === "1" ? styles.active : ""
                        }`}
                    onClick={(e) => {
                        handleChange(e, "1" , "Daily Quiz");
                    }}
                >
                    Daily Quiz
                </button> */}
                {isChapterChallenge && showChapterChallengeTab && <button className={`${styles.tabButton} ${selectedTab === "1" ? styles.active : ""
                        }`}
                    onClick={(e) => {
                        handleChange(e, "1", "Chapter Challenge");
                    }}
                    // style={{width:"350px"}}
                >
                    Chapter Challenge
                </button>}
            </div>

        </div >
    );
}

export default OnlineColorToggleButton;
