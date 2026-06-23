export type LegalSection = {
  heading: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
};

export type LegalPageContent = {
  title: string;
  summary: string;
  lastUpdated: string;
  sections: readonly LegalSection[];
};

export const legalPages = {
  license: {
    title: "License",
    summary: "This project is publicly visible but is not open source.",
    lastUpdated: "23 June 2026",
    sections: [
      {
        heading: "All Rights Reserved",
        paragraphs: [
          "Copyright © 2026 Markellos Markides. All rights reserved.",
          "The original source code, documentation, interface design, text, flashcards, educational material, and other original content in this project are protected by copyright.",
        ],
      },
      {
        heading: "No licence is granted",
        paragraphs: [
          "No permission is granted to copy, reproduce, modify, adapt, translate, publish, distribute, sublicense, sell, rehost, or otherwise exploit any part of this project, in source or compiled form, without prior written permission from the copyright holder.",
          "Public access to the repository does not make the project open source. Visitors may view the public repository and use the hosted application as it is provided.",
        ],
      },
      {
        heading: "Third-party material and warranty",
        paragraphs: [
          "Third-party software, libraries, assets, quotations, and other third-party material remain subject to their respective licences and copyright terms.",
          "The project is provided as is, without warranty of any kind, to the maximum extent permitted by applicable law.",
        ],
      },
    ],
  },
  privacy: {
    title: "Privacy",
    summary: "The application is designed as a local-first study tool.",
    lastUpdated: "23 June 2026",
    sections: [
      {
        heading: "Data stored on your device",
        paragraphs: [
          "Study progress, review information, preferences, and user-added study-material links may be stored locally in your browser on the device you use.",
          "The application does not require an account. Clearing the browser data for this site may remove locally stored study information.",
        ],
      },
      {
        heading: "Hosting and technical request data",
        paragraphs: [
          "The application is hosted through GitHub Pages. Hosting and network providers may process technical request information, such as an IP address, browser details, requested URL, date, and time, for delivery, reliability, abuse prevention, and security under their own policies.",
        ],
      },
      {
        heading: "External links",
        paragraphs: [
          "Links added to study materials may lead to third-party websites. Those websites operate under their own privacy and data-processing practices.",
        ],
      },
    ],
  },
  analytics: {
    title: "Analytics choices",
    summary: "There is currently no optional analytics preference inside the application.",
    lastUpdated: "23 June 2026",
    sections: [
      {
        heading: "Current application behaviour",
        paragraphs: [
          "The application does not currently present an in-app analytics consent toggle or advertising preference.",
          "Common link-tracking parameters, including fbclid, gclid, and utm_* parameters, are removed from the visible address after the application starts, while the application route is preserved.",
        ],
      },
      {
        heading: "Infrastructure analytics",
        paragraphs: [
          "GitHub Pages and network providers may still generate operational, traffic, security, or aggregate statistics at infrastructure level. These processes are outside the application's own preference controls.",
        ],
      },
      {
        heading: "Browser controls",
        paragraphs: [
          "You can use your browser settings to inspect or remove site storage, restrict cookies, and clear browsing data. Browser controls may affect saved study progress or offline functionality.",
        ],
      },
    ],
  },
  copyright: {
    title: "Copyright protected",
    summary: "The project's original work is protected under an All Rights Reserved copyright position.",
    lastUpdated: "23 June 2026",
    sections: [
      {
        heading: "Protected material",
        paragraphs: [
          "Copyright protection applies to the project's original source code, interface design, documentation, written content, flashcards, educational material, and other original creative work.",
        ],
      },
      {
        heading: "Public visibility is not permission",
        paragraphs: [
          "Making the repository or hosted application publicly accessible does not grant permission to copy, modify, redistribute, rehost, sublicense, sell, or create derivative versions of the protected material.",
          "The hosted application may be used as provided. Any broader reuse requires prior written permission from the copyright holder.",
        ],
      },
      {
        heading: "Third-party rights",
        paragraphs: [
          "Third-party libraries, assets, quotations, and referenced material remain the property of their respective rights holders and are governed by their own terms.",
        ],
      },
    ],
  },
} as const satisfies Record<string, LegalPageContent>;

export type LegalPageKey = keyof typeof legalPages;
