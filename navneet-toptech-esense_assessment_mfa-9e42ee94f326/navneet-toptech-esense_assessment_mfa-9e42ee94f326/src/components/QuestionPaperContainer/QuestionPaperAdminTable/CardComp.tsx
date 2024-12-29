import React from 'react'
import "./CardComp.css"
type props = {
    text:any,
    subText?:any,
    textNumber:any,
    image:any,
    background:any
  }

const CardComp: React.FC<props> = ({text, textNumber, image, background,subText}) => {
    return (
        <>
            <div className='assess-card' style={{backgroundColor:`${background}` ,width:'100%',height:'100%'}}>
                <div className='assess-card-child'>
                    <div className='icn-text-cont'>
                        <div><img src={image} alt="" className="src" /></div>
                        <div className='icn-text-cont-subText'>
                        <div className='assess-label-text' style={{ whiteSpace: 'pre-line' }}>{text}</div>
                        {subText && <div className='assess-label-text' style={{ whiteSpace: 'pre-line' }}>{subText}</div>}
                        </div>
                    </div>
                    <div className='count-container'>{textNumber}</div>
                </div>

            </div>
        </>
    )
}

export default CardComp
