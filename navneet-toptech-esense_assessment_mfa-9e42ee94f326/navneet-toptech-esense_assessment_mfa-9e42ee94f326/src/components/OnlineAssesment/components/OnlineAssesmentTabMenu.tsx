import React, { useState } from 'react';
import { Tab, Box, Tabs } from "@mui/material";

// Define props interface (if needed)
interface OnlineAssessmentTabMenuProps {
    // Define props if any
}

const OnlineAssesmentTabMenu: React.FC<OnlineAssessmentTabMenuProps> = () => {
    const [selectedTab, setSelectedTab] = useState<number>(0); // State to track the selected tab index

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue); // Update selected tab index
    };

    return (
        <Box sx={{ width: "100%" }} className="bg-color-white">
            <Tabs
                value={selectedTab} // Set the value prop to control the selected tab
                onChange={handleChange} // Handle tab change
                sx={{
                    width: "100%",
                    '& .MuiTab-root': {
                        textTransform: 'capitalize',
                        fontWeight: '650',
                        justifyContent: 'space-around',
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
                }}
                TabIndicatorProps={{
                    children: <span className="MuiTabs-indicatorSpan" />,
                }}
            >
                <Tab key={1} label={"Online Tests"} />
            </Tabs>
        </Box>
    );
};

export default OnlineAssesmentTabMenu;
