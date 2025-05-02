"use client";

import { useState, useEffect, useRef } from "react";
import { baseNotes } from "@/data/note-frequencies";
import PianoKeys from "@/components/piano-keys";
import ControlBar from "@/components/control-bar";
import { Particles } from "@/components/magicui/particles";

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
  const [color] = useState("#ffffff");

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

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-[900px] flex flex-col items-center space-y-2.5">
          <div className="bg-[#333] p-4 rounded-md w-full flex flex-col gap-2.5 shadow-md">
            {/* Control bar */}
            <ControlBar
              currentOctave={currentOctave}
              setCurrentOctave={setCurrentOctave}
              waveType={waveType}
              setWaveType={setWaveType}
              showLabels={showLabels}
              setShowLabels={setShowLabels}
              volume={volume}
              setVolume={setVolume}
              sustain={sustain}
              setSustain={setSustain}
              isRecording={isRecording}
              isPlaying={isPlaying}
              handleRecordToggle={handleRecordToggle}
              playRecording={playRecording}
              recordedNotes={recordedNotes}
              currentNote={currentNote}
            />
          </div>
          {/* Piano keys */}
          <PianoKeys
            showLabels={showLabels}
            currentOctave={currentOctave}
            handleNotePlay={handleNotePlay}
          />
          <div className="mt-5 text-center text-gray-600">
            Click on the keys to play notes. Customize your piano experience
            using the control bar.
          </div>
        </div>
      </div>
      <Particles
        className="absolute inset-0 z-0"
        quantity={100}
        ease={80}
        color={color}
        refresh
      />
    </>
  );
}
