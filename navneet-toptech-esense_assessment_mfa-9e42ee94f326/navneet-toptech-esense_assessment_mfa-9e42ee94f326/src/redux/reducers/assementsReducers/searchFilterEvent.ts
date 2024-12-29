import { EvaluationQuestionListInterface } from "../../../interface/assesment-interface";

interface Action {
    type: string;
    payload?: any;
};

interface SearchFilter {
    gradeId: string | number | any
    subjectId: string | number | any
    questionPaperTypeId: string | number | any
    minMarks: string | number | any
    maxMarks: string | number | any
}

interface SectionFilter {
    section: string | number | any
}

interface InitialStateInterface {
    searchFilter: SearchFilter
    sectionFilter: SectionFilter
}


const initialState: InitialStateInterface = {
    searchFilter: {
        gradeId: '',
        subjectId: '',
        questionPaperTypeId: '',
        minMarks: '',
        maxMarks: '',
    },
    sectionFilter: {
        section: ""
    }
}

export const searchFilterEvents = (state = initialState, action: Action) => {
    if (action.type) {
        switch (action.type) {
            case "SEARCH_QP_FILTER":
                const search = action?.payload;
                if (search) {
                    return {
                        ...state,
                        searchFilter: search
                    }
                }
                break;
            case "SECTION_FILTER":
                const section = action?.payload;
                if (section) {
                    return {
                        ...state,
                        sectionFilter: section
                    }
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