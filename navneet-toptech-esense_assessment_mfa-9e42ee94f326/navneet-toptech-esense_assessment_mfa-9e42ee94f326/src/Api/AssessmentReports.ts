import axios from "axios";
import { assessGradeApi, errorToStudent, getQuestionViewDetails, getQuestionViewDetailsRevamp, questionPaperAPI, selectApi, studentOvewView, teacherQuestionAndAnswerOvewview } from "./index";
import { pageSize } from "../constants/helper";

export const getQuestionWiseReport = async (obj: number) => {
    try {
        const res = await selectApi.get(`reports/question/wise/${obj}`);
        console.log("response", res);
        if (res.status === 200 || res.status === 201) {
            console.log("questionWiseReportData", res.data);
            return res.data?.data;
        }
        return {}
    }
    catch (e) {
        console.error(e)
        return e
    }
}
export const getStudentLatestAttempt = async (obj: any) => {
    try {
        const res = await selectApi.get(`reports/latest/attempt?studentId=${obj.studentId}&allocationGroupId=${obj.allocationGroupId}`);
        if (res.status === 200 || res.status === 201) {
            return res.data?.data;
        }
        return {}
    }
    catch (e) {
        console.error(e)
        return e;
    }
}
export const getChapterTopicWiseReport = async (obj: any) => {
    try {
        const res = await selectApi.get(`reports/chapter/topic?studentId=${obj.studentId}&allocationGroupId=${obj.allocationGroupId}`);
        if (res.status === 200 || res.status === 201) {
            return res.data?.data;
        }
        return {}
    }
    catch (e) {
        console.error(e)
        return e;
    }
}
export const getTopicWiseReport = async (obj: number) => {
    try {
        const res = await selectApi.get(`reports/topic/level/${obj}`);
        if (res.status === 200 || res.status === 201) {
            return res.data?.data;
        }
        return {}
    }
    catch (e) {
        console.error(e)
        return e;
    }
}
export const getMultipleAttemptsReport = async (obj: any) => {
    try {
        const res = await selectApi.get(`reports/question/paper/multiple/attempts/?studentId=${obj.studentId}&allocationGroupId=${obj.allocationGroupId}`);
        if (res.status === 200 || res.status === 201) {
            return res.data?.data;
        }
        return {}
    }
    catch (e) {
        console.error(e)
        return e;
    }
}
export const getStudentDetailsForReports = async (obj: any) => {
    try {
        const res = await selectApi.get(`question/paper/allocation/student/${obj.allocationGroupId}`);
        if (res.status === 200 || res.status === 201) {
            return res.data?.data;
        }
        return {}
    }
    catch (e) {
        console.error(e)
        return e;
    }
}


/**
 *  @developer venkataravalinekkanti@navneettoptech.com
 *  @API this Is is fot error analysis for the student
 */

export const errorForReports = async (obj: any) => {
    const { qpId, studentId } = obj;
    try {
        let url = `evaluation/errors/questionpaper/${qpId}`;
        if (studentId) {
            url += `/student/${studentId}`;
        } else {
            url += `?pageNo=0&pageSize=${pageSize}`
        }
        const res = await errorToStudent.get(url);
        if (res.status === 200 || res.status === 201) {
            return res.data?.data;
        }
        return {}
    }
    catch (e) {
        console.error(e)
        return e;
    }
}

/**
 *  @developer shivrajkhetri@navneettoptech.com 
 *  @API this is GET the student overview 
 */

export const studentOvewViewReports = async (obj: any) => {
    const { qpId, studentId, onlineStudentReportAnalysis=false } = obj;
    try {
        let baseUrl = onlineStudentReportAnalysis
          ? `evaluation/online/questionpaper`
          : `evaluation/questions/questionpaper`;
        const res = await studentOvewView.get(`${baseUrl}/${qpId}/student/${studentId}`);
        if (res.status === 200 || res.status === 201) {
            return res.data?.data;
        }
        return {}
    }
    catch (e) {
        console.error(e)
        return e;
    }
}
export const studentOnlineQuestionWiseAnalysis = async (obj: any) => {
    const { qpId, studentId, onlineStudentReportAnalysis=false } = obj;
    try {
        let baseUrl = `evaluation/online/questions/questionpaper`;
        const res = await studentOvewView.get(
            `${baseUrl}/${qpId}/student/${studentId}`
        );
        if (res.status === 200 || res.status === 201) {
            return res.data?.data;
        }
        return {}
    }
    catch (e) {
        console.error(e)
        return e;
    }
}

/**
 * @developer shivrajkhetri@navneettoptech.com
 * @function teacherQAovewview
 * @description this api is for to get the details for Evaluation Report "teacher question and answer overview"
 */


export const teacherQAovewview = async (
  obj: any,
) => {
  const { qpId, isOnlineTestReport } = obj;
  try {
    let baseUrl = isOnlineTestReport ? `evaluation/online` : `evaluation`;
    const res = await teacherQuestionAndAnswerOvewview.get(
      `${baseUrl}/questions/questionpaper/${qpId}`
    );
    if (res.status === 200 || res.status === 201) {
      return res.data?.data;
    }
    return {};
  } catch (e) {
    console.error(e);
    return e;
  }
};

/**
 *  @developer shivrajkhetri@navneettoptech.com
 *  @description this api is from viewDetails of perticular question Id from the Question Paper
 */
export const qpView = async (obj: any) => {
    const { questionId, marks, isPublic } = obj;
    try {
        const res = await getQuestionViewDetails.get(`question/admin/preview`, {
            params: {
                questionId, marks, isPublic
            }
        });
        if (res.status === 200 || res.status === 201) {
            return res.data?.data;
        }
        return {}
    }
    catch (e) {
        console.error(e)
        return e;
    }
}

export const qpViewRevamp = async (obj: any) => {
    const { questionId, marks, isPublic } = obj;
    try {
        const res = await getQuestionViewDetailsRevamp.get(`question/forReports/${questionId}`, {
            params: {
                forQPListing : true // this Is not confirmed what suppose to pass the value so need to connect with BE team 
            }
        });
        if (res.status === 200 || res.status === 201) {
            return res.data;
        }
        return {}
    }
    catch (e) {
        console.error(e)
        return e;
    }
}