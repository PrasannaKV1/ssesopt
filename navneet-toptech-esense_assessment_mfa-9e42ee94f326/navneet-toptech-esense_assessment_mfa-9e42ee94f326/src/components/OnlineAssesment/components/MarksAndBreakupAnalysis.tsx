import React, { useEffect } from "react";
import "./MarksAndBreakupAnalysis.css";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from "@mui/material";
import { htmlTagRegex, removeNbpsRegex } from "../../../constants/helper";
// import styles from "./QuestionTable.module.css"
import styles from "../../AssessmentsContainer/QuestionBank/QuestionTable/QuestionTable.module.css"

interface MarksAndBreakupAnalysisInterface {
  tableData?: any;
  isOnlineTestReport?: boolean;
  reasonforLateSub: string;
}

const MarksAndBreakupAnalysis: React.FC<MarksAndBreakupAnalysisInterface> = ({
  tableData, reasonforLateSub
}) => {
  const [remark, setRemark] = React.useState("");
  const getQuestionTitle = (dataList: any) => {
    let str = dataList?.questionText;

    if (str?.includes("{{") || str?.includes("<img")) {
      dataList?.questionImageDetails?.forEach((questionImage: any) => {
        let replaceImageKey = str.replace(`{{${questionImage?.key}}}`, ""); //Replace Image uploadPath with empty string
        let removedHtmlTags = replaceImageKey.replace(/(<([^>]+)>)/gi, ""); //Remove all HTML tags & get only words
        if (removedHtmlTags.trim() == "") {
          str = `<span class="listImageTag" onclick="handleClick('${questionImage?.src}')">${questionImage?.tag}</span>`;
        } else {
          str = replaceImageKey;
        }
      });
    }
    return str;
  };

  const removeTagsFromString = (str: any) => {
    if (str === null || str === "") return false;
    else str = str?.toString();
    return str?.replace(/<[^>]*>/g, "");
  };

  return (
    <div className="">
      <div className="questionBankContScroll">
        <TableContainer className="assessmentTableSect">
          <h1 className="headerText">Marks Breakup & Analytics</h1>
          <div>
            <Table sx={{ width: "100%" }} className="tableContainer">
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: "150px", textAlign: "left" }}>
                    Question No
                  </TableCell>
                  <TableCell>
                    <div className="tableHeadArrowSect">Questions</div>
                  </TableCell>
                  <TableCell>
                    <div className="tableHeadArrowSect">Marks</div>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody className="tableBody">
                {tableData?.map((dataList: any, index: any) => {
                  return (
                    <TableRow
                      style={{ cursor: "pointer" }}
                      key={index}
                      className="tableRow"
                    >
                      <TableCell style={{ width: "150px", textAlign: "left" }}>
                        {dataList.sequenceNo}
                      </TableCell>
                      <TableCell>
                        <Tooltip title={getQuestionTitle(dataList)?.replace(htmlTagRegex, "")?.replace(removeNbpsRegex, "")} placement="bottom-start">
                          <p className={`mb-0 pe-3 ${styles.ellipseText, styles.textFieldTag}`} title={removeTagsFromString(getQuestionTitle(dataList))} dangerouslySetInnerHTML={{ __html: getQuestionTitle(dataList)?.replaceAll("color:#f00", "color:#000000") }}></p>
                                            </Tooltip>
                      </TableCell>
                      <TableCell className="tableCellForMarks">
                        <TextField
                          value={`${dataList?.obtainedMarks || 0}/${dataList?.actualMarks}`}
                          disabled
                          className="marksTextField"
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TableContainer>
       {reasonforLateSub && <div className="lateMarkSubmissionContainer">
          <h1 className="lateMarkText">Student’s Late Submission Remark</h1>
          {/* <TextField
            value={remark}
            className="remarkTextField"
            onChange={(e) => setRemark(e.target.value)}
          /> */}
          <div className="lateSubreason" style={{wordWrap:"break-word"}}>
            {reasonforLateSub}
          </div>
        </div>}
      </div>
    </div>
  );
};

export default MarksAndBreakupAnalysis;
