import { Controls } from './components/Controls.jsx';
import { MidScreenControls } from './components/MidScreenControls.jsx';
import { Subtitles } from './components/Subtitles.jsx';
import { Title } from './components/Title.jsx';
import { Video } from './components/Video.jsx';

const videoArray = [
    { videoName: "Baraat", videoURL: "./videos/Baraat.mp4", subtitleURL: "./subtitle/mySubtitle.vtt", posterURL: "./images/Baraat.jpeg" },
    { videoName: "Pasoori", videoURL: "./videos/Pasoori.mp4", subtitleURL: "./subtitle/Pasoori.vtt", posterURL: "./images/Pasoori.jpg" },
    { videoName: "Moon Knight", videoURL: "./videos/Moon.mp4", subtitleURL: "./subtitle/mySubtitle.vtt", posterURL: "./images/Moon Knight.jpg" },
    { videoName: "Komola", videoURL: "./videos/Komola.mp4", subtitleURL: "./subtitle/mySubtitle.vtt", posterURL: "./images/Pasoori.jpg" },
    { videoName: "O Je Mane Na Mana", videoURL: "./videos/ManeNaMana.mp4", subtitleURL: "./subtitle/mySubtitle.vtt", posterURL: "./images/Pasoori.jpg" },
    { videoName: "Thor Love And Thunder", videoURL: "./videos/Thor.mp4", subtitleURL: "./subtitle/mySubtitle.vtt", posterURL: "./images/Pasoori.jpg" },
    { videoName: "Ms. Marvel", videoURL: "./videos/Marvel.mp4", subtitleURL: "./subtitle/mySubtitle.vtt", posterURL: "./images/Pasoori.jpg" },
    { videoName: "hello", videoURL: "./videos/hello.mp4", subtitleURL: "./subtitle/mySubtitle.vtt", posterURL: "./images/hero.jpg" },
];

function App() {



    return (
        <div className="flex items-center justify-center bg-black">
            <div
                ref={myVideoPlayer}
                className="relative"
                onDoubleClick={() => {
                    handleFullscreen();
                }}
            >
                <Video isLoop={isLoop} myVideo={myVideo} handleLoadedMetadata={handleLoadedMetadata} handleVideoEnded={handleVideoEnded} />
                <div className="w-full h-full subtitleInside">
                    <Subtitles isShowSubtitle={isShowSubtitle} textTrack={textTrack} />
                    <div className="h-full w-[100%] top-0 absolute z-10 opacity-100 transition-all bg-gradient-to-b from-black via-[#0000008a] to-black bg-opacity-[0.4] duration-500 coverShadow overflow-hidden " style={coverOpacity} ref={videoCover}>
                        <Title />
                        <MidScreenControls />
                        <Controls />
                    </div>
                </div>
            </div>
        </div>
    );
}
export default App;
