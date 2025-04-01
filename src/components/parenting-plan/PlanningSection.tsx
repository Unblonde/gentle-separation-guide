
import React from 'react';
import { CalendarCheck } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface PlanningSectionProps {
  title: string;
  description: string;
  isCompleted?: boolean;
  onComplete?: () => void;
}

const PlanningSection: React.FC<PlanningSectionProps> = ({
  title,
  description,
  isCompleted = false,
  onComplete
}) => {
  return (
    <div className={`p-4 border border-gray-300 ${isCompleted ? 'bg-gray-50' : ''}`}>
      <h3 className="flex items-center text-lg font-bold">
        {isCompleted && (
          <CalendarCheck className="mr-2 h-5 w-5 text-govuk-green" />
        )}
        {title}
        {isCompleted && (
          <span className="ml-2 govuk-tag bg-govuk-green text-xs">Completed</span>
        )}
      </h3>
      <p>{description}</p>
      {!isCompleted && onComplete && (
        <Button onClick={onComplete} className="mt-2">Complete section</Button>
      )}
    </div>
  );
};

export default PlanningSection;
