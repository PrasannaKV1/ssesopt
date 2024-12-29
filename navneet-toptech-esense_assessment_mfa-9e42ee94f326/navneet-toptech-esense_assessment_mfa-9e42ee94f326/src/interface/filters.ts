export interface Chapter {
    chapterId: number,
    gradeId: number,
    courseId: number,
    chapterName: string,
    SequenceNumber: number
}
export interface Topics {
    topicId: number,
    chapterId: number,
    chapterName: string,
    gradeId: number,
    courseId: number,
    topicName: string,
    SequenceNumber: number
}
export interface Theme {
    id: number,
    name: string,
    order: number
}
export interface QuestionType {
    id: number,
    isMcq: boolean,
    isSubjective: boolean,
    name: string,
    order: number
}
export interface Subject {
    gradeId: number,
    grade: string,
    courseId: number,
    courseName: string,
    publicationId: number,
    courseDisplayName:string
}
export interface Question {
    createdBy: string,
    marks: number,
    question: string,
    questionId: number,
    questionTypeId: number
    questionTypeName: string
}
export interface Grade {
   gradeId: number,
   gradeName: string,
   E_GradeName: string,
   sequence: number,
   statusId: number,
   updatedBy: number,
   updatedOn: string,
   hasStream: boolean,
   es_gradeid: number
}