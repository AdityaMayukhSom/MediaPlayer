import React from "react";
import { useState } from "react";
export function Video({
  isLoop,
  myVideo,
  handleLoadedMetadata,
  handleVideoEnded
}) {

  let videoArray = [
    { videoName: "Baraat", videoURL: "./videos/Baraat.mp4", subtitleURL: "./subtitle/mySubtitle.vtt", posterURL: "./images/Baraat.jpeg" },
    { videoName: "Pasoori", videoURL: "./videos/Pasoori.mp4", subtitleURL: "./subtitle/Pasoori.vtt", posterURL: "./images/Pasoori.jpg" },
    { videoName: "Moon Knight", videoURL: "./videos/Moon.mp4", subtitleURL: "./subtitle/mySubtitle.vtt", posterURL: "./images/Moon Knight.jpg" },
    { videoName: "Komola", videoURL: "./videos/Komola.mp4", subtitleURL: "./subtitle/mySubtitle.vtt", posterURL: "./images/Pasoori.jpg" },
    { videoName: "O Je Mane Na Mana", videoURL: "./videos/ManeNaMana.mp4", subtitleURL: "./subtitle/mySubtitle.vtt", posterURL: "./images/Pasoori.jpg" },
    { videoName: "Thor Love And Thunder", videoURL: "./videos/Thor.mp4", subtitleURL: "./subtitle/mySubtitle.vtt", posterURL: "./images/Pasoori.jpg" },
    { videoName: "Ms. Marvel", videoURL: "./videos/Marvel.mp4", subtitleURL: "./subtitle/mySubtitle.vtt", posterURL: "./images/Pasoori.jpg" },
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
