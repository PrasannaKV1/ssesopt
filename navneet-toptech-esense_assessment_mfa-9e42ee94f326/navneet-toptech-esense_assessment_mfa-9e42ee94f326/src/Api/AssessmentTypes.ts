
import { assessFilterApi, assessGradeApi, courseAPI, mockapi, questionPaperAPI, selectApi, } from "./index"
import { apiEndPoints, baseKey, errorEndPoints,moduleId } from "../constants/urls"
import { ApiEndPoints } from "../interface"

export const baseGradeApi = async (endPoint: keyof ApiEndPoints, gradeUserID: number) => {
    return await assessGradeApi.get(`${apiEndPoints[endPoint]}/${gradeUserID}`)
        .then((res: any) => {
            return res.data
        })
        .catch((err: any) => {
            return err.response.data
        })
}

export const deleteApi = async (id:any) => {
    return await selectApi.delete(`question?questionIds=${id}`)
    .then((res: any) => {
        return res.data
    })
    .catch((err: any) => {
        return err.response.data
    })
}

export const getQuestionApi = async (endPoint: number) => {
    return await selectApi.get(`question/${endPoint}`)
        .then((res: any) => {
            return res?.data?.data
        })
        .catch((err: any) => {
            return err?.response?.data
        })
}

export const postQuestionApi = async (data: any) => {
    return await selectApi.post(`question`, data)
        .then((res: any) => {
            return res.data.result
        })
        .catch((err: any) => {
            return err.response.data
        })
}
export const postMatchTheFollowingApi = async (data: any) => {
    return await selectApi.post(`question/matchthefollowing`, data)
        .then((res: any) => {
            return res.data.result
        })
        .catch((err: any) => {
            return err.response.data
        })
}

export const selectFieldApi = async (endPoint: string) => {
    return await selectApi.get(`${endPoint}`)
        .then((res: any) => {
            return res.data.data
        })
        .catch((err: any) => {
            return err.response.data
        })
}

export const selectFieldErrorApi = async (courseId:string) => {
    return await selectApi.get(`${errorEndPoints?.topics}${errorEndPoints?.pageNo}${0}${errorEndPoints?.pageSize}${1000}${errorEndPoints?.courseId}${courseId}`)
        .then((res: any) => {
            return res.data
        })
        .catch((err: any) => {
            return err.response.data
        })
}

export const selectFieldQueTypeApi = async (subject:string) => {
    return await selectApi.get(`${errorEndPoints?.queTypes}${errorEndPoints?.pageNo}${0}${errorEndPoints?.pageSize}${1000}${subject}`)
        .then((res: any) => {
            return res?.data
        })
        .catch((err: any) => {
            return err?.response?.data
        })
}

export const gridGetApi = async (queryParam:any,pgSize:Number, pageNumber: number) => {
    return await selectApi.get(`${baseKey?.question}${errorEndPoints?.pageNo}${pageNumber}${errorEndPoints?.pageSize}${10}&${queryParam}`)
        .then((res: any) => {
            return res?.data
        })
        .catch((err: any) => {
            return err?.response?.data
        })
}
export const previewQuestionBankWithScroll = async (queryParam:any) => {
    let params=`question/admin/preview?courseIds=${queryParam?.subjectId}&questionId=${queryParam?.questionId}&minMarks=${queryParam?.minMarks}&maxMarks=${queryParam?.maxMarks}&questionTypeIds=${queryParam?.questionTypeId!=0?queryParam?.questionTypeId:''}&themeIds=${queryParam?.themeId}&chapterIds=${queryParam?.chapterId}&topicIds=${queryParam?.topicId}&marks=${queryParam?.marks}&isPublic=${queryParam?.isPublic}&text=${queryParam?.text}&gradeIds=${queryParam?.gradeId}`;

    if(queryParam?.sortOrder && queryParam?.sortOrder.trim() !==""){
        params = params+`&sortKey=marks&sortOrder=${queryParam?.sortOrder}`
    }
    if(queryParam?.forQPListing){
        params = params+`&forQPListing=${queryParam?.forQPListing}&createdByIds=${queryParam?.createdByIds}&excludedQIds=${queryParam?.excludedQIds}&questionLevelIds=${queryParam?.questionLevelIds}`
    }
    
    if(params){
        return await selectApi.get(params) 
        .then((res: any) => {
            return res?.data
        })
        .catch((err: any) => {
            return err?.response?.data
        })
    }    
}

export const previewGetApi = async (previewId:any) => {
    return await selectApi.get(`${apiEndPoints?.question}/${previewId}?forQPListing=true`)
        .then((res: any) => {
            return res?.data
        })
        .catch((err: any) => {
            return err?.response?.data
        })
}

export const qbPreviewGetApi = async (previewId:any) => {
    return await selectApi.get(`${apiEndPoints?.question}/${previewId}`)
        .then((res: any) => {
            return res?.data
        })
        .catch((err: any) => {
            return err?.response?.data
        })
}

export const questionPutApi = async (id:number,data:any) => {
    return await selectApi.put(`${apiEndPoints?.question}/${id}`,data)
        .then((res: any) => {
            return res.data
        })
        .catch((err: any) => {
            return err.response.data
        })
}
export const questionPutApiForComprehensive = async (id:number,data:any) => {
    return await selectApi.put(`${apiEndPoints?.question}/comprehensive/${id}`,data)
        .then((res: any) => {
            return res.data
        })
        .catch((err: any) => {
            return err.response.data
        })
}
export const questionPutApiForMTF = async (id:number,data:any) => {
    return await selectApi.put(`${apiEndPoints?.question}/matchthefollowing/${id}`,data)
        .then((res: any) => {
            return res.data
        })
        .catch((err: any) => {
            return err.response.data
        })
}

export const comprehensivePostApiCall = async (data:any) => {
    return await selectApi.post(`question/comprehensive`,data)
        .then((res: any) => {
            return res?.data
        })
        .catch((err: any) => {
            return err?.response?.data
        })
}

export const comprehensivePutApiCall = async (id:any,data:any) => {
    return await selectApi.post(`question/comprehensive/${id}`,data)
        .then((res: any) => {
            return res?.data
        })
        .catch((err: any) => {
            return err?.response?.data
        })
}

export const baseFilterApi = async (endPoint:string,body:any) => {
    return await assessFilterApi.post(endPoint,body)
        .then((res: any) => {
            return res?.data
        })
        .catch((err: any) => {
            return err?.response
        })
}

export const getThemesApi = async (body:any) => {
    return await questionPaperAPI.post(`curriculum/getThemesByCourseID`,body)
        .then((res: any) => {
            return res?.data
        })
        .catch((err: any) => {
            return err?.response
        })
}

export const getCourseId = async (staffId:number) => {
    return await courseAPI.get(`${baseKey?.course}${staffId}`)
        .then((res: any) => {
            return res.data
        })
        .catch((err: any) => {
            return err.response.data
        })
}
export const createdByReplaceApi = async (endPoint: string) => {
    return await selectApi.get(`${endPoint}`)
        .then((res: any) => {
            return res.data.data
        })
        .catch((err: any) => {
            return err.response.data
        })
}

export const putReplaceApi = async (param:any,body:any) => {
    return await mockapi.put(`assess/question/paper/${param}`,body)
        .then((res: any) => {
            return res.data.data
        })
        .catch((err: any) => {
            return err.response.data
        })
}

export const chaptersWithTheme = async(body:any)=>{
    return await assessFilterApi.post("chaptersWithTheme",body)
        .then((res: any) => {
            return res.data.data
        })
        .catch((err: any) => {
            return err.response.data
        })
}

export const getQuestionMIFApi = async (endPoint: number) => {
    return await selectApi.get(`question/${endPoint}?forQPListing=true`)
        .then((res: any) => {
            return res?.data?.data
        })
        .catch((err: any) => {
            return err?.response?.data
        })
}

export const getadminList = async () => {
    return await courseAPI.get(`${baseKey?.adminList}?moduleId=${moduleId}`)
        .then((res: any) => {
            return res?.data?.data
        })
        .catch((err: any) => {
            return err.response.data
        })
}

export const postApproval = async (data: any) => {
    return await selectApi.post(`question/paper/approval`, data)
        .then((res: any) => {
            return res.data.result
        })
        .catch((err: any) => {
            return err.response.data
        })
}

export const getVersionHistory = async (id: number) => {
    return await selectApi.get(`question/paper/${id}/versions`)
        .then((res: any) => {
            return res.data
        })
        .catch((err: any) => {
            return err.response.data
        })
}