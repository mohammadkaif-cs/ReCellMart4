import React from 'react';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

const TermsAndConditions = () => {
  const sections = [
    {
      title: '1. Introduction',
      content: [
        "Welcome to ReCellMart. These terms and conditions outline the rules and regulations for the use of ReCellMart's Website.",
        "By accessing this website we assume you accept these terms and conditions. Do not continue to use ReCellMart if you do not agree to take all of the terms and conditions stated on this page.",
      ],
    },
    {
      title: '2. Open Box Delivery',
      content: [
        'ReCellMart provides an "Open Box Delivery" service for all products.',
        'This means you can inspect the physical condition of the product at the time of delivery.',
        'The delivery agent will open the package in your presence. You are required to check for any physical damage, defects, or missing accessories.',
        'Once you are satisfied with the physical condition of the product, you must accept the delivery.',
      ],
    },
    {
      title: '3. Return and Replacement Policy',
      content: [
        'No Returns After Acceptance: Once the product is accepted after the open box inspection, no returns will be accepted for physical damage, cosmetic issues, or missing accessories.',
        '24-Hour Replacement for Major Faults: If a major functional fault (e.g., device not turning on, screen not working, major software issue) is discovered within 24 hours of delivery, you are eligible for a replacement.',
        'To claim a replacement, you must contact our customer support within 24 hours with a detailed description of the issue and supporting evidence (photos/videos).',
        'Our technical team will verify the fault. If the claim is genuine, a replacement will be initiated. The replacement will be of the same model and condition, subject to availability.',
      ],
    },
    {
      title: '4. Warranty',
      content: [
        'All products sold on ReCellMart come with a specific warranty period, which will be clearly mentioned on the product page.',
        'The warranty covers functional defects but does not cover physical damage, water damage, or issues arising from unauthorized repairs or modifications.',
        'To claim warranty, please contact our support team with your order details and a description of the issue.',
      ],
    },
    {
      title: '5. User Responsibilities',
      content: [
        'You are responsible for providing accurate shipping and contact information.',
        'You are responsible for being present at the delivery location to receive and inspect the product.',
        'Any misuse, fraudulent activity, or violation of these terms may result in the termination of your account and future services.',
      ],
    },
    {
      title: '6. Limitation of Liability',
      content: [
        'ReCellMart is a marketplace for second-hand electronics. While we take utmost care in verifying and testing our products, we are not liable for any indirect, incidental, or consequential damages arising from the use of the products.',
        'Our liability is limited to the replacement or repair of the product as per our warranty and replacement policy.',
      ],
    },
    {
      title: '7. Governing Law',
      content: [
        'These terms and conditions are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.',
      ],
    },
    {
      title: '8. Changes to Terms',
      content: [
        'ReCellMart reserves the right to revise these terms and conditions at any time. By using this Website, you are expected to review these terms on a regular basis.',
      ],
    },
  ];

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <div className="text-center">
          <ShieldCheck className="mx-auto h-16 w-16 text-primary mb-4" />
          <h1 className="text-4xl font-extrabold text-primary">Terms & Conditions</h1>
          <p className="text-muted-foreground mt-2">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
        <div className="prose prose-lg max-w-none dark:prose-invert bg-card p-8 rounded-lg border border-border">
          {sections.map((section, index) => (
            <div key={index} className="mb-6">
              <h2 className="text-2xl font-semibold text-foreground">{section.title}</h2>
              <ul className="list-disc pl-5 space-y-2">
                {section.content.map((point, pIndex) => (
                  <li key={pIndex}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </motion.div>
    </Layout>
  );
};

export default TermsAndConditions;