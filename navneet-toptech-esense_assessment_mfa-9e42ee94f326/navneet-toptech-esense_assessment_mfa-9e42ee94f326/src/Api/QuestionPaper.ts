import { baseData, courseAPI, questionPaperAPI, selectApi} from "./index"
import { apiEndPoints, queationPaperEndPoints } from "../constants/urls"

export const getTemplateListApi = async () => {
    return await baseData.get(`${queationPaperEndPoints.templateSelection}`)
        .then((res: any) => {
            return res.data.data
        })
        .catch((err: any) => {
            return err.response.data
        })
}

export const getGradeSectionApi = async (gradeId:number,academicId:number,academicStatusId:number) => {
    return await questionPaperAPI.get(`${queationPaperEndPoints.gradeSection}${queationPaperEndPoints.gradeId}${gradeId}${queationPaperEndPoints.academicId}${academicId}${queationPaperEndPoints.academicStatusId}${academicStatusId}`)
        .then((res: any) => {
            return res.data.data
        })
        .catch((err: any) => {
            return err.response.data
        })
}

export const studentDetailPostApi = async (data:any) => {
    return await questionPaperAPI.post(`${queationPaperEndPoints.getStudentDetails}`,data)
        .then((res: any) => {
            return res.data
        })
        .catch((err: any) => {
            return err.response.data
        })
}

export const questionPaperPostAPI = async (data:any) => {
    return await selectApi.post(`${queationPaperEndPoints.questionPaper}`,data)
        .then((res: any) => {
            return res.data
        })
        .catch((err: any) => {
            return err.response.data
        })
}

export const questionPaperDuplicatePostAPI = async (data:any) => {
    return await selectApi.post(`${queationPaperEndPoints.duplicateQus}`,data)
        .then((res: any) => {
            return res.data
        })
        .catch((err: any) => {
            return err.response.data
        })
}

export const manualQuestionPaperPostAPI = async (data:any) => {
    return await selectApi.post(`${queationPaperEndPoints.questionPaper}/manual`,data)
        .then((res: any) => {
            return res.data
        })
        .catch((err: any) => {
            return err.response.data
        })
}

export const fontDeatailsDropdown = async () => {
    return await selectApi.get(`${queationPaperEndPoints.fontDetails}`)
        .then((res: any) => {
            return res.data
        })
        .catch((err: any) => {
            return err.response?.data
        })
}

export const fetchHodDetailsAPICall = async (id:any) => {
    return await courseAPI.get(`${queationPaperEndPoints.adminList}?moduleId=${id}`)
        .then((res: any) => {
            return res.data
        })
        .catch((err: any) => {
            return err.response.data
        })
}

export const approvalQpAPICall = async (payload:any) => {
    return await selectApi.post(`${queationPaperEndPoints.approval}`,payload)
        .then((res: any) => {
            return res.data
        })
        .catch((err: any) => {
            return err.response.data
        })
}

export const radioGetAPICall = async (param:string) => {
    return await selectApi.get(`${queationPaperEndPoints.radioValue}${param}`)
        .then((res: any) => {
            return res.data
        })
        .catch((err: any) => {
            return err.response.data
        })
}

export const getReplaceQnsTableApi = async (params:any) => {
    return await selectApi.get('question', { params })
        .then((res: any) => {
            return res.data
        })
        .catch((err: any) => {
            return err.response.data
        })
}
export const getReplaceQnsTablePreview = async (id:any) => {
    return await selectApi.get(`${apiEndPoints?.question}/${id}${"?forQPListing=true"}`)
        .then((res: any) => {
            return res.data
        })
        .catch((err: any) => {
            return err.response.data
        })
}
