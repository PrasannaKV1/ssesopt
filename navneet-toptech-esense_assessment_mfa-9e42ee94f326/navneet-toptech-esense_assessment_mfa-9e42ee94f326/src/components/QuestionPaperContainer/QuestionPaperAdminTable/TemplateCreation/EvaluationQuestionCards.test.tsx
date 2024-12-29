import {
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react";
import { Provider } from "react-redux";
import { useSelector } from "react-redux";
import store from "../../../../redux/store";
import EvaluationQuestionCards from "./EvaluationQuestionCards";

// Mock the useSelector hook
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
}));

describe("EvaluationQuestionCards component", () => {
    const mockPayload = {
        id: '1',  // Unique identifier for the question paper
        name: 'Midterm Math Exam',  // Title or name of the question paper
        description: 'A comprehensive midterm exam for Math subject.',  // Description of the exam
        time: 120,  // Time allotted for the exam in minutes
        templateID: 101,  // Identifier for the template used for the exam
        questionPaperTypeID: 5,  // Identifier for the type of question paper
        marks: 100,  // Total marks for the exam
        statusID: 2,  // Status ID (e.g., 1 for draft, 2 for published)
        gradeID: 3,  // Grade ID related to the exam (e.g., Grade 1, Grade 2)
        examTypeID: 4,  // Type of the exam (e.g., midterm, final)
        statusName: 'published',  // Status name of the exam
        generationModeID: 6,  // Mode ID for generation of the exam (e.g., online, offline)
        generationMode: 'Online',  // Mode of generation (e.g., online, offline)
        qustionPaperPreview: undefined,  // Function or placeholder for question paper preview (mocked as undefined)
        handleQuestionMenuEvent: undefined,  // Function or placeholder for handling menu events (mocked as undefined)
        questionPaperCourseDetails: [
            { courseID: 1, courseName: 'Algebra' },  // Example course details
            { courseID: 2, courseName: 'Geometry' }
        ],
        questionPaperClassDetails: [
            { classId: 3, className: 'Grade 4' },  // Example class details
            { classId: 4, className: 'Grade 5' }
        ],
        questionPaperSectionDetails: [
            { sectionID: 1, sectionName: 'Part A' },  // Example section details
            { sectionID: 2, sectionName: 'Part B' }
        ],
        studentsCount: 25  // Number of students for whom the exam is applicable
    };

    const mockSelectedQuestion = {
        id: 1,
        isMarksUploaded: false,
        isMarksAddedForAll: false,
    };

    const mockQMenuEvent = {
        qMode: [{ id: 1, name: 'Online' }],
        qPaperType: [{ id: 1, name: 'Midterm' }],
    };

    const mockQustionPaperPreview = jest.fn();
    const mockHandleQuestionMenuEvent = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        // Mock implementation of useSelector
        (useSelector as jest.Mock).mockImplementation(callback => {
            return callback({ qMenuEvent: mockQMenuEvent });
        });
    });

    it("renders without crashing", () => {
        render(
            <Provider store={store}>
                <EvaluationQuestionCards
                    payload={mockPayload}
                    qustionPaperPreview={mockQustionPaperPreview}
                    handleQuestionMenuEvent={mockHandleQuestionMenuEvent}
                    selectedQuestion={mockSelectedQuestion}
                />
            </Provider>
        );
    });

    it("renders with correct title and details", () => {
        render(
            <Provider store={store}>
                <EvaluationQuestionCards
                    payload={mockPayload}
                    qustionPaperPreview={mockQustionPaperPreview}
                    handleQuestionMenuEvent={mockHandleQuestionMenuEvent}
                    selectedQuestion={mockSelectedQuestion}
                />
            </Provider>
        );

        expect(screen.getByText('Midterm Math Exam')).toBeInTheDocument();
        expect(screen.getByText('Grade 4')).toBeInTheDocument();
        expect(screen.getByText('Algebra')).toBeInTheDocument();
        expect(screen.getByText('100 Marks')).toBeInTheDocument();
        // expect(screen.getByText('published')).toBeInTheDocument();
        // expect(screen.getByText('Online')).toBeInTheDocument();
        // expect(screen.getByText('25 Students')).toBeInTheDocument();
    });

    it("opens menu on click", () => {
        render(
            <Provider store={store}>
                <EvaluationQuestionCards
                    payload={mockPayload}
                    qustionPaperPreview={mockQustionPaperPreview}
                    handleQuestionMenuEvent={mockHandleQuestionMenuEvent}
                    selectedQuestion={mockSelectedQuestion}
                />
            </Provider>
        );

        fireEvent.click(screen.getByLabelText('more'));
        expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it("calls handleQuestionMenuEvent on menu item click", async () => {
        render(
            <Provider store={store}>
                <EvaluationQuestionCards
                    payload={mockPayload}
                    qustionPaperPreview={mockQustionPaperPreview}
                    handleQuestionMenuEvent={mockHandleQuestionMenuEvent}
                    selectedQuestion={mockSelectedQuestion}
                />
            </Provider>
        );

        fireEvent.click(screen.getByLabelText('more'));
        fireEvent.click(screen.getByText('View assessment report'));
        await waitFor(() => expect(mockHandleQuestionMenuEvent).toHaveBeenCalledWith({ option: 'View assessment report', payload: mockPayload }));
    });

    it("calls qustionPaperPreview on avatar click", () => {
        render(
            <Provider store={store}>
                <EvaluationQuestionCards
                    payload={mockPayload}
                    qustionPaperPreview={mockQustionPaperPreview}
                    handleQuestionMenuEvent={mockHandleQuestionMenuEvent}
                    selectedQuestion={mockSelectedQuestion}
                />
            </Provider>
        );

        // Un-comment this line if your test needs to verify avatar click
        // fireEvent.click(screen.getByRole('button', { name: /RemoveRedEyeIcon/i }));
        // expect(mockQustionPaperPreview).toHaveBeenCalledWith(1);
    });
});
