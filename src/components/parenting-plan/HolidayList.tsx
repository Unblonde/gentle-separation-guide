
import React from 'react';
import { Calendar, Clock, MapPin, AlertCircle } from 'lucide-react';
import { Holiday } from '@/types/holiday';
import HolidayCard from './HolidayCard';

interface HolidayListProps {
  holidays: Holiday[];
  onEdit: (holiday: Holiday) => void;
}

const HolidayList: React.FC<HolidayListProps> = ({ holidays, onEdit }) => {
  return (
    <div className="space-y-6">
      {holidays.map((holiday) => (
        <HolidayCard 
          key={holiday.id} 
          holiday={holiday} 
          onEdit={() => onEdit(holiday)} 
        />
      ))}
    </div>
  );
};

export default HolidayList;
