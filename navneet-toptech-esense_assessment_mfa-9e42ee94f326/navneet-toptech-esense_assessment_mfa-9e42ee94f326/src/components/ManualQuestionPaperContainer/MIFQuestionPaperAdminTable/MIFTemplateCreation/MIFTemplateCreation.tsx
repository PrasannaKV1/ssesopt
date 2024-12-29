import React, {useEffect, useRef, useState} from 'react'
import {Box, Button} from '@mui/material'
import DraggableGrid, {DraggableGridHandle} from 'ruuri'
import './MIFTemplateCreation.css'
import {toAbsoluteUrl} from '../../../../constants/AssetHelpers'
import LogoSection from './MIFLogoSection'
import ExamNameSection from './MIFExamNameSection'
import SubjectSection from './MIFSubjectSection'
import StudentNameSection from './MIFStudentNameSection'
import InstructionsSection from './MIFInstructionsSection'
import {compareArrays} from '../../../../constants/helper'
import _ from 'lodash'
import ChangeHeaderModal from '../MIFchangeHeaderModal'

interface sectionFields {
  sectionFields: any[]
}

interface TemplateList {
  sectionTypeKey: string
  sectionSequence: number
  sectionDetails: sectionFields
}

interface TemplateCreationProps {
  // templateHeader: TemplateList[]
  templateHeaderGlobal:any,
  setTemplateHeaderGlobal:any,
  subjects?:any,
  selSubject?:any,
  isCopy?:boolean,
  templatePrintEdit?:any,
  setAnchorEl?:any,
  setChangedPopoverValue?:any,
  ReqBody?:any,
  setStateFunction?:(key: string, state: any, redo?:any, isDraggable?:boolean) => void,
  key?:number,
  templateFontDetails?:any
  templateJson?: any
}

const getContent = (key: any, data: any, selSubject: any, subjects: any, templatePrintEdit: boolean, setAnchorEl: any, setChangedPopoverValue: any, templateHeaderGlobal: any, Handlers: any, ReqBody: any, keys: number, templateFontDetails: any, templateJson: any) => {
  switch (key) {
    case 'logoSection':
      return <LogoSection sectionFields={data.sectionDetails.sectionFields} defaultFilterValue={ReqBody?.bodyTemplate?.templateBuilderInfo?.questionPaperFontMetaData} templateFontDetails={templateFontDetails} templateJson={templateJson} />

    case 'examNameSection': 
      return <ExamNameSection sectionFields={data.sectionDetails.sectionFields} templatePrintEdit={templatePrintEdit} setAnchorEl={setAnchorEl} sectionName={data?.sectionTypeKey} setChangedPopoverValue={setChangedPopoverValue}/>
    
      case 'subjectSection':
      return <SubjectSection sectionFields={data.sectionDetails.sectionFields} selSubject={selSubject} subjects={subjects} templatePrintEdit={templatePrintEdit} setAnchorEl={setAnchorEl} sectionName={data?.sectionTypeKey} setChangedPopoverValue={setChangedPopoverValue}/>

    case 'studentNameSection':
      return <StudentNameSection sectionFields={data.sectionDetails.sectionFields} templatePrintEdit={templatePrintEdit} setAnchorEl={setAnchorEl} sectionName={data?.sectionTypeKey} setChangedPopoverValue={setChangedPopoverValue}/>

    case 'instructionsSection':
      return <InstructionsSection sectionFields={data.sectionDetails.sectionFields} templatePrintEdit={templatePrintEdit} sectionName={data?.sectionTypeKey} setChangedPopoverValue={setChangedPopoverValue} templateHeaderGlobal={templateHeaderGlobal} Handlers={Handlers} key={keys}/>

    default:
      break
  }
}

const TemplateCreation: React.FC<TemplateCreationProps> = ({ isCopy, templateHeaderGlobal, setTemplateHeaderGlobal, subjects, selSubject, templatePrintEdit, setAnchorEl, setChangedPopoverValue, setStateFunction, ReqBody, key, templateFontDetails, templateJson }) => {
  const [show,setShow]=useState<any>(false);
  const [selectedTemplate,setSelectedTemplate] = useState<any>([]);
  const gridRef = useRef<DraggableGridHandle | null>(null);
  const undoObj = JSON.parse(JSON.stringify(ReqBody));   

  const handleOnDragReleaseEnd = (params: any) => {
    setTimeout(() => {
    const getLatestOrder = gridRef.current?.grid?.getItems().map((item:any) => {
      return JSON.parse(item.getElement()?.getAttribute('data-item-list') || '') || {}
    }) as any
    getLatestOrder &&
      getLatestOrder?.forEach((item: TemplateList, index:number) => (item.sectionSequence = index + 1))
    // const checkUpdatedArray = compareArrays(templateHeaderGlobal, getLatestOrder)
    const checkUpdatedArray = JSON.stringify(templateHeaderGlobal) === JSON.stringify([...getLatestOrder as any,undoObj?.headerDetails?.find((sec:any)=>(sec?.sectionTypeKey == "dateSection"))])
    // const checkUpdatedArray = _.isEqual(templateHeaderGlobal, getLatestOrder)
    if (!checkUpdatedArray) {
      const dateSec=ReqBody?.headerDetails?.filter((sec:any)=>(sec?.sectionTypeKey == "dateSection"))
      //getLatestOrder && setTemplateHeaderGlobal([...getLatestOrder, ...dateSec])
      let latestOrderArray = [...getLatestOrder, ...dateSec]
      let headerDetailsArray = [...ReqBody?.headerDetails]
      let result = latestOrderArray.map((item: any, i: any) => {
        let filterArray = headerDetailsArray?.find((y) => y.sectionTypeKey == item?.sectionTypeKey)

        if (filterArray) {
          return {
            ...item,
            sectionDetails: filterArray?.sectionDetails,
            sectionTypeKey: filterArray?.sectionTypeKey,
          }
        }
      });
      setStateFunction && setStateFunction('actions', undoObj,{
        bodyTemplate:ReqBody?.bodyTemplate,
        headerDetails:result
      },true)   
      setStateFunction && setStateFunction('undo',false)
      setStateFunction && setStateFunction('redo',true)
    }
    },200)
  }
  const handleOnClose = () => {
    setShow(false)
  }
  const handleEditTemplate = (obj: any) => {
    if(obj?.sectionTypeKey === "subjectSection") {
      const newData = obj.sectionDetails.sectionFields.filter((data:any) => data.fieldKey !== "timeToDisplay");
      setSelectedTemplate({
          ...obj,
          sectionDetails: {
              ...obj.sectionDetails,
              sectionFields: newData
          }
      });
  }
  
    else{
      setSelectedTemplate(obj)
    }
    setShow(true)
  }

  return (
    <>
      {/* <h2 className='templateCreationTitle'>Customise Header</h2> */}
      <Box className={`TemplateCreationBox MIFTemplateCreationBox ${isCopy ? 'disable-box' : ''}`}>
        <DraggableGrid dragEnabled={true} onDragEnd={handleOnDragReleaseEnd} dragHandle={'.TemplateBoxIcon'} ref={gridRef}>
          {templateHeaderGlobal?.map((item:any, index:number) => {
            if(item.sectionTypeKey !== "dateSection") {
            return(
              <>
              {item?.sectionTypeKey != "dateSection" && 
            <div
              className='item'
              key={`_${index}`}
              data-itemId={`${index}`}
              data-item-list={JSON.stringify(templateHeaderGlobal[index])}
            >
              <div className='item-content'>
                <div className='TemplateBoxRow' key={item.sectionSequence}>
                  <div className='TemplateBoxIcon'>
                    <img
                      src={toAbsoluteUrl('/media/menu_icons/Dragable.svg')}
                      alt='dragable'
                    />
                  </div>
                  <div className='TemplateEditIcon'>
                    {item.sectionTypeKey !== 'instructionsSection' && (
                      <Button
                        tabIndex={-1}
                        variant='text'
                        sx={{padding: 0, minWidth: 0}}
                        onClick={() => handleEditTemplate(item)}
                      >
                        <img
                          src={toAbsoluteUrl('/media/menu_icons/EditActions.svg')}
                          alt='action'
                        />
                      </Button>
                    )}
                  </div>
                        <div className='TemplateBoxContent'>{getContent(item.sectionTypeKey, item, selSubject, subjects, templatePrintEdit, setAnchorEl, setChangedPopoverValue, templateHeaderGlobal, setStateFunction, ReqBody, key || 0, templateFontDetails, templateJson)}</div>
                </div>
              </div>
            </div>}
            </>
            )
            }
          }
          )}
        </DraggableGrid>
      </Box>
      {show && (
        <ChangeHeaderModal
          openModal={show}
          onHide={handleOnClose}
          selectedTemplate={selectedTemplate}
          setTemplateHeaderGlobal={setTemplateHeaderGlobal}
          templateHeaderGlobal={templateHeaderGlobal}
          ReqBody={ReqBody}
          setStateFunction={setStateFunction}
        />
      )}
    </>
  )
}

export default React.memo(TemplateCreation)
