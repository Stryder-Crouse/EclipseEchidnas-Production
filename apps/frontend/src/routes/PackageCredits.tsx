import {UniversalPackageCredits} from "../components/UniversalPackageCredits.tsx";
import React from "react";
import WongPic from "../images/Team/Wong.jpg";

export default function PackageCredits() {
    return (
        <UniversalPackageCredits
            packageName={"Wong"}
            packageImage={WongPic}
            useDescription={"This is a description of the package Wong. The wong package was used to give us confusion on what we actually needed to do each week."}
            copyright={"Copyright info here"}
            link={"https://www.nytimes.com/crosswords"}
        />
    );
}
