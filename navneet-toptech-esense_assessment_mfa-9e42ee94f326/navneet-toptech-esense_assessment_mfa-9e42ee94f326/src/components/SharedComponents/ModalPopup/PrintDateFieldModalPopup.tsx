import React, { FC, useEffect, useState } from 'react'
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import TextEditorForForm from '../FormFieldComponents/TextEditor';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import ButtonComponent from '../../SharedComponents/ButtonComponent/ButtonComponent';
import styles from './ModalPopup.module.css';
import { DonePutApi, dataPostAPI } from '../../../Api/QuestionTypePaper';
import "../../QuestionPaperContainer/QuestionPaperPreviewforPrint/QuestionPaperPreviewforPrint.css"
import Spinner from '../Spinner';
type Props = {    
    open: boolean,    
    onClose:()=> void,
    questionPaperId:number,
    previewData:any,
    openPrintwindow:()=>void,
    errorMsg:()=>void,
    printedData: any,
    setId?: number,
    getVersions?:any
}
const PrintDateFieldModalPopup: FC<Props> = ({ openPrintwindow,open,errorMsg,onClose,questionPaperId ,previewData, printedData,setId,getVersions}) => {
    const [initialValues, setInitialValues] = useState({
        "printDate":"",
        "time": previewData?.generatedQuestionPaper?.headerDetails?.find((section:any) => section?.sectionTypeKey === "subjectSection")?.sectionDetails?.sectionFields?.find((secItem:any) => secItem?.fieldKey === "totalTime")?.fieldValue  || ""
    })
    const totalTimeData = previewData?.generatedQuestionPaper?.headerDetails?.find((section:any) => section?.sectionTypeKey === "subjectSection")?.sectionDetails?.sectionFields?.find((secItem:any) => secItem?.fieldKey === "totalTime"); 
    const [spinnerStatus, setSpinnerStatus] = useState(false);
    const methods = useForm<any>({
        defaultValues: initialValues,
        mode: "onBlur",
        reValidateMode: "onChange"
    });
    const handleSubmit = async() => {
        if(printedData) printedData(methods.getValues("printDate"))
        if(questionPaperId && previewData){
            let headerPart = previewData;
            headerPart["statusID"] =2;
            headerPart["isEdit"]=false;
            headerPart?.generatedQuestionPaper?.headerDetails?.map((section:any)=>{
                if(section?.sectionTypeKey === "dateSection"){
                    section?.sectionDetails?.sectionFields?.map((secItem:any)=>{
                        if(secItem?.fieldKey === "date"){
                            secItem.fieldValue =methods.getValues("printDate")
                        }
                        return;
                    }
                    )
                }
            })
            headerPart?.generatedQuestionPaper?.headerDetails?.map((section:any)=>{
                if (section?.sectionTypeKey === "subjectSection") {
                    const sectionFields = section?.sectionDetails?.sectionFields;
                    const timeToDisplayFieldIndex = sectionFields.findIndex((secItem: any) => secItem?.fieldKey === "timeToDisplay");
            
                    if (timeToDisplayFieldIndex !== -1) {
                        sectionFields[timeToDisplayFieldIndex].fieldValue = methods.getValues("time");
                        sectionFields[timeToDisplayFieldIndex].fieldSelected = totalTimeData?.fieldSelected;
                        sectionFields[timeToDisplayFieldIndex].fieldSequence = totalTimeData?.fieldSequence;
                    } else {
                        sectionFields.push({
                            fieldKey: "timeToDisplay",
                            fieldName: "Total Time",
                            fieldValue: methods.getValues("time"),
                            fieldDefault: false,
                            fieldSelected: totalTimeData?.fieldSelected,
                            fieldSequence: totalTimeData?.fieldSequence,
                            fieldType: null,
                            fieldMaxLength: 0,
                            fieldValidation: null
                        });
                    }
                }
            })
            let res;
            if(questionPaperId && setId){
                res = await dataPostAPI({'QpId':Number(questionPaperId),'QpSetId':Number(setId)},{"date": String(methods.getValues("printDate")),"isEdit":false})
            }else{
                headerPart.isEdit =false
                res = await DonePutApi(questionPaperId,headerPart);
            }
        if (res?.result?.responseCode == 0 || res?.result?.responseDescription === "Success") {
            onClose()
            openPrintwindow()
        }
        else{
            printedData('')
            onClose()
            errorMsg()
        }
        if(getVersions){
            await getVersions()
        }
        setSpinnerStatus(false);
    }
    }

    return (
        <div>
            <Modal open={open} onClose={onClose}>
                <div>
                <FormProvider {...methods} >
                    <div className={`${styles.modalPopupContainer} ${styles.duplicateEntryBlk}`}>
                    <div className={`${styles.modalPopupBgSect} printDateFieldPopupSect`}>
                        <CloseIcon className={styles.modalPopupCloseIcon} onClick={onClose} />
                        <div className={styles.modalPopupBgSectCont} style={{width:"500px"}}>
                            {totalTimeData?.fieldSelected &&
                            <>
                                <h2>Enter Time</h2>
                                <h4>Enter the Time that should appear on the question paper</h4>
                                <div className='w-100'>
                                    <TextEditorForForm registerName={"time"} textEditorSize='textHeightSmall' mandatory={true} fieldsRequired={["language","biu"]} placeholder={"Start typing..."} restrictImage={true} eqEditor={false} maxLength={10} />
                                </div>         
                                <hr className="solid"></hr>
                            </>
                            }
                            <h2>Enter Date</h2>
                            <h4>Enter the date that should appear on the question paper</h4>
                            <div className='w-100'>
                                <TextEditorForForm registerName={"printDate"} textEditorSize='textHeightSmall' mandatory={true} fieldsRequired={["language","biu"]} placeholder={"Start typing..."} restrictImage={true} eqEditor={false} />
                            </div>  
                            <div className='d-flex mt-3' style={{gap: "20px"}}>     
                                        <ButtonComponent icon={''} image={""} status={ 'submit'} textColor ="#fff" backgroundColor="#01B58A" disabled={false} buttonSize="Large" type="contained" onClick={() => {handleSubmit()}} label="Print" minWidth="208" />
                                        <ButtonComponent icon={''} image={""} textColor ="#1B1C1E" backgroundColor="#9A9A9A" disabled={false} buttonSize="Large" type="outlined" onClick={() => {onClose()}} label="Cancel" minWidth="208" />
                                    </div>
                        </div>  
                    </div>                      
                    </div>
                </FormProvider>
                </div>                    
            </Modal>
            {spinnerStatus && <Spinner />}
        </div>
    )
}
export default PrintDateFieldModalPopup;