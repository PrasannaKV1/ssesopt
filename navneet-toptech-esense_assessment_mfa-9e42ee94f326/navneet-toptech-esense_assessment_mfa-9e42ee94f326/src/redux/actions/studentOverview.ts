import { dispatchType } from "../dispatchTypes";

export const StudentOverViewEventActions = (data: any) => ({
  type: dispatchType?.studentOverViewActionType?.stduentOverViewAction,
  payload: data,
});

export const removeStudentOverViewEventActions = (data: any) => ({
  type: dispatchType?.studentOverViewActionType?.removeStduentOverViewAction,
  payload: data,
});