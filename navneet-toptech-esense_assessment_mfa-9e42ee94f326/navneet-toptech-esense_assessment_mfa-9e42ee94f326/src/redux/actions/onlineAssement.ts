import { onlineDispatchType } from "../onlineAssesmentTypes";

// TODO : this is for api data loader
export const Loader = (data: any) => ({
  type: onlineDispatchType?.loader,
  payload: data
})

export const onlineAssementQpList = (data: any) => ({
  type: onlineDispatchType?.onlineAssesmentType?.qListMenuEvent,
  payload: data,
});

export const onlineAssementQpModeEventActions = (data: any) => ({
  type: onlineDispatchType?.onlineAssesmentType?.qModeType,
  payload: data,
});

export const onlineAssementQpGradeEventActions = (data: any) => ({
  type: onlineDispatchType?.onlineAssesmentType?.qGrade,
  payload: data,
});


export const onlineAssementQpPaperTypeEventActions = (data: any) => ({
  type: onlineDispatchType?.onlineAssesmentType?.qPaperType,
  payload: data,
});

export const onlineAssementQpSubjectEventActions = (data: any) => ({
  type: onlineDispatchType?.onlineAssesmentType?.qSubjects,
  payload: data,
});


export const onlineAssementQpChapterEventActions = (data: any) => ({
  type: onlineDispatchType?.onlineAssesmentType?.qpChapters,
  payload: data,
});

export const onlineUpdateCurrentQpDetails = (data: any) => ({
  type: onlineDispatchType?.onlineAssesmentType?.currentQuestion,
  payload: data
})


export const onlineQPaperStudentEventActions = (data: any) => ({
  type: onlineDispatchType?.onlineAssesmentType?.qpStudentList,
  payload: data,
});

export const onlineCurrentQPaperStudentEventActions = (data: any) => ({
  type: onlineDispatchType?.onlineAssesmentType?.qpCurrentStudentListing,
  payload: data,
});

export const onlineDuplicateStudentList = (data: any) => ({
  type: onlineDispatchType?.onlineAssesmentType?.qpDuplicateStudentList,
  payload: data,
});

export const onlineDuplicateNewPaper = (data: any) => ({
  type: onlineDispatchType?.onlineAssesmentType?.qpDuplicatePaper,
  payload: data,
})

export const onlinedeleteCurrentQP = (data: any) => ({
  type: onlineDispatchType?.onlineAssesmentType?.removeQp,
  payload: data,
});

export const currentGradeSectionName = (data: any) => ({
  type: onlineDispatchType?.onlineAssesmentType?.gradeSectionName,
  payload: data,
});

export const questionPaperID = (data: any) => ({
  type: onlineDispatchType?.onlineAssesmentType?.questionPaperId,
  payload: data,
});