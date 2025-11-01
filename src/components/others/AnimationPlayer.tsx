import React, { useContext, useRef, useEffect } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { AnimateContext } from "@/context/AnimateContext";

export default function AnimationPlayer() {
  const { animSrc, setCurrentRef, setLoaded } = useContext(AnimateContext);
  const dotLottieRef = useRef(null);

  useEffect(() => {
    if (dotLottieRef.current) {
      setCurrentRef(dotLottieRef.current);
    }
  }, [dotLottieRef.current]);

  if (!animSrc) return null;

  return (
    <div className="fixed w-screen min-h-screen z-[10000] pointer-events-none">
      <DotLottieReact
        key={animSrc}
        src={animSrc}
        autoplay={false}
        loop={false}
        dotLottieRefCallback={(dotLottie) => {
          dotLottieRef.current = dotLottie;
          setCurrentRef(dotLottie);
        }}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
