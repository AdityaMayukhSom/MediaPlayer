import React from "react";
export function Subtitles({
  isShowSubtitle,
  textTrack
}) {
  return <div>
                   {isShowSubtitle && <pre className="w-screen absolute text-center text-white duration-500 text-lg sm:text-2xl md:text-3xl lg:text-5xl bottom-12 sm:bottom-0 sm:mb-16 transition-all  font-semibold tracking-wide pointer-events-none subtitle-font" id="subtitle" data-name="subtitle">
                            {textTrack}
                        </pre>}
                   </div>;
}
  