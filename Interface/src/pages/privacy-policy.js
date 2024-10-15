import Head from "next/head";
import Layout from "@/components/layout/Layout";

function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy - Yazasnkrz</title>
        <meta name="description" content="Privacy Policy About Yazasnkrz" />
      </Head>
      <Layout headerStyle={3} footerStyle={1}>
        <main className="container my-5">
          {/* Page Title */}
          <div className="text-center mb-4">
            <h1 className="display-5">Privacy Policy</h1>
          </div>

          {/* Introduction Section */}
          <section className="mb-5">
            <h2 className="h4 text-success">Introduction</h2>
            <p className="text-muted">
              Welcome to Yazasnkrz's privacy policy. We are committed to
              protecting your personal data and ensuring that your privacy is
              respected.
            </p>
          </section>

          {/* Data Collection Section */}
          <section className="mb-5">
            <h2 className="h4 text-success">What Data We Collect</h2>
            <p className="text-muted">
              We collect various types of information in connection with the
              services we provide, including:
            </p>
            <ul className="list-unstyled text-muted">
              <li className="mb-2">
                <i className="bi bi-person me-2"></i> Personal identification
                information (Name, email address, phone number, etc.)
              </li>
              <li className="mb-2">
                <i className="bi bi-credit-card me-2"></i> Financial information
                (credit card details, purchase history, etc.)
              </li>
              <li className="mb-2">
                <i className="bi bi-laptop me-2"></i> Technical data (IP
                address, browser type, etc.)
              </li>
            </ul>
          </section>

          {/* Data Usage Section */}
          <section className="mb-5">
            <h2 className="h4 text-success">How We Use Your Data</h2>
            <p className="text-muted">
              Your data is used for the following purposes:
            </p>
            <ul className="list-unstyled text-muted">
              <li className="mb-2">
                <i className="bi bi-check-circle me-2"></i> Processing your
                orders
              </li>
              <li className="mb-2">
                <i className="bi bi-check-circle me-2"></i> Improving our
                website and services
              </li>
              <li className="mb-2">
                <i className="bi bi-check-circle me-2"></i> Marketing purposes
              </li>
            </ul>
          </section>

          {/* Data Protection Section */}
          <section className="mb-5">
            <h2 className="h4 text-success">How We Protect Your Data</h2>
            <p className="text-muted">
              We implement various security measures to ensure the safety of
              your personal information and prevent unauthorized access.
            </p>
          </section>

          {/* Contact Section */}
          <section className="mb-5">
            <h2 className="h4 text-success">Contact Us</h2>
            <p className="text-muted">
              If you have any questions regarding this privacy policy, please
              feel free to contact us at:
            </p>
            <p className="text-muted">
              <strong>Email:</strong> support@yazasnkrz.com
            </p>
          </section>
        </main>
      </Layout>
    </>
  );
}

export default PrivacyPolicy;
