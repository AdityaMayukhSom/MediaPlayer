export const MidScreenControls = () => {
    return (
        <div className="absolute z-20 flex items-center justify-center w-full h-full select-none ">
            <div
                className="flex-row justify-center hidden py-6 transition-all duration-500 opacity-0 md:flex hover:opacity-100 group"
                onDoubleClick={(e) => {
                    e.stopPropagation();
                    e.nativeEvent.stopImmediatePropagation();
                }}
            >
                <div
                    className="flex items-center justify-center pl-0 pr-16 mx-4 transition-all duration-300 opacity-0 cursor-pointer focus:outline-none hover:transform active:transform active:scale-90 group-hover:pr-0 group-hover:pl-16 group-hover:opacity-100 "
                    onClick={() => handleDecrementTime()}
                >
                    <div className=" focus:outline-none active:outline-none p-3 hover:bg-[#00000084] hover:scale-[1.15] transition-all rounded-full duration-300 active:scale-[0.85] flex flex-row aspect-square items-center justify-center hover:transform hover:shadow-lg mx-2">
                        <img src="./svg/backward.svg" className="w-24 h-24" alt="" />
                        <p className="pl-5 pr-3 text-5xl text-white drop-shadow-lg">10</p>
                    </div>
                </div>

                <button className="flex items-center justify-center transition-all duration-300 scale-0 rounded-full focus:outline-none active:outline-none aspect-square group-hover:scale-100 " onClick={() => togglePlaying()}>
                    <div className=" focus:outline-none active:outline-none p-5 hover:bg-[#00000084] hover:scale-125 transition-all rounded-full duration-300 active:scale-[0.85] hover:transform hover:shadow-lg mx-4">
                        <img src="./svg/pause.svg" className={isPlaying ? `h-32 w-32` : `hidden`} alt="" />
                        <img src="./svg/play.svg" className={isPlaying ? `hidden` : `h-32 w-32`} alt="" />
                    </div>
                </button>

                <div
                    className="flex items-center justify-center pl-16 pr-0 mx-4 transition-all duration-300 opacity-0 cursor-pointer focus:outline-none active:transform active:scale-90 hover:transform group-hover:opacity-100 group-hover:pl-0 group-hover:pr-16"
                    onClick={() => handleIncrementTime()}
                >
                    <div className=" focus:outline-none active:outline-none p-3 hover:bg-[#00000084] hover:scale-[1.15] transition-all rounded-full duration-300 active:scale-[0.85] flex flex-row aspect-square items-center justify-center hover:transform hover:shadow-lg mx-2">
                        <p className="pl-3 pr-5 text-5xl text-white drop-shadow-lg">10</p>
                        <img src="./svg/forward.svg" className="w-24 h-24" alt="" />
                    </div>
                </div>
            </div>
        </div>
    );
};