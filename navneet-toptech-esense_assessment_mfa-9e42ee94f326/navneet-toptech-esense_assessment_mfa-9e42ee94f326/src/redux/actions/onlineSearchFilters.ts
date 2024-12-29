import { onlineDispatchType } from "../onlineAssesmentTypes";


export const onlineSearchFilterEventActions = (data: any) => ({
    type: onlineDispatchType?.onlineSearchFilter?.allFilter,
    payload: data,
});

export const onlineSectionFilterEventActions = (data: any) => ({
    type: onlineDispatchType?.onlineSearchFilter?.sectionFIlter,
    payload: data,
})