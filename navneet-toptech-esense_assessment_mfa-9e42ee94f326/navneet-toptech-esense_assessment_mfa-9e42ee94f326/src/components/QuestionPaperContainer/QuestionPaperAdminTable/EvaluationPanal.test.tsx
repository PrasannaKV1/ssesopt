import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../../../redux/store";
import EvaluationPanal from "./EvaluationPanal";
import MultiSelectComponentforFilters from "../../SharedComponents/MultiSelectComponent/MultiSelectComponentNew";

jest.mock("../../SharedComponents/MultiSelectComponent/MultiSelectComponentNew");

describe("Evaluation Panal component", () => {
    const mockSetSearchApiFilter = jest.fn();
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders Evaluation Panal component", () => {
        render(
            <Provider store={store}>
                <EvaluationPanal
                    setSearchApiFilter={mockSetSearchApiFilter}
                    questions={[]}
                    questionsCount={0}
                />
            </Provider>
        );
    });

    it("handles onChange for gradeId correctly", () => {
        render(
            <Provider store={store}>
                <EvaluationPanal
                    setSearchApiFilter={mockSetSearchApiFilter}
                    questions={[]}
                    questionsCount={0}
                />
            </Provider>
        );

        const mockOnChange = (MultiSelectComponentforFilters as jest.Mock).mock.calls[0][0].onChange;
        mockOnChange(["1", "2"]);
        expect(mockSetSearchApiFilter).toHaveBeenCalled();
    });

    it("handles onChange for subjectId correctly", () => {
        render(
            <Provider store={store}>
                <EvaluationPanal
                    setSearchApiFilter={mockSetSearchApiFilter}
                    questions={[]}
                    questionsCount={0}
                />
            </Provider>
        );

        const mockOnChange = (MultiSelectComponentforFilters as jest.Mock).mock.calls[1][0].onChange;
        mockOnChange(["3", "4"]);
        expect(mockSetSearchApiFilter).toHaveBeenCalled();
    });

    it("handles onChange for questionPaperTypeId correctly", () => {
        render(
            <Provider store={store}>
                <EvaluationPanal
                    setSearchApiFilter={mockSetSearchApiFilter}
                    questions={[]}
                    questionsCount={0}
                />
            </Provider>
        );

        const mockOnChange = (MultiSelectComponentforFilters as jest.Mock).mock.calls[2][0].onChange;
        mockOnChange(["5", "6"]);
        expect(mockSetSearchApiFilter).toHaveBeenCalled();
    });

    it("correctly sets the disable property for MultiSelectComponentforFilters", () => {
        const { rerender } = render(
            <Provider store={store}>
                <EvaluationPanal
                    setSearchApiFilter={mockSetSearchApiFilter}
                    questions={[]}
                    questionsCount={0}
                />
            </Provider>
        );

        expect((MultiSelectComponentforFilters as jest.Mock).mock.calls[0][0].disable).toBe(true);

        rerender(
            <Provider store={store}>
                <EvaluationPanal
                    setSearchApiFilter={mockSetSearchApiFilter}
                    questions={[{ questionId: 1 }]}
                    questionsCount={1}
                />
            </Provider>
        );

    });

    it("correctly sets the disable property for subject MultiSelectComponentforFilters", () => {
        const { rerender } = render(
            <Provider store={store}>
                <EvaluationPanal
                    setSearchApiFilter={mockSetSearchApiFilter}
                    questions={[]}
                    questionsCount={0}
                />
            </Provider>
        ); 

        expect((MultiSelectComponentforFilters as jest.Mock).mock.calls[1][0].disable).toBe(true);

        rerender(
            <Provider store={store}>
                <EvaluationPanal
                    setSearchApiFilter={mockSetSearchApiFilter}
                    questions={[{ questionId: 1 }]}
                    questionsCount={1}
                />
            </Provider>
        );

    }); 
}); 