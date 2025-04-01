
import React, { useState } from 'react';
import GOVUKLayout from '../components/GOVUKLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { Holiday } from '@/types/holiday';

// Import custom components
import HolidayList from '@/components/parenting-plan/HolidayList';
import TimeSpentTracker from '@/components/parenting-plan/TimeSpentTracker';
import SharePlanButton from '@/components/parenting-plan/SharePlanButton';
import HolidayFormDialog from '@/components/parenting-plan/HolidayFormDialog';
import ParentingAgreementTab from '@/components/parenting-plan/ParentingAgreementTab';

const ParentingPlan = () => {
  const [holidays, setHolidays] = useState<Holiday[]>([
    {
      id: '1',
      name: 'Half term break',
      startDate: '2023-10-23',
      endDate: '2023-10-27',
      withParent: 'Parent A',
      location: 'Home',
      pickupTime: '15:00',
      pickupLocation: 'School',
      dropoffTime: '09:00',
      dropoffLocation: 'School'
    },
    {
      id: '2',
      name: 'Christmas break (first week)',
      startDate: '2023-12-18',
      endDate: '2023-12-24',
      withParent: 'Parent B',
      location: 'Grandparents',
      pickupTime: '15:00',
      pickupLocation: 'School',
      dropoffTime: '12:00',
      dropoffLocation: 'Parent A home'
    },
    {
      id: '3',
      name: 'Christmas break (second week)',
      startDate: '2023-12-25',
      endDate: '2023-12-31',
      withParent: 'Parent A',
      location: 'Home',
      pickupTime: '12:00',
      pickupLocation: 'Parent B home',
      dropoffTime: '18:00',
      dropoffLocation: 'Parent B home'
    }
  ]);

  // State for modal handling
  const [isHolidayFormOpen, setIsHolidayFormOpen] = useState(false);
  const [currentHoliday, setCurrentHoliday] = useState<Holiday | undefined>(undefined);

  // Statistics for time spent
  const parentAPercentage = 65;
  const parentBPercentage = 35;
  
  // Previous months data
  const previousMonths = [
    { month: 'September 2023', parentA: '68%', parentB: '32%', status: 'Slight variation' },
    { month: 'August 2023', parentA: '50%', parentB: '50%', status: 'As planned' },
    { month: 'July 2023', parentA: '45%', parentB: '55%', status: 'Slight variation' }
  ];

  // Event handlers
  const handleAddHoliday = () => {
    setCurrentHoliday(undefined);
    setIsHolidayFormOpen(true);
  };

  const handleEditHoliday = (holiday: Holiday) => {
    setCurrentHoliday(holiday);
    setIsHolidayFormOpen(true);
  };

  const handleSaveHoliday = (holiday: Holiday) => {
    if (holiday.id && holidays.some(h => h.id === holiday.id)) {
      setHolidays(holidays.map(h => h.id === holiday.id ? holiday : h));
    } else {
      setHolidays([...holidays, holiday]);
    }
  };

  return (
    <GOVUKLayout>
      <div className="grid gap-8">
        <div>
          <div className="flex items-center justify-between">
            <h1>Parenting Plan & Holiday Planner</h1>
            <SharePlanButton />
          </div>
          <p className="text-xl mb-6">
            Create, view and update agreements about your children's care arrangements.
          </p>
        </div>

        <Tabs defaultValue="holidays">
          <TabsList className="mb-6 bg-gray-100">
            <TabsTrigger value="plan" className="data-[state=active]:bg-white">Parenting agreement</TabsTrigger>
            <TabsTrigger value="holidays" className="data-[state=active]:bg-white">Holiday planner</TabsTrigger>
            <TabsTrigger value="time" className="data-[state=active]:bg-white">Time spent</TabsTrigger>
          </TabsList>
          
          <TabsContent value="plan">
            <ParentingAgreementTab completedSections={2} totalSections={5} />
          </TabsContent>
          
          <TabsContent value="holidays">
            <div className="bg-white border border-gray-300 p-6">
              <h2 className="text-xl font-bold mb-4">Upcoming holiday arrangements</h2>
              <HolidayList holidays={holidays} onEdit={handleEditHoliday} />
              
              <div className="mt-6">
                <Button onClick={handleAddHoliday}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add new holiday arrangement
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="time">
            <div className="bg-white border border-gray-300 p-6">
              <TimeSpentTracker 
                parentAPercentage={parentAPercentage} 
                parentBPercentage={parentBPercentage}
                previousMonths={previousMonths}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <HolidayFormDialog 
        isOpen={isHolidayFormOpen}
        onClose={() => setIsHolidayFormOpen(false)}
        onSave={handleSaveHoliday}
        holiday={currentHoliday}
      />
    </GOVUKLayout>
  );
};

export default ParentingPlan;
