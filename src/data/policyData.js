import { BUSINESS_CONTACT } from './constants.js'

const supportInstruction = `For support, email ${BUSINESS_CONTACT.email} with your order number, registered phone number, and clear photos wherever relevant.`

export const POLICIES = {
  privacy: {
    eyebrow: 'Satvegik Customer Privacy',
    title: 'Privacy Policy',
    effectiveDate: 'Effective as of May 15, 2026',
    intro:
      'Satvegik respects customer privacy and handles personal information only for legitimate ecommerce, fulfilment, payment, support, and legal purposes.',
    contactText: `Privacy questions, correction requests, and deletion requests can be sent to ${BUSINESS_CONTACT.email}.`,
    contactLabel: 'Email Privacy Support',
    contactHref: `mailto:${BUSINESS_CONTACT.email}`,
    sections: [
      {
        id: 'information-collected',
        title: 'Information We Collect',
        blocks: [
          {
            type: 'paragraph',
            text:
              'When you browse, create an account, place an order, or contact Satvegik, we collect information needed to operate an online nut butter store. This may include your name, email address, phone number, billing and shipping address, pincode, order history, cart details, product preferences, customer messages, and account login details.',
          },
          {
            type: 'paragraph',
            text:
              'For payment and order verification, we may receive transaction status, payment reference IDs, checkout session details, refund status, and fraud-prevention signals from our payment and fulfilment partners. Satvegik does not store complete card numbers, CVV, UPI PINs, or banking passwords.',
          },
          {
            type: 'list',
            items: [
              'Contact details are collected to confirm orders, send invoices, coordinate delivery, and respond to support requests.',
              'Shipping details are collected to estimate serviceability, courier charges, dispatch orders, and share tracking updates.',
              'Order and payment records are retained for accounting, GST, fraud prevention, dispute resolution, and customer service.',
            ],
          },
        ],
      },
      {
        id: 'how-we-use-data',
        title: 'How We Use Customer Data',
        blocks: [
          {
            type: 'paragraph',
            text:
              'Satvegik uses customer data to process orders, collect payment, pack and ship products, issue order updates, manage cancellations or refunds, prevent misuse, improve product availability, and maintain customer accounts.',
          },
          {
            type: 'list',
            items: [
              'To confirm order placement, payment status, dispatch status, delivery attempts, and refund updates.',
              'To estimate shipping charges and delivery timelines based on pincode and courier coverage.',
              'To answer product, allergen, ingredient, shipping, payment, and complaint-related queries.',
              'To improve website performance, checkout reliability, inventory planning, and customer experience.',
            ],
          },
          {
            type: 'callout',
            text:
              'Marketing messages, if used, are limited to Satvegik updates and offers. Customers may opt out of promotional communication, but transactional order updates may still be sent.',
          },
        ],
      },
      {
        id: 'payments-security',
        title: 'Payments and Security',
        blocks: [
          {
            type: 'paragraph',
            text:
              'Online payments on Satvegik are completed through authorized payment partners such as PhonePe. Customers are redirected to a secure payment flow for UPI, cards, wallets, or netbanking, depending on the options available at checkout.',
          },
          {
            type: 'paragraph',
            text:
              'Satvegik receives only the payment result and transaction reference required to confirm the order, reconcile payment, handle refunds, and respond to disputes. Sensitive payment credentials are handled by the payment provider and are not stored on Satvegik servers.',
          },
          {
            type: 'list',
            items: [
              'We use HTTPS-enabled production hosting and access-controlled backend services.',
              'Only authorized operational personnel may access customer order data for fulfilment, support, accounting, or compliance.',
              'No method of transmission is risk-free, but we take reasonable technical and organizational safeguards to protect customer information.',
            ],
          },
        ],
      },
      {
        id: 'cookies-analytics',
        title: 'Cookies and Analytics',
        blocks: [
          {
            type: 'paragraph',
            text:
              'Satvegik may use cookies, local storage, session identifiers, and similar technologies to keep customers signed in, remember cart activity, improve checkout continuity, measure website usage, and detect technical errors.',
          },
          {
            type: 'list',
            items: [
              'Essential cookies support account sessions, cart state, checkout flow, security, and fraud prevention.',
              'Analytics tools may collect device type, browser, approximate location, pages visited, referral source, and interaction events.',
              'Customers can restrict cookies through browser settings, but some account, cart, or checkout features may stop working correctly.',
            ],
          },
        ],
      },
      {
        id: 'third-parties',
        title: 'Third-Party Services',
        blocks: [
          {
            type: 'paragraph',
            text:
              'Satvegik shares necessary information with service providers who help run the ecommerce business. These may include payment gateways, courier aggregators, shipping partners, email/SMS providers, hosting providers, analytics tools, fraud-prevention services, and accounting or compliance systems.',
          },
          {
            type: 'list',
            items: [
              'Payment partners process transactions and share payment confirmation, failure, refund, and dispute status.',
              'Shipping partners receive package and delivery details required to pick up, track, and deliver orders.',
              'Support and communication tools may process customer messages and transactional updates.',
            ],
          },
          {
            type: 'callout',
            text:
              'Satvegik does not sell customer personal data. Information is shared only when needed to provide services, meet legal obligations, prevent fraud, or protect customers and the business.',
          },
        ],
      },
      {
        id: 'retention-rights',
        title: 'Data Retention and Customer Rights',
        blocks: [
          {
            type: 'paragraph',
            text:
              'Order, payment, invoice, tax, support, and shipment records may be retained for as long as required for business operations, warranty/support history, fraud prevention, accounting, tax compliance, and applicable Indian law.',
          },
          {
            type: 'list',
            items: [
              'Customers may request correction of inaccurate account or delivery information.',
              'Customers may request deletion of account information where retention is not required for legal, tax, fraud-prevention, or dispute purposes.',
              `Requests can be sent to ${BUSINESS_CONTACT.email}. We may verify identity before acting on a privacy request.`,
            ],
          },
        ],
      },
    ],
  },
  terms: {
    eyebrow: 'Satvegik Ecommerce Terms',
    title: 'Terms & Conditions',
    effectiveDate: 'Effective as of May 15, 2026',
    intro:
      'These terms apply to use of the Satvegik website, customer accounts, product listings, order placement, online payments, shipping, cancellations, refunds, and support interactions.',
    contactText: `Questions about these Terms & Conditions can be sent to ${BUSINESS_CONTACT.email}.`,
    contactLabel: 'Email Customer Support',
    contactHref: `mailto:${BUSINESS_CONTACT.email}`,
    sections: [
      {
        id: 'website-product-use',
        title: 'Website and Product Use',
        blocks: [
          {
            type: 'paragraph',
            text:
              'Satvegik sells packaged nut butter and related food products for personal consumption through its ecommerce website. Customers must provide accurate account, contact, billing, and shipping information while placing an order.',
          },
          {
            type: 'list',
            items: [
              'Products must be used in accordance with the label, ingredient information, allergen information, and storage instructions.',
              'Customers are responsible for checking ingredients before purchase, especially in case of nut, seed, gluten, dairy, or other food allergies.',
              'The website may not be used for unlawful activity, fraudulent orders, payment misuse, automated scraping, impersonation, or interference with website security.',
            ],
          },
          {
            type: 'callout',
            text:
              'Satvegik products may contain nuts, seeds, or traces of common allergens. Customers with allergies should review product information carefully before ordering.',
          },
        ],
      },
      {
        id: 'orders-acceptance',
        title: 'Order Acceptance',
        blocks: [
          {
            type: 'paragraph',
            text:
              'An order is placed when a customer submits checkout details and completes the required payment step. Order confirmation is subject to successful payment, product availability, serviceable delivery pincode, and internal verification.',
          },
          {
            type: 'list',
            items: [
              'Satvegik may cancel or modify an order if inventory is unavailable, payment fails, customer details are incomplete, courier service is unavailable, or the order appears fraudulent.',
              'If an accepted order cannot be fulfilled, Satvegik will contact the customer and arrange a replacement, store credit, cancellation, or refund as applicable.',
              'Customers must review the cart, quantity, product variant, address, phone number, and pincode before completing checkout.',
            ],
          },
        ],
      },
      {
        id: 'pricing-payments',
        title: 'Pricing and Payment Terms',
        blocks: [
          {
            type: 'paragraph',
            text:
              'Prices are displayed in Indian Rupees and may include or exclude taxes, shipping charges, discounts, or promotional offers as shown at checkout. The final payable amount is displayed before payment is initiated.',
          },
          {
            type: 'list',
            items: [
              'Satvegik may update product prices, offers, shipping charges, and availability without prior notice.',
              'Online payments are processed through authorized payment partners such as PhonePe. Payment success is subject to confirmation from the payment provider.',
              'If money is debited but the order is not confirmed, Satvegik will verify the transaction and assist with order confirmation or refund according to payment partner timelines.',
            ],
          },
          {
            type: 'callout',
            text:
              'Do not share UPI PINs, card OTPs, banking passwords, or payment credentials with anyone claiming to represent Satvegik. Satvegik support will never ask for sensitive payment authentication details.',
          },
        ],
      },
      {
        id: 'shipping-risk',
        title: 'Shipping and Delivery',
        blocks: [
          {
            type: 'paragraph',
            text:
              'Shipping timelines, courier availability, and charges are governed by the selected delivery partner and customer pincode. Risk of delay may increase during festivals, severe weather, high-demand periods, operational disruptions, or remote-location delivery.',
          },
          {
            type: 'paragraph',
            text:
              'Customers must ensure that the delivery address and phone number are accurate and reachable. Failed delivery due to incorrect address, unavailable recipient, or repeated unsuccessful attempts may result in return-to-origin handling and additional charges where applicable.',
          },
        ],
      },
      {
        id: 'intellectual-property',
        title: 'Intellectual Property',
        blocks: [
          {
            type: 'paragraph',
            text:
              'The Satvegik name, logo, product names, website design, text, photographs, product imagery, packaging style, recipes, and other content are owned by Satvegik or used with permission. They may not be copied, reproduced, modified, sold, or used commercially without written approval.',
          },
          {
            type: 'paragraph',
            text:
              'Customers may share genuine product photos or reviews for personal, non-commercial use, provided the content is not misleading, defamatory, or falsely presented as official Satvegik material.',
          },
        ],
      },
      {
        id: 'liability-disputes',
        title: 'Liability, Disputes, and Governing Law',
        blocks: [
          {
            type: 'paragraph',
            text:
              'Satvegik is responsible for fulfilling accepted orders with reasonable care. However, we are not liable for indirect losses, loss of profits, allergic reactions from known or disclosed ingredients, delays caused by third-party logistics, payment network failures, or circumstances beyond reasonable control.',
          },
          {
            type: 'list',
            items: [
              `Customer complaints should first be raised with Satvegik at ${BUSINESS_CONTACT.email} so the support team can investigate and resolve the issue.`,
              'Disputes will be handled in good faith using order records, payment references, shipment logs, customer communication, and applicable policy terms.',
              'These terms are governed by the laws of India. Any unresolved dispute is subject to the jurisdiction of competent courts in the place of Satvegik business registration, unless applicable law requires otherwise.',
            ],
          },
        ],
      },
    ],
  },
  shipping: {
    eyebrow: 'Satvegik Delivery Information',
    title: 'Shipping Policy',
    effectiveDate: 'Effective as of May 15, 2026',
    intro:
      'Satvegik ships packaged nut butter orders across serviceable Indian pincodes through courier and logistics partners selected at checkout or during fulfilment.',
    contactText: `Shipping questions can be sent to ${BUSINESS_CONTACT.email}. Include your order number and delivery pincode for faster support.`,
    contactLabel: 'Email Shipping Support',
    contactHref: `mailto:${BUSINESS_CONTACT.email}`,
    sections: [
      {
        id: 'processing-timelines',
        title: 'Order Processing Timelines',
        blocks: [
          {
            type: 'paragraph',
            text:
              'Orders are normally reviewed, packed, and handed to the courier within 1 to 2 business days after payment confirmation. Orders placed late in the day, on Sundays, public holidays, or during high-volume sale periods may require additional processing time.',
          },
          {
            type: 'list',
            items: [
              'Processing begins only after payment success and basic order verification.',
              'Perishable or food-sensitive packaging is checked before dispatch to reduce leakage or transit damage.',
              'Customers may receive separate updates for order confirmation, dispatch, shipment tracking, and delivery attempts.',
            ],
          },
        ],
      },
      {
        id: 'delivery-timelines',
        title: 'Estimated Delivery Timelines',
        blocks: [
          {
            type: 'paragraph',
            text:
              'Estimated delivery timelines depend on customer pincode, courier coverage, pickup schedules, and route availability. Most serviceable metro and urban locations are delivered within 3 to 7 business days after dispatch. Remote, rural, or hard-to-service locations may take 7 to 10 business days or longer.',
          },
          {
            type: 'callout',
            text:
              'Delivery dates shown at checkout or in tracking are estimates, not guaranteed delivery commitments. Courier delays can occur after dispatch even when Satvegik has shipped on time.',
          },
        ],
      },
      {
        id: 'shipping-partners',
        title: 'Shipping Partners and Charges',
        blocks: [
          {
            type: 'paragraph',
            text:
              'Satvegik may use courier aggregators and shipping partners such as Shiprocket-enabled courier networks or similar logistics providers. The available courier options and shipping charges may vary by pincode, package weight, delivery speed, and partner serviceability.',
          },
          {
            type: 'list',
            items: [
              'Shipping charges, if applicable, are displayed separately in the order summary before payment.',
              'Free shipping or discounted shipping may be offered during promotions or above eligible order values.',
              'If a selected courier becomes unavailable after checkout, Satvegik may assign another suitable courier for fulfilment.',
            ],
          },
        ],
      },
      {
        id: 'coverage',
        title: 'Shipping Coverage',
        blocks: [
          {
            type: 'paragraph',
            text:
              'Satvegik currently ships within India to pincodes supported by available courier partners. Some locations may be temporarily unavailable due to operational restrictions, weather, local disruptions, regulatory limitations, or courier service constraints.',
          },
          {
            type: 'paragraph',
            text:
              'If an order is placed for a non-serviceable pincode, Satvegik may contact the customer for an alternate address or cancel the order and initiate a refund according to the Refund Policy.',
          },
        ],
      },
      {
        id: 'tracking',
        title: 'Tracking and Delivery Attempts',
        blocks: [
          {
            type: 'paragraph',
            text:
              'Once the order is dispatched, tracking details are shared by email, SMS, WhatsApp, account dashboard, or another available communication channel. Tracking may take up to 24 hours to update after courier pickup.',
          },
          {
            type: 'list',
            items: [
              'Customers should keep the registered phone number reachable for courier calls and delivery OTPs where applicable.',
              'If tracking shows an exception, failed attempt, or address issue, customers should contact Satvegik support promptly.',
              'Repeated failed delivery attempts may lead to return-to-origin. Reshipping may require additional charges depending on the case.',
            ],
          },
        ],
      },
      {
        id: 'delays-disclaimers',
        title: 'Delays and Delivery Issues',
        blocks: [
          {
            type: 'paragraph',
            text:
              'Courier delays may occur due to weather, festivals, strikes, lockdowns, network congestion, address issues, customer unavailability, route restrictions, or force majeure events. Satvegik will assist with follow-up but cannot control every courier-side delay after dispatch.',
          },
          {
            type: 'paragraph',
            text:
              'If the parcel appears tampered, leaking, damaged, or missing items at delivery, customers should take photos of the outer package, shipping label, inner packaging, and product condition before raising a support request.',
          },
        ],
      },
    ],
  },
  refund: {
    eyebrow: 'Satvegik Refunds and Cancellations',
    title: 'Refund Policy',
    effectiveDate: 'Effective as of May 15, 2026',
    intro:
      'Satvegik handles cancellations, replacements, and refunds with care because nut butter is a packaged food product and cannot be restocked once opened or mishandled after delivery.',
    contactText: supportInstruction,
    contactLabel: 'Email Refund Support',
    contactHref: `mailto:${BUSINESS_CONTACT.email}`,
    sections: [
      {
        id: 'eligibility',
        title: 'Refund Eligibility',
        blocks: [
          {
            type: 'paragraph',
            text:
              'Refunds, replacements, or store credit may be considered when an order is prepaid and cannot be fulfilled, is delivered with the wrong item, arrives damaged or leaking, is missing an item, or is confirmed lost in transit by the courier.',
          },
          {
            type: 'list',
            items: [
              'Damaged, leaking, wrong, or missing-item claims must be raised within 24 hours of delivery.',
              'Customers must share order number, registered phone/email, parcel photos, product photos, label photos, and batch details where available.',
              'Satvegik may request additional information before approving a refund, replacement, or store credit.',
            ],
          },
        ],
      },
      {
        id: 'damaged-wrong-items',
        title: 'Damaged or Wrong Item Handling',
        blocks: [
          {
            type: 'paragraph',
            text:
              'If the product is damaged, leaking, visibly compromised, or different from what was ordered, do not consume the product. Keep the original product, jar, cap, packaging, and invoice until Satvegik completes review.',
          },
          {
            type: 'list',
            items: [
              'If the claim is approved, Satvegik may offer replacement, refund to the original payment method, or store credit depending on stock availability and issue severity.',
              'Replacement dispatch is subject to courier serviceability and inventory availability.',
              'False, incomplete, or unverifiable claims may be rejected after review.',
            ],
          },
        ],
      },
      {
        id: 'return-policy',
        title: 'Return Policy',
        blocks: [
          {
            type: 'paragraph',
            text:
              'Returns are accepted within 7 days of delivery, subject to product condition verification and approval by Satvegik support.',
          },
          {
            type: 'list',
            items: [
              'Products must be unused, unopened, and returned in their original packaging wherever applicable.',
              'Return requests raised after 7 days of delivery may not be eligible for approval.',
              'Food products that are opened, consumed, tampered with, or improperly stored after delivery may not qualify for return.',
            ],
          },
        ],
      },
      {
        id: 'cancellations',
        title: 'Cancellation Rules',
        blocks: [
          {
            type: 'paragraph',
            text:
              'Customers may request cancellation before the order is packed or handed over to the courier. Once an order is packed, dispatched, or picked up by the courier, cancellation may not be possible because packaged food items enter the fulfilment chain.',
          },
          {
            type: 'list',
            items: [
              'If cancellation is approved before dispatch, the paid amount will be refunded according to payment partner timelines.',
              'If the customer provides an incorrect address or refuses delivery after dispatch, shipping and return costs may be deducted where applicable.',
              'Satvegik may cancel an order if payment fails, inventory is unavailable, the delivery pincode is not serviceable, or the order appears fraudulent.',
            ],
          },
        ],
      },
      {
        id: 'refund-timelines',
        title: 'Refund Timelines',
        blocks: [
          {
            type: 'paragraph',
            text:
              'Approved refunds are initiated to the original payment method used at checkout. After Satvegik initiates the refund, the amount generally reflects within 5 to 7 business days, depending on the payment provider, bank, UPI app, card issuer, or wallet provider.',
          },
          {
            type: 'paragraph',
            text:
              'If a payment was debited but the order was not confirmed, Satvegik will verify the payment status with the payment partner. Duplicate or failed-payment refunds follow payment gateway and banking timelines.',
          },
          {
            type: 'callout',
            text:
              'Refund timelines may extend during bank holidays, payment gateway downtime, or when additional verification is required by the payment provider.',
          },
        ],
      },
      {
        id: 'non-refundable',
        title: 'Non-Refundable Conditions',
        blocks: [
          {
            type: 'list',
            items: [
              'Opened, used, altered, or partially consumed food products are not eligible for return or refund unless a verified quality issue is confirmed.',
              'Taste preference, natural oil separation, texture variation, delayed opening after delivery, or failure to follow storage instructions is not treated as product damage.',
              'Orders delayed due to incorrect address, unreachable phone number, customer unavailability, or courier delay are not automatically eligible for refund.',
              'Discount codes, gift offers, and promotional benefits may not be refundable unless required as part of an approved order refund.',
            ],
          },
          {
            type: 'callout',
            text:
              'Natural oil separation can occur in real nut butter. Stirring well before use is normal and does not indicate spoilage or damage.',
          },
        ],
      },
      {
        id: 'support-process',
        title: 'Support Process',
        blocks: [
          {
            type: 'paragraph',
            text: supportInstruction,
          },
          {
            type: 'list',
            items: [
              'Support requests are reviewed using order records, payment status, shipment logs, delivery proof, photos, and customer communication.',
              'Satvegik will communicate the approved resolution by email, phone, WhatsApp, or account update where available.',
              'Customers should preserve the product and packaging until the case is closed, especially for damaged or wrong-item claims.',
            ],
          },
        ],
      },
    ],
  },
}
