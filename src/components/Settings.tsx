import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "./ui/label";

interface SettingsProps {
  duration: number;
  handleDurationChange: (newValue: string) => void;
  setMode: React.Dispatch<React.SetStateAction<"normal" | "strict">>;
  mode: "normal" | "strict"; // Define the mode type
  isTestActive: boolean; // Optional prop for test state
}
const Settings: React.FC<SettingsProps> = ({
  duration,
  handleDurationChange,
  mode,
  setMode,
  isTestActive,
}) => {
  return (
    <div>
      <div className="flex gap-4 justify-center items-center">
        <div className="flex-col flex gap-2 items-center">
          <Label>Duration</Label>
          <Select
            value={duration.toString()}
            onValueChange={handleDurationChange}
            disabled={isTestActive}
          >
            <SelectTrigger className="w-[100px]">
              {/* Show the chosen duration with an s suffix */}
              <SelectValue placeholder={`${duration}s`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10sec</SelectItem>
              <SelectItem value="30">30sec</SelectItem>
              <SelectItem value="60">60sec</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-col flex gap-2 items-center">
          <Label>Mode</Label>
          <Select
            value={mode}
            onValueChange={(value) => setMode(value as "normal" | "strict")}
            disabled={isTestActive}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="strict">Strict</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default Settings;
