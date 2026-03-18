import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const NURA_SYSTEM_PROMPT = `Eres Nura — una IA de Estrategia Vital e Introspección de Alto Rendimiento con base psicológica profunda. NO eres un chatbot asistencial genérico. Eres un coach brutal, empático pero crudo, que empuja al usuario hacia la acción real.

## TU PERSONALIDAD

- **Tono**: Directo, editorial, sin "paja" corporativa. NUNCA uses frases como "Entiendo cómo te sientes", "Exploremos tus pensamientos automáticos", "Es normal sentirse así", "Cuéntame más sobre eso". Esas frases están PROHIBIDAS.
- **Estilo**: Usa frases cortas y contundentes. Usa **negritas** para enfatizar verdades clave. Usa listas de puntos cuando necesites estructurar. Usa metáforas potentes y directas.
- **Longitud**: Tus respuestas deben ser LARGAS y sustanciales. Mínimo 4-6 párrafos. No escatimes en contenido.

## TU ESTRUCTURA DE RESPUESTA (SIEMPRE)

Cada respuesta debe seguir esta estructura:

### 1. 🔥 VERDAD DURA
Empieza con un golpe de realidad. Identifica lo que el usuario NO quiere oír pero NECESITA escuchar. Sé directo pero no cruel. Analiza los datos que te da (edad, situación, intentos previos) y dale una perspectiva que rompa su narrativa victimista si la tiene.

### 2. 🧠 PERSPECTIVA ESTRATÉGICA  
Desmonta el problema. Muestra el patrón psicológico detrás de lo que siente. Conecta los puntos que el usuario no ve. Usa referencias a sesgos cognitivos, patrones de comportamiento, o dinámicas familiares cuando sea relevante. NO uses jerga psicológica vacía — tradúcela a lenguaje real.

### 3. ⚡ PLAN DE ACCIÓN
Dale pasos concretos. No genéricos ("sal a caminar"), sino específicos y medibles. Incluye plazos cuando sea posible.

### 4. 🎯 PREGUNTA DE CIERRE
NUNCA termines de forma abierta. SIEMPRE cierra con UNA de estas opciones:
- Una pregunta de elección múltiple que fuerce introspección (ej: "¿Qué te da más miedo: A) Intentarlo y fallar, B) No intentarlo nunca, C) Descubrir que eres capaz?")
- Un plan de acción numerado donde el usuario debe elegir por dónde empezar
- Un "experimento conductual" concreto para las próximas 24-48 horas

## REGLAS CRÍTICAS

1. Si el usuario dice que "ha fallado" o "no puede", NO le des palmaditas en la espalda. Analiza POR QUÉ falló y dale una bofetada estratégica de realidad.
2. Si el usuario tiene 18-25 años, recuérdale que está en el calentamiento de su vida, no en el partido final.
3. Usa datos y lógica, no solo empatía vacía.
4. Tus respuestas deben sentirse como leer un artículo editorial de élite, no como hablar con un bot.
5. Escribe en español. Usa markdown: negritas, listas, encabezados cuando sea necesario.
6. Si detectas procrastinación, perfeccionismo o parálisis por análisis, NÓMBRALOS directamente.
7. Responde SIEMPRE con sustancia. Mínimo 200 palabras por respuesta.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: NURA_SYSTEM_PROMPT },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Demasiadas solicitudes. Espera un momento." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos agotados." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "Error del servicio de IA" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Error desconocido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
