import React, {useEffect} from "react";

export interface DropdownProps{
    dropBtnName:string,
    dropdownID:string,
    populationArr: string[],
    isSearchable: boolean,
    resetDropdown: boolean,
    setResetDropdown: React.Dispatch<React.SetStateAction<boolean>>,
    setSelected:   React.Dispatch<React.SetStateAction<string>>;
}

export function CreateDropdown({dropBtnName, dropdownID, isSearchable, populationArr, setSelected, resetDropdown, setResetDropdown}: DropdownProps) {

    //todo with Joseph and/or Stryder - review this code block
    useEffect(() => {
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
            setSelected(populationArr[0]); // Reset selected value
            setResetDropdown(false); // Stop it from continually resetting
        }
    }, [resetDropdown, setSelected, dropdownID, isSearchable, populationArr, setResetDropdown]);
// -----------------------------------------------------------------------------------------


    function setValueCorrectly(index:number){
        const value = populationArr[index];
        setSelected(value);
    }

    function findValueIndex(value:string)
    {
        for(let index = 0; index < populationArr.length; index++)
        {
            const arrVal = populationArr[index].toString();
            //let textVal = value;
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

                <input type="text" placeholder={dropBtnName} list={datalistID} id={dropdownID} onChange={e => findValueIndex(e.target.value)}/>
                <datalist className="dropbtn" id={datalistID}>
                    {
                        populationArr.map((option: string) => <option className={"dropdown-content"}>{option}</option>)
                    }
                </datalist>

            </div>
        );
    } else {
        return (
            <div className="dropdown">
                <select id={dropdownID} className="dropbtn" name={dropBtnName} onChange={e => {
                    setValueCorrectly(e.target.selectedIndex - 1);
                }}>
                    <option disabled={true} selected={true} className={"dropdown-content unselectable"}>{dropBtnName}</option>
                    {
                        populationArr.map((option: string) => <option className={"dropdown-content"}>{option}</option>)
                    }
                </select>

            </div>
        );
    }
}
