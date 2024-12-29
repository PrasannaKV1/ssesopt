import { FunctionComponent, useEffect, useState } from "react";

import Modal from '@mui/material/Modal';

import styles from "../style/duplicateTestModal.module.css";
import closeIcon from "../../../assets/images/closeIcon.svg";

import ButtonComponent from "../../SharedComponents/ButtonComponent/ButtonComponent";
import TestDetailsContainer from "./TestDetailsContainer";
import AssignTestContainer from "./AssignTestContainer";
import { baseGradeApi } from "../../../Api/AssessmentTypes";
import { getLocalStorageDataBasedOnKey } from "../../../constants/helper";
import { State } from "../../../types/assessment";
import { sectionAPI } from "../../../Api/QuestionTypePaper";




export type DuplicateTestModalType = {
    className?: string;
    duplicateTestModal: boolean
    handleTestModalClose: () => void
    selectedQuestion?: any
};

const DuplicateTestModal: FunctionComponent<DuplicateTestModalType> = ({
    className = "",
    duplicateTestModal,
    handleTestModalClose,
    selectedQuestion
}) => {
    const stateDetails = JSON.parse(getLocalStorageDataBasedOnKey('state') as string) as State;

    const [testDetailsTab, setTestDetailsTab] = useState<boolean>(true)
    const [assignTestTab, setAssignTestTab] = useState<boolean>(false)
    const [section, setSection] = useState<any[]>([])


    const testDetailsTabFun = () => {
        setAssignTestTab(false)
        setTestDetailsTab(true)
    }

    const assignTestFun = () => {
        setTestDetailsTab(false)
        setAssignTestTab(true)
    }


    const sectionApi = async () => {
        try {

                const response = await sectionAPI(stateDetails.login.userData.userRefId)
                if (Object.keys(response)?.length > 0 && Object.keys(response?.data)?.length > 0 && response?.data?.classDetails?.length > 0) {
                    let gradeIds = selectedQuestion?.gradeID
                    const sectionGrades = response?.data?.classDetails?.filter((a: any, i: number) => a?.es_gradeid == gradeIds)
                    var result = sectionGrades.reduce((uniqueData: any, o: any) => {
                        if (!uniqueData.some((obj: any) => obj.sectionid === o.sectionid)) {
                            uniqueData.push(o);
                        }
                        return uniqueData;
                    }, [])
                    setSection(result ?? [])
                } else {
                    setSection([])
                }
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        sectionApi()
    }, [])

    return (
        <Modal
            open={duplicateTestModal}
            onClose={() => { }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <>
                <form className={[styles.popupBackground, className].join(" ")} style={{ height: assignTestTab ? "739px" : "" }}>
                    <div style={{ padding: "25px 40px 0px 40px" }}>
                        <div className={styles.duplicateTestContentParent}>
                            <div className={styles.duplicateTestContent}>
                                <h2 className={styles.duplicateOnlineTest}>Duplicate Online Test</h2>
                                <div className={styles.changeSomeDetails}>
                                    Change some details of the Online Test and assign it to students
                                </div>
                            </div>
                            <div className={styles.frameWrapper}>
                                <img
                                    className={styles.frameChild}
                                    loading="lazy"
                                    alt=""
                                    src={closeIcon}
                                    onClick={handleTestModalClose}
                                />
                            </div>
                        </div>
                        <section className={styles.tabsParent}>
                            <div className={styles.tabs}>
                                <div className={styles.tabActive} style={{ cursor: testDetailsTab ? "pointer" : "", borderBottom: testDetailsTab ? "4px solid #01B58A" : "", color: testDetailsTab ? "" : "#9A9A9A" }}>
                                    <h3 className={styles.text}>Test Details</h3>
                                    <div className={styles.color} />
                                </div>
                                <div className={styles.tabActive2} style={{ cursor: assignTestTab ? "pointer" : "", borderBottom: assignTestTab ? "4px solid #01B58A" : "", color: !assignTestTab ? "#9A9A9A" : "" }}>
                                    <a className={styles.text2}>Assign Test</a>
                                    <div className={styles.color2} />
                                </div>
                            </div>
                        </section>
                        {testDetailsTab === true ? (
                            <TestDetailsContainer handleTestModalClose={handleTestModalClose} section={section} selectedQuestion={selectedQuestion} setAssignTestTab={setAssignTestTab} setTestDetailsTab={setTestDetailsTab} />
                        ) :
                            <AssignTestContainer selectedQuestion={selectedQuestion} handleTestModalClose={handleTestModalClose} />
                        }
                    </div>

                    {assignTestTab === true && (
                        <div className={styles.assignTestFooter}>

                        </div>
                    )}
                </form>

            </>
        </Modal>
    );
};

export default DuplicateTestModal