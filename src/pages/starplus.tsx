import PageTitle from "@/ui/others/PageTitle";

import Tooltip from "@/ui/Tooltip";
import { useNavigate } from "react-router-dom";

const StarPlus = () => {
  const navigate = useNavigate();

  function toggleBack() {
    if (window.history.length > 1) {
      const previousUrl = document.referrer;
      if (previousUrl.startsWith(window.location.origin)) {
        navigate(-1);
      } else {
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }

  return (
    <>
      <PageTitle title={`NetVerses ~ StarPlus`} />
      <div
        className={`flex flex-col gap-3 justify-center items-center w-full h-full pt-24 bg-fixed bg-cover bg-center`}
      >
        <div className="relative flex border borderColor flex-col p-4 sm:pl-5 sm:py-4 rounded-md mx-4 sm:mx-0 w-full sm:w-3/4 lg:w-3/4 xl:w-1/2 darkerBackgroundColor">
          <div className="flex flex-row justify-between items-center">
            <Tooltip label={"Back"}>
              <button
                aria-label="Go Back"
                onClick={toggleBack}
                className="w-5 h-5"
              >
                <span className="icon-[eva--arrow-back-outline] w-5 h-5"></span>
              </button>
            </Tooltip>
            <span className="font-medium text-lg jost">StarPlus</span>
          </div>
        </div>
        <div className="flex flex-col gap-3 mt-4"></div>
      </div>
    </>
  );
};

export default StarPlus;
