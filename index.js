const express = require("express");
const app = express();
const {
	GoogleGenerativeAI,
	FunctionDeclarationSchemaType,
} = require("@google/generative-ai");

require("dotenv").config();
const GEMINI_MODEL = "gemini-1.5-flash";
const ANALYZE_INSTRUCTIONS =
	"Eres un experto analizando formularios web con que constan de pares ('titulo' - 'tipo_input'). Se te proporcionará un formulario y deberás responder con todos los pares ('titulo' - 'tipo_input') que encuentres en el formulario. Puedes hacerlo ya sea, identificando atributos for y name, o infiriendo por cercanía. El tipo de input puede ser: input_text, input_number, selector, radio, check.";
const ANSWER_INSTRUCTIONS =
	"Eres un experto en programación. Responde muy brevemente cada pregunta, si te preguntan cuánto tiempo llevas programando en un formato numérico, responde con un número inventado. Se te proporcionará un archivo json, responderás con el formato dado en la propiedad 'tipo_input' a cada una de las preguntas en la propiedad 'titulo'";
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

app.use(express.json());

app.post("/responder", async (req, res) => {
	const answerModel = genAI.getGenerativeModel({
		model: GEMINI_MODEL,
		systemInstruction: ANSWER_INSTRUCTIONS,
		generationConfig: {
			responseMimeType: "application/json",
			responseSchema: {
				type: FunctionDeclarationSchemaType.ARRAY,
				items: {
					type: FunctionDeclarationSchemaType.STRING,
				},
			},
		},
	});

	const formQuestions = await analyzeForm(req.body.form);
	console.log("QUESTIONS", formQuestions);

	let answers = await answerModel.generateContent(formQuestions);
	answers = JSON.parse(answers.response.text());

	res.json(answers);
});

async function analyzeForm(form) {
	let analyzingModel = genAI.getGenerativeModel({
		model: GEMINI_MODEL,
		systemInstruction: ANALYZE_INSTRUCTIONS,
		generationConfig: {
			responseMimeType: "application/json",
			responseSchema: {
				type: FunctionDeclarationSchemaType.ARRAY,
				items: {
					type: FunctionDeclarationSchemaType.OBJECT,
					properties: {
						titulo: {
							type: FunctionDeclarationSchemaType.STRING,
						},
						tipo_input: {
							type: FunctionDeclarationSchemaType.STRING,
						},
					},
				},
			},
		},
	});

	const result = await analyzingModel.generateContent(form);
	return result.response.text();
}

app.listen(3000, () => {
	console.log("Servidor Express escuchando en el puerto 3000");
});
