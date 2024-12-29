
interface Action {
    type: string;
    payload?: any;
};

interface AllFilters {
    gradeId: string | undefined;
    subjectId: string | undefined;
    chapterId: string | undefined;
    startDate: string | Date | undefined;
    endDate: string | Date | undefined;
}

export interface onlineQpMenuEventInterface {
    isLoading?: boolean,
    qMode?: any[],
    qGrade?: any[],
    qSubjects?: any[],
    qPaperType?: any[],
    qpListOnlineAssesment: any[],
    currentQp: any,
    currentQpStudentList: any,
    onlineQPaperStudent: any,
    qpChapters: any,
    duplicateStudentList: any,
    qpDuplicatePaper: any,
    currentFilterName: any,
    questionPaperId: any,
}

const initialState: onlineQpMenuEventInterface = {
    isLoading: false,
    qMode: [],
    qGrade: [],
    qSubjects: [],
    qPaperType: [],
    qpListOnlineAssesment: [],
    currentQp: {},
    currentQpStudentList: [],
    onlineQPaperStudent: {},
    qpChapters: [],
    duplicateStudentList: [],
    qpDuplicatePaper: [],
    currentFilterName: [],
    questionPaperId: null,
}

export const onlineQpMenuEvent = (state = initialState, action: Action) => {
    if (action.type) {
        switch (action.type) {
            case "LOADER":
                const isLoaderPayload = action?.payload;

                return {
                    ...state,
                    isLoading: isLoaderPayload
                };
                break;
            case "QPLIST":
                const qpList = action?.payload;
                return {
                    ...state,
                    qpListOnlineAssesment: qpList
                };
                break;
            case "ONLINE_QGRADES":
                const qGrade = action?.payload;
                if (qGrade) {
                    return {
                        ...state,
                        qGrade: qGrade
                    }
                }
                break;
            case "ONLINE_QSUBJECTS":
                const qSubjects = action?.payload;
                if (qSubjects) {
                    return {
                        ...state,
                        qSubjects: qSubjects
                    }
                }
                break;
            case "ONLINE_QPAPER_TYPE":
                const qPaperType = action?.payload;
                if (qPaperType) {
                    return {
                        ...state,
                        qPaperType: qPaperType
                    }
                }
                break;
            case "ONLINE_CURRENT_QP_STUDENT_LIST":
                const currentQPStudentList = action?.payload;
                if (currentQPStudentList) {
                    return {
                        ...state,
                        currentQpStudentList: currentQPStudentList
                    }
                }
                break;
            case "ONLINE_QPAPER_STUDENT":
                const qPaperStudent = action?.payload;
                if (qPaperStudent) {
                    const { qId, data } = qPaperStudent;
                    const existingQPaperStudent = state.onlineQPaperStudent || {};

                    if (!existingQPaperStudent[qId]) {
                        return {
                            ...state,
                            onlineQPaperStudent: {
                                ...existingQPaperStudent,
                                [qId]: data
                            }
                        };
                    }

                    // TODO this condition is applicable to initial sets allocation
                    if (existingQPaperStudent[qId] && existingQPaperStudent[qId].length === 0 && data) {
                        return {
                            ...state,
                            onlineQPaperStudent: {
                                ...existingQPaperStudent,
                                [qId]: data
                            }
                        };
                    }

                    if (existingQPaperStudent[qId] && existingQPaperStudent[qId].length !== 0 && data) {
                        return {
                            ...state,
                            onlineQPaperStudent: {
                                ...existingQPaperStudent,
                                [qId]: data
                            }
                        };
                    }
                }
                return state;
            case "ONLINE_CURRENT_QUESTIONS":
                const currentQuestion = action?.payload;
                if (currentQuestion) {
                    return {
                        ...state,
                        currentQp: currentQuestion
                    };
                }
                if (!currentQuestion) {
                    return {
                        ...state,
                        currentQp: {}
                    };
                }
                return state;
            case "ONLINE_QP_CHAPTERS":
                const currentQPChapters = action?.payload;
                if (currentQPChapters) {
                    return {
                        ...state,
                        qpChapters: currentQPChapters
                    }
                }
                break;
            case "ONLINE_DUPLICATE_QP_STUDENT_LIST":
                const duplicateQpStudentList = action?.payload;
                if (duplicateQpStudentList) {
                    return {
                        ...state,
                        duplicateStudentList: duplicateQpStudentList
                    }
                }
                break;
            case "ONLINE_DUPLICATE_QP_PAPER":
                const duplicatePaperDetails = action?.payload;
                if (duplicatePaperDetails) {
                    return {
                        ...state,
                        qpDuplicatePaper: duplicatePaperDetails
                    }
                }
                break;
            case "ONLINE_QP_REMOVE":
                const { qpID } = action?.payload;
                if (qpID) {
                    const updatedOnlineQPaperStudent = { ...state.onlineQPaperStudent };
                    delete updatedOnlineQPaperStudent[qpID];

                    const updatedQpListOnlineAssesment = state.qpListOnlineAssesment.filter(
                        (qp: any) => qp.id !== qpID
                    );

                    return {
                        ...state,
                        onlineQPaperStudent: updatedOnlineQPaperStudent,
                        qpListOnlineAssesment: updatedQpListOnlineAssesment
                    };
                }
                break;
            case "ONLINE_CURRENT_FILTER_GRADE_NAME":
                const gradeSectionName = action?.payload;
                if (gradeSectionName) {
                    return {
                        ...state,
                        currentFilterName: gradeSectionName
                    }
                }
                break;
            case "ONLINE_QUESTION_PAPER_ID":
                const questionId = action?.payload;
                if(questionId) {
                    return {
                        ...state,
                        questionPaperId: questionId
                    };
                }
                break;    
            default:
                return {
                    ...state
                }             
        }
    } else {
        return {
            ...state
        }
    }
}
