import {Dispatch, SetStateAction} from "react";


export type textInput = {
    id:string //stores name/id to be used for the input and its label
    labelContent:string // tex content of the label for the input
    inputStorage:string //UseState var that stores what is typed into the input
    setInputStorage:Dispatch<SetStateAction<string>> //Methiod to set the UseState bar when value in input changes
    inputCSS:string //string of css classes to use for the input tag
    divCSS:string //string of css classes to use for the input tag
    labelCSS:string //string of css classes to use for the input tag
    placeHolderText:string

}
//function to create a text input field depending on passed parameters
// for what the parameters do see the textInput type declaration
function SimpleTextInput({
                       id,
                       labelContent,
                       inputStorage,
                       setInputStorage,
                     placeHolderText,
                       inputCSS,
                       divCSS,
                       labelCSS
                   }: textInput) {
    return (
        <div className={divCSS}>
            <label className={labelCSS} htmlFor={id}>{labelContent}</label><br/>
            <input className={inputCSS} type="text" id={id} name={id} value={inputStorage} placeholder={placeHolderText}
                   onChange={(e) => {

                       setInputStorage(e.target.value);

                   }
                   }

            ></input>
        </div>
    );
}


export default SimpleTextInput;


