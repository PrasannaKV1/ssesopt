import { chapterChallengeGrade, getStudentListing } from ".";

export const getGradeAndSectionDetails = async (obj: any) => {
    try {
        const res = await chapterChallengeGrade.get(`user-profile/getTeachersSectionDetails/${obj}/true`);
        if (res.status === 200 || res.status === 201) {
            return res?.data;
        }

        return {};
    } catch (e) {
        console.error(e);
        return e;
    }
}

export const sendRemainder = async (id: number) => {
    try {
        const res = await getStudentListing.post(`allocation/sendReminder/${id}`);
        if (res.status === 200 || res.status === 201) {
            return res?.data;
        }

        return {};
    } catch (e) {
        console.error(e);
        return e;
    }
}