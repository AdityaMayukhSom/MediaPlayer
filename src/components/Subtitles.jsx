export function Subtitles({
  isShowSubtitle,
  textTrack
}) {
  return <div>
    {isShowSubtitle && <pre className="absolute w-screen text-lg font-semibold tracking-wide text-center text-white transition-all duration-500 pointer-events-none sm:text-2xl md:text-3xl lg:text-5xl bottom-12 sm:bottom-0 sm:mb-16 subtitle-font" id="subtitle" data-name="subtitle">
      {textTrack}
    </pre>}
  </div>;
}
