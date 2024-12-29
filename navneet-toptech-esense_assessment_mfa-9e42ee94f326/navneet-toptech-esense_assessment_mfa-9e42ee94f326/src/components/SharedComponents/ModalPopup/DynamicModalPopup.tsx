import React, { FC } from 'react'
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Container, TableCell, TableRow } from '@mui/material';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import Divider from '@mui/material/Divider';
import styles from './ModalPopup.module.css';
import DeleteConfirmation from "../../../assets/images/deleteConfirmation.svg"
import { useNavigate } from 'react-router';

type Props = {
    header: string,
    open: boolean,
    clickHandler:any,
    label1:string,
    label2:string,
    onClose:()=> void,
    content :string,
}
const DynamicModalPopup: FC<Props> = ({ header, open,clickHandler,onClose ,content,label1,label2}) => {
    const navigate = useNavigate() 
    return (
        <div>
            <Modal open={open} onClose={onClose}>
                <div className={styles.modalPopupContainer}>
                    <div className={styles.modalPopupBgSect}>
                        <CloseIcon className={styles.modalPopupCloseIcon} onClick={onClose} />
                        <div className={styles.modalPopupBgSectCont}>
                            <img src={DeleteConfirmation} />
                            <h2>{header}</h2>
                            <h4>{content}</h4>
                            <div className='d-flex mt-3' style={{gap: "20px"}}>
                                <ButtonComponent icon={''} image={""} textColor ="#fff" backgroundColor="#01B58A" disabled={false} buttonSize="Medium" type="contained" onClick={() => {clickHandler(true)}} label={label1} minWidth="220" />
                                <ButtonComponent icon={''} image={""} textColor ="#1B1C1E" backgroundColor="#01B58A" disabled={false} buttonSize="Medium" type="outlined" onClick={() => {clickHandler(false)}} label={label2} minWidth="220" />
                            </div>
                        </div>                        
                    </div>
                </div>                    
            </Modal>
        </div>
    )
}
export default DynamicModalPopup;