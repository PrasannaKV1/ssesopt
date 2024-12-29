import {Dispatch} from "redux";
interface Action {
    type: string;
    payload?: any;
}

interface InitialStateInterface {
    selectedStudentList: any[]
}

const initialState: InitialStateInterface = {
    selectedStudentList: [],
}

export const studentListEvents = (state = initialState, action: Action) => {
    switch (action.type) {
        case "SELECTED_STUDENT_LIST":
            const studentList = action.payload;
            if (Array.isArray(studentList) && studentList.length === 0) {
                // If the payload is an empty array, clear the selectedStudentList
                return {
                    ...state,
                    selectedStudentList: []
                };
            } else if (studentList && typeof studentList === 'object') {
                // If the payload has students, add them to the selectedStudentList
                return {
                    ...state,
                    selectedStudentList: [...state.selectedStudentList, studentList]
                };
            } else {
                return state; // Return the current state for unknown payload formats
            }
        default:
            return state;
    }
};
