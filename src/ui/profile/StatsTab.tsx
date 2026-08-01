import { useNavigate } from "react-router-dom";
import formatNumber from "@/utils/formatNumber";

export default function StatsTab({
  followers,
  username,
  connections,
  posts,
  self,
  following,
}) {
  const navigate = useNavigate();
  const stats = [
    {
      label: "Followers",
      count: followers,
      link: self ? "/my/followers" : `/${username}/followers`,
    },
    {
      label: "Following",
      count: following,
      link: self ? "/my/following" : `/${username}/following`,
    },
    {
      label: "Connections",
      count: connections,
      link: self ? "/my/connections" : `/${username}/connections`,
    },
    {
      label: "Posts",
      count: posts,
      link: "",
    },
  ];

  return (
    <div className="flex items-center space-x-4 md:space-x-6">
      {stats.map(({ label, count, link }) => (
        <div key={label} className="flex items-baseline space-x-1">
          <button
            onClick={() => {
              navigate(link);
            }}
            className="font-semibold text-black dark:text-white text-sm md:text-base transition-transform duration-150 hover:scale-105 hover:underline"
          >
            {formatNumber(count)}
          </button>
          <span className="text-neutral-500 select-none dark:text-neutral-400 text-sm md:text-base lato">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
