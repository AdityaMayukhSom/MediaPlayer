import { useRef, useState } from "react";
import { videoArray } from "../data/videoArray";
import Controls from "./Controls";
import { opacityFull } from "../data/coverOpacity";

function App() {
  const [videoNumber, setVideoNumber] = useState<number>(0);
  const [isLoop, setIsLoop] = useState<boolean>(false);
  const [totalTiming, setTotalTiming] = useState(0);
  const [fullScreenIcon, setFullScreenIcon] = useState<boolean>(true);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(false);
  const [coverOpacity, setCoverOpacity] = useState<React.CSSProperties>(opacityFull);

  const videoElement = useRef<HTMLVideoElement>(null);
  const videoElementPlayer = useRef<HTMLDivElement>(null);

  const handleLoadedMetadata = () => {
    if (!videoElement.current) return;
    setTotalTiming(videoElement.current.duration);
  };

  async function handleFullscreen() {
    if (document.fullscreenElement) {
      await leaveFullScreen();
    } else {
      await goFullScreen();
    }
  }

  const getFullScreenElement = (elem: HTMLDivElement) => {
    return elem.requestFullscreen;
    // || elem.webkitRequestFullscreen ||
    // elem.mozRequestFullscreen ||
    // elem.msRequestFullscreen
  };

  const goFullScreen = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (videoElementPlayer.current) {
        getFullScreenElement(videoElementPlayer.current).call(videoElementPlayer.current);
        resolve();
      } else {
        reject();
      }
    });
  };

  const leaveFullScreen = (): Promise<void> => {
    return new Promise((resolve) => {
      document.exitFullscreen();
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

  function handleVideoEnded() {
    if (isAutoPlay) {
      if (videoNumber < videoArray.length - 1) {
        setVideoNumber(videoNumber + 1);
      } else {
        setVideoNumber(0);
      }
      setIsPlaying(false);
      setTimeout(() => {
        if (videoElement.current) {
          videoElement.current.play();
          setIsPlaying(true);
        }
      }, 1000);
    } else {
      if (videoElement.current) {
        videoElement.current.pause();
      }
      setIsPlaying(false);
      setCoverOpacity(opacityFull);
    }
  }
  return (
    <div className="flex items-center justify-center bg-black">
      <div
        ref={videoElementPlayer}
        className="relative"
        onDoubleClick={() => {
          handleFullscreen();
        }}
      >
        <div className="flex items-center justify-center w-screen h-screen overflow-hidden">
          <video
            loop={isLoop}
            width="auto"
            src={videoArray[videoNumber].videoURL}
            ref={videoElement}
            className="w-full h-full"
            id="myVideoID"
            onLoadedMetadata={handleLoadedMetadata}
            poster={videoArray[videoNumber].posterURL}
            onEnded={handleVideoEnded}
          >
            <track label="English" kind="subtitles" srcLang="en" src={videoArray[videoNumber].subtitleURL} default />
          </video>
        </div>
        <Controls
          videoElement={videoElement}
          totalTiming={totalTiming}
          setTotalTiming={setTotalTiming}
          videoNumber={videoNumber}
          setVideoNumber={setVideoNumber}
          isLoop={isLoop}
          setIsLoop={setIsLoop}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          isAutoPlay={isAutoPlay}
          setIsAutoPlay={setIsAutoPlay}
          coverOpacity={coverOpacity}
          setCoverOpacity={setCoverOpacity}
        />
      </div>
    </div>
  );
}
export default App;
