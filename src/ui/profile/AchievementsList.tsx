const colorsMap = {
  blue: {
    borderColor: "border-blue-500/50",
    hoverBorderColor: "hover:!border-blue-500/30",
    backgroundColor: "bg-blue-500/10",
    hoverBackgroundColor: "hover:!bg-blue-500/5",
    borderColor20: "border-blue-500/20",
    textColor: "text-blue-400",
  },
  red: {
    borderColor: "border-red-500/50",
    hoverBorderColor: "hover:!border-red-500/30",
    backgroundColor: "bg-red-500/10",
    hoverBackgroundColor: "hover:!bg-red-500/5",
    borderColor20: "border-red-500/20",
    textColor: "text-red-400",
  },
  green: {
    borderColor: "border-green-500/50",
    hoverBorderColor: "hover:!border-green-500/30",
    backgroundColor: "bg-green-500/10",
    hoverBackgroundColor: "hover:!bg-green-500/5",
    borderColor20: "border-green-500/20",
    textColor: "text-green-400",
  },
  purple: {
    borderColor: "border-purple-500/50",
    hoverBorderColor: "hover:!border-purple-500/30",
    backgroundColor: "bg-purple-500/10",
    hoverBackgroundColor: "hover:!bg-purple-500/5",
    borderColor20: "border-purple-500/20",
    textColor: "text-purple-400",
  },
  yellow: {
    borderColor: "border-yellow-500/50",
    hoverBorderColor: "hover:!border-yellow-500/30",
    backgroundColor: "bg-yellow-500/10",
    hoverBackgroundColor: "hover:!bg-yellow-500/5",
    borderColor20: "border-yellow-500/20",
    textColor: "text-yellow-400",
  },
  pink: {
    borderColor: "border-pink-500/50",
    hoverBorderColor: "hover:!border-pink-500/30",
    backgroundColor: "bg-pink-500/10",
    hoverBackgroundColor: "hover:!bg-pink-500/5",
    borderColor20: "border-pink-500/20",
    textColor: "text-pink-400",
  },
  indigo: {
    borderColor: "border-indigo-500/50",
    hoverBorderColor: "hover:!border-indigo-500/30",
    backgroundColor: "bg-indigo-500/10",
    hoverBackgroundColor: "hover:!bg-indigo-500/5",
    borderColor20: "border-indigo-500/20",
    textColor: "text-indigo-400",
  },
  gray: {
    borderColor: "border-gray-500/50",
    hoverBorderColor: "hover:!border-gray-500/30",
    backgroundColor: "bg-gray-500/10",
    hoverBackgroundColor: "hover:!bg-gray-500/5",
    borderColor20: "border-gray-500/20",
    textColor: "text-gray-400",
  },
};

export default function AchievementsList({ achievements, profileColor }) {
  return (
    <div className="flex flex-col space-y-3 mx-auto w-full sm:w-3/4 lg:w-3/4 xl:w-1/2">
      {achievements.map((achievement) => (
        <div
          key={achievement.name}
          className={`flex darkerBackgroundColor items-start gap-3 p-3 border border-gray-800 rounded-lg ${colorsMap[profileColor].hoverBorderColor} ${colorsMap[profileColor].hoverBackgroundColor} transition-all duration-300`}
        >
          <div
            className={`p-2 ${colorsMap[profileColor].backgroundColor} rounded-lg border ${colorsMap[profileColor].borderColor} ${colorsMap[profileColor].textColor} shrink-0`}
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
