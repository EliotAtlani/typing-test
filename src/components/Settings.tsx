import React, { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

interface SettingsProps {
  duration: number;
  handleDurationChange: (newValue: string) => void;
  setMode: React.Dispatch<React.SetStateAction<"normal" | "strict">>;
  mode: "normal" | "strict";
  isTestActive: boolean;
}

const DURATIONS = [10, 30, 60];
const MODES = ["normal", "strict"] as const;

const Settings: React.FC<SettingsProps> = ({
  duration,
  handleDurationChange,
  mode,
  setMode,
  isTestActive,
}) => {
  const [selectedSetting, setSelectedSetting] = useState<"duration" | "mode">("duration");

  useEffect(() => {
    if (isTestActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Tab or Arrow keys to switch between settings
      if (e.key === "Tab" || e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedSetting(prev => prev === "duration" ? "mode" : "duration");
        return;
      }

      // Arrow left/right or number keys to change values
      if (selectedSetting === "duration") {
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
          e.preventDefault();
          const currentIndex = DURATIONS.indexOf(duration);
          const newIndex = e.key === "ArrowLeft"
            ? Math.max(0, currentIndex - 1)
            : Math.min(DURATIONS.length - 1, currentIndex + 1);
          handleDurationChange(DURATIONS[newIndex].toString());
        } else if (e.key === "1") {
          handleDurationChange("10");
        } else if (e.key === "2") {
          handleDurationChange("30");
        } else if (e.key === "3") {
          handleDurationChange("60");
        }
      } else if (selectedSetting === "mode") {
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
          e.preventDefault();
          setMode(mode === "normal" ? "strict" : "normal");
        } else if (e.key === "n" || e.key === "N") {
          setMode("normal");
        } else if (e.key === "s" || e.key === "S") {
          setMode("strict");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [duration, mode, selectedSetting, handleDurationChange, setMode, isTestActive]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className={`p-4 rounded-lg border-2 transition-colors ${
          selectedSetting === "duration" ? "border-purple-500 bg-purple-50" : "border-gray-200"
        }`}>
          <Label className="text-sm font-medium mb-3 block">
            Duration {selectedSetting === "duration" && "(Selected)"}
          </Label>
          <div className="flex gap-2 justify-center">
            {DURATIONS.map((d) => (
              <Button
                key={d}
                variant={duration === d ? "default" : "outline"}
                size="sm"
                onClick={() => handleDurationChange(d.toString())}
                disabled={isTestActive}
              >
                {d}s
              </Button>
            ))}
          </div>
          <div className="text-xs text-gray-500 mt-2 text-center">
            Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">1</kbd>,{" "}
            <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">2</kbd>,{" "}
            <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">3</kbd> or{" "}
            <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">←</kbd>
            <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">→</kbd>
          </div>
        </div>

        <div className={`p-4 rounded-lg border-2 transition-colors ${
          selectedSetting === "mode" ? "border-purple-500 bg-purple-50" : "border-gray-200"
        }`}>
          <Label className="text-sm font-medium mb-3 block">
            Mode {selectedSetting === "mode" && "(Selected)"}
          </Label>
          <div className="flex gap-2 justify-center">
            {MODES.map((m) => (
              <Button
                key={m}
                variant={mode === m ? "default" : "outline"}
                size="sm"
                onClick={() => setMode(m)}
                disabled={isTestActive}
                className="capitalize"
              >
                {m}
              </Button>
            ))}
          </div>
          <div className="text-xs text-gray-500 mt-2 text-center">
            Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">N</kbd> or{" "}
            <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">S</kbd> or{" "}
            <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">←</kbd>
            <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">→</kbd>
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-500 text-center border-t pt-4">
        <kbd className="px-2 py-1 bg-gray-100 rounded">Tab</kbd> or{" "}
        <kbd className="px-2 py-1 bg-gray-100 rounded">↑</kbd>
        <kbd className="px-2 py-1 bg-gray-100 rounded">↓</kbd> to switch settings
        <br />
        <kbd className="px-2 py-1 bg-gray-100 rounded mt-2 inline-block">Esc</kbd> to close
      </div>
    </div>
  );
};

export default Settings;
