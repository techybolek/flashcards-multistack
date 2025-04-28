const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
console.log(OPENROUTER_API_KEY);

const model = "google/gemini-2.5-pro-preview-03-25";
const model2 = "google/gemini-2.5-flash-preview";
const model3 = "qwen/qwen-2.5-7b-instruct";
const model4 = "gpt-4o-mini";

const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    "model": model3,
    "messages": [
      {
        "role": "user",
        "content": "What is the meaning of life?"
      }
    ]
  })
});

const data = await response.json();
console.log(data);
console.log(data.choices[0].message.content);