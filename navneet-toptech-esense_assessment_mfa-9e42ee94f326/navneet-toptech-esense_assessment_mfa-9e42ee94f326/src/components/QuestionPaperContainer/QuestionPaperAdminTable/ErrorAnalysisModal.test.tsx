import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../../../redux/store";
import ErrorAnalysisModal from "./ErrorAnalysisModal";
import { errorForReports } from '../../../Api/AssessmentReports';

jest.mock('../../../Api/AssessmentReports', () => ({
    errorForReports: jest.fn(),
}));

const mockErrorDetails = [
    { name: 'Error 1', group: 'Group 1', noOfQuestions: '10', noOfStudents: '5' },
    { name: 'Error 2', group: 'Group 2', noOfQuestions: '15', noOfStudents: '7' },
]; 

describe("Error Analysis Modal component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
      });

    it("renders without crashing", () => {
        render(
            <Provider store={store}>
                <ErrorAnalysisModal />
            </Provider>
        );
    });

    it("fetches and displays error details for teacher", async () => {
        // errorForReports.mockResolvedValue({ errorDetails: mockErrorDetails });
        (errorForReports as jest.MockedFunction<typeof errorForReports>).mockResolvedValue({ errorDetails: mockErrorDetails });
        render(
            <Provider store={store}>
                <ErrorAnalysisModal questionId="1" />
            </Provider>
        );

         waitFor(() => {
            expect(errorForReports).toHaveBeenCalledTimes(1);
            expect(screen.getByText('Error 1')).toBeInTheDocument();
            expect(screen.getByText('Group 1')).toBeInTheDocument();
            expect(screen.getByText('10')).toBeInTheDocument();
            expect(screen.getByText('5')).toBeInTheDocument();
        });
    });

    it("fetches and displays error details for student", async () => {
        // errorForReports.mockResolvedValue({ errorDetails: mockErrorDetails });
        (errorForReports as jest.MockedFunction<typeof errorForReports>).mockResolvedValue({ errorDetails: mockErrorDetails });

        render(
            <Provider store={store}>
                <ErrorAnalysisModal questionId="1" studentId="1" />
            </Provider>
        );

        waitFor(() => {
            expect(errorForReports).toHaveBeenCalledTimes(1);
            expect(screen.getByText('Error 1')).toBeInTheDocument();
            expect(screen.getByText('Group 1')).toBeInTheDocument();
            expect(screen.getByText('10')).toBeInTheDocument();
        });

        expect(screen.queryByText('5')).not.toBeInTheDocument();
    });

    it("toggles view details", () => {
        render(
            <Provider store={store}>
                <ErrorAnalysisModal questionId="1" />
            </Provider>
        );
    }); 
    

});
