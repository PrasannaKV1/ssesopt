import React, { FC } from 'react'
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Container, TableCell, TableRow } from '@mui/material';
import ButtonComponent from '../../SharedComponents/ButtonComponent/ButtonComponent';
import Divider from '@mui/material/Divider';
import styles from './ModalPopup.module.css';
import DeleteConfirmation from "../../../assets/images/deleteConfirmation.svg"
import { useNavigate } from 'react-router';

type Props = {
    header: string,
    open: boolean,
    clickHandler:any,
    label1?:string,
    label2:string,
    onClose:()=> void,
    subHeader1:string,
    subHeader2:string  
}
const CloseWorkSheetModal: FC<Props> =  ({ header, open,clickHandler,onClose,label1,label2,subHeader1,subHeader2}) => {  
    return (
        <>
            <Modal open={open}>
                <div className={styles.modalPopupContainer}>
                    <div className={styles.modalPopupBgSect}>
                        <CloseIcon className={styles.modalPopupCloseIcon} onClick={onClose} />
                        <div className={styles.modalPopupBgSectCont}>
                            <img src={DeleteConfirmation} />
                            <h2>{header}</h2>
                            <h4><span className="fw-normal">{subHeader1}</span><br></br> <span className="fw-bold">{subHeader2}</span></h4>
                            <div className='d-flex mt-3' style={{gap: "20px"}}>
                            {label1 &&<ButtonComponent icon={''} image={""} textColor ="#fff" backgroundColor="#01B58A" disabled={false} buttonSize="Large" type="contained" onClick={() => {clickHandler(true)}} label={label1}  minWidth="220" />}
                                <ButtonComponent icon={''} image={""} textColor ="#1B1C1E" backgroundColor="#9A9A9A" disabled={false} buttonSize="Large" type="outlined" onClick={() => {clickHandler(false)}} label={label2}  minWidth="220" />
                            </div>
                        </div>                        
                    </div>
                </div>                    
            </Modal>
        </>
    )
}
export default CloseWorkSheetModal;