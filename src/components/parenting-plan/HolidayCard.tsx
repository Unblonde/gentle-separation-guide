
import React from 'react';
import { Calendar, Clock, MapPin, AlertCircle } from 'lucide-react';
import { Holiday } from '@/types/holiday';
import { formatDate } from '@/lib/date-utils';

interface HolidayCardProps {
  holiday: Holiday;
  onEdit: () => void;
}

const HolidayCard: React.FC<HolidayCardProps> = ({ holiday, onEdit }) => {
  return (
    <div className="border border-gray-300 bg-gray-50 p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg">{holiday.name}</h3>
          <div className="flex items-center text-gray-600 mt-1">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{formatDate(holiday.startDate)} to {formatDate(holiday.endDate)}</span>
          </div>
          <div className="mt-2 inline-block bg-govuk-light-blue px-2 py-1">
            <span className="font-semibold">With: {holiday.withParent}</span>
          </div>
        </div>
        <button 
          className="text-govuk-blue underline text-sm"
          onClick={onEdit}
        >
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
        <span>Last updated: {formatDate(new Date().toISOString())}</span>
      </div>
    </div>
  );
};

export default HolidayCard;
