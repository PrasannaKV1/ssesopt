import "./Assessments.css";
import { getReports } from "../../services/staticDataForReportsScreen";
import goBack from "../../assets/images/goBack.svg";
import Assess from "./Assess";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';

const Assessments = () => {
  const reportsData = getReports();
  const [allocationGroupId, setAllocationGroupId] = useState<number>(0);
  let history = useNavigate();
  let location = useLocation();
  const goBackFn = () => {
    history("/assess/assessmentReports");
  };
  useEffect(() => {
    console.log("Inside Show Reports", location);
    const allocationGroupId = location?.state?.allocationGroupId;
    console.log("Inside show Reports", allocationGroupId);
    setAllocationGroupId(allocationGroupId);
  });
  return (
    <>
      <div className="assessmentReportListBlk">
        <h4
          className="cursorPointer"
          onClick={() => {
            goBackFn();
          }}
        >
          <img src={goBack} />
          Go Back
        </h4>        
        <div className="container">
        <h1 className="reportsHeading">Showing Types of Reports</h1>
          <div className="assessmentReportListMap">
          {reportsData?.map((item: any) => (
            <Assess
              key={item._id}
              reportData={item}
              allocationGroupId={allocationGroupId}
            />
          ))}
          </div>
        </div>
      </div>
    </>
  );
};
export default Assessments;
