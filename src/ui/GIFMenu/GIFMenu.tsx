import { useRef, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function GIFMenu({ openMenu }: { openMenu: boolean }) {
  const searchContainerRef = useRef<HTMLDivElement | null>(null);
  const [indexedTerm, setIndexTerm] = useState<string>("");

  const [isVisible, setVisible] = useState<boolean>(false);
  const [isTopVisible, setTopVisible] = useState<boolean>(true);
  const [categoriesVisible, setCategoriesVisible] = useState<boolean>(true);
  const [profileColor, setProfileColor] = useState<string>("gray");
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });

  const [isOnFocus, setFocus] = useState<boolean>(false);

  const suggestedCategories = [
    {
      label: "Money",
      imgAlt: "Money",
      gifs: [],
      gifUrl:
        "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExY2I2b3g4OXVjZndsNW90bWFxODRoaGR2ampoMGdhenM2OGlnMHY3eiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/MFsqcBSoOKPbjtmvWz/giphy.gif",
    },
  ];

  const trendingCategories = [
    {
      label: "Money",
      imgAlt: "Money",
      gifUrl:
        "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbWphNDdoaGJ3ZTQ3a2phbDNxcWJ5OHlleWVqeTA1cWk4ZzZiNWV0dSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/XGP7mf38Vggik/giphy.gif",
      gifs: [],
    },
  ];

  const availableGifCategories = [
    {
      label: "Joy",
      imgAlt: "Excited",
      gifs: [],
      gifUrl:
        "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNWtiMjc3bHk5OTd1a2w1aHpid2cwNmJtZmZ6cncyc2ltMXZyZnZ5dSZlcD12MV9naWZzX3RyZW5kaW5nJmN0PWc/lYjA4tfvCc8UAju1Op/giphy.gif",
    },
    {
      label: "Cats",
      imgAlt: "Cats",
      gifs: [
        {
          imgAlt: "Cat",
          gifUrl:
            "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHlkM3owN2hpMjg2cTNyc3BqM3d5bzEwemp5empzenFuNXEwd2xsYyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/901mxGLGQN2PyCQpoc/giphy.gif",
        },
        {
          imgAlt: "Cat",
          gifUrl:
            "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHlkM3owN2hpMjg2cTNyc3BqM3d5bzEwemp5empzenFuNXEwd2xsYyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/LBb735fuQwRKAVzN23/giphy.gif",
        },
        {
          imgAlt: "Cat",
          gifUrl:
            "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHlkM3owN2hpMjg2cTNyc3BqM3d5bzEwemp5empzenFuNXEwd2xsYyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Ev477g37MJORyOWfdG/giphy.gif",
        },
        {
          imgAlt: "Cat",
          gifUrl:
            "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHlkM3owN2hpMjg2cTNyc3BqM3d5bzEwemp5empzenFuNXEwd2xsYyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/mcsPU3SkKrYDdW3aAU/giphy.gif",
        },
        {
          imgAlt: "Cat",
          gifUrl:
            "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHlkM3owN2hpMjg2cTNyc3BqM3d5bzEwemp5empzenFuNXEwd2xsYyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/In0Lpu4FVivjISX9HT/giphy.gif",
        },
        {
          imgAlt: "Cat",
          gifUrl:
            "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHlkM3owN2hpMjg2cTNyc3BqM3d5bzEwemp5empzenFuNXEwd2xsYyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/pY8jLmZw0ElqvVeRH4/giphy.gif",
        },
        {
          imgAlt: "Cat",
          gifUrl:
            "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHlkM3owN2hpMjg2cTNyc3BqM3d5bzEwemp5empzenFuNXEwd2xsYyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/MDJ9IbxxvDUQM/giphy.gif",
        },
      ],
      gifUrl:
        "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdHBpMnhuMDZxNjZteG40OGc3cnlvY3RkeGliZ2NrajZ3ZnF1dW9hNyZlcD12MV9naWZzX3RyZW5kaW5nJmN0PWc/MDJ9IbxxvDUQM/giphy.gif",
    },
  ];

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [displayedCategories, setDisplayedCategories] = useState([
    {
      label: "Joy",
      imgAlt: "Excited",
      gifs: [
        {
          imgAlt: "Cat",
          gifUrl:
            "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHlkM3owN2hpMjg2cTNyc3BqM3d5bzEwemp5empzenFuNXEwd2xsYyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/901mxGLGQN2PyCQpoc/giphy.gif",
        },
        {
          imgAlt: "Cat",
          gifUrl:
            "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHlkM3owN2hpMjg2cTNyc3BqM3d5bzEwemp5empzenFuNXEwd2xsYyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/LBb735fuQwRKAVzN23/giphy.gif",
        },
        {
          imgAlt: "Cat",
          gifUrl:
            "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHlkM3owN2hpMjg2cTNyc3BqM3d5bzEwemp5empzenFuNXEwd2xsYyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Ev477g37MJORyOWfdG/giphy.gif",
        },
        {
          imgAlt: "Cat",
          gifUrl:
            "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHlkM3owN2hpMjg2cTNyc3BqM3d5bzEwemp5empzenFuNXEwd2xsYyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/mcsPU3SkKrYDdW3aAU/giphy.gif",
        },
        {
          imgAlt: "Cat",
          gifUrl:
            "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHlkM3owN2hpMjg2cTNyc3BqM3d5bzEwemp5empzenFuNXEwd2xsYyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/In0Lpu4FVivjISX9HT/giphy.gif",
        },
        {
          imgAlt: "Cat",
          gifUrl:
            "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHlkM3owN2hpMjg2cTNyc3BqM3d5bzEwemp5empzenFuNXEwd2xsYyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/pY8jLmZw0ElqvVeRH4/giphy.gif",
        },
        {
          imgAlt: "Cat",
          gifUrl:
            "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHlkM3owN2hpMjg2cTNyc3BqM3d5bzEwemp5empzenFuNXEwd2xsYyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/MDJ9IbxxvDUQM/giphy.gif",
        },
      ],
      gifUrl:
        "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNWtiMjc3bHk5OTd1a2w1aHpid2cwNmJtZmZ6cncyc2ltMXZyZnZ5dSZlcD12MV9naWZzX3RyZW5kaW5nJmN0PWc/lYjA4tfvCc8UAju1Op/giphy.gif",
    },
    {
      label: "Cats",
      imgAlt: "Cats",
      gifs: [
        {
          imgAlt: "Cat",
          gifUrl:
            "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHlkM3owN2hpMjg2cTNyc3BqM3d5bzEwemp5empzenFuNXEwd2xsYyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/901mxGLGQN2PyCQpoc/giphy.gif",
        },
        {
          imgAlt: "Cat",
          gifUrl:
            "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHlkM3owN2hpMjg2cTNyc3BqM3d5bzEwemp5empzenFuNXEwd2xsYyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/LBb735fuQwRKAVzN23/giphy.gif",
        },
        {
          imgAlt: "Cat",
          gifUrl:
            "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHlkM3owN2hpMjg2cTNyc3BqM3d5bzEwemp5empzenFuNXEwd2xsYyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Ev477g37MJORyOWfdG/giphy.gif",
        },
        {
          imgAlt: "Cat",
          gifUrl:
            "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHlkM3owN2hpMjg2cTNyc3BqM3d5bzEwemp5empzenFuNXEwd2xsYyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/mcsPU3SkKrYDdW3aAU/giphy.gif",
        },
        {
          imgAlt: "Cat",
          gifUrl:
            "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHlkM3owN2hpMjg2cTNyc3BqM3d5bzEwemp5empzenFuNXEwd2xsYyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/In0Lpu4FVivjISX9HT/giphy.gif",
        },
        {
          imgAlt: "Cat",
          gifUrl:
            "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHlkM3owN2hpMjg2cTNyc3BqM3d5bzEwemp5empzenFuNXEwd2xsYyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/pY8jLmZw0ElqvVeRH4/giphy.gif",
        },
        {
          imgAlt: "Cat",
          gifUrl:
            "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHlkM3owN2hpMjg2cTNyc3BqM3d5bzEwemp5empzenFuNXEwd2xsYyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/MDJ9IbxxvDUQM/giphy.gif",
        },
      ],
      gifUrl:
        "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdHBpMnhuMDZxNjZteG40OGc3cnlvY3RkeGliZ2NrajZ3ZnF1dW9hNyZlcD12MV9naWZzX3RyZW5kaW5nJmN0PWc/MDJ9IbxxvDUQM/giphy.gif",
    },
  ]);

  const containerRef = useRef(null);

  const toggleMenu = (e: any) => {
    const parentElement: HTMLDivElement = e.target.parentElement;

    const parentElementRect = parentElement.getBoundingClientRect();
    const emojiMenuRect = e.target.getBoundingClientRect();

    const posX = Math.abs(parentElementRect.left - emojiMenuRect.left);
    const posY = Math.abs(parentElementRect.top - emojiMenuRect.top);

    setMenuPos({ x: posX, y: posY - 50 });
    setVisible(true);
  };

  useEffect(() => {
    if (openMenu) {
      toggleMenu();
    }
  }, [openMenu]);

  const selectCategory = (category: string) => {
    setSelectedCategory(category);
    setTopVisible(false);
    setCategoriesVisible(false);
  };

  useEffect(() => {
    // Indexing System
    if (indexedTerm && indexedTerm.trim().length > 0) {
      setTopVisible(false);
      const newElements = availableGifCategories.filter((gif) =>
        gif.label.toLowerCase().trim().includes(indexedTerm.toLowerCase()),
      );
      setDisplayedCategories(newElements);
    } else {
      setTopVisible(true);
      setDisplayedCategories(availableGifCategories);
    }
  }, [indexedTerm]);

  return (
    <>
      <AnimatePresence>
        <motion.div
          {...(isVisible && {
            drag: true,
            dragMomentum: false,
            dragElastic: 0.2,
          })}
          style={{ left: menuPos.x, top: menuPos.y }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          initial={{ opacity: 0 }}
          transition={{ duration: isVisible ? 0.2 : 0.4 }}
          className={`fixed flex flex-col p-3 rounded-md backgroundColor border borderColor shadow-lg
            w-full sm:w-3/4 md:w-1/2 lg:w-1/3 z-[999] xl:w-1/4 max-h-[80vh] ${
              !isVisible ? "pointer-events-none select-none" : ""
            }`}
        >
          <div
            ref={containerRef}
            className="flex flex-row items-center justify-between border-b pb-2.5 border-gray-700 relative"
          >
            <div className="flex flex-row justify-between w-full text-sm">
              <span className="select-none">GIFs</span>
              <button
                type="button"
                onClick={() => setVisible(false)}
                className="cursor-pointer outline-none border-0 focus:outline-none focus:ring-0 focus-visible:border-2 border-purple-800 focus-visible:p-1 focus-visible:rounded-sm text-sm flex items-center justify-center"
                aria-label="Close"
              >
                <span className="icon-[ic--round-close] text-base"></span>
              </button>
            </div>
          </div>
          <div className="text-sm mt-2">
            <div
              ref={searchContainerRef}
              className="flex items-center space-x-2 mt-1"
            >
              <div
                className={`flex items-center border hover:border-purple-600
                    ${
                      isOnFocus
                        ? "border-purple-700 shadow-[0_0_0_2px_rgba(147,51,234,0.35)]"
                        : ""
                    }
                    transition-all duration-300 border-gray-600 w-full h-9 px-2 rounded-sm`}
              >
                <span className="icon-[iconamoon--search] w-4.5 h-4.5 mr-2 block"></span>
                <input
                  type="text"
                  value={indexedTerm}
                  onInput={(e) => setIndexTerm(e.currentTarget.value)}
                  onFocus={() => setFocus(true)}
                  onBlur={() => setFocus(false)}
                  placeholder="Search..."
                  className="w-full text-sm bg-transparent focus:outline-none leading-none"
                />
              </div>
            </div>

            <div className="mt-3 text-base overflow-y-auto flex-1 max-h-96">
              <div className="grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-4 mt-1.5">
                {isTopVisible && (
                  <>
                    <button
                      onClick={() => console.log("Hello!")}
                      className="cursor-pointer"
                    >
                      <div className="relative flex bg-linear-to-b from-purple-700 to-purple-500 duration-300 transition-all p-9 rounded-lg justify-center items-center space-x-2 overflow-hidden group">
                        <img
                          src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjE5am1wYzlrMmNxZTB2MTZjaGx6aW9xNW9tYmRjbGNoc29xbXRpMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/lC2dZUZzxLuoc5yHqv/giphy.gif"
                          alt="Top-Suggested"
                          className="absolute inset-0 w-full h-full object-cover opacity-50"
                        />

                        <span className="relative flex items-center gap-1 z-10">
                          <span className="icon-[ic--round-star] text-2xl text-white shrink-0 leading-none"></span>
                          <span className="font-medium select-none text-white leading-none">
                            Suggested
                          </span>
                        </span>
                      </div>
                    </button>

                    <button
                      onClick={() => console.log("Hello!")}
                      className="cursor-pointer"
                    >
                      <div className="relative flex bg-linear-to-b from-pink-700 to-pink-500 duration-300 transition-all p-9 rounded-lg justify-center items-center space-x-2 overflow-hidden group">
                        <img
                          src="https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3NnZpNGR4ZTR2ZDVqd2YxMHBidnVlaGd0OWE4cHB0Z3AzZTBoYjg3cSZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/D8qJlXpO3MVccXZ9mA/giphy.gif"
                          alt="Top-Suggested"
                          className="absolute inset-0 w-full h-full object-cover opacity-50 transition-opacity duration-300"
                        />

                        <span className="relative flex items-center z-10">
                          <span className="icon-[mdi--fire] text-2xl text-white"></span>
                          <span className="font-medium select-none text-white">
                            Trending
                          </span>
                        </span>
                      </div>
                    </button>
                  </>
                )}

                {displayedCategories.map(
                  ({ label, imgAlt, gifUrl, gifs }, index) => (
                    <>
                      {categoriesVisible && (
                        <button
                          onClick={() => selectCategory(label)}
                          className="cursor-pointer"
                        >
                          <div className="relative flex p-9 rounded-lg justify-center items-center space-x-2 overflow-hidden group">
                            <img
                              key={index}
                              src={gifUrl}
                              alt={imgAlt}
                              className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity duration-300"
                            />

                            <span className="relative flex items-center space-x-2 z-10">
                              <span className="font-medium select-none text-white">
                                {label}
                              </span>
                            </span>
                          </div>
                        </button>
                      )}

                      {selectedCategory === label &&
                        gifs.map(({ imgAlt, gifUrl }, index) => (
                          <motion.button
                            animate={{ opacity: isVisible ? 1 : 0 }}
                            initial={{ opacity: 0 }}
                            transition={{ duration: isVisible ? 0.2 : 0.4 }}
                            key={index}
                            onClick={() => console.log("gif!")}
                            className="cursor-pointer"
                          >
                            <div className="relative flex p-9 rounded-lg justify-center items-center space-x-2 overflow-hidden group">
                              <img
                                src={gifUrl}
                                alt={imgAlt}
                                className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity duration-300"
                              />
                            </div>
                          </motion.button>
                        ))}
                    </>
                  ),
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
