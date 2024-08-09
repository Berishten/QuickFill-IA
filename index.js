const express = require("express");
const app = express();
const {
	GoogleGenerativeAI,
	FunctionDeclarationSchemaType,
} = require("@google/generative-ai");

require("dotenv").config();
const GEMINI_MODEL = "gemini-1.5-flash";
const ANALYZE_INSTRUCTIONS =
	"Eres un experto analizando formularios web con que constan de pares ('titulo' - 'tipo_input'). Se te proporcionará un formulario y deberás responder con todos los pares ('titulo' - 'tipo_input') que encuentres en el formulario. Puedes hacerlo ya sea, identificando atributos for y name, o infiriendo por cercanía. El tipo de input puede ser: input_text, input_number, selector, radio, check. Asegúrate de obtener los valores de los selectores, radios y checks que poseen la propiedad 'value'.";
const ANSWER_INSTRUCTIONS =
	"Eres un experto en programación. Responde muy brevemente cada pregunta, si te preguntan cuánto tiempo llevas programando en un formato numérico, responde con un número inventado. Se te proporcionará un archivo json, responderás con el formato dado en la propiedad 'tipo_input' a cada una de las preguntas en la propiedad 'titulo'. Asegúrate de responder con el valor correcto para elementos de tipo selector, radio y check, por ejemplo: los selectores tiene la propiedad 'value' que indica el valor seleccionado. En el caso de los select, debes responder con el indice de la respuesta seleccionada. Siempre debes responder todas las preguntas. Siempre responderás en español.";
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

	// console.log("BODY:", req.body.form);
	const formQuestions = await analyzeForm(req.body.form);
	// console.log("QUESTIONS", formQuestions);

	let answers = await answerModel.generateContent(formQuestions);
	answers = JSON.parse(answers.response.text());

	res.json(answers);

	// let mockAnswers = [
	// 	"Tengo 8 años de experiencia como desarrollador Backend, desarrollando principalmente APIs RESTful, Microservicios y Bases de datos, tanto relacionales como NoSQL. También poseo 3 años de experiencia en desarrollo Frontend, donde he trabajado con frameworks como React, Angular y Vue.js.",
	// 	"Sí, tengo experiencia con el desarrollo de aplicaciones móviles usando Flutter y desarrollo backend con NodeJS. He desarrollado varias aplicaciones usando Flutter, conectándolas con servicios backend construidos con NodeJS.",
	// 	"Sí, domino MongoDB, he trabajado con él en varios proyectos, creando y administrando bases de datos NoSQL, implementando consultas y optimizando el rendimiento.",
	// 	"Mi nivel de inglés es intermedio-avanzado. Puedo comunicarme de manera oral y escrita en inglés. He participado en equipos internacionales y he trabajado con documentación en inglés.",
	// 	"Estoy disponible de inmediato. Mi pretensión salarial es de $X.XX por mes. Mi número de contacto es +5555555555."
	//   ];
	// res.json(mockAnswers);
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
