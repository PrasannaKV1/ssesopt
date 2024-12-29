export interface QuestionMetaInfo{
    questionNumber : number,
    statusId : number,
    timeSpent : number,
    score : number
}
export interface QuestionWiseReports{
    allocationID : number,
    studentName : string,
    score : number,
    questionMetaInfo : QuestionMetaInfo[]
}
export interface LatestAttemptReports{
    totalQuestionCount : number,
    correctQuestionCount : number,
    incorrectQuestionCount : number,
    skippedQuestionCount : number,
    revisedQuestionsCount : number
}
export interface Topicinfo{
    topicName : string,
    score : number
}
export interface ChapterTopicWiseReports{
    chapterName:string,
    correctQuestionCount:number,
    incorrectQuestionCount : number,
    skippedQuestionCount : number,
    revisedQuestionsCount : number,
    score : number,
    topicInfo : Topicinfo[],
    totalQuestionCount: number
}
export interface TopicWiseReports{
    studentId : number,
    studentName : string,
    topicReporting : Topicinfo[]
}
export interface ScoreWithDate{
    score : number,
    date : string
}
export interface MultipleAttemptsReports{
    assessmentName : string,
    scoreWithDate : ScoreWithDate[]
}
export interface StudentDetails{
    allocationGroupID : number,
    studentID : number,
    studentName : string,
    statusID : number
}
