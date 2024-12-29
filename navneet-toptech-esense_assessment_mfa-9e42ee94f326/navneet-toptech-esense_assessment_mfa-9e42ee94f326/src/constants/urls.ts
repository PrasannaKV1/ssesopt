import { ApiEndPoints } from '../interface';
import { LocalStorageState } from '../types/assessment';

export const baseURL = process.env.REACT_APP_MOCK_URL;
export const assessBaseURL = process.env.REACT_APP_URL;
export const assessGradeURL = process.env.REACT_APP_GRADE_URL;
export const assessmentSheetBaseUrl = process.env.REACT_APP_ASSESSMENT_BASE_URL
export const assessFilterURL = process.env.REACT_APP_FILTER_URL;
export const courseIdURL = process.env.REACT_APP_COURSE_URL;
export const TemplateURL = process.env.REACT_APP_TEMPLATE_BASE_URL;
export const mock = process.env.REACT_APP_URL_MOCK;
export const fileURL = process.env.REACT_APP_FILE_URL;
export const studentUrl = process.env.REACT_APP_TEACHER_API_BASE_URL;
export const errorAnalysis =process.env.REACT_APP_ERROR_API;

// TODO : online assesment 
export const onlineAssesmentBaseURL  = process.env.REACT_APP_ONLINE_ASSES

export const authToken = localStorage.getItem('auth_token');
const stateDetails: LocalStorageState | null = JSON.parse(localStorage.getItem('state') || '{}');
export const x_tenant_id: string = stateDetails?.tenant?.tenantId || '';

export const apiEndPoints: ApiEndPoints = {
  topics: 'topics',
  theme: 'assess/theme',
  questionType: 'questionType',
  chapter: 'chapter',
  subject: 'subject',
  question: 'question',
  staffActiveGrades: '/staffActiveGrades',
  gradeList: 'getCoursesAndStreams/36',
  grade: 'grade',
};
export const PAGE_SIZE = 50;

export const baseKey = {
  question: 'question?',
  searchId: '&questionTypeIds=',
  searchQue: '&searchQuestion=',
  course: 'curriculum/courses/',
  adminList: 'teacher/lessonPlan/adminList',
};

export const errorEndPoints = {
  topics: 'referencedata/question/error/type?',
  pageNo: 'pageNo=',
  pageSize: '&pageSize=',
  queTypes: 'referencedata/question/type/template?',
  objective: 'question/objective',
  error: 'question/error/type',
  questionLevel: 'question/level',
  courseId: '&courseId=',
};
export const queationPaperEndPoints = {
  templateSelection: 'user-profile/template?auto=true',
  gradeSection: 'user-profile/getSectionsForGrades?',
  gradeId: 'user-profile/&gradeId=',
  academicId: 'user-profile/&academicId=',
  academicStatusId: 'user-profile/&academicStatusId=',
  getStudentDetails: 'user-profile/getStudentDetails',
  questionPaper: 'question/paper',
  duplicateQus: 'question/paper/duplicate',
  fontDetails: 'referencedata/question/paper/template/configuration',
  radioValue: 'question/paper/template?',
  approval: 'question/paper/approval',
  academicYear: 'schoolAdmin/listAcademicYear',
  adminList: 'teacher/lessonPlan/adminList',
};
//export const tabElement = [{ label: "Question Papers", url: "" }, { label: "Evaluation", url: "" }, { label: "Reports", url: "" }, { label: "Question Bank", url: "" }, { label: "Templates", url: "" }]
export const tabElement = [
  { label: 'Question Papers', url: '' },
  { label: 'Question Bank', url: '' },
];
export const tabQuestionPaperElement = [
  { label: 'Overview', url: '' },
  { label: 'Students', url: '' },
  { label: 'Milestones', url: '' },
  { label: 'Timetable', url: '' },
  { label: 'Assessments', url: '' },
  { label: 'Discussions & Doubts', url: '' },
  { label: 'Live Classes', url: '' },
  { label: 'Live Classes', url: '' },
];
export const tabQuestionPaperInnerElm = [
  { label: 'Homework', url: '' },
  { label: 'Tests', url: '' },
  { label: 'Assignments', url: '' },
  { label: 'Corrections', url: '' },
];
export const adminQuesPapTabElement = [
  { label: 'Support Tickets', url: '' },
  { label: 'Leave Requests', url: '' },
  { label: 'Question Papers', url: '' },
];
export const moduleId = 17;

export const onlineQueationPaper = {
  getSelection: 'admin/teacher/classes/',
  studentAttendanceByCourse: 'teacher/studentAttendanceByCourseForMultipleClasses',
  submit: '/allocation',
};
