import formatNumber from "@/utils/formatNumber";

export default function StatsTab({
  followers,
  username,
  reputation,
  self,
  following,
}) {
  return (
    <div className="flex justify-between md:justify-start md:gap-10 text-center">
      {[
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
          label: "Reputation",
          count: reputation,
          link: self ? "/my/reputation" : `/${username}/reputation`,
        },
      ].map(({ label, count, link }) => (
        <div key={label} className="flex flex-row space-x-1 items-center">
          <a
            href={link}
            className="text-base font-bold text-black dark:text-white hover:underline"
          >
            {formatNumber(count)}
          </a>
          <span className="text-base text-neutral-700 dark:text-neutral-400">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
