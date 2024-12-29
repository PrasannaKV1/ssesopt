import axios from "axios";
import { assessGradeApi, assignSetsToStudent, downloadSheetApi, qListScoreApi, questionPaperAPI, selectApi, studentList, studentListNew, studentListingApiForSets, uploadSheetApi } from "./index";
import { queationPaperEndPoints } from "../constants/urls"
import { uploadFailure, uploadProgress, uploadSuccess } from "../redux/actions/uploadActionTypes";
import store from "../redux/store";
import { pageSize, studentTooltip } from "../constants/helper";


export const getQuestionPaperList = async (obj: any) => {
  try {
    const res = await selectApi.get(`question/paper?searchKey=${obj.searchKey}&sortKey=${obj.sortKey}&sortKeyOrder=${obj.sortKeyOrder}&questionPaperTypeId=${obj.questionPaperTypeId}&questionPaperStatus=${obj.questionPaperStatus}&gradeIds=${obj.gradeIds}&courseIds=${obj.courseIds}&pageNo=${obj.pageNo}&pageSize=${obj.pageSize}&minMarks=${obj.minMarks}&maxMarks=${obj.maxMarks}&academicYearIds=${obj.academicYearIds}`);
    if (res.status === 200 || res.status === 201) {
      return res.data;
    }
    return {}
  }
  catch (e) {
    console.error(e)
    return e
  }
}

export const getListGrades = async () => {
  try {
    const res = await selectApi.get(`admin/grade/listGrades`);
    console.log("res aa gya ", res)
    if (res?.status === 200 || res?.status === 201) {
      return res.data.data;
    }
    return {};
  } catch (e) {
    console.error(e);
    return e;
  }
};

export const QuestionPaperTypeapi = async () => {
  try {
    const res = await selectApi.get(`referencedata/question/paper/type`);
    if (res?.status === 200 || res?.status === 201) {
      return res.data.data;
    }
    return {};
  } catch (e) {
    console.error(e);
    return e;
  }
}

export const QuestionPaperModeApi = async () => {
  try {
    const res = await selectApi.get("/referencedata/question/paper/exam/mode");
    if (res?.status === 200 || res?.status === 201) {
      return res.data.data;
    }
    return {};
  } catch (e) {
    console.error(e);
    return e;
  }
}

export const QuestionPaperStatusApi = async () => {
  try {
    const res = await selectApi.get("referencedata/question/paper/status");
    if (res?.status === 200 || res?.status === 201) {
      return res.data.data;
    }
    return {};
  } catch (e) {
    console.error(e);
    return e;
  }
}

export const sectionAPI = async (staffId: number) => {
  return await questionPaperAPI.get(`/admin/teacher/classes/${staffId}`)
    .then((res: any) => {
      return res.data
    })
    .catch((err: any) => {
      return err.response.data
    })
}
export const delQuestionPaperApi = async (Ids: any) => {
  try {
    const res = await selectApi.delete(`question/paper?questionPaperIds=${Ids}`);
    if (res.status === 200 || res.status === 201) {
      return res.data;
    }
    return {}
  }
  catch (e) {
    console.error(e)
    return e
  }
}
export const delSetQuestionPaperApi = async (Ids: any, set: any) => {
  try {
    const res = await selectApi.delete(`question/paper/${Ids}/set/${set}`);
    if (res.status === 200 || res.status === 201) {
      return res.data;
    }
    return {}
  }
  catch (e) {
    console.error(e)
    return e
  }
}
export const QuestionPaperViewApi = async (id: string, forPrint: boolean) => {
  try {
    const res = await selectApi.get(`question/paper/${id}?forPrint=${forPrint}`);
    if (res?.status === 200 || res?.status === 201) {
      return res.data;
    }
    return {};
  } catch (e) {
    console.error(e);
    return e;
  }
}

export const QuestionPaperRandomize = async (body: { questionPaperID: number }) => {
  try {
    const res = await selectApi.post(`question/paper/randomise`, body);
    if (res?.status === 200 || res?.status === 201) {
      return res.data;
    }
    return {};
  } catch (e) {
    console.error(e);
    return e;
  }
}

export const GetQuestionPaperAcademicId = async () => {
  try {
    const res = await questionPaperAPI.post(`${queationPaperEndPoints.academicYear}`, { "page": 1 })
    if (res?.status === 200 || res?.status === 201) {
      return res.data;
    }
    return {};
  } catch (e) {
    console.error(e);
    return e;
  }
}

export const DonePutApi = async (id: number, body: any) => {
  try {
    const res = await selectApi.put(`question/paper/${id}`, body);
    if (res?.status === 200 || res?.status === 201) {
      return res.data;
    }
    return {};
  } catch (e) {
    console.error(e);
    return e;
  }
}

export const setsPostAPI = async (body: { "questionPaperId": number, "numberOfSets": number }) => {
  try {
    const res = await selectApi.post(`question/paper/sets`, body);
    if (res?.status === 200 || res?.status === 201) {
      return res.data;
    }
    return {};
  } catch (e) {
    console.error(e);
    return e;
  }
}

export const statusPostAPI = async (body: { "statusId": number, "questionPaperInfo": [{ "questionPaperId": string, "feedback": string }] }) => {
  try {
    const res = await selectApi.post(`question/paper/status`, body);
    if (res?.status === 200 || res?.status === 201) {
      return res.data;
    }
    return {};
  } catch (e) {
    console.error(e);
    return e;
  }
}

export const QuestionPaperTemplatePreviewApi = async (id: string, setId: string) => {
  try {
    const res = await selectApi.get(`question/paper/${id}/sets/${setId}`);
    if (res?.status === 200 || res?.status === 201) {
      return res.data;
    }
    return {};
  } catch (e) {
    console.error(e);
    return e;
  }
}

export const QuestionPapervalidateName = async (body: any) => {
  try {
    const res = await selectApi.post(`question/paper/validate/name`, body);
    if (res?.status === 200 || res?.status === 201) {
      return res.data;
    }
    return {};
  } catch (e) {
    console.error(e);
    return e;
  }
}

export const dataPostAPI = async (param: { 'QpId': number, 'QpSetId': number }, body: { "date": string, "isEdit": boolean }) => {
  try {
    const res = await selectApi.put(`question/paper/${param?.QpId}/set/${param?.QpSetId}`, body);
    if (res?.status === 200 || res?.status === 201) {
      return res.data;
    }
    return {};
  } catch (e) {
    console.error(e);
    return e;
  }
}

export const getReportList = async (obj: any) => {
  try {
    const res = await selectApi.get(`question/paper/reports?searchText=${obj.searchKey}&pageNo=${obj.pageNo}&pageSize=${obj.pageSize}`);
    if (res.status === 200 || res.status === 201) {
      return res.data;
    }
    return {}
  }
  catch (e) {
    console.error(e)
    return e
  }
}

export const getAssesmentAllocationtList = async (obj: any) => {
  try {
    const res = await selectApi.get(`evaluation/${obj}`);
    if (res.status === 200 || res.status === 201) {
      return res.data;
    }
    return {}
  }
  catch (e) {
    console.error(e)
    return e
  }
}

/**
 * @developer dharmikshah@navneettoptech.com
 * @description this api use for fetch the student list 
 */
// export const getAllStudentListApi = async (body: any) => {
//   try {
//     const res = await studentList.post(`teacher/studentAttendanceByGrade`, body);
//     if (res?.status === 200 || res?.status === 201) {
//       return res.data;
//     }
//     return {};
//   } catch (e) {
//     console.error(e);
//     return e;
//   }
// }

/**
 * @developer shivrajkhetri@navneettoptech.com
 * @description this api use for fetch the student list 
 */
export const getAllStudentListApi1 = async (body: any) => {
  try {
    const res = await studentListNew.get(`/assess/1.0.0/allocation/questionPaper?questionPaperId=${body?.qpId}&setIds=${body?.setId}`);
    if (res?.status === 200 || res?.status === 201) {
      return res.data;
    }
    return {};
  } catch (e) {
    console.error(e);
    return e;
  }
}

/**
 * @developer shivraj.khetri@navneettoptech.com
 * @description this api use for fetch the data  Gradebook Template By ClassId
 */

export const getGradebookTemplateByClassId = async (obj: any) => {
  try {
    const res = await qListScoreApi.post(`gradebook-template/1.0.0/getGradebookTemplateByClassId`, obj);
    if (res.status === 200 || res.status === 201) {
      return res.data;
    }
    return {}
  }
  catch (e) {
    console.error(e)
    return e
  }
}

/**
 * @developer shivraj.khetri@navneettoptech.com
 * @description Upload Answer Sheet Api 
 */

export const uploadSheetByAllocationId = async (obj: any) => {
  try {
    const res = await uploadSheetApi.post(`assess/1.0.0/evaluation/upload/sheets`, obj, {
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          store?.dispatch(uploadProgress(progress));
        } else {
          store?.dispatch(uploadProgress(0)); // or handle it as per your requirement
        }
      }
    });

    if (res.status === 200 || res.status === 201) {
      store?.dispatch(uploadSuccess(res.data));
      return res.data;
    } else {
      store?.dispatch(uploadFailure('Upload failed'));
      return {};
    }
  } catch (e) {
    store.dispatch(uploadFailure(e));
    console.error(e);
    return e;
  }
};

/**
 *  @developer shivraj.khetri@navneettoptech.com
 *  @description this is for download the smaple Api 
 */
export const downloadSheetByAllocationId = async (obj: any) => {
  try {
    const res = await downloadSheetApi.post(`assess/1.0.0/evaluation/downloadExcelForStudentMarks`, obj, { responseType: 'blob' });
    if (res.status === 200 || res.status === 201) {
      return res;
    }
    return {}
  }
  catch (e) {
    console.error(e)
    return e
  }
}

/**
 *  @developer shivraj.khetri@navneettoptech.com
 *  @description this api for listing out the student list 
 */

export const getStudentList = async (obj: any) => {
  try {
    const res = await studentListingApiForSets.post(`user-profile/getStudentDetails`, obj);
    if (res.status === 200 || res.status === 201) {
      return res.data;
    }
    return {}
  }
  catch (e) {
    console.error(e)
    return e
  }
}


/**
 *  @developer shivraj.khetri@navneettoptech.com
 * @description this api Is for assing the set details to students
 */

export const assignSets = async (obj: any, signal: AbortSignal | undefined) => {
  try {

    const config = {
      signal: signal // if user click on button multiple times we abort the API
    };
    const res = await assignSetsToStudent.post(`allocation/sets`, obj, config);
    if (res.status === 200 || res.status === 201) {
      return res.data;
    }
    return {}
  }
  catch (e) {
    console.error(e)
    return e
  }
}

/**
  @developer Dharmik Shah 
*  @description this is for get student ans sheet details 
*/
export const studentAssessmentByAllocationId = async (
  obj: any,
  onlineStudentReportAnalysis?:boolean
) => {
  try {
    let baseUrl = onlineStudentReportAnalysis ? `evaluation/online` : `evaluation`;
    const res = await selectApi.get(`${baseUrl}/studentAssessment/${obj}`);
    if (res.status === 200 || res.status === 201) {
      return res.data;
    }
    return {};
  } catch (e) {
    console.error(e);
    return e;
  }
};

export const getAllStudentListApi = async (body: any) => {
  try {
    const res = await studentList.post(`teacher/studentsByGrade`, body);
    if (res?.status === 200 || res?.status === 201) {
      return res.data;
    }
    return {};
  } catch (e) {
    console.error(e);
    return e;
  }
}

export const deleteAnsSheetApi = async (Id: any) => {
  try {
    const res = await selectApi.delete(`evaluation/sheet/${Id}`, {
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          store?.dispatch(uploadProgress(progress));
        } else {
          store?.dispatch(uploadProgress(0)); // or handle it as per your requirement
        }
      }
    });

    if (res.status === 200 || res.status === 201) {
      store?.dispatch(uploadSuccess(res.data));
      return res.data;
    } else {
      store?.dispatch(uploadFailure('Delete failed'));
      return {};
    }
  } catch (e) {
    store.dispatch(uploadFailure(e));
    console.error(e);
    return e;
  }
};

export const updateMarksErrorType = async (obj: any) => {
  try {
    const res = await selectApi.put(`evaluation`, obj);
    if (res.status === 200 || res.status === 201) {
      return res.data;
    }
    return {}
  }
  catch (e) {
    console.error(e)
    return e
  }
}

export const uploadStudentMarks = async (obj: any) => {
  try {
    const res = await uploadSheetApi.post(`assess/1.0.0/evaluation/uploadStudentMarks`, obj, {
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          store?.dispatch(uploadProgress(progress));
        } else {
          store?.dispatch(uploadProgress(0)); // or handle it as per your requirement
        }
      }
    });

    if (res.status === 200 || res.status === 201) {
      store?.dispatch(uploadSuccess(res.data));
      return res.data;
    } else {
      store?.dispatch(uploadFailure('Upload failed'));
      return {};
    }
  } catch (e) {
    store.dispatch(uploadFailure(e));
    console.error(e);
    return e;
  }
};

export const assignEditSets = async (obj: any, signal: AbortSignal | undefined) => {
  try {

    const config = {
      signal: signal // if user click on button multiple times we abort the API
    };
    const res = await assignSetsToStudent.post(`allocation/editAllocationSets`, obj, config);
    if (res.status === 200 || res.status === 201) {
      return res.data;
    }
    return {}
  }
  catch (e) {
    console.error(e)
    return e
  }
}
export const publishMark = async (obj: any) => {
  try {
    const res = await assignSetsToStudent.post(`evaluation/change/status`, obj);
    if (res.status === 200 || res.status === 201) {
      return res.data;
    }
    return {}
  }
  catch (e) {
    console.error(e)
    return e
  }
}
export const studentWiseReport = async (questionId: any,isOnlineTestReport:boolean) => {
  try {
    let apiBaseUrl = isOnlineTestReport ? `evaluation/online/` : `evaluation/`;
    const res = await assignSetsToStudent.get(
      `${apiBaseUrl}student/questionpaper/${questionId}?pageNo=0&pageSize=${pageSize}`
    );
    if (res.status === 200 || res.status === 201) {
      return res.data;
    }
    return {}
  }
  catch (e) {
    console.error(e)
    return e
  }
}

export const assessmentDataOfStudents = async (questionId: any, studentId?:any,isOnlineStudentAnalysis?:boolean ) => {
  try {
    let baseUrl = isOnlineStudentAnalysis ? `evaluation/online/questionpaper` : `evaluation/questionpaper`
    const url = `${baseUrl}/${questionId}${studentId ? `/student/${studentId}` : ''}`;
    const res = await assignSetsToStudent.get(url);
    if (res.status === 200 || res.status === 201) {
      return res.data;
    }
    return {}
  }
  catch (e) {
    console.error(e)
    return e
  }
}

export const onlineStudentAssessmentData = async(questionId: any, studentId?:any)=>{
try {
    const url = `evaluation/online/studentAssessment/${studentId}?paperAttemptNumber=`;
    const res = await assignSetsToStudent.get(url);
    if (res.status === 200 || res.status === 201) {
      return res.data;
    }
    return {};
} catch (error) {
  console.log('error: ', error);
  return error
}
}

export const onlineQpOnlineAnalysis =async(questionPaperId: any)=>{
 try {
    const url = `evaluation/online/questionpaper/${questionPaperId}`;
    const res = await assignSetsToStudent.get(url);
    if (res.status === 200 || res.status === 201) {
      return res.data;
    }
    return {}
  }
  catch (e) {
    console.error(e)
    return e
  }
}

// this api for getting subject and terms for add score PopUp

export const getSubjectDetails = async (obj: any) => {
  try {
    const res = await studentListingApiForSets.get(`gradebook-template/getSubjectDetails/gradeId/${obj.gradeID}/sectionId/${obj.sectionId}`,);
    if (res.status === 200 || res.status === 201) {
      return res.data;
    }
    return {}
  }
  catch (e) {
    console.error(e)
    return e
  }
}

// this api for getting test type from subject and term id

export const getTestTypeDetails = async (obj: any) => {
  try {
    const res = await studentListingApiForSets.post(`gradebook-template/testTypeDetails`, obj);
    if (res.status === 200 || res.status === 201) {
      return res.data;
    }
    return {}
  }
  catch (e) {
    console.error(e)
    return e
  }
}
// this api for add the student score in GradeBook

export const addScoreToGradeBook = async (obj: any) => {
  try {
    const res = await studentListingApiForSets.post(`bulk-upload/uploadGradebookMarksFromAssessment`, obj);
    if (res.status === 200 || res.status === 201) {
      return res.data;
    }
    return {}
  }
  catch (e) {
    console.error(e)
    return e
  }
}


export const getToolTipData = async (obj: any) => {
  try {
    let res: any;
    if (obj?.key === studentTooltip.option) {
      res = await assignSetsToStudent.get(`evaluation/online/questions/studentDetails/questionpaper/${obj?.questionPaperId}/question/${obj?.questionId}?key=${obj?.key}&optionId=${obj?.optionId}`);
    } else {
      res = await assignSetsToStudent.get(`evaluation/online/questions/studentDetails/questionpaper/${obj?.questionPaperId}/question/${obj?.questionId}?key=${obj?.key}`);
    }
    if (res.status === 200 || res.status === 201) {
      return res.data;
    }
    return {}
  }
  catch (e) {
    console.error(e);
    return e;
  }
}