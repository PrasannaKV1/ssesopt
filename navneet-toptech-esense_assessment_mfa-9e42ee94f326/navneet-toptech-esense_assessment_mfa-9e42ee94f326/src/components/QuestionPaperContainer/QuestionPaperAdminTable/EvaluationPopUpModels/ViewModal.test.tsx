import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import store from "../../../../redux/store";
import ViewModal from "./ViewModal";
import * as Api from '../../../../Api/QuestionTypePaper'; 
import * as AssessmentApi from '../../../../Api/AssessmentReports';

jest.mock('../../../../Api/QuestionTypePaper');
jest.mock('../../../../Api/AssessmentReports');

describe("ViewModal component", () => {
    beforeEach(() => {
        jest.resetAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {}); 

    });

    it("renders ViewModal component", () => {
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[{ state: { id: 'test-id' } }]}>
                    <ViewModal />
                </MemoryRouter>
            </Provider>
        );
    });

    it("fetches and displays assessment data", async () => {
        const mockAssessmentData = { data: { subjectWiseDetails: [{ chapterWiseDetails: [] }] } };
        ( Api.assessmentDataOfStudents as jest.Mock).mockResolvedValue(mockAssessmentData);

        
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[{ state: { id: 'test-id' } }]}>
                    <ViewModal />
                </MemoryRouter>
            </Provider>
        ); 

        await waitFor(() => {
            expect(Api.assessmentDataOfStudents).toHaveBeenCalledWith('test-id');
        });
    });

    it("fetches and displays teacher question and answer overview", async () => {
        const mockTeacherData = [{ questionSequence: '1' }];
        ( AssessmentApi.teacherQAovewview as jest.Mock).mockResolvedValue(mockTeacherData);
  
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[{ state: { id: 'test-id' } }]}>
                    <ViewModal />
                </MemoryRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(AssessmentApi.teacherQAovewview).toHaveBeenCalledWith({ qpId: 'test-id' });
        });
    });

    it("handles back button click", () => {
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[{ state: { id: 'test-id' } }]}>
                    <ViewModal />
                </MemoryRouter>
            </Provider>
        );

    });
    it("sorts teacher question and answer data by question sequence", async () => {
        const mockTeacherData = [
            { questionSequence: '3' },
            { questionSequence: '1' },
            { questionSequence: '2' }
        ];
        ( AssessmentApi.teacherQAovewview as jest.Mock).mockResolvedValue(mockTeacherData);

        
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[{ state: { id: 'test-id' } }]}>
                    <ViewModal />
                </MemoryRouter>
            </Provider>
        );
    
        waitFor(() => {
            expect(AssessmentApi.teacherQAovewview).toHaveBeenCalledWith({ qpId: 'test-id' });
        });
    });   
    it("handles error while fetching teacher question and answer overview", async () => {
        const mockError = new Error("Test error");
        (AssessmentApi.teacherQAovewview as jest.Mock).mockRejectedValue(mockError);

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[{ state: { id: 'test-id' } }]}>
                    <ViewModal />
                </MemoryRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(AssessmentApi.teacherQAovewview).toHaveBeenCalledWith({ qpId: 'test-id' });
            expect(console.error).toHaveBeenCalledWith("Error while fetching the teachers question and answer overview ", mockError);
        });
    });  
    
});