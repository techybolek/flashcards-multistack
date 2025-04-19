Design and generate a Proof of Concept (PoC) for an application that focuses solely on the flash cards generation feature using AI. The PoC should verify the basic functionality of the flash cards generation workflow. The following specifications and constraints must be met:

1. **Core Feature (Flash Cards Generation):**
   - Provide a user interface with a text area where the user can paste a block of text (between 1000 and 10,000 characters).
   - Include a button labeled 'Generate Flash Cards'. When pressed, this button should send the provided text to an AI model via an API call.
   - Receive and display a list of generated flash cards, where each flash card consists of a question and its corresponding answer.
   - Allow the user to view the generated flash cards in a simple, clear list format.

2. **Technology Stack:**
   - **Frontend:** Use Astro for the overall framework with React components to provide interactivity. Use TypeScript for static type checking and Tailwind CSS for styling.
   - **Backend/AI Integration:** Integrate with OpenAI service to process the text and generate flash cards. The integration should be minimal and focused solely on obtaining the flash card suggestions.

3. **Constraints (Excluding Non-Essential Features):**
   - Exclude any features outside the core flash cards generation. Do not implement user authentication, account management, advanced error handling, data storage, or any additional navigation components.
   - The focus of the PoC is solely to verify that the AI integration and the flash cards generation workflow function as expected.

4. **Planning and Acceptance Workflow:**
   - First, output a detailed job plan that outlines the architecture, key components to be implemented, and a step-by-step sequence for the PoC generation.
   - Wait for my (the user’s) acceptance of the plan before proceeding with any code generation or further development of the PoC.

Please generate the detailed job plan in your response, ensuring that every step is clearly explained and that you confirm the plan with me before moving to the PoC implementation.