import { motion } from "framer-motion";
import {
  Shield,
  FileText,
  AlertCircle,
  Baby,
  Luggage,
  Receipt,
  UserCog,
  Lock,
} from "lucide-react";
import { useEffect } from "react";

const sections = [
  {
    title: "1. Personalised Meet & Greet Services",
    content:
      "All guests who have pre-booked services with Fiji Rides will be personally met and assisted on arrival (at arrival concourse) by our professional and friendly airport team. This is a complimentary service.",
    icon: Shield,
  },
  {
    title: "Cancellation Policy and Refund Policy",
    content: [
      "No cancellation fees for Arrival Transfer Bookings where the cancellation is received and acknowledged at least 72 hours prior to the guest's expected arrival into the country.",
      "Cancellations made within 72 hours will be charged 50% of the total cost, and cancellations made within 24 hours of the day of arrival will be charged 100%.",
      "A non-refundable administration fee of 3.5% of the total value of the booking will apply to all refunds.",
      "Refunds: will be processed to the original payment method within 7 business days from the date of cancellation confirmation. Customers are responsible for any bank fees or transaction charges associated with the refund.",
      "Flight delays: In cases of flight delays, customers must notify Fiji Rides of any changes to their flight schedule no later than 2 hours before the scheduled transfer time to avoid cancellation fees. Postponements due to flight delays, where the service is re-booked, will not incur fees, provided the rebooking is within 24 hours of the original transfer time.",
      "Medical or emergency cancellations: If a customer is unable to make the transfer due to a medical emergency or other special circumstances (such as severe weather or travel disruptions), the customer must provide supporting documentation within 24 hours of the scheduled service. In such cases, Fiji Rides will offer a full refund or a rebooking without fees, at the customer's discretion.",
      "Acknowledgment of Cancellation: A cancellation is considered confirmed once the customer receives an official acknowledgment (via email) from Fiji Rides. If acknowledgment is not received within 1 hour of submitting the cancellation, customers should contact our support team to ensure proper documentation of the request.",
    ],
    icon: FileText,
  },
  {
    title: "No Show Policy (where booking has NOT been cancelled or postponed)",
    content: [
      "Private Transfers from Nadi International Airport - 100% charge",
      "Private Transfers from hotels or ports - full charge. Maximum waiting time for a private / charter transfer is 30 minutes at pick up point after which the driver will get a hotel porter to sign off in cases of No Shows.",
    ],
    icon: AlertCircle,
  },
  {
    title: "Unexpected Guests",
    content:
      "For all genuine unexpected guests, a Private Transfers rate will be charged",
    icon: UserCog,
  },
  {
    title: "Child Policy",
    content:
      "Baby Car seats are available on a complimentary basis; however, due to limited inventory, this must be prebooked and will be on a first come, first served basis.",
    icon: Baby,
  },
  {
    title: "Excess Luggage",
    content: [
      "Standard Luggage Allowance: Each guest is allowed 1 standard sized suitcase. Any additional luggage or oversized items will incur excess baggage fees.",
      "Excess Items: Surfboards, golf bags, baby prams, boxes, extra suite cases, and similar large items are considered excess luggage. These items must be pre-registered at least 24 hours before arrival.",
      "Additional Charges: Excess luggage will incur an additional charge for either extra space or a larger vehicle, depending on availability. Fees must be paid in cash directly to customer service upon arrival.",
      "Payment Confirmation: All excess luggage fees will be confirmed with a receipt. No exceptions will be made for unregistered or unnotified excess luggage.",
      "Liability: Fiji Rides is not responsible for any damage to excess luggage or items not pre-approved.",
    ],
    icon: Luggage,
  },
  {
    title: "Government Taxes",
    content: [
      "IMPORTANT NOTE: Rates are subject to change if Fiji Government Taxes Change.",
      "All rates issued are net, in Fiji Dollars and include the applicable Government taxes - VAT 15%",
    ],
    icon: Receipt,
  },
  {
    title: "Customer Responsibility",
    content: [
      "Customers are responsible for ensuring that cancellation requests are submitted via the official booking platform (email, website, or app) and are advised to retain any confirmation receipts or communication for their records.",
      "Customers should double-check the cancellation timing based on the local time zone and account for any potential discrepancies.",
    ],
    icon: UserCog,
  },
  {
    title: "Changes to Policy",
    content:
      "Fiji Rides reserves the right to update or amend this policy at any time. Any changes will be communicated to customers via email or our website and will apply to all future bookings after the date of the update.",
    icon: FileText,
  },
  {
    title: "Privacy Policy",
    content:
      "Fiji Rides collects and stores personal information securely to provide travel services and advice, process bookings, and facilitate payments. Your data may be shared with suppliers (e.g., airlines, hotels) to complete travel arrangements. We do not store credit card details and will notify you of relevant offers from us and our partners. Your privacy is protected, and your information is not sold to third parties.",
    icon: Lock,
  },
];

function TermsPage() {
  useEffect(() => {
    document.body.classList.add('terms-page');
    return () => document.body.classList.remove('terms-page');
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <div className="bg-white min-h-screen pt-24">
      <div className="mx-auto max-w-4xl px-6 pb-24 lg:px-8">
        <motion.div
          className="space-y-2 mb-12"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h1
            className="text-4xl font-bold text-secondary-900 mb-6 text-center"
            variants={itemVariants}
          >
            Terms and Conditions
          </motion.h1>
          
          <motion.p 
            className="text-secondary-600 text-sm mb-8"
            variants={itemVariants}
          >
            Please read these Terms and Conditions ("Terms", "Terms and Conditions") carefully before using the Fiji Rides services. Your access to and use of the service is conditioned on your acceptance of and compliance with these Terms.
          </motion.p>
        </motion.div>

        <motion.div
          className="space-y-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {sections.map((section) => (
            <motion.div
              key={section.title}
              className="relative bg-white rounded-lg p-6 shadow-sm border border-gray-100"
              variants={itemVariants}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-primary-50 p-2.5 rounded-lg">
                  <section.icon className="h-5 w-5 text-primary-600" />
                </div>
                <h2 className="text-xl font-semibold text-secondary-900">
                  {section.title}
                </h2>
              </div>
              <div className="pl-[52px]">
                {Array.isArray(section.content) ? (
                  <ul className="space-y-3">
                    {section.content.map((item, index) => (
                      <li
                        key={item + index}
                        className="text-secondary-700 leading-relaxed flex items-start gap-2 text-sm"
                      >
                        <span className="h-1.5 w-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-secondary-700 leading-relaxed text-sm">
                    {section.content}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="mt-12 text-center text-sm text-secondary-500"
          variants={itemVariants}
        >
          For any questions regarding these Terms and Conditions, please contact us at <a href="mailto:support@fijirides.com" className="text-primary-600 hover:underline">support@fijirides.com</a>
        </motion.div>
      </div>
    </div>
  );
}

export default TermsPage;
