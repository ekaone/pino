"use client";

import { useState, useEffect, useRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

export default function PianoApp() {
  const [currentOctave, setCurrentOctave] = useState(4);
  const [waveType, setWaveType] = useState("sine");
  const [volume, setVolume] = useState(30);
  const [sustain, setSustain] = useState(50);
  const [showLabels, setShowLabels] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedNotes, setRecordedNotes] = useState<any[]>([]);
  const [currentNote, setCurrentNote] = useState("No Note");
  const [isPlaying, setIsPlaying] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const recordStartTimeRef = useRef(0);

  useEffect(() => {
    // Initialize audio context on client side
    audioContextRef.current = new (window.AudioContext ||
      (window as any).webkitAudioContext)();

    // Clean up on unmount
    return () => {
      if (
        audioContextRef.current &&
        audioContextRef.current.state !== "closed"
      ) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Base note frequencies for octave 4
  const baseNotes = {
    C: 261.63,
    "C#": 277.18,
    D: 293.66,
    "D#": 311.13,
    E: 329.63,
    F: 349.23,
    "F#": 369.99,
    G: 392.0,
    "G#": 415.3,
    A: 440.0,
    "A#": 466.16,
    B: 493.88,
  };

  // Calculate frequency for a note in a specific octave
  const getFrequency = (note: string, octave: number) => {
    const baseFreq = baseNotes[note as keyof typeof baseNotes];
    const octaveDiff = octave - 4;
    return baseFreq * Math.pow(2, octaveDiff);
  };

  // Function to play a note
  const playNote = (frequency: number, duration: number) => {
    if (!audioContextRef.current) return;

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    oscillator.type = waveType as OscillatorType;
    oscillator.frequency.value = frequency;

    gainNode.gain.setValueAtTime(
      volume / 100,
      audioContextRef.current.currentTime
    );
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContextRef.current.currentTime + duration
    );

    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    oscillator.start();
    oscillator.stop(audioContextRef.current.currentTime + duration);

    return { oscillator, gainNode };
  };

  const handleNotePlay = (note: string, isNextOctave = false) => {
    const octave = isNextOctave ? currentOctave + 1 : currentOctave;
    const frequency = getFrequency(note, octave);

    playNote(frequency, sustain / 100);
    setCurrentNote(note + octave);

    // Record note if recording
    if (isRecording) {
      const time = (Date.now() - recordStartTimeRef.current) / 1000;
      setRecordedNotes((prev) => [
        ...prev,
        {
          note,
          octave,
          time,
          duration: sustain / 100,
        },
      ]);
    }
  };

  const handleRecordToggle = () => {
    if (!isRecording) {
      // Start recording
      setIsRecording(true);
      setRecordedNotes([]);
      recordStartTimeRef.current = Date.now();
    } else {
      // Stop recording
      setIsRecording(false);
    }
  };

  const playRecording = () => {
    if (recordedNotes.length === 0 || isPlaying) return;

    setIsPlaying(true);

    const lastNoteTime =
      recordedNotes[recordedNotes.length - 1].time +
      recordedNotes[recordedNotes.length - 1].duration;

    // Play each recorded note at the right time
    recordedNotes.forEach((note) => {
      setTimeout(() => {
        const frequency = getFrequency(note.note, note.octave);
        playNote(frequency, note.duration);
        setCurrentNote(note.note + note.octave);

        // Find and animate the corresponding key
        const isNextOctave = note.octave > currentOctave;
        const keySelector = isNextOctave
          ? `[data-note="${note.note}"][data-next-octave="true"]`
          : `[data-note="${note.note}"]${
              note.note.includes("#") ? ".bg-black" : ".bg-white"
            }`;

        const keyElement = document.querySelector(keySelector);
        if (keyElement) {
          // Add active class to simulate pressing
          if (note.note.includes("#")) {
            keyElement.classList.add(
              "bg-gray-900",
              "shadow-inner",
              "translate-y-0.5"
            );
          } else {
            keyElement.classList.add(
              "bg-gray-100",
              "shadow-inner",
              "translate-y-0.5"
            );
          }

          // Remove active class after the note duration
          setTimeout(() => {
            if (note.note.includes("#")) {
              keyElement.classList.remove(
                "bg-gray-900",
                "shadow-inner",
                "translate-y-0.5"
              );
            } else {
              keyElement.classList.remove(
                "bg-gray-100",
                "shadow-inner",
                "translate-y-0.5"
              );
            }
          }, note.duration * 1000);
        }
      }, note.time * 1000);
    });

    // Reset after playback
    setTimeout(() => {
      setIsPlaying(false);
      setCurrentNote("No Note");
    }, lastNoteTime * 1000 + 100);
  };

  // Generate piano keys
  const renderPianoKeys = () => {
    const whiteNotes = ["C", "D", "E", "F", "G", "A", "B", "C"];
    const blackNotes = [
      { note: "C#", position: "left-[45px]" },
      { note: "D#", position: "left-[111px]" },
      { note: "F#", position: "left-[243px]" },
      { note: "G#", position: "left-[309px]" },
      { note: "A#", position: "left-[375px]" },
    ];

    return (
      <div className="relative flex bg-black p-2.5 rounded-b-md shadow-lg">
        {whiteNotes.map((note, index) => (
          <div
            key={`white-${note}-${index}`}
            className="w-[60px] h-[280px] bg-white border border-gray-300 rounded-b-md mx-0.5 cursor-pointer relative z-10 flex items-end justify-center pb-2.5 text-sm text-gray-500 active:bg-gray-100 active:shadow-inner active:translate-y-0.5"
            data-note={note}
            data-next-octave={note === "C" && index === 7 ? "true" : "false"}
            onMouseDown={() =>
              handleNotePlay(note, note === "C" && index === 7)
            }
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-[900px] flex flex-col items-center">
        <div className="bg-[#333] p-4 rounded-t-md w-full flex flex-col gap-2.5 shadow-md">
          {/* First row of controls */}
          <div className="flex flex-wrap justify-between items-center w-full">
            <div className="flex items-center mr-5 mb-1">
              <span className="text-white mr-2.5">Octave:</span>
              <Select
                value={currentOctave.toString()}
                onValueChange={(value) =>
                  setCurrentOctave(Number.parseInt(value))
                }
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
        </div>

        {/* Piano keys */}
        {renderPianoKeys()}
      </div>

      <div className="mt-5 text-center text-gray-600">
        Click on the keys to play notes. Customize your piano experience using
        the control bar.
      </div>
    </div>
  );
}
