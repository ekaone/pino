import React from "react";

interface PianoKeysProps {
  showLabels: boolean;
  currentOctave: number;
  handleNotePlay: (note: string, nextOctave?: boolean) => void;
}

const PianoKeys: React.FC<PianoKeysProps> = ({
  showLabels,
  currentOctave,
  handleNotePlay,
}) => {
  const whiteNotes = ["C", "D", "E", "F", "G", "A", "B", "C"];
  const blackNotes = [
    { note: "C#", position: "left-[45px]" },
    { note: "D#", position: "left-[111px]" },
    { note: "F#", position: "left-[243px]" },
    { note: "G#", position: "left-[309px]" },
    { note: "A#", position: "left-[375px]" },
  ];

  return (
    <div className="relative flex bg-black p-2.5 rounded-md shadow-lg">
      {whiteNotes.map((note, index) => (
        <div
          key={`white-${note}-${index}`}
          className="w-[60px] h-[280px] bg-white border border-gray-300 rounded-b-md mx-0.5 cursor-pointer relative z-10 flex items-end justify-center pb-2.5 text-sm text-gray-500 active:bg-gray-100 active:shadow-inner active:translate-y-0.5"
          data-note={note}
          data-next-octave={note === "C" && index === 7 ? "true" : "false"}
          onMouseDown={() => handleNotePlay(note, note === "C" && index === 7)}
        >
          {showLabels &&
            (note === "C" && index === 7
              ? `${note}${currentOctave + 1}`
              : `${note}${currentOctave}`)}
        </div>
      ))}

      {blackNotes.map((item, index) => (
        <div
          key={`black-${item.note}-${index}`}
          className={`w-[40px] h-[160px] bg-black absolute z-20 rounded-b-md cursor-pointer shadow-md flex items-end justify-center pb-2.5 text-xs text-gray-300 active:bg-gray-900 active:shadow-inner active:translate-y-0.5 ${item.position}`}
          data-note={item.note}
          onMouseDown={() => handleNotePlay(item.note)}
        >
          {showLabels && `${item.note}${currentOctave}`}
        </div>
      ))}
    </div>
  );
};

export default PianoKeys;
