
import { Clock, Calendar, Globe, List } from "lucide-react";

interface MeetingDetailsProps {}

const MeetingDetails = ({}: MeetingDetailsProps) => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 text-gray-600 text-sm mb-2">
        <Clock className="w-4 h-4" />
        <span>60 Minutes</span>
      </div>
      <div className="flex items-center gap-3 text-gray-600 text-sm mb-2">
        <Calendar className="w-4 h-4" />
        <span>Available Monday - Friday</span>
      </div>
      <div className="flex items-center gap-3 text-gray-600 text-sm mb-2">
        <Globe className="w-4 h-4" />
        <span>Europe/Lisbon (GMT+1)</span>
      </div>
      <div className="flex items-start gap-3 text-gray-600 text-sm">
        <List className="w-4 h-4 mt-0.5" />
        <div>
          <p>In this introductory meeting, we will delve into your Portugal investment or relocation goals and understand your specific needs.</p>
        </div>
      </div>
    </div>
  );
};

export default MeetingDetails;
