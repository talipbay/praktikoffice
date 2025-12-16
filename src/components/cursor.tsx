"use client";

"use client";

import { useAnimationControls, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
export type CursorLookType = "default" | "hidden";

const transition = {
  type: "spring" as const,
};

const Cursor = () => {
  const innerControls = useAnimationControls();
  const innerBgControls = useAnimationControls();

  const outerControls = useAnimationControls();
  const outerBgControls = useAnimationControls();

  const [type, setType] = useState<CursorLookType>("default");
  const secondaryCursor = useRef<HTMLDivElement>(null);
  const mainCursor = useRef<HTMLDivElement>(null);
  const positionRef = useRef({
    mouseX: 0,
    mouseY: 0,
    destinationX: 0,
    destinationY: 0,
    distanceX: 0,
    distanceY: 0,
    key: -1,
  });

  const hide = () => {
    innerControls.start({
      opacity: 0,
    });
    outerControls.start({ opacity: 0 });
  };

  const show = () => {
    innerControls.start({
      opacity: 1,
    });
    outerControls.start({ opacity: 1 });
  };

  const onMouseDown = async () => {
    outerBgControls.start({
      opacity: 0,
      scale: 0,
      transition: {
        duration: 0.3,
      },
    });
    innerBgControls.start({
      scale: 0.7,
      transition,
    });
  };

  const onMouseUp = async () => {
    outerBgControls.start({
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
      },
    });
    innerBgControls.start({
      scale: 1,
      transition,
    });
  };

  const onMouseLeave = () => {
    setType("hidden");
  };

  const onMouseEnter = () => {
    setType("default");
  };

  const onMouseEnterLink = async (scale: number) => {
    outerBgControls.start({
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    });
    innerBgControls.start({
      scale,
      transition,
    });
  };

  const onMouseLeaveLink = async () => {
    outerBgControls.start({
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    });
    innerBgControls.start({
      scale: 1,
      transition,
    });
  };

  const onMouseMove = (event: MouseEvent) => {
    const { clientX, clientY } = event;

    const mouseX = clientX;
    const mouseY = clientY;

    if (secondaryCursor.current && mainCursor.current) {
      positionRef.current.mouseX =
        mouseX - secondaryCursor.current!.clientWidth / 2;
      positionRef.current.mouseY =
        mouseY - secondaryCursor.current!.clientHeight / 2;
      mainCursor.current!.style.transform = `translate3d(${
        mouseX - mainCursor.current!.clientWidth / 2
      }px, ${mouseY - mainCursor.current!.clientHeight / 2}px, 0)`;
    }
  };

  useEffect(() => {
    // Show cursor immediately if mouse is already in the window
    show();

    let hideLinks = document.querySelectorAll("[data-cursor-hide]");
    hideLinks.forEach((item) => {
      item.addEventListener("mouseenter", hide);
      item.addEventListener("mouseleave", show);
    });

    let smallLinks = document.querySelectorAll('[data-cursor="small"]');
    smallLinks.forEach((item) => {
      item.addEventListener("mouseenter", () => onMouseEnterLink(3));
      item.addEventListener("mouseleave", onMouseLeaveLink);
    });

    let medLinks = document.querySelectorAll('[data-cursor="medium"]');
    medLinks.forEach((item) => {
      item.addEventListener("mouseenter", () => onMouseEnterLink(4));
      item.addEventListener("mouseleave", onMouseLeaveLink);
    });

    let hugeLinks = document.querySelectorAll('[data-cursor="huge"]');
    hugeLinks.forEach((item) => {
      item.addEventListener("mouseenter", () => onMouseEnterLink(5));
      item.addEventListener("mouseleave", onMouseLeaveLink);
    });

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mousemove", onMouseMove);
    document.body.addEventListener("mouseenter", onMouseEnter);
    document.body.addEventListener("mouseleave", onMouseLeave);

    return () => {
      hideLinks.forEach((item) => {
        item.removeEventListener("mouseenter", hide);
        item.removeEventListener("mouseleave", show);
      });
      [...smallLinks, ...medLinks, ...hugeLinks].forEach((item) => {
        item.removeEventListener("mouseenter", () => onMouseEnterLink);
        item.removeEventListener("mouseleave", onMouseLeaveLink);
      });
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousemove", onMouseMove);
      document.body.removeEventListener("mouseenter", onMouseEnter);
      document.body.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  useEffect(() => {
    const followMouse = () => {
      positionRef.current.key = requestAnimationFrame(followMouse);
      const {
        mouseX,
        mouseY,
        destinationX,
        destinationY,
        distanceX,
        distanceY,
      } = positionRef.current;
      if (!destinationX || !destinationY) {
        positionRef.current.destinationX = mouseX;
        positionRef.current.destinationY = mouseY;
      } else {
        positionRef.current.distanceX = (mouseX - destinationX) * 0.1;
        positionRef.current.distanceY = (mouseY - destinationY) * 0.1;
        if (
          Math.abs(positionRef.current.distanceX) +
            Math.abs(positionRef.current.distanceY) <
          0.1
        ) {
          positionRef.current.destinationX = mouseX;
          positionRef.current.destinationY = mouseY;
        } else {
          positionRef.current.destinationX += distanceX;
          positionRef.current.destinationY += distanceY;
        }
      }
      if (secondaryCursor.current) {
        secondaryCursor.current!.style.transform = `translate3d(${destinationX}px, ${destinationY}px, 0)`;
      }
    };
    followMouse();
  }, []);

  return type !== "hidden" ? (
    <div className={`cursor-wrapper ${type}`}>
      <motion.div
        animate={innerControls}
        className="main-cursor"
        ref={mainCursor}
      >
        <motion.div
          animate={innerBgControls}
          className="main-cursor-background"
        ></motion.div>
      </motion.div>
      <motion.div
        animate={outerControls}
        className="secondary-cursor"
        ref={secondaryCursor}
      >
        <motion.div
          animate={outerBgControls}
          className={`cursor-background`}
        ></motion.div>
      </motion.div>
    </div>
  ) : (
    <></>
  );
};

export default Cursor;
