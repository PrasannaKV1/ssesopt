import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../../../../redux/store";
import MarkCompleted from "./MarkCompleted";
import * as api from '../../../../Api/OnlineAssements';

jest.mock('../../../../Api/OnlineAssements', () => ({
  assignChapterChallenge: jest.fn(),
  chapterChallenge: jest.fn(),
})); 

describe("MarkCompleted component", () => {
    let onCloseMock =jest.fn()
    let setSelectedQuestionMock =jest.fn();
    let setQpListMock =jest.fn();
    let onAssignDataMock=jest.fn();
    let questionPaperMock=jest.fn();


    it("renders MarkCompleted component", () => {
        render(
            <Provider store={store}>
                <MarkCompleted 
                    open={true}
                    onClose={jest.fn()}
                    onAssignData={onAssignDataMock}
                    questionPaper={questionPaperMock}
                    setSelectedQuestion={setSelectedQuestionMock}
                    setQpList={setQpListMock}
                />
            </Provider>
        );

        expect(screen.getByText('Marked as completed')).toBeInTheDocument();
        expect(screen.getByText('Do you want to assign a Chapter Challenge?')).toBeInTheDocument();
    });

    it("calls onClose when cancel button is clicked", () => {
        render(
            <Provider store={store}>
                <MarkCompleted 
                    open={true}
                    onClose={onCloseMock}
                    onAssignData={onAssignDataMock}
                    questionPaper={questionPaperMock}
                    setSelectedQuestion={setSelectedQuestionMock}
                    setQpList={setQpListMock}
                />
            </Provider>
        );

        fireEvent.click(screen.getByText('Cancel'));
        expect(onCloseMock).toHaveBeenCalled();
    });

    it("handles chapter assignment and updates state on success", async () => {
        (api.chapterChallenge as jest.Mock).mockResolvedValue({ 
            data: { paperId: 123 }, 
            result: { responseDescription: "Success" } 
        });
        (api.assignChapterChallenge as jest.Mock).mockResolvedValue({ 
            result: { responseCode: 200, responseDescription: "Assignment successful" } 
        });

        render(
            <Provider store={store}>
                <MarkCompleted 
                    open={true}
                    onClose={onCloseMock}
                    onAssignData={onAssignDataMock}
                    questionPaper={questionPaperMock}
                    setSelectedQuestion={setSelectedQuestionMock}
                    setQpList={setQpListMock}
                />
            </Provider>
        );

        fireEvent.click(screen.getByText('Assign Chapter Challenge'));

    });

    it("handles assignment failure gracefully", async () => {
        (api.chapterChallenge as jest.Mock).mockResolvedValue({ 
            data: { paperId: 123 }, 
            result: { responseDescription: "Success" } 
        });
        (api.assignChapterChallenge as jest.Mock).mockResolvedValue({ 
            result: { responseCode: 400, responseDescription: "Error assigning" } 
        });

        render(
            <Provider store={store}>
                <MarkCompleted 
                    open={true}
                    onClose={onCloseMock}
                    onAssignData={onAssignDataMock}
                    questionPaper={questionPaperMock}
                    setSelectedQuestion={setSelectedQuestionMock}
                    setQpList={setQpListMock}
                />
            </Provider>
        );

        fireEvent.click(screen.getByText('Assign Chapter Challenge'));

    });
});