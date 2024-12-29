import React, { FC, Fragment, useEffect, useRef, useState } from 'react'
import {
  Card,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Typography,
  Button,
  Box,
} from '@material-ui/core'
import { useForm, FormProvider } from 'react-hook-form'
import './QuestionPaperFontDetails.css'
// import { getTemplateFontDefault, getTemplateTypes, institutesByCourseIds, tagTemplate } from '../../../../api/tagTemplates'
import ButtonComponent from '../../SharedComponents/ButtonComponent/ButtonComponent'
import SelectBoxComponent from '../../SharedComponents/SelectBoxComponent/SelectBoxComponent'
import QuestionPaperTemplate from './TemplatePreview/QuestionPaperTemplate';
import { useNavigate } from 'react-router-dom'
import { fontDeatailsDropdown } from '../../../Api/QuestionPaper'

type props = {
  successJson?: any,
  setBodyTemplate?: any,
  isEdit? :number,
  previewMode?:string,
  initialFormDefault?:any,
  enableSubmitHandler?:(e:any)=>void,
  applyBtnApprovedStatus?:any,
  setStepCPreviewBodyCopy?:any,
  resetHandleStatus?:boolean,
  onlineAssessmentData?: any,
  viewAnswer?: boolean,
}
const QuestionPaperFontDetails: React.FC<props> = ({ enableSubmitHandler, successJson, setBodyTemplate, isEdit, previewMode, initialFormDefault, applyBtnApprovedStatus, setStepCPreviewBodyCopy, resetHandleStatus, onlineAssessmentData, viewAnswer }) => {
  let shouldLog = useRef(true)
  const [reqBodyJson, setReqBodyJson] = React.useState<any>();
  const [templateFontDetails, setTemplateFontDetails] = React.useState<any>();
  const [initialDefault, setInitialDefault] = React.useState<any>(initialFormDefault)
  const [confirmStyle,setConfirmStyle]=React.useState<any>(initialFormDefault)
  const [resetValue, setResetValue] = React.useState<any>(initialFormDefault)
  const [enableRest,setEnableRest]=React.useState<boolean>(false)
  const [applyBtnStatus,setApplyBtnStatus]=React.useState<boolean>(false)
  const [applyBtnConfirm, setApplyBtnConfirm] = useState(false)
  const [alignmentState, setAlignmentState] = useState<any>({
    partAlignment: "",
    sectionAlignment: ""
  });
  const languageSupportedDropdowns = ['mainQuestionOrder', 'questionOrder']
  const history = useNavigate()
  const handleGoBack = () => {
    history(-1)
  }
  const methods = useForm<any>({
    defaultValues: [],
    mode: 'onBlur',
    reValidateMode: 'onChange',
  })

  const onSubmit = async (data: any, status: string) => {
    // const payload = { ...data }
    // const response = await institutesByCourseIds(selSubject.join(','))
    // let instituteIds = []
    // if (response?.data?.length > 0) {
    //   instituteIds = response?.data?.map((x: any) => x?.instituteId)
    // }
    // payload['categoryID'] = 1
    // payload['instituteIDs'] = instituteIds
    // payload['courseIDs'] = selSubject
    // payload['marks'] = Number(payload['marks'])
    // payload['timeInMinutes'] = Number(payload['timeInMinutes'])

    // const templateDetails = await tagTemplate(payload)
    // history('/template-management')
  }
  const getDefaultValue = (data: any) => {
    if (typeof data == 'object') {
      const defaultValue = data?.default ?? ''
      const value = data?.options?.findIndex((option: any) => option?.id == defaultValue)
      return value !== -1 ? data?.options[value]?.id?.toString() : ''
    } else {
      return ""
    }
  }

  function sortArrayOfObjects(objects:any, field:any) {
    if (objects?.length) {
      return objects?.sort((a:any, b:any) => {
        if (a[field] < b[field]) {
          return -1
        } else if (a[field] > b[field]) {
          return 1
        }
        return 0
      })
    }
  }

  const fontDetailHandler = (e: any, type:string) => {
      setInitialDefault({ ...initialDefault, [type]: String(e) })
      setApplyBtnStatus(true)
      setApplyBtnConfirm(false)
  }

  useEffect(() => {
    if(applyBtnStatus && previewMode !== "templateMode")applyHandler(reqBodyJson,"applybtn")
  },[initialDefault])

  const getLanguageData = (array: any, language: string) => {
    if (array?.length > 0) {
      const index = array.findIndex((options: any) => options.lang === language)
      return index !== -1 ? array[index]?.options : []
    } else {
      return []
    }
  }

  useEffect(() => {
    if (templateFontDetails && successJson) { 
      let dataModel:any = {}
      const templateParts = successJson?.bodyTemplate?.templateBuilderInfo?.questionPaperFontMetaData;
      {templateParts && 
      Object.keys(templateParts).forEach(function (key, value) {
        dataModel[key] = templateParts?.[key] ? templateParts?.[key] : String(templateFontDetails?.[key]?.default)
      })
      }
      // console.log(dataModel1)
      // const dataModel = {
      //   instructionsFont:templateParts?.instructionsFont || String(templateFontDetails?.instructionsFont?.default),
      //   instructionsLanguage: templateParts?.instructionsLanguage || String(templateFontDetails?.instructionsLanguage?.default),
      //   mainQuestionFontSize:templateParts?.mainQuestionFontSize || String(templateFontDetails?.mainQuestionFontSize?.default),
      //   marksFormat:templateParts?.marksFormat || String(templateFontDetails?.marksFormat?.default),
      //   partFontSize:templateParts?.partFontSize || String(templateFontDetails?.partFontSize?.default),
      //   questionFontSize:templateParts?.questionFontSize || String(templateFontDetails?.questionFontSize?.default),
      //   questionPaperFont:templateParts?.questionPaperFont || String(templateFontDetails?.questionPaperFont?.default),
      //   questionPaperLanguage:templateParts?.questionPaperLanguage || String(templateFontDetails?.questionPaperLanguage?.default),
      //   sectionFontSize:templateParts?.sectionFontSize || String(templateFontDetails?.sectionFontSize?.default),
      //   subQuestionFontSize:templateParts?.subQuestionFontSize || String(templateFontDetails?.subQuestionFontSize?.default)
      // }
      if(previewMode != "customStyle")setInitialDefault(dataModel)
      setConfirmStyle(dataModel)
      if(previewMode != "customStyle")setResetValue(dataModel)
    }
  }, [templateFontDetails,successJson])

  const applyHandler = (bodyObject: any,src:string|null) => {
    let initialJsonObj = JSON.parse(JSON.stringify(bodyObject))
    if(initialJsonObj?.bodyTemplate?.templateBuilderInfo?.questionPaperFontMetaData){
      initialJsonObj.bodyTemplate.templateBuilderInfo.questionPaperFontMetaData = initialDefault
      setReqBodyJson({...initialJsonObj})
      setBodyTemplate(initialJsonObj)
      if(src == null && previewMode !== "templateMode")setStepCPreviewBodyCopy(initialJsonObj)
    }
  }

  const resetHandler = () => {
    let initialJsonObj = JSON.parse(JSON.stringify(reqBodyJson))
    if(initialJsonObj?.bodyTemplate?.templateBuilderInfo?.questionPaperFontMetaData){
      initialJsonObj.bodyTemplate.templateBuilderInfo.questionPaperFontMetaData = resetValue
      setReqBodyJson({...initialJsonObj})
      setInitialDefault({...resetValue})
      setBodyTemplate(initialJsonObj)
    } 
    //setConfirmStyle({...resetValue})
    setEnableRest(false)
    applyBtnApprovedStatus(false)
  }

  useEffect(() => {
      setReqBodyJson(successJson)
  }, [successJson])

  useEffect(() => {
    if(successJson) applyHandler(successJson,null)
  },[successJson, resetValue])

  const fontDetailsSelectValue = async () => {
    const response = await fontDeatailsDropdown()
    let filterConfigrationRes:any = {}
    if (response?.result?.responseCode == 0) {
      if(Object.keys(response?.data).length > 0 && previewMode != "customStyle"){
        Object.keys(response?.data).filter((e: any) => {
          if(response?.data[e].isVisiableInPaperGen==true ){
            filterConfigrationRes[e] = response?.data[e]
          }
        })
    }
    //if(previewMode = "customStyle") delete response.data["englishTextFont"]
    setTemplateFontDetails(previewMode != "customStyle" ? filterConfigrationRes : response?.data)
    }
  }
  useEffect(() => {   
    if (shouldLog.current) {
      shouldLog.current = false
      fontDetailsSelectValue()
    }
  }, [])
  let btnApplyGenerateEnable=(JSON.stringify(initialDefault)=== JSON.stringify(confirmStyle))
  useEffect(()=>{
    enableSubmitHandler && enableSubmitHandler(btnApplyGenerateEnable ? btnApplyGenerateEnable : applyBtnConfirm)
  },[btnApplyGenerateEnable,applyBtnConfirm])

  useEffect(() => {
    if(resetHandleStatus) resetHandler()
  },[resetHandleStatus])
  return (
    <Fragment>
      <FormProvider {...methods}>
        <form className={`w-100 ${previewMode == 'templateMode' ? "previewMode" : ""}`} onSubmit={methods.handleSubmit((data: any) => onSubmit(data, ''))}>
          <Card className="border-0 px-0 shadow-none">
            <div className='d-flex'>
              <div className='w-100'>
                <Box className="qsnmodelSelectField d-flex mt-4" style={{ gap: "20px" }}>
                  <div className='qsnPaperModel w-100' >
                    <div className='qsnPaperModelChild'>
                      <div className='qsnPaperModelChildScroll'>
                        <QuestionPaperTemplate ReqBody={reqBodyJson} templateFontDetails={templateFontDetails} previewMode={previewMode} onlineAssessmentData={onlineAssessmentData} viewAnswer={viewAnswer} />
                        <div className='fontPreviewFooter'>
                          <h4 className='fontPreviewFooterContent' style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: "600px" }}>Font Preview</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                  {previewMode != "templateMode" && 
                    <Box className="SelectFields" style={{ width: "221px", display: "flex", flexDirection: "column", gridGap: '24px', marginLeft: '27px' }}>
                      {sortArrayOfObjects(Object?.values(templateFontDetails||{}), 'sequence')?.map((dropdownDatas: any, index:number)=>{
                        let instructionsFont: any
                        const b = Object.entries(templateFontDetails)
                        instructionsFont = b.find((x:any)=> x[1].label===dropdownDatas?.label)
                        return (previewMode == "customStyle") ? (instructionsFont[0] != "englishTextFont") ? <SelectBoxComponent variant={"fill"} selectedValue={initialDefault[instructionsFont[0]]} clickHandler={(e: any) => fontDetailHandler(e, instructionsFont[0])} selectLabel={dropdownDatas?.label} selectList={languageSupportedDropdowns.includes(instructionsFont[0]) ? getLanguageData(dropdownDatas?.options, 'English') : dropdownDatas?.options || []} mandatory={dropdownDatas?.required} module="questionFont" /> : "" : <SelectBoxComponent variant={"fill"} selectedValue={initialDefault[instructionsFont[0]]} clickHandler={(e: any) => fontDetailHandler(e, instructionsFont[0])} selectLabel={dropdownDatas?.label} selectList={languageSupportedDropdowns.includes(instructionsFont[0]) ? getLanguageData(dropdownDatas?.options, 'English') : dropdownDatas?.options || []} mandatory={dropdownDatas?.required} module="questionFont" />
                      })}
                      <ButtonComponent type={"outlined"} label={"Apply"} textColor={"#1B1C1E"} buttonSize={"Large"} minWidth={"221"} backgroundColor={"#385DDF"} onClick={()=>{setApplyBtnStatus(false);applyBtnApprovedStatus(true);setApplyBtnConfirm(true)}} disabled={btnApplyGenerateEnable || applyBtnConfirm}/>
                      <ButtonComponent type={"outlined"} label={"Reset"} textColor={"#1B1C1E"} buttonSize={"Large"} minWidth={"221"} backgroundColor={"#385DDF"} onClick={resetHandler} disabled={(!btnApplyGenerateEnable||enableRest)?false:true}/>
                    </Box>
                    }
                </Box>
              </div>
            </div>
          </Card>

        </form>
      </FormProvider>
    </Fragment>
  )
}

export { QuestionPaperFontDetails }
