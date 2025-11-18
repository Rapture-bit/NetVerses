import { Link, useNavigate } from "react-router-dom";

interface ChannelsProps {
  name: string;
  genres: string[];
  leading_journalist: string;
  description: string;
  bannerUrl: string;
  bannerAlt: string;
  channelId: string;
}

export default function ChannelCard({
  name,
  genres,
  leading_journalist,
  description,
  bannerUrl,
  bannerAlt = "Banner",
  channelId,
}: ChannelsProps) {
  const navigate = useNavigate();

  return (
    <Link
      to={`/channels/${channelId}`}
      className="flex flex-shrink-0 hover:bg-black/5 cursor-pointer transition-all sm:w-[48%] md:w-[40%] lg:w-[35%] flex-col gap-0 w-[35%] rounded-xl border border-neutral-700 darkerBackgroundColor shadow-md hover:shadow-lg duration-300 overflow-hidden"
    >
      <div className="w-full h-40 relative">
        <img
          src={bannerUrl}
          alt={bannerAlt}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40"></div>
        <span className="absolute bottom-0 left-0 w-full text-white p-2 z-10 bg-gradient-to-t from-black/70 to-transparent font-semibold">
          {name}
        </span>
      </div>

      <div className="p-3 flex flex-col gap-2">
        {genres?.length > 0 && (
          <span className="self-start w-fit inline-block leading-none text-xs text-purple-600 hover:text-purple-700 hover:underline">
            {genres.join(" · ")}
          </span>
        )}

        {description && (
          <p className="text-sm text-neutral-200 line-clamp-2">{description}</p>
        )}

        {leading_journalist && (
          <div className="text-xs text-neutral-500 italic">
            By{" "}
            <span className="text-purple-600 hover:underline">
              {leading_journalist}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
