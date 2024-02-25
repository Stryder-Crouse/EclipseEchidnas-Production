
import {useState} from "react";


export type dropDownTextProps = {
    dropDownText: string[];
    header:string
    headerCss:string
    bodyCss:string
    dropDownTextCss:string
}
export function DropDownText({dropDownText,headerCss,header,bodyCss,dropDownTextCss}:dropDownTextProps){


    const [toggled, setToggled] = useState(false);

    return (
        <div className="flex flex-col ">
            <div className={headerCss} onClick={toggleDropdown}>
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
                    <div key={index} className={dropDownTextCss}>
                        <b className={"font-medium"}>{direction}</b>

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
