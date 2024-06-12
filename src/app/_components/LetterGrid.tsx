"use client";
import React, { useState, useEffect } from "react";
import {
  spangramWord,
  spangram,
  letters,
  ansCoordinates,
  ansWords,
} from "./gameConstants";

interface LetterGridProps {
  setHintCount: React.Dispatch<React.SetStateAction<number>>;
  setWordsFound: React.Dispatch<React.SetStateAction<number>>;
  showHint: boolean;
  setShowHint: React.Dispatch<React.SetStateAction<boolean>>;
  setStr: React.Dispatch<React.SetStateAction<string>>;
}

const LetterGrid: React.FC<LetterGridProps> = ({
  setHintCount,
  setWordsFound,
  showHint,
  setShowHint,
  setStr,
}) => {
  const [selectedLetters, setSelectedLetters] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectBlueIds, setSelectedBlueIds] = useState<string[]>([]);
  const [selectGoldIds, setSelectedGoldIds] = useState<string[]>([]);
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [wordList, setWordList] = useState<string[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);

  const timer = (seconds: number, callback: () => void) => {
    setTimeout(callback, seconds * 1000);
  };

  useEffect(() => {
    if (showHint) {
      setShowHint(false);
      setHintsUsed((hintsUsed) => hintsUsed + 1);
    }
  }, [showHint, setShowHint, setHintsUsed]);

  useEffect(() => {
    if (hintsUsed > 7) {
      setHintsUsed(1);
    }
  }, [hintsUsed, setHintsUsed]);

  useEffect(() => {
    if (selectedLetters.length !== selectedIds.length) {
      console.warn(
        `Data mismatch: ${selectedLetters.length} letters for ${selectedIds.length} IDs`,
      );
      setSelectedLetters("");
      setSelectedIds([]);
    }
  }, [selectedLetters, selectedIds]);

  useEffect(() => {
    fetch("/words.txt")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((text) => {
        setWordList(text.split(/\r?\n/));
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }, []);

  const addSelectedLetters = (
    letter: string,
    rowIndex: number,
    colIndex: number,
  ) => {
    const newId = `${rowIndex}-${colIndex}`;
    const currentLength = selectedLetters.length;

    const isAdjacent = (lastId: string, newId: string): boolean => {
      const [lastRow, lastCol] = lastId.split("-").map(Number);
      const [newRow, newCol] = newId.split("-").map(Number);
      if (
        typeof lastRow === "undefined" ||
        typeof lastCol === "undefined" ||
        typeof newRow === "undefined" ||
        typeof newCol === "undefined"
      ) {
        return false;
      }
      return Math.abs(lastRow - newRow) <= 1 && Math.abs(lastCol - newCol) <= 1;
    };

    const lastSelectedId =
      selectedIds.length > 0 ? selectedIds[selectedIds.length - 1] : null;

    const updateSelections = (reset: boolean) => {
      setSelectedIds(reset ? [newId] : [...selectedIds, newId]);
      setSelectedLetters(
        reset ? letter : (prevLetters) => prevLetters + letter,
      );
    };

    if (!lastSelectedId) {
      updateSelections(true);
    } else if (currentLength < 20 && isAdjacent(lastSelectedId, newId)) {
      updateSelections(false);
    } else {
      updateSelections(true);
    }
  };

  function isArrayEqualUnordered(a: string[], b: string[]): boolean {
    const sortedA = a.slice().sort();
    const sortedB = b.slice().sort();
    return (
      sortedA.length === sortedB.length &&
      sortedA.every((element, index) => element === sortedB[index])
    );
  }

  function checkArrayMatch(
    arrA: string[],
    arrB: string[] | string[][],
  ): boolean {
    if (Array.isArray(arrB[0])) {
      return (arrB as string[][]).some((subArray) => {
        return isArrayEqualUnordered(arrA, subArray);
      });
    } else {
      return isArrayEqualUnordered(arrA, arrB as string[]);
    }
  }

  const checkWordList = () => {
    const currentLength = selectedLetters.length;
    const clearSelectedLetters = (delay: number) => {
      timer(delay, () => {
        setSelectedLetters("");
        setSelectedIds([]);
      });
    };
    if (currentLength <= 3) {
      setSelectedLetters("Too short");
      clearSelectedLetters(1);
    } else if (
      checkArrayMatch(selectedIds, ansCoordinates) &&
      ansWords.includes(selectedLetters)
    ) {
      setWordsFound((wordsFound) => wordsFound + 1);
      setStr((prevStr) => prevStr + "🔵");
      setSelectedBlueIds((prevIds) => [...prevIds, ...selectedIds]);
      clearSelectedLetters(2);
    } else if (
      checkArrayMatch(selectedIds, spangram) &&
      spangramWord === selectedLetters
    ) {
      setSelectedLetters("SPANGRAM!");
      setWordsFound((wordsFound) => wordsFound + 1);
      setStr((prevStr) => prevStr + "🟡");
      setSelectedGoldIds(selectedIds);
      clearSelectedLetters(3);
    } else if (wordList.includes(selectedLetters)) {
      setHintCount((hintCount) => hintCount + 1);
      clearSelectedLetters(1);
    } else {
      setSelectedLetters("NOT IN WORD LIST");
      clearSelectedLetters(1);
    }
  };

  const handleIsSelecting = (
    letter: string,
    rowIndex: number,
    colIndex: number,
  ) => {
    const newId = `${rowIndex}-${colIndex}`;

    // If selected button is blue or gold, it cannot select it again
    if (!selectBlueIds.includes(newId) && !selectGoldIds.includes(newId)) {
      // Enter as word
      if (selectedIds.includes(newId)) {
        checkWordList();
      } else {
        // Add selected words
        setIsSelecting(true);
        addSelectedLetters(letter, rowIndex, colIndex);
      }
    }
  };

  const handleIsDragging = (
    letter: string,
    rowIndex: number,
    colIndex: number,
  ) => {
    const newId = `${rowIndex}-${colIndex}`;

    // If selected button is blue or gold, it cannot select it again
    if (!selectBlueIds.includes(newId) && !selectGoldIds.includes(newId)) {
      // Enter as word
      if (!selectedIds.includes(newId) && isSelecting) {
        addSelectedLetters(letter, rowIndex, colIndex);
      }
    }
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault(); // Prevent scrolling when touching
    const touch = e.touches[0];

    if (touch) {
      const targetElement = document.elementFromPoint(
        touch.clientX,
        touch.clientY,
      ) as HTMLButtonElement;

      if (targetElement && targetElement.tagName === "BUTTON") {
        // Safely access dataset with null checks and default values
        const letter = targetElement.dataset.letter ?? "";
        const rowIndex = targetElement.dataset.rowIndex ?? "0";
        const colIndex = targetElement.dataset.colIndex ?? "0";

        handleIsDragging(letter, parseInt(rowIndex), parseInt(colIndex));
      }
    }
  };

  const handleTouchStart = (
    e: React.TouchEvent<HTMLButtonElement>,
    letter: string,
    rowIndex: number,
    colIndex: number,
  ) => {
    handleIsSelecting(letter, rowIndex, colIndex);
  };

  const handleTouchEnd = () => {
    setIsSelecting(false);
  };

  return (
    <div className="flex flex-col p-5 xs:items-center">
      <div
        className={`mb-5 flex h-12 w-72 items-center justify-center p-2 text-center 
        ${selectedLetters === "NOT IN WORD LIST" ? "text-2xl" : "text-3xl"} 
        font-bold uppercase tracking-wider text-black`}
      >
        {selectedLetters}
      </div>
      <div className="grid grid-cols-6 gap-1" onMouseUp={handleMouseUp}>
        {letters.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {row.map((letter, colIndex) => {
              const letterId = `${rowIndex}-${colIndex}`;
              const isBrownSelected = selectedIds.includes(letterId);
              const isBlueSelected = selectBlueIds.includes(letterId);
              const isGoldSelected = selectGoldIds.includes(letterId);
              const isDashedSelected =
                ansCoordinates[hintsUsed - 1]?.includes(letterId);

              return (
                <button
                  key={colIndex}
                  className={`m-1.25 flex h-10 w-10 items-center justify-center rounded-full 
                  ${
                    isDashedSelected
                      ? "border-2 border-dashed border-[#49a8c6]"
                      : ""
                  } 
                  ${
                    isGoldSelected
                      ? "border-1 border-solid border-[#F8CB2C] bg-[#F8CB2C]"
                      : isBlueSelected
                        ? "border-1 border-solid border-[#AEDFEE] bg-[#AEDFEE]"
                        : isBrownSelected
                          ? "bg-[#DBD8C5]"
                          : "bg-white"
                  } 
                  p-5 text-2xl font-medium text-black transition-colors duration-200`}
                  onMouseDown={() =>
                    handleIsSelecting(letter, rowIndex, colIndex)
                  }
                  onMouseMove={() =>
                    handleIsDragging(letter, rowIndex, colIndex)
                  }
                  onTouchMove={() => handleTouchMove}
                >
                  {letter}
                </button>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default LetterGrid;
