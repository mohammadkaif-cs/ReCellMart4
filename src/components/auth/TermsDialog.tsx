import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TermsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: () => void;
}

const TermsDialog: React.FC<TermsDialogProps> = ({ open, onOpenChange, onAccept }) => {
  const [isScrolledToEnd, setIsScrolledToEnd] = useState(false);

  const termsData = [
    {
      title: '1. Return, Refund, and Exchange Policy',
      intro: 'At ReCellMart, we value your trust and aim to provide only verified, high-quality pre-owned smartphones. Every device we sell passes our strict 25-point verification before being listed for sale.',
      subsections: [
        {
          title: '1.1 All Sales Are Final',
          points: [
            'No Returns - Once a device is sold and delivered, it cannot be returned.',
            'No Refunds - We do not offer refunds, except in the rare case where the wrong product is delivered.',
            'No Exchanges - Devices cannot be exchanged for another model after purchase.',
          ],
        },
        {
          title: '1.2 Why We Don\'t Offer Returns/Refunds/Exchanges',
          points: [
            'Every phone is fully tested for functionality and quality before shipping.',
            'Detailed descriptions and real photos are provided before purchase.',
            'This policy helps us keep prices affordable and ensure fair transactions.',
          ],
        },
        {
          title: '1.3 Quality Assurance',
          points: [
            'Each phone undergoes a 25-point device verification (screen, battery health, camera, connectivity, security locks, etc.).',
            'Any cosmetic wear is mentioned in the listing and shown in photos.',
          ],
        },
        {
          title: '1.4 Exceptional Case',
          points: [
            'If the wrong product is delivered (different model, storage, or color), customers must:',
            'Contact us within 24 hours of delivery.',
            'Provide photos and proof of the incorrect item.',
            'We will arrange a free replacement or refund in such cases.',
          ],
        },
        {
          title: '1.5 Customer Responsibility',
          points: [
            'Before placing an order, customers should:',
            'Review the product description and images.',
            'Verify that the model, storage, and color meet their needs.',
          ],
        },
      ],
    },
    {
      title: '2. Privacy Policy',
      intro: 'We respect and protect your privacy.',
      subsections: [
        {
          title: '2.1 Data We Collect',
          points: [
            'Name, delivery address, and contact number for order processing.',
            'Optional: Email address for order updates.',
          ],
        },
        {
          title: '2.2 How We Use Your Data',
          points: ['To process and deliver your orders.', 'To contact you if needed about your purchase.'],
        },
        {
          title: '2.3 How We Protect Your Data',
          points: [
            'We do not sell or share your personal data with third parties, except delivery partners for fulfillment.',
            'Your data is stored securely and accessed only by authorized staff.',
          ],
        },
        {
          title: '2.4 Cookies & Tracking',
          points: ['We may use basic cookies to improve site performance and track visits.'],
        },
      ],
    },
    {
      title: '3. Shipping & Delivery Policy',
      subsections: [
        {
          title: '3.1 Delivery Area',
          points: [
            'We currently serve Kalyan, Bhiwandi, and Thane.',
            'Free 1-day delivery is available within our service area.',
          ],
        },
        {
          title: '3.2 Delivery Time',
          points: [
            'Orders placed before 3 PM: same-day or next-day delivery.',
            'Orders placed after 3 PM: next-day delivery.',
          ],
        },
        {
          title: '3.3 Delivery Process',
          points: [
            'Our delivery agent will contact you before arrival.',
            'Customers may inspect the phone on delivery - we provide a live demonstration to ensure it matches the listing.',
          ],
        },
        {
          title: '3.4 Failed Delivery',
          points: [
            'If you are unavailable, we will attempt redelivery once.',
            'Repeated failed deliveries may lead to order cancellation.',
          ],
        },
      ],
    },
    {
      title: '4. Fraud Prevention & Order Verification',
      points: [
        'ReCellMart reserves the right to cancel or refuse any order that appears suspicious, fraudulent, or violates these Terms & Conditions.',
        'For certain orders, especially high-value devices, we may require identity verification before dispatch (such as government ID, selfie with ID, OTP confirmation, or a small booking deposit for COD orders).',
        'Any attempt to scam, threaten, or defraud ReCellMart will result in immediate order cancellation and may be reported to local law enforcement under applicable laws.',
      ],
    },
    {
      title: '5. Limitation of Liability',
      intro: 'ReCellMart is not responsible for:',
      points: [
        'Any damage, defect, or malfunction that occurs after successful delivery and buyer acceptance.',
        'Loss of personal data, SIM cards, or accessories not included in the purchase.',
        'Indirect or consequential losses, including missed calls, lost contacts, or financial loss.',
        'Our maximum liability is strictly limited to the price paid for the product.',
      ],
    },
    {
      title: '6. Acceptance of Risk',
      intro: 'By purchasing from ReCellMart, the buyer acknowledges and agrees that:',
      points: [
        'They are buying a verified pre-owned device, not a brand-new product.',
        'The device has passed our 25-point verification process before sale.',
        'Minor cosmetic signs of use are normal and do not affect functionality.',
        'Once the buyer accepts the delivery, all responsibility for the device is transferred to the buyer.',
      ],
    },
  ];

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 10) {
      setIsScrolledToEnd(true);
    }
  };

  useEffect(() => {
    if (open) {
      setIsScrolledToEnd(false);
    }
  }, [open]);

  const handleAccept = () => {
    onAccept();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">Terms & Conditions</DialogTitle>
          <DialogDescription>
            Please review and accept our terms to continue. Last Updated: 12 August 2025
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-grow pr-6 -mr-6 my-4" onScroll={handleScroll}>
          <div className="space-y-6">
            {termsData.map((section, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold text-foreground mb-2">{section.title}</h3>
                {section.intro && <p className="text-sm text-muted-foreground mb-3">{section.intro}</p>}
                {section.subsections ? (
                  <div className="space-y-4">
                    {section.subsections.map((sub, subIndex) => (
                      <div key={subIndex}>
                        <h4 className="font-medium text-foreground/90">{sub.title}</h4>
                        <ul className="list-disc list-outside pl-5 space-y-1 text-sm text-muted-foreground">
                          {sub.points.map((point, pointIndex) => (
                            <li key={pointIndex}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul className="list-disc list-outside pl-5 space-y-1 text-sm text-muted-foreground">
                    {section.points?.map((point, pointIndex) => (
                      <li key={pointIndex}>{point}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
        <DialogFooter className="pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Decline</Button>
          <Button onClick={handleAccept} disabled={!isScrolledToEnd}>Accept & Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TermsDialog;