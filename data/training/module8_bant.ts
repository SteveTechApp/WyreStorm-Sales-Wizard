import { TrainingModule } from '../../utils/types.ts';

export const MODULE_8_BANT: TrainingModule = {
  id: 'module8_bant',
  title: 'Mastering Lead Qualification with BANT',
  contentPages: [
    {
      title: 'The BANT Framework',
      content: [
        '# Mastering Lead Qualification with BANT',
        '',
        'The BANT framework is a powerful tool used by salespeople to qualify leads. It helps you determine if a potential customer is a good fit for your product or service by assessing four key areas. This ensures you spend your valuable time on opportunities that are most likely to close.',
        '',
        '---',
        '',
        '### B - Budget',
        'This is about understanding if the prospect has the financial capacity to buy your solution.',
        '',
        '**Example Questions:**',
        '- "Is there a budget approved for this project? If so, could you share the approximate range?"',
        '- "We have solutions that typically range from $X to $Y for this type of project. Does that align with what you were expecting to invest?"',
        '- "How is your company funding this initiative?"',
        '',
        '---',
        '',
        '### A - Authority',
        'This is about identifying who has the power to make the final purchasing decision.',
        '',
        '**Example Questions:**',
        '- "Who, besides yourself, will be involved in the evaluation and decision-making process?"',
        '- "What does the typical purchasing process look like for a project of this scale at your company?"',
        '- "Could you walk me through the steps needed to get this project approved?"',
        '',
        '---',
        '',
        '### N - Need',
        'This is about uncovering the core pain point or business challenge that the prospect is trying to solve.',
        '',
        '**Example Questions:**',
        '- "What are the biggest challenges you\'re facing with your current AV setup?"',
        '- "What prompted you to start looking for a new solution now?"',
        '- "If you could wave a magic wand, what would the ideal outcome of this project look like for your team?"',
        '- "What are the consequences of not doing anything about this problem?"',
        '',
        '---',
        '',
        '### T - Timeline',
        'This is about understanding the prospect\'s expected timeframe for purchasing and implementation.',
        '',
        '**Example Questions:**',
        '- "What is your ideal timeline for having this new system installed and operational?"',
        '- "Are there any upcoming events or deadlines that are driving this project\'s timeline?"',
        '- "When do you plan on making a final decision?"',
      ].join('\n'),
    },
  ],
  quiz: [
    {
      question: "You ask a prospect, 'Who else is involved in making the final choice?' What part of BANT are you trying to qualify?",
      options: ["Budget", "Authority", "Need", "Timeline"],
      correctAnswer: "Authority",
      explanation: "This question helps you identify all the decision-makers and understand the approval process, which is the core of 'Authority'."
    },
    {
      question: "When a client is hesitant to share a specific budget number, what is a good alternative approach?",
      options: ["Insist they provide a number to continue", "End the conversation", "Provide a typical price range for similar projects to see if it aligns", "Guess their budget"],
      correctAnswer: "Provide a typical price range for similar projects to see if it aligns",
      explanation: "Providing a realistic range (like our Bronze, Silver, Gold tiers) helps qualify their budget expectations without being confrontational."
    },
    {
      question: "A prospect says, 'We're just gathering information for now and will probably make a decision next quarter.' This information primarily relates to which part of BANT?",
      options: ["Budget", "Authority", "Need", "Timeline"],
      correctAnswer: "Timeline",
      explanation: "This response directly addresses the 'Timeline', indicating that the project is not immediate and helping you prioritize your follow-up."
    },
    {
      question: "What is the most important goal when discussing 'Need' with a client?",
      options: ["To list all of your product's features", "To prove your product is better than competitors", "To uncover a specific pain point your solution can solve", "To find out their company's annual revenue"],
      correctAnswer: "To uncover a specific pain point your solution can solve",
      explanation: "The 'Need' is the foundation of a sale. By identifying a clear problem, you can frame your product as the perfect solution, rather than just another piece of hardware."
    }
  ]
};