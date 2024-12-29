import "./EvaluationQuestionCards.css";
import React, { useState } from "react";
import { Box, Typography, IconButton, Avatar, Tooltip } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { EvaluationQuestionListInterface1 } from "../../../../interface/assesment-interface";
import { useSelector } from "react-redux";
import { RootStore } from "../../../../redux/store";
import { ReduxStates } from "../../../../redux/reducers";

interface EvaluationQuestionCardsPropsInterface1 {
  payload: EvaluationQuestionListInterface1;
  qustionPaperPreview: (payload: EvaluationQuestionListInterface1) => void;
  handleQuestionMenuEvent: (menuValue: {
    option: string;
    payload: EvaluationQuestionListInterface1;
  }) => void;
  selectedQuestion: any;
  handleStudentModal?: () => void;
}
const EvaluationQuestionCards = (
  props: EvaluationQuestionCardsPropsInterface1
) => {
  const {
    payload,
    handleQuestionMenuEvent,
    qustionPaperPreview,
    selectedQuestion,
    handleStudentModal,
  } = props;

  const options: string[] = [
    "View assessment report",
    "Add scores to gradebook",
  ];
  //selectors
  const qPaperMode = useSelector(
    (state: RootStore) => state?.qMenuEvent?.qMode
  );
  const qPaperType = useSelector(
    (state: RootStore) => state?.qMenuEvent?.qPaperType
  );
  const isMobileView = useSelector(
    (state: ReduxStates) => state?.mobileMenuStatus?.isMobileView
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const open = Boolean(anchorEl);

  let modeName = qPaperMode?.filter((e: any) => e?.id == payload?.examTypeID);
  let typeName = qPaperType?.filter(
    (e: any) => e?.id == payload?.questionPaperTypeID
  );

  const courseDetails = (payload?.questionPaperCourseDetails || [])
    .map((course) => course.courseName)
    .join(",");
  const coursesCount = courseDetails.split(",").map((course) => course.trim());
  const displayCount =
    coursesCount.length > 1 ? `+${coursesCount.length - 1}` : "";

  const firstCourseDetail = coursesCount[0];
  const remainingCourseDetails = coursesCount.slice(1).join(", ");

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handelMenu = async (menuValue: {
    option: string;
    payload: EvaluationQuestionListInterface1;
  }) => {
    await handleQuestionMenuEvent(menuValue);
    await handleClose();
  };

  const handelQuestionPreview = (payload: EvaluationQuestionListInterface1) => {
    if (payload) {
      qustionPaperPreview(payload);
    }
  };

  const transformGradeToClass = (grade: any) => {
    const mainClassName = grade.map((item: any) => item?.className).join(",");
    return mainClassName;
  };

  const classNames = transformGradeToClass(
    payload?.questionPaperClassDetails || []
  );
  const classNamesArray = classNames
    .split(",")
    .map((className: any) => className.trim());

  const displaySectionCount =
    classNamesArray.length > 1 ? `+${classNamesArray.length - 1}` : "";
  const firstSectionDetail = classNamesArray[0];
  const remainingSectionDetails = classNamesArray.slice(1).join(", ");

  return (
    <React.Fragment>
      <div
        className="assessment-questions"
        style={{ position: "relative" }}
        data-active={selectedQuestion?.id === payload?.id}
      >
        <Box className="card-container" onClick={handleStudentModal}>
          <Box className="card-header">
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography
                className="card-title"
                dangerouslySetInnerHTML={{ __html: payload?.name }}
              ></Typography>
            </div>
            <div className="menu" style={{ marginTop: "-8px" }}>
              <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? "long-menu" : undefined}
                aria-expanded={open ? "true" : undefined}
                aria-haspopup="true"
                onClick={(event) => handleClick(event)}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="long-menu"
                MenuListProps={{
                  "aria-labelledby": "long-button",
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&::before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                {options.map((option: string, index: number) => (
                  <MenuItem
                    disabled={
                      (!selectedQuestion?.isMarksUploaded &&
                        option === "View assessment report") ||
                      (option === "Add scores to gradebook" &&
                        !selectedQuestion?.isMarksAddedForAll)
                    }
                    key={index}
                    selected={option === "Pyxis"}
                    onClick={() => handelMenu({ option, payload })}
                  >
                    {option}
                  </MenuItem>
                ))}
              </Menu>
            </div>
          </Box>
          <Box className="card-grade">
            <Typography
              className="clamped-text card-help-text"
              style={{ maxWidth: "90px", minWidth: "60px" }}
            >
              {firstSectionDetail}
            </Typography>
            {displaySectionCount && (
              <Tooltip
                title={remainingSectionDetails}
                arrow
                placement="bottom-start"
              >
                <Typography
                  className="card-help-text"
                  sx={{ marginLeft: "-15px", cursor: "pointer" }}
                >
                  {displaySectionCount}
                </Typography>
              </Tooltip>
            )}
            <Typography className="clamped-text card-help-text">
              {firstCourseDetail}
            </Typography>
            {displayCount && (
              <Tooltip
                title={remainingCourseDetails}
                arrow
                placement="bottom-start"
              >
                <Typography
                  className="card-help-text"
                  sx={{ marginLeft: "-10px", cursor: "pointer" }}
                >
                  {displayCount}
                </Typography>
              </Tooltip>
            )}
          </Box>
          <Box className="card-body">
            <Typography className="small-text">
              {payload?.marks} Marks
            </Typography>{" "}
            |<Typography className="small-text">{typeName[0]?.name}</Typography>{" "}
            |<Typography className="small-text">{modeName[0]?.name}</Typography>
          </Box>
          <Box className="card-footer">
            <Typography className="small-text">
              {" "}
              {payload?.studentsCount || 0} Student
            </Typography>
            <Avatar
              style={{ background: "#1055EB1A", cursor: "pointer" }}
              onClick={() => handelQuestionPreview(payload)}
            >
              <RemoveRedEyeIcon style={{ color: "#1055EB" }} />
            </Avatar>
          </Box>
        </Box>
      </div>
    </React.Fragment>
  );
};

export default EvaluationQuestionCards;
