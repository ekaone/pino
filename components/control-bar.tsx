import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

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
  <>
    {/* First row of controls */}
    <div className="flex flex-wrap justify-between items-center w-full">
      <div className="flex items-center mr-5 mb-1">
        <span className="text-white mr-2.5">Octave:</span>
        <Select
          value={currentOctave.toString()}
          onValueChange={(value) => setCurrentOctave(Number.parseInt(value))}
        >
          <SelectTrigger className="w-[100px] bg-[#555] text-white border-none">
            <SelectValue placeholder="Octave 4" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5, 6, 7].map((octave) => (
              <SelectItem key={octave} value={octave.toString()}>
                Octave {octave}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center mr-5 mb-1">
        <span className="text-white mr-2.5">Sound Type:</span>
        <Select value={waveType} onValueChange={setWaveType}>
          <SelectTrigger className="w-[100px] bg-[#555] text-white border-none">
            <SelectValue placeholder="Sine" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sine">Sine</SelectItem>
            <SelectItem value="square">Square</SelectItem>
            <SelectItem value="sawtooth">Sawtooth</SelectItem>
            <SelectItem value="triangle">Triangle</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center mb-1">
        <span className="text-white mr-2.5">Note Labels:</span>
        <button
          className={`relative inline-flex h-6 w-12 items-center rounded-full ${
            showLabels ? "bg-[#4a90e2]" : "bg-[#555]"
          }`}
          onClick={() => setShowLabels(!showLabels)}
        >
          <span
            className={`absolute h-5 w-5 transform rounded-full bg-white transition-transform ${
              showLabels ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    </div>

    {/* Second row of controls */}
    <div className="flex flex-wrap justify-between items-center w-full">
      <div className="flex items-center mr-5 mb-1">
        <span className="text-white mr-2.5">Volume:</span>
        <div className="flex items-center">
          <Slider
            value={[volume]}
            min={0}
            max={100}
            step={1}
            className="w-[100px] mx-2.5"
            onValueChange={(value) => setVolume(value[0])}
          />
          <span className="text-white w-[30px] text-center">
            {volume}%
          </span>
        </div>
      </div>

      <div className="flex items-center mr-5 mb-1">
        <span className="text-white mr-2.5">Sustain:</span>
        <div className="flex items-center">
          <Slider
            value={[sustain]}
            min={10}
            max={200}
            step={1}
            className="w-[100px] mx-2.5"
            onValueChange={(value) => setSustain(value[0])}
          />
          <span className="text-white w-[30px] text-center">
            {(sustain / 100).toFixed(1)}s
          </span>
        </div>
      </div>

      <div className="flex items-center mb-1">
        <Button
          onClick={handleRecordToggle}
          className={`${
            isRecording ? "bg-[#e74c3c]" : "bg-[#4a90e2]"
          } text-white font-bold`}
        >
          {isRecording ? "Stop" : "Record"}
        </Button>
        <Button
          onClick={playRecording}
          disabled={
            recordedNotes.length === 0 || isPlaying || isRecording
          }
          className="ml-2.5 bg-[#4a90e2] text-white font-bold disabled:opacity-50"
        >
          Play
        </Button>
      </div>
    </div>

    {/* Status display */}
    <div className="flex flex-wrap justify-between items-center w-full">
      <div className="bg-[#4a90e2] text-white px-3 py-2 rounded font-bold">
        Octave {currentOctave}
      </div>
      <div className="bg-[#4a90e2] text-white px-3 py-2 rounded font-bold">
        {currentNote}
      </div>
    </div>
  </>
);

export default ControlBar;