export default function ZodiacSign({ sign }) {
  return (
    <>
      {sign === "Aries" && (
        <div className="flex items-center font-semibold text-sm hover:underline cursor-pointer brightness-125 text-red-700 gap-1">
          <span className="icon-[mingcute--aries-line] w-4 h-4"></span>
          <span>Aries</span>
        </div>
      )}

      {sign === "Cancer" && (
        <div className="flex items-center font-semibold text-sm hover:underline cursor-pointer brightness-150 text-neutral-500 gap-1">
          <span className="icon-[mingcute--cancer-line] w-4 h-4"></span>
          <span>Cancer</span>
        </div>
      )}

      {sign === "Taurus" && (
        <div className="flex items-center font-semibold text-sm hover:underline cursor-pointer brightness-125 text-green-500 gap-1">
          <span className="icon-[mingcute--taurus-line] w-4 h-4"></span>
          <span>Taurus</span>
        </div>
      )}

      {sign === "Gemini" && (
        <div className="flex items-center font-semibold text-sm hover:underline cursor-pointer brightness-95 text-yellow-400 gap-1">
          <span className="icon-[mingcute--gemini-line] w-4 h-4"></span>
          <span>Gemini</span>
        </div>
      )}

      {sign === "Leo" && (
        <div className="flex items-center font-semibold text-sm hover:underline cursor-pointer brightness-125 text-orange-400 gap-1">
          <span className="icon-[mingcute--leo-line] w-4 h-4"></span>
          <span>Leo</span>
        </div>
      )}

      {sign === "Virgo" && (
        <div className="flex items-center font-semibold text-sm hover:underline cursor-pointer brightness-150 text-blue-800 gap-1">
          <span className="icon-[mingcute--virgo-line] w-4 h-4"></span>
          <span>Virgo</span>
        </div>
      )}

      {sign === "Libra" && (
        <div className="flex items-center font-semibold text-sm hover:underline cursor-pointer brightness-125 text-pink-400 gap-1">
          <span className="icon-[mingcute--libra-line] w-4 h-4"></span>
          <span>Libra</span>
        </div>
      )}

      {sign === "Scorpio" && (
        <div className="flex items-center font-semibold text-sm hover:underline cursor-pointer brightness-125 text-red-800 gap-1">
          <span className="icon-[mingcute--scorpio-line] w-4 h-4"></span>
          <span>Scorpio</span>
        </div>
      )}

      {sign === "Sagittarius" && (
        <div className="flex items-center font-semibold text-sm hover:underline cursor-pointer brightness-125 text-purple-500 gap-1">
          <span className="icon-[mingcute--sagittarius-line] w-4 h-4"></span>
          <span>Sagittarius</span>
        </div>
      )}

      {sign === "Capricorn" && (
        <div className="flex items-center font-semibold text-sm hover:underline cursor-pointer brightness-150 text-green-900 gap-1">
          <span className="icon-[mingcute--capricorn-line] w-4 h-4"></span>
          <span>Capricorn</span>
        </div>
      )}

      {sign === "Aquarius" && (
        <div className="flex items-center font-semibold text-sm hover:underline cursor-pointer text-blue-400 gap-1">
          <span className="icon-[mingcute--aquarius-line] w-4 h-4"></span>
          <span>Aquarius</span>
        </div>
      )}

      {sign === "Pisces" && (
        <div className="flex items-center font-semibold text-sm hover:underline cursor-pointer brightness-100 text-teal-400 gap-1">
          <span className="icon-[mingcute--pisces-line] w-4 h-4"></span>
          <span>Pisces</span>
        </div>
      )}
    </>
  );
}
