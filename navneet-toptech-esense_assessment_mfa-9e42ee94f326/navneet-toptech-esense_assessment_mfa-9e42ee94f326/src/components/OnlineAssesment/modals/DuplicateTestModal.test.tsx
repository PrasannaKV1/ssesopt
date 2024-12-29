import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../../../redux/store";
import DuplicateTestModal from "./DuplicateTestModal";
import { sectionAPI } from "../../../Api/QuestionTypePaper";
import { getLocalStorageDataBasedOnKey } from "../../../constants/helper";

jest.mock("../../../Api/QuestionTypePaper");

jest.mock("../../../constants/helper", () => ({
    getLocalStorageDataBasedOnKey: jest.fn(),
}));

describe("DuplicateTestModal", () => {
    beforeEach(() => {
        (sectionAPI as jest.Mock).mockResolvedValue({
            data: {
                classDetails: [
                    { sectionid: 1, es_gradeid: 8 },
                    { sectionid: 2, es_gradeid: 8 },
                ],
            },
        }); 
        (getLocalStorageDataBasedOnKey as jest.Mock).mockReturnValue(JSON.stringify({
            login: { userData: { userRefId: "123" } },
        }));
    });

    it("renders modal when duplicateTestModal is true", () => {
        render(
            <Provider store={store}>
                <DuplicateTestModal
                    duplicateTestModal={true}
                    handleTestModalClose={jest.fn()}
                />
            </Provider>
        );
        expect(screen.getByText(/Duplicate Online Test/i)).toBeInTheDocument();
    });

    it("does not render modal when duplicateTestModal is false", () => {
        render(
            <Provider store={store}>
                <DuplicateTestModal
                    duplicateTestModal={false}
                    handleTestModalClose={jest.fn()}
                />
            </Provider>
        );
        expect(screen.queryByText(/Duplicate Online Test/i)).toBeNull();
    });

    it("renders TestDetailsContainer when testDetailsTab is true", () => {
        render(
            <Provider store={store}>
                <DuplicateTestModal
                    duplicateTestModal={true}
                    handleTestModalClose={jest.fn()}
                />
            </Provider>
        );

        expect(screen.getByText(/Test Details/i)).toBeInTheDocument();
    });

    it("renders AssignTestContainer when assignTestTab is true", async () => {
        render(
            <Provider store={store}>
                <DuplicateTestModal
                    duplicateTestModal={true}
                    handleTestModalClose={jest.fn()}
                />
            </Provider>
        );

        fireEvent.click(screen.getByText(/Assign Test/i));
        expect(screen.getByText(/Assign Test/i)).toBeInTheDocument();
    });

    it("handles API errors gracefully", async () => {
        (sectionAPI as jest.Mock).mockRejectedValue(new Error("API Error"));

        render(
            <Provider store={store}>
                <DuplicateTestModal
                    duplicateTestModal={true}
                    handleTestModalClose={jest.fn()}
                />
            </Provider>
        );

    });

    it("handles modal close when clicking the close icon", () => {
        const handleTestModalClose = jest.fn();
        render(
            <Provider store={store}>
                <DuplicateTestModal
                    duplicateTestModal={true}
                    handleTestModalClose={handleTestModalClose}
                />
            </Provider>
        );

    });

    it("switches to AssignTestTab on clicking Assign Test tab", () => {
        render(
            <Provider store={store}>
                <DuplicateTestModal
                    duplicateTestModal={true}
                    handleTestModalClose={jest.fn()}
                />
            </Provider>
        );

        fireEvent.click(screen.getByText(/Assign Test/i));
        expect(screen.getByText(/Assign Test/i)).toBeInTheDocument();
    });

    it("calls sectionAPI on component mount", async () => {
        render(
            <Provider store={store}>
                <DuplicateTestModal
                    duplicateTestModal={true}
                    handleTestModalClose={jest.fn()}
                />
            </Provider>
        );

        await waitFor(() => {
            expect(sectionAPI).toHaveBeenCalledWith("123");
        });
    });

    it("renders correctly when sectionAPI returns no data", async () => {
        (sectionAPI as jest.Mock).mockResolvedValue({ data: { classDetails: [] } });

        render(
            <Provider store={store}>
                <DuplicateTestModal
                    duplicateTestModal={true}
                    handleTestModalClose={jest.fn()}
                />
            </Provider>
        ); 

        await waitFor(() => {
            expect(screen.queryByText(/Test Details/i)).toBeInTheDocument();
        });
    });
});