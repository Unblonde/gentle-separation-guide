
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Holiday } from '@/types/holiday';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { v4 as uuidv4 } from 'uuid';

const holidaySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "Holiday name is required" }),
  startDate: z.string().min(1, { message: "Start date is required" }),
  endDate: z.string().min(1, { message: "End date is required" }),
  withParent: z.string().min(1, { message: "Parent information is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  pickupTime: z.string().min(1, { message: "Pickup time is required" }),
  pickupLocation: z.string().min(1, { message: "Pickup location is required" }),
  dropoffTime: z.string().min(1, { message: "Drop-off time is required" }),
  dropoffLocation: z.string().min(1, { message: "Drop-off location is required" }),
});

interface HolidayFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (holiday: Holiday) => void;
  holiday?: Holiday;
}

const HolidayFormDialog: React.FC<HolidayFormDialogProps> = ({ 
  isOpen, 
  onClose, 
  onSave,
  holiday 
}) => {
  const form = useForm<Holiday>({
    resolver: zodResolver(holidaySchema),
    defaultValues: {
      id: '',
      name: '',
      startDate: '',
      endDate: '',
      withParent: '',
      location: '',
      pickupTime: '',
      pickupLocation: '',
      dropoffTime: '',
      dropoffLocation: ''
    }
  });

  useEffect(() => {
    if (holiday) {
      form.reset(holiday);
    } else {
      form.reset({
        id: uuidv4(),
        name: '',
        startDate: '',
        endDate: '',
        withParent: '',
        location: '',
        pickupTime: '',
        pickupLocation: '',
        dropoffTime: '',
        dropoffLocation: ''
      });
    }
  }, [holiday, form, isOpen]);

  const handleSubmit = (values: Holiday) => {
    onSave(values);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{holiday ? 'Edit Holiday Arrangement' : 'Add Holiday Arrangement'}</DialogTitle>
          <DialogDescription>
            Fill in the details for this holiday arrangement.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Holiday name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Summer break" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="withParent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>With parent</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Parent A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Home" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <h3 className="font-medium text-md pt-2">Pickup details</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="pickupTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="pickupLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. School" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <h3 className="font-medium text-md pt-2">Drop-off details</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dropoffTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dropoffLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. School" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {holiday ? 'Update' : 'Add'} Holiday
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default HolidayFormDialog;
