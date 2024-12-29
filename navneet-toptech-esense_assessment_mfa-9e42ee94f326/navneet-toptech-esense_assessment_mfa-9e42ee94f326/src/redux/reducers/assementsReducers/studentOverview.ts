interface Action {
    type: string;
    payload?: any;
}

export interface studentOverviewEventInterface {
    studentOvewrview: any;
    studentAnsSheet: any;
}

const initialState: studentOverviewEventInterface = {
    studentOvewrview: {},
    studentAnsSheet: {}
}

export const studentOverviewEvent = (state = initialState, action: Action) => {
    switch (action.type) {
        case "STUDENT_OVERVIEW_ACTION": {
            const studentOvewrview = action?.payload;
            if (studentOvewrview) {
                const { allocationId, data } = studentOvewrview;
                const existingstudentOvewrview = state.studentOvewrview || {};

                if (!existingstudentOvewrview[allocationId]) {
                    return {
                        ...state,
                        studentOvewrview: {
                            ...existingstudentOvewrview,
                            [allocationId]: data
                        }
                    };
                }

                // Handle case where existing overview is empty
                if (existingstudentOvewrview[allocationId] && existingstudentOvewrview[allocationId].length === 0 && data) {
                    return {
                        ...state,
                        studentOvewrview: {
                            ...existingstudentOvewrview,
                            [allocationId]: data
                        }
                    };
                }
            }
            return state;
        }
        case "REMOVE_STUDENT_OVERVIEW": {
            const { allocationIds } = action.payload; // assuming allocationIds is an array
            const existingstudentOvewrview = { ...state.studentOvewrview };

            allocationIds.forEach((id: any) => {
                if (existingstudentOvewrview[id]) {
                    delete existingstudentOvewrview[id]; // Remove the entry for the allocationId
                }
            });

            return {
                ...state,
                studentOvewrview: existingstudentOvewrview
            };
        }
        case "STUDENT_OVERVIEW_ANS_SHEET_ACTION": {
            const studentansSheetOvewrview = action?.payload;
            if (studentansSheetOvewrview) {
                const { allocationId, data } = studentansSheetOvewrview;
                const existingstudentSheetOvewrview = state.studentAnsSheet || {};

                if (!existingstudentSheetOvewrview[allocationId]) {
                    return {
                        ...state,
                        studentAnsSheet: {
                            ...existingstudentSheetOvewrview,
                            [allocationId]: data
                        }
                    };
                }

                // Handle case where existing overview is empty
                if (existingstudentSheetOvewrview[allocationId] && existingstudentSheetOvewrview[allocationId].length === 0 && data) {
                    return {
                        ...state,
                        studentAnsSheet: {
                            ...existingstudentSheetOvewrview,
                            [allocationId]: data
                        }
                    };
                }
            }
            return state;
        }

        default:
            return state;
    }
}
