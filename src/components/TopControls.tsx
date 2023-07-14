import { videoArray } from "../data/videoArray";

export default function TopControls({ videoNumber }: { videoNumber: number }) {
  return (
    <div
      title="videoTitle"
      className="absolute z-20 w-full pt-10 pl-10 text-4xl font-bold tracking-wide text-white transition-all duration-700 sm:text-5xl md:text-7xl -mt-28 videoTitle drop-shadow-lg"
    >
      {videoArray[videoNumber].videoName}
    </div>
  );
}
