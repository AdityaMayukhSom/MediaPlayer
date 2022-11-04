import React from "react";
import { useState } from "react";// eslint-disable-next-line
export function Title({ }) {

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
    const [videoNumber, setVideoNumber] = useState(0);
    return <div title="videoTitle" className="absolute w-full z-20 text-white text-4xl  sm:text-5xl md:text-7xl pt-10 pl-10 font-bold -mt-28 transition-all duration-700 videoTitle tracking-wide drop-shadow-lg">
        {videoArray[videoNumber].videoName}
    </div>;
}
