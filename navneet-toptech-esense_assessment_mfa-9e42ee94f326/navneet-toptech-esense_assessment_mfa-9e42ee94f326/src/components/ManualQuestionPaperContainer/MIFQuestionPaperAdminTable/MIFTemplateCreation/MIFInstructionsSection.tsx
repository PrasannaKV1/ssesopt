import { useFormContext, Controller, FormProvider, useForm } from "react-hook-form"
import React, { useEffect, useState } from 'react';
import TextEditorForForm from "../../../SharedComponents/FormFieldComponents/TextEditor";
import InstructionRTE from "../../../SharedComponents/QuillToolbarPopover/InstructionRTE";

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

export interface InstructionsSectionProps {
  sectionFields: sectionFieldsItem[],
  templatePrintEdit?:boolean,
  sectionName?:string,
  setChangedPopoverValue?:any,
  templateHeaderGlobal?:any,
  Handlers?:any,
  key?:number
}

const InstructionsSection: React.FC<InstructionsSectionProps> = ({sectionFields,templatePrintEdit,sectionName,setChangedPopoverValue,templateHeaderGlobal,Handlers,key}) => {
  const instructionsObj = sectionFields.find((item) => item.fieldKey === 'instructions');
  const [textAreaOnchange, setTextAreaOnchange] = useState()
  const { unregister, register, setValue, control, getValues } = useForm();
  let isChanging:string = templateHeaderGlobal.filter((x:any)=> x?.sectionTypeKey =="instructionsSection")?.[0]?.['sectionDetails']?.['sectionFields'][0]?.['fieldValue']
  useEffect(() => {
    if(textAreaOnchange){
      let textAreaOnchangeReplace = JSON.parse(JSON.stringify(textAreaOnchange))
      if(textAreaOnchangeReplace){
        setChangedPopoverValue({sectionName: sectionName, fieldKey: "instructions", value: textAreaOnchangeReplace})       
      }
      if(String(isChanging)?.replace(/<\/?[^>]+(>|$)/g, '').replace(/\s/g, '') != String(textAreaOnchange)?.replace(/<\/?[^>]+(>|$)/g, '').replace(/\s/g, '')){
        Handlers && Handlers('actions', null,textAreaOnchangeReplace)
        Handlers && Handlers('undo',false)
        Handlers && Handlers('redo',true)
      }
    }
    
  },[textAreaOnchange])

  return (
    <div className={`InstructionsSectionBlock`}>      
      {instructionsObj && (
        <>
        {!templatePrintEdit ? 
          <>
          <span>{instructionsObj?.fieldName}:</span>{' '}
          <textarea
            tabIndex={-1}
            {...register('instructions')}
            maxLength={instructionsObj?.fieldMaxLength || 600}
            // value={methods.getValue("instructions")}
            className='form-control form-control-lg form-control-solid InstructionsSectionTextBox'
            // name='topicDescription'
            autoComplete='off'
            rows={4}
            cols={50}
            placeholder='Add Instructions'

            // onChange={(e)=>methods.setValue("instructions",e.target.value)}

          />
          </>
          : <div className={`${templatePrintEdit ? "instructionsSect w-100" : ""}`}>
            {/* <TextEditorForForm registerName={`instructions`} textEditorSize='Medium' mandatory={true} addNewToggler={true} placeholder={"Start typing instructions..."} setTextAreaOnchange={setTextAreaOnchange} characterLimit={600} Handlers={Handlers} restrictImage={true} fieldsRequired={["language","common","attachment","formula"]} key={key}/> */}
            <InstructionRTE registerName={'instructions'} setTextAreaOnchange={setTextAreaOnchange} characterLimit={4000} handlers={Handlers} placeHolder={"Start typing instructions..."} fieldsRequired={["language","common","attachment","formula"]} key={key}/>
            </div>}
        </>
      )}
    </div>
  )
}

export default React.memo(InstructionsSection)
