"use client";
import LetterGrid from "../_components/LetterGrid";
import Tracker from "../_components/Tracker";
import React, { useState, useEffect } from "react";

export default function Play() {
  const [hintCount, setHintCount] = useState<number>(0);
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [wordsFound, setWordsFound] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showCompletionPopup, setShowCompletionPopup] =
    useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [str, setStr] = useState<string>("");

  const timer = (seconds: number, callback: () => void) => {
    setTimeout(callback, seconds * 1000);
  };

  useEffect(() => {
    if (wordsFound === 8) {
      timer(1, () => {
        setShowCompletionPopup(true);
      });
    }
  }, [wordsFound]);

  const characters = Array.from(str);
  const strEdited: React.ReactNode[] = characters.reduce(
    (acc: React.ReactNode[], curr: string, index: number) => {
      acc.push(curr);
      if ((index + 1) % 4 === 0 && index + 1 !== characters.length) {
        acc.push(<br key={index} />);
      }
      return acc;
    },
    [],
  );

  const strEdited2 = () => {
    const characters = Array.from(str);
    let result = "";
    for (let i = 0; i < characters.length; i++) {
      result += characters[i];
      if ((i + 1) % 4 === 0 && i + 1 !== characters.length) {
        result += "\n";
      }
    }
    return result;
  };

  const textToCopy = 'Strands #84\n"Deviled eggs anyone?"\n' + strEdited2();
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopySuccess(true);
    } catch (err) {
      setCopySuccess(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center lg:min-h-screen">
      <div className="lg:grid lg:max-w-4xl lg:grid-cols-2 lg:gap-x-24">
        <div className="lg:col-span-1 lg:my-auto">
          <Tracker
            hintCount={hintCount}
            setHintCount={setHintCount}
            setHintsUsed={setHintsUsed}
            wordsFound={wordsFound}
            setShowHint={setShowHint}
            setShowCompletionPopup={setShowCompletionPopup}
            setStr={setStr}
          />
        </div>
        <div className="mt-[-15px] lg:col-span-1 lg:mt-0">
          <LetterGrid
            setHintCount={setHintCount}
            setWordsFound={setWordsFound}
            showHint={showHint}
            setShowHint={setShowHint}
            setStr={setStr}
          />
        </div>
      </div>
      {showCompletionPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full rounded-lg bg-white p-8 text-center shadow-lg md:w-1/2">
            <button
              className="absolute right-3 top-3 text-sm"
              onClick={() => setShowCompletionPopup(false)}
            >
              Back to puzzle ×
            </button>
            <h3 className="mb-4 text-3xl font-bold">
              I love u <br /> DANIEL!
            </h3>
            <p className="text-sm text-[#52524f]">
              Strands #84
              <br />
              &quot; Do you recall? &quot;
            </p>
            <div className="my-4 text-center text-3xl">
              <h1>{strEdited}</h1>
            </div>
            <p className="text-sm">
              Nice job finding the theme words 🔵 and <br />
              Spangram 🟡. You used {hintsUsed} hints 💡.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <button
                onClick={copyToClipboard}
                className="m-auto w-3/4 rounded-full bg-black px-6 py-3 text-lg text-white hover:bg-gray-800 sm:w-1/2"
              >
                {copySuccess ? "Copied!" : "Share Your Results"}
              </button>
              <button
                className="m-auto w-3/4 rounded-full bg-yellow-400 px-6 py-3 text-lg text-black hover:bg-yellow-500 sm:w-1/2"
                onClick={() => setShowCompletionPopup(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
