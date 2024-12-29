import React, {useEffect, useRef, useState} from 'react'
import {Box, Button, TextField} from '@mui/material'
import DraggableGrid, {DraggableGridHandle} from 'ruuri'
import './TemplateCreation.css'
import {toAbsoluteUrl} from '../../../../constants/AssetHelpers'
import LogoSection from './LogoSection'
import ExamNameSection from './ExamNameSection'
import SubjectSection from './SubjectSection'
import StudentNameSection from './StudentNameSection'
import InstructionsSection from './InstructionsSection'
import _ from 'lodash'
import ChangeHeaderModal from '../changeHeaderModal'
import { areDatesEqual, getLocalStorageDataBasedOnKey } from '../../../../constants/helper'
import { State } from '../../../../types/assessment'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from "@mui/x-date-pickers";
import moment from "moment";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const timeConverter=(time:any) => {
  if (!time) return ''; 
  const parsedTime = dayjs(time, 'h:mm A'); 
  if (!parsedTime.isValid()) return ''; 
  
  return parsedTime.format('HH:mm');
}
function convertDate(inputDate:any) {
  const cleanedDate = inputDate?.replace(/(\d+)(st|nd|rd|th)/, '$1');
  const dateObj = new Date(cleanedDate);
  // Format the date to 'YYYY-MM-DD'
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
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
  setStateFunction?:(key: string, state: any, redo?:any,isDraggable?:boolean) => void,
  key?:number,
  templateFontDetails?: any,
  onlineAssessmentData?: any,
  highlightstartTime?: boolean,
  setHighlightStartTime?: any,
  totalTime?: any;
  templateJson?: any
}

const getContent = (key: any, data: any, selSubject: any, subjects: any, templatePrintEdit: boolean, setAnchorEl: any, setChangedPopoverValue: any, templateHeaderGlobal: any, Handlers: any, ReqBody: any, keys: number, templateFontDetails: any, OnlineAssessmentHeader: any, isOnlineAssesssment: boolean, templateJson: any) => {
  switch (key) {
    case 'logoSection':
      return !isOnlineAssesssment && <LogoSection sectionFields={data.sectionDetails.sectionFields} defaultFilterValue={ReqBody?.bodyTemplate?.templateBuilderInfo?.questionPaperFontMetaData} templateFontDetails={templateFontDetails} templateJson={templateJson} />

    case 'examNameSection':
      return <ExamNameSection templatePrintEdit={templatePrintEdit} setAnchorEl={setAnchorEl} sectionName={data?.sectionTypeKey} setChangedPopoverValue={setChangedPopoverValue}/>

    case 'subjectSection':
      return <>
                <SubjectSection selSubject={selSubject} subjects={subjects} templatePrintEdit={templatePrintEdit} setAnchorEl={setAnchorEl} sectionName={data?.sectionTypeKey} setChangedPopoverValue={setChangedPopoverValue}/>
        <>
        </>
        {isOnlineAssesssment &&
          <><OnlineAssessmentHeader />
            <InstructionsSection sectionFields={data.sectionDetails.sectionFields} templatePrintEdit={templatePrintEdit} sectionName={data?.sectionTypeKey} setChangedPopoverValue={setChangedPopoverValue} templateHeaderGlobal={templateHeaderGlobal} Handlers={Handlers} key={keys} onlineChar={600} />
          </>}
      </> 

    case 'studentNameSection':
      return !isOnlineAssesssment && <StudentNameSection templatePrintEdit={templatePrintEdit} setAnchorEl={setAnchorEl} sectionName={data?.sectionTypeKey} setChangedPopoverValue={setChangedPopoverValue}/>

    case 'instructionsSection':
      return !isOnlineAssesssment && <InstructionsSection sectionFields={data.sectionDetails.sectionFields} templatePrintEdit={templatePrintEdit} sectionName={data?.sectionTypeKey} setChangedPopoverValue={setChangedPopoverValue} templateHeaderGlobal={templateHeaderGlobal} Handlers={Handlers} key={keys} />

    default:
      break
  }
}

const TemplateCreation: React.FC<TemplateCreationProps> = ({ isCopy, templateHeaderGlobal, setTemplateHeaderGlobal, subjects, selSubject, templatePrintEdit, setAnchorEl, setChangedPopoverValue, setStateFunction, ReqBody, key, templateFontDetails, onlineAssessmentData, highlightstartTime, setHighlightStartTime, totalTime, templateJson }) => {
  const [show,setShow]=useState<any>(false);
  const [selectedTemplate,setSelectedTemplate] = useState<any>([]);
  const gridRef = useRef<DraggableGridHandle | null>(null);
  const undoObj= JSON.parse(JSON.stringify(ReqBody));
  const isOnlineAssesssment = window.location.href.includes('onlineAssesment/printforpreview');

  const [assignDate, setAssignDate] = useState(convertDate(onlineAssessmentData?.['startDate']) || null as any);
  const [startTime, setStartTime] = useState(dayjs(`2022-04-17T${timeConverter(onlineAssessmentData?.['startTime'])}`) as any);
  const [dueDate, setDueDate] = useState(convertDate(onlineAssessmentData?.['endDate']) || null as any);
  const [endTime, setEndTime] = useState(dayjs(`2022-04-17T${timeConverter(onlineAssessmentData?.['endTime'])}`) as any);
  const stateDetails = JSON.parse(getLocalStorageDataBasedOnKey('state') as string) as State;

  const handleOnDragReleaseEnd = (params: any) => {
    setTimeout(() => {
      const getLatestOrder = gridRef.current?.grid?.getItems().map((item:any) => {
        return JSON.parse(item.getElement()?.getAttribute('data-item-list') || '') || {}
      }) as any
      getLatestOrder &&
        getLatestOrder?.forEach((item: TemplateList, index:number) => (item.sectionSequence = index + 1))
        const checkUpdatedArray = JSON.stringify(templateHeaderGlobal) === JSON.stringify([...getLatestOrder as any,undoObj?.headerDetails?.find((sec:any)=>(sec?.sectionTypeKey == "dateSection"))])
      // const checkUpdatedArray = compareArrays(templateHeaderGlobal, getLatestOrder)
      // const checkUpdatedArray = _.isEqual(templateHeaderGlobal, getLatestOrder)
      if (!checkUpdatedArray) {
        const dateSec=ReqBody?.headerDetails?.filter((sec:any)=>(sec?.sectionTypeKey == "dateSection"))
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

  useEffect(() => {
    if(isOnlineAssesssment) {
      localStorage.setItem('onlineAssessment', JSON.stringify({
        startDate: assignDate?.hasOwnProperty(".$d") ? moment(assignDate.$d).format("DD-MM-YYYY") : moment(assignDate).format("DD-MM-YYYY"),
        endDate: dueDate?.hasOwnProperty(".$d") ? moment(dueDate.$d).format("DD-MM-YYYY") : moment(dueDate).format("DD-MM-YYYY"),
        startTime: moment(startTime.$d).format('hh:mm A'),
        endTime: moment(endTime.$d).format('hh:mm A'),
      }));
    }
  }, [assignDate,startTime,dueDate,endTime]);


  const handleTimeDifference = (selectedTime: number) => {
    const dateAssigned = new Date(assignDate);
    const dateDue = new Date(dueDate);
    if (areDatesEqual(dateAssigned, dateDue)) {
      const differenceInMinutes = endTime !== "" && endTime?.diff(startTime, 'minutes');
      if (differenceInMinutes < selectedTime) {
        setStartTime("");
        setEndTime("");
      }
    }
    else {
      const convertedStartDate = moment(assignDate).format("YYYY-MM-DD");
      const convertedEndDate = moment(dueDate).format("YYYY-MM-DD");

      const convertedStartTime = moment(startTime?.$d).format("HH:mm:ss");
      const convertedEndTime = moment(endTime?.$d).format("HH:mm:ss");

      const startDateTime = new Date(`${convertedStartDate}T${convertedStartTime}`);
      const endDateTime = new Date(`${convertedEndDate}T${convertedEndTime}`);

      const differenceInMinutes = (endDateTime?.getTime() - startDateTime?.getTime()) / (1000 * 60);
      if (differenceInMinutes < selectedTime) {
        setStartTime("");
        setEndTime("");
      }
    }
  }

  useEffect(() => {
    if (!!totalTime) {
      handleTimeDifference(Number(totalTime));
    }
  }, [totalTime])

  const OnlineAssessmentHeader = () => {
    return (
      isOnlineAssesssment && <Box sx={{pointerEvents:'auto'}}>
        <Box className="row mt-4">
          <div className="col-6 mt-2 datepickerContainer">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Start Date"
                inputFormat={"ddd D MMM, YYYY"}
                value={assignDate}
                onChange={(e:any)=> setAssignDate(e)}
                minDate={moment(new Date(), "YYYY-MM-DD")}
                maxDate={moment(stateDetails.currentAcademic?.endDate, "YYYY-MM-DD")}
                renderInput={(params: any) => <TextField {...params} style={{ backgroundColor: "#f4f6f9" }} />}
              />
            </LocalizationProvider>
          </div>
          <div className='col-6 mt-2 timePickerContainer timePickerContainerData'>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                label="Start Time"
                className={highlightstartTime ? "textfield-withBorder" : ""}
                inputFormat={"h:mm a"}
                value={startTime}
                minTime={moment().add(10, 'minutes')}
                onChange={(e: any) => { setStartTime(e); setHighlightStartTime(false) }}
                
                renderInput={(params: any) => (
                  <TextField
                    style={{ backgroundColor: "#f4f6f9" }}
                    {...params}
                  />
                )}
              />
            </LocalizationProvider>
          </div>
        </Box>
        <Box className="row mt-4">
          <div className='col-6 mt-2 datepickerContainer'>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Due Date"
                inputFormat={"ddd D MMM, YYYY"}
                value={dueDate}
                onChange={(e:any) => setDueDate(e)}
                disabled={!assignDate}
                minDate={moment(assignDate, "YYYY-MM-DD")}
                maxDate={moment(stateDetails.currentAcademic?.endDate, "YYYY-MM-DD")}
                renderInput={(params: any) => <TextField {...params} style={{ backgroundColor: "#f4f6f9" }} />}
              />
            </LocalizationProvider>
          </div>
          <div className='col-6 mt-2 timePickerContainer timePickerContainerData'>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                label="Due Time"
                inputFormat={"h:mm a"}
                value={endTime}
                onChange={(e:any)=> setEndTime(e)}
                disabled={!startTime}
                minTime={areDatesEqual(new Date(assignDate), new Date(dueDate)) ? moment(startTime?.$d).add(Number(totalTime), 'minutes') : null}
                //minTime={areDatesEqual(new Date(assignDate), new Date(dueDate)) ? moment(startTime?.$d).add(onlineAssessmentData?.totalTime ? onlineAssessmentData?.totalTime : onlineAssessmentData?.time, 'minutes') : null}
                renderInput={(params: any) => (
                  <TextField
                    {...params}
                    style={{ backgroundColor: "#f4f6f9", }}
                  />
                )}
              />
            </LocalizationProvider>
          </div>
        </Box>
      </Box>
    )
  }
  return (
    <>
      {/* <h2 className='templateCreationTitle'>Customise Header</h2> */}
      <Box className={`TemplateCreationBox ${isCopy ? 'disable-box' : ''}`}>
        <DraggableGrid dragEnabled={!isOnlineAssesssment} onDragEnd={handleOnDragReleaseEnd} dragHandle={'.TemplateBoxIcon'} ref={gridRef}>
          {templateHeaderGlobal?.map((item:any, index:number) => {
            return(
              <>
              {item?.sectionTypeKey != "dateSection" &&
            <div
              className='item'
              key={`_${index}`}
              data-itemid={`${index}`}
              data-item-list={JSON.stringify(templateHeaderGlobal[index])}
            >
              <div className='item-content'>
                <div className='TemplateBoxRow' key={item.sectionSequence}>
                  {!isOnlineAssesssment && <div className='TemplateBoxIcon'>
                    <img
                      src={toAbsoluteUrl('/media/menu_icons/Dragable.svg')}
                      alt='dragable'
                    />
                  </div>}
                  {!isOnlineAssesssment && <div className='TemplateEditIcon'>
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
                  </div>}
                        <div className='TemplateBoxContent'>{getContent(item.sectionTypeKey, item, selSubject, subjects, templatePrintEdit, setAnchorEl, setChangedPopoverValue, templateHeaderGlobal, setStateFunction, ReqBody, key || 0, templateFontDetails, OnlineAssessmentHeader, window.location.href.includes('onlineAssesment/printforpreview'), templateJson)}</div>
                </div>
              </div>
            </div>}
            </>
            )
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
