import React, {useEffect, useContext, useState} from 'react'
import InputFieldComponentForForm from '../../../SharedComponents/FormFieldComponents/InputFieldComponent'
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

export interface SubjectSectionProps {
  sectionFields: sectionFieldsItem[]
  subjects?: any
  selSubject?: any,
  templatePrintEdit?:boolean,
  setAnchorEl?:any,
  setChangedPopoverValue?:any,
  sectionName?:string
}

const SubjectSection: React.FC<SubjectSectionProps> = ({sectionFields, subjects, selSubject,templatePrintEdit,setAnchorEl,setChangedPopoverValue,sectionName}) => {
  
  const getCurrentContext = useContext(MIFMessageContext);
  const getCurrentSection = getCurrentContext?.reqBody.headerDetails.find((section: any) => section.sectionTypeKey == sectionName);
  const subjectSection = getCurrentSection?.sectionDetails?.sectionFields.filter((i:any)=>i.fieldKey !== "timeToDisplay");
  const sectionFieldAsOrdered = subjectSection.sort((a:any, b:any) => a.fieldSequence - b.fieldSequence);

  return (
    <div className={`SubjectSectionBlock SubjectSectionBlock${sectionFieldAsOrdered[0].fieldSequence}`}>
      {sectionFieldAsOrdered.map((item: sectionFieldsItem) =>
        item.fieldKey === 'subject' ? (
          item.fieldSelected && (
            <>
            {!templatePrintEdit ?
              <InputFieldComponentForForm
                className={`${!item.fieldSelected ? 'hidden subjectInputBox' : 'subjectInputBox'}`}
                maxLength={item?.fieldMaxLength}
                label={item.fieldName}
                required={false}
                onChange={() => {}}
                inputSize={'Large'}
                variant={''}
                inputType={'text'}
                maxLimit={999}
                registerName={'subjectList'}
              />
            : <div className='headerTextEdit' onClick={(event) => {setAnchorEl(event.currentTarget);setChangedPopoverValue({sectionName: sectionName, fieldKey: item.fieldKey, value: item.fieldValue})}}><span dangerouslySetInnerHTML={{__html: item.fieldValue}} /></div>}
            </>
          )
        ): (
          <>
          {!templatePrintEdit ?
          <div className='fieldItem'>
            <InputFieldComponentForForm
              className={`${!item.fieldSelected ? 'hidden' : ''}`}
              maxLength={item?.fieldMaxLength}
              label={item.fieldName}
              required={false}
              onChange={() => {}}
              inputSize={'Large'}
              variant={''}
              inputType={'number'}
              maxLimit={999}
              registerName={
                item?.fieldKey === 'totalTime'
                  ? 'timeInMinutes'
                  : item?.fieldKey === 'totalMarks'
                  ? 'marks'
                  : ''
              }
              disabled={item?.fieldKey === 'totalTime' || item?.fieldKey === 'totalMarks'}
              regex={/^-?\d+\.?\d*$/}
            />
          </div>
          :
          <div className={`headerTextEdit d-flex ${!item.fieldSelected ? 'hidden':''}`} onClick={(event) => {if(item?.fieldKey == 'totalMarks') {setAnchorEl(event.currentTarget);setChangedPopoverValue({sectionName: sectionName, fieldKey: item.fieldKey, value: item.fieldName})} else{event.stopPropagation()}}}>
          <span dangerouslySetInnerHTML={{__html: item.fieldName}} onClick={(event) => {if(item?.fieldKey === 'totalTime') {setAnchorEl(event.currentTarget);setChangedPopoverValue({sectionName: sectionName, fieldKey: item.fieldKey, value: item.fieldName, key:'timeLabel'})}}}/>{":"}
          <span className={`${item?.fieldKey == "totalTime" ? "headerTextTimeBlk" : ""}`} dangerouslySetInnerHTML={{__html: item.fieldValue}} onClick={(event) => {if(item?.fieldKey === 'totalTime') {setAnchorEl(event.currentTarget);setChangedPopoverValue({sectionName: sectionName, fieldKey: item.fieldKey, value: item.fieldValue, key:'time'})}}}/></div>}
          </>
        )
      )}
    </div>
  )
}

export default SubjectSection
