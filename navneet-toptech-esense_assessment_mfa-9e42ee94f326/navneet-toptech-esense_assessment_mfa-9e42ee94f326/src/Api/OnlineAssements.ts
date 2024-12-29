
import { deletedQp, getChapters, getGreads, getOnlineAssesmentQp, getStudentListing, getSubject, questionPaperAPI, selectApi } from "./index";

/**
 * @developer shivrajkhetri@navneettoptech.com
 * @function getQuestionPaperList
 * @description "this api is for get the question paper which are cretaed for online assesment "
 */

export const getQuestionPaperList = async (obj: any) => {
    const { searchKey, sortKey, sortKeyOrder, questionPaperTypeId, questionPaperStatus, gradeIds, courseIds, pageNo, pageSize, chapterIds, maxMarks, academicYearIds, startDate, endDate, examModeId
    } = obj;

    try {
        const res = await getOnlineAssesmentQp.get('question/paper', {
            params: {
                searchKey,
                sortKey,
                sortKeyOrder,
                questionPaperTypeId,
                questionPaperStatus,
                gradeIds,
                courseIds,
                pageNo,
                pageSize,
                chapterIds,
                maxMarks,
                academicYearIds,
                startDate,
                endDate,
                examModeId
            }
        });

        if (res.status === 200 || res.status === 201) {
            return res?.data?.baseResponse;
        }

        return {};
    } catch (e) {
        console.error(e);
        return e;
    }
}

/**
 * @developer shivrajkhetri@navneettoptech.com
 * @param obj  
 * @returns 
 */
export const getStudentList = async (obj: any) => {
    const { sortKey,
        sortKeyOrder,
        questionPaperId,
        classId,
        studentName
    } = obj;

    try {
        const res = await getStudentListing.get('allocation/online', {
            params: {
                sortKey,
                sortKeyOrder,
                questionPaperId,
                classId,
                studentName
            }
        });

        if (res.status === 200 || res.status === 201) {
            return res?.data;
        }

        return {};
    } catch (e) {
        console.error(e);
        return e;
    }
}

/**
 *  @developer shivrajkhetri@navneettoptech.com 
 *  @description this api is use for fetch the Gread details for online assesment 
 */

export const getGreadsDetails = async (obj: any) => {
    try {
        const res = await getGreads.get(`library/staffActiveGrades/${obj}`);
        if (res.status === 200 || res.status === 201) {
            return res?.data;
        }

        return {};
    } catch (e) {
        console.error(e);
        return e;
    }
}


export const getSubjectDetails = async (obj: any) => {
    try {
        const res = await getSubject.post('library/subjects', obj);

        if (res.status === 200 || res.status === 201) {
            return res.data;
        }

        return {};
    } catch (e) {
        console.error('Error in getSubjectDetails:', e);
        return e;
    }
}

export const getChapterDetails = async (obj: any) => {
    try {
        const res = await getChapters.post('library/chaptersWithTheme', obj);

        if (res.status === 200 || res.status === 201) {
            return res.data;
        }

        return {};

    } catch (error) {
        console.error('Error in getChapterDetails:', error);
        return error;
    }
}

/**
 *  @developer dharmikshah@navneettoptech.com 
 *  @description this api is use for duplicate question paper 
 */
export const getDuplicatePaper = async (obj: any) => {
    try {
        const res = await getStudentListing.post('question/paper/duplicate', obj);
        if (res.status === 200 || res.status === 201) {
            return res?.data;
        }
        return {};
    } catch (e) {
        console.error(e);
        return e;
    }
}
/**
 *  @developer dharmikshah@navneettoptech.com 
 *  @description this api is use tp assign student for duplicate question paper 
 */
export const assignStudentToPaper = async (obj: any) => {
    try {
        const res = await getStudentListing.post('allocation', obj);
        if (res.status === 200 || res.status === 201) {
            return res?.data;
        }
        return {};
    } catch (e) {
        console.error(e);
        return e;
    }
}

//  *  @function deleteQuestionPaper 
//  *  @developer shivrajkhetri@navneettoptech.com
//  *  @description this api is for delete the question paper
//  *


// TODO Single QP delete 
export const deleteQuestionPaper = async (obj: any) => {
    const { questionPaperIds
    } = obj;

    try {
        const res = await deletedQp.delete('question/paper', {
            params: {
                questionPaperIds,
            }
        });

        if (res.status === 200 || res.status === 201) {
            return res?.data;
        }

        return {};
    } catch (error) {
        return error;
    }

}

/**
 *  @developer dharmikshah@navneettoptech.com 
 *  @description this api is use for fetch the chapter challenge QP List 
 */

export const chapterChallengeQP = async (obj: any) => {
    try {
        const res = await questionPaperAPI.get(`assess/chapterchallenge?classId=${obj?.classId}&courseId=${obj?.courseId}&gradeId=${obj?.gradeId}&chapterIds=&page=0&pageSize=50&academicId=${obj.academicId}`);
        if (res.status === 200 || res.status === 201) {
            return res?.data;
        }

        return {};
    } catch (e) {
        console.error(e);
        return e;
    }
}

export const markComplete = async (obj: any) => {
    try {
        const res = await questionPaperAPI.post(`assess/markComplete`,obj);
        if (res.status === 200 || res.status === 201) {
            return res?.data;
        }

        return {};
    } catch (e) {
        console.error(e);
        return e;
    }
}
export const assignChapterChallenge = async (obj: any) => {
    try {
        const res = await selectApi.post(`allocation/auto/allocate?questionPaperId=${obj}`);
        if (res.status === 200 || res.status === 201) {
            return res.data;
        }

        return {};
    } catch (e) {
        console.error(e);
        return e;
    }
}
export const chapterChallenge = async (obj: any) => {
    try {
        const res = await selectApi.post(`question/paper/chapterChallenge`,obj);
        if (res.status === 200 || res.status === 201) {
            return res.data;
        }

        return {};
    } catch (e) {
        console.error(e);
        return e;
    }
}