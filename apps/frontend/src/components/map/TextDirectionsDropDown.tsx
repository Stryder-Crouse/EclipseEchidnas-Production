import {DropDownText} from "./DropDownText.tsx";
import "../../css/HideScrollBar.css";


export type textDirectionProps = {
    textDirections: string[];
    closeLocations: ()=>void
}
export function TextDirectionsDropDown({textDirections,closeLocations}:textDirectionProps){




    return (
        <div
            className="  flex flex-col border-gray-500 border-2 w-60 max-h-[62.5vh] mt-1 bg-white rounded-3xl overflow-hidden">
            {/*<p className={"bg-[#024c96] p-1 rounded-xl w-full text-white font-semibold cursor-pointer flex justify-center m-auto "}>*/}
            {/*    Text Directions*/}
            {/*</p>*/}
            <div className="hideScroll overflow-y-auto overflow-x-hidden ">

              <DropDownText  bodyCss={""}
                             header={"Lower Level 2"}
                             headerCss={"flex hover:bg-gray-500 pl-2 pr-2 pt-1 pb-1 " +
                                 "bg-gray-200 font-semibold " +
                                 "justify-center"}
                             dropDownText={textDirections}>
              </DropDownText>

                <DropDownText  bodyCss={""}
                               header={"Lower Level 1"}
                               headerCss={"flex  hover:bg-gray-500 pl-2 pr-2 pt-1 pb-1 " +
                                   "bg-gray-200 font-semibold   justify-center"}
                               dropDownText={textDirections}>
                </DropDownText>

                <DropDownText  bodyCss={""}
                               header={"Level 1"}
                               headerCss={"flex hover:bg-gray-500 pl-2 pr-2 pt-1 pb-1 " +
                                   "bg-gray-200 font-semibold  justify-center"}
                               dropDownText={textDirections}>
                </DropDownText>
                <DropDownText  bodyCss={""}
                               header={"Level 2"}
                               headerCss={"flex  hover:bg-gray-500 pl-2 pr-2 pt-1 pb-1 " +
                                   "bg-gray-200  font-semibold  justify-center"}
                               dropDownText={textDirections}>
                </DropDownText>
                <DropDownText  bodyCss={""}
                               header={"Level 3"}
                               headerCss={"flex  hover:bg-gray-500 pl-2 pr-2 pt-1 pb-1 " +
                                   "bg-gray-200 font-semibold  justify-center"}
                               dropDownText={textDirections}>
                </DropDownText>



            </div>
            <button
                className={
                "bg-[#024c96] p-1   text-white " +
                    "font-semibold cursor-pointer  " +
                    "  flex justify-center "}
                onClick={closeLocations}>Close
            </button>
        </div>
    );




}
