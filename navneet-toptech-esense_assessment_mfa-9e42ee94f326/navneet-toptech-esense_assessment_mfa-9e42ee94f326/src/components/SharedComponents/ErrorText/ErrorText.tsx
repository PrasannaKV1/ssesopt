import React from 'react'
import "./style.css"
interface Props {
    registerName?: string,
    errors?: any
}
const ErrorText: React.FC<Props> = ({ registerName, errors }) => {
    // const [error, setError] = React.useState()
    // React.useEffect(()=>{
    //     if (registerName?.includes("[")) {
    //         const tempArray=registerName.split("[")
    //         console.log("textError",errors[tempArray[0]],tempArray[1])
    //     }
    // },[])
    return (<div>
        {errors[registerName ? registerName : "notype"] && <p className='error-tag'>{errors[registerName ? registerName : ""]?.message ? errors[registerName ? registerName : ""]?.message : "Fill the Mandatory fields"}</p>}
    </div>
    )
}

export default ErrorText