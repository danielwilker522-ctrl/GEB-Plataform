type Stat = {
  label: string;
  value: number | string;
  sub?: string;
  color?: "gold" | "vine" | "clay" | "default";
};

export default function StatsCards({ stats }: { stats: Stat[] }) {
  const colorMap = {
    gold: "border-l-gold text-gold-deep",
    vine: "border-l-vine text-vine",
    clay: "border-l-clay text-clay",
    default: "border-l-line text-ink",
  };

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`rounded-xl border border-line bg-paper p-5 border-l-4 ${
            colorMap[stat.color ?? "default"]
          }`}
        >
          <p className="text-sm text-ink/55">{stat.label}</p>
          <p className={`mt-1 text-3xl font-semibold ${colorMap[stat.color ?? "default"].split(" ")[1]}`}>
            {stat.value}
          </p>
          {stat.sub && <p className="mt-1 text-xs text-ink/40">{stat.sub}</p>}
        </div>
      ))}
    </div>
  );
}
