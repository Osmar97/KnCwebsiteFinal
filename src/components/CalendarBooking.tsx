
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TimeSlot {
  start: string;
  end: string;
  title: string;
}

interface FormData {
  name: string;
  email: string;
  company: string;
  revenue: string;
  phone: string;
  message: string;
}

export const CalendarBooking = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    revenue: "",
    phone: "",
    message: ""
  });

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots(selectedDate);
    }
  }, [selectedDate]);

  const fetchAvailableSlots = async (date: Date) => {
    setLoading(true);
    try {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      const { data, error } = await supabase.functions.invoke('google-calendar', {
        body: {
          action: 'getAvailability',
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }
      });

      if (error) throw error;

      setAvailableSlots(data.availableSlots || []);
    } catch (error) {
      console.error('Error fetching availability:', error);
      toast({
        title: "Error",
        description: "Failed to load available time slots",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSlot) {
      toast({
        title: "Error",
        description: "Please select a time slot",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const bookingData = {
        ...formData,
        selected_datetime: selectedSlot.start,
        status: 'pending'
      };

      const { data, error } = await supabase.functions.invoke('google-calendar', {
        body: {
          action: 'createBooking',
          bookingData
        }
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your booking has been scheduled. We'll contact you soon to confirm.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        company: "",
        revenue: "",
        phone: "",
        message: ""
      });
      setSelectedSlot(null);
      setSelectedDate(undefined);
      
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Error",
        description: "Failed to create booking. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const isWeekday = (date: Date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6; // Not Sunday (0) or Saturday (6)
  };

  const isDateDisabled = (date: Date) => {
    return date < new Date() || !isWeekday(date);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Calendar Selection */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5" />
            Select Date & Time
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Choose a Date</h3>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={isDateDisabled}
              className="rounded-md border"
            />
            <p className="text-sm text-gray-600 mt-2">
              Available Monday to Friday, 9 AM - 6 PM (Lisbon time)
            </p>
          </div>

          {selectedDate && (
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Available Times for {selectedDate.toLocaleDateString()}
              </h3>
              
              {loading ? (
                <div className="text-center py-8">Loading available slots...</div>
              ) : availableSlots.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableSlots.map((slot, index) => (
                    <Button
                      key={index}
                      variant={selectedSlot === slot ? "default" : "outline"}
                      className="h-auto p-3 text-left"
                      onClick={() => setSelectedSlot(slot)}
                    >
                      <div>
                        <div className="font-medium">
                          {new Date(slot.start).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            timeZone: 'Europe/Lisbon'
                          })}
                        </div>
                        <div className="text-xs opacity-75">60 minutes</div>
                      </div>
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No available slots for this date
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Booking Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Your Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedSlot && (
            <div className="mb-6 p-3 bg-green-50 rounded-lg">
              <div className="text-sm font-medium text-green-800">Selected Time:</div>
              <div className="text-green-700">
                {selectedDate?.toLocaleDateString()} at{' '}
                {new Date(selectedSlot.start).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  timeZone: 'Europe/Lisbon'
                })} (Lisbon time)
              </div>
            </div>
          )}

          <form onSubmit={handleBooking} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name *</label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Your full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Company Name *</label>
              <Input
                type="text"
                value={formData.company}
                onChange={(e) => handleInputChange("company", e.target.value)}
                placeholder="Your company name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Annual Revenue *</label>
              <Select onValueChange={(value) => handleInputChange("revenue", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your annual revenue" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="500k-1m">€500k - €1M</SelectItem>
                  <SelectItem value="1m-5m">€1M - €5M</SelectItem>
                  <SelectItem value="5m-10m">€5M - €10M</SelectItem>
                  <SelectItem value="10m+">€10M+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+351 xxx xxx xxx"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <Textarea
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                placeholder="Tell us about your business challenges..."
                className="h-20 resize-none"
              />
            </div>

            <Button 
              type="submit"
              className="w-full bg-gold hover:bg-gold-dark text-black font-medium"
              disabled={loading || !selectedSlot}
            >
              {loading ? "Booking..." : "CONFIRM BOOKING"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
