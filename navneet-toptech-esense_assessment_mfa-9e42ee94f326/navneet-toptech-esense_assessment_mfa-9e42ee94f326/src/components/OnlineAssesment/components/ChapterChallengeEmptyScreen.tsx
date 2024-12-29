import React from 'react'
import styles from './ChapterChallengeEmptyScreen.module.css'
import EmptyChapterChallenge from '../../../assets/images/chapterChallengeEmptyScreenImage.svg'
import AddIcon from '@mui/icons-material/Add';
import ButtonComponent from '../../SharedComponents/ButtonComponent/ButtonComponent';

interface ChapterChallengeEmptyProps{
    text?:string;
    subText?:string;
    buttonText?:string | any;
    handleOnClick?:any;
    style?:any;
}
const ChapterChallengeEmptyScreen:React.FC<ChapterChallengeEmptyProps> = ({text,subText,handleOnClick,buttonText,style}) => {
  return (
     <div className={`${styles.emptySectionScroll} emptyScreen`}  style={style}>
            <div className={styles.emptySection}>
                <img src={EmptyChapterChallenge} />
                <h2>{text}</h2>
                <h4>{subText}</h4>
                <div className='mt-3'>
                    <div className="position-relative">
                    <ButtonComponent icon={<AddIcon />} image={""} textColor="" backgroundColor="#01B58A" buttonSize="Medium" type="contained" onClick={handleOnClick} label={buttonText} minWidth="" />
                    </div>
                </div>
                
            </div>
    </div>
  );
};

export default ChapterChallengeEmptyScreen;