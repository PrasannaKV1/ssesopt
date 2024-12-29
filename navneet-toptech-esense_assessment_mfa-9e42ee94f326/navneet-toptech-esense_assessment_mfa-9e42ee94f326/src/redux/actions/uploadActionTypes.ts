import { dispatchType } from "../dispatchTypes";

// Action creator for upload progress
export const uploadProgress = (progress: number) => ({
  type: dispatchType?.uploadActionType?.UPLOAD_PROGRESS,
  payload: progress,
});

// Action creator for successful upload
export const uploadSuccess = (data: any) => ({
  type: dispatchType?.uploadActionType?.UPLOAD_SUCCESS,
  payload: data,
});

// Action creator for failed upload
export const uploadFailure = (error: any) => ({
  type: dispatchType?.uploadActionType?.UPLOAD_FAILURE,
  payload: error,
});