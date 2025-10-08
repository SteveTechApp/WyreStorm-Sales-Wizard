import { TrainingModule } from '../../utils/types.ts';

export const MODULE_10_APIS: TrainingModule = {
  id: 'module-10-apis',
  title: 'Understanding WyreStorm APIs',
  contentPages: [
    {
      title: 'What is an API?',
      content:
        "**API** stands for Application Programming Interface. Think of it as a language that different pieces of software and hardware use to talk to each other.\n\nImagine you're at a restaurant. You (an application) want to order food. The kitchen (the system) makes the food. You don't go into the kitchen yourself; you talk to a waiter (the **API**). You give the waiter a structured command ('I'd like the steak, medium-rare'), and the waiter communicates this to the kitchen. The waiter then brings the result back to you.\n\nIn AV, an API allows a control system (like a touch panel) to send commands to a WyreStorm matrix switcher to perform actions.",
    },
    {
      title: 'Common Control Protocols',
      content:
        "WyreStorm products can be controlled in several ways:\n- **RS-232 (Serial)**: A very robust, wired, text-based control method. It's an industry standard for reliability. Commands are sent over a serial cable.\n- **Telnet (IP Control)**: Essentially RS-232 over a network connection. A control system connects to the product's IP address on a specific port (e.g., port 23) and sends the same text-based commands.\n- **JSON API (IP Control)**: A modern, structured API used by newer products like the NetworkHD Controller. It uses JSON (JavaScript Object Notation) to send and receive data, which is more powerful and easier for software to parse than plain text.",
    },
    {
      title: 'Example: Controlling a Matrix Switcher',
      content:
        "Most WyreStorm matrix switchers share a similar text-based API for Telnet and RS-232. The commands are simple and human-readable.\n\n**To switch an input:**\n`SET OUT02 VS IN04`\nThis command tells the switcher to set the video source (VS) for Output 2 to Input 4.\n\n**To query the current status:**\n`GET OUT02 VS`\nAfter sending this, the matrix will respond with the current input for Output 2, for example: `OUT02 VS IN04`.\n\nThese simple commands are the building blocks for creating a fully functional user interface on a control system.",
    },
    {
      title: 'The NetworkHD API',
      content:
        "The NetworkHD AVoIP system uses a more advanced JSON API via the **NHD-CTL-PRO** controller. This allows for much more powerful control.\n\nInstead of simple text, you send a structured JSON object. For example, to switch a single display (Decoder with alias 'Display-01') to a source (Encoder with alias 'PC-01'), the command might look like:\n`{ \"type\": \"video\", \"action\": \"dps\", \"body\": { \"alias\": \"Display-01\", \"source\": \"PC-01\" } }`\n\nThis API can also be used to create video walls, trigger macros, and query the status of every device on the network. It is the key to integrating NetworkHD into large-scale control systems.",
    },
    {
      title: 'Why APIs Matter',
      content:
        "Understanding APIs is crucial for moving beyond basic installations. They unlock the true power of professional AV equipment.\n\n**Use Cases**:\n- **Third-Party Integration**: Allows WyreStorm products to be seamlessly controlled by major control systems like Crestron, Control4, AMX, and others.\n- **Automation**: You can create macros or scripts to automate common tasks. For example, a single 'Room On' button can be programmed to turn on the display, lower the screen, and switch to a default source.\n- **Custom Dashboards**: Developers can use the API to build custom web-based interfaces for monitoring and controlling an AV system.\n- **Scalability**: In large systems, APIs are the only practical way to manage hundreds of devices and routes.",
    },
  ],
  quiz: [
    { question: "What does API stand for?", options: ["Application Protocol Interface", "Applied Programming Instruction", "Application Programming Interface"], correctAnswer: "Application Programming Interface", explanation: "An API is a set of rules and protocols that allows different software applications to communicate with each other." },
    { question: "In the restaurant analogy, what does the waiter represent?", options: ["The source device", "The API", "The display"], correctAnswer: "The API", explanation: "The waiter acts as the intermediary, taking structured requests and returning results, just like an API." },
    { question: "Which protocol is a text-based command interface over a network connection?", options: ["RS-232", "Telnet", "JSON"], correctAnswer: "Telnet", explanation: "Telnet allows for sending serial-style text commands to a device's IP address over a specific port." },
    { question: "Which WyreStorm system primarily uses a JSON API for control?", options: ["HDBaseT Extenders", "NetworkHD", "Basic HDMI Switchers"], correctAnswer: "NetworkHD", explanation: "The NHD-CTL-PRO controller exposes a powerful JSON API for managing the AVoIP system." },
    { question: "What would the command `SET OUT01 VS IN03` likely do on a WyreStorm matrix?", options: ["Ask for the status of Output 1", "Route Input 3 to Output 1", "Set the volume of Input 3"], correctAnswer: "Route Input 3 to Output 1", explanation: "This command follows the standard syntax to set the video source (VS) for a specific output." },
    { question: "What is a major benefit of using a JSON API over a simple text API?", options: ["It is more secure", "It is more structured and easier for software to parse", "It only works with JavaScript"], correctAnswer: "It is more structured and easier for software to parse", explanation: "JSON's key-value pair structure is machine-readable and less ambiguous than plain text strings." },
    { question: "The command `GET OUT04 VS` is an example of...", options: ["Setting a value", "Querying a status", "Deleting a connection"], correctAnswer: "Querying a status", explanation: "'GET' commands are used to retrieve the current state of a device." },
    { question: "What is the primary purpose of an API in an AV system?", options: ["To provide power to devices", "To enable control and integration with other systems", "To encrypt the video signal"], correctAnswer: "To enable control and integration with other systems", explanation: "APIs are all about communication, allowing different systems (like a WyreStorm matrix and a Crestron processor) to work together." },
    { question: "RS-232 is a form of what kind of communication?", options: ["Serial Communication", "Network Communication", "Wireless Communication"], correctAnswer: "Serial Communication", explanation: "RS-232 sends data one bit at a time over a dedicated cable, which is the definition of serial communication." },
    { question: "What does third-party integration mean?", options: ["Using three different brands in one system", "Making a product work with a control system from another manufacturer", "Hiring an external company to write code"], correctAnswer: "Making a product work with a control system from another manufacturer", explanation: "The API allows control companies like Crestron or Control4 to write drivers that can operate WyreStorm hardware." },
    { question: "What is a 'macro' in the context of AV control?", options: ["A very large video signal", "A single command that triggers a sequence of other commands", "A type of microphone"], correctAnswer: "A single command that triggers a sequence of other commands", explanation: "A 'Presentation' macro might turn on the projector, lower the screen, and switch to the laptop input." },
    { question: "The 'port number' is a critical piece of information for which control method?", options: ["RS-232", "Telnet/IP Control", "IR Control"], correctAnswer: "Telnet/IP Control", explanation: "Along with the IP address, the port number (e.g., port 23 for Telnet) is needed to establish a network connection." },
    { question: "Which protocol is NOT typically used for API control?", options: ["Telnet", "HDMI", "RS-232"], correctAnswer: "HDMI", explanation: "HDMI is for transmitting video and audio. While it has CEC for basic control, it's not considered a programmable API." },
    { question: "Why is an API essential for a large, scalable system like NetworkHD?", options: ["It's the only practical way to manage hundreds of routes and devices", "It reduces the power consumption", "It improves the video quality"], correctAnswer: "It's the only practical way to manage hundreds of routes and devices", explanation: "Manually configuring a system with hundreds of endpoints would be impossible; an API allows for programmatic control." },
    { question: "What does 'human-readable' mean in the context of an API?", options: ["The API can understand spoken commands", "The commands are plain text that a person can easily read and understand", "The API has a graphical interface"], correctAnswer: "The commands are plain text that a person can easily read and understand", explanation: "`SET OUT01 VS IN02` is human-readable, whereas a complex binary command would not be." },
    { question: "The 'body' of a JSON API command contains what?", options: ["The main action to be performed", "The parameters and data for the command", "The authentication token"], correctAnswer: "The parameters and data for the command", explanation: "The body of the JSON object holds the specific details, such as which display to switch or what source to use." },
    { question: "Which is an example of automation using an API?", options: ["Manually switching a source with a button", "Scheduling the system to turn off every night at 10 PM", "Plugging in a laptop"], correctAnswer: "Scheduling the system to turn off every night at 10 PM", explanation: "Automation involves programming the system to perform actions automatically based on triggers like time of day." },
    { question: "To control a WyreStorm matrix from a custom web page, you would most likely use which API?", options: ["The RS-232 API", "The Telnet/IP API", "The IR API"], correctAnswer: "The Telnet/IP API", explanation: "Web technologies communicate over networks, so the Telnet/IP API is the correct choice for building a custom web interface." },
    { question: "What does the 'S' in 'VS' stand for in the command `SET OUT01 VS IN02`?", options: ["Stereo", "Source", "System"], correctAnswer: "Source", explanation: "The command is setting the Video Source for the specified output." },
    { question: "True or False: All WyreStorm products use the exact same API commands.", options: ["True", "False"], correctAnswer: "False", explanation: "While many product families share a similar API structure, different products (like a matrix vs. NetworkHD) have different capabilities and thus different APIs." },
  ],
};
