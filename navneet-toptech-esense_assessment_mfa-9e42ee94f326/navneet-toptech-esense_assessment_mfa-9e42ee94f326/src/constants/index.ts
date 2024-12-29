// export const singleSelectDropdown=["gradeId","themeId","topicId","subjectId","chapterId"]
// export const MultiSelectDropdown=["questionTypeId"]
export const MultiSelectDropdown = ["questionTypeId", "gradeId", "themeId", "topicId", "subjectId", "chapterId"]
export const popupMessages = (type: string) => {
    return `You might not be able to use the same ${type} if you change this value.Are you sure you want to change your selection?`
}
