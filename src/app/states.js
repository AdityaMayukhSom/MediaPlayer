const SECOND = 1;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const timeRemainingShowNextEpisode = 10;
const opacityNull = { opacity: 0, pointerEvents: "none", cursor: "none" };
const opacityFull = { opacity: 1, pointerEvents: "all", cursor: "auto" };
const [isPlaying, setIsPlaying] = useState(false);
const [showSettings, setShowSettings] = useState(false);
const [videoNumber, setVideoNumber] = useState(0);
const [videoPlayingFor, setVideoPlayingFor] = useState("00:00:00");
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
const autoPlayCheckButton = useRef(null);
const [checkButtonTransition, setCheckButtonTransition] = useState({ marginLeft: "-10px" });
const [isAutoPlay, setIsAutoPlay] = useState(false);

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
