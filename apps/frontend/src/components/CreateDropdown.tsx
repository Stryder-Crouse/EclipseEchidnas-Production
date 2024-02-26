import React from "react";

export interface DropdownProps{
    dropBtnName:string,
    dropdownID:string,
    populationArr: string[],
    isSearchable: boolean,

    runOnChange: ()=>void,

    resetOnSelect: boolean,
    resetDropdown: boolean,
    setResetDropdown: React.Dispatch<React.SetStateAction<boolean>>,
    setSelected:   React.Dispatch<React.SetStateAction<number>>,
    inputCSS:string,
    selectCSS:string
}

export function CreateDropdown({dropBtnName, dropdownID, isSearchable, runOnChange, populationArr, setSelected, resetDropdown,
                                   setResetDropdown, inputCSS, resetOnSelect}: DropdownProps) {

    //every time this is reloaded, check to see if we need to reset the value of the dropdown
    //if so, reset based on the two implementations, one searchable and one not
    if (resetDropdown) {
        const dropdownElement = document.getElementById(dropdownID);
        if (dropdownElement) {
            if (isSearchable) {
                // If the dropdown is searchable (<input type="text">), reset its value to an empty string
                (dropdownElement as HTMLInputElement).value = '';
            } else {
                // If the dropdown is not searchable (<select>), reset it to the default/first option
                (dropdownElement as HTMLSelectElement).selectedIndex = 0;
            }
        }
        setSelected(-1); // Reset selected value
        setResetDropdown(false); // Stop it from continually resetting
    }

    function resetInputBox(){

        const dropdownElement = document.getElementById(dropdownID);
        if (dropdownElement) {
            if (isSearchable) {
                // If the dropdown is searchable (<input type="text">), reset its value to an empty string
                (dropdownElement as HTMLInputElement).value = '';
            } else {
                // If the dropdown is not searchable (<select>), reset it to the default/first option
                (dropdownElement as HTMLSelectElement).selectedIndex = 0;
            }
        }
    }

    function setValueCorrectly(index:number){
        //const value = populationArr[index];
        runOnChange();
        setSelected(index);
        if(resetOnSelect){
            resetInputBox();
        }
    }

    function findValueIndex(value:string)
    {
        for(let index = 0; index < populationArr.length; index++)
        {
            const arrVal = populationArr[index].toString();
            if(arrVal == value)
            {
                setValueCorrectly(index);
                console.log(index);
            }
        }
        //todo return error: you have input an invalid location; submit should fail
    }

    if(isSearchable){
        const datalistID = "datalistOf" + dropdownID;
        return (
            <div className="dropdown">

                <input type="text" placeholder={dropBtnName} list={datalistID} id={dropdownID}
                       onChange={e => findValueIndex(e.target.value)}
                       className={`w-60 p-2 pr-2 text-black rounded-full focus:outline-none ${inputCSS}`}
                       required

                />
                <datalist className="dropbtn" id={datalistID}>
                    {
                        //make all the options from the populationArr, and give them all unique keys
                        populationArr.map((option: string, index:number) =>
                            <option key={dropdownID+option+"_"+index}
                                    className={"dropdown-content"}>{option}</option>)
                    }
                </datalist>

            </div>
        );
    } else {
        return (
            <div className="dropdown">
                <select  required id={dropdownID} className={"p-2 w-60 bg-white text-black rounded-full border-2 border-gray-500 drop-shadow cursor-pointer"} name={dropBtnName} onChange={e => {
                    setValueCorrectly(e.target.selectedIndex - 1);
                    /*accounts for the extra unselectable option with the placeholder text*/
                }}>
                    {/*make the first, unselectable option*/}
                    <option disabled={true}
                            selected={true}
                            key={dropdownID+"_unselectable"}
                            className={"dropdown-content unselectable"}>{dropBtnName}</option>
                    {
                        //make the rest of the options from the populationArr, and give them all unique keys
                        populationArr.map((option: string, index) => <option
                            key={dropdownID+option+"_"+index}
                            className={"dropdown-content"}>{option}</option>)
                    }
                </select>

            </div>
        );
    }
}
