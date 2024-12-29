import { EvaluationQuestionListInterface } from "../../../interface/assesment-interface";

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
interface SectionFilter {
    section: string | number | any
}

export interface InitialStateInterface {
    searchFilter: AllFilters
    sectionFilter: SectionFilter
}


const initialState: InitialStateInterface = {
    searchFilter: {
        gradeId: '',
        subjectId: '',
        chapterId: '',
        startDate: '',
        endDate: ''
    },
    sectionFilter: {
        section: ""
    }
}

export const onlineSearchFilterEvents = (state = initialState, action: Action) => {
    if (action.type) {
        switch (action.type) {
            case "ONLINE_SEARCH_QP_FILTER":
                const search = action?.payload;
                if (search) {
                    return {
                        ...state,
                        searchFilter: search
                    }
                }
                break;
            case "ONLINE_SECTION_FILTER":
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