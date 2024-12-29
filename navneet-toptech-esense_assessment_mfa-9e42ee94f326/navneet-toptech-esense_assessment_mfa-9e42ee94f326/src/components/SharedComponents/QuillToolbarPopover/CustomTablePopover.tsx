import React, { useState, useRef, useEffect, useMemo } from "react";
import { Popover, Button } from "@mui/material";
import "react-quill/dist/quill.snow.css";
import "./QuillToolbarPopover.css";
import "../TextEditor/TextEditor.css";
import TextField from "@mui/material/TextField";

interface quillProps {
  anchorTag: any;
  setTablePopupOpen: any;
  tablePopupOpen: boolean;
  insertTable: (r: any, c: any) => void;
}

const CustomTablePopover: React.FC<quillProps> = ({
  anchorTag,
  setTablePopupOpen,
  tablePopupOpen,
  insertTable,
}) => {
  const [rowCount, setRowCount] = useState<any>(null);
  const [colCount, setColCount] = useState<any>(null);

  const handleClosePopover = () => {
    setTablePopupOpen(false);
  };

  const handleApplyChanges = () => {
    insertTable(rowCount, colCount);
    handleClosePopover();
  };

  const textFieldChange = (e: any, src: any) => {
    let num: any = e?.replace(/[^0-9]/g, "");
    if (src === "row" && +num <= 50) {
      setRowCount(+num);
    } else if (src === "col" && +num <= 50) {
      setColCount(+num);
    }
  };

  return (
    <>
      <Popover
        open={tablePopupOpen}
        onClose={handleClosePopover}
        className={`quillPopupToolNumber quillPopupTool quillPopTable`}
        anchorEl={anchorTag}
      >
        {/* <div className="previewNumberTextBox"> */}
        <TextField
          className=""
          placeholder={"Row"}
          value={rowCount}
          onChange={(e: any) =>
            textFieldChange(e.target.value.replace(/^0/, ""), "row")
          }
          onKeyPress={(event) => {
            const allowedKeys = /[0-9\b\.\b]/;
            if (!allowedKeys.test(event.key)) {
              event.preventDefault();
            }
          }}
          inputProps={{
            maxLength: 2,
          }}
        />
        <TextField
          className=""
          placeholder={"Column"}
          value={colCount}
          onChange={(e: any) =>
            textFieldChange(e.target.value.replace(/^0/, ""), "col")
          }
          onKeyPress={(event) => {
            const allowedKeys = /[0-9\b\.\b]/;
            if (!allowedKeys.test(event.key)) {
              event.preventDefault();
            }
          }}
          inputProps={{
            maxLength: 2,
          }}
        />
        {/* </div> */}
        <Button className="popSuccessBtn disableBtn" disabled={(colCount&&rowCount)?false:true} onClick={handleApplyChanges}>
          OK
        </Button>
        <Button className="popResetBtn" onClick={handleClosePopover}>
          Cancel
        </Button>
      </Popover>
    </>
  );
};

export default CustomTablePopover;
