
import React, { useState } from 'react';
import GOVUKLayout from '../components/GOVUKLayout';
import { Calendar, Clock, MapPin, CalendarCheck, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

interface Holiday {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  withParent: string;
  location: string;
  pickupTime: string;
  pickupLocation: string;
  dropoffTime: string;
  dropoffLocation: string;
}

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

  // Statistics for time spent
  const parentAPercentage = 65;
  const parentBPercentage = 35;
  
  return (
    <GOVUKLayout>
      <div className="grid gap-8">
        <div>
          <div className="flex items-center justify-between">
            <h1>Parenting Plan & Holiday Planner</h1>
            <button className="govuk-button">
              Share plan
            </button>
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
            <div className="bg-white border border-gray-300 p-6">
              <div className="govuk-warning-text">
                <span className="govuk-warning-text__icon" aria-hidden="true">!</span>
                <div>
                  <strong className="font-bold">Complete your parenting plan</strong>
                  <p className="mb-0">You've completed 2 of 5 sections of your parenting plan.</p>
                </div>
              </div>
              
              <Progress value={40} className="h-2 mb-6" />
              
              <div className="space-y-4">
                <div className="p-4 border border-gray-300 bg-gray-50">
                  <h3 className="flex items-center text-lg font-bold">
                    <CalendarCheck className="mr-2 h-5 w-5 text-govuk-green" />
                    Living arrangements
                    <span className="ml-2 govuk-tag bg-govuk-green text-xs">Completed</span>
                  </h3>
                  <p>How the children will split their time between parents.</p>
                </div>
                
                <div className="p-4 border border-gray-300 bg-gray-50">
                  <h3 className="flex items-center text-lg font-bold">
                    <CalendarCheck className="mr-2 h-5 w-5 text-govuk-green" />
                    Communication
                    <span className="ml-2 govuk-tag bg-govuk-green text-xs">Completed</span>
                  </h3>
                  <p>How and when parents will communicate about the children.</p>
                </div>
                
                <div className="p-4 border border-gray-300">
                  <h3 className="flex items-center text-lg font-bold">
                    Education and healthcare
                  </h3>
                  <p>Arrangements for school, medical appointments and healthcare decisions.</p>
                  <button className="govuk-button mt-2">Complete section</button>
                </div>
                
                <div className="p-4 border border-gray-300">
                  <h3 className="flex items-center text-lg font-bold">
                    Holidays and special days
                  </h3>
                  <p>Arrangements for school holidays, birthdays and special occasions.</p>
                  <button className="govuk-button mt-2">Complete section</button>
                </div>
                
                <div className="p-4 border border-gray-300">
                  <h3 className="flex items-center text-lg font-bold">
                    Financial support
                  </h3>
                  <p>How costs related to the children will be managed.</p>
                  <button className="govuk-button mt-2">Complete section</button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="holidays">
            <div className="bg-white border border-gray-300 p-6">
              <h2 className="text-xl font-bold mb-4">Upcoming holiday arrangements</h2>
              <div className="space-y-6">
                {holidays.map((holiday) => (
                  <div key={holiday.id} className="border border-gray-300 bg-gray-50 p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{holiday.name}</h3>
                        <div className="flex items-center text-gray-600 mt-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{new Date(holiday.startDate).toLocaleDateString('en-GB')} to {new Date(holiday.endDate).toLocaleDateString('en-GB')}</span>
                        </div>
                        <div className="mt-2 inline-block bg-govuk-light-blue px-2 py-1">
                          <span className="font-semibold">With: {holiday.withParent}</span>
                        </div>
                      </div>
                      <button className="text-govuk-blue underline text-sm">
                        Edit
                      </button>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-3 border border-gray-200">
                        <h4 className="font-bold mb-2">Pickup details</h4>
                        <div className="flex items-center mb-1">
                          <Clock className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{holiday.pickupTime}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{holiday.pickupLocation}</span>
                        </div>
                      </div>
                      
                      <div className="bg-white p-3 border border-gray-200">
                        <h4 className="font-bold mb-2">Drop-off details</h4>
                        <div className="flex items-center mb-1">
                          <Clock className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{holiday.dropoffTime}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{holiday.dropoffLocation}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-sm text-gray-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      <span>Last updated: 15 September 2023</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <button className="govuk-button">
                  Add new holiday arrangement
                </button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="time">
            <div className="bg-white border border-gray-300 p-6">
              <h2 className="text-xl font-bold mb-4">Time spent with each parent</h2>
              <p className="mb-6">This shows how time is currently divided compared to your agreed parenting plan.</p>
              
              <div className="mb-8">
                <h3 className="font-bold mb-2">Current month (October 2023)</h3>
                
                <div className="bg-gray-100 p-4 mb-4">
                  <div className="mb-2">
                    <div className="flex justify-between mb-1">
                      <span>Parent A</span>
                      <span>{parentAPercentage}%</span>
                    </div>
                    <div className="h-4 bg-gray-200 rounded">
                      <div 
                        className="h-4 bg-blue-500 rounded" 
                        style={{ width: `${parentAPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Parent B</span>
                      <span>{parentBPercentage}%</span>
                    </div>
                    <div className="h-4 bg-gray-200 rounded">
                      <div 
                        className="h-4 bg-green-500 rounded" 
                        style={{ width: `${parentBPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-govuk-light-blue p-4 border-l-4 border-govuk-blue">
                  <h4 className="font-bold mb-2">Comparison to agreed plan</h4>
                  <p>Time is currently split according to your agreed arrangements.</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-bold mb-2">Previous months</h3>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2 text-left">Month</th>
                      <th className="border border-gray-300 p-2 text-left">Parent A</th>
                      <th className="border border-gray-300 p-2 text-left">Parent B</th>
                      <th className="border border-gray-300 p-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2">September 2023</td>
                      <td className="border border-gray-300 p-2">68%</td>
                      <td className="border border-gray-300 p-2">32%</td>
                      <td className="border border-gray-300 p-2">
                        <span className="govuk-tag bg-yellow-500 text-xs">Slight variation</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">August 2023</td>
                      <td className="border border-gray-300 p-2">50%</td>
                      <td className="border border-gray-300 p-2">50%</td>
                      <td className="border border-gray-300 p-2">
                        <span className="govuk-tag bg-green-500 text-xs">As planned</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">July 2023</td>
                      <td className="border border-gray-300 p-2">45%</td>
                      <td className="border border-gray-300 p-2">55%</td>
                      <td className="border border-gray-300 p-2">
                        <span className="govuk-tag bg-yellow-500 text-xs">Slight variation</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </GOVUKLayout>
  );
};

export default ParentingPlan;
