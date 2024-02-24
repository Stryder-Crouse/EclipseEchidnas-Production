
import {useState} from "react";


export type dropDownTextProps = {
    dropDownText: string[];
    header:string
    headerCss:string
    bodyCss:string
}
export function DropDownText({dropDownText,headerCss,header,bodyCss}:dropDownTextProps){


    const [toggled, setToggled] = useState(false);

    return (
        <div className="flex flex-col ">
            <div className={headerCss + " cursor-pointer"} onClick={toggleDropdown}>
                {header}
            </div>
            {
                createDropDownText()
            }
        </div>
    );

    function createDropDownText(){

        if(!toggled){
            return;
        }


        return(
            <div className={bodyCss}>
                {dropDownText.map((direction, index) => (
                    <div key={index} className="flex w-[90%] rounded-3xl pl-2 pr-2 pt-1 pb-1 bg-gray-200 m-2">
                        <b className={"font-medium"}>{(index + 1).toString() + ": "}{" "}{direction}</b>

                    </div>
                ))}
            </div>
        );
    }

    function toggleDropdown(){

        //if div is currently visable make it invisable
        if(toggled){
            setToggled(false);
        }
        // if invisable make visable
        else{
            setToggled(true);
        }


    }


}
