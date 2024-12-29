import { EvaluationQuestionListInterface } from "../../../interface/assesment-interface";

interface Action {
    type: string;
    payload?: any;
};

export interface qMenuEventInterface {
    option?: string | null,
    qPayload?: EvaluationQuestionListInterface[] | null
    qMode?: any[]
    qGrade?: any[],
    qSubjects?: any[],
    qPaperType?: any[],
    qPaperList: any[],
    qStudentList: any[],
    qPaperSet: any,
    qPaperStudent: any,
    qUpdatePaperStudent: any,
    getStudentAndQuestionData: any,
    updateIsAnswerSheet: any,
    setsmapped: any
    currentQp: any
}

const initialState: qMenuEventInterface = {
    option: "",
    qPayload: [],
    qMode: [],
    qGrade: [],
    qSubjects: [],
    qPaperType: [],
    qPaperList: [],
    qStudentList: [],
    qPaperSet: {},
    qPaperStudent: {},
    qUpdatePaperStudent: {},
    getStudentAndQuestionData: {},
    updateIsAnswerSheet: {},
    setsmapped: {},
    currentQp: {}
}

export const qMenuEvent = (state = initialState, action: Action) => {
    if (action.type) {
        switch (action.type) {
            case "QLIST_MENU_EVENT":
                const receiver = action?.payload;
                if (receiver) {
                    state.option = receiver?.option;
                    state.qPayload = receiver?.payload;
                    return {
                        ...state
                    }
                }

                state.option = null;
                state.qPayload = null
                return { ...state }
                break;
            case "QMODE_TYPE":
                const qMode = action?.payload;
                if (qMode) {
                    return {
                        ...state,
                        qMode: qMode
                    }
                }
                break;
            case "QGRADES":
                const qGrade = action?.payload;
                if (qGrade) {
                    return {
                        ...state,
                        qGrade: qGrade
                    }
                }
                break;
            case "QSUBJECTS":
                const qSubjects = action?.payload;
                if (qSubjects) {
                    return {
                        ...state,
                        qSubjects: qSubjects
                    }
                }
                break;
            case "QPAPER_TYPE":
                const qPaperType = action?.payload;
                if (qPaperType) {
                    return {
                        ...state,
                        qPaperType: qPaperType
                    }
                }
                break;
            case "QPAPER_LIST":
                const qPaperList = action?.payload;
                if (qPaperList) {
                    return {
                        ...state,
                        qPaperList: qPaperList
                    }
                }
                break;
            case "QSTUDENT_LIST":
                const qStudentList = action?.payload;
                if (qStudentList) {
                    return {
                        ...state,
                        qStudentList: qStudentList || []
                    }
                }
                break;
            case "QPAPER_SETS":
                const qPaperSet = action?.payload;
                if (qPaperSet) {
                    return {
                        ...state,
                        qPaperSet: qPaperSet || []
                    }
                }
                break;
            case "QPAPER_STUDENT":
                const qPaperStudent = action?.payload;
                if (qPaperStudent) {
                    const { qId, data } = qPaperStudent;
                    const existingQPaperStudent = state.qPaperStudent || {};

                    if (!existingQPaperStudent[qId]) {
                        return {
                            ...state,
                            qPaperStudent: {
                                ...existingQPaperStudent,
                                [qId]: data
                            }
                        };
                    }

                    // TODO this condition is applicable to initial sets allocation
                    if (existingQPaperStudent[qId] && existingQPaperStudent[qId].length === 0 && data) {
                        return {
                            ...state,
                            qPaperStudent: {
                                ...existingQPaperStudent,
                                [qId]: data
                            }
                        };
                    }

                    if (existingQPaperStudent[qId] && existingQPaperStudent[qId].length !== 0 && data) {
                        return {
                            ...state,
                            qPaperStudent: {
                                ...existingQPaperStudent,
                                [qId]: data
                            }
                        };
                    }
                }
                return state;
            case "UPDATE_QPAPER_STUDENT":
                const qUpdatePaperStudent = action?.payload;
                if (qUpdatePaperStudent) {
                    const { qId, data } = qUpdatePaperStudent;
                    const existingqUpdatePaperStudent = state.qUpdatePaperStudent || {};
                    if (existingqUpdatePaperStudent[qId]) {
                        const payaload = existingqUpdatePaperStudent[qId];
                        if (payaload?.is)
                            return {
                                ...state,
                                qUpdatePaperStudent: {
                                    ...existingqUpdatePaperStudent,
                                    [qId]: data
                                }
                            };
                    }
                }
                return state;
            case "CURRENT_QUESTIONS":
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
            case "UPDATE_IS_ANSWER_SHEET":
                const { qId, sId, data, isDelete } = action.payload;
                const updatedQPaperStudent = { ...state.qPaperStudent };

                // Find the corresponding qPaperStudent entry
                if (updatedQPaperStudent[qId]) {
                    updatedQPaperStudent[qId].forEach((student: any) => {
                        if (student.studentId === sId) {
                            if (!isDelete) {
                                // Update when not deleting
                                student.isAnswerSheetUploaded = true;
                                student.answerSheets = data;
                            } else if (student.isAnswerSheetUploaded) {
                                // Update when deleting
                                student.isAnswerSheetUploaded = true;
                                student.answerSheets = data;

                                // Filter out the answer sheet with data[0]?.id
                                const deletedId = data[0]?.id;
                                student.answerSheets = student.answerSheets.filter((sheet: any) => sheet.id != deletedId);

                                // Check if answerSheets is empty and update isAnswerSheetUploaded accordingly
                                if (student.answerSheets.length === 0) {
                                    student.isAnswerSheetUploaded = false;
                                }
                            }
                        }
                    });
                } else {
                    // Handle case when qId is not found
                    console.warn(`qId ${qId} not found in qPaperStudent`);
                    return state;
                }

                // Return updated state
                return {
                    ...state,
                    qPaperStudent: {
                        ...state.qPaperStudent,
                        [qId]: updatedQPaperStudent[qId] // Update the qPaperStudent entry for qId
                    }
                };
            case "GET_ANSWER_SHEET_DETAILS":
                const studentAndQuestionDetails = action?.payload;
                if (studentAndQuestionDetails) {
                    return {
                        ...state,
                        getStudentAndQuestionData: studentAndQuestionDetails
                    };
                }
                return state;
            case "UPDATE_IS_PUBLISH_DETAILS":
                const { qpId, studentId, obtainedMarks } = action.payload;
                const updatedPaperStudent = { ...state.qPaperStudent };

                if (updatedPaperStudent[qpId]) {
                    updatedPaperStudent[qpId].forEach((student: any) => {
                        if (studentId?.includes(student?.studentId)) {
                            // student.isMarksPublish = true;
                            student.status = "Publish";
                            student.obtainedMarks = obtainedMarks?.[studentId.indexOf(student.studentId)];
                        }
                    });
                } else {
                    // Handle case when qpId is not found
                    console.warn(`qpId ${qpId} not found in qPaperStudent`);
                    return state;
                }

                return {
                    ...state,
                    qPaperStudent: {
                        ...state.qPaperStudent,
                        [qpId]: updatedPaperStudent[qpId] // Update the qPaperStudent entry for qpId
                    }
                };
            case "UPDATE_IS_UNPUBLISH_DETAILS":
                const { qpId1, studentId1 } = action.payload;
                const updatedPaperStudent1 = { ...state.qPaperStudent };
                if (updatedPaperStudent1[qpId1]) {
                    updatedPaperStudent1[qpId1].forEach((student: any) => {
                        if (studentId1?.includes(student?.studentId)) {
                            // student.isMarksPublish = false;
                            student.status = "Draft"
                        }
                    });
                } else {
                    // Handle case when qpId is not found
                    console.warn(`qpId ${qpId1} not found in qPaperStudent`);
                    return state;
                }

                return {
                    ...state,
                    qPaperStudent: {
                        ...state.qPaperStudent,
                        [qpId1]: updatedPaperStudent1[qpId1] // Update the qPaperStudent entry for qpId
                    }
                };
            case "Q_SETS_MAP":
                const setSMap = action.payload;
                const setsMapped: { [key: string]: string } = {}; // Define the type explicitly

                if (setSMap && setSMap.length > 0) {
                    setSMap.forEach((set: any, index: number) => {
                        const setId = set.id.toString(); // Convert id to string if necessary
                        const setName = set.name; // Assuming name is the value to store
                        // Store the data against the setId in setsMapped
                        setsMapped[setId] = `Set ${set.setSequenceID}`;
                    });
                }

                // Add the default option "Select Set"
                setsMapped["1"] = "Select Set";

                return {
                    ...state,
                    setsmapped: setsMapped
                };

            case "UPDATE_SETS_DETAILS_FOR_STUDENT":
                const { data: updatedSetDetailsPayload, isEditable } = action?.payload;

                // Create a copy of qPaperStudent to modify
                const updatedPaperStudentSet = { ...state.qPaperStudent };

                updatedSetDetailsPayload.forEach((setDetails: any) => {
                    const { questionPaperId, questionPaperSetId, studentIds } = setDetails;
                    const allocateSets = setDetails.allocateSets; // Access allocateSets from setDetails

                    // Find the corresponding qPaperStudent entry for questionPaperId
                    const paperStudents = updatedPaperStudentSet[questionPaperId];

                    if (!isEditable) {
                        // Update student list with set IDs
                        if (paperStudents) {
                            paperStudents.forEach((student: any) => {
                                if (allocateSets.some((set: any) => set.studentIDs.includes(student.studentId))) {
                                    student.setId = allocateSets.find((set: any) => set.studentIDs.includes(student.studentId))?.setId;
                                }
                            });
                        } else {
                            // Handle case when questionPaperID is not found
                            console.warn(`questionPaperId ${questionPaperId} not found in qPaperStudent`);
                        }
                    } else {
                        // Retain existing behavior or add additional logic for isEditable true
                        if (paperStudents) {
                            paperStudents.forEach((student: any) => {
                                if (studentIds.includes(student.studentId)) {
                                    // Update the questionPaperSetId for the matching studentId
                                    student.setId = questionPaperSetId;
                                    student.obtainedMarks = 0
                                }
                            });
                        } else {
                            // Handle case when questionPaperID is not found
                            console.warn(`questionPaperId ${questionPaperId} not found in qPaperStudent`);
                        }
                    }
                });

                return {
                    ...state,
                    qPaperStudent: updatedPaperStudentSet
                };
                break;
            case "UPDATE_QP_KEYS":
                const { qpParer, key, updatePayload } = action.payload;

                const updatedQPaperList = state.qPaperList.map((item: any) => {
                    if (item.id == qpParer) {
                        return {
                            ...item,
                            [key]: updatePayload
                        };
                    }
                    return item;
                });

                return {
                    ...state,
                    qPaperList: updatedQPaperList
                };
                break;

            case "STUDENT_QUESTIONS_DETAILS":
                const { qId: studentViewQpId, data: studentPaylod, studentIds, keys } = action.payload;
                const updatedPaperStudentPayload = { ...state.qPaperStudent };

                switch (keys) {
                    case "setID":
                        if (updatedPaperStudentPayload[studentViewQpId]) {
                            updatedPaperStudentPayload[studentViewQpId].forEach((student: any) => {
                                if (studentIds == student?.studentId) {
                                    // student.isMarksPublish = true;
                                    student.studentId= studentPaylod
                                }
                            });
                        } else {
                            // Handle case when qpId is not found
                            console.warn(`qpId ${studentViewQpId} not found in qPaperStudent`);
                            return state;
                        }

                        return {
                            ...state,
                            qPaperStudent: {
                                ...state.qPaperStudent,
                                [studentViewQpId]: updatedPaperStudentPayload[studentViewQpId] // Update the qPaperStudent entry for qpId
                            }
                        };
                        break;

                    default:
                        return {
                            ...state
                        }
                        break;
                }


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
