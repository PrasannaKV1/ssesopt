export interface EvaluationTablePayloadInterface {
    firstName: string
    lastName: string
    grade: number
    division: string
    rollNumber: number
    status: string
    profile: string
}

export interface AvtarInterface {
    firstName: string
    lastName?: string
    profile?: string
    studentImg?: boolean
}

export interface EvaluationQuestionListInterface {
    id: string,
    title: string,
    grade: string,
    marks: number,
    subjectId: string,
    subject: string,
    topic: string,
    studentCount: number
    status: string  // online / offline
}

interface QuestionPaperCourseDetailsInterface {
    courseID?: number | string
    courseName?: string
}

interface QuestionPaperClassDetailsInterface {
    classId?: number | string
    className?: string
}

interface QuestionPaperSectionDetailsInterface {
    sectionID?: number | string
    sectionName?: string
}

// TODO : Actual Question Paper Payload
export interface EvaluationQuestionListInterface1 {
    id: string
    name: string
    description: string
    time: number
    templateID: number
    questionPaperTypeID: number
    marks: number
    statusID: number
    gradeID: number
    examTypeID: number
    statusName: string
    generationModeID: number
    generationMode: string
    qustionPaperPreview: void
    handleQuestionMenuEvent: void
    questionPaperCourseDetails?: QuestionPaperCourseDetailsInterface[]
    questionPaperClassDetails?: QuestionPaperClassDetailsInterface[]
    questionPaperSectionDetails?: QuestionPaperSectionDetailsInterface[]
    studentsCount?: number
}

export interface StudentListInterface {
    marks?: any
    studentId?: number //TODO 
    firstName: string // TODO 
    lastName: any //TODO 
    rollNumber: string //TODO
    className: string //TODO 
    courseId: number // TODO
    classId: number // TODO
    photo?: any
    seaction?: string // TODO
    sectionId?: string | number, //TODO 
    isAnswerSheetUploaded?: boolean // TODO
}

export interface StudnetListInterfaceData {
    section: string,
    marks?: any,
    sectionId: number,
    studentId: number,
    firstName: string,
    lastName: string,
    rollNumber: string,
    className: string,
    courseIds: any[],
    classId: number,
    allocationId: number,
    middleName?: string,
    studentProfileImg ? : string 
    isAnswerSheetUploaded?: boolean,
    isMarksUploaded?: boolean,
    obtainedMarks: number,
    totalMarks: number,
    isMarksPublish?: any
    status: string
}

/**
 *  @description this is Gredbook student list Interface 
 */

export interface GredbookStudentList {
    StudentID?: number;
    studentfirstname?: string;
    studentlastname?: string | null;
    admissionnumber?: string;
    admissionDate?: string; // Assuming ISO 8601 format
    emailid?: string | null;
    UserName?: string;
    PhoneNumber?: string;
    UserID?: number;
    ClassID?: number;
    ClassName?: string;
    teacherid?: number;
    teacherfirstname?: string;
    teacherlastname?: string;
    photoid?: number;
    photoname?: string;
    photopath?: string;
    StatusID?: number;
    DOB?: string; // Assuming ISO 8601 format
    Gender?: string;
    BloodGroup?: string | null;
    FatherName?: string | null;
    MotherName?: string | null;
    FatherEmailID?: string | null;
    MotherEmailID?: string | null;
    FatherOccupation?: string | null;
    MotherOccupation?: string | null;
    FatherPhone?: string | null;
    MotherPhone?: string | null;
    Address1?: string | null;
    Address2?: string | null;
    Pincode?: string;
    State?: string;
    City?: string;
    AcademicID?: number;
    RollNumber?: string;
    skill_competencies?: any[]; // Assuming array of any type
    skills_acquired?: any[]; // Assuming array of any type
    extraCurricularActivities?: any[]; // Assuming array of any type
    guardianDetails?: GuardianDetail[];
    IsProfileComplete?: boolean;
    firstName?: string,
    lastName?: string,
    rollNumber?: string,
}

interface GuardianDetail {
    studentId?: number;
    guardianId?: number;
    guardianName?: string;
    guardianContactNumber?: string;
    guardianRelationship?: string;
    guardianEmail?: string | null;
}
