
import React from 'react';
import { Progress } from "@/components/ui/progress";

interface TimeSpentTrackerProps {
  parentAPercentage: number;
  parentBPercentage: number;
  previousMonths?: {
    month: string;
    parentA: string;
    parentB: string;
    status: string;
  }[];
}

const TimeSpentTracker: React.FC<TimeSpentTrackerProps> = ({ 
  parentAPercentage, 
  parentBPercentage,
  previousMonths = [] 
}) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Time spent with each parent</h2>
      <p className="mb-6">This shows how time is currently divided compared to your agreed parenting plan.</p>
      
      <div className="mb-8">
        <h3 className="font-bold mb-2">Current month ({new Date().toLocaleString('default', { month: 'long' })} {new Date().getFullYear()})</h3>
        
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
      
      {previousMonths.length > 0 && (
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
              {previousMonths.map((month, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2">{month.month}</td>
                  <td className="border border-gray-300 p-2">{month.parentA}</td>
                  <td className="border border-gray-300 p-2">{month.parentB}</td>
                  <td className="border border-gray-300 p-2">
                    <span className={`govuk-tag ${
                      month.status === 'As planned' ? 'bg-green-500' : 'bg-yellow-500'
                    } text-xs`}>
                      {month.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TimeSpentTracker;
