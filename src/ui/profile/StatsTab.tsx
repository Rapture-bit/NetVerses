import formatNumber from "@/utils/formatNumber";

export default function StatsTab({
  followers,
  username,
  connections,
  self,
  following,
}) {
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
  ];

  return (
    <div className="flex items-center space-x-4 md:space-x-6">
      {stats.map(({ label, count, link }) => (
        <div key={label} className="flex items-baseline space-x-1">
          <a
            href={link}
            className="font-semibold text-black dark:text-white text-sm md:text-base transition-transform duration-150 hover:scale-105 hover:underline"
          >
            {formatNumber(count)}
          </a>
          <span className="text-neutral-500 dark:text-neutral-400 text-sm md:text-base font-medium">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
