interface UploadState {
  uploading: boolean;
  progress: number;
  error: any;
  data: any;
}

const initialState: UploadState = {
  uploading: false,
  progress: 0,
  error: null,
  data: null,
};

const uploadReducer = (state = initialState, action: any): UploadState => {
  switch (action.type) {
    case "UPLOAD_PROGRESS":
      return {
        ...state,
        uploading: true,
        progress: action.payload,
      };
    case "UPLOAD_SUCCESS":
      return {
        ...state,
        uploading: false,
        progress: 100,
        data: action.payload,
      };
    case "UPLOAD_FAILURE":
      return {
        ...state,
        uploading: false,
        progress: 0,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default uploadReducer;
