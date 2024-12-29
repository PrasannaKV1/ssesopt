import React, { useEffect, useState } from 'react';
import "./MIFQuestionPaperTemplate.css";
import schoolLogo from '../../../../assets/images/schoolLogo.svg';
import MIFRecussivePaperGenerator from './MIFRecussivePaperGenerator';
import TemplateCreation from '../../MIFQuestionPaperAdminTable/MIFTemplateCreation/MIFTemplateCreation';
import {useLocation} from 'react-router-dom'
import { baseFilterApi } from '../../../../Api/AssessmentTypes';
import { getLocalStorageDataBasedOnKey } from "../../../../constants/helper";
import { State } from "../../../../types/assessment";
import { FormProvider, useForm } from 'react-hook-form';
import Toaster from '../../../SharedComponents/Toaster/Toaster';
import { AlertColor } from '@mui/material';
type props = {
    ReqBody: any,
    templateFontDetails?:any,
    replace?:any,
    replaceQp?:any,
    previewMode?:string,
    templatePrintEdit?:boolean,
    setAnchorEl?:any,
    templateJson?:any,
    changedPopoverValue?:any,
    setChangedPopoverValue?:(changedPopoverValue:any)=>void,
    triggerReqBody?:boolean,
    dragPositionHeader?:any,
    setStateFunction?:(key: string, state: any, redo?:any,isDraggable?:boolean) => void,
    previewDate?: any;
    markerrorQnsIds?:any;
    key?:any,
    printWithAnswer?:boolean,
    printConfig?:any,
    isPrint?:boolean,
    viewAnswer?:boolean,
    typeOfLine?:string,
    workbookStyle?:boolean,
    setIsWorksheetEdit?:any
}
interface sectionFields {
  sectionFields: any[]
}
interface TemplateList {
  sectionTypeKey: string
  sectionSequence: number
  sectionDetails: sectionFields,  
}
    
  const MIFQuestionPaperTemplate: React.FC<props> = ({ReqBody, templateFontDetails,replace,replaceQp,previewMode, templatePrintEdit, setAnchorEl, changedPopoverValue, setChangedPopoverValue, templateJson,triggerReqBody,dragPositionHeader,setStateFunction,previewDate,key,printWithAnswer,printConfig, isPrint=false, viewAnswer= false, typeOfLine, workbookStyle, setIsWorksheetEdit}) => {
    const location: any = useLocation();  
    const [initialValue, setInitialValue] = useState({})
    const [templateHeaderGlobal, setTemplateHeaderGlobal] = useState<TemplateList[]>()
    const [selSubject, setSelSubject] = React.useState<any>([])
    const [subjects, setSubjects] = useState<any[]>([])
    const [isCopy, setIsCopy] = useState<boolean>(location?.state?.isCopy);
    const [headerDateDetails, setHeaderDateDetails] = useState<any>([])
    const stateDetails = JSON.parse(getLocalStorageDataBasedOnKey('state') as string) as State;
    const [snackBar, setSnackBar] = useState<boolean>(false);
    const [snackBarText, setSnackBarText] = useState<string>("");
    const [SnackBarSeverity, setSnackBarSeverity] = useState<AlertColor>("success");
    const methods = useForm<any>({
      defaultValues: [],
      mode: 'onBlur',
      reValidateMode: 'onChange',
    })    
    const subjectApiCall = async (resData:any) => {
      const response = await baseFilterApi("subjects", { "gradeId": resData?.gradeID, "publicationId": 0, "staffId": stateDetails.login.userData.userRefId })
      setSubjects(response?.data)   
      setSelSubject(resData?.courses) 
    }
   useEffect(() => {
      if(templatePrintEdit && templateJson){
        subjectApiCall(templateJson)
      }      
    },[templatePrintEdit,templateJson])
    useEffect(() => {
      templateHeaderGlobal?.map((headerData:any) => {
        if(headerData.sectionTypeKey == "dateSection") {
          setHeaderDateDetails(headerData)
        }
      })
      if(ReqBody){
        setTemplateHeaderGlobal(ReqBody?.headerDetails)
        setDefaultFilterValue(previewMode == "customStyle" ? checkFilterOptionValue(ReqBody?.bodyTemplate?.templateBuilderInfo?.questionPaperFontMetaData) : ReqBody?.bodyTemplate?.templateBuilderInfo?.questionPaperFontMetaData)
      }
    },[ReqBody])

    useEffect(() => {
      if(templateHeaderGlobal){
        let currentTemplate = JSON.parse(JSON.stringify(ReqBody));
        currentTemplate.headerDetails = templateHeaderGlobal;
        dragPositionHeader && dragPositionHeader(currentTemplate)
      }      
    },[templateHeaderGlobal])

    const checkFilterOptionValue = ((ReQData:any) => {
      let modificationFilter = ReQData;
      let defaultCheckFields:any = 
      {
          "headerFontStyle": "0",
          "headerFontSize": "14",
          "testNameFontStyle": "0",
          "testNameFontSize": "6",
          "englishTextFont": "0",
          "partTextFontStyle": "0",
          "partFontSize": "14",
          "sectionFontStyle": "0",
          "sectionFontSize": "14",
          "mainQuestionFontStyle": "0",
          "mainQuestionFontSize": "14",
          "questionFontStyle": "0",
          "questionFontSize": "8",
          "subQuestionFontStyle": "0",
          "subQuestionFontSize": "8",
          "marksFormat": "0",
          "marksFontSize": "8"
      }
      if(modificationFilter != undefined){
        Object.keys(defaultCheckFields).filter((e: any) => {
          if (!(e in modificationFilter)) modificationFilter[e] = defaultCheckFields[e]
        })
      }    
      return modificationFilter
    })
    const [defaultFilterValue, setDefaultFilterValue] = useState<any>()

    const fontFamilyCheck = ((fontFamily:string) => {
      return fontFamily == "Arial" ? "previewFontArial" : fontFamily == "Times New Roman" ? "previewFontTimesNewRoman" : fontFamily == "Verdana" ? "previewFontVerdana" : fontFamily == "Helvetica" ? "previewFontHelvetica" : ""
    })

    const createHeaderComponent = (headerData:any) => {   
      
    return sortArrayOfObjects(headerData?.sectionDetails?.sectionFields, 'fieldSequence')?.map(
      (headerDataFields:any, index:number) => {
        if (headerData?.sectionTypeKey == 'logoSection' && printConfig != undefined) {
          return (
            <>
              {(headerDataFields?.fieldKey == 'schoolLogo' &&  headerDataFields?.fieldSelected && printConfig.showSchoolLogo) && (
                <div
                  className={
                    headerDataFields?.fieldSequence == 2
                      ? 'logo-center'
                      : headerDataFields?.fieldSequence == 1
                      ? 'logo-start'
                      : 'logo-end'
                  }
                >
                  {headerDataFields?.fieldValue ? (
                    <>
                    {headerDataFields?.fieldValue ? <p className='headerLogoImg' dangerouslySetInnerHTML={{ __html: headerDataFields?.fieldValue}} /> :
                    <img
                      width={62}
                      className='imgLogo'
                      alt={headerDataFields?.fieldName}
                      src={schoolLogo}
                    />}
                  </>) : (
                    <div className='defaultLogo'>School Logo</div>
                  )}
                </div>
              )}
              {(headerDataFields?.fieldKey == 'schoolName' &&  headerDataFields?.fieldSelected )&& (
                <div
                  className={'text-center'}
                >
                  <h1 ref={(el) => {if (el) {el.style.setProperty('font-size', templateFontDetails?.headerFontSize?.options[parseInt(defaultFilterValue?.headerFontSize)]?.label+"px", 'important');}}}
                      className={`${fontFamilyCheck(templateFontDetails?.headerFontStyle?.options[parseInt(defaultFilterValue?.headerFontStyle)]?.label)}`}>
                    {headerDataFields?.fieldValue ? headerDataFields?.fieldValue : 'School Name'}
                  </h1>
                </div>
              )}
              {(headerDataFields?.fieldKey == 'affiliation' &&  headerDataFields?.fieldSelected) && (
                <>
                <div
                  className={'text-center'}
                >
                  <h2>
                    {headerDataFields?.fieldValue ? headerDataFields?.fieldValue : 'Affiliation'}
                  </h2>
                </div>   
                </>
              )}        
              {(((headerData?.sectionDetails?.sectionFields.length - 1) == index) && headerDateDetails?.sectionDetails?.sectionFields[0]?.fieldValue?.length > 0 ) && <>
                  <div className='dateSectionText' dangerouslySetInnerHTML={{
                    __html: previewDate.length > 0 ? previewDate : headerDateDetails?.sectionDetails?.sectionFields[0]?.fieldValue,
                  }} />
                </>
                }                 
            </>
          )
        } else if (
          headerData?.sectionTypeKey == 'examNameSection' &&
          headerDataFields?.fieldSelected
        ) {
          return (
            <>
              {headerDataFields?.fieldKey == 'examName' && (
                <div
                  className={
                    headerDataFields?.fieldSequence == 2
                      ? 'text-center'
                      : headerDataFields?.fieldSequence == 1
                      ? 'text-start'
                      : 'text-end'
                  }
                >
              <h1 ref={(el) => {if (el) {el.style.setProperty('font-size', templateFontDetails?.testNameFontSize?.options[parseInt(defaultFilterValue?.testNameFontSize)]?.label+"px", 'important');}}}
                      className={`${fontFamilyCheck(templateFontDetails?.testNameFontStyle?.options[parseInt(defaultFilterValue?.testNameFontStyle)]?.label)}`}  dangerouslySetInnerHTML={{__html: headerDataFields?.fieldValue}} />
                </div>
              )}
            </>
          )
        } else if (
          headerData?.sectionTypeKey == 'subjectSection' 
        ) {
          return (
            isPrint ? ( headerDataFields.fieldKey !== 'timeToDisplay' && (
             <h1 className={headerDataFields.fieldKey == 'subject' ? 'previewSubjectElem' : ''}>
              {(headerDataFields?.fieldSelected && headerDataFields.fieldName !== 'Subject') ? <span dangerouslySetInnerHTML={{__html: headerDataFields?.fieldName}} /> : ''}
              {(headerDataFields?.fieldSelected && headerDataFields.fieldName !== 'Subject') ? ':  ' : ''}
              {headerDataFields?.fieldSelected && <span style={{display:"inline-block"}} dangerouslySetInnerHTML={{__html: headerDataFields?.fieldValue}}/>}
              {headerDataFields.fieldName == 'totalTime' ? 'mins' : ''}
            </h1>)):
            (headerDataFields.fieldKey !== 'timeToDisplay' && (
              <h1 className={headerDataFields.fieldKey == 'subject' ? 'previewSubjectElem' : ''}>
               {(headerDataFields?.fieldSelected && headerDataFields.fieldName !== 'Subject') ? <span dangerouslySetInnerHTML={{__html: headerDataFields?.fieldName}} /> : ''}
               {(headerDataFields?.fieldSelected && headerDataFields.fieldName !== 'Subject') ? ':  ' : ''}
               {headerDataFields?.fieldSelected && <span style={{display:"inline-block"}} dangerouslySetInnerHTML={{__html: headerDataFields?.fieldValue}}/>}
               {headerDataFields.fieldName == 'totalTime' ? 'mins' : ''}
             </h1>))
          )
        } else if (
          headerData?.sectionTypeKey == 'studentNameSection' &&
          headerDataFields?.fieldSelected
        ) {
          return (
            <div className='studentNameSectionSect'>
              <span
                dangerouslySetInnerHTML={{
                  __html: headerDataFields?.fieldName ?? headerDataFields?.fieldName,
                }}
              />
              <span className='fieldNameBlank'></span>
            </div>
          )
        } else if (headerData?.sectionTypeKey == 'instructionsSection') {
          let instructionsText = headerDataFields?.fieldValue?.replace(/<[^>]+>/g, "")?.trim()
          return (
            <>
              {instructionsText?.length > 0 && <>
              <span
                dangerouslySetInnerHTML={{
                  __html: headerDataFields?.fieldName ?? headerDataFields?.fieldName,
                }}
              />
                <div className='instructionsSectionText' dangerouslySetInnerHTML={{
                  __html: headerDataFields?.fieldValue ?? headerDataFields?.fieldValue,
                }} />
              </>
              }
            </>
          )
        } else {
          return null
        }
      }
    )
  }

  const [headerDetails, setHeaderDetails] = useState<any>([])
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
  useEffect(() => {
    // headerDetails?.map((headerData:any) => {
    //   debugger
    //   if(headerData.sectionTypeKey == "dateSection") setHeaderDateDetails(headerData)
    // })
    if (ReqBody?.headerDetails?.length > 0) {
      setHeaderDetails(sortArrayOfObjects(ReqBody?.headerDetails, 'sectionSequence'))
    }
    sortArrayOfObjects(ReqBody?.headerDetails, 'sectionSequence')?.map((headerData:any) => {
      if(headerData.sectionTypeKey == "dateSection") setHeaderDateDetails(headerData)
    })
  }, [ReqBody])

  const getDefaultValue = (data: any) => {
    if (typeof data == 'object') {
      const defaultValue = data?.default ?? ''
      const value = data?.options?.findIndex((option: any) => option?.id == defaultValue)
      return value !== -1 ? data?.options[value]?.id?.toString() : ''
    } else {
      return ""
    }
  }

  useEffect(()=>{
    if(ReqBody){
        const templateParts = ReqBody?.bodyTemplate?.templateBuilderInfo?.templateParts
    const dataModel = {
        marksFormat:
          String(templateParts?.length > 0 ? templateParts[0]?.marksFormat : '') ||
          getDefaultValue(templateFontDetails?.marksFormat),
        marksAgainstMainQuestion:
          String(templateParts?.length > 0 ? templateParts[0]?.marksAgainstMainQuestion : '') ||
          getDefaultValue(templateFontDetails?.marksAgainstMainQuestion),
        marksAgainstQuestion:
          String(templateParts?.length > 0 ? templateParts[0]?.marksAgainstQuestion : '') ||
          getDefaultValue(templateFontDetails?.marksAgainstQuestion),
        partAlignment:
          String(templateParts?.length > 0 ? templateParts[0]?.partAlignment : '') ||
          getDefaultValue(templateFontDetails?.partAlignment),
        sectionAlignment:
          String(templateParts?.length > 0 ? templateParts[0]?.sectionAlignment : '') ||
          getDefaultValue(templateFontDetails?.sectionAlignment),
        orSequencing:
          String(templateParts?.length > 0 ? templateParts[0]?.orSequencing : '') ||
          getDefaultValue(templateFontDetails?.orSequencing),
        orAlignment:
          String(templateParts?.length > 0 ? templateParts[0]?.orAlignment : '') ||
          getDefaultValue(templateFontDetails?.orAlignment),
        mainQuestionOrder:
          String(
            templateParts?.length > 0
              ? (typeof templateParts[0]?.mainQuestionOrder == 'object'
                ? templateParts[0]?.mainQuestionOrder?.optionId
                : templateParts[0]?.mainQuestionOrder)
              : ''
          ) || getDefaultValue(templateFontDetails?.mainQuestionOrder),
        questionOrder:
          String(
            templateParts?.length > 0
              ? (typeof templateParts[0]?.questionOrder == 'object'
                ? templateParts[0]?.questionOrder?.optionId
                : templateParts[0]?.questionOrder)
              : ''
          ) || getDefaultValue(templateFontDetails?.questionOrder),
      }
      setInitialValue(dataModel)
    }
  },[ReqBody])
  let englistFontSelection ="";
  if(!!templateFontDetails && !!ReqBody){
    englistFontSelection = templateFontDetails["englishTextFont"]?.options[ReqBody?.bodyTemplate?.templateBuilderInfo?.questionPaperFontMetaData["englishTextFont"]]?.label;
  }
  const loadHeaderDetails = (headerDetails:any) => {
    headerDetails.map((items:any) => {
      if(items?.sectionTypeKey =="instructionsSection"){
            methods.setValue("instructions", items?.sectionDetails?.sectionFields[0]?.fieldValue)
      }      
    })    
  }
  useEffect(() => {
    if(ReqBody?.headerDetails){
      loadHeaderDetails(ReqBody?.headerDetails)
    } 
  },[ReqBody])

  useEffect(() => {
    if(ReqBody?.headerDetails){
      loadHeaderDetails(ReqBody?.headerDetails)
      setTemplateHeaderGlobal(ReqBody?.headerDetails) 
    } 
  },[triggerReqBody])
  

  return (
    <FormProvider {...methods}>
    <div className={`questionTemplatePreviewSect ${ englistFontSelection == "Arial" ? "templateArialFont" : englistFontSelection == "Times New Roman" ? "templateTimesNewRoamnFont" : englistFontSelection == "Verdana" ? "templateVerdanaFont" : (previewMode != "customStyle") ? "templateHelveticaFont" : englistFontSelection == "Helvetica" ? "templateHelveticaFont" : "" }`}>
      
      
    {(templatePrintEdit && ReqBody?.headerDetails) ?
          <TemplateCreation
              templateHeaderGlobal={templateHeaderGlobal}
              setTemplateHeaderGlobal={setTemplateHeaderGlobal}
              selSubject={selSubject}
              subjects={subjects}
              isCopy={isCopy}
              templatePrintEdit={templatePrintEdit}
              setAnchorEl={setAnchorEl}
              setChangedPopoverValue={setChangedPopoverValue}
              ReqBody={ReqBody}
              setStateFunction={setStateFunction}
              key={key}
              templateFontDetails={templateFontDetails}
            templateJson={templateJson}
            />:
            <>
            {headerDetails?.map((headerData:any) => {
              return (
                <div className={`${headerData?.sectionTypeKey} px-5`}>
                  {createHeaderComponent(headerData)}            
                </div>
              )
            })}
            </>
        }
      {ReqBody?.bodyTemplate?.templateBuilderInfo?.templateParts && <div className='previewTemplateBodySect px-5'>
            {ReqBody?.bodyTemplate?.templateBuilderInfo?.templateParts.map((bodyTemplateData: any, index: number) => {
                return (
                  <>
                    <MIFRecussivePaperGenerator viewAnswer={viewAnswer} questionIndex={index} ReqBody={ReqBody} questionData={bodyTemplateData} masterDropdown={templateFontDetails} initialValue={initialValue} questionPaperFilter={ReqBody?.bodyTemplate?.templateBuilderInfo?.questionPaperFontMetaData} replace={replace} replaceQp={replaceQp} previewMode={previewMode} templatePrintEdit={templatePrintEdit} setAnchorEl={setAnchorEl} changedPopoverValue={changedPopoverValue} setChangedPopoverValue={setChangedPopoverValue} setSnackBarSeverity={setSnackBarSeverity} setSnackBarText={setSnackBarText} setSnackBar={setSnackBar} SnackBarSeverity={SnackBarSeverity} snackBarText={snackBarText} snackBar={snackBar} printWithAnswer={printWithAnswer} typeOfLine={typeOfLine}  workbookStyle={workbookStyle} setIsWorksheetEdit={setIsWorksheetEdit}/>
                  </>
                )
            })}
        </div>
        }
        </div>
      <Toaster onClose={() => { setSnackBar(false) }} severity={SnackBarSeverity} text={snackBarText} snakeBar={snackBar} />
      </FormProvider>

    );
};

export default React.memo(MIFQuestionPaperTemplate);