import OpenAI from "openai";
import { config } from "./config";
import { Criteria, searchProperties } from "./propertySearch";

const ai = new OpenAI({ apiKey: config.apiKey, ...(config.baseURL ? { baseURL: config.baseURL } : {}) });


const instructions = `
You are a friendly, professional property recommendation assistant.

PROPERTY SEARCH RULES:
- Always use search_properties for property searches.
- Recommend only properties returned by the tool.
- Never invent property details, prices, IDs, or availability.
- Treat explicit user constraints as mandatory.

NO-RESULTS RESPONSE RULES:
- Never mention a database, records, queries, or internal systems.
- Never say "in our database", "database results", or "no records found".
- If no properties match the requested location, budget, or requirements,
  politely explain that no matching listings are currently available.
- Do not claim that we do not serve an area unless the tool explicitly
  confirms that the area is outside our service coverage.
- For no matching listings, use wording like:
  "I'm sorry, but we don't currently have properties matching your
  requirements. We're hoping to offer more options soon. Please stay
  connected, and we'd be happy to help you explore available options."
- If properties exist in the area but none match the budget or criteria,
  offer to explore a different budget, location, or property type.
- Never promise to notify the user about future listings unless a
  notification feature is actually available.
- Return a natural-language response, never raw JSON.
- Only state property details returned by the tool.
`;

const tool: OpenAI.Chat.Completions.ChatCompletionTool = {
  type: "function",
  function: {
    name: "search_properties",
    description: "Search available properties in the database with structured filters.",
    strict: true,
    parameters: {
      type: "object",
      properties: {
        city: { type: ["string", "null"] }, locality: { type: ["string", "null"] },
        minPrice: { type: ["number", "null"] }, maxPrice: { type: ["number", "null"] },
        bedrooms: { type: ["integer", "null"] }, minBedrooms: { type: ["integer", "null"] },
        maxBedrooms: { type: ["integer", "null"] }, propertyType: { type: ["string", "null"] },
        minAreaSqft: { type: ["number", "null"] }, maxAreaSqft: { type: ["number", "null"] }
      },
      required: ["city", "locality", "minPrice", "maxPrice", "bedrooms", "minBedrooms", "maxBedrooms", "propertyType", "minAreaSqft", "maxAreaSqft"],
      additionalProperties: false
    }
  }
};
function criteriaFromJson(s: string): Criteria {
  const o = JSON.parse(s) as Record<string, unknown>, c: Criteria = {};
  for (const k of ["city", "locality", "propertyType"] as const) if (typeof o[k] === "string" && o[k].trim()) c[k] = o[k].trim();
  for (const k of ["minPrice", "maxPrice", "bedrooms", "minBedrooms", "maxBedrooms", "minAreaSqft", "maxAreaSqft"] as const) if (typeof o[k] === "number" && Number.isFinite(o[k])) c[k] = o[k];
  return c;
}
export async function answerPropertyQuestion(message: string): Promise<string> {
  if (!message.trim()) return "Tell me what kind of property you are looking for.";
  const first = await ai.chat.completions.create({
    model: config.model, messages: [{ role: "system", content: instructions }, { role: "user", content: message }],
    tools: [tool], tool_choice: "auto", max_tokens: 700
  });
  const assistant = first.choices[0]?.message;
  if (!assistant) return "I couldn't process that request. Please try again.";
  if (!assistant.tool_calls?.length) return assistant.content?.trim() || "Please share the location and property requirements.";
  const toolMessages: OpenAI.Chat.Completions.ChatCompletionToolMessageParam[] = [];
  let searched = false;
  for (const call of assistant.tool_calls) {
    if (call.type !== "function" || call.function.name !== "search_properties") continue;
    searched = true;
    try {
      const properties = await searchProperties(criteriaFromJson(call.function.arguments));
      if (!properties.length) {
        toolMessages.push({
          role: "tool",
          tool_call_id: call.id,
          content: JSON.stringify({
            found: false,
            message:
              "We don't currently have matching property listings available in this area. We're hoping to expand our services there soon. Please stay connected, and we'll be happy to assist you when we start serving your area.",
            properties: [],
          }),
        });
      } else {
        toolMessages.push({
          role: "tool",
          tool_call_id: call.id,
          content: JSON.stringify({
            found: true,
            count: properties.length,
            properties,
          }),
        });
      }
    } catch (e) {
      toolMessages.push({ role: "tool", tool_call_id: call.id, content: JSON.stringify({ error: e instanceof Error ? e.message : "Search failed" }) });
    }
  }
  if (!searched) {
    return "Could you share the location and property requirements so I can help you find suitable listings?";
  }
  const final = await ai.chat.completions.create({
    model: config.model,
    messages: [{ role: "system", content: instructions }, { role: "user", content: message }, assistant, ...toolMessages],
    max_tokens: 700
  });
  return final.choices[0]?.message?.content?.trim() || "I couldn't format the results. Please try again.";
}
