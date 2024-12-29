import React, { useState } from 'react'
import { addStyles, EditableMathField } from 'react-mathquill'
addStyles()

/*ForFutureOnly Its Added*/
const EditableMathExample = () => {
  const [latex, setLatex] = useState("\\int_0^\\infty x^2 dx")

  return (
    <div>
      <EditableMathField
        latex={latex}
        onChange={(mathField:any) => {
          setLatex(mathField.latex())
        }}
      />
      <p>{latex}</p>
    </div>
  )
}
export default EditableMathExample