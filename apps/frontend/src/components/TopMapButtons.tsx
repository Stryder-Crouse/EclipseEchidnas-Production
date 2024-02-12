import MapSearchBar from "./MapSearchBar.tsx";
export default function TopMapButtons() {
    return (
            <div className="z-10 flex mt-5 justify-content-center">
                <MapSearchBar/>
                <button className=" transition-all hover:bg-navy w-32 text-white p-3 ml-8 bg-navStart rounded-full h-min font-semibold shadow-md">
                    Lower Level 1
                </button>

                <button className="transition-all  hover:bg-navy w-32 text-white p-3 ml-8 bg-navStart rounded-full h-min font-semibold shadow-md">
                    Lower Level 2
                </button>

                <button className="transition-all  hover:bg-navy w-32 text-white p-3 ml-8 bg-navStart rounded-full h-min font-semibold shadow-md">
                    Level 1
                </button>

                <button className="transition-all hover:bg-navy  w-32 text-white p-3 ml-8 bg-navStart rounded-full h-min font-semibold shadow-md">
                    Level 2
                </button>

                <button className="transition-all hover:bg-navy w-32 text-white p-3 ml-8 bg-navStart rounded-full h-min font-semibold shadow-md">
                    Level 3
                </button>
            </div>
    );
}
