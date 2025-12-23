export default function AchievementsList({ achievements, profileColor }) {
  return (
    <div className="flex flex-col space-y-3 mx-auto w-full sm:w-3/4 lg:w-3/4 xl:w-1/2">
      {achievements.map((achievement) => (
        <div
          key={achievement.name}
          className={`flex darkerBackgroundColor items-start gap-3 p-3 border border-gray-800 rounded-lg hover:border-${profileColor}-500/50 hover:bg-${profileColor}-500/5 transition-all duration-300`}
        >
          <div
            className={`p-2 bg-${profileColor}-500/10 rounded-lg border border-${profileColor}-500/20 text-${profileColor}-400 shrink-0`}
          >
            {achievement.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="dark:text-gray-100 text-black text-sm">
              {achievement.name}
            </h3>
            <p className="text-gray-500 text-xs mt-0.5">
              {achievement.description}
            </p>
            <p className="text-gray-600 text-xs mt-1">{achievement.date}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
