import { BUSINESS_CONTACT } from './constants.js'

const artisanWorkshopImages = [
  {
    alt: 'Golden nut butter texture',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAch-eiaH2m_aJQKfmAAJmpPYopICKxUckqputO2nPKTq8fKxVaCHXhZ8N8WsGJyWnThGI4NB54HnMfXVUxe_mOzooWEsVSUvK-pmHEHcR_4N16s48DApikwZQCfJM66tHoIw5D2OZJt7TsNpaF4O2D3mvfmi1v5MntytU5kxhZu4rAteD7vfHwsGfupCkWWzMH0HdcxAVC_jJ_jvc7-VmvvLVdpv5_sz0Q6oDcEYhY5NhtaP1zSkbRLjHVClHb89j5WvFgam3IEOU',
  },
  {
    alt: 'Artisan workshop with wooden tools',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKQWgOBhfsXG4PzZjvzmUAiSbP03haHIx5riI3FHjF9N8eAlVK1aq76LXiyLvbph3rItNYgYNRHQx5PZc36AiM244capVqmO0NiYj7nDnf92bPqwHq6nBkx45znexawQ5INNU-ymGC1I91CE1YuJb-D1dJEYNC3G3EwJT7bmRiqJJ32X2E7BXdDw7nlUDyWqTjSrBt5nURQesLOSkzfSeya_pVKxlWF9jxMSyHP4IWIG60x-9RJgSkZgk62K8anyK_hBQXhhz_KV0',
  },
]

export const POLICIES = {
  privacy: {
    eyebrow: 'Satvegik',
    title: 'Privacy Policy',
    effectiveDate: 'Effective as of May 14, 2024',
    intro:
      'Your trust matters to us. This policy explains how we collect, use, and protect information when you browse, shop, or contact Satvegik.',
    contactText: 'Questions about this Privacy Policy should be directed to our care team.',
    contactLabel: 'Contact Privacy Care',
    contactHref: `mailto:${BUSINESS_CONTACT.email}`,
    sections: [
      {
        id: 'collection',
        title: 'Information We Collect',
        blocks: [
          {
            type: 'paragraph',
            text:
              'We collect the information you choose to share with us, including your name, email address, phone number, shipping address, billing details, and messages sent through our contact forms.',
          },
          {
            type: 'paragraph',
            text:
              'We may also collect basic usage information such as pages visited, device type, browser type, and referral source so we can improve our website experience.',
          },
          {
            type: 'callout',
            text:
              'We only ask for details that help us prepare your order, answer your questions, and keep your experience with Satvegik smooth and personal.',
          },
        ],
      },
      {
        id: 'usage',
        title: 'How We Use Information',
        blocks: [
          {
            type: 'list',
            items: [
              'To process purchases, payments, delivery updates, returns, and support requests.',
              'To send order confirmations, account notices, product care notes, and optional marketing updates.',
              'To improve website performance, product discovery, customer service, and fraud prevention.',
            ],
          },
        ],
      },
      {
        id: 'sharing',
        title: 'Sharing & Service Partners',
        blocks: [
          {
            type: 'paragraph',
            text:
              'We share information only with trusted partners who help us operate the store, such as payment processors, delivery partners, analytics providers, and email service providers.',
          },
          {
            type: 'paragraph',
            text:
              'We do not sell your personal information. Service partners may use your information only to perform work for Satvegik or as required by law.',
          },
        ],
      },
      {
        id: 'choices',
        title: 'Your Choices',
        blocks: [
          {
            type: 'paragraph',
            text:
              'You may request access, correction, or deletion of your personal information by contacting us. You can also unsubscribe from marketing emails at any time using the link in the message.',
          },
        ],
      },
    ],
  },
  terms: {
    eyebrow: 'Satvegik',
    title: 'Terms & Conditions',
    effectiveDate: 'Effective as of May 14, 2024',
    intro:
      'Please read these terms carefully before browsing our website, placing an order, or engaging with our handcrafted collections.',
    contactText: 'Questions regarding these Terms & Conditions should be directed to our concierge team.',
    contactLabel: 'Contact Concierge',
    contactHref: `mailto:${BUSINESS_CONTACT.email}`,
    sections: [
      {
        id: 'usage',
        title: 'Website Usage Terms',
        blocks: [
          {
            type: 'paragraph',
            text:
              'By accessing Satvegik, you represent that you are at least the age of majority in your place of residence. You may not use our products or services for any illegal or unauthorized purpose.',
          },
          {
            type: 'paragraph',
            text:
              'A breach or violation of these terms may result in immediate termination of service. We reserve the right to refuse service to anyone for any reason at any time.',
          },
          {
            type: 'callout',
            text:
              'Our digital space is designed as a sanctuary for quality. We expect all patrons to interact with our platform with the same respect we put into our artisanal process.',
          },
        ],
      },
      {
        id: 'orders',
        title: 'Orders & Payment Terms',
        blocks: [
          {
            type: 'paragraph',
            text:
              'All orders are subject to acceptance and availability. We reserve the right to limit quantities, update product descriptions, or change pricing at any time without notice.',
          },
          {
            type: 'list',
            items: [
              'Prices for our products are subject to change without notice.',
              'We reserve the right to modify or discontinue products or services at any time.',
              'You agree to provide current, complete, and accurate purchase and account information.',
            ],
          },
        ],
      },
      {
        id: 'liability',
        title: 'Limitation of Liability',
        blocks: [
          {
            type: 'paragraph',
            text:
              'Satvegik does not guarantee that your use of our service will be uninterrupted, timely, secure, or error-free. Your use of the service is at your sole risk.',
          },
          {
            type: 'paragraph',
            text:
              'In no case shall Satvegik, our directors, employees, partners, or affiliates be liable for indirect, incidental, punitive, special, or consequential damages of any kind.',
          },
        ],
      },
      {
        id: 'property',
        title: 'Intellectual Property',
        blocks: [
          {
            type: 'paragraph',
            text:
              'The website, product names, content, imagery, design, and trade dress are the property of Satvegik or its licensors and may not be used without prior written consent.',
          },
          {
            type: 'images',
            images: artisanWorkshopImages,
          },
        ],
      },
    ],
  },
  shipping: {
    eyebrow: 'Satvegik',
    title: 'Shipping Policy',
    effectiveDate: 'Effective as of May 14, 2024',
    intro:
      'Every jar is packed with care so it reaches your pantry ready for slow breakfasts, nourishing snacks, and everyday rituals.',
    contactText: 'Questions about shipping, tracking, or delivery availability can be sent to our dispatch team.',
    contactLabel: 'Contact Dispatch',
    contactHref: `mailto:${BUSINESS_CONTACT.email}`,
    sections: [
      {
        id: 'processing',
        title: 'Order Processing',
        blocks: [
          {
            type: 'paragraph',
            text:
              'Orders are usually packed within 1 to 2 business days after confirmation. During launches, festivals, or limited-batch releases, processing may take slightly longer.',
          },
          {
            type: 'callout',
            text:
              'We pack glass jars with protective materials and batch labels so each order arrives with the same care it received at the mill.',
          },
        ],
      },
      {
        id: 'delivery',
        title: 'Delivery Timelines',
        blocks: [
          {
            type: 'list',
            items: [
              'Standard delivery typically arrives within 3 to 5 business days after dispatch.',
              'Express delivery is prioritized for next-day dispatch where courier coverage allows.',
              'Remote pin codes may require additional transit time depending on partner availability.',
            ],
          },
        ],
      },
      {
        id: 'tracking',
        title: 'Tracking Your Order',
        blocks: [
          {
            type: 'paragraph',
            text:
              'Once your order ships, we send tracking details by email or SMS. If the tracking link does not update within 24 hours, contact us with your order number.',
          },
        ],
      },
      {
        id: 'issues',
        title: 'Delivery Issues',
        blocks: [
          {
            type: 'paragraph',
            text:
              'If your package arrives damaged, leaking, or missing an item, please contact us within 24 hours with photos of the package and products so we can resolve it quickly.',
          },
        ],
      },
    ],
  },
  refund: {
    eyebrow: 'Satvegik',
    title: 'Refund Policy',
    effectiveDate: 'Effective as of May 14, 2024',
    intro:
      'We want every jar to feel thoughtful, fresh, and worthy of your table. This policy explains how we handle refunds and replacements.',
    contactText: 'Questions about refunds or replacements should be sent with your order number and photos when relevant.',
    contactLabel: 'Start a Refund Request',
    contactHref: `mailto:${BUSINESS_CONTACT.email}`,
    sections: [
      {
        id: 'eligibility',
        title: 'Refund Eligibility',
        blocks: [
          {
            type: 'paragraph',
            text:
              'Because our products are food items, we cannot accept returns of opened jars or products that have left your care after delivery.',
          },
          {
            type: 'list',
            items: [
              'Refunds or replacements may be offered when an item arrives damaged, incorrect, or unsafe to consume.',
              'Requests must be made within 24 hours of delivery.',
              'Photos of the package, jar, label, and batch number help us resolve the issue faster.',
            ],
          },
        ],
      },
      {
        id: 'non-refundable',
        title: 'Non-Refundable Items',
        blocks: [
          {
            type: 'paragraph',
            text:
              'We cannot refund products based on personal taste preference, natural oil separation, delayed opening after delivery, or incorrect shipping information provided at checkout.',
          },
        ],
      },
      {
        id: 'process',
        title: 'Refund Process',
        blocks: [
          {
            type: 'paragraph',
            text:
              'After reviewing your request, we may offer a replacement, store credit, or refund to the original payment method. Approved refunds may take 5 to 7 business days to appear depending on your bank.',
          },
          {
            type: 'callout',
            text:
              'Natural separation is a sign of real nut butter. Stirring the jar thoroughly usually restores the silky texture.',
          },
        ],
      },
      {
        id: 'cancellations',
        title: 'Cancellations',
        blocks: [
          {
            type: 'paragraph',
            text:
              'Orders can be cancelled before dispatch. Once an order has shipped, it can no longer be cancelled, but our team will help if something arrives wrong or damaged.',
          },
        ],
      },
    ],
  },
}
