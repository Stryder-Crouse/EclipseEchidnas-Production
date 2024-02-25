import {DropDownText} from "./DropDownText.tsx";
import "../../css/HideScrollBar.css";


export type textDirectionProps = {
    textDirections: string[][];
    closeLocations: ()=>void
}



const filledDropdownCss = "flex  pl-2 pr-2 pt-1 pb-1 " +
    "bg-navy  hover:bg-[#024281] text-white font-semibold " +
    "justify-center cursor-pointer";

const nonfilledDropdownCss = "flex  bg-[#024c96] text-white pl-2 pr-2 pt-1 pb-1 " +
    " font-semibold  justify-center";

export function TextDirectionsDropDown({textDirections,closeLocations}:textDirectionProps){


    return (
        <div
            className="  flex flex-col border-gray-500 border-2 w-60 max-h-[62.5vh] mt-1 bg-white rounded-3xl overflow-hidden">
            {/*<p className={"bg-[#024c96] p-1 rounded-xl w-full text-white font-semibold cursor-pointer flex justify-center m-auto "}>*/}
            {/*    Text Directions*/}
            {/*</p>*/}
            <div className="hideScroll overflow-y-auto overflow-x-hidden ">
                <div className={"flex pl-2 pr-2 pt-1 pb-1 " +
                    "bg-[#024281] font-semibold text-white " +
                    "justify-center"} >
                    Text Directions
                </div>
                <DropDownText bodyCss={""}
                              header={"Lower Level 2"}
                              headerCss={setDropDownHeaderCss(textDirections[0].length)}
                              dropDownText={textDirections[0]}
                              dropDownTextCss={"flex w-[90%] rounded-3xl pl-2 pr-2 pt-1 pb-1 bg-gray-200 m-2"}>
                </DropDownText>

                <DropDownText bodyCss={""}
                              header={"Lower Level 1"}
                              headerCss={setDropDownHeaderCss(textDirections[1].length)}
                              dropDownText={textDirections[1]}
                              dropDownTextCss={"flex w-[90%] rounded-3xl pl-2 pr-2 pt-1 pb-1 bg-gray-200 m-2"}>
                </DropDownText>

                <DropDownText bodyCss={""}
                              header={"Level 1"}
                              headerCss={setDropDownHeaderCss(textDirections[3].length)}
                              dropDownText={textDirections[3]}
                              dropDownTextCss={"flex w-[90%] rounded-3xl pl-2 pr-2 pt-1 pb-1 bg-gray-200 m-2"}>
                </DropDownText>
                <DropDownText bodyCss={""}
                              header={"Level 2"}
                              headerCss={setDropDownHeaderCss(textDirections[4].length)}
                              dropDownText={textDirections[4]}
                              dropDownTextCss={"flex w-[90%] rounded-3xl pl-2 pr-2 pt-1 pb-1 bg-gray-200 m-2"}>
                </DropDownText>
                <DropDownText bodyCss={""}
                              header={"Level 3"}
                              headerCss={setDropDownHeaderCss(textDirections[5].length)}
                              dropDownText={textDirections[5]}
                              dropDownTextCss={"flex w-[90%] rounded-3xl pl-2 pr-2 pt-1 pb-1 bg-gray-200 m-2"}>
                </DropDownText>


            </div>
            <button
                className={
                    "bg-[#024281] p-1   text-white  hover:bg-navy " +
                    "font-semibold cursor-pointer  " +
                    "  flex justify-center "}
                onClick={closeLocations}>Close
            </button>
        </div>
    );

    function setDropDownHeaderCss(lengthOfDirections:number){
        if(lengthOfDirections==0){
            return nonfilledDropdownCss;
        }
        return filledDropdownCss;

    }




}
