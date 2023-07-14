import { useEffect, useRef, useState } from "react";
import { videoArray } from "../data/videoArray";
import { convertHMS } from "../utils/convertHMS";
import { removeOutline, setOutline } from "../utils/outlineStyleAdder";

export default function BottomControls({
  videoElement,
  videoNumber,
  togglePlaying,
  totalTiming,
  setTotalTiming,
  isPlaying,
  setVideoNumber,
  videoPlayingFor,
  setIsPlaying,
  isLoop,
  setIsLoop,
  isAutoPlay,
  setIsAutoPlay,
  isShowSubtitle,
  setIsShowSubtitle,
}: {
  videoElement: React.RefObject<HTMLVideoElement>;
  videoPlayingFor: string;
  togglePlaying: () => void;

  totalTiming: number;
  setTotalTiming: React.Dispatch<React.SetStateAction<number>>;

  videoNumber: number;
  setVideoNumber: React.Dispatch<React.SetStateAction<number>>;

  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;

  isLoop: boolean;
  setIsLoop: React.Dispatch<React.SetStateAction<boolean>>;

  isAutoPlay: boolean;
  setIsAutoPlay: React.Dispatch<React.SetStateAction<boolean>>;

  isShowSubtitle: boolean;
  setIsShowSubtitle: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const timeRemainingShowNextEpisode = 10;

  const [showSettings, setShowSettings] = useState(false);
  const [isShowNextEpisode, setIsShowNextEpisode] = useState<boolean>(false);
  const [volumeFactor, setVolumeFactor] = useState<number>(0.1);
  const [previousVolumeFactor, setPreviousVolumeFactor] = useState<number>(1);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  const myProgressBar = useRef(null);
  const myProgressBarBase = useRef(null);
  const myVolumeBar = useRef<HTMLDivElement>(null);
  const volumeSlider = useRef(null);
  const progressSlider = useRef(null);

  const currentPlaybackSpeedElement = useRef(null);
  const previousPlaybackSpeedElement = useRef(null);
  const speed050 = useRef<HTMLDivElement>(null);
  const speed075 = useRef<HTMLDivElement>(null);
  const speed100 = useRef<HTMLDivElement>(null);
  const speed125 = useRef<HTMLDivElement>(null);
  const speed150 = useRef<HTMLDivElement>(null);

  const duration = convertHMS(totalTiming);

  const incrementVideo = () => {
    if (videoNumber < videoArray.length - 1) {
      setVideoNumber((videoNumber) => videoNumber + 1);
    } else {
      setVideoNumber(0);
    }
    // TODO : handle text track when going to previous episode
    // setTextTrack("");
    setIsPlaying(false);
  };
  const decrementVideo = () => {
    if (videoNumber > 0) {
      setVideoNumber((videoNumber) => videoNumber - 1);
    } else {
      setVideoNumber(videoArray.length - 1);
    }
    // TODO : handle text track when going to previous episode
    // setTextTrack("");
    setIsPlaying(false);
  };

  const nextEpisode = () => {
    if (videoNumber < videoArray.length - 1) {
      setVideoNumber(videoNumber + 1);
    } else {
      setVideoNumber(0);
    }
    // TODO : handle text track when going to next episode
    // setTextTrack("");
    setIsPlaying(false);
  };

  const toggleSettings = () => {
    if (showSettings) {
      setShowSettings(false);
    } else {
      setShowSettings(true);
    }
  };

  window.onkeydown = (e) => {
    if (e.code === "Space") {
      e.preventDefault();
      e.stopPropagation();
      togglePlaying();
    } else if (e.code === "ArrowUp") {
      e.preventDefault();
      e.stopPropagation();
      if (volumeFactor <= 0.96) {
        setVolumeFactor((volumeFactor) => volumeFactor + 0.04);
      } else {
        setVolumeFactor(1);
      }
    } else if (e.code === "ArrowDown") {
      e.preventDefault();
      e.stopPropagation();
      if (volumeFactor >= 0.04) {
        setVolumeFactor((volumeFactor) => volumeFactor - 0.04);
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
  // useEffect(() => {
  //   setProgressBarBaseWidth(myProgressBarBase.current.getBoundingClientRect().width);
  // }, [videoCover]);

  const autoPlayCheckButton = useRef<HTMLInputElement>(null);
  const [checkButtonTransition, setCheckButtonTransition] = useState<React.CSSProperties>({
    marginLeft: "-10px",
  });

  function autoPlayHandler() {
    if (autoPlayCheckButton.current) {
      if (autoPlayCheckButton.current.checked) {
        setCheckButtonTransition({ marginLeft: "22px" });
        setIsAutoPlay(true);
      } else {
        setCheckButtonTransition({ marginLeft: "-10px" });
        setIsAutoPlay(false);
      }
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
    if (videoElement.current) {
      videoElement.current.volume = volumeFactor;
    }
  }, [volumeFactor]);

  const [progressBarBaseWidth, setProgressBarBaseWidth] = useState(0);

  function handlePlaybackSpeed(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (e.target.dataset.speed && videoElement.current) {
      videoElement.current.playbackRate = e.target.dataset.speed;
      previousPlaybackSpeedElement.current = currentPlaybackSpeedElement.current;
      currentPlaybackSpeedElement.current = e.target;
      setPlaybackSpeed(videoElement.current.playbackRate);
      removeOutline(previousPlaybackSpeedElement.current);
      setOutline(currentPlaybackSpeedElement.current);
    }
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
    if (isLoop) {
      setIsLoop(false);
    } else {
      setIsLoop(true);
    }
  }

  function handleSubtitle() {
    if (isShowSubtitle) {
      setIsShowSubtitle(false);
    } else {
      setIsShowSubtitle(true);
    }
  }

  function handleProgressBarClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    setTotalTiming(videoElement.current.duration);
    let position = Math.abs(e.clientX - myProgressBarBase.current.getBoundingClientRect().left);
    videoElement.current.currentTime = (position / progressBarBaseWidth) * totalTiming;
  }

  function handleVolumeBarClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (!myVolumeBar.current) return;
    let position = e.clientX - myVolumeBar.current.getBoundingClientRect().left;
    let volumeBarBaseWidth = myVolumeBar.current.getBoundingClientRect().width;
    let temp = position / volumeBarBaseWidth;
    if (temp >= 0 && temp <= 1) {
      setVolumeFactor(position / volumeBarBaseWidth);
    }
  }
  function handleScrollDragging(e) {
    // setTotalTiming(videoElement.current.duration);
    let position = e.clientX - myProgressBarBase.current.getBoundingClientRect().left;
    if (position > 0 && position < progressBarBaseWidth) {
      videoElement.current.currentTime = (position / progressBarBaseWidth) * totalTiming;
    } else if (position <= 0) {
      videoElement.current.currentTime = 0;
    } else {
      videoElement.current.currentTime = progressBarBaseWidth;
    }
  }

  useEffect(() => {
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

  function handleVolumeDragging(e: MouseEvent) {
    if (!myVolumeBar.current) return;
    let position = e.clientX - myVolumeBar.current.getBoundingClientRect().left;
    let volumeBarBaseWidth = myVolumeBar.current.getBoundingClientRect().width;
    let temp = position / volumeBarBaseWidth;
    if (temp > 0 && temp < 1) {
      setVolumeFactor(position / volumeBarBaseWidth);
    } else if (temp <= 0) {
      setVolumeFactor(0);
    } else {
      setVolumeFactor(1);
    }
  }
  useEffect(() => {
    myVolumeBar.current.addEventListener("mousedown", () => {
      handleDragging();
    });

    function handleDragging() {
      document.addEventListener("mousemove", handleVolumeDragging);
    }
    document.addEventListener("mouseup", function () {
      document.removeEventListener("mousemove", handleVolumeDragging);
    });
  });
  window.onresize = () => {
    setProgressBarBaseWidth(myProgressBarBase.current.getBoundingClientRect().width);
  };

  useEffect(() => {
    //Code to check if to show Next Episode

    volumeSlider.current.style.marginLeft = volumeFactor * 100 - 6 + "px";
    progressSlider.current.style.left = `${
      (videoElement.current.currentTime / totalTiming) * progressBarBaseWidth - 6
    }px`;
    myProgressBar.current.style.width = `${(videoElement.current.currentTime / totalTiming) * progressBarBaseWidth}px`;

    if (totalTiming - videoElement.current.currentTime <= timeRemainingShowNextEpisode) {
      setIsShowNextEpisode(true);
    } else {
      setIsShowNextEpisode(false);
    }
  });

  return (
    <div
      className="absolute bottom-0 z-20 w-full px-4 pt-4 pb-3 transition-all duration-700 select-none -mb-28 videoControls"
      onDoubleClick={(e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
      }}
    >
      <div className="flex flex-row items-center w-full ">
        <div
          className="h-[3px] group flex flex-row hover:h-[6px] ml-3 box-border w-full bg-gray-300 rounded cursor-pointer transition-all duration-100 relative items-center flex-1"
          onClick={handleProgressBarClick}
          ref={myProgressBarBase}
          id="myProgressBarBase"
        >
          <div
            className="h-full bg-[#1653f0] flex w-0 items-center justify-end rounded "
            ref={myProgressBar}
            id="myProgressBar"
          ></div>

          <div
            className="box-border absolute z-10 w-4 h-4 transition-all duration-200 ease-in-out scale-0 bg-white rounded-full shadow group-hover:scale-100"
            ref={progressSlider}
            id="progressSlider"
          ></div>
        </div>

        <div className="px-1 font-semibold text-lg w-[200px] text-white text-right drop-shadow-lg">
          {videoPlayingFor}&nbsp;/&nbsp;{duration}
        </div>
      </div>

      <div className="flex flex-col items-center justify-between w-full pl-4 text-xs font-medium text-gray-500 sm:flex-row">
        {isShowNextEpisode && (
          <div
            className="text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-2 focus:outline-none font-medium rounded text-base px-5 py-2.5 text-center inline-flex items-center focus:ring-gray-500 mr-2 mb-2 absolute -translate-y-20 transition-all duration-700 cursor-pointer"
            onClick={() => nextEpisode()}
          >
            <svg
              className="w-4 h-4 mr-2 -ml-1 text-[#626890]"
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="ethereum"
              role="img"
              viewBox="0 0 320 512"
            >
              <path
                fill="currentColor"
                d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"
              ></path>
            </svg>
            Play Next
          </div>
        )}
        <div className="flex items-center">
          <div className="relative flex items-center group">
            <div className="absolute whitespace-nowrap group-hover:visible invisible opacity-0 group-hover:opacity-100 transition-all bottom-[4.7rem] mb-12 group-hover:mb-0 py-2 px-3 text-lg text-white rounded -left-4 text-center bg-[#262626] bg-opacity-[0.9] shadow-md duration-700 w-20">
              {isPlaying ? "Pause" : "Play"}
            </div>
            <button
              className="items-center justify-center mt-1 transition-all duration-500 transform rounded focus:outline-none active:outline-none active:scale-75 aspect-square hover:bg-gray-300 hover:bg-opacity-20 group-hover:mt-0 group-hover:mb-1"
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
          <div className="flex flex-row items-center justify-center px-1 ">
            <div className=" w-0.5 bg-opacity-50 bg-gray-200 h-8 py-2 mt-0 ml-2 mr-1"></div>
            <button
              className="flex items-center justify-center p-1 mt-1 transition-all duration-300 rounded focus:outline-none active:outline-none aspect-square hover:bg-gray-300 hover:bg-opacity-20 hover:mt-0 hover:mb-1 active:scale-75"
              onClick={() => decrementVideo()}
            >
              <svg className="w-10 h-10" viewBox="0 0 24 24" aria-description="Decrement Video">
                <path fill="#fff" d="M6,6H8V18H6M9.5,12L18,18V6M16,14.14L12.97,12L16,9.86V14.14Z" />
              </svg>
            </button>
            <button className="flex items-center justify-center p-1 mt-1 transition-all duration-300 rounded focus:outline-none active:outline-none aspect-square hover:bg-gray-300 hover:bg-opacity-20 hover:mt-0 hover:mb-1 active:scale-75">
              <svg className="w-8 h-8" viewBox="0 0 24 24" aria-description="Stop Video">
                <path
                  fill="#fff"
                  d="M5,3H19A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3M13,13V7H11V13H13M13,17V15H11V17H13Z"
                />
              </svg>
            </button>
            <button
              className="flex items-center justify-center p-1 mt-1 transition-all duration-300 rounded focus:outline-none active:outline-none aspect-square hover:bg-gray-300 hover:bg-opacity-20 hover:mt-0 hover:mb-1 active:scale-75"
              onClick={() => incrementVideo()}
            >
              <svg className="w-10 h-10" viewBox="0 0 24 24" aria-description="Increment Video">
                <path fill="#fff" d="M6,18L14.5,12L6,6M8,9.86L11.03,12L8,14.14M16,6H18V18H16" />
              </svg>
            </button>
            <div className=" w-0.5 bg-opacity-50 bg-gray-200 h-8 py-2 mt-0 mr-2 ml-1"></div>
          </div>

          <div className="flex flex-row items-center mt-1 text-white group">
            {/* <div className="relative flex items-center group"> */}
            {/* <div className="absolute whitespace-nowrap group-hover:visible invisible opacity-0 group-hover:opacity-100 transition-all bottom-[5.5rem] mb-12 group-hover:mb-0 py-2 px-3 text-lg text-white rounded -left-12 text-center bg-[#262626] bg-opacity-[0.9] shadow-md duration-700">
                                            {volumeFactor === 0 ? "Click To Unmute" : "Click To Mute"}
                                        </div> */}
            <button
              className="flex items-center justify-center p-2 transition-all duration-300 rounded focus:outline-none active:outline-none aspect-square group-hover:bg-gray-300 group-hover:bg-opacity-10 active:scale-75"
              onClick={() => {
                handleVolumeButtonClick();
              }}
            >
              <svg className="w-8 h-8" viewBox="0 0 24 24">
                {volumeFactor >= 0.7 && (
                  <path
                    fill="#fff"
                    d="M12 12l5-2.917v9.917h-5v-7zm7-4.083v11.083h5v-14l-5 2.917zm-9 5.25l-10 5.833h10v-5.833z"
                  />
                )}
                {volumeFactor >= 0.3 && volumeFactor < 0.7 && (
                  <path
                    fill="#fff"
                    d="M12 12l5-2.917v9.917h-5v-7zm10-3.518v8.518h-1v-7.935l1-.583zm2-3.482l-5 2.917v11.083h5v-14zm-14 8.167l-10 5.833h10v-5.833z"
                  />
                )}
                {volumeFactor < 0.3 && volumeFactor > 0 && (
                  <path
                    fill="#fff"
                    d="M15 12.565v4.435h-1v-3.851l1-.584zm2-3.482l-5 2.917v7h5v-9.917zm5-.601v8.518h-1v-7.935l1-.583zm2-3.482l-5 2.917v11.083h5v-14zm-14 8.167l-10 5.833h10v-5.833z"
                  />
                )}
                {volumeFactor === 0 && (
                  <path
                    fill="#fff"
                    d="M19.803 13.207l-.829 1.093-1.554-3.826c-.077-.189-.244-.306-.437-.306-.157 0-.356.084-.444.321l-1.356 3.664-1.872-8.759c-.062-.291-.288-.394-.462-.394-.203 0-.428.131-.473.424l-1.629 10.581-1.658-6.968c-.067-.282-.291-.382-.463-.382-.167 0-.374.092-.453.349l-1.453 4.753-1.07-2.53c-.078-.185-.245-.299-.436-.299-.154 0-.294.076-.385.209l-1.257 1.805-.087.058h-2.985c-.276 0-.5.224-.5.5s.224.5.5.5h3.284c.152 0 .296-.074.386-.206l.948-1.353 1.24 2.929c.079.187.241.299.433.299.211 0 .39-.138.455-.35l1.324-4.332 1.814 7.629c.068.283.282.384.46.384.203 0 .428-.131.473-.425l1.605-10.425 1.673 7.83c.058.272.277.395.467.395.202 0 .366-.12.441-.321l1.5-4.049 1.426 3.51c.077.189.245.306.438.306.152 0 .292-.075.382-.206l1.146-1.583.087-.046h3.026c.272 0 .492-.22.492-.492s-.22-.494-.492-.494h-3.322c-.151 0-.294.077-.383.207z"
                  />
                )}
              </svg>
            </button>
            {/* </div> */}

            <div
              className="h-1 mx-3 w-0 group-hover:w-[100px] transition-all duration-300 bg-gray-300 rounded cursor-pointer flex items-center relative"
              onClick={handleVolumeBarClick}
              ref={myVolumeBar}
            >
              <div
                className="h-full bg-[#1653f0] w-full group flex justify-end items-center rounded "
                style={{ width: `${volumeFactor * 100}%` }}
              ></div>
              <div
                className="absolute w-3 h-3 max-w-full transition-all duration-300 ease-in-out scale-0 bg-white rounded-full shadow group-hover:scale-100"
                ref={volumeSlider}
              ></div>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <div className="relative flex items-center mt-1 mr-4 group">
            <div className="absolute whitespace-nowrap group-hover:visible invisible opacity-0 group-hover:opacity-100 transition-all bottom-16 mb-12 group-hover:mb-0 py-1.5 px-3 text-lg text-white rounded -left-20 bg-[#262626] bg-opacity-95 duration-700">
              {isAutoPlay ? "Turn Off Autoplay" : "Turn On Autoplay"}
            </div>
            <input
              className="appearance-none w-8 rounded-lg float-left h-3 bg-gray-400 checked:bg-[#1653f0] focus:outline-none cursor-pointer shadow-sm"
              type="checkbox"
              role="switch"
              id="autoPlayCheckBox"
              ref={autoPlayCheckButton}
              onChange={() => autoPlayHandler()}
            />
            <label
              htmlFor="autoPlayCheckBox"
              className="absolute flex items-center justify-center w-5 h-5 transition-all duration-500 bg-white rounded-full cursor-pointer"
              style={checkButtonTransition}
            >
              {isAutoPlay && (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
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
            <button className="p-1 mx-1 mt-1 transition-all duration-300 rounded focus:outline-none active:outline-none aspect-square group-hover:bg-gray-300 group-hover:bg-opacity-20 group-hover:mt-0 group-hover:mb-1">
              <svg className="w-8 h-8" viewBox="0 0 24 24" aria-description="Playback Speed">
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
              <ol className="flex flex-row items-center justify-between " onClick={handlePlaybackSpeed}>
                <li className="relative w-[92px] h-full ">
                  <div className="grid grid-cols-[40px_auto] items-center ml-[8px]">
                    <div
                      className="z-10 flex items-center justify-center w-4 mx-auto bg-gray-200 border rounded-full cursor-pointer aspect-square"
                      data-speed="0.50"
                      ref={speed050}
                    ></div>
                    <div className=" w-full bg-gray-200 h-0.5"></div>
                  </div>
                  <div className="px-2 mt-3 text-lg text-left text-white">0.50x</div>
                </li>
                <li className="relative w-32 h-full ">
                  <div className="grid grid-cols-[auto_40px_auto] items-center">
                    <div className=" w-full bg-gray-200 h-0.5"></div>
                    <div
                      className="z-10 flex items-center justify-center w-4 mx-auto bg-gray-200 border rounded-full cursor-pointer aspect-square "
                      data-speed="0.75"
                      ref={speed075}
                    ></div>
                    <div className=" w-full bg-gray-200 h-0.5"></div>
                  </div>
                  <div className="px-2 mt-3 text-lg text-center text-white">0.75x</div>
                </li>
                <li className="relative w-32 h-full ">
                  <div className="grid grid-cols-[auto_40px_auto] items-center">
                    <div className=" w-full bg-gray-200 h-0.5"></div>
                    <div
                      className="z-10 flex items-center justify-center w-4 mx-auto bg-gray-200 border rounded-full cursor-pointer aspect-square"
                      data-speed="1.00"
                      ref={speed100}
                    ></div>
                    <div className=" w-full bg-gray-200 h-0.5"></div>
                  </div>
                  <div className="px-2 mt-3 text-lg text-center text-white">Normal</div>
                </li>
                <li className="relative w-32 h-full ">
                  <div className="grid grid-cols-[auto_40px_auto] items-center">
                    <div className=" w-full bg-gray-200 h-0.5"></div>
                    <div
                      className="z-10 flex items-center justify-center w-4 mx-auto bg-gray-200 border rounded-full cursor-pointer aspect-square"
                      data-speed="1.25"
                      ref={speed125}
                    ></div>
                    <div className=" w-full bg-gray-200 h-0.5"></div>
                  </div>
                  <div className="px-2 mt-3 text-lg text-center text-white">1.25x</div>
                </li>
                <li className="relative w-[92px] h-full ">
                  <div className="grid grid-cols-[auto_40px] items-center mr-[8px]">
                    <div className=" w-full bg-gray-200 h-0.5"></div>
                    <div
                      className="z-10 flex items-center justify-center w-4 mx-auto bg-gray-200 border rounded-full cursor-pointer aspect-square"
                      data-speed="1.50"
                      ref={speed150}
                    ></div>
                  </div>
                  <div className="px-2 mt-3 text-lg text-right text-white">1.50x</div>
                </li>
              </ol>
            </div>
          </div>

          <div className="mx-1" title="Setting Icon And Box">
            <button
              className="p-1 mt-1 transition-all duration-300 rounded focus:outline-none active:outline-none aspect-square hover:bg-gray-300 hover:bg-opacity-20 hover:mt-0 hover:mb-1 active:scale-75"
              title="Settings"
              onClick={() => toggleSettings()}
            >
              <svg className="w-8 h-8" viewBox="0 0 24 24" aria-description="Settings">
                <path
                  fill="#fff"
                  d="M7 3H5V9H7V3M19 3H17V13H19V3M3 13H5V21H7V13H9V11H3V13M15 7H13V3H11V7H9V9H15V7M11 21H13V11H11V21M15 15V17H17V21H19V17H21V15H15Z"
                />
              </svg>
            </button>

            {showSettings && (
              <div
                id="settingsBox"
                className="transition-all duration-1000 z-10 absolute -translate-x-28 bottom-28 divide-y divide-gray-100 rounded shadow w-64 bg-[#262626]"
              >
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
                      <div className="relative flex items-center ">
                        <input
                          className="w-12 h-5 bg-gray-400 rounded-full shadow-sm appearance-none cursor-pointer checked:bg-blue-500 focus:outline-none"
                          type="checkbox"
                          role="switch"
                          id="annotation"
                        />
                        <label
                          htmlFor="annotation"
                          className="bg-white left-[5px]  rounded-full h-3.5 w-3.5 aspect-square absolute cursor-pointer duration-500 transition-all"
                        ></label>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="flex w-full px-4 py-4 hover:bg-[#434343] hover:text-white justify-between">
                      <span>Playback Speed</span>
                      <span>{playbackSpeed === 1 ? "Normal" : videoElement.current.playbackRate}</span>
                    </div>
                  </li>
                </ul>
              </div>
            )}
          </div>
          <div className="relative flex items-center group">
            <div className="absolute whitespace-nowrap group-hover:visible invisible opacity-0 group-hover:opacity-100 transition-all bottom-[5.5rem] mb-12 group-hover:mb-0 py-2 px-3 text-lg text-white rounded -left-20 w-48  text-center bg-[#262626] bg-opacity-[0.9] shadow-md duration-700 pointer-events-none ">
              {isLoop ? "Loop Activated" : "Loop Deactivated"}
            </div>

            <button
              className="p-1 mx-1 mt-1 transition-all duration-300 rounded focus:outline-none active:outline-none aspect-square hover:bg-gray-300 hover:bg-opacity-20 hover:mt-0 hover:mb-1 active:scale-75"
              title="Loop"
              onClick={() => handleLoop()}
            >
              <svg className="w-8 h-8" viewBox="0 0 24 24" aria-description="Loop">
                <path
                  fill={isLoop ? "#1653f0" : "#fff"}
                  d="M18.572 6c-6.018 0-8.414 10-13.143 10-2.114 0-3.479-1.578-3.479-4s1.366-4 3.479-4c1.666 0 2.862 1.069 4.017 2.395l1.244-1.561c-1.499-1.533-3.05-2.834-5.261-2.834-3.197 0-5.429 2.455-5.429 6s2.232 6 5.429 6c6.003 0 8.407-10 13.143-10 2.113 0 3.479 1.578 3.479 4s-1.365 4-3.479 4c-1.664 0-2.86-1.068-4.015-2.392l-1.244 1.561c1.499 1.531 3.05 2.831 5.259 2.831 3.197 0 5.428-2.455 5.428-6s-2.231-6-5.428-6z"
                />
              </svg>
            </button>
          </div>
          <div className="relative flex items-center ml-1 group">
            <div className="absolute whitespace-nowrap group-hover:visible invisible opacity-0 group-hover:opacity-100 transition-all bottom-[5.5rem] mb-12 group-hover:mb-0 py-2 px-3 text-lg text-white rounded -left-[52px] w-36 text-center bg-[#262626] bg-opacity-[0.9] shadow-md duration-700 pointer-events-none ">
              {isShowSubtitle ? "Subtitles On" : "Subtitles Off"}
            </div>

            <button
              className="flex items-center justify-center p-1 mx-1 mt-1 transition-all duration-300 rounded focus:outline-none active:outline-none aspect-square hover:bg-gray-300 hover:bg-opacity-20 hover:mt-0 hover:mb-1 active:scale-75"
              onClick={() => handleSubtitle()}
            >
              <svg className="w-8 h-8" viewBox="0 0 24 24" aria-description="Subtitles">
                {/* <path
                                                fill="#fff"
                                                d="M18.75 4C20.5449 4 22 5.45507 22 7.25V16.7546C22 18.5495 20.5449 20.0046 18.75 20.0046H5.25C3.45507 20.0046 2 18.5495 2 16.7546V7.25C2 5.51697 3.35645 4.10075 5.06558 4.00514L5.25 4H18.75ZM18.75 5.5H5.25L5.10647 5.5058C4.20711 5.57881 3.5 6.33183 3.5 7.25V16.7546C3.5 17.7211 4.2835 18.5046 5.25 18.5046H18.75C19.7165 18.5046 20.5 17.7211 20.5 16.7546V7.25C20.5 6.2835 19.7165 5.5 18.75 5.5ZM5.5 12C5.5 8.85442 8.21322 7.22469 10.6216 8.59854C10.9814 8.80378 11.1067 9.26183 10.9015 9.62162C10.6962 9.98141 10.2382 10.1067 9.87838 9.90146C8.48071 9.10417 7 9.99357 7 12C7 14.0046 8.48411 14.8962 9.8792 14.1027C10.2392 13.8979 10.6971 14.0238 10.9019 14.3838C11.1067 14.7439 10.9809 15.2018 10.6208 15.4066C8.21539 16.7747 5.5 15.1433 5.5 12ZM13 12C13 8.85442 15.7132 7.22469 18.1216 8.59854C18.4814 8.80378 18.6067 9.26183 18.4015 9.62162C18.1962 9.98141 17.7382 10.1067 17.3784 9.90146C15.9807 9.10417 14.5 9.99357 14.5 12C14.5 14.0046 15.9841 14.8962 17.3792 14.1027C17.7392 13.8979 18.1971 14.0238 18.4019 14.3838C18.6067 14.7439 18.4809 15.2018 18.1208 15.4066C15.7154 16.7747 13 15.1433 13 12Z"
                                            /> */}
                {isShowSubtitle ? (
                  <path
                    fill="#fff"
                    d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z"
                  />
                ) : (
                  <path
                    fill="#fff"
                    d="M18.722 17.289c.841-1.39 1.278-2.942 1.278-4.289v-2h-4v-6h6v5.391c0 2.936-1.176 5.333-3.278 6.898zm-13.993-.011c.836-1.386 1.271-2.934 1.271-4.278v-2h-4v-6h6v5.391c0 2.93-1.184 5.322-3.271 6.887zm-3.729 3.722c5.252-1.039 8.983-4.905 8.983-10.609v-7.391h-9.983v10h4c0 2.211-1.562 4.932-3.995 5.849l.995 2.151zm14 0c5.252-1.039 9-4.905 9-10.609v-7.391h-9.983v10h3.983c0 2.211-1.563 4.932-3.996 5.849l.996 2.151z"
                  />
                )}
              </svg>
            </button>
          </div>

          {/*
          //TODO : Handle fullScreenButton
          <div className="relative flex items-center mx-1 group">
            <div className="absolute whitespace-nowrap group-hover:visible invisible opacity-0 group-hover:opacity-100 transition-all bottom-[5.5rem] mb-12 group-hover:mb-0 py-2 px-3 text-lg text-white rounded -left-[44px] text-center bg-[#262626] bg-opacity-[0.9] shadow-md duration-700 pointer-events-none ">
              {fullScreenIcon ? "Maximize" : "Minimize"}
            </div>
            <button
              className="focus:outline-none active:outline-none rounded aspect-square hover:bg-gray-300 hover:bg-opacity-20 transition-all duration-300 p-1.5 mx-1 mt-2 hover:mt-1 hover:mb-1 active:scale-[0.8] "
              onClick={handleFullscreen}
            >
              {fullScreenIcon ? (
                <svg className="h-7 w-7" viewBox="0 0 24 24" aria-description="Expand">
                  <path
                    fill="#fff"
                    d="M24 9h-2v-5h-7v-2h9v7zm-9 13v-2h7v-5h2v7h-9zm-15-7h2v5h7v2h-9v-7zm9-13v2h-7v5h-2v-7h9z"
                  />
                </svg>
              ) : (
                <svg className="h-7 w-7" viewBox="0 0 24 24" aria-description="Shrink">
                  <path
                    fill="#fff"
                    d="M15 2h2v5h7v2h-9v-7zm9 13v2h-7v5h-2v-7h9zm-15 7h-2v-5h-7v-2h9v7zm-9-13v-2h7v-5h2v7h-9z"
                  />
                </svg>
              )}
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
}
