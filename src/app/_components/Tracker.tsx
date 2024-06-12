"use client";
import React from "react";

interface TrackerProps {
  hintCount: number;
  setHintCount: React.Dispatch<React.SetStateAction<number>>;
  setHintsUsed: React.Dispatch<React.SetStateAction<number>>;
  wordsFound: number;
  setShowHint: React.Dispatch<React.SetStateAction<boolean>>;
  setShowCompletionPopup: React.Dispatch<React.SetStateAction<boolean>>;
  setStr: React.Dispatch<React.SetStateAction<string>>;
}

const Tracker: React.FC<TrackerProps> = ({
  hintCount,
  setHintCount,
  setHintsUsed,
  wordsFound,
  setShowHint,
  setShowCompletionPopup,
  setStr,
}) => {
  return (
    <div className="lg:space-y-8">
      <div className="md:items:begin content-center overflow-hidden rounded-lg shadow-lg">
        <div className="bg-[#aedfee] p-4">
          <h2 className="text-center text-sm font-semibold text-black">
            TODAY&apos;S THEME
          </h2>
        </div>
        <div className="bg-white p-4">
          <p className="text-center text-xl font-bold text-black">
            Do you recall?
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center gap-6 pt-2 lg:flex lg:flex-col lg:items-center lg:justify-center lg:gap-6">
        <div className="xs:order-2">
          <h1 className="xs:text-end lg:text-center lg:text-2xl lg:text-black">
            <strong>{wordsFound}</strong> of <strong>8</strong> theme words
            found.
          </h1>
        </div>
        <div className="xs:text-start xs:w-1/5 xs:order-1 lg:mx-auto lg:w-2/5 lg:max-w-md lg:text-center">
          <button
            onClick={() => {
              if (wordsFound === 8) {
                setShowCompletionPopup(true);
              } else {
                setHintCount(hintCount - 3);
                setHintsUsed((hintsUsed) => hintsUsed + 1);
                setStr((prevStr) => prevStr + "💡");
                setShowHint(true);
              }
            }}
            disabled={hintCount < 3 && wordsFound < 8}
            className={`xs:w-full w-2/5 rounded-full py-2 text-lg font-semibold ${
              wordsFound === 8
                ? "xs:text-xs border-2 border-black text-black"
                : hintCount < 3
                  ? "border-2 border-[#cfcfcf] text-[#cfcfcf]"
                  : "text-white"
            }`}
            style={{
              backgroundImage:
                wordsFound !== 8
                  ? `linear-gradient(to right, #000000 ${(hintCount / 3) * 100}%, #ffffff ${(hintCount / 3) * 100}%)`
                  : undefined,
            }}
          >
            {wordsFound === 8 ? "View Results" : "Hint"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tracker;
