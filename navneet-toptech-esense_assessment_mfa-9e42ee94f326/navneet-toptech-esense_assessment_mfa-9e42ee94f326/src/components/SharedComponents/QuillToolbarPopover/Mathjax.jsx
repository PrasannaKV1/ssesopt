import { useEffect, useState } from "react";
import "./mathjax.css";
import { _arrayBufferToBase64 } from "../../../constants/helperFunctions";
const MathJax = window.MathJax;
export default function MathJaxComponent({ renderEquation, editorFontSize, editorFontFamily, currentLatex }) {
  const EqEditor = window.EqEditor;
  let textArea, toolbar;
  const [latexOutput, setLatexOutput] = useState(null)

  useEffect(() => {
    textArea = new EqEditor.TextArea("latexInput");
    toolbar = new EqEditor.Toolbar("toolbar");
    let latexOutputVar = new EqEditor.Output("output");
    setLatexOutput(latexOutputVar)
    textArea.addToolbar(toolbar).addOutput(latexOutputVar);
  }, [EqEditor]);

  useEffect(() => {
    // Select the node that will be observed for mutations
    const targetNode = document.getElementById("output");

    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true };

    // Callback function to execute when mutations are observed
    const callback = async (mutationList, observer) => {
      for (const mutation of mutationList) {
        if(mutation.type === 'childList'){
          try {
              const latex =  mutation.target.innerText.substring(47, mutation.target.innerText.indexOf('title') - 2)
              await renderEquation(latex)
              // const mathJaxElem = MathJax?.tex2svg(latex.split("&space;")[0], { display: true });
              //     const svg = mathJaxElem.querySelector("svg");
              // const svg = await axios.get(`${apiEndPoint}?${latex}`, {responseType: "arraybuffer"})
              // const base64 = _arrayBufferToBase64(svg.data)
              // const svgContainer = document.getElementById("svg-container");
              // svgContainer.innerHTML = ''
              // const imgEl = document.createElement('img');
              // imgEl.src = `data:image/svg+xml;base64,${base64}`
              // svgContainer.appendChild(imgEl);
              // // const base64 = btoa(new XMLSerializer().serializeToString(svg))
              // setEqSvg(`<img src=data:image/svg+xml;base64,${base64}>`)
              // const textA = document.getElementById('latexInput').innerText;
              // console.log(textA)
              // textArea.setCursorPos(textA.length);
          } catch (error) {
            console.log(error)
          }
        }
        // if (mutation.type === "attributes") {
        //   if (mutation.attributeName === "src") {
        //     const latex =
        //       mutation.target.attributes.src.value?.split(
        //         "https://latex.codecogs.com/svg.image?"
        //       )?.[1] || "";
        //     if (latex !== "null") {
        //       const mathJaxElem = MathJax?.tex2svg(latex, { display: true });
        //       const svg = mathJaxElem.querySelector("svg");
        //       const svgContainer = document.getElementById("svg-container");
        //       svgContainer.appendChild(svg);
        //       const base64 = btoa(new XMLSerializer().serializeToString(svg))
        //       setEqSvg(`<img src=data:image/svg+xml;base64,${base64}>`)
        //       // html2canvas(svgContainer)
        //       // .then(function (canvas) {
        //       //   console.log(canvas.baseURI)
        //       //   // setEqSvg(`<img src=${canvas.toDataURL()}/>`)
        //       //     console.log(canvas.toDataURL())
        //       //     canvas.toBlob(function (blob) {
        //       //       // Copy to clipboard
        //       //       // navigator.clipboard
        //       //       //   .write([
        //       //       //     new ClipboardItem(
        //       //       //       Object.defineProperty({}, blob.type, {
        //       //       //         value: blob,
        //       //       //         enumerable: true,
        //       //       //       })
        //       //       //     ),
        //       //       //   ])
        //       //       //   .then(function () {
        //       //       //     console.log("Copied to clipboard");
        //       //       //   });
                    
        //       //     });
        //       //   })
        //       //   .catch((err) => console.log(err));
        //     }
        //   }
        // }
      }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
    // Later, you can stop observing
    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    latexOutput?.setFontSize(editorFontSize);
  }, [latexOutput, editorFontSize])  

  useEffect(() => {
    latexOutput?.setFont(editorFontFamily)
  }, [latexOutput,editorFontFamily])

  useEffect(() => {
    textArea?.insert(currentLatex)
  },[currentLatex])

  useEffect(() => {
    // Get a reference to the contenteditable div
    const editableDiv = document.getElementById('latexInput');
    const handlePasteAnywhere = event => {
      if( (event.keyCode == 86 || event.which == 86) && event.ctrlKey ) {
        textArea?.notifyOutputs()
      }
    };

    // Add event listener for the 'paste' event
    editableDiv.addEventListener('keydown', handlePasteAnywhere);

    return () => {
      editableDiv.removeEventListener('keydown', handlePasteAnywhere);
    };
  }, []);

  return (<></>);
}
