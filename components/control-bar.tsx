import React from "react";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";

const neonBlue = "#00ffe7";
const neonYellow = "#ffe600";
const neonOrange = "#ffb300";
const darkBg = "#16181c";

interface ControlBarProps {
  currentOctave: number;
  setCurrentOctave: (octave: number) => void;
  waveType: string;
  setWaveType: (type: string) => void;
  showLabels: boolean;
  setShowLabels: (show: boolean) => void;
  volume: number;
  setVolume: (volume: number) => void;
  sustain: number;
  setSustain: (sustain: number) => void;
  isRecording: boolean;
  isPlaying: boolean;
  handleRecordToggle: () => void;
  playRecording: () => void;
  recordedNotes: any[];
  currentNote: string;
}

const waveTypes = ["sine", "square", "sawtooth", "triangle"];

const LevelBar = ({ value, color }: { value: number; color: string }) => {
  // Single vertical bar, 12 segments
  const bars = 12;
  const active = Math.round((value / 100) * bars);
  return (
    <div className="flex flex-col justify-end h-32 w-3 mr-2">
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className="mb-0.5 rounded"
          style={{
            height: 6,
            background: i < active ? color : "#222",
            boxShadow: i < active ? `0 0 6px 1px ${color}` : "none",
            transition: "background 0.2s",
          }}
          animate={{
            opacity: i < active ? 1 : 0.5,
            scaleX: i < active ? 1.08 : 1,
          }}
          transition={{ duration: 0.15 }}
        />
      ))}
    </div>
  );
};

const WaveButton = ({
  label,
  active,
  onClick,
  color,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  color: string;
}) => (
  <button
    className={`px-4 py-2 mx-1 rounded font-bold text-xs transition-all w-[100px] ${
      active ? "" : "opacity-60"
    }`}
    style={{
      background: active ? color : "#23242a",
      color: active ? darkBg : color,
      border: active ? `2px solid ${color}` : "2px solid #23242a",
      boxShadow: active ? `0 0 8px 1px ${color}77` : "none",
    }}
    onClick={onClick}
  >
    {label.charAt(0).toUpperCase() + label.slice(1)}
  </button>
);

const NoteIndicator = ({ note }: { note: string }) => (
  <div
    className="w-30 h-10 rounded-lg flex items-center justify-center mx-1 shadow-lg"
    style={{
      background: "#21232a",
      border: "2px solid #00ffe7",
      color: "#00ffe7",
      fontWeight: 700,
      fontSize: "1.1rem",
      textShadow: "0 0 6px #00ffe7, 0 0 2px #fff",
    }}
  >
    {note}
  </div>
);

const ShowNotesSwitch = ({
  show,
  setShow,
}: {
  show: boolean;
  setShow: (v: boolean) => void;
}) => (
  <div className="flex items-center mb-4">
    <span className="mr-2 text-xs text-gray-400 font-semibold">Show Notes</span>
    <button
      className={`relative inline-flex h-6 w-12 items-center rounded-full border-2 transition-colors duration-200 ${
        show ? "bg-[#00ffe7] border-[#00ffe7]" : "bg-[#222] border-[#555]"
      }`}
      onClick={() => setShow(!show)}
      aria-label="Toggle notes visibility"
    >
      <span
        className={`absolute h-5 w-5 transform rounded-full bg-white transition-transform shadow-lg ${
          show ? "translate-x-6" : "translate-x-1"
        }`}
        style={{ boxShadow: show ? "0 0 10px 2px #00ffe7" : "0 0 6px #555" }}
      />
    </button>
  </div>
);

const ControlBar: React.FC<ControlBarProps> = ({
  currentOctave,
  setCurrentOctave,
  waveType,
  setWaveType,
  showLabels,
  setShowLabels,
  volume,
  setVolume,
  sustain,
  setSustain,
  isRecording,
  isPlaying,
  handleRecordToggle,
  playRecording,
  recordedNotes,
  currentNote,
}) => (
  <div className="w-full rounded-2xl p-6 shadow-2xl bg-[#16181c] border-2 border-[#23242a]">
    {/* Waveform buttons */}
    <div className="flex justify-center mb-4">
      {waveTypes.map((w, i) => (
        <WaveButton
          key={w}
          label={w}
          active={waveType === w}
          onClick={() => setWaveType(w)}
          color={[neonBlue, neonOrange, neonYellow, "#a0f"][i % 4]}
        />
      ))}
    </div>

    {/* Show Notes Switch */}
    <div className="flex justify-center">
      <ShowNotesSwitch show={showLabels} setShow={setShowLabels} />
    </div>

    {/* Note Indicator(s) */}
    {showLabels && (
      <div className="flex justify-center mb-2">
        {currentNote && <NoteIndicator note={currentNote} />}
      </div>
    )}

    {/* Main layout - Sliders and Bars */}
    <div className="flex flex-row justify-center items-end w-full mt-4 mb-4 gap-4">
      {/* Left: Sustain */}
      <div className="flex flex-col items-center" style={{ minWidth: 60 }}>
        <div className="flex flex-row items-end space-x-6">
          <Slider
            value={[sustain]}
            min={10}
            max={200}
            step={1}
            orientation="vertical"
            className="h-32 w-4 bg-gradient-to-b from-[#23242a] to-[#101018] cursor-pointer rounded-lg shadow-inner border border-[#222] custom-slider-thumb-sustain"
            onValueChange={([v]: number[]) => setSustain(v)}
          />
          <LevelBar
            value={Math.round(((sustain - 10) / 190) * 100)}
            color={neonBlue}
          />
        </div>
        <span className="text-xs mt-2 font-bold" style={{ color: neonBlue }}>
          Sustain
        </span>
        <span className="text-xs mt-1" style={{ color: neonBlue }}>
          {(sustain / 100).toFixed(1)}s
        </span>
      </div>

      {/* Center: Volume */}
      <div className="flex flex-col items-center">
        <div className="flex flex-row items-end space-x-6">
          <Slider
            value={[volume]}
            min={0}
            max={100}
            step={1}
            orientation="vertical"
            className="h-32 w-4 bg-gradient-to-b from-[#23242a] to-[#101018] cursor-pointer rounded-lg shadow-inner border border-[#222] custom-slider-thumb-volume"
            onValueChange={([v]: number[]) => setVolume(v)}
          />
          <LevelBar value={volume} color={neonYellow} />
        </div>
        <span className="text-xs mt-2 font-bold" style={{ color: neonYellow }}>
          Volume
        </span>
        <span className="text-xs mt-1" style={{ color: neonYellow }}>
          {volume}%
        </span>
      </div>

      {/* Right: Octave */}
      <div className="flex flex-col items-center" style={{ minWidth: 60 }}>
        <div className="flex flex-row items-end space-x-6">
          <Slider
            value={[currentOctave]}
            min={1}
            max={7}
            step={1}
            orientation="vertical"
            className="h-32 w-4 bg-gradient-to-b from-[#23242a] to-[#101018] cursor-pointer rounded-lg shadow-inner border border-[#222] custom-slider-thumb-octave"
            onValueChange={([v]: number[]) => setCurrentOctave(v)}
          />
          <LevelBar
            value={Math.round(((currentOctave - 1) / 6) * 100)}
            color={neonOrange}
          />
        </div>
        <span className="text-xs mt-2 font-bold" style={{ color: neonOrange }}>
          Octave
        </span>
        <span className="text-xs mt-1" style={{ color: neonOrange }}>
          #{currentOctave}
        </span>
      </div>
    </div>

    {/* Record & Play Buttons */}
    <div className="flex justify-center gap-6 mt-2 mb-1">
      <button
        onClick={handleRecordToggle}
        className={`rounded-full px-7 py-2 font-bold text-lg shadow-lg transition-all duration-150 ${
          isRecording
            ? "bg-[#ffb300] text-[#16181c]"
            : "bg-[#00ffe7] text-[#16181c]"
        } hover:scale-105`}
        style={{
          boxShadow: isRecording
            ? "0 0 16px 2px #ffb300"
            : "0 0 16px 2px #00ffe7",
        }}
      >
        {isRecording ? "■ Stop" : "● Record"}
      </button>
      <button
        onClick={playRecording}
        disabled={recordedNotes.length === 0 || isPlaying || isRecording}
        className={`rounded-full px-7 py-2 font-bold text-lg shadow-lg transition-all duration-150 bg-[#ffe600] text-[#16181c] disabled:opacity-50 hover:scale-105`}
        style={{
          boxShadow: "0 0 16px 2px #ffe600",
        }}
      >
        ▶ Play
      </button>
    </div>
  </div>
);

// Add the following CSS styles somewhere in your global CSS or Tailwind config:
// .custom-slider-thumb-octave .slider-thumb { background: #ffe600; box-shadow: 0 2px 8px #ffe60099, 0 0 0 2px #fff2; border: 2px solid #fff4; }
// .custom-slider-thumb-sustain .slider-thumb { background: #00ffe7; box-shadow: 0 2px 8px #00ffe799, 0 0 0 2px #fff2; border: 2px solid #fff4; }
// .custom-slider-thumb-volume .slider-thumb { background: #ffb300; box-shadow: 0 2px 8px #ffb30099, 0 0 0 2px #fff2; border: 2px solid #fff4; }

export default ControlBar;
