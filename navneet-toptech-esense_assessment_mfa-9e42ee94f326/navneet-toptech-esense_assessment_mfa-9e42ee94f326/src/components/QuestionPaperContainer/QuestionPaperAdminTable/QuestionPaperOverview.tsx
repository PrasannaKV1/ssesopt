import "./questionOverview.css";
import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Radio,
    Link,
    IconButton,
    Tooltip,
    Pagination,
} from "@mui/material";
import { styled } from '@mui/material/styles';
import ButtonComponent from "../../SharedComponents/ButtonComponent/ButtonComponent";
import MARKS from "../../../assets/images/focus-3-line 1.svg";
import ANSWER from "../../../assets/images/user-2_fill.svg";
import infoIcon from "../../../assets/images/infoIcons.svg";
import CorrectAnswerIcon from '../../../assets/images/correctAnswerIcon.svg'
import WrongAnswerIcon from '../../../assets/images/wrongAnswerIcon.svg'
import SkippedQuestionIcon from '../../../assets/images/skippedQuestionIcon.svg'
import AverageTimeTakenIcon from '../../../assets/images/averageTimeIcon.svg'
import NoOfUserAttempted from '../../../assets/images/NoOfStudentAttempted_Violet.svg'
import CircularProgressBar from "./EvaluationPopUpModels/ChapterWiseAnalysis/CircularProgressBar";
import ChevronUpIcon from '@mui/icons-material/ExpandLess';
import ChevronDownIcon from '@mui/icons-material/ExpandMore';
import PreviewModalQuestion from "./EvaluationPopUpModels/PreviewModalQuestion/PreviewModalQuestion";
import PreviewModalImage from "./EvaluationPopUpModels/PreviewModalQuestion/PreviewImage";
import { qpView, qpViewRevamp } from "../../../Api/AssessmentReports";
import PreviewContentComponent from "../../AssessmentsContainer/CreateNewQuestion/PreviewModalComponent/PreviewContentComponent/PreviewContentComponent";
import Spinner from "../../SharedComponents/Spinner";
import { useLocation } from "react-router-dom";
import { getToolTipData } from "../../../Api/QuestionTypePaper";
import { alphabet, getImage, studentTooltip } from "../../../constants/helper";
import { useSelector } from "react-redux";
import { ReduxStates } from "../../../redux/reducers";

interface QuestionObject {
    questionText: string;
    part: number;
    section: number;
    questionNo: number;
    marks: number;
    chapter: string;
    difficulty: string;
    marksAchieved: number;
    errorAnalysis: string;
    highestMarks?: any;
    lowestMarks?: any;
    totalMarks?: any;
    metaData?: {
        key: string;
        value: string;
        sequence: number;
    }[];
}

interface QuestionOverviewProps {
    qpDetails?: QuestionObject[] | any;
    handleDownload?: () => void;
    isRoleTeacher?: boolean;
    isRoleStudent?: boolean;
    isOnlineTestReport?: boolean  //this will work as condition from where you coming to reports is it online test or other
    onlineStudentReportAnalysis?: boolean  //this will work as condition from where you coming to reports is it online test or other
}

interface CardSectionsPropsInterface {
    highestMarks: any;
    lowestMarks: any;
    noOfStudentAttempted: string;
    totalMarks: string;
    studentDetails: any
}

interface OptionsCardProps {
    optionNo?: number;
    optionValue?: string | any;
    cardText?: string | any;
    cardNumber?: number;
    cardIcon?: string;
    isCorrectAnswer?: boolean;
    isSelected?: boolean;
    optionData?: any
    questionId?: number;
}

const CustomTooltip = styled((props: any) => (
    <Tooltip {...props} />
))(({ theme }) => ({
    [`& .MuiTooltip-tooltip`]: {
        maxHeight: '300px',
        overflowY: 'auto',
        width: 'auto',
        maxWidth: '200px',  // Optional: Set a max width for the tooltip
        padding: theme.spacing(1),
    },
}));
interface CardProps {
    text: string;
    textNumber?: string | number;
    image?: string;
    background?: string;
    isOnlineTestReport?: boolean;
    questionId?: any;
    optionId?: number;
    studentDetails?: { studentName: string, className: string }[]; // Adjust this type as needed based on actual structure
}


const Cards: React.FC<CardProps> = ({ text, textNumber, image, background, studentDetails = [], isOnlineTestReport, questionId, optionId }) => {
    const isMobileView = useSelector((state: ReduxStates) => state?.mobileMenuStatus?.isMobileView);
    const location = useLocation();
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hovered, setHovered] = useState(false);


    const getTextKey = (text: string) => {
        const mapping: { [key: string]: any } = {
            "answered correctly": studentTooltip?.answeredCorrectly,
            "attempted by": studentTooltip?.option,
            "no of students attempted": studentTooltip?.attempted,
            "skipped by": studentTooltip?.skipped,
            "answered wrong": studentTooltip?.answeredWrong
        };
        return mapping[text?.toLowerCase()];
    };


    const toolTipData = async (questionId: number, text: string) => {

        if (!!questionId && text !== "Right Option" && text !== "Avg Attempt Time") {
            setIsLoading(true);
            const obj: any = {
                questionPaperId: location.state.id,
                questionId: questionId,
                key: getTextKey(text),
            }
            if (obj?.key === studentTooltip?.option) {
                obj["optionId"] = optionId
            }
            const response = await getToolTipData(obj);
            if (response?.data.length > 0) {
                setData(response?.data?.map((data: any) => data?.studentName));
            }
            setIsLoading(false);
        }
    };
    const handleMouseEnter = (questionId: number, text: string) => {
        setHovered(true);
        toolTipData(questionId, text);
    };

    const handleMouseLeave = () => {
        setHovered(false);
    };

    const studentList = studentDetails.map((item: { studentName: string, className: string }, index: number) => `${index + 1}. ${item.studentName} - ${item?.className}`);
    const tooltipContent = (
        <div>
            {!isOnlineTestReport ? <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                {studentList.length > 0 ? (
                    studentList.map((name, index) => (
                        <li key={index}>{name}</li>
                    ))
                ) : (
                    <li>No students available</li>
                )}
            </ul> :
                <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                    {data?.length > 0 ? (
                        data.map((name, index) => (
                            <li key={index}>{name}</li>
                        ))
                    ) : <li>No students available</li>}
                </ul>
            }
        </div>
    );

    return (
        <div className="assess-card" style={{ backgroundColor: background }}>
            <div className="assess-card-child">
                <div className="icn-text-cont">
                    <div>
                        <img src={image} alt="" className="src" />
                    </div>
                    <div className="assess-label-text" style={{ fontWeight: 700 }}>
                        {text}
                    </div>
                </div>
                <div className="count-container" style={{ fontWeight: 900, display: 'flex', alignItems: 'center' }}>
                    {textNumber}
                    {/* Commented the code as its not part of current MVP */}
                    {isOnlineTestReport && text !== "Avg Attempt Time" && (
                        <CustomTooltip
                            title={tooltipContent}
                            placement="right"
                            arrow
                            onMouseEnter={() => handleMouseEnter(questionId, text)} // Trigger on hover
                            onMouseLeave={handleMouseLeave}
                        >
                            <div style={{ marginLeft: 10 }}>
                                <img src={infoIcon} alt="" className="src"
                                // onClick={() => { toolTipData(questionId, text) }} 
                                />
                            </div>
                        </CustomTooltip>
                    )}
                </div>
            </div>
        </div>
    );
};

const CardSections = ({ highestMarks, lowestMarks, noOfStudentAttempted, totalMarks, studentDetails }: CardSectionsPropsInterface) => {
    return (
        <div className="assess-card-cont mt-3">
            <div>
                <Cards
                    text={"Highest / Lowest"}
                    textNumber={`${highestMarks === 0 && lowestMarks === 0 ? '0 / 0' : highestMarks === undefined && lowestMarks === undefined ? `NA / NA` : `${highestMarks} / ${highestMarks === lowestMarks ? 'NA' : lowestMarks}`}`}
                    image={MARKS}
                    background={"#6E55D51A"}
                    studentDetails={studentDetails}
                />
            </div>
            <div>
                <Cards
                    text={"No of Students Attempted"}
                    textNumber={noOfStudentAttempted === undefined ? '0' : noOfStudentAttempted}
                    image={ANSWER}
                    background={"#BE6AF61A"}
                    studentDetails={studentDetails}
                />
            </div>
        </div>
    );
};

interface OnlineTestReportEvaluationCardsInterface {
    onlineTestReportCardData?: any
    isOnlineTestReport?: boolean
}

const OnlineTestReportEvaluationCards = ({
    onlineTestReportCardData,
    isOnlineTestReport
}: OnlineTestReportEvaluationCardsInterface) => {
    const onlineQuestionAndAnswerCardsData = [
        {
            text: "Answered Correctly",
            statisticsData: onlineTestReportCardData?.noOfCorrectAnswers,
            icon: CorrectAnswerIcon,
            showInfoIcon: true,
            backGroundColor: "rgba(225, 246, 241, 1)",
        },
        {
            text: "Answered Wrong",
            statisticsData: onlineTestReportCardData?.noOfIncorrectAnswers,
            icon: WrongAnswerIcon,
            showInfoIcon: true,
            backGroundColor: "rgba(254, 238, 236, 1)",
        },
        {
            text: "Skipped By",
            statisticsData: onlineTestReportCardData?.noOfSkippedQuestions,
            icon: SkippedQuestionIcon,
            showInfoIcon: true,
            backGroundColor: "rgba(228, 236, 248, 1)",
        },
        {
            text: "Avg Attempt Time",
            statisticsData: onlineTestReportCardData?.averageAttemptTime + " s",
            icon: AverageTimeTakenIcon,
            showInfoIcon: true,
            backGroundColor: "rgb(254, 248, 231)",
        },
    ];
    return (
        <>
            <div className="assess-card-cont mt-3">
                <Cards
                    text={"No Of Students Attempted"}
                    textNumber={onlineTestReportCardData?.noOfStudentAttempted}
                    image={NoOfUserAttempted}
                    background={"rgba(190, 106, 246, 0.1)"}
                    studentDetails={[]}
                    isOnlineTestReport={isOnlineTestReport}
                    questionId={onlineTestReportCardData?.id}
                />
            </div>
            <div className="assess-card-cont assess-card-data mt-3">
                {onlineQuestionAndAnswerCardsData?.map((cardData, index) => {
                    return (
                        <div key={index}>
                            <Cards
                                text={cardData?.text}
                                textNumber={cardData?.statisticsData}
                                image={cardData?.icon}
                                background={cardData?.backGroundColor}
                                studentDetails={[]}
                                isOnlineTestReport={isOnlineTestReport}
                                questionId={onlineTestReportCardData?.id}
                            />
                        </div>
                    );
                })}
            </div>
        </>
    );
};


const OptionsCard: React.FC<OptionsCardProps> = ({
    optionNo,
    optionValue,
    cardText,
    cardNumber,
    cardIcon,
    isCorrectAnswer,
    optionData,
    questionId,
}) => {
    console.log("optionValue---", optionValue);
    console.log("optionData---", optionData);

    return (
        <div className="optionsCardMainContainer">
            <div className="optionsTextContainer">
                <p className="optionNumber">Option {optionNo} </p>
                <div dangerouslySetInnerHTML={{ __html: optionValue }}></div>
            </div>
            <div className="horizontalLine"></div>
            <div className="cardContainerOfTwo">
                <div className="assess-card-cont mt-3">
                    <Cards
                        text={cardText}
                        textNumber={cardNumber}
                        image={cardIcon}
                        background={"rgba(190, 106, 246, 0.1)"}
                        studentDetails={[]}
                        questionId={questionId}
                        isOnlineTestReport={true}
                        optionId={optionData?.id}
                    />
                </div>
                <div className="assess-card-cont mt-3">
                    <Cards
                        text={isCorrectAnswer ? "Right Option" : "Wrong Option"}
                        image={isCorrectAnswer ? CorrectAnswerIcon : WrongAnswerIcon}
                        background={
                            isCorrectAnswer
                                ? "rgba(225, 246, 241, 1)"
                                : "rgba(254, 238, 236, 1)"
                        }
                    />
                </div>
            </div>
        </div>
    );
};

const OptionsCardStudentOnlineAnalysis: React.FC<OptionsCardProps> = ({
    optionNo,
    optionValue,
    cardText,
    cardNumber,
    cardIcon,
    isCorrectAnswer,
    isSelected,
}) => {
    return (
        <div className="optionsCardMainContainer">
            <div className="optionsTextContainer">
                <p className="optionNumber">Option {optionNo} </p>
                <div dangerouslySetInnerHTML={{ __html: optionValue }}></div>
            </div>
            <div className="horizontalLine"></div>
            <div className="cardContainerOfTwo">
                <div className="assess-card-cont mt-3">
                    <Cards
                        text={isCorrectAnswer ? "Right Option" : "Wrong Option"}
                        image={isCorrectAnswer ? CorrectAnswerIcon : WrongAnswerIcon}
                        background={
                            isCorrectAnswer
                                ? "rgba(225, 246, 241, 1)"
                                : "rgba(254, 238, 236, 1)"
                        }
                    />
                </div>
                {isSelected && <div className="assess-card-cont mt-3">
                    <Cards
                        text={"Selected By Student"}
                        image={isCorrectAnswer ? CorrectAnswerIcon : WrongAnswerIcon}
                        background={"rgba(225, 246, 241, 1)"}
                    />
                </div>}
            </div>
        </div>
    );
};



const QuestionOverview = ({
    qpDetails,
    handleDownload,
    isRoleTeacher,
    isRoleStudent,
    isOnlineTestReport,
    onlineStudentReportAnalysis
}: QuestionOverviewProps) => {

    const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(
        new Set()
    );
    const [view, setView] = useState(false)
    const [openPreview, setOpenPreview] = useState(false);
    const [previewContent, setPreviewContent] = useState<any>();
    const [openPreviewImg, setOpenPreviewImg] = useState<boolean>(false);
    const [imgContent, setImgContent] = useState<string>("");
    const [isPreviewPaylod, setIsPreviewPayload] = useState<any>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [isLoading, setLoading] = useState(false);

    // Calculate the current questions to display
    const indexOfLastQuestion = currentPage * itemsPerPage;
    const indexOfFirstQuestion = indexOfLastQuestion - itemsPerPage;
    const currentQuestions = qpDetails?.length > 0 && qpDetails?.slice(indexOfFirstQuestion, indexOfLastQuestion);
    const isMobileView = useSelector((state: ReduxStates) => state?.mobileMenuStatus?.isMobileView);



    // const handleReadMoreToggle = (index: number, question: QuestionObject) => {
    //     const newExpandedQuestions = new Set(expandedQuestions);
    //     if (newExpandedQuestions.has(index)) {
    //         newExpandedQuestions.delete(index);
    //     } else {
    //         newExpandedQuestions.add(index);
    //     }
    //     setExpandedQuestions(newExpandedQuestions);
    // };
    (window as any).handleReadMoreToggle = (questionText: any) => {
        setPreviewContent({ id: questionText.split(',')[0], totalMarks: questionText.split(',')[1], isPublic: questionText.split(',')[2] });
        setOpenPreview(true);
    };

    (window as any).handleClick = (key: any, event: any) => {
        setOpenPreviewImg(true)
        setImgContent(key)
    };


    // Handle page change
    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };
    // const truncateText = (dataList: any, length: number, index: number) => {
    //     let str = dataList?.questionText;

    //     if (str.includes("{{") || str.includes("<img")) {
    //         dataList?.questionImageDetails?.forEach((questionImage: any) => {
    //             let replaceImageKey = str.replace(
    //                 `{{${questionImage?.key}}}`,
    //                 `<span class="listImageTag" onclick="handleClick('${questionImage?.src}')">${questionImage?.tag} ${' '}</span>`
    //             );
    //             str = replaceImageKey;
    //         });
    //     }

    //     let plainText = str.replace(/(<([^>]+)>)/gi, "").trim('');
    //     // Truncate plain text if it's longer than the specified length
    //     if (plainText.length > length) {
    //         // Find the HTML position of the truncation point - need to adjust the length
    //         // let truncationIndex = str.indexOf(plainText.slice(length, length + 1));
    //         // Ensure truncation within an HTML-safe boundary
    //         str = str.slice(0, length) + '...';
    //     }
    //     return { truncatedText: str, plainTextLength: plainText.length };
    // };



    const truncateTextImage = (dataList: any, length: number, index: number) => {
        let str = dataList?.questionText;

        // Replace image placeholders with actual image tags
        if (str.includes("{{") || str.includes("<img")) {
            dataList?.questionImageDetails?.forEach((questionImage: any) => {
                str = str.replace(
                    `{{${questionImage?.key}}}`,
                    `<span class="listImageTag" onclick="handleClick('${questionImage?.src}')">${questionImage?.tag} </span>`
                );
            });
        }
        let truncatedText = '';
        let currentLength = 0;
        let inTag = false;
        let skipContent = false;

        for (let i = 0; i < str.length; i++) {
            if (str.slice(i, i + 22) === '<span class="listImageTag"') {
                skipContent = true;
            }
            if (skipContent && str.slice(i, i + 7) === '</span>') {
                skipContent = false;
                i += 6; // Move the index past the closing tag
                continue;
            }
            if (skipContent) {
                truncatedText += str[i];
                continue;
            }

            if (str[i] === '<') {
                inTag = true;
            }
            if (!inTag) {
                currentLength++;
            }
            if (str[i] === '>') {
                inTag = false;
            }
            truncatedText += str[i];
            if (currentLength >= length && !inTag) {
                truncatedText += '...';
                truncatedText += `<a class="listImageTag readMoreFontSize" onclick="handleReadMoreToggle('${dataList?.id}, ${dataList?.totalMarks}, ${dataList?.isPublic}')">${'Read More'} </a>`
                break;
            } else if (dataList?.questionTypeName === "Comprehensive" || dataList?.questionTypeName === "Match The Following") { // This block for Comprehensive and Match The Following to show read more
                if (str.replace(/(<([^>]+)>)/gi, "").trim('').toString().length > 250) { // if the question length is grater than 250
                    truncatedText = str.replace(/(<([^>]+)>)/gi, "").trim('').substring(0, 250);
                    truncatedText += '...';
                    truncatedText += `<a class="listImageTag readMoreFontSize" onclick="handleReadMoreToggle('${dataList?.id}, ${dataList?.totalMarks}, ${dataList?.isPublic}')">${'Read More'} </a>`
                } else { // if the question length is less than 250
                    truncatedText += str.toString().substring(1, str.toString().length);
                    truncatedText += '...';
                    truncatedText += `<a class="listImageTag readMoreFontSize" onclick="handleReadMoreToggle('${dataList?.id}, ${dataList?.totalMarks}, ${dataList?.isPublic}')">${'Read More'} </a>`
                }

                break;
            }
        }

        return { truncatedText, plainTextLength: currentLength };
    };


    const getPreviewDetails = async () => {
        try {
            setLoading(true);
            const apiPayload = {
                questionId: previewContent?.id,
                marks: previewContent?.totalMarks,
                isPublic: previewContent?.isPublic
            }

            const response = await qpViewRevamp(apiPayload);
            if (response?.data) {
                setIsPreviewPayload(response?.data);
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            console.error("Error while view the Question paper");
        }
    }

    // TODO : calling the is preview questions details
    useEffect(() => {
        if (openPreview && previewContent) {
            //  Calling the api 
            getPreviewDetails();
        }
    }, [openPreview, previewContent])

    return (
        <React.Fragment>
            {isLoading && <Spinner />}
            <Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: isMobileView ? "10px" : 1,
                        mb: isMobileView ? "10px" : 1,
                    }}
                >
                    <div style={{ fontWeight: isMobileView ? "600" : "700", fontSize: !isMobileView ? "18px" : "16px", margin: isMobileView ? "0px 0px 0px 15px" : "" }}>
                        Question and Answer Overview
                    </div>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        {/* <ButtonComponent type={"contained"} label={'Download Report'} textColor={'#FFFFFF'} buttonSize={'Medium'} minWidth={'200'} backgroundColor={'#01B58A'} /> */}
                        <Typography sx={{ color: '#01B58A', cursor: 'pointer', fontWeight: '600', display: "flex", alignItems: "center", fontSize: isMobileView ? "16px" : "1rem" }} onClick={() => setView(!view)}>
                            View Details
                            <IconButton>
                                {!view ? <ChevronDownIcon fontSize={isMobileView ? "medium" : 'large'} /> : <ChevronUpIcon fontSize={isMobileView ? "medium" : 'large'} />}
                            </IconButton>
                        </Typography>
                    </div>
                </Box>
                {view && currentQuestions?.length &&
                    currentQuestions.map((question: any, index: number) => (
                        <React.Fragment key={index}>
                            <Card
                                variant="outlined"
                                sx={{
                                    marginBottom: 2,
                                    backgroundImage: !isRoleTeacher ? "radial-gradient(rgba(56, 93, 223, 0.1) 0%, rgba(255, 255, 255, 0.1) 100%)" : "radial-gradient(rgba(1, 181, 138, 0.1) 0%, rgba(255, 255, 255, 0.1)100%)",
                                    padding: 2,
                                    borderRadius: 2,
                                }}
                            >
                                <CardContent>
                                    {/* TODO : this code is for Read More */}
                                    {/* Expanded view */}
                                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", paddingRight: !isMobileView ? 50 : "" }}>
                                        <div className="section-1" style={{ display: "flex", justifyContent: "space-between", flexDirection: "column" }}>
                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                <div>
                                                    <Typography variant="h2" sx={{ fontWeight: 700, display: "flex" }} gutterBottom>
                                                        <span className="html-table-bordar" dangerouslySetInnerHTML={{ __html: truncateTextImage(question, 250, index).truncatedText.replace(/color:#f00/g, "color:#000000") }} />
                                                    </Typography>
                                                    {/* {(truncateText(question, 250, index).plainTextLength > 250 || question?.questionTypeName === "Comprehensive" || question?.questionTypeName === "Match The Following") && (
                                                        <Link
                                                            component="button"
                                                            variant="body2"
                                                            onClick={() => handleReadMoreToggle(index, question)}
                                                            style={{ color: "#01B58A", fontWeight: 700, }}
                                                        >
                                                            Read More
                                                        </Link>
                                                )} */}
                                                    {/*  This is for the QP if the API type is MCQ then we suppose to Show the options */}
                                                    {question?.questionTypeName === "MCQ" && !isOnlineTestReport && !onlineStudentReportAnalysis && question?.options && question?.options?.length > 0 && <div className='d-flex align-items-start mx-0' style={{ marginTop: "14px" }}>
                                                        <Box className='rightsideHeader' >
                                                            <span className='questionContent'>
                                                                <ul className='mcqFormulaListSect'>
                                                                    {/* <li><span></span><div dangerouslySetInnerHTML={{ __html: getImage(question, 250, index).truncatedText.replaceAll("color:#f00", "color:#000000") }}></div></li> */}
                                                                    {question?.options?.map((ele: any, index: number) => {
                                                                        return <li><span>{alphabet[index]}{")"}</span><div dangerouslySetInnerHTML={{ __html: getImage(ele.text, question?.questionImageDetails) }}></div></li>
                                                                    })}
                                                                </ul>
                                                            </span>
                                                        </Box>
                                                    </div>}
                                                    <Typography
                                                        variant="body2"
                                                        color="textSecondary"
                                                        gutterBottom
                                                        style={{ fontWeight: 600, display: !isMobileView ? "flex" : "", alignItems: "center" }}
                                                    >
                                                        {question?.metaData?.find((item: any) => item.key === "Part")?.value && (
                                                            <>
                                                                {question.metaData.find((item: any) => item.key === "Part").value}
                                                                <span className="dot">•</span>
                                                            </>
                                                        )}
                                                        {question?.metaData?.find((item: any) => item.key === "Section")?.value && (
                                                            <>
                                                                {question.metaData.find((item: any) => item.key === "Section").value}
                                                                <span className="dot">•</span>
                                                            </>
                                                        )}
                                                        {question?.metaData?.find((item: any) => item.key === "Question")?.value && (
                                                            <>
                                                                {question.metaData.find((item: any) => item.key === "Question").value}
                                                                <span className="dot">•</span>
                                                            </>
                                                        )}
                                                        {question?.totalMarks && (
                                                            <>
                                                                {question.totalMarks} marks
                                                                <span className="dot">•</span>
                                                            </>
                                                        )}
                                                        {question.chapterName && (
                                                            <>
                                                                Chapter: {question.chapterName}
                                                                <span className="dot">•</span>
                                                            </>
                                                        )}
                                                        {question?.level && (
                                                            <>
                                                                {question.level}
                                                            </>
                                                        )}
                                                    </Typography>
                                                </div>
                                                {isMobileView && (
                                                    !isOnlineTestReport ? (<div className="section-2">
                                                        {/* Conditional rendering of CircularProgressBar */}
                                                        {isRoleTeacher &&
                                                            !isRoleStudent && (
                                                                <CircularProgressBar
                                                                    height={80}
                                                                    width={80}
                                                                    heading={!isMobileView ? (!isOnlineTestReport ? "Average Score" : "AQP") : ""}
                                                                    isFlag={false}
                                                                    subjectDetails={{
                                                                        percentage: !isOnlineTestReport ? isNaN(Math.round(question?.averageScore)) ? `NA / ${question?.totalMarks}` : Math.round(question?.averageScore) + '/' + question?.totalMarks : question?.avgQuestionPerformance,
                                                                        averageScore: !isOnlineTestReport ? isNaN((Math.round(question?.averageScore) / question?.totalMarks) * 100) ? 0 : ((Math.round(question?.averageScore) / question?.totalMarks) * 100) : question?.averageScore || 0
                                                                    }}
                                                                    strokeWidth={15}
                                                                    isQpOverview={isOnlineTestReport ? false : true}
                                                                    footerText={isOnlineTestReport ? "Average Question Performance" : ""}
                                                                    isOnlineTestReport={isOnlineTestReport}

                                                                />
                                                            )}
                                                    </div>) : "")
                                                }
                                            </div>
                                            <div>
                                                {/* Card Section */}
                                                {isRoleTeacher &&
                                                    !isRoleStudent && !isOnlineTestReport && !onlineStudentReportAnalysis && (
                                                        <CardSections
                                                            highestMarks={
                                                                question?.highestMarks
                                                            }
                                                            lowestMarks={
                                                                question?.lowestMarks
                                                            }
                                                            noOfStudentAttempted={question?.noOfStudentAttempted}
                                                            totalMarks={question?.totalMarks}
                                                            studentDetails={question?.studentDetails}
                                                        />
                                                    )}
                                            </div>
                                        </div>
                                        {!isMobileView && (
                                            !isOnlineTestReport ? (<div className="section-2">
                                                {/* Conditional rendering of CircularProgressBar */}
                                                {isRoleTeacher &&
                                                    !isRoleStudent && (
                                                        <CircularProgressBar
                                                            height={150}
                                                            width={150}
                                                            heading={!isOnlineTestReport ? "Average Score" : "AQP"}
                                                            isFlag={false}
                                                            subjectDetails={{
                                                                percentage: !isOnlineTestReport ? isNaN(Math.round(question?.averageScore)) ? `NA / ${question?.totalMarks}` : Math.round(question?.averageScore) + '/' + question?.totalMarks : question?.avgQuestionPerformance,
                                                                averageScore: !isOnlineTestReport ? isNaN((Math.round(question?.averageScore) / question?.totalMarks) * 100) ? 0 : ((Math.round(question?.averageScore) / question?.totalMarks) * 100) : question?.averageScore || 0
                                                            }}
                                                            strokeWidth={15}
                                                            isQpOverview={isOnlineTestReport ? false : true}
                                                            footerText={isOnlineTestReport ? "Average Question Performance" : ""}
                                                            isOnlineTestReport={isOnlineTestReport}

                                                        />
                                                    )}
                                            </div>) : "")
                                        }

                                    </div>
                                    <div style={{ display: "flex", alignItems: "flex-end", gap: "20px" }}>
                                        <div className="assess-online-card-container" style={{ flexGrow: "1", alignSelf: "center" }}>
                                            {isOnlineTestReport &&
                                                <OnlineTestReportEvaluationCards onlineTestReportCardData={question} isOnlineTestReport={isOnlineTestReport} />
                                            }
                                        </div>
                                        {

                                            isOnlineTestReport ? (<div className="section-2" style={{ marginTop: "-90px" }}>
                                                {/* Conditional rendering of CircularProgressBar */}
                                                {isRoleTeacher &&
                                                    !isRoleStudent && (
                                                        <CircularProgressBar
                                                            height={150}
                                                            width={150}
                                                            heading={!isOnlineTestReport ? "Average Score" : "AQP"}
                                                            isFlag={false}
                                                            subjectDetails={{
                                                                percentage: !isOnlineTestReport ? Math.round(question?.totalScore) + '/' + question?.totalStudents : question?.avgQuestionPerformance,
                                                                averageScore: question?.averageScore || 0
                                                            }}
                                                            strokeWidth={15}
                                                            isQpOverview={isOnlineTestReport ? false : true}
                                                            footerText={isOnlineTestReport ? "Average Question Performance" : ""}
                                                            isOnlineTestReport={isOnlineTestReport}

                                                        />
                                                    )}
                                            </div>) : ""

                                        }


                                    </div>
                                    {isOnlineTestReport && <div className="optionsRenderContainer">
                                        {question?.options?.map((data: any, index: number) => {
                                            return (
                                                <div key={index}>
                                                    <OptionsCard
                                                        optionNo={data?.order}
                                                        optionValue={question?.questionImageDetails?.length > 0 ? getImage(data?.actualText, question?.questionImageDetails) : data?.actualText}
                                                        cardText={"Attempted By"}
                                                        cardNumber={data?.noOfAttempts}
                                                        cardIcon={NoOfUserAttempted}
                                                        isCorrectAnswer={data.isCorrect}
                                                        optionData={data}
                                                        questionId={question?.id}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>}

                                    {onlineStudentReportAnalysis && <div className="optionsRenderContainer">
                                        <div className="assess-card-cont mt-3">
                                            <Cards
                                                text={"Attempt Time Student VS Class"}
                                                textNumber={`${question?.studentAttemptedTime}s VS ${question?.averageAttemptTime}s `}
                                                image={AverageTimeTakenIcon}
                                                background={"rgba(254, 248, 231, 1)"}
                                                studentDetails={[]}
                                            />
                                        </div>
                                    </div>}

                                    {onlineStudentReportAnalysis && <div className="optionsRenderContainer">
                                        {question?.options?.map((data: any, index: number) => {
                                            return (
                                                <div key={index}>
                                                    <OptionsCardStudentOnlineAnalysis
                                                        optionNo={index + 1}
                                                        optionValue={question?.questionImageDetails?.length > 0 ? getImage(data?.actualText, question?.questionImageDetails) : data?.actualText}
                                                        cardText={"Attempted By"}
                                                        cardNumber={data?.cardNumber}
                                                        cardIcon={NoOfUserAttempted}
                                                        isCorrectAnswer={
                                                            data.isCorrect
                                                        }
                                                        isSelected={data?.isSelected}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>}

                                    {window.location.href.includes("schoolReport") && !onlineStudentReportAnalysis && <Box
                                        sx={{
                                            backgroundColor: "fff",
                                            padding: 2,
                                            borderRadius: 1,
                                            boxShadow: "0px 0px 22px 0px #0000000D",
                                            marginTop: 2,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                backgroundColor: "#E4ECF8",
                                                padding: 1,
                                                height: "36px",
                                                borderRadius: 1,
                                                display: "flex",
                                                alignItems: "center",
                                                marginBottom: 1,
                                            }}
                                        >
                                            <Radio
                                                checked
                                                sx={{
                                                    color: "#385ddf",
                                                    "&.Mui-checked": {
                                                        color: "#385ddf",
                                                    },
                                                    marginRight: 1,
                                                }}
                                            />
                                            <Typography variant="body2" sx={{ fontWeight: 900 }}>
                                                Marks Achieved: {question?.marksObtained || 0}/{question?.totalMarks}
                                            </Typography>
                                        </Box>
                                        {question?.errors && question?.errors.length > 0 && (
                                            <Box>
                                                <Typography variant="subtitle2">
                                                    Error Analysis:
                                                </Typography>
                                                {question?.errors.map((item: { text: string }, index: number) => {
                                                    return <Typography
                                                        variant="body2"
                                                        color="textSecondary"
                                                        key={index}
                                                    >
                                                        <p style={{ marginBottom: "0px" }}>{index + 1}. {item?.text}</p>
                                                    </Typography>
                                                })}
                                            </Box>
                                        )}
                                    </Box>}
                                </CardContent>
                            </Card>
                            <hr />
                        </React.Fragment>
                    ))}

                <div className='assessPagenation' style={{ display: 'flex', justifyContent: 'start', paddingTop: view ? '1rem' : '' }}>
                    {qpDetails && qpDetails?.length > itemsPerPage && view && (
                        <Box mt={2} display="flex" justifyContent="center">
                            <Pagination
                                count={Math.ceil(qpDetails.length / itemsPerPage)}
                                page={currentPage}
                                onChange={handlePageChange}
                                shape="rounded"
                            />
                        </Box>
                    )}
                </div>
            </Box>
            {openPreview && isPreviewPaylod !== null && <PreviewModalQuestion header="Preview Question" openPreview={openPreview} setOpenPreview={setOpenPreview} content={previewContent} questionType={isPreviewPaylod} setIsPreviewPayload={setIsPreviewPayload} />}
            {/* {openPreview && isPreviewPaylod && <PreviewContentComponent questionType={isPreviewPaylod} comprehensiveTypeStatus={true} comprehensiveTypeIndex={0}/> } */}
            {/* TODO Call the api and send the details */}
            {openPreviewImg && <PreviewModalImage header={''} openPreview={openPreviewImg} setOpenPreview={setOpenPreviewImg} content={imgContent} setContent={setImgContent} />}
        </React.Fragment>
    );
};

export default QuestionOverview;