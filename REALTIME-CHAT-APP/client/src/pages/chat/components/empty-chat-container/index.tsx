import { animationDefaultOptions } from "@/lib/utils";
import Lottie from "lottie-react";

export default function EmptyChatContainer() {
  return (
    <div className="flex-1 md:bg-[#1c1d25] md:flex flex-col justify-center items-center hidden duration-1000 transition-all">
      <div className="w-full flex justify-center items-center">
        <div className="w-[200px] h-[200px]">
          <Lottie
            animationData={animationDefaultOptions.animationData}
            loop={animationDefaultOptions.loop}
            autoplay={animationDefaultOptions.autoplay}
            height={200}
            width={200}
          />
        </div>
      </div>
      <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-10 text-3xl lg:text-4xl transition-all duration-300">
        <h3 className="poppins-medium">
          Hi<span className="text-purple-500">!</span> Welcome to{" "}
          <span className="text-purple-500">Realtime</span> Chat App
          <span className="text-purple-500">.</span>
        </h3>
      </div>
    </div>
  );
}
