import { dispatchType } from "../dispatchTypes";
export const qListMenuEventActions = (data: any) => ({
  type: dispatchType?.assesmentType?.qListMenuEvent,
  payload: data,
});

export const qModeEventActions = (data: any) => ({
  type: dispatchType?.assesmentType?.qModeType,
  payload: data,
});

export const qGradeEventActions = (data: any) => ({
  type: dispatchType?.assesmentType?.qGrade,
  payload: data,
});


export const qPaperTypeEventActions = (data: any) => ({
  type: dispatchType?.assesmentType?.qPaperType,
  payload: data,
});


export const qPaperList = (data: any) => ({
  type: dispatchType?.assesmentType?.qPaperList,
  payload: data,
});


export const qSubjectEventActions = (data: any) => ({
  type: dispatchType?.assesmentType?.qSubjects,
  payload: data,
});


export const qStudentListEventActions = (data: any) => ({
  type: dispatchType?.assesmentType?.qStudentList,
  payload: data,
});

export const qSetsEventActions = (data: any) => ({
  type: dispatchType?.assesmentType?.qPaperSet,
  payload: data,
});

export const qPaperStudentEventActions = (data: any) => ({
  type: dispatchType?.assesmentType?.qPaperStudent,
  payload: data,
});

export const studentSeletectListToUpload = (data: any) => ({
  type: dispatchType?.studentList?.selectedStudentList,
  payload: data,
})

// TODO adding the question and student details for Upload Sheet and Re-Upload Sheet
export const qustionAndStudentDetailsUpdate = (data: any) => ({
  type: dispatchType?.studentList?.getAnswetSheetDetails,
  payload: data
})

export const updateAnswerSheetDetails = (data: any) => ({
  type: dispatchType?.studentList?.updateIsAnswerSheet,
  payload: data
})

export const updatePublishMarksDetails = (data: any) => ({
  type: dispatchType?.studentList?.updatedIsMarksPublish,
  payload: data
})
export const updateUnPublishMarksDetails = (data: any) => ({
  type: dispatchType?.studentList?.updatedIsUnMarksPublish,
  payload: data
})

// TODO this is for sets mapping 
export const setsMapping =(data :any)=>({
  type : dispatchType?.assesmentType?.qPSetsMap,
  payload: data
})

// TODO : this is Not In Use : Please remove from the code if No impact 
export const updateSetDetailsForStudents=(data :any)=>({
  type : dispatchType?.studentList?.updateSetsDetailsForStudent,
  payload : data
})


export const updateQpDetails=(data :any)=>({
  type : dispatchType?.assesmentType?.updateQPKeys,
  payload : data
})

export const updateCurrentQpDetails=(data :any)=>({
  type : dispatchType?.assesmentType?.currentQuestion,
  payload : data
})
