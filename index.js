const express = require("express");
const app = express();
const {
	GoogleGenerativeAI,
	FunctionDeclarationSchemaType,
} = require("@google/generative-ai");

require("dotenv").config();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

app.use(express.json());

app.post("/responder", async (req, res) => {
	const model = genAI.getGenerativeModel({
		model: "gemini-1.5-flash",
		systemInstruction:
			"Eres un experto en programación, responderás una serie de preguntas en formato de un arreglo. Responde muy brevemente cada pregunta. Si te preguntan cuánto tiempo llevas programando en un formato numérico, responde con un número inventado.",
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

	let prompt = preguntas(req.body);
	console.log(prompt + "\n-----------------------------------\n");
	// let result = await model.generateContent(prompt);
	let result = ['respuesta 1', 8, 2, 'Bootstrap\nTailwind\nFundation'];
	// res.json(JSON.parse(result));
	// result = JSON.parse(result.response.text());
	// result = result.map((item) => {
	// 	if (!isNaN(item)) {
	// 		return Number(item);
	// 	}
	// 	return item;
	// });
	res.json(result);
});

function preguntas(input) {
	let preguntas = "";
	for (let i = 0; i < input.length; i++) {
		preguntas += "- " + input[i] + (i < input.length - 1 ? "\n" : "");
	}
	return preguntas;
}

app.listen(3000, () => {
	console.log("Servidor Express escuchando en el puerto 3000");
});
