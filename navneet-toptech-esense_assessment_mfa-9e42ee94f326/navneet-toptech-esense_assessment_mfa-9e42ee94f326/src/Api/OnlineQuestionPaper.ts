import { courseAPI, questionPaperAPI, selectApi } from '.';
import { onlineQueationPaper } from '../constants/urls';

export const getGradeSectionListApi = async (gradeId: number) => {
  return await questionPaperAPI
    .get(`${onlineQueationPaper?.getSelection}${gradeId}`)
    .then((res: any) => {
      return res.data.data;
    })
    .catch((err: any) => {
      return err.response.data;
    });
};

export const studentAttendanceByCourse = async (params: string | null, data: any) => {
  return await courseAPI
    .post(`${onlineQueationPaper?.studentAttendanceByCourse}${params ? `?${params}` : ''}`, data)
    .then((res: any) => {
      return res.data.data;
    })
    .catch((err: any) => {
      return err.response.data;
    });
};

export const submitStudentAllocation = async (data:any) => {
  return await selectApi
    .post(`${onlineQueationPaper?.submit}`, data)
    .then((res: any) => {
      return res;
    })
    .catch((err: any) => {
      return err.response;
    });
};
