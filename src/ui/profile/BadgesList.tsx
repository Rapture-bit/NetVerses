const colorClasses = {
  blue: {
    bg: "bg-blue-500/20",
    text: "text-blue-300",
    border: "border-blue-500/30",
  },
  red: {
    bg: "bg-red-500/20",
    text: "text-red-300",
    border: "border-red-500/30",
  },
  green: {
    bg: "bg-green-500/20",
    text: "text-green-300",
    border: "border-green-500/30",
  },
  purple: {
    bg: "bg-purple-500/20",
    text: "text-purple-300",
    border: "border-purple-500/30",
  },
  yellow: {
    bg: "bg-yellow-500/20",
    text: "text-yellow-300",
    border: "border-yellow-500/30",
  },
  orange: {
    bg: "bg-orange-500/20",
    text: "text-orange-300",
    border: "border-orange-500/30",
  },
  pink: {
    bg: "bg-pink-500/20",
    text: "text-pink-300",
    border: "border-pink-500/30",
  },
  indigo: {
    bg: "bg-indigo-500/20",
    text: "text-indigo-300",
    border: "border-indigo-500/30",
  },
  teal: {
    bg: "bg-teal-500/20",
    text: "text-teal-300",
    border: "border-teal-500/30",
  },
  gray: {
    bg: "bg-gray-500/20",
    text: "text-gray-300",
    border: "border-gray-500/30",
  },
};

export default function BadgesList({ badges, profileColor }) {
  const classes = colorClasses[profileColor] || colorClasses.blue;

  return (
    <div className="flex gap-1.5 flex-wrap">
      {badges.map((badge) => (
        <span
          key={badge.name}
          className={`${classes.bg} ${classes.text} px-2 py-0.5 rounded-full text-xs border ${classes.border}`}
          title={badge.name}
        >
          {badge.name}
        </span>
      ))}
    </div>
  );
}
