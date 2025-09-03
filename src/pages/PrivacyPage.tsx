import { Helmet } from 'react-helmet-async';

export default function PrivacyPage() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - ToolBox Pro</title>
        <meta name="description" content="ToolBox Pro Privacy Policy - Learn how we protect your data and privacy while using our online tools." />
      </Helmet>

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600">
            Last updated: September 2, 2025
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-8 shadow-lg">
          <div className="prose prose-lg max-w-none">
            <h2>Introduction</h2>
            <p>
              At ToolBox Pro, we take your privacy seriously. This Privacy Policy explains how we collect, 
              use, and protect your information when you use our online tools and services.
            </p>

            <h2>Information We Collect</h2>
            <h3>Files and Documents</h3>
            <p>
              <strong>We do not collect or store your files.</strong> All file processing happens entirely 
              in your browser using client-side JavaScript. Your documents, images, and other files never 
              leave your computer or get uploaded to our servers.
            </p>

            <h3>Usage Analytics</h3>
            <p>We may collect anonymous usage data including:</p>
            <ul>
              <li>Pages visited and tools used</li>
              <li>Browser type and version</li>
              <li>Device information (mobile, desktop, etc.)</li>
              <li>General location (country/region level)</li>
              <li>Time spent on our website</li>
            </ul>

            <h3>Contact Information</h3>
            <p>
              If you contact us through our contact form, we collect the information you voluntarily 
              provide, such as your name, email address, and message content.
            </p>

            <h2>How We Use Your Information</h2>
            <p>We use the collected information to:</p>
            <ul>
              <li>Improve our tools and user experience</li>
              <li>Analyze website performance and usage patterns</li>
              <li>Respond to your inquiries and provide support</li>
              <li>Ensure the security and proper functioning of our services</li>
            </ul>

            <h2>Google AdSense</h2>
            <p>
              We use Google AdSense to display advertisements on our website. Google may use cookies 
              and similar technologies to serve ads based on your interests. You can opt out of 
              personalized advertising by visiting Google's Ad Settings.
            </p>

            <h2>Cookies and Local Storage</h2>
            <p>We use cookies and browser local storage for:</p>
            <ul>
              <li>Remembering your preferences and settings</li>
              <li>Analytics and performance measurement</li>
              <li>Advertising (through Google AdSense)</li>
            </ul>

            <h2>Data Security</h2>
            <p>
              We implement appropriate security measures to protect your information. Since we don't 
              store your files on our servers, they remain secure on your device throughout the 
              processing.
            </p>

            <h2>Third-Party Services</h2>
            <p>We use the following third-party services:</p>
            <ul>
              <li><strong>Google Analytics:</strong> For website analytics</li>
              <li><strong>Google AdSense:</strong> For displaying advertisements</li>
              <li><strong>Cloudflare:</strong> For content delivery and security</li>
            </ul>

            <h2>Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access the personal information we have about you</li>
              <li>Request correction of incorrect information</li>
              <li>Request deletion of your personal information</li>
              <li>Opt out of marketing communications</li>
            </ul>

            <h2>Children's Privacy</h2>
            <p>
              Our services are not intended for children under 13. We do not knowingly collect 
              personal information from children under 13.
            </p>

            <h2>Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any 
              changes by posting the new Privacy Policy on this page and updating the 
              "Last updated" date.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <ul>
              <li>Email: privacy@toolboxpro.com</li>
              <li>Contact form: <a href="/contact" className="text-blue-600 hover:underline">/contact</a></li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
