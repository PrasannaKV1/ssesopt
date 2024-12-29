export const dispatchType = {
    assesmentType: {
        qListMenuEvent: "QLIST_MENU_EVENT",  // qListMenu : Question List Menu
        qModeType: "QMODE_TYPE",  // qModeType : Question Paper Mode (online / offline)
        qGrade: "QGRADES",  // qGrade :( Grade 1 ,Grade 2 ,....)
        qPaperType: "QPAPER_TYPE", // qPaperType: (informal / formal )
        qPaperList: "QPAPER_LIST",
        qSubjects: "QSUBJECTS",
        qStudentList: "QSTUDENT_LIST",
        qPaperSet: "QPAPER_SETS",
        qPaperStudent: "QPAPER_STUDENT",
        qPSetsMap : "Q_SETS_MAP",
        updateQPKeys : "UPDATE_QP_KEYS",
        currentQuestion : "CURRENT_QUESTIONS"
    },
    snackbar: {
        snackbarTost: "SNACKBAR"
    },
    searchFilter: {
        allFilter: "SEARCH_QP_FILTER",
        sectionFIlter: "SECTION_FILTER"
    },
    studentList: {
        selectedStudentList: "SELECTED_STUDENT_LIST",
        updateIsAnswerSheet: "UPDATE_IS_ANSWER_SHEET",
        getAnswetSheetDetails: "GET_ANSWER_SHEET_DETAILS",
        updatedIsMarksPublish : "UPDATE_IS_PUBLISH_DETAILS",
        updatedIsUnMarksPublish: "UPDATE_IS_UNPUBLISH_DETAILS",
        updateSetsDetailsForStudent : "UPDATE_SETS_DETAILS_FOR_STUDENT"
    },
    uploadActionType: {
        UPLOAD_PROGRESS: 'UPLOAD_PROGRESS',
        UPLOAD_SUCCESS: 'UPLOAD_SUCCESS',
        UPLOAD_FAILURE: 'UPLOAD_FAILURE'
    },
    studentOverViewActionType: {
        stduentOverViewAction: 'STUDENT_OVERVIEW_ACTION',
        removeStduentOverViewAction :"REMOVE_STUDENT_OVERVIEW"
    },
    mobileFixed: {
        getMobileFixed: "GET_MOBILEMENU",
        isMobileView:"IS_MOBILEVIEW"
      },
      revoke: "REVOKE",
};