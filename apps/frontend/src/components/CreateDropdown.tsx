import React from "react";

export interface DropdownProps{
    dropBtnName:string,
    dropdownID:string,
    populationArr: string[],
    isSearchable: boolean,
    resetOnSelect: boolean,
    resetDropdown: boolean,
    setResetDropdown: React.Dispatch<React.SetStateAction<boolean>>,
    setSelected:   React.Dispatch<React.SetStateAction<number>>,
    inputCSS:string,
    selectCSS:string
}

export function CreateDropdown({dropBtnName, dropdownID, isSearchable, populationArr, setSelected, resetDropdown,
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
            <div  className="dropdown">

                <input type="text" placeholder={dropBtnName} list={datalistID} id={dropdownID}
                       onChange={e => findValueIndex(e.target.value)}
                       className={inputCSS}

                />
                <datalist className="dropbtn" id={datalistID}>
                    {
                        populationArr.map((option: string) => <option
                                                                      className={"dropdown-content"}>{option}</option>)
                        //key={dropdownID+option}
                    }
                </datalist>

            </div>
        );
    } else {
        return (
            <div className="dropdown">
                <select id={dropdownID} className={"p-1 w-60 bg-white text-black rounded-2xl border border-black drop-shadow cursor-pointer"} name={dropBtnName} onChange={e => {
                    setValueCorrectly(e.target.selectedIndex - 1);
                    /*accounts for the extra unselectable option with the placeholder text*/
                }}>
                    <option disabled={true} selected={true} className={"dropdown-content unselectable"}>{dropBtnName}</option>
                    {
                        populationArr.map((option: string) => <option  className={"dropdown-content"}>{option}</option>)
                        //key={dropdownID+option+"s"}
                    }
                </select>

            </div>
        );
    }
}
