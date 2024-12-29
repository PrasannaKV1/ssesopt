import './ReportComponent.css';
import DeleteConfirmation from "../../assets/images/staticimages/Screenshot 2023-10-20 161618.png";
import { getGraphImages, graphImages } from '../../services/staticDataForReportsScreen';
import GraphImage from './GraphImage';
import { red } from '@mui/material/colors';
import React, { useState } from 'react';

function ReportComponent(){
    const staticPath = '../../assets/images/staticimages/';
    const [height , setHeight] = useState(0);
    const studentMarks = [
        {id:1,value:50},
        {id:2,value:30},
        {id:3,value:38},
        {id:4,value:24},
        {id:5,value:56},
        {id:6,value:74}
    ];
    const calculateMarksPercentage = (marks:number,maxValue:number) =>{
        const percentage = (marks/maxValue) * 100;
        return percentage;
    }
    const handleOnClick = () =>{
        setHeight(height+100);
        console.log(height);
    }
    return(
        <>
            <div className="reportsContainer">
                <h1 className='reportsContainerHeading'>Present Classroom and Teacher-Centric Reports</h1>
                <p className='reportsContainerDescription'>Easily learn more about your whole classroom at a glance. Our Reports 
                API provides embeddable, group and classroom-focused reports to provide a
                teacher or instructor with information about their classroom ability and progress.</p>
                <ul>
                    <li key={1}>Last Score by Tag by User Report</li>
                    <li key={2}>Last Score by Item by User Report</li>
                    <li key={3}>Last Score by Activity by User Report</li>
                    <li key={4}>Response Analysis by Item Report</li>
                </ul>
                    {
                        graphImages?.map((graphImage:any) =>(
                            <div key={graphImage} className="reportsContainerGraphs">
                                <img className="image" src={DeleteConfirmation}/>
                            </div>
                    ))}
                    <div className='barGraphs'>
                        {studentMarks.map((marks:any) =>(
                            <div key={marks.id} className='bar' style={{color:'red', backgroundColor:'red', border:'1px solid red',width:'20px',height:`${calculateMarksPercentage(marks.value,75)}px`}}></div>
                        ))}
                    </div>
                    <button onClick={() => handleOnClick()}></button>
            </div>
        </>
    );
}
export default ReportComponent;