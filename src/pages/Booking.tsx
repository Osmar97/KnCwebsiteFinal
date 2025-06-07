
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Globe, User, CheckCircle } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const Booking = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    revenue: "",
    phone: "",
    message: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <Navigation />
      
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Side - Information */}
            <div className="space-y-8">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl md:text-5xl font-light mb-6 tracking-wider">
                  Tell Us More About Your <span className="text-gold">Business</span>
                </h1>
                
                <p className="text-gray-300 text-lg leading-relaxed mb-4">
                  Before booking a demo call, fill in the form with your company's info
                  so we can curate the perfect fit.
                </p>
                
                <p className="text-gray-400 text-base">
                  We'll get back to you ASAP to confirm our meeting.
                </p>
              </div>

              {/* Qualification Criteria */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
                <h3 className="text-2xl font-medium mb-6 text-white">This call is for you if:</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-300">
                      You're a <span className="text-white font-medium">B2B Company</span> making over <span className="text-white font-medium">500k/Year</span>
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-300">
                      You rely heavily on <span className="text-white font-medium">word of mouth</span>
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-300">
                      You set goals but don't know how to reach them, aka, <span className="text-white font-medium">lack growth predictability</span>
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-300">
                      Your <span className="text-white font-medium">sales department is underperforming</span>
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-300">
                      You <span className="text-white font-medium">lack standardized processes</span> for your company's growth
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Booking Form */}
            <div className="bg-white text-black rounded-3xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-white transform rotate-45"></div>
                </div>
                <h2 className="text-2xl font-semibold mb-2">Discovery Call - Kings 'n Company</h2>
                
                <div className="flex items-center justify-center gap-6 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>60 Minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Available Soon</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <span>Europe/Lisbon (GMT+1)</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 leading-relaxed">
                  Initial introductory meeting to understand your commercial department's challenges and identify real opportunities for growth.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="w-full"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="w-full"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <Input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    className="w-full"
                    placeholder="Your company name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Annual Revenue *
                  </label>
                  <Select onValueChange={(value) => handleInputChange("revenue", value)}>
                    <SelectTrigger className="w-full">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full"
                    placeholder="+351 xxx xxx xxx"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tell us about your business challenges
                  </label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    className="w-full h-24 resize-none"
                    placeholder="Describe your current challenges and goals..."
                  />
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-gold hover:bg-gold-dark text-black font-medium py-3 text-lg tracking-wider transition-all duration-300"
                >
                  SCHEDULE DISCOVERY CALL
                </Button>
              </form>

              <p className="text-xs text-gray-500 text-center mt-4">
                By submitting this form, you agree to our terms and privacy policy.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Booking;
