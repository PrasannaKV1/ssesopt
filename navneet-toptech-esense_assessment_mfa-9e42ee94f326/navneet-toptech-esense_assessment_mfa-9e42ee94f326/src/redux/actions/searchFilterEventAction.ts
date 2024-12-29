import { dispatchType } from "../dispatchTypes";

export const searchFilterEventActions = (data: any) => ({
    type: dispatchType?.searchFilter?.allFilter,
    payload: data,
});

export const sectionFilterEventActions = (data: any) => ({
    type: dispatchType?.searchFilter?.sectionFIlter,
    payload: data,
})
