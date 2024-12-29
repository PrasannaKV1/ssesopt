import DeleteConfirmation from "../../assets/images/staticimages/Screenshot 2023-10-20 161618.png";
import { graphImages } from "../../services/staticDataForReportsScreen";


function GraphImage(props:any){
    console.log(props.graphImage);
    return(
        <>
            <div>
                {/* <img src={props.graphImage}/> */}
                {/* <img src='../../assets/images/staticimages/Screenshot 2023-10-20 1616705.png'/> */}
                <img src={props.graphImage} alt="jdldljldk" className='image' />
            </div>
        </>
    );
}
export default GraphImage;