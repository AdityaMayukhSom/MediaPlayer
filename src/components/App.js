import { Subtitles } from './Subtitles';
import { Title } from './Title';
import { Video } from './Video';
import React, { useEffect, useRef, useState } from "react";

function App() {
    const SECOND = 1;
    const MINUTE = SECOND * 60;
    const HOUR = MINUTE * 60;
    const timeRemainingShowNextEpisode = 10;

    const opacityNull = { opacity: 0, pointerEvents: "none", cursor: "none" };
    const opacityFull = { opacity: 1, pointerEvents: "all", cursor: "auto" };

    let videoArray = [
        { videoName: "hello", videoURL: "./videos/hello.mp4", subtitleURL: "./subtitle/mySubtitle.vtt", posterURL: "./images/hero.jpg" },
    
    ];
    const [isPlaying, setIsPlaying] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [videoNumber, setVideoNumber] = useState(0);
    const [videoPlayingFor, setVideoPlayingFor] = useState("00:00:00");// eslint-disable-next-line
    const [totalTiming, setTotalTiming] = useState(0);
    const [coverOpacity, setCoverOpacity] = useState(opacityFull);
    const [fullScreenIcon, setFullScreenIcon] = useState(true);
    const [isShowNextEpisode, setIsShowNextEpisode] = useState(false);
    const [isLoop, setIsLoop] = useState(false);
    const [volumeFactor, setVolumeFactor] = useState(0.1);
    const [previousVolumeFactor, setPreviousVolumeFactor] = useState(1);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [isShowSubtitle, setIsShowSubtitle] = useState(false);

    const myVideo = useRef(null);
    const myVideoPlayer = useRef(null);
    const myProgressBar = useRef(null);
    const myProgressBarBase = useRef(null);
    const myVolumeBar = useRef(null);
    const volumeSlider = useRef(null);
    const progressSlider = useRef(null);
    const videoCover = useRef(null);
    const timingID = useRef(null);

    const currentPlaybackSpeedElement = useRef(null);
    const previousPlaybackSpeedElement = useRef(null);
    const speed050 = useRef(null);
    const speed075 = useRef(null);
    const speed100 = useRef(null);
    const speed125 = useRef(null);
    const speed150 = useRef(null);

    const duration = convertHMS(totalTiming);

    function convertHMS(value) {
        const sec = parseInt(value, 10); // convert value to number if it's string
        var hours = (sec / HOUR) | 0;
        var minutes = ((sec - hours * HOUR) / MINUTE) | 0;
        var seconds = sec - HOUR * hours - MINUTE * minutes;
        // Return is HH : MM : SS
        return `${hours >= 10 ? hours : `0${hours}`}:${minutes >= 10 ? minutes : `0${minutes}`}:${seconds >= 10 ? seconds : `0${seconds}`}`;
    }

    const incrementVideo = () => {
        if (videoNumber < videoArray.length - 1) {
            setVideoNumber(videoNumber + 1);
        } else {
            setVideoNumber(0);
        }
        setTextTrack(null);
        setIsPlaying(false);
    };
    const decrementVideo = () => {
        if (videoNumber > 0) {
            setVideoNumber(videoNumber - 1);
        } else {
            setVideoNumber(videoArray.length - 1);
        }
        setTextTrack(null);
        setIsPlaying(false);
    };

    const nextEpisode = () => {
        if (videoNumber < videoArray.length - 1) {
            setVideoNumber(videoNumber + 1);
        } else {
            setVideoNumber(0);
        }
        setTextTrack(null);
        setIsPlaying(false);
    };

    const handleLoadedMetadata = () => {
        if (!myVideo.current) return;
        setTotalTiming(myVideo.current.duration);
    };

    const togglePlaying = () => {
        if (isPlaying) {
            setIsPlaying(false);
            myVideo.current.pause();
            clearInterval(timingID.current);
            setCoverOpacity(opacityFull);
        } else {
            setIsPlaying(true);
            getSubtitle();
            myVideo.current.play();
            timingID.current = setInterval(() => {
                setVideoPlayingFor(convertHMS(myVideo.current.currentTime));
            }, 10);
        }
    };
    const toggleSettings = () => {
        setShowSettings(!showSettings);
    };

    const getFullScreenElement = (elem) => {
        return elem.requestFullscreen || elem.webkitRequestFullscreen || elem.mozRequestFullscreen || elem.msRequestFullscreen;
    };

    window.onkeydown = (e) => {
        if (e.code === "Space") {
            e.preventDefault();
            e.stopPropagation();
            togglePlaying();
        } else if (e.code === "ArrowLeft") {
            e.preventDefault();
            e.stopPropagation();
            handleDecrementTime();
        } else if (e.code === "ArrowRight") {
            e.preventDefault();
            e.stopPropagation();
            handleIncrementTime();
        } else if (e.code === "ArrowUp") {
            e.preventDefault();
            e.stopPropagation();
            if (volumeFactor <= 0.96) {
                setVolumeFactor(volumeFactor + 0.04);
            } else {
                setVolumeFactor(1);
            }
        } else if (e.code === "ArrowDown") {
            e.preventDefault();
            e.stopPropagation();
            if (volumeFactor >= 0.04) {
                setVolumeFactor(volumeFactor - 0.04);
            } else {
                setVolumeFactor(0);
            }
        } else if (e.code === "KeyM") {
            e.preventDefault();
            e.stopPropagation();
            if (volumeFactor !== 0) {
                setPreviousVolumeFactor(volumeFactor);
                setVolumeFactor(0);
            } else {
                setVolumeFactor(previousVolumeFactor);
            }
        }
    };

    //This code is for showing the cover if and removing it after timeout

    let timoutNow = 5000; // Timeout in 5 second.
    let timeoutTimer;

    useEffect(() => {
        document.onmousemove = () => {
            setCoverOpacity(opacityFull);
            ResetTimers();
        };
        document.onmouseleave = () => {
            setCoverOpacity(opacityNull);
            clearTimeout(timeoutTimer);
        }; // eslint-disable-next-line
    }, [videoCover]);
    
    function StartTimers() {
        // Start timers.
        timeoutTimer = setTimeout(IdleTimeout, timoutNow);
    }

    function ResetTimers() {
        // Reset timers.
        clearTimeout(timeoutTimer);
        StartTimers();
    }

    function IdleTimeout() {
        setCoverOpacity(opacityNull);
    }

    //This is code for full screen handling

    async function handleFullscreen() {
        if (document.fullscreenElement) {
            await leaveFullScreen();
        } else {
            await goFullScreen();
        }
    }
    const goFullScreen = () => {
        return new Promise((resolve) => {
            getFullScreenElement(myVideoPlayer.current).call(myVideoPlayer.current);
            resolve();
        });
    };
    const leaveFullScreen = () => {
        return new Promise((resolve) => {
            document.exitFullscreen();
            document.webkitExitFullscreen();
            resolve();
        });
    };

    document.onfullscreenchange = () => {
        if (document.fullscreenElement === null) {
            setFullScreenIcon(true);
        } else {
            setFullScreenIcon(false);
        }
    };

    function handleIncrementTime() {
        myVideo.current.currentTime = myVideo.current.currentTime + 10;
    }
    function handleDecrementTime() {
        myVideo.current.currentTime = myVideo.current.currentTime - 10;
    }

    const autoPlayCheckButton = useRef(null);
    const [checkButtonTransition, setCheckButtonTransition] = useState({ marginLeft: "-10px" });
    const [isAutoPlay, setIsAutoPlay] = useState(false);

    function autoPlayHandler() {
        if (autoPlayCheckButton.current.checked) {
            setCheckButtonTransition({ marginLeft: "22px" });
            setIsAutoPlay(true);
        } else {
            setCheckButtonTransition({ marginLeft: "-10px" });
            setIsAutoPlay(false);
        }
    }

    function handleVolumeButtonClick() {
        if (volumeFactor !== 0) {
            setPreviousVolumeFactor(volumeFactor);
            setVolumeFactor(0);
        } else {
            setVolumeFactor(previousVolumeFactor);
        }
    }

    useEffect(() => {
        myVideo.current.volume = volumeFactor;
    }, [volumeFactor]);

    const [progressBarBaseWidth, setProgressBarBaseWidth] = useState(0);

    function handlePlaybackSpeed(e) {
        if (e.target.dataset.speed) {
            myVideo.current.playbackRate = e.target.dataset.speed;
            previousPlaybackSpeedElement.current = currentPlaybackSpeedElement.current;
            currentPlaybackSpeedElement.current = e.target;
            setPlaybackSpeed(myVideo.current.playbackRate);
            removeOutline(previousPlaybackSpeedElement.current);
            setOutline(currentPlaybackSpeedElement.current);
        }
    }

    function setOutline(elem) {
        elem.style.outlineStyle = "solid";
        elem.style.outlineColor = "white";
        elem.style.outlineWidth = "4px";
        elem.style.outlineOffset = "5px";
    }
    function removeOutline(elem) {
        elem.style.outlineStyle = "none";
        elem.style.outlineColor = "white";
        elem.style.outlineWidth = "0px";
        elem.style.outlineOffset = "0px";
    }

    useEffect(() => {
        removeOutline(speed050.current);
        removeOutline(speed075.current);
        removeOutline(speed100.current);
        removeOutline(speed125.current);
        removeOutline(speed150.current);
        currentPlaybackSpeedElement.current = speed100.current;
        previousPlaybackSpeedElement.current = speed100.current;
        setOutline(speed100.current);
    }, [videoNumber]);

    function handleLoop() {
        setIsLoop(!isLoop);
    }

    function handleSubtitle() {
        setIsShowSubtitle(!isShowSubtitle);
    }

    function handleProgressBarClick(e) {
        setTotalTiming(myVideo.current.duration);
        let position = Math.abs(e.clientX - myProgressBarBase.current.getBoundingClientRect().left);
        myVideo.current.currentTime = (position / progressBarBaseWidth) * totalTiming;
    }

    function handleVolumeBarClick(e) {
        let position = e.clientX - myVolumeBar.current.getBoundingClientRect().left;
        let volumeBarBaseWidth = myVolumeBar.current.getBoundingClientRect().width;
        let temp = position / volumeBarBaseWidth;
        if (temp >= 0 && temp <= 1) {
            setVolumeFactor(position / volumeBarBaseWidth);
        }
    }

    useEffect(function setupListener() {
        function handleScrollDragging(e) {
            let position = e.clientX - myProgressBarBase.current.getBoundingClientRect().left;
            if (position > 0 && position < progressBarBaseWidth) {
                myVideo.current.currentTime = (position / progressBarBaseWidth) * totalTiming;
            } else if (position <= 0) {
                myVideo.current.currentTime = 0;
            } else {
                myVideo.current.currentTime = progressBarBaseWidth;
            }
        }
        myProgressBarBase.current.addEventListener("mousedown", () => {
            handleDragging();
        });

        function handleDragging() {
            document.addEventListener("mousemove", handleScrollDragging);
        }
        document.addEventListener("mouseup", function () {
            document.removeEventListener("mousemove", handleScrollDragging);
        });
    });

    window.onresize = () => {
        if (myProgressBarBase.current) {
            setProgressBarBaseWidth(myProgressBarBase.current.getBoundingClientRect().width);
        }
    };
     // eslint-disable-next-line
    useEffect(() => {
        if (myVideo.current) {
            volumeSlider.current.style.marginLeft = volumeFactor * 100 - 6 + "px";
            progressSlider.current.style.left = `${(myVideo.current.currentTime / totalTiming) * progressBarBaseWidth - 6}px`;
            myProgressBar.current.style.width = `${(myVideo.current.currentTime / totalTiming) * progressBarBaseWidth}px`;

            if (totalTiming - myVideo.current.currentTime <= timeRemainingShowNextEpisode) {
                setIsShowNextEpisode(true);
            } else {
                setIsShowNextEpisode(false);
            }
        }
    });

    function handleVideoEnded() {
        myVideo.current.onended = () => {
            if (isAutoPlay) {
                if (videoNumber < videoArray.length - 1) {
                    setVideoNumber(videoNumber + 1);
                } else {
                    setVideoNumber(0);
                }
                setIsPlaying(false);
                setTimeout(() => {
                    myVideo.current.play();
                    setIsPlaying(true);
                }, 1000);
            } else {
                myVideo.current.pause();
                setIsPlaying(false);
                setCoverOpacity(opacityFull);
            }
        };
    }

    const [textTrack, setTextTrack] = useState(null);

    function getSubtitle() {
        if (!myVideo.current) return;
        let track = myVideo.current.textTracks[0];
        track.mode = "hidden";
        track.oncuechange = () => {
            if (track.activeCues.length) {
                setTextTrack(track.activeCues[0].text);
            } else {
                setTextTrack(null);
            }
        };
    }

    return (
        <div className="flex items-center justify-center bg-black">
            <div
                ref={myVideoPlayer}
                className="relative"
                onDoubleClick={() => {
                    handleFullscreen();
                }}
            >
                <Video   isLoop={isLoop} myVideo={myVideo} handleLoadedMetadata={handleLoadedMetadata} handleVideoEnded={handleVideoEnded}  />
                <div className="w-full h-full subtitleInside">
                  <Subtitles   isShowSubtitle={isShowSubtitle} textTrack={textTrack}  />
                    <div className="h-full w-[100%] top-0 absolute z-10 opacity-100 transition-all bg-gradient-to-b from-black via-[#0000008a] to-black bg-opacity-[0.4] duration-500 coverShadow overflow-hidden " style={coverOpacity} ref={videoCover}>
                        <Title     /> 

                        <div className="h-full w-full absolute z-20 flex justify-center items-center select-none ">
                            <div
                                className="flex-row justify-center hidden  md:flex opacity-0 hover:opacity-100 transition-all duration-500 py-6 group"
                                onDoubleClick={(e) => {
                                    e.stopPropagation();
                                    e.nativeEvent.stopImmediatePropagation();
                                }}
                            >
                                <div
                                    className="focus:outline-none cursor-pointer mx-4 flex  justify-center items-center hover:transform active:transform active:scale-90 transition-all pr-16 pl-0 group-hover:pr-0 group-hover:pl-16 duration-300 opacity-0 group-hover:opacity-100 "
                                    onClick={() => handleDecrementTime()}
                                >
                                    <div className=" focus:outline-none active:outline-none p-3 hover:bg-[#00000084] hover:scale-[1.15] transition-all rounded-full duration-300 active:scale-[0.85] flex flex-row aspect-square items-center justify-center hover:transform hover:shadow-lg mx-2">
                                        <img src="./svg/backward.svg" className="h-24 w-24" alt="" />
                                        <p className="text-5xl text-white pl-5 pr-3 drop-shadow-lg">10</p>
                                    </div>
                                </div>

                                <button className="focus:outline-none active:outline-none  flex justify-center items-center  duration-300 transition-all rounded-full aspect-square scale-0 group-hover:scale-100 " onClick={() => togglePlaying()}>
                                    <div className=" focus:outline-none active:outline-none p-5 hover:bg-[#00000084] hover:scale-125 transition-all rounded-full duration-300 active:scale-[0.85] hover:transform hover:shadow-lg mx-4">
                                        <img src="./svg/pause.svg" className={isPlaying ? `h-32 w-32` : `hidden`} alt="" />
                                        <img src="./svg/play.svg" className={isPlaying ? `hidden` : `h-32 w-32`} alt="" />
                                    </div>
                                </button>

                                <div
                                    className="focus:outline-none cursor-pointer mx-4 flex justify-center items-center active:transform active:scale-90 transition-all hover:transform pl-16 pr-0 opacity-0 group-hover:opacity-100 group-hover:pl-0 group-hover:pr-16 duration-300"
                                    onClick={() => handleIncrementTime()}
                                >
                                    <div className=" focus:outline-none active:outline-none p-3 hover:bg-[#00000084] hover:scale-[1.15] transition-all rounded-full duration-300 active:scale-[0.85] flex flex-row aspect-square items-center justify-center hover:transform hover:shadow-lg mx-2">
                                        <p className="text-5xl text-white pr-5 pl-3 drop-shadow-lg">10</p>
                                        <img src="./svg/forward.svg" className="h-24 w-24" alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            className="absolute z-20 bottom-0 px-4 pb-3 select-none -mb-28 transition-all duration-700 videoControls pt-4 w-full"
                            onDoubleClick={(e) => {
                                e.stopPropagation();
                                e.nativeEvent.stopImmediatePropagation();
                            }}
                        >
                            <div className="flex flex-row w-full items-center ">
                                <div
                                    className="h-[3px] group flex flex-row hover:h-[6px] ml-3 box-border w-full bg-gray-300 rounded cursor-pointer transition-all duration-100 relative items-center flex-1"
                                    onClick={(event) => handleProgressBarClick(event)}
                                    ref={myProgressBarBase}
                                    id="myProgressBarBase"
                                >
                                    <div className="h-full bg-[#1653f0] flex w-0 items-center justify-end rounded " ref={myProgressBar} id="myProgressBar"></div>

                                    <div className="rounded-full w-4 box-border h-4  scale-0 group-hover:scale-100 transition-all ease-in-out duration-200 bg-white shadow z-10 absolute" ref={progressSlider} id="progressSlider"></div>
                                </div>

                                <div className="px-1 font-semibold text-lg w-[200px] text-white text-right drop-shadow-lg">
                                    {videoPlayingFor}&nbsp;/&nbsp;{duration}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row w-full items-center justify-between text-xs font-medium text-gray-500 pl-4">
                                {isShowNextEpisode && (
                                    <div
                                        className="text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-2 focus:outline-none font-medium rounded text-base px-5 py-2.5 text-center inline-flex items-center focus:ring-gray-500 mr-2 mb-2 absolute -translate-y-20 transition-all duration-700 cursor-pointer"
                                        onClick={() => nextEpisode()}
                                    >
                                        <svg className="w-4 h-4 mr-2 -ml-1 text-[#626890]" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="ethereum" role="img" viewBox="0 0 320 512">
                                            <path fill="currentColor" d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path>
                                        </svg>
                                        Play Next
                                    </div>
                                )}
                                <div className="flex items-center">
                                    <div className="flex group relative items-center">
                                        <div className="absolute whitespace-nowrap group-hover:visible invisible opacity-0 group-hover:opacity-100 transition-all bottom-[4.7rem] mb-12 group-hover:mb-0 py-2 px-3 text-lg text-white rounded -left-4 text-center bg-[#262626] bg-opacity-[0.9] shadow-md duration-700 w-20">
                                            {isPlaying ? "Pause" : "Play"}
                                        </div>
                                        <button
                                            className="focus:outline-none active:outline-none transform active:scale-75 items-center justify-center transition-all duration-500 rounded aspect-square hover:bg-gray-300 hover:bg-opacity-20 mt-1 group-hover:mt-0 group-hover:mb-1"
                                            onClick={() => togglePlaying()}
                                        >
                                            {isPlaying ? (
                                                <div className="h-9" title="Pause">
                                                    <img src="./svg/pause.svg" className="w-full h-full" alt="" />
                                                </div>
                                            ) : (
                                                <div className="h-9" title="Play">
                                                    <img src="./svg/play.svg" className="w-full h-full" alt="" />
                                                </div>
                                            )}
                                        </button>
                                    </div>
                                    <div className="px-1 flex flex-row justify-center items-center ">
                                        <div className=" w-0.5 bg-opacity-50 bg-gray-200 h-8 py-2 mt-0 ml-2 mr-1"></div>
                                        <button
                                            className="focus:outline-none active:outline-none transition-all  rounded aspect-square hover:bg-gray-300 hover:bg-opacity-20 duration-300 p-1  justify-center items-center flex mt-1 hover:mt-0 hover:mb-1 active:scale-75"
                                            onClick={() => decrementVideo()}
                                        >
                                            <svg className="w-10 h-10" viewBox="0 0 24 24" title="Decrement Video">
                                                <path fill="#fff" d="M6,6H8V18H6M9.5,12L18,18V6M16,14.14L12.97,12L16,9.86V14.14Z" />
                                            </svg>
                                        </button>
                                        <button className="focus:outline-none active:outline-none transition-all  rounded aspect-square hover:bg-gray-300 hover:bg-opacity-20 duration-300 p-1  justify-center items-center flex mt-1 hover:mt-0 hover:mb-1 active:scale-75">
                                            <svg className="w-8 h-8" viewBox="0 0 24 24" title="Stop Video">
                                                <path fill="#fff" d="M5,3H19A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3M13,13V7H11V13H13M13,17V15H11V17H13Z" />
                                            </svg>
                                        </button>
                                        <button
                                            className=" focus:outline-none active:outline-none transition-all  rounded aspect-square hover:bg-gray-300 hover:bg-opacity-20 duration-300 p-1  justify-center items-center flex mt-1 hover:mt-0 hover:mb-1 active:scale-75"
                                            onClick={() => incrementVideo()}
                                        >
                                            <svg className="h-10 w-10" viewBox="0 0 24 24" title="Increment Video">
                                                <path fill="#fff" d="M6,18L14.5,12L6,6M8,9.86L11.03,12L8,14.14M16,6H18V18H16" />
                                            </svg>
                                        </button>
                                        <div className=" w-0.5 bg-opacity-50 bg-gray-200 h-8 py-2 mt-0 mr-2 ml-1"></div>
                                    </div>

                                    <div className="group flex flex-row items-center text-white mt-1">
                                        {/* <div className="flex group relative items-center"> */}
                                        {/* <div className="absolute whitespace-nowrap group-hover:visible invisible opacity-0 group-hover:opacity-100 transition-all bottom-[5.5rem] mb-12 group-hover:mb-0 py-2 px-3 text-lg text-white rounded -left-12 text-center bg-[#262626] bg-opacity-[0.9] shadow-md duration-700">
                                            {volumeFactor === 0 ? "Click To Unmute" : "Click To Mute"}
                                        </div> */}
                                        <button
                                            className="focus:outline-none active:outline-none transition-all  rounded aspect-square group-hover:bg-gray-300  group-hover:bg-opacity-10 duration-300 p-2 flex justify-center items-center active:scale-75"
                                            onClick={() => {
                                                handleVolumeButtonClick();
                                            }}
                                        >
                                            <svg className="h-8 w-8" viewBox="0 0 24 24">
                                                {volumeFactor >= 0.7 && <path fill="#fff" d="M12 12l5-2.917v9.917h-5v-7zm7-4.083v11.083h5v-14l-5 2.917zm-9 5.25l-10 5.833h10v-5.833z" />}
                                                {volumeFactor >= 0.3 && volumeFactor < 0.7 && <path fill="#fff" d="M12 12l5-2.917v9.917h-5v-7zm10-3.518v8.518h-1v-7.935l1-.583zm2-3.482l-5 2.917v11.083h5v-14zm-14 8.167l-10 5.833h10v-5.833z" />}
                                                {volumeFactor < 0.3 && volumeFactor > 0 && <path fill="#fff" d="M15 12.565v4.435h-1v-3.851l1-.584zm2-3.482l-5 2.917v7h5v-9.917zm5-.601v8.518h-1v-7.935l1-.583zm2-3.482l-5 2.917v11.083h5v-14zm-14 8.167l-10 5.833h10v-5.833z" />}
                                                {volumeFactor === 0 && (
                                                    <path
                                                        fill="#fff"
                                                        d="M19.803 13.207l-.829 1.093-1.554-3.826c-.077-.189-.244-.306-.437-.306-.157 0-.356.084-.444.321l-1.356 3.664-1.872-8.759c-.062-.291-.288-.394-.462-.394-.203 0-.428.131-.473.424l-1.629 10.581-1.658-6.968c-.067-.282-.291-.382-.463-.382-.167 0-.374.092-.453.349l-1.453 4.753-1.07-2.53c-.078-.185-.245-.299-.436-.299-.154 0-.294.076-.385.209l-1.257 1.805-.087.058h-2.985c-.276 0-.5.224-.5.5s.224.5.5.5h3.284c.152 0 .296-.074.386-.206l.948-1.353 1.24 2.929c.079.187.241.299.433.299.211 0 .39-.138.455-.35l1.324-4.332 1.814 7.629c.068.283.282.384.46.384.203 0 .428-.131.473-.425l1.605-10.425 1.673 7.83c.058.272.277.395.467.395.202 0 .366-.12.441-.321l1.5-4.049 1.426 3.51c.077.189.245.306.438.306.152 0 .292-.075.382-.206l1.146-1.583.087-.046h3.026c.272 0 .492-.22.492-.492s-.22-.494-.492-.494h-3.322c-.151 0-.294.077-.383.207z"
                                                    />
                                                )}
                                            </svg>
                                        </button>
                                        {/* </div> */}

                                        <div className="h-1 mx-3 w-0 group-hover:w-[100px] transition-all duration-300 bg-gray-300 rounded cursor-pointer flex items-center relative" onClick={(e) => handleVolumeBarClick(e)} ref={myVolumeBar}>
                                            <div className="h-full bg-[#1653f0] w-full group flex justify-end items-center rounded " style={{ width: `${volumeFactor * 100}%` }}></div>
                                            <div className="absolute scale-0 group-hover:scale-100 transition-all ease-in-out duration-300 rounded-full w-3 h-3 bg-white shadow max-w-full" ref={volumeSlider}></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <div className="flex group relative mr-4 items-center mt-1">
                                        <div className="absolute whitespace-nowrap group-hover:visible invisible opacity-0 group-hover:opacity-100 transition-all bottom-16 mb-12 group-hover:mb-0 py-1.5 px-3 text-lg text-white rounded -left-20 bg-[#262626] bg-opacity-95 duration-700">
                                            {isAutoPlay ? "Turn Off Autoplay" : "Turn On Autoplay"}
                                        </div>
                                        <input className="appearance-none w-8 rounded-lg float-left h-3 bg-gray-400 checked:bg-[#1653f0] focus:outline-none cursor-pointer shadow-sm" type="checkbox" role="switch" id="autoPlayCheckBox" ref={autoPlayCheckButton} onChange={() => autoPlayHandler()} />
                                        <label htmlFor="autoPlayCheckBox" className="bg-white  rounded-full flex justify-center items-center h-5 w-5 absolute cursor-pointer duration-500 transition-all" style={checkButtonTransition}>
                                            {isAutoPlay && (
                                                <svg className="h-4 w-4" viewBox="0 0 24 24">
                                                    <path fill="#000" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                                                </svg>
                                            )}
                                            {!isAutoPlay && (
                                                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
                                                    <path fill="#000" d="M14,19H18V5H14M6,19H10V5H6V19Z" />
                                                </svg>
                                            )}
                                        </label>
                                    </div>
                                    <div className="group">
                                        <button className="focus:outline-none active:outline-none rounded aspect-square group-hover:bg-gray-300 group-hover:bg-opacity-20 transition-all duration-300 p-1 mx-1 mt-1 group-hover:mt-0 group-hover:mb-1">
                                            <svg className="h-8 w-8" viewBox="0 0 24 24" title="Playback Speed">
                                                {playbackSpeed < 1 && (
                                                    <path
                                                        fill="#fff"
                                                        d="M12 16C13.66 16 15 14.66 15 13C15 11.88 14.39 10.9 13.5 10.39L3.79 4.77L9.32 14.35C9.82 15.33 10.83 16 12 16M12 3C10.19 3 8.5 3.5 7.03 4.32L9.13 5.53C10 5.19 11 5 12 5C16.42 5 20 8.58 20 13C20 15.21 19.11 17.21 17.66 18.65H17.65C17.26 19.04 17.26 19.67 17.65 20.06C18.04 20.45 18.68 20.45 19.07 20.07C20.88 18.26 22 15.76 22 13C22 7.5 17.5 3 12 3M2 13C2 15.76 3.12 18.26 4.93 20.07C5.32 20.45 5.95 20.45 6.34 20.06C6.73 19.67 6.73 19.04 6.34 18.65C4.89 17.2 4 15.21 4 13C4 12 4.19 11 4.54 10.1L3.33 8C2.5 9.5 2 11.18 2 13Z"
                                                    />
                                                )}
                                                {playbackSpeed === 1 && (
                                                    <path
                                                        fill="#fff"
                                                        d="M12 1.38L9.14 12.06C8.8 13.1 9.04 14.29 9.86 15.12C11.04 16.29 12.94 16.29 14.11 15.12C14.9 14.33 15.16 13.2 14.89 12.21M14.6 3.35L15.22 5.68C18.04 6.92 20 9.73 20 13C20 15.21 19.11 17.21 17.66 18.65H17.65C17.26 19.04 17.26 19.67 17.65 20.06C18.04 20.45 18.68 20.45 19.07 20.07C20.88 18.26 22 15.76 22 13C22 8.38 18.86 4.5 14.6 3.35M9.4 3.36C5.15 4.5 2 8.4 2 13C2 15.76 3.12 18.26 4.93 20.07C5.32 20.45 5.95 20.45 6.34 20.06C6.73 19.67 6.73 19.04 6.34 18.65C4.89 17.2 4 15.21 4 13C4 9.65 5.94 6.86 8.79 5.65"
                                                    />
                                                )}
                                                {playbackSpeed > 1 && (
                                                    <path
                                                        fill="#fff"
                                                        d="M12,16A3,3 0 0,1 9,13C9,11.88 9.61,10.9 10.5,10.39L20.21,4.77L14.68,14.35C14.18,15.33 13.17,16 12,16M12,3C13.81,3 15.5,3.5 16.97,4.32L14.87,5.53C14,5.19 13,5 12,5A8,8 0 0,0 4,13C4,15.21 4.89,17.21 6.34,18.65H6.35C6.74,19.04 6.74,19.67 6.35,20.06C5.96,20.45 5.32,20.45 4.93,20.07V20.07C3.12,18.26 2,15.76 2,13A10,10 0 0,1 12,3M22,13C22,15.76 20.88,18.26 19.07,20.07V20.07C18.68,20.45 18.05,20.45 17.66,20.06C17.27,19.67 17.27,19.04 17.66,18.65V18.65C19.11,17.2 20,15.21 20,13C20,12 19.81,11 19.46,10.1L20.67,8C21.5,9.5 22,11.18 22,13Z"
                                                    />
                                                )}
                                            </svg>
                                        </button>

                                        <div className=" absolute rounded-lg -right-[3rem] md:right-[8.5rem] bottom-[4.5rem] bg-opacity-95 shadow-lg text-white bg-[#262626] px-4 py-6 transition-all mb-12 group-hover:mb-0 group-hover:visible invisible opacity-0 group-hover:opacity-100 duration-700 scale-75 md:scale-100">
                                            <div className="mb-8 text-4xl px-2.5 flex flex-row ">
                                                <p className="font-semibold"> Playback Speed</p>
                                                <img src="./rocket.png" alt="" className=" ml-4 mt-1.5 invert h-8" />
                                            </div>
                                            <ol className="items-center flex flex-row justify-between " onClick={(e) => handlePlaybackSpeed(e)}>
                                                <li className="relative w-[92px] h-full ">
                                                    <div className="grid grid-cols-[40px_auto] items-center ml-[8px]">
                                                        <div className="z-10 justify-center items-center flex aspect-square bg-gray-200 border mx-auto w-4 rounded-full cursor-pointer" data-speed="0.50" ref={speed050}></div>
                                                        <div className=" w-full bg-gray-200 h-0.5"></div>
                                                    </div>
                                                    <div className="mt-3 px-2 text-lg text-white text-left">0.50x</div>
                                                </li>
                                                <li className="relative w-32 h-full ">
                                                    <div className="grid grid-cols-[auto_40px_auto] items-center">
                                                        <div className=" w-full bg-gray-200 h-0.5"></div>
                                                        <div className="z-10 justify-center items-center flex aspect-square bg-gray-200 border mx-auto w-4 rounded-full cursor-pointer " data-speed="0.75" ref={speed075}></div>
                                                        <div className=" w-full bg-gray-200 h-0.5"></div>
                                                    </div>
                                                    <div className="mt-3 px-2 text-lg text-white text-center">0.75x</div>
                                                </li>
                                                <li className="relative w-32 h-full ">
                                                    <div className="grid grid-cols-[auto_40px_auto] items-center">
                                                        <div className=" w-full bg-gray-200 h-0.5"></div>
                                                        <div className="z-10 justify-center items-center flex aspect-square bg-gray-200 border mx-auto w-4 rounded-full cursor-pointer" data-speed="1.00" ref={speed100}></div>
                                                        <div className=" w-full bg-gray-200 h-0.5"></div>
                                                    </div>
                                                    <div className="mt-3 px-2 text-lg text-white text-center">Normal</div>
                                                </li>
                                                <li className="relative w-32 h-full ">
                                                    <div className="grid grid-cols-[auto_40px_auto] items-center">
                                                        <div className=" w-full bg-gray-200 h-0.5"></div>
                                                        <div className="z-10 justify-center items-center flex aspect-square bg-gray-200 border mx-auto w-4 rounded-full cursor-pointer" data-speed="1.25" ref={speed125}></div>
                                                        <div className=" w-full bg-gray-200 h-0.5"></div>
                                                    </div>
                                                    <div className="mt-3 px-2 text-lg text-white text-center">1.25x</div>
                                                </li>
                                                <li className="relative w-[92px] h-full ">
                                                    <div className="grid grid-cols-[auto_40px] items-center mr-[8px]">
                                                        <div className=" w-full bg-gray-200 h-0.5"></div>
                                                        <div className="z-10 justify-center items-center flex aspect-square bg-gray-200 border mx-auto w-4 rounded-full cursor-pointer" data-speed="1.50" ref={speed150}></div>
                                                    </div>
                                                    <div className="mt-3 px-2 text-lg text-white text-right">1.50x</div>
                                                </li>
                                            </ol>
                                        </div>
                                    </div>

                                    <div className="mx-1" title="Setting Icon And Box">
                                        <button className="focus:outline-none active:outline-none transition-all  rounded aspect-square hover:bg-gray-300 hover:bg-opacity-20 duration-300 p-1 mt-1 hover:mt-0 hover:mb-1 active:scale-75" title="Settings" onClick={() => toggleSettings()}>
                                            <svg className="h-8 w-8" viewBox="0 0 24 24" title="Settings">
                                                <path fill="#fff" d="M7 3H5V9H7V3M19 3H17V13H19V3M3 13H5V21H7V13H9V11H3V13M15 7H13V3H11V7H9V9H15V7M11 21H13V11H11V21M15 15V17H17V21H19V17H21V15H15Z" />
                                            </svg>
                                        </button>

                                        {showSettings && (
                                            <div id="settingsBox" className="transition-all duration-1000 z-10 absolute -translate-x-28 bottom-28 divide-y divide-gray-100 rounded shadow w-64 bg-[#262626]">
                                                <ul className="py-1 text-sm text-gray-200" aria-labelledby="dropdownDefault">
                                                    <li>
                                                        <div className="flex w-full px-4 py-4 hover:bg-[#434343] hover:text-white justify-between">
                                                            <span>Subtitle Language</span>
                                                            <span>English</span>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="flex w-full px-4 py-4 hover:bg-[#434343] hover:text-white justify-between">
                                                            <span>Subtitle Font</span>
                                                            <span>Roboto</span>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="flex w-full px-4 py-4 hover:bg-[#434343] hover:text-white justify-between">
                                                            <span>Subtitle Font Size</span>
                                                            <span>32</span>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="flex w-full  px-4 py-4 hover:bg-[#434343] hover:text-white justify-between">
                                                            <span> Annotations</span>
                                                            <div className="flex items-center relative ">
                                                                <input className="appearance-none w-12 rounded-full h-5 bg-gray-400 checked:bg-blue-500 focus:outline-none cursor-pointer shadow-sm" type="checkbox" role="switch" id="annotation" />
                                                                <label htmlFor="annotation" className="bg-white left-[5px]  rounded-full h-3.5 w-3.5 aspect-square absolute cursor-pointer duration-500 transition-all"></label>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="flex w-full px-4 py-4 hover:bg-[#434343] hover:text-white justify-between">
                                                            <span>Playback Speed</span>
                                                            <span>{playbackSpeed === 1 ? "Normal" : myVideo.current.playbackRate}</span>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex group relative items-center">
                                        <div className="absolute whitespace-nowrap group-hover:visible invisible opacity-0 group-hover:opacity-100 transition-all bottom-[5.5rem] mb-12 group-hover:mb-0 py-2 px-3 text-lg text-white rounded -left-20 w-48  text-center bg-[#262626] bg-opacity-[0.9] shadow-md duration-700 pointer-events-none ">
                                            {isLoop ? "Loop Activated" : "Loop Deactivated"}
                                        </div>

                                        <button className="focus:outline-none active:outline-none rounded aspect-square hover:bg-gray-300 hover:bg-opacity-20 transition-all duration-300 p-1 mx-1 mt-1 hover:mt-0 hover:mb-1 active:scale-75" title="Loop" onClick={() => handleLoop()}>
                                            <svg className="h-8 w-8" viewBox="0 0 24 24" title="Loop">
                                                <path
                                                    fill={isLoop ? "#1653f0" : "#fff"}
                                                    d="M18.572 6c-6.018 0-8.414 10-13.143 10-2.114 0-3.479-1.578-3.479-4s1.366-4 3.479-4c1.666 0 2.862 1.069 4.017 2.395l1.244-1.561c-1.499-1.533-3.05-2.834-5.261-2.834-3.197 0-5.429 2.455-5.429 6s2.232 6 5.429 6c6.003 0 8.407-10 13.143-10 2.113 0 3.479 1.578 3.479 4s-1.365 4-3.479 4c-1.664 0-2.86-1.068-4.015-2.392l-1.244 1.561c1.499 1.531 3.05 2.831 5.259 2.831 3.197 0 5.428-2.455 5.428-6s-2.231-6-5.428-6z"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="flex group relative items-center ml-1">
                                        <div className="absolute whitespace-nowrap group-hover:visible invisible opacity-0 group-hover:opacity-100 transition-all bottom-[5.5rem] mb-12 group-hover:mb-0 py-2 px-3 text-lg text-white rounded -left-[52px] w-36 text-center bg-[#262626] bg-opacity-[0.9] shadow-md duration-700 pointer-events-none ">
                                            {isShowSubtitle ? "Subtitles On" : "Subtitles Off"}
                                        </div>

                                        <button
                                            className="focus:outline-none active:outline-none rounded aspect-square hover:bg-gray-300 flex justify-center items-center hover:bg-opacity-20 transition-all duration-300 p-1 mx-1 mt-1 hover:mt-0 hover:mb-1 active:scale-75"
                                            onClick={() => handleSubtitle()}
                                        >
                                            <svg className="h-8 w-8" viewBox="0 0 24 24" title="Subtitles">
                                                {isShowSubtitle ? (
                                                    <path fill="#fff" d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
                                                ) : (
                                                    <path
                                                        fill="#fff"
                                                        d="M18.722 17.289c.841-1.39 1.278-2.942 1.278-4.289v-2h-4v-6h6v5.391c0 2.936-1.176 5.333-3.278 6.898zm-13.993-.011c.836-1.386 1.271-2.934 1.271-4.278v-2h-4v-6h6v5.391c0 2.93-1.184 5.322-3.271 6.887zm-3.729 3.722c5.252-1.039 8.983-4.905 8.983-10.609v-7.391h-9.983v10h4c0 2.211-1.562 4.932-3.995 5.849l.995 2.151zm14 0c5.252-1.039 9-4.905 9-10.609v-7.391h-9.983v10h3.983c0 2.211-1.563 4.932-3.996 5.849l.996 2.151z"
                                                    />
                                                )}
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="flex group relative items-center mx-1">
                                        <div className="absolute whitespace-nowrap group-hover:visible invisible opacity-0 group-hover:opacity-100 transition-all bottom-[5.5rem] mb-12 group-hover:mb-0 py-2 px-3 text-lg text-white rounded -left-[44px] text-center bg-[#262626] bg-opacity-[0.9] shadow-md duration-700 pointer-events-none ">
                                            {fullScreenIcon ? "Maximize" : "Minimize"}
                                        </div>
                                        <button className="focus:outline-none active:outline-none rounded aspect-square hover:bg-gray-300 hover:bg-opacity-20 transition-all duration-300 p-1.5 mx-1 mt-2 hover:mt-1 hover:mb-1 active:scale-[0.8] " onClick={() => handleFullscreen()}>
                                            {fullScreenIcon ? (
                                                <svg className="h-7 w-7" viewBox="0 0 24 24" title="Expand">
                                                    <path fill="#fff" d="M24 9h-2v-5h-7v-2h9v7zm-9 13v-2h7v-5h2v7h-9zm-15-7h2v5h7v2h-9v-7zm9-13v2h-7v5h-2v-7h9z" />
                                                </svg>
                                            ) : (
                                                <svg className="h-7 w-7" viewBox="0 0 24 24" title="Shrink">
                                                    <path fill="#fff" d="M15 2h2v5h7v2h-9v-7zm9 13v2h-7v5h-2v-7h9zm-15 7h-2v-5h-7v-2h9v7zm-9-13v-2h7v-5h2v7h-9z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default App;
