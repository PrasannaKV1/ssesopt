import React, { useEffect, useState } from 'react';
import "./QuestionPaperTemplate.css";
import schoolLogo from '../../../../assets/images/schoolLogo.svg';
import RecussivePaperGenerator from './RecussivePaperGenerator';
import TemplateCreation from '../../QuestionPaperAdminTable/TemplateCreation/TemplateCreation';
import {useLocation} from 'react-router-dom'
import { baseFilterApi } from '../../../../Api/AssessmentTypes';
import { getLocalStorageDataBasedOnKey } from "../../../../constants/helper";
import { State } from "../../../../types/assessment";
import { FormProvider, useForm } from 'react-hook-form';
import { convertToReadableFormat } from '../../../../constants/helperFunctions';

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
    key?:number;
    printWithAnswer?:boolean;
    qpCourses?:any;
    setmarkerrorQnsIds?:any;
    grperrorQnsIds?:any
    enableDoneBtnByValue?:any
    setCompMarkValue?:any,
    printConfig?:any,
    isPrint?:boolean,
  onlineAssessmentData?: any,
  viewAnswer?: boolean;
  highlightstartTime?: boolean,
  setHighlightStartTime?: any,
  totalTime?: any
    typeOfLine?:string,
    workbookStyle?:boolean,
    isWorksheetEdit?:any
}
interface sectionFields {
  sectionFields: any[]
}
interface TemplateList {
  sectionTypeKey: string
  sectionSequence: number
  sectionDetails: sectionFields,
}

const QuestionPaperTemplate: React.FC<props> = ({ qpCourses, ReqBody, markerrorQnsIds, templateFontDetails, replace, replaceQp, previewMode, templatePrintEdit, setAnchorEl, changedPopoverValue, setChangedPopoverValue, templateJson, triggerReqBody, dragPositionHeader, setStateFunction, previewDate, key, printWithAnswer, setmarkerrorQnsIds, enableDoneBtnByValue, highlightstartTime, setHighlightStartTime, totalTime,
  grperrorQnsIds, setCompMarkValue, printConfig, onlineAssessmentData, isPrint = false, viewAnswer, typeOfLine, workbookStyle, isWorksheetEdit }) => {
  const location: any = useLocation();
    const [initialValue, setInitialValue] = useState({})
    const [templateHeaderGlobal, setTemplateHeaderGlobal] = useState<TemplateList[]>()
    const [selSubject, setSelSubject] = React.useState<any>([])
    const [subjects, setSubjects] = useState<any[]>([])
    const [isCopy, setIsCopy] = useState<boolean>(location?.state?.isCopy);
    const stateDetails = JSON.parse(getLocalStorageDataBasedOnKey('state') as string) as State;
    const methods = useForm<any>({
      defaultValues: [],
      mode: 'onBlur',
      reValidateMode: 'onChange',
    })
    const onlineTemplateAssessmentData= location.state?.onlineAssessmentData

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
      // if(modificationFilter != undefined){
      //   Object.keys(defaultCheckFields).filter((e: any) => {
      //     if (!(e in modificationFilter) || modificationFilter[e] == null) modificationFilter[e] = defaultCheckFields[e]
      //   })
      // }

      if(modificationFilter != undefined){
        Object.keys(defaultCheckFields).filter((e: any) => {
          if(e != "englishTextFont"){
            if ((e in modificationFilter) && modificationFilter[e] == null){
              if(e.indexOf("FontStyle") > 0){
                modificationFilter[e] = modificationFilter["englishTextFont"]
              }else{
                modificationFilter[e] = defaultCheckFields[e]
              }
            }
          }          
        })
      }
      //if(previewMode == "customStyle") delete modificationFilter["englishTextFont"]
      return modificationFilter
    })
    const [defaultFilterValue, setDefaultFilterValue] = useState<any>()
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


    const fontFamilyCheck = ((fontFamily:string) => {
      return fontFamily == "Arial" ? "previewFontArial" : fontFamily == "Times New Roman" ? "previewFontTimesNewRoman" : fontFamily == "Verdana" ? "previewFontVerdana" : fontFamily == "Helvetica" ? "previewFontHelvetica" : ""
    })

    const createHeaderComponent = (headerData:any) => {   
      
    return sortArrayOfObjects(headerData?.sectionDetails?.sectionFields, 'fieldSequence')?.map(
      (headerDataFields:any, index:number) => {
        if (headerData?.sectionTypeKey == 'logoSection' && printConfig != undefined && !onlineAssessmentData) {
          return (
            <>
              {(headerDataFields?.fieldKey == 'schoolLogo' && headerDataFields?.fieldSelected && printConfig.showSchoolLogo) && (
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
                    {headerDataFields?.fieldValue ? <p className='headerLogoImg' dangerouslySetInnerHTML={{ __html: headerDataFields?.fieldValue}} /> :<img
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
              {(headerDataFields?.fieldKey == 'schoolName' && headerDataFields?.fieldSelected) && (
                <div
                  className={'text-center'}
                >
                  <h1 ref={(el) => {if (el) {el.style.setProperty('font-size', templateFontDetails?.headerFontSize?.options[parseInt(defaultFilterValue?.headerFontSize)]?.label+"px", 'important');}}}
                      className={`${fontFamilyCheck(templateFontDetails?.headerFontStyle?.options[parseInt(defaultFilterValue?.headerFontStyle)]?.label)}`} >
                    {headerDataFields?.fieldValue ? headerDataFields?.fieldValue : ''} 
                  </h1>
                </div>
              )}
              {(headerDataFields?.fieldKey == 'affiliation' && headerDataFields?.fieldSelected) && (
                <>
                <div
                  className={'text-center'}
                >
                  <h2 ref={(el) => {if (el) {el.style.setProperty('font-size', templateFontDetails?.headerFontSize?.options[parseInt(defaultFilterValue?.headerFontSize)]?.label+"px", 'important');}}}
                      className={`${fontFamilyCheck(templateFontDetails?.headerFontStyle?.options[parseInt(defaultFilterValue?.headerFontStyle)]?.label)}`}>
                    {headerDataFields?.fieldValue ? headerDataFields?.fieldValue : 'Affiliation'}
                  </h2>
                </div>
                </>
              )}
              {((headerData?.sectionDetails?.sectionFields.length - 1) == index) && headerDateDetails?.sectionDetails?.sectionFields[0]?.fieldValue?.length > 0 && <>
                    <div className='dateSectionText' dangerouslySetInnerHTML={{
                      __html: previewDate ? previewDate : headerDateDetails?.sectionDetails?.sectionFields[0]?.fieldValue,
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
                      className={`${fontFamilyCheck(templateFontDetails?.testNameFontStyle?.options[parseInt(defaultFilterValue?.testNameFontStyle)]?.label)}`} 
                      dangerouslySetInnerHTML={{__html: headerDataFields?.fieldValue}} />
                </div>
              )}
            </>
          )
        } else if (
          headerData?.sectionTypeKey == 'subjectSection'
        ) {
          return (
            <>
            {isPrint? (headerDataFields.fieldKey !== 'timeToDisplay' &&( <h1 className={headerDataFields.fieldKey == 'subject' ? 'previewSubjectElem' : ''}>
                {(headerDataFields?.fieldSelected && headerDataFields.fieldName.toLowerCase() !== 'subject') ? <span ref={(el) => { if (el) { el.style.setProperty('font-size', templateFontDetails?.headerFontSize?.options[parseInt(defaultFilterValue?.headerFontSize)]?.label + "px", 'important'); } }}
                    className={`${fontFamilyCheck(templateFontDetails?.headerFontStyle?.options[parseInt(defaultFilterValue?.headerFontStyle)]?.label)}`} dangerouslySetInnerHTML={{__html: headerDataFields?.fieldName}} /> : ''}
            {(headerDataFields?.fieldSelected && headerDataFields.fieldName.toLowerCase() !== 'subject') ? ':  ' : ''}
            {headerDataFields?.fieldSelected && <span ref={(el) => {if (el) {el.style.setProperty('font-size', templateFontDetails?.headerFontSize?.options[parseInt(defaultFilterValue?.headerFontSize)]?.label+"px", 'important');}}}
                  className={`${fontFamilyCheck(templateFontDetails?.headerFontStyle?.options[parseInt(defaultFilterValue?.headerFontStyle)]?.label)}`} style={{ display: "inline-block", }} dangerouslySetInnerHTML={{ __html: headerDataFields?.fieldValue }} />}
            {headerDataFields?.fieldSelected && headerDataFields.fieldKey == 'totalTime' ? 'mins' : ''}
          </h1>)):
          (headerDataFields.fieldKey !== 'timeToDisplay' && ( <h1 className={headerDataFields.fieldKey == 'subject' ? 'previewSubjectElem' : ''}>
                  {(headerDataFields?.fieldSelected && headerDataFields.fieldName.toLowerCase() !== 'subject') ? <span ref={(el) => { if (el) { el.style.setProperty('font-size', templateFontDetails?.headerFontSize?.options[parseInt(defaultFilterValue?.headerFontSize)]?.label + "px", 'important'); } }}
                  className={`${fontFamilyCheck(templateFontDetails?.headerFontStyle?.options[parseInt(defaultFilterValue?.headerFontStyle)]?.label)}`} dangerouslySetInnerHTML={{__html: headerDataFields?.fieldName}} /> : ''}
          {(headerDataFields?.fieldSelected && headerDataFields.fieldName.toLowerCase() !== 'subject') ? ':  ' : ''}
          {headerDataFields?.fieldSelected && <span ref={(el) => {if (el) {el.style.setProperty('font-size', templateFontDetails?.headerFontSize?.options[parseInt(defaultFilterValue?.headerFontSize)]?.label+"px", 'important');}}}
                    className={`${fontFamilyCheck(templateFontDetails?.headerFontStyle?.options[parseInt(defaultFilterValue?.headerFontStyle)]?.label)}`} style={{ display: "inline-block", paddingRight: (onlineAssessmentData && headerDataFields.fieldKey !== 'totalTime') ? '75px' : '' }} dangerouslySetInnerHTML={{ __html: headerDataFields?.fieldValue }} />}
                  {headerDataFields?.fieldSelected && headerDataFields.fieldKey == 'totalTime' ? ' mins' : ''}
        </h1>))}
        {index==2 && onlineAssessmentData && <OnlineAssessmentHeader/>}

          </>
          )
        } else if (
          headerData?.sectionTypeKey == 'studentNameSection' &&
          headerDataFields?.fieldSelected && !onlineAssessmentData
        ) {
          return (
            <div className='studentNameSectionSect'>
              <span ref={(el) => {if (el) {el.style.setProperty('font-size', templateFontDetails?.headerFontSize?.options[parseInt(defaultFilterValue?.headerFontSize)]?.label+"px", 'important');}}}
                      className={`${fontFamilyCheck(templateFontDetails?.headerFontStyle?.options[parseInt(defaultFilterValue?.headerFontStyle)]?.label)}`}
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
              <span ref={(el) => {if (el) {el.style.setProperty('font-size', templateFontDetails?.headerFontSize?.options[parseInt(defaultFilterValue?.headerFontSize)]?.label+"px", 'important');}}}
                      className={`${fontFamilyCheck(templateFontDetails?.headerFontStyle?.options[parseInt(defaultFilterValue?.headerFontStyle)]?.label)}`}
                dangerouslySetInnerHTML={{
                  __html: headerDataFields?.fieldName ?? headerDataFields?.fieldName,
                }}
              />
                <div ref={(el) => {if (el) {el.style.setProperty('font-size', templateFontDetails?.headerFontSize?.options[parseInt(defaultFilterValue?.headerFontSize)]?.label+"px", 'important');}}}
                      className={`instructionsSectionText ${fontFamilyCheck(templateFontDetails?.headerFontStyle?.options[parseInt(defaultFilterValue?.headerFontStyle)]?.label)}`} dangerouslySetInnerHTML={{
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

  const OnlineAssessmentHeader =()=>{
    const isChapterChallenge = location?.state?.isChapterChallenge;
    return (
      <div className='mt-3 mb-5' style={{  }}>
        {isChapterChallenge ? 
        <>
          <div style={{position:"absolute", left: "48px", top:"36px", display:"flex", flexDirection:"column"}}>
            <span >Assign Date: {(onlineAssessmentData?.assignedDate)}</span>
          </div>
          <div style={{position:"absolute",  top:"36px",right:"40px", display:"flex", flexDirection:"column", minWidth:"210px", maxWidth:"210px"}}>
            <span >Assign Time: {(onlineAssessmentData?.assignedTime)}</span>
          </div>
        </>
        :
        <>
        <div style={{position:"absolute", left: "46px", top:"26px", display:"flex", flexDirection:"column"}}>
          <span >Start Date: {convertToReadableFormat(onlineAssessmentData?.startDate)}</span>
          <span >Start Time: {onlineAssessmentData?.startTime} </span>
        </div>
        <div style={{position:"absolute",  top:"26px",right:"27px", display:"flex", flexDirection:"column", minWidth:"210px", maxWidth:"210px"}}>
          <span >Due Date: {convertToReadableFormat(onlineAssessmentData?.endDate)}</span>
          <span >Due Time: {onlineAssessmentData?.endTime}</span>
        </div>
        </> }
      </div>
    )
  }

  const [headerDetails, setHeaderDetails] = useState<any>([])
  const [headerDateDetails, setHeaderDateDetails] = useState<any>([])
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
    if (ReqBody?.headerDetails?.length > 0) {
      setHeaderDetails(sortArrayOfObjects(ReqBody?.headerDetails, 'sectionSequence'))
    }
    sortArrayOfObjects(ReqBody?.headerDetails, 'sectionSequence')?.map((headerData:any) => {
      if(headerData.sectionTypeKey == "dateSection") setHeaderDateDetails(headerData)
    })
  }, [ReqBody])

  let englistFontSelection = ""
  if(ReqBody && templateFontDetails){
    if(Object.keys(ReqBody).length){
      englistFontSelection = templateFontDetails["englishTextFont"]?.options[ReqBody?.bodyTemplate?.templateBuilderInfo?.questionPaperFontMetaData["englishTextFont"]]?.label
    }  
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
    <div className={`questionTemplatePreviewSect ${ englistFontSelection == "Arial" ? "templateArialFont" : englistFontSelection == "Times New Roman" ? "templateTimesNewRoamnFont" : englistFontSelection == "Verdana" ? "templateVerdanaFont" : englistFontSelection == "Helvetica" ? "templateHelveticaFont" : "" }`}>
      
      
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
              onlineAssessmentData={onlineTemplateAssessmentData}
            highlightstartTime={highlightstartTime}
            setHighlightStartTime={setHighlightStartTime}
            totalTime={totalTime}
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
            {ReqBody?.bodyTemplate?.templateBuilderInfo?.templateParts.map((bodyTemplateData: any, index: any) => {
                return (
                    <>
                    <RecussivePaperGenerator questionIndex={index} setStateFunction={setStateFunction} ReqBody={ReqBody} questionData={bodyTemplateData} masterDropdown={templateFontDetails} initialValue={initialValue} questionPaperFilter={ReqBody?.bodyTemplate?.templateBuilderInfo?.questionPaperFontMetaData} replace={replace} replaceQp={replaceQp} previewMode={previewMode} templatePrintEdit={templatePrintEdit} setAnchorEl={setAnchorEl} changedPopoverValue={changedPopoverValue} setChangedPopoverValue={setChangedPopoverValue} markerrorQnsIds={markerrorQnsIds} printWithAnswer={printWithAnswer} qpCourses={qpCourses} setmarkerrorQnsIds={setmarkerrorQnsIds} grperrorQnsIds={grperrorQnsIds} enableDoneBtnByValue={enableDoneBtnByValue} setCompMarkValue={setCompMarkValue} viewAnswer={viewAnswer} typeOfLine={typeOfLine} workbookStyle={workbookStyle} templateJson={templateJson} isWorksheetEdit={isWorksheetEdit}/>
                    </>
                )
            })}
        </div>
        }
        </div>
      </FormProvider>

    );
};

export default React.memo(QuestionPaperTemplate);