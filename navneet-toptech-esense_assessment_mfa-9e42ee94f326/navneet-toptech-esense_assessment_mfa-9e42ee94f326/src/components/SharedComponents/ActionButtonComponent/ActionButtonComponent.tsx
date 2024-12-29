import React from 'react';
import styles from "./ActionButtonComponent.module.css";
import RroundedActions from "../../../assets/images/RroundedActions.svg";
import AssignQuestionPaper from "../../../assets/images/AssignQuestionPaper.svg";
import Delete from "../../../assets/images/delete.svg"
import Edit from "../../../assets/images/edit.svg";
import { Tooltip } from '@mui/material';

interface Props{
    disableBtn: boolean,
    dataList:any,
    modalOpen:(param:boolean) => void,
    getKeyId:(param:any) => void,
    editKey:(param:any) => void,
    duplicateKey:(param:any) => void,
    isActive:boolean,
    disableKey?:Array<string>,
    approvalEditDisable?:boolean
    setShowAssignQPModal?:(showAssignQPModal: boolean) => void;
    setQuestionPaperIdToAssign?:() => void;
    showAssignBtn? : boolean
    markUploaded?: boolean
};

const ActionButtonComponent: React.FC<Props> = ({ approvalEditDisable, disableBtn, dataList, modalOpen, getKeyId, editKey, duplicateKey, isActive, disableKey, setShowAssignQPModal, setQuestionPaperIdToAssign, showAssignBtn, markUploaded }) => {
    const getKey = (d: any) => {
        modalOpen(true);
        getKeyId(d)                
    };
    return (
        <div className={styles.actionButtonComp}>
            {/* {showAssignBtn && (
                <Tooltip title={`Assign Paper`} arrow >
                    <img src={AssignQuestionPaper} className={`${!isActive  || disableKey?.includes("Assign") ? styles.imgDisable : ""}`} onClick={(event)=> {setShowAssignQPModal?.(true);setQuestionPaperIdToAssign?.();event.stopPropagation()}} />
                </Tooltip>
            )} */}
            <Tooltip title={`Duplicate`} arrow >
               <img src={RroundedActions} className={`${!isActive  ? styles.imgDisable : ""}`} onClick={(event)=> {duplicateKey(dataList);event.stopPropagation()}} />
            </Tooltip>
            <Tooltip title={`Edit`} arrow >
                <img className={`${disableKey?.includes("Edit") ? styles.imgDisable : (disableBtn || approvalEditDisable) ? styles.imgDisable : (isActive == false) ? styles.imgDisable : (dataList?.isMarksUploaded) ? styles.imgDisable : (markUploaded) ? styles.imgDisable : ""}`} style={{ cursor: "pointer" }} src={Edit} onClick={(e) => { editKey(dataList); e.stopPropagation() }} />
            </Tooltip>
            <Tooltip title={`Delete`} arrow >
                <img className={`${disableKey?.includes("Delete") ? styles.imgDisable : disableBtn ? styles.imgDisable : (dataList?.isMarksUploaded) ? styles.imgDisable : (markUploaded) ? styles.imgDisable : ""}`} style={{ cursor: "pointer" }} src={Delete} onClick={(e) => { getKey(dataList); e.stopPropagation() }} />
            </Tooltip>            
        </div>
    );
};

export default ActionButtonComponent;