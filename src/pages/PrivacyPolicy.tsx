import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useScrollToTop } from "@/hooks/useScrollToTop";

const PrivacyPolicy = () => {
  useScrollToTop();

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none text-gray-800">
            <h1 className="text-4xl font-light text-[#85754E] mb-8">Privacy Policy</h1>

            <p className="text-lg text-gray-600 mb-8">Effective Date: 01 June 2025</p>

            <p className="mb-6">
              Caminhos Obstinados LDA ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website <strong>www.kingsncompany.com</strong>.
            </p>

            <h2 className="text-2xl font-semibold text-[#85754E] mt-8 mb-4">Information We Collect</h2>
            <p className="mb-4">We may collect the following types of information:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>Personal Identification Information</strong> (e.g., name, email address, phone number, etc.)</li>
              <li><strong>Technical Data</strong> (e.g., IP address, browser type, device information)</li>
              <li><strong>Usage Data</strong> (e.g., pages visited, time spent on site)</li>
            </ul>

            <h2 className="text-2xl font-semibold text-[#85754E] mt-8 mb-4">How We Use Your Information</h2>
            <p className="mb-4">We use the collected data for various purposes:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>To provide and maintain our services</li>
              <li>To notify you about changes to our services</li>
              <li>To allow you to participate in interactive features</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information to improve our service</li>
              <li>To monitor the usage of our website</li>
              <li>To detect, prevent and address technical issues</li>
              <li>To comply with legal obligations</li>
            </ul>

            <h2 className="text-2xl font-semibold text-[#85754E] mt-8 mb-4">Legal Basis for Processing Personal Data under GDPR</h2>
            <p className="mb-4">If you are from the European Economic Area (EEA), our legal basis for collecting and using your personal data depends on the information collected and the context:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>We need to perform a contract with you</li>
              <li>You have given us consent</li>
              <li>The processing is in our legitimate interests</li>
              <li>We need to comply with the law</li>
            </ul>

            <h2 className="text-2xl font-semibold text-[#85754E] mt-8 mb-4">Cookies</h2>
            <p className="mb-6">We may use cookies and similar tracking technologies to track activity on our site and hold certain information. You can set your browser to refuse all or some cookies or to alert you when websites set or access cookies.</p>

            <h2 className="text-2xl font-semibold text-[#85754E] mt-8 mb-4">Sharing Your Information</h2>
            <p className="mb-6">We do not sell, trade, or rent your personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information for purposes outlined above.</p>

            <h2 className="text-2xl font-semibold text-[#85754E] mt-8 mb-4">Your Rights under GDPR</h2>
            <p className="mb-4">If you are a resident of the EEA, you have the right to:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Access your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request erasure of your data</li>
              <li>Object to processing</li>
              <li>Request restriction of processing</li>
              <li>Request data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p className="mb-6">To exercise your rights, contact us at <strong>info@kingsncompany.com</strong>.</p>

            <h2 className="text-2xl font-semibold text-[#85754E] mt-8 mb-4">Your California Privacy Rights (CalOPPA)</h2>
            <p className="mb-4">In accordance with the California Online Privacy Protection Act (CalOPPA), we agree to the following:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Users can visit our site anonymously.</li>
              <li>A link to this Privacy Policy is available on our homepage or, at minimum, on the first significant page after entering our website.</li>
              <li>Our Privacy Policy link includes the word "Privacy" and can easily be found.</li>
            </ul>
            <p className="mb-4">You will be notified of any Privacy Policy changes on this page.</p>
            <p className="mb-6">You can change your personal information by emailing us or logging into your account (if applicable).</p>

            <h3 className="text-xl font-semibold text-[#85754E] mt-6 mb-3">Do Not Track (DNT) Signals</h3>
            <p className="mb-6">We honor Do Not Track signals and do not track, plant cookies, or use advertising when a DNT browser mechanism is in place. You can enable or disable DNT in your browser settings.</p>

            <h2 className="text-2xl font-semibold text-[#85754E] mt-8 mb-4">Third-Party Services</h2>
            <p className="mb-6">We may use third-party services (e.g., Google Analytics) that collect, monitor, and analyze usage of our website. These providers have their own privacy policies.</p>

            <h2 className="text-2xl font-semibold text-[#85754E] mt-8 mb-4">Data Retention</h2>
            <p className="mb-6">We retain your personal data only for as long as necessary to fulfill the purposes outlined in this policy, or to comply with legal obligations.</p>

            <h2 className="text-2xl font-semibold text-[#85754E] mt-8 mb-4">Security of Your Data</h2>
            <p className="mb-6">We implement appropriate technical and organizational measures to protect your personal data, but no method of transmission over the Internet is 100% secure.</p>

            <h2 className="text-2xl font-semibold text-[#85754E] mt-8 mb-4">Children's Privacy</h2>
            <p className="mb-6">Our services are not intended for individuals under the age of 13. We do not knowingly collect personally identifiable information from anyone under 13.</p>

            <h2 className="text-2xl font-semibold text-[#85754E] mt-8 mb-4">Changes to This Privacy Policy</h2>
            <p className="mb-6">We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Effective Date."</p>

            <h2 className="text-2xl font-semibold text-[#85754E] mt-8 mb-4">Contact Us</h2>
            <p className="mb-4">If you have any questions or concerns about this Privacy Policy, please contact us at:</p>
            <p className="mb-2"><strong>Email:</strong> services@kingsncompany.com</p>
            <p className="mb-2"><strong>Company:</strong> Caminhos Obstinados LDA</p>
            <p className="mb-6"><strong>Location:</strong> Lisbon, Portugal</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
