import React, { FC, useEffect, useState } from 'react'
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
import InputFieldComponent from '../InputFieldComponent/InputFieldComponent';
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import InputFieldComponentForForm from '../FormFieldComponents/InputFieldComponent';
import { alphanumericNameRegex } from '../../../constants/helper';

type Props = {    
    open: boolean,    
    onClose:()=> void,
    duplicateText:(e:string)=> void,
    saveBtnDisable?:boolean
}
const DuplicateEntryPopup: FC<Props> = ({  open,onClose, duplicateText, saveBtnDisable }) => {
    const [saveBtnEnable, setSaveBtnEnable] = useState(saveBtnDisable)
    const methods = useForm();
    const onSubmit = (data:any) => {
        duplicateText(data?.examName)
    }
    useEffect(() => {
        setSaveBtnEnable(saveBtnDisable)
    },[saveBtnDisable])
    return (
        <div>
            <Modal open={open} onClose={onClose}>
                <div className={`${styles.modalPopupContainer} ${styles.duplicateEntryBlk}`}>
                    <div className={styles.modalPopupBgSect}>
                        <CloseIcon className={styles.modalPopupCloseIcon} onClick={onClose} />
                        <div className={styles.modalPopupBgSectCont}>
                            <h2>Enter name of examination</h2>
                            <h4>Enter a different name for the question paper</h4>
                            <FormProvider {...methods}>
                                <form onSubmit={methods.handleSubmit(onSubmit)}>
                                    <div className='w-100 mt-4'>
                                        <InputFieldComponentForForm label={'Name of the Examination'} required={true} onChange={(e:any) => {console.log(e)}} inputSize={'Large'} variant={''} inputType={'text'} registerName={'examName'} regex={alphanumericNameRegex} onChangehandle={(e: any) => {setSaveBtnEnable(false)}}/>
                                    </div>                            
                                    <div className='d-flex mt-3' style={{gap: "20px"}}>     
                                        <ButtonComponent icon={''} image={""} status={ 'submit'} textColor ="#fff" backgroundColor="#01B58A" disabled={saveBtnEnable || methods.getValues("examName")?.trim().length == 0} buttonSize="Large" type="contained" onClick={() => {}} label="Save" minWidth="208" />
                                        <ButtonComponent icon={''} image={""} textColor ="#1B1C1E" backgroundColor="#9A9A9A" disabled={false} buttonSize="Large" type="outlined" onClick={() => {onClose()}} label="Cancel" minWidth="208" />
                                    </div>
                                </form>
                            </FormProvider>
                        </div>                        
                    </div>
                </div>                    
            </Modal>
        </div>
    )
}
export default DuplicateEntryPopup;