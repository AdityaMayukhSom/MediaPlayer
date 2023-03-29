export function Video({
  isLoop,
  myVideo,
  handleLoadedMetadata,
  handleVideoEnded
}) {

  return <div className="flex items-center justify-center w-screen h-screen overflow-hidden">
    <video loop={isLoop} width="auto" src={videoArray[videoNumber].videoURL} ref={myVideo} className="w-full h-full" id="myVideoID" onLoadedMetadata={handleLoadedMetadata} type="video/mp4" poster={videoArray[videoNumber].posterURL} onEnded={() => {
      handleVideoEnded();
    }}>
      <track label="English" kind="subtitles" srcLang="en" src={videoArray[videoNumber].subtitleURL} default />
    </video>
  </div>;
}
