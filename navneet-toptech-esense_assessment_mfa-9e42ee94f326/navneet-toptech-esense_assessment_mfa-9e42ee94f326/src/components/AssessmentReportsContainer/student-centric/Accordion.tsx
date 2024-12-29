import React, { useRef, useState, useEffect } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import './Accordion.css'
import ProgressBar from "../Progressbar";
import { ChapterTopicWiseReports } from "../../../interface/AssessmentReportsResponses";

interface AccordionItemProps {
  question: string;
  answer: any;
  score : number,
  isOpen: boolean;
  onClick: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ question, score ,answer, isOpen, onClick }) => {
  const contentHeight = useRef<HTMLDivElement | null>(null);
  const [containerHeight, setContainerHeight] = useState<string>('0px');
  useEffect(() => {
    if (contentHeight.current) {
      setContainerHeight(isOpen ? `${contentHeight.current.scrollHeight}px` : '0px');
    }
  }, [isOpen]);
  return (
    <div className="accordionWrapper" >
      <button className={`accordionWrapperContainer ${isOpen ? 'active' : ''}`} onClick={onClick} >
        <div className="accordionWrapperContentSect">
          <p className='accordionWrapperTitle'>{question}</p>
          <p className="accordionWrapperScore">{score}% <span>Correct</span></p>
        </div>
        <RiArrowDropDownLine className={`arrow ${isOpen ? 'active' : ''}`} />
      </button>
      <div
        ref={contentHeight}
        className="answer-container p-0"
        style={{ height: containerHeight }}
      >
        <table>
          {answer.map((a: any) => (
            
              <tr className="tr-accordion">
                <td>{a.topicName}</td>
                <td><ProgressBar score={a} /></td>
              </tr>          
          ))}
        </table>
      </div>
    </div>
  )
}
interface Props{
  data:ChapterTopicWiseReports[]
}
// main Accordion component
const Accordion: React.FC<Props> = (data) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [reportsData,setReportsData] = useState<ChapterTopicWiseReports[]>([]);
  console.log("Accordion Data",data);
  const handleItemClick = (index: any) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };
  useEffect(()=>{
    // setReportsData(data);
  })
  return (
    <div className='accordianContainer mb-4'>
      <h2>Chapter summar with topic genernalised report</h2>
      <h3>See a more detailed breakdown of the score of an individual or combination of chapter in a session, broken down based on a tag hierarchy.</h3>
      <div className='studentCentricReportsAccordianFlex'>{data?.data?.map((cName, index:number) => (
        <AccordionItem key={cName.chapterName}
          question={cName.chapterName}
          score={Math.round((cName.correctQuestionCount * 100) / cName.totalQuestionCount)}
          answer={cName.topicInfo}
          isOpen={activeIndex === index}
          onClick={() => handleItemClick(index)}
        />
      ))}
      </div>
    </div>
  )
};

export default Accordion;
