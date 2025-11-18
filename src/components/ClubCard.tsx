import { Link } from "react-router-dom";
import { Tooltip } from "antd";

interface ClubCardProps {
  name: string;
  description: string;
  bannerUrl: string;
  bannerAlt?: string;
  badges: string[];
  members_count: number;
  logoAlt?: string;
  logoUrl: string;
  clubId?: string;
}

export default function ClubCard({
  name,
  description,
  bannerUrl,
  bannerAlt = "Banner",
  logoAlt = "Logo",
  logoUrl,
  badges,
  members_count,
  clubId,
}: ClubCardProps) {
  return (
    <div className="flex flex-shrink-0 sm:w-[48%] md:w-[40%] lg:w-[35%] flex-col gap-0 w-[35%] rounded-xl border border-neutral-700 darkerBackgroundColor shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="w-full h-40 relative">
        <Link to={`/clubs/${clubId}`}>
          <img
            src={bannerUrl}
            alt={bannerAlt}
            className="w-full h-full object-cover"
          />
        </Link>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40"></div>
      </div>

      <div className="flex flex-col p-4 flex-1 justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              to={`/clubs/${clubId}`}
              className="font-semibold text-lg text-black dark:text-white hover:underline truncate"
            >
              {name}
            </Link>

            {badges.map((element, idx) => (
              <span key={idx}>
                {element === "Politics" && (
                  <Tooltip
                    placement="bottom"
                    title="Politics Club"
                    mouseLeaveDelay={0}
                  >
                    <span className="icon-[streamline-flex--politics-speech-remix] cursor-pointer text-black dark:text-white w-4 h-4"></span>
                  </Tooltip>
                )}
                {element === "Community" && (
                  <Tooltip
                    placement="bottom"
                    title="Community"
                    mouseLeaveDelay={0}
                  >
                    <span className="icon-[material-symbols--globe] cursor-pointer text-black dark:text-white w-4 h-4 mt-1"></span>
                  </Tooltip>
                )}
              </span>
            ))}
          </div>

          <p className="text-sm text-neutral-700 dark:text-neutral-400 leading-relaxed">
            {description.length > 150 ? (
              <>
                {description.slice(0, 150)}...
                <Link
                  className="text-purple-700 hover:text-purple-800 hover:underline ml-1"
                  to={`/clubs/${clubId}`}
                >
                  Learn more
                </Link>
              </>
            ) : (
              description
            )}
          </p>

          <div className="flex items-center gap-1 text-xs text-neutral-700 dark:text-neutral-400">
            <span className="font-semibold text-black dark:text-white hover:underline">
              {members_count}
            </span>
            <span>Members</span>
          </div>
        </div>

        <button className="mt-4 bg-violet-800 hover:bg-violet-900 transition-all duration-300 text-white text-sm roboto px-4 py-2 rounded-lg self-start">
          Join Club
        </button>
      </div>
    </div>
  );
}
