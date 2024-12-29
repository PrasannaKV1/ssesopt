import React from 'react';
import "./MIFQuestionPaper13.css";
import ButtonComponent from '../../SharedComponents/ButtonComponent/ButtonComponent';
import undo from "../../../assets/images/Undo.svg";
import Redo from "../../../assets/images/Redo.svg";
import schoolLogo from "../../../assets/images/schoolLogo.svg";
import Tooltip from '@mui/material/Tooltip';
import { ReactComponent as QuestionPaperDeleteIcon } from "../../../assets/images/delete.svg";
import { ReactComponent as Refresh } from "../../../assets/images/refresh.svg";
import { ReactComponent as EditIcon } from "../../../assets/images/edit.svg";
//import { ReactComponent as Refresh } from "../../../../../assets/.svg";

const QuestionPaper13 = () => {
    return (
        <>
            <div className='quePapPreviewforPrint'>
                <div style={{display:'flex',justifyContent:"space-between"}}>
                <h2>Preview for Print</h2>
            <div  style={{marginRight:"10%"}}>
                <Tooltip className='randomizeTooltip'  title="Randomly assign different question paper set to students" arrow placement="left">
                <div>
                    <ButtonComponent backgroundColor="#01B58A" type="outlined" label={'Randomize'} textColor={'black'} buttonSize="medium" minWidth="150"/>
                </div>  
                </Tooltip>
                </div>
                </div>
                <div style={{ display: "flex", gap: "32%" }}>
                    <p>You can make edits to the generated question paper here</p>
                    <div>
                        <ButtonComponent type={undefined} label={'undo'} textColor={''} buttonSize={undefined} minWidth={''} image={undo} />
                        <ButtonComponent type={undefined} label={'Redo'} textColor={''} buttonSize={undefined} minWidth={''} image={Redo} />
                    </div>
                </div>
                <div className='quePapPreviewforPrintContent'>
                    <div className='quePapPreviewSection'>
                        <img className="imgLogo" src={schoolLogo} alt="schoolLogo" />
                        <h3>Blue Bell Vidyalay, Shanivar Peth, Pune</h3>
                        <h4>CBSE Board - English Medium</h4>
                        <h5 className='mt-4'>Cycle Test</h5>
                    </div>
                    <div className='col-12 d-flex' style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h6>Time: 60 mins</h6>
                        <h6>Science</h6>
                        <h6>Total marks: 33</h6>
                    </div>
                    <div className='col-12 d-flex' style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <p>Name:__________________</p>
                        <p>Class: ____</p>
                        <p>Section: ____</p>
                        <p>Roll No.: ___</p>
                    </div>
                    <h3>Instructions:</h3>
                    <div className='qstnPprInstructions'>
                        <ol type="i">
                            <li> Write your Name, Class, Section and Roll number on the Question paper and Answer sheet</li>
                            <li> If caught using unfair means, a penalty of marks will be deducted</li>

                        </ol>
                    </div>
                    <div className='qntpaperHeadingOne'></div>
                    <div className='quePapPreviewSection'>
                        <h5>Part - I (Attempt Any 1 Section)</h5>
                        <h5>Section - A</h5>
                    </div>
                    <div className="questionPaperSubHeaders">
                        <p>{"1) Fill in the blanks"}</p>
                        <div style={{ display: "flex", gap: "100px" }}>
                            <p>(10 marks)</p>
                            <ButtonComponent type="outlined" endIcon={
                                <Tooltip title="Delete" arrow placement="top"><QuestionPaperDeleteIcon /></Tooltip>} textColor="#000000" backgroundColor="#01B58A" disabled={false} buttonSize="" onClick={() => { }} label="Section" minWidth="95px" />
                        </div>
                    </div>
                    <ul>
                        <div className='questionPaperContent'>
                            <li className='col-7'>
                                <p>A vehicle covers a distance of 43.2 km in 2.4 liter of petrol. How much distance will it cover in 1 liter of petrol? A vehicle covers a distance of 43.2 km in 2.4 liter of petrol.</p>
                            </li>
                            <div style={{ display: "flex", marginRight: "20px" }}>
                                <p style={{ marginRight: "70px" }}>(2 marks)</p>
                                <ButtonComponent type="outlined"
                                    endIcon={<>
                                        <Tooltip title="Refresh" arrow placement="top"><Refresh className="btnIcon" /></Tooltip>
                                        <Tooltip title="Edit" arrow placement="top"><EditIcon style={{ height: "20px" }} /></Tooltip>
                                        <Tooltip title="Delete" arrow placement="top"><QuestionPaperDeleteIcon /></Tooltip></>
                                    }
                                    textColor="#000000" backgroundColor="#01B58A" disabled={false} buttonSize=" " onClick={() => { }} label="Question" minWidth="138px" />
                            </div>
                        </div>
                        <div className='questionPaperContent'>
                            <li className='col-7'>
                                <p>A vehicle covers a distance of 43.2 km in 2.4 liter of petrol. How much distance will it cover in 1 liter of petrol?</p>
                            </li>
                            <div style={{ display: "flex", marginRight: "20px" }}>
                                <p style={{ marginRight: "70px" }}>(2 marks)</p>
                                <ButtonComponent type="outlined" endIcon={<>
                                    <Tooltip title="Refresh" arrow placement="top"><Refresh className='btnIcon' /></Tooltip>
                                    <Tooltip title="Edit" arrow placement="top"><EditIcon style={{ height: "20px" }} /></Tooltip>
                                    <Tooltip title="Delete" arrow placement="top"><QuestionPaperDeleteIcon /></Tooltip>
                                </>} textColor="#000000" backgroundColor="#01B58A" disabled={false} buttonSize="" onClick={() => { }} label="Question" minWidth="138px" />
                            </div>
                        </div>
                        <div className='questionPaperContent'>
                            <li className='col-7'> <p>__________ * (-10)=0</p></li>
                            <div style={{ display: "flex", marginRight: "20px" }}>
                                <p style={{ marginRight: "70px" }}>(2 marks)</p>
                                <ButtonComponent type="outlined" endIcon={<>
                                    <Tooltip title="Refresh" arrow placement="top"><Refresh className='btnIcon' /></Tooltip>
                                    <Tooltip title="Edit" arrow placement="top"><EditIcon style={{ height: "20px" }} /></Tooltip>
                                    <Tooltip title="Delete" arrow placement="top"><QuestionPaperDeleteIcon /></Tooltip></>} textColor="#000000" backgroundColor="#01B58A" disabled={false} buttonSize="" onClick={() => { }} label="Question" minWidth="138px" />
                            </div>
                        </div>
                        <div className='questionPaperContent'>
                            <li className='col-7'><p>__________ * (-10)=0</p></li>
                            <div style={{ display: "flex", marginRight: "20px" }}>
                                <p style={{ marginRight: "70px" }}>(2 marks)</p>
                                <ButtonComponent type="outlined" endIcon={<>
                                    <Tooltip title="Refresh" arrow placement="top"><Refresh className='btnIcon' /></Tooltip>
                                    <Tooltip title="Edit" arrow placement="top"><EditIcon style={{ height: "20px" }} /></Tooltip>
                                    <Tooltip title="Delete" arrow placement="top"><QuestionPaperDeleteIcon /></Tooltip></>} textColor="#000000" backgroundColor="#01B58A" disabled={false} buttonSize=" " onClick={() => { }} label="Question" minWidth="138px" />
                            </div>
                        </div>
                        <div className='questionPaperContent'>
                            <li className='col-7'><p>__________ * (-10)=0</p></li>
                            <div style={{ display: "flex", marginRight: "20px" }}>
                                <p style={{ marginRight: "70px" }}>(2 marks)</p>
                                <ButtonComponent type="outlined" endIcon={<>
                                    <Tooltip title="Refresh" arrow placement="top"><Refresh className='btnIcon' /></Tooltip>
                                    <Tooltip title="Edit" arrow placement="top"><EditIcon style={{ height: "20px" }} /></Tooltip>
                                    <Tooltip title="Delete" arrow placement="top"><QuestionPaperDeleteIcon /></Tooltip></>} textColor="#000000" backgroundColor="#01B58A" disabled={false} buttonSize=" " onClick={() => { }} label="Question" minWidth="138px" />
                            </div>
                        </div>
                        <div className='questionPaperContent'>
                            <li className='col-7'><p>__________ * (-10)=0</p></li>
                            <div style={{ display: "flex", marginRight: "20px" }}>
                                <p style={{ marginRight: "70px" }}>(2 marks)</p>
                                <ButtonComponent type="outlined" endIcon={<>
                                    <Tooltip title="Refresh" arrow placement="top"><Refresh className='btnIcon' /></Tooltip>
                                    <Tooltip title="Edit" arrow placement="top"><EditIcon style={{ height: "20px" }} /></Tooltip>
                                    <Tooltip title="Delete" arrow placement="top"><QuestionPaperDeleteIcon /></Tooltip></>} textColor="#000000" backgroundColor="#01B58A" disabled={false} buttonSize=" " onClick={() => { }} label="Question" minWidth="138px" />
                            </div>
                        </div>
                        <div className='questionPaperContent'>
                            <li className='col-7'>
                                <p>A vehicle covers a distance of 43.2 km in 2.4 liter of petrol. How much distance will it cover in 1 liter of petrol?</p>
                            </li>
                            <div style={{ display: "flex", marginRight: "20px" }}>
                                <p style={{ marginRight: "70px" }}>(2 marks)</p>
                                <ButtonComponent type="outlined" endIcon={<>
                                    <Tooltip title="Refresh" arrow placement="top"><Refresh className='btnIcon' /></Tooltip>
                                    <Tooltip title="Edit" arrow placement="top"><EditIcon style={{ height: "20px" }} /></Tooltip>
                                    <Tooltip title="Delete" arrow placement="top"><QuestionPaperDeleteIcon /></Tooltip>
                                </>} textColor="#000000" backgroundColor="#01B58A" disabled={false} buttonSize="" onClick={() => { }} label="Question" minWidth="138px" />
                            </div>
                        </div>
                    </ul>
                    <div className="questionPaperSubHeaders">
                        <p>{"1) Fill in the blanks"}</p>
                        <div style={{ display: "flex", gap: "100px" }}>
                            <p>(10 marks)</p>
                            <ButtonComponent type="outlined" endIcon={
                                <Tooltip title="Delete" arrow placement="top"><QuestionPaperDeleteIcon /></Tooltip>} textColor="#000000" backgroundColor="#01B58A" disabled={false} buttonSize="" onClick={() => { }} label="Section" minWidth="95px" />
                        </div>
                    </div>
                    <ul>
                        <div className='questionPaperContent'>
                            <li className='col-7'>
                                <p>A vehicle covers a distance of 43.2 km in 2.4 liter of petrol. How much distance will it cover in 1 liter of petrol? A vehicle covers a distance of 43.2 km in 2.4 liter of petrol.</p>
                            </li>
                            <div style={{ display: "flex", marginRight: "20px" }}>
                                <p style={{ marginRight: "70px" }}>(2 marks)</p>
                                <ButtonComponent type="outlined"
                                    endIcon={<>
                                        <Tooltip title="Refresh" arrow placement="top"><Refresh className="btnIcon" /></Tooltip>
                                        <Tooltip title="Edit" arrow placement="top"><EditIcon style={{ height: "20px" }} /></Tooltip>
                                        <Tooltip title="Delete" arrow placement="top"><QuestionPaperDeleteIcon /></Tooltip></>
                                    }
                                    textColor="#000000" backgroundColor="#01B58A" disabled={false} buttonSize=" " onClick={() => { }} label="Question" minWidth="138px" />
                            </div>
                        </div>
                        <div className='questionPaperContent'>
                            <li className='col-7'>
                                <p>A vehicle covers a distance of 43.2 km in 2.4 liter of petrol. How much distance will it cover in 1 liter of petrol?</p>
                            </li>
                            <div style={{ display: "flex", marginRight: "20px" }}>
                                <p style={{ marginRight: "70px" }}>(2 marks)</p>
                                <ButtonComponent type="outlined" endIcon={<>
                                    <Tooltip title="Refresh" arrow placement="top"><Refresh className='btnIcon' /></Tooltip>
                                    <Tooltip title="Edit" arrow placement="top"><EditIcon style={{ height: "20px" }} /></Tooltip>
                                    <Tooltip title="Delete" arrow placement="top"><QuestionPaperDeleteIcon /></Tooltip>
                                </>} textColor="#000000" backgroundColor="#01B58A" disabled={false} buttonSize="" onClick={() => { }} label="Question" minWidth="138px" />
                            </div>
                        </div>
                        <div className='questionPaperContent'>
                            <li className='col-7'> <p>__________ * (-10)=0</p></li>
                            <div style={{ display: "flex", marginRight: "20px" }}>
                                <p style={{ marginRight: "70px" }}>(2 marks)</p>
                                <ButtonComponent type="outlined" endIcon={<>
                                    <Tooltip title="Refresh" arrow placement="top"><Refresh className='btnIcon' /></Tooltip>
                                    <Tooltip title="Edit" arrow placement="top"><EditIcon style={{ height: "20px" }} /></Tooltip>
                                    <Tooltip title="Delete" arrow placement="top"><QuestionPaperDeleteIcon /></Tooltip></>} textColor="#000000" backgroundColor="#01B58A" disabled={false} buttonSize="" onClick={() => { }} label="Question" minWidth="138px" />
                            </div>
                        </div>
                        <div className='questionPaperContent'>
                            <li className='col-7'><p>__________ * (-10)=0</p></li>
                            <div style={{ display: "flex", marginRight: "20px" }}>
                                <p style={{ marginRight: "70px" }}>(2 marks)</p>
                                <ButtonComponent type="outlined" endIcon={<>
                                    <Tooltip title="Refresh" arrow placement="top"><Refresh className='btnIcon' /></Tooltip>
                                    <Tooltip title="Edit" arrow placement="top"><EditIcon style={{ height: "20px" }} /></Tooltip>
                                    <Tooltip title="Delete" arrow placement="top"><QuestionPaperDeleteIcon /></Tooltip></>} textColor="#000000" backgroundColor="#01B58A" disabled={false} buttonSize=" " onClick={() => { }} label="Question" minWidth="138px" />
                            </div>
                        </div>
                        <div className='questionPaperContent'>
                            <li className='col-7'><p>__________ * (-10)=0</p></li>
                            <div style={{ display: "flex", marginRight: "20px" }}>
                                <p style={{ marginRight: "70px" }}>(2 marks)</p>
                                <ButtonComponent type="outlined" endIcon={<>
                                    <Tooltip title="Refresh" arrow placement="top"><Refresh className='btnIcon' /></Tooltip>
                                    <Tooltip title="Edit" arrow placement="top"><EditIcon style={{ height: "20px" }} /></Tooltip>
                                    <Tooltip title="Delete" arrow placement="top"><QuestionPaperDeleteIcon /></Tooltip></>} textColor="#000000" backgroundColor="#01B58A" disabled={false} buttonSize=" " onClick={() => { }} label="Question" minWidth="138px" />
                            </div>
                        </div>
                        <div className='questionPaperContent'>
                            <li className='col-7'><p>__________ * (-10)=0</p></li>
                            <div style={{ display: "flex", marginRight: "20px" }}>
                                <p style={{ marginRight: "70px" }}>(2 marks)</p>
                                <ButtonComponent type="outlined" endIcon={<>
                                    <Tooltip title="Refresh" arrow placement="top"><Refresh className='btnIcon' /></Tooltip>
                                    <Tooltip title="Edit" arrow placement="top"><EditIcon style={{ height: "20px" }} /></Tooltip>
                                    <Tooltip title="Delete" arrow placement="top"><QuestionPaperDeleteIcon /></Tooltip></>} textColor="#000000" backgroundColor="#01B58A" disabled={false} buttonSize=" " onClick={() => { }} label="Question" minWidth="138px" />
                            </div>
                        </div>
                        <div className='questionPaperContent'>
                            <li className='col-7'>
                                <p>A vehicle covers a distance of 43.2 km in 2.4 liter of petrol. How much distance will it cover in 1 liter of petrol?</p>
                            </li>
                            <div style={{ display: "flex", marginRight: "20px" }}>
                                <p style={{ marginRight: "70px" }}>(2 marks)</p>
                                <ButtonComponent type="outlined" endIcon={<>
                                    <Tooltip title="Refresh" arrow placement="top"><Refresh className='btnIcon' /></Tooltip>
                                    <Tooltip title="Edit" arrow placement="top"><EditIcon style={{ height: "20px" }} /></Tooltip>
                                    <Tooltip title="Delete" arrow placement="top"><QuestionPaperDeleteIcon /></Tooltip>
                                </>} textColor="#000000" backgroundColor="#01B58A" disabled={false} buttonSize="" onClick={() => { }} label="Question" minWidth="138px" />
                            </div>
                        </div>
                    </ul>
                </div>
            </div>
            <div className='quesPaperPreviewPrintFooter'>
                    <h5 className='mt-3'>Total questions: 28</h5>
                    <ButtonComponent backgroundColor="#01B58A" type="contained" label={'Save and Print'} textColor={''} buttonSize="Large" minWidth="226" />
                    <ButtonComponent backgroundColor="#01B58A" type="contained" label={'Print Sets'} textColor={''} buttonSize="Large" minWidth="226" />
            </div>
        </>
    )
}

export default QuestionPaper13;
