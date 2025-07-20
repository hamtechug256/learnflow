const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event, context) => {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: "Method Not Allowed",
        };
    }

    const { goal } = JSON.parse(event.body);

    if (!goal) {
        return {
            statusCode: 400,
            body: "Missing 'goal' in request body",
        };
    }

    // Access your API key as an environment variable (best practice)
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `Generate a step-by-step learning path for the goal: "${goal}".\n\nProvide the output as a JSON array of objects, where each object represents a step in the learning path. Each step object should have the following properties:\n- id: a unique, short, kebab-case identifier for the step (e.g., "html-basics", "python-fundamentals")\n- name: a human-readable name for the step (e.g., "HTML Basics", "Python Fundamentals")\n- type: "topic"\n- resources: an array of resource objects. Each resource object should have:\n    - name: name of the resource\n    - url: URL of the resource\n    - type: "article", "video", or "course"\n    - style: "reading", "video", "auditory", or "kinesthetic" (choose the most appropriate)\n\nEnsure the JSON is valid and does not contain any extra text or markdown formatting outside the JSON object itself. Provide at least 5-10 steps with 2-3 resources each. Focus on widely available and free resources where possible.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Attempt to parse the JSON. The model might sometimes include extra text.
        let parsedResponse;
        try {
            // Try to find the JSON part if the model adds extra text
            const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
            if (jsonMatch && jsonMatch[1]) {
                parsedResponse = JSON.parse(jsonMatch[1]);
            } else {
                parsedResponse = JSON.parse(text);
            }
        } catch (parseError) {
            console.error("Failed to parse AI response as JSON:", text, parseError);
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "AI response could not be parsed as JSON.", rawResponse: text }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(parsedResponse),
        };
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to generate learning path from AI.", details: error.message }),
        };
    }
};