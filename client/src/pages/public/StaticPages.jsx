import { Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import AppNavbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

export const NotFoundPage = () => (
  <div>
    <AppNavbar />
    <div className="page-wrapper d-flex align-items-center justify-content-center" style={{ background: 'var(--bg-secondary)' }}>
      <Container className="text-center py-5">
        <div style={{ fontSize: '6rem' }}>🗺️</div>
        <h1 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '4rem', color: 'var(--primary)' }}>404</h1>
        <h2 className="fw-bold mb-3">Destination Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Looks like you've wandered off the map. This page doesn't exist.
        </p>
        <Link to="/" className="btn btn-primary px-5">Back to Home</Link>
      </Container>
    </div>
    <Footer />
  </div>
);

export const AboutPage = () => (
  <div>
    <AppNavbar />
    <div className="page-wrapper py-5" style={{ background: 'var(--bg-secondary)' }}>
      <Container style={{ maxWidth: 800 }}>
        <h2 className="section-title">About Travel Buddy</h2>
        <div className="tb-card p-5">
          <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>✈️</div>
          <h4 className="fw-bold mb-3">Your All-in-One Travel Planning Companion</h4>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9 }}>
            Travel Buddy is a comprehensive travel planning platform designed to make every trip seamless and memorable. Whether you're a solo adventurer or planning a family vacation, we have everything you need in one place.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9 }}>
            From AI-powered itinerary generation and hotel bookings to train and bus reservations, from discovering hidden gems to connecting with a community of travellers — Travel Buddy is your complete travel companion.
          </p>
          <div className="row g-4 mt-3">
            {[
              { icon: '🤖', title: 'AI-Powered', desc: 'Smart itinerary generation tailored to your preferences' },
              { icon: '🔒', title: 'Secure Booking', desc: 'All bookings protected with industry-standard security' },
              { icon: '💎', title: 'Hidden Gems', desc: 'Curated local spots you won\'t find in guidebooks' },
              { icon: '🌍', title: 'Community', desc: 'Real stories from real travellers across the globe' },
            ].map((f) => (
              <div key={f.title} className="col-6">
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{f.icon}</div>
                <div className="fw-semibold">{f.title}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
    <Footer />
  </div>
);

export const FAQPage = () => (
  <div>
    <AppNavbar />
    <div className="page-wrapper py-5" style={{ background: 'var(--bg-secondary)' }}>
      <Container style={{ maxWidth: 800 }}>
        <h2 className="section-title">Frequently Asked Questions</h2>
        <p className="section-subtitle">Everything you need to know about Travel Buddy</p>
        <div className="d-flex flex-column gap-3">
          {[
            { q: 'How do I create a trip plan?', a: 'Click "Plan a Trip" in the navigation or dashboard. Select your destination, dates, and number of travelers. You can use our AI generator for an instant itinerary, or build your own day-by-day plan manually.' },
            { q: 'Can I cancel my hotel booking?', a: 'Yes! Go to My Bookings → Hotels and click "Cancel" on your booking. Refund eligibility depends on the cancellation policy for each property. You can track your refund status in the Refunds tab.' },
            { q: 'How does the Hidden Gems feature work?', a: 'Hidden Gems are curated lesser-known spots in each city, added by our local experts. They also include famous local food spots. Visit any city page and click "Hidden Gems" to discover them.' },
            { q: 'Can I export my itinerary?', a: 'You can view your complete itinerary on the trip detail page with a map view. You can also switch between map and list views for easy reference during your trip.' },
            { q: 'Is the AI itinerary generator free?', a: 'Yes! The AI trip planner is included for all registered users at no additional cost.' },
            { q: 'How do I contact support?', a: 'Use the Support Chat feature in your dashboard. Our team typically responds within 24 hours.' },
          ].map((faq, i) => (
            <div key={i} className="tb-card p-4">
              <h6 className="fw-bold mb-2">Q: {faq.q}</h6>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </Container>
    </div>
    <Footer />
  </div>
);

export const TermsPage = () => (
  <div>
    <AppNavbar />
    <div className="page-wrapper py-5" style={{ background: 'var(--bg-secondary)' }}>
      <Container style={{ maxWidth: 800 }}>
        <h2 className="section-title">Terms of Service</h2>
        <div className="tb-card p-5">
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Last updated: {new Date().toLocaleDateString()}</p>
          {['Acceptance of Terms', 'Use of Service', 'Booking & Payments', 'Cancellation & Refunds', 'User Content', 'Limitation of Liability'].map((section, i) => (
            <div key={i} className="mb-4">
              <h5 className="fw-bold">{i + 1}. {section}</h5>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                By using Travel Buddy, you agree to these terms. Our platform provides travel planning services including itinerary generation, hotel bookings, and transport bookings. We reserve the right to update these terms at any time.
              </p>
            </div>
          ))}
        </div>
      </Container>
    </div>
    <Footer />
  </div>
);

export const PrivacyPage = () => (
  <div>
    <AppNavbar />
    <div className="page-wrapper py-5" style={{ background: 'var(--bg-secondary)' }}>
      <Container style={{ maxWidth: 800 }}>
        <h2 className="section-title">Privacy Policy</h2>
        <div className="tb-card p-5">
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Last updated: {new Date().toLocaleDateString()}</p>
          {['Information We Collect', 'How We Use Your Data', 'Data Security', 'Third-Party Services', 'Your Rights', 'Contact Us'].map((section, i) => (
            <div key={i} className="mb-4">
              <h5 className="fw-bold">{i + 1}. {section}</h5>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                We collect only the information necessary to provide our services. Your data is encrypted and never sold to third parties. You can request deletion of your data at any time through your account settings.
              </p>
            </div>
          ))}
        </div>
      </Container>
    </div>
    <Footer />
  </div>
);
