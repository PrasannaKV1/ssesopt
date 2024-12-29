import React, { useState, useEffect } from 'react';
import { Tab, Box, Tabs } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { qSetsEventActions, setsMapping } from '../../../../redux/actions/assesmentQListEvent';
import { ReduxStates } from '../../../../redux/reducers';

interface EvaluationQuestionSetsProps {
  selectedQuestion: any
}

const EvaluationQuestionSets = (props: EvaluationQuestionSetsProps) => {
  const { selectedQuestion } = props;
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState<string | number>(0);
  const isMobileView = useSelector(
    (state: ReduxStates) => state?.mobileMenuStatus?.isMobileView
  );

  useEffect(() => {
    // Set the default selected tab when selectedQuestion changes
    if (selectedQuestion?.questionPaperSetsInfo && selectedQuestion.questionPaperSetsInfo.length > 0) {
      const firstSet = selectedQuestion.questionPaperSetsInfo[0];
      dispatch(setsMapping(selectedQuestion.questionPaperSetsInfo))
      if (firstSet?.name && firstSet?.id) {
        setSelectedTab(firstSet.name); // Selecting the first set by default
        dispatch(qSetsEventActions({ name: firstSet.name, setId: firstSet.id }));
        // TODO : mapping the sets details 
      } else {
        dispatch(qSetsEventActions({ name: null, setId: null }));
      }
    } else {
      dispatch(qSetsEventActions({ name: null, setId: null }));
    }
  }, [selectedQuestion, dispatch]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string | number) => {
    setSelectedTab(newValue);
    const selectedSet = selectedQuestion.questionPaperSetsInfo.find((item: any) => item.name === newValue);
    if (selectedSet && selectedSet.name && selectedSet.id) {
      dispatch(qSetsEventActions({ name: selectedSet.name, setId: selectedSet.id }));
    } else {
      dispatch(qSetsEventActions({ name: null, setId: null }));
    }
  };

  return (
    <React.Fragment>
      {selectedQuestion?.questionPaperSetsInfo && selectedQuestion?.questionPaperSetsInfo.length > 0 &&
        <Box sx={{ width: "100%", marginTop: isMobileView ? '10px' : '',paddingInline:isMobileView?"20px":''}} className="bg-color-white">
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            sx={{
              width: "100%",
              '& .MuiTab-root': {
                textTransform: 'capitalize',
                fontWeight: isMobileView ? '400' : '650',
                justifyContent:'space-around',
                fontSize: isMobileView ? "14px" : '',
                fontFamily: isMobileView ? "Manrope" : '',
              },
              '& .MuiTabs-indicator': {
                display: 'flex',
                justifyContent: 'center',
                backgroundColor: 'transparent',
              },
              '& .MuiTabs-indicator::before': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                width: '100%',
                height: '3px',
                backgroundColor: '#01b58a',
                borderRadius: '3px',
              },
              '& .MuiTabs-flexContainer': {
                justifyContent: isMobileView ? 'space-evenly !important' : 'space-around !important',
              },
              '&.MuiButtonBase-root-MuiTab-root': {
                padding: isMobileView ? "0px" : 'default',
                minWidth: isMobileView ? "60px" : "default"
              }
            }}
            
            TabIndicatorProps={{
              children: <span className="MuiTabs-indicatorSpan" />,
            }}
          >
            {selectedQuestion?.questionPaperSetsInfo.map((item: any, index: number) => (
              <Tab key={index} value={item?.name} label={`set ${(item?.setSequenceID)}`} id={`set ${(index + 1)}`} />
            ))}
          </Tabs>
        </Box>}
    </React.Fragment>
  );
};

export default EvaluationQuestionSets;
