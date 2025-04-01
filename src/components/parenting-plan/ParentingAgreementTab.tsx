
import React from 'react';
import { Progress } from "@/components/ui/progress";
import PlanningSection from './PlanningSection';

interface ParentingAgreementTabProps {
  completedSections: number;
  totalSections: number;
}

const ParentingAgreementTab: React.FC<ParentingAgreementTabProps> = ({
  completedSections,
  totalSections
}) => {
  const progressPercentage = (completedSections / totalSections) * 100;
  
  return (
    <div className="bg-white border border-gray-300 p-6">
      <div className="govuk-warning-text">
        <span className="govuk-warning-text__icon" aria-hidden="true">!</span>
        <div>
          <strong className="font-bold">Complete your parenting plan</strong>
          <p className="mb-0">You've completed {completedSections} of {totalSections} sections of your parenting plan.</p>
        </div>
      </div>
      
      <Progress value={progressPercentage} className="h-2 mb-6" />
      
      <div className="space-y-4">
        <PlanningSection
          title="Living arrangements"
          description="How the children will split their time between parents."
          isCompleted={true}
        />
        
        <PlanningSection
          title="Communication"
          description="How and when parents will communicate about the children."
          isCompleted={true}
        />
        
        <PlanningSection
          title="Education and healthcare"
          description="Arrangements for school, medical appointments and healthcare decisions."
          onComplete={() => console.log('Education section completed')}
        />
        
        <PlanningSection
          title="Holidays and special days"
          description="Arrangements for school holidays, birthdays and special occasions."
          onComplete={() => console.log('Holidays section completed')}
        />
        
        <PlanningSection
          title="Financial support"
          description="How costs related to the children will be managed."
          onComplete={() => console.log('Financial section completed')}
        />
      </div>
    </div>
  );
};

export default ParentingAgreementTab;
