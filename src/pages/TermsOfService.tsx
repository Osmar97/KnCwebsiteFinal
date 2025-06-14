
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { Link } from "react-router-dom";

const TermsOfService = () => {
  useScrollToTop();

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none text-gray-200">
            <h1 className="text-4xl font-light text-[#85754E] mb-8">Terms and Conditions</h1>

            <p className="text-lg text-gray-400 mb-8"><strong>Last updated: June 14, 2025</strong></p>

            <p className="mb-8">
              Please read these terms and conditions carefully before using our Service.
            </p>

            <hr className="border-gray-700 my-8" />

            <h2 className="text-2xl font-semibold text-[#85754E] mt-8 mb-4">1. Interpretation and Definitions</h2>
            
            <h3 className="text-xl font-semibold text-[#85754E] mt-6 mb-3">Interpretation</h3>
            <p className="mb-4">
              Words with capitalized first letters have specific meanings defined under the following conditions. These definitions apply whether the terms appear in singular or plural.
            </p>

            <h3 className="text-xl font-semibold text-[#85754E] mt-6 mb-3">Definitions</h3>
            <p className="mb-4">For the purposes of these Terms and Conditions:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>Affiliate</strong> means any entity that controls, is controlled by, or is under common control with a party. "Control" means ownership of 50% or more of the shares or voting rights.</li>
              <li><strong>Country</strong> refers to Portugal.</li>
              <li><strong>Company</strong> (referred to as "the Company", "We", "Us", or "Our") refers to Caminho Obstinado LDA, 1000-100 Lisboa.</li>
              <li><strong>Device</strong> means any device that can access the Service, such as a computer, smartphone, or tablet.</li>
              <li><strong>Service</strong> refers to the Website.</li>
              <li><strong>Terms and Conditions</strong> (or simply "Terms") refer to this agreement between You and the Company concerning your use of the Service.</li>
              <li><strong>Third-party Social Media Service</strong> means any content or service provided by a third party that may be displayed, included, or made available via the Service.</li>
              <li><strong>Website</strong> refers to Kings 'n Company, accessible at <strong>https://kingsncompany.com</strong>.</li>
              <li><strong>You</strong> means the person or entity using the Service.</li>
            </ul>

            <hr className="border-gray-700 my-8" />

            <h2 className="text-2xl font-semibold text-[#85754E] mt-8 mb-4">2. Acknowledgment</h2>
            <p className="mb-4">
              These Terms govern your access and use of the Service. By accessing the Service, you agree to these Terms. If you disagree with any part, you must not use the Service.
            </p>
            <p className="mb-4">
              You must be at least 18 years old to use the Service.
            </p>
            <p className="mb-6">
              You also agree to comply with our <Link to="/privacy-policy" className="text-gold hover:underline">Privacy Policy</Link>, which explains how we handle your personal data.
            </p>

            <hr className="border-gray-700 my-8" />

            <h2 className="text-2xl font-semibold text-[#85754E] mt-8 mb-4">3. Links to Other Websites</h2>
            <p className="mb-4">
              Our Service may contain links to third-party websites. We do not control or take responsibility for their content, policies, or practices.
            </p>
            <p className="mb-6">
              We recommend reviewing the terms and privacy policies of any third-party websites you visit.
            </p>

            <hr className="border-gray-700 my-8" />

            <h2 className="text-2xl font-semibold text-[#85754E] mt-8 mb-4">4. Termination</h2>
            <p className="mb-6">
              We may suspend or terminate your access immediately, without prior notice, for any breach of these Terms. Upon termination, your right to use the Service ends immediately.
            </p>

            <hr className="border-gray-700 my-8" />

            <h2 className="text-2xl font-semibold text-[#85754E] mt-8 mb-4">5. Limitation of Liability</h2>
            <p className="mb-4">
              To the extent permitted by law, the Company's total liability under these Terms shall not exceed the amount paid by You through the Service or USD $100 if you haven't made any purchases.
            </p>
            <p className="mb-6">
              We are not liable for any indirect, special, incidental, or consequential damages (e.g., loss of profits, data, or privacy), even if informed of such possibilities.
            </p>
            <p className="mb-6">
              Some jurisdictions may not allow these exclusions or limitations. In such cases, our liability will be limited to the greatest extent permitted by law.
            </p>

            <hr className="border-gray-700 my-8" />

            <h2 className="text-2xl font-semibold text-[#85754E] mt-8 mb-4">6. "AS IS" and "AS AVAILABLE" Disclaimer</h2>
            <p className="mb-4">
              The Service is provided "AS IS" and "AS AVAILABLE" with no warranties of any kind. We do not guarantee that the Service will be uninterrupted, error-free, secure, or meet your expectations.
            </p>
            <p className="mb-4">
              We are not responsible for any viruses or harmful components transmitted through the Service.
            </p>
            <p className="mb-6">
              Some jurisdictions may not allow disclaimers of certain warranties, so these exclusions may not fully apply to you.
            </p>

            <hr className="border-gray-700 my-8" />

            <h2 className="text-2xl font-semibold text-[#85754E] mt-8 mb-4">7. Governing Law</h2>
            <p className="mb-6">
              These Terms are governed by the laws of Portugal, without regard to its conflict of law rules. Other local, state, or international laws may apply depending on your location.
            </p>

            <hr className="border-gray-700 my-8" />

            <h2 className="text-2xl font-semibold text-[#85754E] mt-8 mb-4">8. Dispute Resolution</h2>
            <p className="mb-6">
              If you have a concern or dispute regarding the Service, you agree to attempt an informal resolution by contacting us first.
            </p>

            <hr className="border-gray-700 my-8" />

            <h2 className="text-2xl font-semibold text-[#85754E] mt-8 mb-4">9. For EU Users</h2>
            <p className="mb-6">
              If you reside in the European Union, you benefit from any mandatory legal protections under the law of your country.
            </p>

            <hr className="border-gray-700 my-8" />

            <h2 className="text-2xl font-semibold text-[#85754E] mt-8 mb-4">10. United States Legal Compliance</h2>
            <p className="mb-4">You confirm that:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>You are not located in a U.S. embargoed country or designated as a "terrorist supporting" country.</li>
              <li>You are not listed on any U.S. government list of prohibited or restricted parties.</li>
            </ul>

            <hr className="border-gray-700 my-8" />

            <h2 className="text-2xl font-semibold text-[#85754E] mt-8 mb-4">11. Severability and Waiver</h2>
            
            <h3 className="text-xl font-semibold text-[#85754E] mt-6 mb-3">Severability</h3>
            <p className="mb-4">
              If any part of these Terms is deemed invalid or unenforceable, it will be interpreted to achieve its intent as closely as possible. The remaining provisions remain in full effect.
            </p>

            <h3 className="text-xl font-semibold text-[#85754E] mt-6 mb-3">Waiver</h3>
            <p className="mb-6">
              Failure to enforce any right or obligation under these Terms does not constitute a waiver of that right or obligation.
            </p>

            <hr className="border-gray-700 my-8" />

            <h2 className="text-2xl font-semibold text-[#85754E] mt-8 mb-4">12. Translation</h2>
            <p className="mb-6">
              If these Terms are translated, the English version shall prevail in case of any disputes.
            </p>

            <hr className="border-gray-700 my-8" />

            <h2 className="text-2xl font-semibold text-[#85754E] mt-8 mb-4">13. Changes to These Terms</h2>
            <p className="mb-4">
              We may update these Terms at our sole discretion. If changes are material, we will provide 30 days' notice before new terms take effect.
            </p>
            <p className="mb-6">
              By continuing to use the Service after changes are made, you agree to be bound by the updated Terms.
            </p>

            <hr className="border-gray-700 my-8" />

            <h2 className="text-2xl font-semibold text-[#85754E] mt-8 mb-4">14. Contact Us</h2>
            <p className="mb-4">If you have any questions, you can contact us:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>By email:</strong> services@kingsncompany.com</li>
              <li><strong>By visiting:</strong> <Link to="/contact" className="text-gold hover:underline">https://kingsncompany.com/contact</Link></li>
              <li><strong>By phone:</strong> +351 939 953 609</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;
