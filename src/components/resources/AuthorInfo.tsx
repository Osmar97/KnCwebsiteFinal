
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export const AuthorInfo = () => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-12 border border-gray-700">
      <div className="flex items-start gap-4">
        <Avatar className="w-16 h-16">
          <AvatarImage src="/lovable-uploads/ismaPerfil.JPG" alt="Ismael Gomes Queta" />
          <AvatarFallback>IG</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="mb-3">
            <h3 className="text-white font-semibold text-lg">Written by Ismael Gomes Queta</h3>
            <p className="text-gray-400 text-sm">CEO, Kings 'n Company</p>
          </div>
          
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            Hello! I'm Ismael Gomes Queta, founder of Kings 'n Company. Our mission is to provide 
            comprehensive real estate solutions and investment opportunities, helping clients build 
            generational wealth through strategic property investments in Portugal.
          </p>
          
          <div className="flex gap-3">
            <a
              href="#"
              className="w-8 h-8 bg-gray-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors"
              aria-label="Facebook"
            >
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a
              href="#"
              className="w-8 h-8 bg-gray-700 hover:bg-pink-600 rounded-full flex items-center justify-center transition-colors"
              aria-label="Instagram"
            >
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.988 11.988 11.988s11.987-5.367 11.987-11.988C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-2.508 0-4.541-2.033-4.541-4.54s2.033-4.541 4.541-4.541c2.508 0 4.541 2.033 4.541 4.541s-2.033 4.54-4.541 4.54z"/>
              </svg>
            </a>
            <a
              href="#"
              className="w-8 h-8 bg-gray-700 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors"
              aria-label="LinkedIn"
            >
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
