import PageTitle from "@/ui/others/PageTitle";

const ConnectAccount = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <PageTitle title="NetVerses ~ Connect Account" />
      <div className="flex-grow pt-20 md:pt-24 pb-20 md:pb-24 flex flex-col items-center justify-center text-center space-y-4 md:space-y-5 px-4 md:px-10">
        <div className="flex flex-col items-center justify-center text-center space-y-4 md:space-y-5 px-4 md:px-10">
          <button>
            <span className="bg-gradient-to-b p-2 hover:underline from-purple-500 to-purple-900 text-transparent bg-clip-text font-bold text-3xl md:text-5xl">
              Link Account
            </span>
          </button>
          <p className="text-gray-500 text-sm md:text-base max-w-md">
            Link your existing social media platform from another device to
            NetVerses. By linking your account, you can access your personalized
            content, preferences, and settings across all your devices.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConnectAccount;
