import { FormProvider, useForm } from 'react-hook-form'
import InputFieldComponentForForm from '../../../SharedComponents/FormFieldComponents/InputFieldComponent'
import { useContext } from 'react'
import { MIFMessageContext } from '../../MIFQuestionPaperPreviewforPrint/MIFQuestionPaperPreviewforPrint'

export interface sectionFieldsItem {
  fieldName: string
  fieldKey: string
  fieldType: string
  fieldValidation: string
  fieldDefault: boolean
  fieldSelected: boolean
  fieldSequence: number
  fieldValue: string
  fieldMaxLength: number
}

export interface ExamNameSectionProps {
  sectionFields: sectionFieldsItem[],
  templatePrintEdit?:boolean,
  sectionName?:string,
  setAnchorEl?:any,
  setChangedPopoverValue?:any
}

const ExamNameSection: React.FC<ExamNameSectionProps> = ({sectionFields,templatePrintEdit,setAnchorEl,setChangedPopoverValue,sectionName}) => {
  // const examNameObj = sectionFields.find((item) => item.fieldKey === 'examName')
  const getCurrentContext = useContext(MIFMessageContext);
  const getCurrentSection = getCurrentContext?.reqBody.headerDetails.find((section: any) => section.sectionTypeKey == sectionName);
  const subjectSection = getCurrentSection?.sectionDetails?.sectionFields;
  const examNameObj = subjectSection.find((item:any) => item.fieldKey === 'examName')
  return (
    <div className={`ExamNameSectionBlock ExamNameSectionBlock_${examNameObj?.fieldSequence}`}>
      {examNameObj && (
        <>
        {!templatePrintEdit ? 
        <>
          {/* <input
            type={examNameObj?.fieldType}
            maxLength={examNameObj?.fieldMaxLength}
            value={examNameObj.fieldValue}
            className='ExamNameSectionTextBox'
          /> */}        
          <InputFieldComponentForForm
            maxLength={examNameObj?.fieldMaxLength}
            label={examNameObj.fieldName}
            required={false}
            onChange={() => {}}
            inputSize={'Large'}
            variant={''}
            inputType={examNameObj?.fieldType}
            registerName={"examName"}
            regex={/^[ A-Za-z0-9]*$/}
          />
          </>
          : <div onClick={(event) => {setAnchorEl(event.currentTarget);setChangedPopoverValue({sectionName: sectionName, fieldKey: examNameObj.fieldKey, value: examNameObj.fieldValue})}} className='headerTextEdit examPrintSection' dangerouslySetInnerHTML={{__html: examNameObj.fieldValue}} />}
        </>        
      )}
    </div>
  )
}

export default ExamNameSection
