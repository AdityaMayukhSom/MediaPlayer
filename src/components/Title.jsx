import React from "react";
import  { useState } from "react";// eslint-disable-next-line
export function Title({}) {
    let videoArray = [
        { videoName: "hello", videoURL: "./videos/hello.mp4", subtitleURL: "./subtitle/mySubtitle.vtt", posterURL: "./images/hero.jpg" },
    
    ];
 const [videoNumber] = useState(0);
  return <div title="videoTitle" className="absolute w-full z-20 text-white text-4xl  sm:text-5xl md:text-7xl pt-10 pl-10 font-bold -mt-28 transition-all duration-700 videoTitle tracking-wide drop-shadow-lg">
                            {videoArray[videoNumber].videoName}
                        </div>;
}
  