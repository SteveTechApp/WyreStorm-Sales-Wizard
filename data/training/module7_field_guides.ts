import { TrainingModule } from '../../utils/types.ts';

export const MODULE_7_FIELD_GUIDES: TrainingModule = {
  id: 'module7_sales_guides',
  title: 'Consultative Selling & Handling Objections',
  contentPages: [
    {
      title: 'The Consultative Sales Approach',
      content: [
        '# The Consultative Sales Approach',
        '',
        'Consultative selling is about acting as an expert advisor and consultant to your clients, not just a product vendor. The goal is to deeply understand their problems and guide them to the best possible solution, building trust and long-term relationships.',
        '',
        '### Key Principles',
        '1.  **Ask, Don\'t Tell:** Instead of starting with a product pitch, start with questions. Your goal is discovery.',
        '2.  **Focus on "Why":** When a client asks for a specific piece of hardware (e.g., "I need a 4x4 matrix"), a consultative salesperson asks "Why? What are you trying to achieve?". The underlying need might be better solved with a different, more effective solution.',
        '3.  **Solve Problems, Don\'t Sell Products:** Clients don\'t buy products; they buy solutions to their problems. Frame your recommendations in terms of how they solve a specific pain point (e.g., "This speakerphone will eliminate the echo your team has been complaining about").',
        '4.  **Educate the Client:** Share your expertise. Explain *why* you are recommending a certain technology (like AVoIP over a traditional matrix) in terms of its benefits for their business (scalability, flexibility, future-proofing).',
        '',
        '**Result:** You become a trusted partner rather than a salesperson, leading to higher client satisfaction and repeat business.'
      ].join('\n'),
    },
    {
      title: 'Qualifying a Lead: BANT',
      content: [
        '# Qualifying a Lead: The BANT Framework',
        '',
        'Not every inquiry is a real sales opportunity. Qualifying a lead means determining if it\'s worth your time and resources to pursue. The BANT framework is a simple and effective way to do this.',
        '',
        '### B - Budget',
        '- **Question:** "Is there a budget allocated for this project?" or "What sort of investment level were you considering for solving this problem?"',
        '- **Why it Matters:** You need to know if the client has the financial resources to purchase your solution. If not, you may be wasting your time creating a detailed proposal. Our "Bronze, Silver, Gold" tier system can help guide this conversation.',
        '',
        '### A - Authority',
        '- **Question:** "Who, besides yourself, is involved in the decision-making process for this project?"',
        '- **Why it Matters:** Are you speaking with the final decision-maker, or an influencer who will pass your information along? Understanding the approval process is key.',
        '',
        '### N - Need',
        '- **Question:** "What is the biggest challenge with your current setup?" or "What would a perfect outcome look like for you?"',
        '- **Why it Matters:** This is the core of consultative selling. You must identify a real, pressing need or pain point that your solution can solve.',
        '',
        '### T - Timeline',
        '- **Question:** "When are you hoping to have this new system up and running?"',
        '- **Why it Matters:** This tells you how urgent the project is. A client who needs a solution next month is a much hotter lead than one who is "just planning for next year".'
      ].join('\n'),
    },
    {
      title: 'Handling Common Objections',
      content: [
        '# Handling Common Sales Objections',
        '',
        'Objections are a natural part of the sales process. Don\'t fear them; see them as a request for more information. Here\'s how to handle a few common ones.',
        '',
        '### "It\'s too expensive." / "Your price is higher than Competitor X."',
        '- **Don\'t:** Immediately offer a discount.',
        '- **Do:** Reframe the conversation around **value and total cost of ownership (TCO)**.',
        '- **Response:** "I understand price is a key consideration. Let\'s look at the value this solution provides in terms of reliability and future-proofing. Our systems are designed for 24/7 commercial use and backed by a 5-year warranty, which can lead to a lower total cost of ownership compared to less reliable alternatives. What\'s most important to you: the lowest upfront price or the best long-term value?"',
        '',
        '### "We\'re happy with our current solution."',
        '- **Don\'t:** Argue or criticize their current setup.',
        '- **Do:** Acknowledge their position and probe for hidden dissatisfaction.',
        '- **Response:** "That\'s great to hear you have a system that works for you. Many of our current clients said the same thing before they saw how new technologies like [Wireless Casting / AVoIP] could solve nagging issues they\'d just learned to live with. Is there anything at all about your current setup you\'d tweak if you could?"',
        '',
        '### "I need to think about it."',
        '- **Don\'t:** Pressure them for a decision.',
        '- **Do:** Identify the source of their hesitation and define a clear next step.',
        '- **Response:** "Of course, it\'s an important decision. To help you think it over, could you share what part of the proposal you\'re most unsure about? Is it the technology, the budget, or something else? Perhaps we could schedule a brief follow-up call for Thursday to address any remaining questions you might have after you\'ve had a chance to review."'
      ].join('\n'),
    },
  ],
  quiz: [
    {
      question: "What is the primary goal of the 'discovery' phase in a consultative sales approach?",
      options: ["To present the client with a full list of products", "To understand the client's core problems and desired outcomes", "To get the client to sign a contract as quickly as possible", "To determine the client's budget immediately"],
      correctAnswer: "To understand the client's core problems and desired outcomes",
      explanation: "The discovery phase is all about listening and asking questions to uncover the client's true needs before you ever start talking about products."
    },
    {
      question: "A client asks for a specific product, like a '16x16 HDBaseT matrix'. What should a consultative salesperson do first?",
      options: ["Immediately provide a quote for the requested matrix", "Tell them AVoIP is better", "Ask discovery questions to understand why they need it and what they want to achieve", "Offer a discount on the matrix"],
      correctAnswer: "Ask discovery questions to understand why they need it and what they want to achieve",
      explanation: "The client's requested product might not be the best solution. A consultative salesperson explores the underlying need first to ensure they recommend the right system for the job."
    },
    {
      question: "When a client says your proposal is 'too expensive', what is the most effective strategy?",
      options: ["Immediately offer a 10% discount", "Focus the conversation on the long-term value, reliability, and benefits of your solution", "Agree and suggest they look at cheaper brands", "Show them an even more expensive option to make the first one look cheaper"],
      correctAnswer: "Focus the conversation on the long-term value, reliability, and benefits of your solution",
      explanation: "Shifting the conversation from price to value helps the client see the investment in a different light, focusing on benefits like lower total cost of ownership and reliability."
    },
    {
      question: "In the BANT framework, what does 'Authority' refer to?",
      options: ["How much knowledge the client has about AV", "Whether the person you're speaking to is the final decision-maker", "The authority of your company in the market", "The warranty period of the products"],
      correctAnswer: "Whether the person you're speaking to is the final decision-maker",
      explanation: "Authority refers to identifying who has the power to approve the budget and sign off on the project. It's crucial to know you are talking to the right person."
    }
  ]
};