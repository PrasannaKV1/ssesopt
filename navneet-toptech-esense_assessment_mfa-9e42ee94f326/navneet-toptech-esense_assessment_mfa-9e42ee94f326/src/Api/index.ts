import Axios, { AxiosInstance } from 'axios';
import { TemplateURL, assessBaseURL, assessFilterURL, assessGradeURL, baseURL, courseIdURL, mock, x_tenant_id, fileURL, studentUrl, assessmentSheetBaseUrl, errorAnalysis, onlineAssesmentBaseURL } from '../constants/urls';


const services = (service: AxiosInstance) => {
  service.interceptors.request.use(
    (config) => {
      config.headers['Authorization'] = `Bearer ${localStorage.getItem('auth_token')}`;
      config.headers['x-tenant-id'] = x_tenant_id;
      if (!localStorage.getItem('auth_token')) {
        if (config?.headers?.Authorization) {
          delete config.headers.Authorization
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );
  service.interceptors.response.use(
    (resp: any) => {
      // if (resp?.data?.status == 401) {
      //   localStorage.clear();
      //   window.location.href = '/';
      // } else {
      return resp;
      // }
    },
    (error: any) => {
      // if (error?.response?.status === 503) {
      //   localStorage.clear();
      //   window.location.href = '/';
      // }
      return Promise.reject(error);
    },
  );
};

export const baseData = Axios.create({
  baseURL: baseURL,
});
services(baseData);

export const selectApi = Axios.create({
  baseURL: assessBaseURL,
  headers: { 'Content-Type': 'application/json' },
});
services(selectApi);

export const mockapi = Axios.create({
  baseURL: mock,
  headers: { 'Content-Type': 'application/json' },
});
services(mockapi);

export const assessGradeApi = Axios.create({
  baseURL: assessFilterURL,
  headers: { 'Content-Type': 'application/json', 'authorization': `Bearer ${localStorage.getItem('auth_token')}`, 'x-tenant-id': x_tenant_id },
});
services(assessGradeApi);

export const assessFilterApi = Axios.create({
  baseURL: assessFilterURL,
  headers: { 'Content-Type': 'application/json', 'authorization': `Bearer ${localStorage.getItem('auth_token')}`, 'x-tenant-id': x_tenant_id },
});
services(assessFilterApi);

export const questionPaperAPI = Axios.create({
  baseURL: assessGradeURL,
  headers: { 'Content-Type': 'application/json' },
});
services(questionPaperAPI);

export const courseAPI = Axios.create({
  baseURL: courseIdURL,
  headers: { 'Content-Type': 'application/json' },
});
services(courseAPI);

export const TemplateAPI = Axios.create({
  baseURL: TemplateURL,
  headers: { 'Content-Type': 'application/json' },
});
services(TemplateAPI);

export const imageAPI = Axios.create({
  baseURL: fileURL,
  headers: { 'Content-Type': 'application/json', 'authorization': `Bearer ${localStorage.getItem('auth_token')}`, 'x-tenant-id': x_tenant_id },
});
services(imageAPI);

export const studentList = Axios.create({
  baseURL: studentUrl,
  headers: { 'Content-Type': 'application/json' },
});
services(studentList);

export const qListScoreApi = Axios.create({
  baseURL: assessGradeURL,
  headers: { 'Content-Type': 'application/json', 'authorization': `Bearer ${localStorage.getItem('auth_token')}`, 'x-tenant-id': x_tenant_id },
});
services(qListScoreApi);


export const uploadSheetApi = Axios.create({
  baseURL: assessmentSheetBaseUrl,
  headers: { 'Content-Type': 'multipart/form-data', 'authorization': `Bearer ${localStorage.getItem('auth_token')}`, 'x-tenant-id': x_tenant_id },
});
services(uploadSheetApi);

export const downloadSheetApi = Axios.create({
  baseURL: assessmentSheetBaseUrl,
  headers: { 'Content-Type': 'application/json', 'authorization': `Bearer ${localStorage.getItem('auth_token')}`, 'x-tenant-id': x_tenant_id },
});
services(downloadSheetApi);

export const studentListNew = Axios.create({
  baseURL: assessmentSheetBaseUrl,
  headers: { 'Content-Type': 'application/json' },
});
services(studentListNew);

export const studentListingApiForSets = Axios.create({
  baseURL: assessGradeURL,
  headers: { 'Content-Type': 'application/json' },
});
services(studentListingApiForSets);


export const assignSetsToStudent = Axios.create({
  baseURL: assessBaseURL,
  headers: { 'Content-Type': 'application/json' },
});
services(assignSetsToStudent);


export const errorToStudent = Axios.create({
  baseURL: assessBaseURL,
  headers: { 'Content-Type': 'application/json' },
});
services(errorToStudent);

export const studentOvewView = Axios.create({
  baseURL: assessBaseURL,
  headers: { 'Content-Type': 'application/json' },
});
services(studentOvewView);

/**
 *  @description this api is for Evaluation Report for teacher question and answer section
 */
export const teacherQuestionAndAnswerOvewview = Axios.create({
  baseURL: assessBaseURL,
  headers: { 'Content-Type': 'application/json' },
});
services(teacherQuestionAndAnswerOvewview);

export const getQuestionViewDetails = Axios.create({
  baseURL: assessBaseURL,
  headers: { 'Content-Type': 'application/json' },
});
services(getQuestionViewDetails);

// TODO  this is updated verstion of the above api 
export const getQuestionViewDetailsRevamp = Axios.create({
  baseURL: assessBaseURL,
  headers: { 'Content-Type': 'application/json' },
});
services(getQuestionViewDetailsRevamp);


// TODO online assesment 

/**
 *  @description this api is for Evaluation Report for teacher question and answer section
 */
export const getOnlineAssesmentQp = Axios.create({
  baseURL: assessBaseURL,
  headers: { 'Content-Type': 'application/json' },
});
services(getOnlineAssesmentQp);

export const getStudentListing = Axios.create({
  baseURL: assessBaseURL,
  headers: { 'Content-Type': 'application/json' },
});
services(getStudentListing);

export const getGreads = Axios.create({
  baseURL: onlineAssesmentBaseURL,
  headers: { 'Content-Type': 'application/json' },
});
services(getGreads);

export const getSubject = Axios.create({
  baseURL: onlineAssesmentBaseURL,
  headers: { 'Content-Type': 'application/json' },
});
services(getSubject);

export const getChapters = Axios.create({
  baseURL: onlineAssesmentBaseURL,
  headers: { 'Content-Type': 'application/json' },
});
services(getChapters);

export const deletedQp = Axios.create({
  baseURL: assessBaseURL,
  headers: { 'Content-Type': 'application/json' },
});
services(deletedQp);


export const chapterChallengeGrade = Axios.create({
  baseURL: assessGradeURL,
  headers: { 'Content-Type': 'application/json' },
})
services(chapterChallengeGrade)