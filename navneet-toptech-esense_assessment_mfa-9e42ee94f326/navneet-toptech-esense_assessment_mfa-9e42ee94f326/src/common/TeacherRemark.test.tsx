import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../redux/store";
import TeacherRemark from "./TeacherRemark";

describe("TeacherRemark Component", () => {
  it("renders TeacherRemark component", () => {
    render(
      <Provider store={store}>
        <TeacherRemark value="Initial Remark" isEditMode={false} />
      </Provider>
    );

    expect(screen.getByText("Teacher's Remark")).toBeInTheDocument();
  });

  it("renders TeacherRemark component in edit mode", () => {
    render(
      <Provider store={store}>
        <TeacherRemark value="Initial Remark" isEditMode={true} />
      </Provider>
    );

    expect(screen.getByText("Teacher's Remark")).toBeInTheDocument();
  });

  it("calls onChange when text is changed in edit mode", () => {
    const handleChange = jest.fn();
    render(
      <Provider store={store}>
        <TeacherRemark value="Initial Remark" isEditMode={true} onChange={handleChange} />
      </Provider>
    );

    const textField = screen.getByRole("textbox");
    fireEvent.change(textField, { target: { value: "New Remark" } });

    expect(handleChange).toHaveBeenCalled();
  });

});
