export const onlineDispatchType = {
    loader : "LOADER",
    onlineAssesmentType: {
        qListMenuEvent: "QPLIST",  // qListMenu : Question List Menu
        qModeType: "ONLINE_QMODE_TYPE",  // qModeType : Question Paper Mode (online / offline)
        qGrade: "ONLINE_QGRADES",  // qGrade :( Grade 1 ,Grade 2 ,....)
        qPaperType: "ONLINE_QPAPER_TYPE", // qPaperType: (informal / formal )
        qSubjects: "ONLINE_QSUBJECTS",
        currentQuestion:"ONLINE_CURRENT_QUESTIONS",
        qpCurrentStudentListing : "ONLINE_CURRENT_QP_STUDENT_LIST",
        qpStudentList :"ONLINE_QPAPER_STUDENT",
        qpChapters: "ONLINE_QP_CHAPTERS", 
        qpDuplicateStudentList: "ONLINE_DUPLICATE_QP_STUDENT_LIST",
        qpDuplicatePaper: "ONLINE_DUPLICATE_QP_PAPER",
        removeQp :"ONLINE_QP_REMOVE",
        gradeSectionName: "ONLINE_CURRENT_FILTER_GRADE_NAME",
        questionPaperId:'ONLINE_QUESTION_PAPER_ID',
    },
    onlineSearchFilter: {
        allFilter: "ONLINE_SEARCH_QP_FILTER",
        sectionFIlter: "ONLINE_SECTION_FILTER"
    },
};