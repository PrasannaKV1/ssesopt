import {
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../../../../redux/store";
import EvaluationQuestionSets from "./EvaluationQuestionSets";
import { useDispatch } from 'react-redux';
import { qSetsEventActions, setsMapping } from '../../../../redux/actions/assesmentQListEvent';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn(),
}));

describe('EvaluationQuestionSets', () => {
    const dispatch = jest.fn();
    const selectedQuestion = {
        questionPaperSetsInfo: [
            { name: 'Set 1', id: '1', setSequenceID: 1 },
            { name: 'Set 2', id: '2', setSequenceID: 2 },
        ]
    };

    beforeEach(() => {
        (useDispatch as jest.Mock).mockReturnValue(dispatch);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders Evaluation Question Sets with no selectedQuestion", () => {
        render(
            <Provider store={store}>
                <EvaluationQuestionSets selectedQuestion={undefined} />
            </Provider>
        );
        expect(screen.queryByRole('tab')).toBeNull();
    });

    it("renders Evaluation Question Sets with empty questionPaperSetsInfo", () => {
        render(
            <Provider store={store}>
                <EvaluationQuestionSets selectedQuestion={{ questionPaperSetsInfo: [] }} />
            </Provider>
        );
        expect(screen.queryByRole('tab')).toBeNull();
    });

    it("renders tabs correctly with questionPaperSetsInfo", () => {
        render(
            <Provider store={store}>
                <EvaluationQuestionSets selectedQuestion={selectedQuestion} />
            </Provider>
        );

        expect(screen.getByText('set 1')).toBeInTheDocument();
        expect(screen.getByText('set 2')).toBeInTheDocument();

        expect(dispatch).toHaveBeenCalledWith(setsMapping(selectedQuestion.questionPaperSetsInfo));
        expect(dispatch).toHaveBeenCalledWith(qSetsEventActions({ name: 'Set 1', setId: '1' }));
    });

    it("handles tab change correctly", () => {
        render(
            <Provider store={store}>
                <EvaluationQuestionSets selectedQuestion={selectedQuestion} />
            </Provider>
        );

        const tab2 = screen.getByText('set 2');
        fireEvent.click(tab2);

        expect(dispatch).toHaveBeenCalledWith(qSetsEventActions({ name: 'Set 2', setId: '2' }));
    });

    it("handles missing name or id in questionPaperSetsInfo correctly", () => {
        const selectedQuestionWithMissingInfo = {
            questionPaperSetsInfo: [
                { name: null, id: null },
            ]
        };

        render(
            <Provider store={store}>
                <EvaluationQuestionSets selectedQuestion={selectedQuestionWithMissingInfo} />
            </Provider>
        );

        expect(dispatch).toHaveBeenCalledWith(qSetsEventActions({ name: null, setId: null }));
    });
}); 
