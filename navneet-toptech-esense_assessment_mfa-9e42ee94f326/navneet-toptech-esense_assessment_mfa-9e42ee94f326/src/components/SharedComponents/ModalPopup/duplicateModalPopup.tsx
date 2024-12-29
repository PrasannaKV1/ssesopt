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
    open: boolean,    
    onClose:()=> void
}
const ModalPopupDuplicate: FC<Props> = ({  open,onClose }) => {
    const navigate = useNavigate() 
    return (
        <div>
            <Modal open={open} onClose={onClose}>
                <div className={styles.modalPopupContainer}>
                    <div className={styles.modalPopupBgSect}>
                        <CloseIcon className={styles.modalPopupCloseIcon} onClick={onClose} />
                        <div className={styles.modalPopupBgSectCont}>
                            <img src={DeleteConfirmation} />
                            <h2>Duplicate Entry</h2>
                            <h4>Please make changes to this question. We will not be able to save a duplicate entry.<br></br> Are you sure you want to continue?</h4>
                            <div className='d-flex mt-3' style={{gap: "20px"}}>
                                <ButtonComponent icon={''} image={""} textColor ="#fff" backgroundColor="#01B58A" disabled={false} buttonSize="Medium" type="contained" onClick={onClose} label="Continue Editing" minWidth="220" />
                                <ButtonComponent icon={''} image={""} textColor ="#1B1C1E" backgroundColor="#9A9A9A" disabled={false} buttonSize="Medium" type="outlined" onClick={() => {navigate('/assess/questionbank')}} label="Discard and Exit" minWidth="220" />
                            </div>
                        </div>                        
                    </div>
                </div>                    
            </Modal>
        </div>
    )
}
export default ModalPopupDuplicate;