import React, {FC, useCallback, useEffect, useRef, useState} from 'react'
import { Alert, AlertColor, Snackbar } from '@mui/material'
import Modal from 'react-bootstrap/Modal'
import clsx from 'clsx'
import './changeHeaderModal.css'
import CloseIcon from '../../../assets/images/closeIcon.svg'
import CheckBoxComponent from '../../SharedComponents/CheckBoxComponent/CheckBoxComponent'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import FormGroup from '@mui/material/FormGroup'
import DragIcon from '../../../assets/images/dragIcon.svg'
import DraggableGrid, {DraggableGridHandle} from 'ruuri'
import {compareArrays} from '../../../constants/helper'
import {styled} from '@mui/material/styles'
const data = ['School Logo', 'School Name', 'Affiliation']

const FieldMainItem = styled('div')<{
  totalBlock: number
  totalWidth: number
  totalHeight?: number
  height?: number
}>(({totalWidth = 672, totalBlock = 10000, totalHeight = 40, height = 1}) => ({
  width: `${totalBlock === 0 ? 'auto' : totalWidth / totalBlock - 24 + 'px'}`,
  height: `${height === 1 ? totalHeight * height : totalHeight * height + 16}px`,
  minHeight: '40px',
  backgroundColor: '#fff',
  color: '#000',
  borderRadius: '8px',
  padding: '8px 16px',
  alignItems: 'center',
  boxSizing: 'border-box',
  fontWeight: 500,
  fontSize: '14px',
  lineHeight: '22px',
  display: 'flex',
  border: `1px solid #1B1C1E`,
  margin: '8px',
  '&:hover': {
    border: `1px solid #C2C2C2`,
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.08)',
    cursor: 'grab',
  },
  '& .text': {
    marginLeft: '5px',
  },
}))

interface changeheader {
  openModal: boolean
  onHide: any
  selectedTemplate: any,
  setTemplateHeaderGlobal:any,
  templateHeaderGlobal:any,
  ReqBody?:any,
  setStateFunction?:(key: string, state: any, redo?:any) => void,
}

const ChangeHeaderModal: React.FC<changeheader> = ({
  openModal,
  onHide,
  selectedTemplate,
  setTemplateHeaderGlobal,
  setStateFunction,
  ReqBody
}) => {
  const gridModalRef = useRef<DraggableGridHandle | null>(null)
  const fieldMainRef = useRef<HTMLDivElement>(null)
  const [selectedLogoAlignment, setSelectedLogoAlignment] = useState<any>(null)
  const [selectedTemplateObject, setSelectedTemplateObject] = useState<any>(
    selectedTemplate.sectionDetails.sectionFields || []
  )
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
  const [alertText, setAlertText] = useState<string>("")
  const [totalWidth, setTotalWidth] = useState<number>(fieldMainRef.current?.clientWidth || 100);
  useEffect(() => {
    setTotalWidth(fieldMainRef.current?.clientWidth || 735)
  }, [selectedTemplate])

  const handleChange = useCallback((data: any) => {
    setSelectedTemplateObject((state:any) => {
      return state.map((item:any) => {
        return item.fieldKey === data.fieldKey
          ? {...item, fieldSelected: !data.fieldSelected}
          : item
      })
    })
  }, [])

  const handleLogoAlign = async (data: any, index: number) => {
    setSelectedLogoAlignment(index)
    setSelectedTemplateObject((state:any) => {
      return state.map((item:any) => {
        return { ...item, fieldSequence: index + 1 }
      })
    })
  }

  const handleSave = async () => {
    const undoObj=JSON.parse(JSON.stringify(ReqBody));
    let redoHeaderObj:any;
    setTemplateHeaderGlobal((state:any) => {
      redoHeaderObj = state.map((item:any) => {
         if(item.sectionSequence === selectedTemplate.sectionSequence) {
          let updatedObj = item;
          updatedObj.sectionDetails.sectionFields = selectedTemplateObject
          return updatedObj
        }else{
          return item;
        }
      })
      return redoHeaderObj
    })
    setOpenSnackbar(true);
    setStateFunction && setStateFunction('actions', undoObj,{
      bodyTemplate:ReqBody?.bodyTemplate,
      headerDetails:redoHeaderObj
    })    
    setTimeout(() => {     
      setOpenSnackbar(false)
      onHide();
      setStateFunction && setStateFunction('undo',false)
      setStateFunction && setStateFunction('redo',true)   
    },1000)    
  }
  const handleDefaultCheckContainer =async () =>{
    let logoArr = await selectedTemplate?.sectionDetails?.sectionFields;
    if(logoArr?.length>0){
      setSelectedLogoAlignment(logoArr[0]?.fieldSequence - 1)
    }
  }
  const handleOnDragReleaseEnd = useCallback(() => {
    const getLatestOrder = gridModalRef.current?.grid?.getItems().map((item:any) => {
      return JSON.parse(item.getElement()?.getAttribute('data-item-list') || '') || {}
    })
    getLatestOrder &&
      getLatestOrder?.forEach((item: any, index:number) => (item.fieldSequence = index + 1))
    const checkUpdatedArray = compareArrays(selectedTemplate, getLatestOrder)
    // const checkUpdatedArray = _.isEqual(templateHeaderGlobal, getLatestOrder)
    if (!checkUpdatedArray) {
      setSelectedTemplateObject(getLatestOrder)
    }
  }, [selectedTemplate])
  useEffect(()=>{

    if(selectedTemplate?.sectionTypeKey==="logoSection"){
      handleDefaultCheckContainer();
   }
  },[selectedTemplate])
  return (
    <>
    <Modal
      show={openModal}
      size='lg'
      aria-labelledby='contained-modal-title-vcenter'
      centered
      contentClassName='change-header-cls-out'
    >
      <div className='header-row'>
        <div className='font-cls'>Change Header</div>
        <img src={CloseIcon} alt='close-btn' onClick={() => onHide()} />
      </div>
      <div className='sub-font-cls'>Select the layout for the header</div>
      <div className='layout-cont-out'>
        <div className='left-cls'>
          <div className='head-font-cls mar-lef-tw'>Fields</div>
          {selectedTemplateObject?.map((val: any, ind: number) => {
            return (
              val?.fieldKey !== '' && val.fieldKey !== "timeToDisplay" && (
                <>
                  <FormGroup className='mar-lef-tw'>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={val?.fieldSelected}
                          onChange={(e) => handleChange(val)}
                        />
                      }
                      label={val?.fieldKey == "studentName" ? "Name" : val?.fieldKey == "studentClass" ? "Class" : val?.fieldKey == "studentSection" ? "Section" : val?.fieldKey == "studentRollNo" ? "Roll No." : val?.fieldKey == "totalTime" ? "Total Time" : val?.fieldKey == "subject" ? "Subject" : val?.fieldKey == "totalMarks" ? "Total Marks" : val?.fieldName}
                      color='success'
                      disabled={val?.fieldDefault === true}
                    />
                  </FormGroup>
                </>
              )
            )
          })}
        </div>
        <div className='right-cls'>
          <div className='col-content'>
            {selectedTemplate?.sectionTypeKey === 'logoSection' ? (
              <>
                <div className='row-content logoSection'>
                  {selectedTemplateObject?.map((val: any, ind: number) => {
                    return (
                      <>
                        <div className='column-align-text-cls'>
                          <div className='cont-row-cls'>
                            <div
                              className={`logo-cont-out-cls`}
                              style={
                                selectedLogoAlignment === ind ? {border: '2px solid #01B58A'} : {}
                              }
                              onClick={(e) => handleLogoAlign(val, ind)}
                            >
                              <div className={`content-align-sec `}>
                                <div
                                  className={`align-logo-cls`}
                                  style={
                                    ind === 1
                                      ? {justifyContent: 'center'}
                                      : ind === 2
                                      ? {justifyContent: 'flex-end'}
                                      : {}
                                  }
                                >
                                  {selectedTemplateObject[0]?.fieldKey === 'schoolLogo' && !!selectedTemplateObject[0]?.fieldSelected && (
                                    <div className={`school-log-cont`}>{"School Logo"}</div>
                                   )} 
                                </div>
                                <div className='school-text-font'>School Name</div>
                                {selectedTemplateObject[2]?.fieldKey === 'affiliation' && !!selectedTemplateObject[2]?.fieldSelected && ( 
                                  <div className={`school-affliation-font`}>{"Affiliation"}</div>
                                  )} 
                              </div>
                            </div>
                          </div>

                          <div
                            className={`selected-font-cls`}
                            style={selectedLogoAlignment === ind ? {color: '#1B1C1E'} : {}}
                          >
                            {ind === 0 ? 'Left Logo' : ind === 1 ? 'Centered Logo' : 'Right Logo'}
                          </div>
                        </div>
                      </>
                    )
                  })}
                </div>
              </>
            ) : (
              <div className='row-content' ref={fieldMainRef}>
                <DraggableGrid
                  dragEnabled={true}
                  onDragEnd={handleOnDragReleaseEnd}
                  ref={gridModalRef}
                >
                  {selectedTemplateObject?.map((value: any, index: any) => {
                    return (
                      <div
                        className='item'
                        key={`_${index}`}
                        data-itemid={`${index}`}
                        data-item-list={JSON.stringify(selectedTemplateObject[index])}
                      >
                        <div className='item-content'>
                          <FieldMainItem
                            totalWidth={totalWidth}
                            height={1}
                            totalBlock={selectedTemplateObject.length}
                          >
                            {value.fieldName && value.fieldSelected && value.fieldKey !== "timeToDisplay" && (
                              <>
                                <img src={DragIcon} alt='' />
                                <div className='text dragDropText' dangerouslySetInnerHTML={{ __html: value.fieldName}} />
                              </>
                            )}
                          </FieldMainItem>
                        </div>
                      </div>
                    )
                  })}
                </DraggableGrid>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className='button-row-cls'>
        <button className='save-btn' onClick={handleSave}>
          Save
        </button>
        <button className='cancel-btn' onClick={() => onHide()}>
          Cancel
        </button>
      </div>
      <>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={()=>setOpenSnackbar(false)}
      >
        <Alert onClose={()=>setOpenSnackbar(false)} severity={"success"} sx={{width: '100%'}}>
          Layout successfully saved
        </Alert>
      </Snackbar>
      </>
    </Modal>
    </>
  )
}

export default ChangeHeaderModal