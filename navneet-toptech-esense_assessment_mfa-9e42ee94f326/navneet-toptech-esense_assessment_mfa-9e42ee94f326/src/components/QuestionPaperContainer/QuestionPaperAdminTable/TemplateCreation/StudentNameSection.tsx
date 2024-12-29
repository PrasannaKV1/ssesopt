import { useContext } from "react"
import { MessageContext } from "../../QuestionPaperPreviewforPrint/QuestionPaperPreviewforPrint"

export interface sectionFieldsItem {
  fieldName: string
  fieldKey: string
  fieldDefault: false
  fieldSelected: true
  fieldSequence: number
  fieldType: string
}

export interface StudentNameSectionProps {
  templatePrintEdit?:boolean,
  sectionName?:string,
  setAnchorEl?:any,
  setChangedPopoverValue?:any
}

const StudentNameSection: React.FC<StudentNameSectionProps> = ({ templatePrintEdit, setAnchorEl, setChangedPopoverValue, sectionName }) => {
  const getCurrentContext = useContext(MessageContext);
  const getCurrentSection = getCurrentContext?.reqBody.headerDetails.find((section: any) => section.sectionTypeKey == sectionName);
  const subjectSection = getCurrentSection?.sectionDetails?.sectionFields;
  const sectionFieldAsOrdered = subjectSection.sort((a:any, b:any) => a.fieldSequence - b.fieldSequence);

  return (
    <div className={`StudentNameSectionBlock ${templatePrintEdit ? "StudentNameSectionBlockEdit" : ""}`}>
      {sectionFieldAsOrdered.map((item: sectionFieldsItem) => (
        <>
        {!templatePrintEdit ? <div className={`fieldName ${item.fieldKey} ${!item.fieldSelected ? 'hidden' : ''}`} >
          <span className='fieldNameContent'>{item.fieldName}:</span>
          <span className='fieldNameBlank'></span>
        </div> : <div onClick={(event) => {setAnchorEl(event.currentTarget);setChangedPopoverValue({sectionName: sectionName, fieldKey: item.fieldKey, value: item.fieldName})}} className={`headerTextEdit ${!item.fieldSelected ? 'hidden':''}`} dangerouslySetInnerHTML={{__html: item.fieldName}} />}
        </>
      ))}
    </div>
  )
}

export default StudentNameSection
