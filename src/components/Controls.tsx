import { useRef, useState } from "react";

import TopControls from "./TopControls";
import MiddleControls from "./MiddleControls";
import BottomControls from "./BottomControls";
import { convertHMS } from "../utils/convertHMS";
import { opacityFull, opacityNull } from "../data/coverOpacity";

export default function Controls({
  videoElement,

  totalTiming,
  setTotalTiming,

  videoNumber,
  setVideoNumber,

  isLoop,
  setIsLoop,

  isPlaying,
  setIsPlaying,

  isAutoPlay,
  setIsAutoPlay,

  coverOpacity,
  setCoverOpacity,
}: {
  videoElement: React.RefObject<HTMLVideoElement>;

  totalTiming: number;
  setTotalTiming: React.Dispatch<React.SetStateAction<number>>;

  videoNumber: number;
  setVideoNumber: React.Dispatch<React.SetStateAction<number>>;

  isLoop: boolean;
  setIsLoop: React.Dispatch<React.SetStateAction<boolean>>;

  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;

  isAutoPlay: boolean;
  setIsAutoPlay: React.Dispatch<React.SetStateAction<boolean>>;

  coverOpacity: React.CSSProperties;
  setCoverOpacity: React.Dispatch<React.SetStateAction<React.CSSProperties>>;
}) {
  let timingID: number;
  let timeoutTimer: number;
  let timoutNow = 5000; // Timeout in 5 second.

  const videoCover = useRef<HTMLDivElement>(null);

  const [videoPlayingFor, setVideoPlayingFor] = useState<string>("00:00:00");
  const [textTrack, setTextTrack] = useState<string>("");
  const [isShowSubtitle, setIsShowSubtitle] = useState<boolean>(false);

  function getSubtitle() {
    if (!videoElement.current) return;
    let track: TextTrack = videoElement.current.textTracks[0];
    track.mode = "hidden";

    track.oncuechange = () => {
      if (track.activeCues && track.activeCues.length) {
        // TODO: Need to fix track.activeCues
        setTextTrack("track.activeCues[0]");
      } else {
        setTextTrack("");
      }
    };
  }

  function StartTimers() {
    // Start timers.
    timeoutTimer = setTimeout(() => setCoverOpacity(opacityNull), timoutNow);
  }

  function ResetTimers() {
    // Reset timers.
    clearTimeout(timeoutTimer);
    StartTimers();
  }

  document.onmousemove = () => {
    setCoverOpacity(opacityFull);
    ResetTimers();
  };
  document.onmouseleave = () => {
    setCoverOpacity(opacityNull);
    clearTimeout(timeoutTimer);
  };

  const togglePlaying = () => {
    if (!videoElement.current) return;

    if (isPlaying) {
      setIsPlaying(false);
      videoElement.current.pause();
      clearInterval(timingID);
      setCoverOpacity(opacityFull);
    } else {
      setIsPlaying(true);
      videoElement.current.play();
      timingID = setInterval(() => {
        if (videoElement.current) {
          setVideoPlayingFor(convertHMS(videoElement.current.currentTime));
        }
      }, 10);
    }
  };

  return (
    <div className="w-full h-full subtitleInside">
      {isShowSubtitle && (
        <pre
          className="absolute w-screen text-lg font-semibold tracking-wide text-center text-white transition-all duration-500 pointer-events-none sm:text-2xl md:text-3xl lg:text-5xl bottom-12 sm:bottom-0 sm:mb-16 subtitle-font"
          id="subtitle"
          data-name="subtitle"
        >
          {textTrack}
        </pre>
      )}
      <div
        className="h-full w-[100%] top-0 absolute z-10 opacity-100 transition-all bg-gradient-to-b from-black via-[#0000008a] to-black bg-opacity-[0.4] duration-500 coverShadow overflow-hidden "
        style={coverOpacity}
        ref={videoCover}
      >
        <TopControls videoNumber={videoNumber} />
        <MiddleControls videoElement={videoElement} togglePlaying={togglePlaying} isPlaying={isPlaying} />
        <BottomControls
          videoElement={videoElement}
          totalTiming={totalTiming}
          setTotalTiming={setTotalTiming}
          togglePlaying={togglePlaying}
          isPlaying={isPlaying}
          videoNumber={videoNumber}
          setVideoNumber={setVideoNumber}
          videoPlayingFor={videoPlayingFor}
          setIsPlaying={setIsPlaying}
          isLoop={isLoop}
          setIsLoop={setIsLoop}
          isAutoPlay={isAutoPlay}
          setIsAutoPlay={setIsAutoPlay}
          isShowSubtitle={isShowSubtitle}
          setIsShowSubtitle={setIsShowSubtitle}
        />
      </div>
    </div>
  );
}
