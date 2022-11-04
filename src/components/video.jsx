import React from "react";
import  { useState } from "react";
export function Video({
  isLoop,
  myVideo,
  handleLoadedMetadata,
  handleVideoEnded
}) 
{  let videoArray = [
    { videoName: "hello", videoURL: "./videos/hello.mp4", subtitleURL: "./subtitle/mySubtitle.vtt", posterURL: "./images/hero.jpg" },

];
const [videoNumber] = useState(0);
  return <div className="h-screen w-screen flex justify-center items-center overflow-hidden">
                    <video loop={isLoop} width="auto" src={videoArray[videoNumber].videoURL} ref={myVideo} className="w-full h-full" id="myVideoID" onLoadedMetadata={handleLoadedMetadata} type="video/mp4" poster={videoArray[videoNumber].posterURL} onEnded={() => {
      handleVideoEnded();
    }}>
                        <track label="English" kind="subtitles" srcLang="en" src={videoArray[videoNumber].subtitleURL} default />
                    </video>
                </div>;
}
  