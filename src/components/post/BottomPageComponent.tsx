import { useEffect, useState } from "react";

export default function BottomPageComponent({ bottomReached, selectedFeed }) {
  const [isLoadingFeed, setLoadingFeed] = useState<boolean>(false);
  const [loadedFeed, setLoadedFeed] = useState<any[]>({});

  useEffect(() => {
    if (bottomReached) {
      setLoadingFeed(true);
      // Finished; setloadingfeed to false
    }
  }, [bottomReached]);

  return (
    <div className="flex flex-col overflow-x-hidden space-y-5 p-5">
      {isLoadingFeed && (
        <span className="icon-[eos-icons--loading] w-7 h-7 text-purple-600"></span>
      )}
    </div>
  );
}
