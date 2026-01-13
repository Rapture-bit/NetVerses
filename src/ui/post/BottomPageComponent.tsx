import { useEffect, useState } from "react";

export default function BottomPageComponent({ bottomReached, selectedFeed }) {
  const [isDeclared, setDeclared] = useState<boolean>(false);
  const [isLoadingFeed, setLoadingFeed] = useState<boolean>(false);
  const [loadedFeed, setLoadedFeed] = useState<any[]>({});

  useEffect(() => {
    if (bottomReached) {
      setDeclared(true);
      setLoadingFeed(true);
      setTimeout(() => {
        setLoadingFeed(false);
      }, 5 * 1000);
    }
  }, [bottomReached]);

  return (
    <div className="flex flex-col overflow-x-hidden space-y-5 p-5">
      {isLoadingFeed && (
        <span className="icon-[eos-icons--loading] w-7 h-7 text-purple-600"></span>
      )}
      {!isLoadingFeed && isDeclared && Object.keys(loadedFeed).length == 0 && (
        <span>You have reached the bottom of the page.</span>
      )}
    </div>
  );
}
