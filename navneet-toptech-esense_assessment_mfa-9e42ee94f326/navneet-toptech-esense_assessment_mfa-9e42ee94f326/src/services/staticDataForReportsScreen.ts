const reports = [
    {
      _id: "1",
      title: "Present Classroom & Teacher-Centric Reports",
      description : "Monitor and compare your students at a glance.",
      typeOfReport:"teacherCentric"
    },
    {
      _id: "2",
      title: "Display Student-Centric Reports",
      description: "Learn more about individual students in an easy, in-depth fashion!",
      typeOfReport:"studentCentric"
    },
    {
        _id: "3",
        title: "Show Coursework Progress",
        description : "Particularly suited for publishers or online book companion products, track student progress through all Item bank content.",
        typeOfReport:"courseWorkProgress"
      },
      {
        _id: "4",
        title: "Display Large-Scale Group/District Reports",
        description: "Discover large-scale group reporting and let Learnosity take care of the heavy lifting.",
        typeOfReport:"groupReport"
      },
      {
        _id: "5",
        title: "Response Analysis Reporting",
        description : "Summarize class responses at a glance. Group students based on their strengths and needs.",
        typeOfReport:"analysisReport"
      },
      {
        _id: "6",
        title: "Analyze Learning Outcomes Report & Mastery",
        description: "Drill down deeper into student and class results broken down by topic areas or Learning Outcomes Report.",
        typeOfReport:"learningOutcomeReport"
      },
      {
        _id: "7",
        title: "Provide Live Progress Tracking & Control",
        description : "Allow your instructors to see student progress through tests in real-time, along with instructor and teacher control.",
        typeOfReport:"liveProgressReporting"
      },
  ];
  export const graphImages = [
    '/assets/images/staticimages/Screenshot 2023-10-20 161618.png',
    '/assets/images/staticimages/Screenshot 2023-10-20 161631.png',
    '/assets/images/staticimages/Screenshot 2023-10-20 161644.png',
    '/assets/images/staticimages/Screenshot 2023-10-20 1616705.png'
  ]
  export function getReports() {
    return reports;
  }
  export function getGraphImages(){
    return graphImages;
  }