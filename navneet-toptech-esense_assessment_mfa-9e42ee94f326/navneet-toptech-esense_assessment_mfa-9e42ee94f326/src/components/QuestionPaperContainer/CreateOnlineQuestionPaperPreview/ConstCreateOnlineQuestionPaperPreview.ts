export const questionType = {
  questionPaperSet: 1,
  questionPaperFromParent: 2,
}

export interface TypeStudentSearch {
  id: number;
  section: string;
  name: string;
  other?: string | number;
}

export interface TypeOnlineQuestionForm {
  questionPaperDescription: string;
  assignSections: string[];
  allocationDate: Date;
  allocationTime: string;
  assessmentFinishDate: Date;
  assessmentFinishTime: string;
  lateSubmissionAllowed: boolean;
  excludeStudents: TypeStudentSearch[];
}

export const DefaultOnlineQuestionFormValue = {
  questionPaperDescription: '',
  assignSections: [],
  allocationDate: '',
  allocationTime: '',
  assessmentFinishDate: '',
  assessmentFinishTime: '',
  lateSubmissionAllowed: false,
  excludeStudents: [],
};

export const changeTimeFormat = (paramsDate: Date) => {
  let date = new Date(paramsDate);
  let hours = date.getHours();
  let minutes: any = date.getMinutes();
  let newformat = hours >= 12 ? 'PM' : 'AM';
  let HH;
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  HH = hours < 10 ? `0${hours}` : hours;
  return HH + ':' + minutes + ' ' + newformat;
};
export const changeDateFormat = (paramsDate: Date) => {
  const month = (paramsDate.getMonth() + 1).toString().padStart(2, '0');
  const day = paramsDate.getDate().toString().padStart(2, '0');
  const year = paramsDate.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
};
