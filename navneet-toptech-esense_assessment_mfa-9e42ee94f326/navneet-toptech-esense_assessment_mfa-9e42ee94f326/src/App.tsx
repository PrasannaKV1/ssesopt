import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import logo from './logo.svg';
import './App.css';
import "./index.css"
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import CustomRoutes from "./routes/routes";
import { searchFilterEventActions } from './redux/actions/searchFilterEventAction';
import { qPaperList, qPaperStudentEventActions, qStudentListEventActions, updateCurrentQpDetails } from './redux/actions/assesmentQListEvent';
import { onlineUpdateCurrentQpDetails } from './redux/actions/onlineAssement';
import { isMobileViewAction } from './redux/mobileFixedMenu';

const RouteWatcher = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (location.pathname !== "/assess/evaluation" && location.pathname !== "/MIFprintForPreview" && location.pathname !== "/assess/evaluation/teacherReport" && location.pathname !== "/assess/evaluation/schoolReport") {
      dispatch(searchFilterEventActions({
        gradeId: '',
        subjectId: '',
        questionPaperTypeId: '',
        minMarks: '',
        maxMarks: '',
      }));
      dispatch(qPaperList([]));
      dispatch(qStudentListEventActions([]));
      dispatch(qPaperStudentEventActions({}));
      dispatch(updateCurrentQpDetails({}));
      // Remove currentQp from local storage
      localStorage.removeItem('currentQp');
    }
  }, [location.pathname]);
  useEffect(() => {
    dispatch(isMobileViewAction(window.innerWidth <= 1024))
  }, []);

  useEffect(() => {
    if (location.pathname !== "/assess/evaluation/onlineAssesment") {
      dispatch(onlineUpdateCurrentQpDetails({}));
      // Remove currentQp from local storage
      localStorage.removeItem('onlineCurrentQp');
    }
  }, [location.pathname]);

  return null; // This component doesn't render anything
};

function App() {
  return (
    <div className="assessmentContainer">
      <Router>
        <RouteWatcher />
        <CustomRoutes />
      </Router>
    </div>
  );
}

export default App;
