export default function BadgesList({ badges, profileColor }) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {badges.map((badge) => (
        <span
          key={badge.name}
          className={`bg-${profileColor}-500/20 text-${profileColor}-300 px-2 py-0.5 rounded-full text-xs border border-${profileColor}-500/30`}
          title={badge.name}
        >
          {badge.name}
        </span>
      ))}
    </div>
  );
}
