export interface QuestionPaperInterface {
    id: number
    name: string
    marks: number
    description: string
    time: number
    templateID: number
    questionPaperTypeID: number
    gradeID: number
    statusID: number
    examTypeID: number
    statusName: string
    generationModeID: string
    generationMode: string
    questionPaperCourseDetails: any
    questionPaperClassDetails: any
    questionPaperSectionDetails: any
    studentsCount: number
    isSetsPresent: boolean
    isSetsAllocated: boolean
    isMarksUploaded: boolean
    startDate: string
    startTime: string
    endDate: string
    endTime: string
}

export interface StudentList {
    allocationId: number;
    studentId?: number;
    studentName: string;
    className?: string;
    rollNo: string;
    statusId: number;
    statusName: string;
    studentProfileImg?: string
}

export interface AllFilters {
    gradeId: string ;
    subjectId: string ;
    chapterId: string ;
    startDate: string | Date;
    endDate: string | Date;
}
