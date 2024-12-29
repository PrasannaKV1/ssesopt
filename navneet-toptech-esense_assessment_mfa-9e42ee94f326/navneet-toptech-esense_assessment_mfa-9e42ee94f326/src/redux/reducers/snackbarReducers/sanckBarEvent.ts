// Define the interface for the state
interface SnackbarState {
    snackbarOpen: boolean;
    snackbarType: "success" | "error" | "warning" | "info";
    snackbarMessage: string;
    isHtmlText: boolean;
}

// Initial state using the defined interface
const initialState: SnackbarState = {
    snackbarOpen: false,
    snackbarType: "success",
    snackbarMessage: "",
    isHtmlText: false,
};


export type Action = {
    type: string;
    payload?: any;
};

export type SnackBarReducer = {
    snackbarOpen: boolean;
    snackbarType: any;
    snackbarMessage: string;
    isHtmlText?: boolean;
};

const snackBarReducer = (state = initialState, action: Action) => {
    switch (action.type) {
        case 'SNACKBAR':
            const { snackbarOpen, snackbarMessage, snackbarType, isHtmlText } =
                action.payload;
            return {
                ...state,
                snackbarOpen,
                snackbarType,
                snackbarMessage,
                isHtmlText,
            };

        default:
            return state;
    }
};

export default snackBarReducer;
