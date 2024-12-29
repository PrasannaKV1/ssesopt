export interface sectionFieldsItem {
  fieldName: string
  fieldKey: string
  fieldDefault: boolean
  fieldSelected: boolean
  fieldSequence: number
  fieldValue: string
}

export interface LogoSectionProps {
  sectionFields: sectionFieldsItem[],
  defaultFilterValue?:any,
  templateFontDetails?: any,
  templateJson?: any
}

const LogoSection: React.FC<LogoSectionProps> = ({ sectionFields, defaultFilterValue, templateFontDetails, templateJson }) => {
  const fontFamilyCheck = ((fontFamily:string) => {
    return fontFamily == "Arial" ? "previewFontArial" : fontFamily == "Times New Roman" ? "previewFontTimesNewRoman" : fontFamily == "Verdana" ? "previewFontVerdana" : fontFamily == "Helvetica" ? "previewFontHelvetica" : ""
  })
  return (
    <div className={`LogoSectionBlock LogoSectionBlock_${sectionFields[0].fieldSequence}`}>
      {sectionFields.map((item: sectionFieldsItem, index) =>
        item.fieldSelected === true && item.fieldKey === 'schoolLogo' ? (
          <div className='headerValue logo' key={`headerValue_${index}`} style={item?.fieldSequence===1?{display:"flex",justifyContent:"flex-start"}:item?.fieldSequence===2?{display:"flex",justifyContent:"center"}:{display:"flex",justifyContent:"flex-end"}}>
            {item?.fieldValue && templateJson?.printConfig?.showSchoolLogo === true ? <p dangerouslySetInnerHTML={{ __html: item.fieldValue }} /> :
            <div className="sch_logo_selected_cls">{"School Logo"}</div>}
          </div>
        ) : (
          item.fieldSelected === true && <div ref={(el) => {if (el) {if(item.fieldKey == "schoolName") el.style.setProperty('font-size', templateFontDetails?.headerFontSize?.options[parseInt(defaultFilterValue?.headerFontSize)]?.label+"px", 'important')}}}
          className={`headerValue ${item.fieldKey} ${item.fieldKey == "schoolName" ? fontFamilyCheck(templateFontDetails?.headerFontStyle?.options[parseInt(defaultFilterValue?.headerFontStyle)]?.label): ""}`} key={`headerValue_${index}`}>
            {item.fieldValue}
          </div>
        )
      )}
    </div>
  )
}

export default LogoSection
