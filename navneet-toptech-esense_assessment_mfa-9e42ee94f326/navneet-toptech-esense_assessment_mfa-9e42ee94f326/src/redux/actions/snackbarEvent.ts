import { dispatchType } from "../dispatchTypes";

export const SnackbarEventActions = (data: any) => ({
    type: dispatchType?.snackbar?.snackbarTost,
    payload: data,
  });