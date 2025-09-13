import React from "react";

interface Achievement {
  icon: string;
  name: string;
  description: string;
}

interface AchievementListProps {
  achievements: Record<string, Achievement>;
}

const AchievementList: React.FC<AchievementListProps> = ({ achievements }) => {
  const achievementsArray = Object.values(achievements);
  const visibleAchievements = achievementsArray.slice(0, 1);

  return (
    <ul>
      {visibleAchievements.map((achievement: Achievement, index) => (
        <li key={index} className="flex items-start space-x-2">
          <div className="flex flex-col">
            <div className="flex flex-row justify-center items-center gap-2">
              <span
                className={`${achievement.icon} text-xl mb-0.5`}
                aria-hidden="true"
              ></span>
              <span className="font-medium dark:text-white">
                {achievement.name}
              </span>
            </div>
            <p className="text-sm dark:text-gray-300 text-gray-500">
              {achievement.description}
            </p>
          </div>
        </li>
      ))}
      {achievementsArray.length > 1 && (
        <li>
          <a
            href="/my/achievements"
            className="text-violet-500 dark:text-violet-500"
          >
            Show more
          </a>
        </li>
      )}
    </ul>
  );
};

export default AchievementList;
