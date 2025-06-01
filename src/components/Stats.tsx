import { Button } from "@/components/ui/button";

interface Props {
  wpm: number;
  accuracy: number;
  onRestart: () => void;
}

const Stats = ({ wpm, accuracy, onRestart }: Props) => {
  return (
    <div className="space-y-4">
      <div className="text-lg">WPM: {wpm}</div>
      <div className="text-lg">Accuracy: {accuracy}%</div>
      <Button onClick={onRestart} className="cursor-pointer">
        Try Again
      </Button>
    </div>
  );
};

export default Stats;
