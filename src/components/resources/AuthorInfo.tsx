import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Instagram, Linkedin } from "lucide-react";
export const AuthorInfo = () => {
  return <div className="bg-gray-800 rounded-lg p-6 mb-12 border border-gray-700">
      <div className="flex items-start gap-4">
        <Avatar className="w-16 h-16">
          <AvatarImage src="/lovable-uploads/ismaPerfil.JPG" alt="Ismael Gomes Queta" />
          <AvatarFallback>IG</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="mb-3">
            <h3 className="text-white font-semibold text-lg">Written by Ismael Gomes Queta</h3>
            <p className="text-gray-400 text-sm">Founder , Kings 'n Company</p>
          </div>
          
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            Hello! I'm Ismael Gomes Queta, founder of Kings 'n Company. Our mission is to provide 
            comprehensive real estate solutions and investment opportunities, helping clients build 
            generational wealth through strategic property investments in Portugal.
          </p>
          
          <div className="flex gap-3">
            <a href="#" className="w-8 h-8 bg-gray-700 hover:bg-pink-600 rounded-full flex items-center justify-center transition-colors" aria-label="Instagram">
              <Instagram className="w-4 h-4 text-white" />
            </a>
            <a href="#" className="w-8 h-8 bg-gray-700 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors" aria-label="LinkedIn">
              <Linkedin className="w-4 h-4 text-white" />
            </a>
          </div>
        </div>
      </div>
    </div>;
};