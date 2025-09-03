import { Helmet } from 'react-helmet-async';

export default function TermsPage() {
  return (
    <>
      <Helmet>
        <title>Terms of Service - ToolBox Pro</title>
        <meta name="description" content="ToolBox Pro Terms of Service - Read our terms and conditions for using our free online tools." />
      </Helmet>

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-lg text-gray-600">
            Last updated: September 2, 2025
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-8 shadow-lg">
          <div className="prose prose-lg max-w-none">
            <h2>Acceptance of Terms</h2>
            <p>
              By accessing and using ToolBox Pro, you accept and agree to be bound by the terms 
              and provision of this agreement. If you do not agree to abide by the above, please 
              do not use this service.
            </p>

            <h2>Description of Service</h2>
            <p>
              ToolBox Pro provides free online tools for PDF processing, calculations, conversions, 
              and other digital utilities. Our services are provided "as is" without any warranties.
            </p>

            <h2>Use License</h2>
            <p>
              Permission is granted to temporarily use ToolBox Pro for personal and commercial use. 
              This is the grant of a license, not a transfer of title, and under this license you may:
            </p>
            <ul>
              <li>Use our tools for legitimate purposes</li>
              <li>Process your own files and documents</li>
              <li>Share results of your processing</li>
            </ul>

            <h2>Prohibited Uses</h2>
            <p>You may not use our service:</p>
            <ul>
              <li>For any unlawful purpose or to solicit others to unlawful acts</li>
              <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
              <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
              <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
              <li>To submit false or misleading information</li>
              <li>To upload or transmit viruses or any other type of malicious code</li>
              <li>To attempt to overload or crash our servers</li>
            </ul>

            <h2>File Processing and Security</h2>
            <p>
              All file processing occurs entirely in your browser using client-side JavaScript. 
              We do not upload, store, or have access to your files. You retain full ownership 
              and responsibility for all files you process using our tools.
            </p>

            <h2>Intellectual Property Rights</h2>
            <p>
              The service and its original content, features, and functionality are and will remain 
              the exclusive property of ToolBox Pro and its licensors. The service is protected by 
              copyright, trademark, and other laws.
            </p>

            <h2>User Content</h2>
            <p>
              You retain ownership of any files or content you process using our tools. Since we 
              don't store your files, we have no access to or ownership of your content.
            </p>

            <h2>Disclaimer</h2>
            <p>
              The information on this website is provided on an "as is" basis. To the fullest 
              extent permitted by law, we exclude all representations, warranties, and conditions 
              relating to our website and the use of this website.
            </p>

            <h2>Limitations of Liability</h2>
            <p>
              In no event shall ToolBox Pro, nor its directors, employees, partners, agents, 
              suppliers, or affiliates, be liable for any indirect, incidental, special, 
              consequential, or punitive damages, including without limitation, loss of profits, 
              data, use, goodwill, or other intangible losses, resulting from your use of the service.
            </p>

            <h2>Termination</h2>
            <p>
              We may terminate or suspend access immediately, without prior notice or liability, 
              for any reason whatsoever, including without limitation if you breach the Terms.
            </p>

            <h2>Governing Law</h2>
            <p>
              These Terms shall be interpreted and governed by the laws of the jurisdiction in 
              which we operate, without regard to conflict of law provisions.
            </p>

            <h2>Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at 
              any time. If a revision is material, we will try to provide at least 30 days notice 
              prior to any new terms taking effect.
            </p>

            <h2>Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <ul>
              <li>Email: legal@toolboxpro.com</li>
              <li>Contact form: <a href="/contact" className="text-blue-600 hover:underline">/contact</a></li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
