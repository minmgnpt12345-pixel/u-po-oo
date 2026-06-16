import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize the Gemini SDK
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is required. Please set it in Settings > Secrets.");
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Curated Classic U Paw Oo Tales and Jokes
const CLASSIC_JOKES = [
  {
    id: "egg-yogurt",
    title: "ကြက်ဥကုန်လို့ ဒိန်ချဉ်စားတဲ့ဟာသ (Eggs & Yogurt)",
    tag: "ဘဝနေနည်းနှင့် လိုက်လျောညီထွေမှု",
    characters: ["ဦးပေါ်ဦး", "ဇနီးဒေါ်စိန်"],
    dialogue: [
      { speaker: "ဦးပေါ်ဦး", text: "ဟင်... ကြက်ဥတွေ ဘယ်ရောက်ကုန်တာလဲ?" },
      { speaker: "ဇနီး", text: "မင်းပဲ မနေ့က အကုန်ကြော်စားသွားတာ။ မေ့နေတာလား?" },
      { speaker: "ဦးပေါ်ဦး", text: "အိုး... ဒါဆိုရင် ဒီနေ့ ငါ ဘာစားရမလဲ။" },
      { speaker: "ဇနီး", text: "ဒိန်ချဉ်စားစမ်း။" },
      { speaker: "ဦးပေါ်ဦး", text: "အော်... ဒါလည်း မဆိုးဘူးနော်!" },
      { speaker: "ရယ်သံများ", text: "(ရယ်သံများ ထွက်ပေါ်လာခြင်း)" }
    ],
    explanation: "မိမိပြုခဲ့ဖူးသော ကံကြောင့် လက်ရှိတွင် ကြက်ဥမရှိတော့သော်လည်း ဒေါသထွက်မနေဘဲ ဒိန်ချဉ်ကို အစားထိုးကာ ကျေနပ်ပျော်ရွှင်စွာ လိုက်လျောညီထွေ ခံစားတတ်ရန် အမတ်ကြီးက သင်ခန်းစာ ပေးထားခြင်းဖြစ်ပါသည်။"
  },
  {
    id: "chicken-rooster",
    title: "နန်းတော်ပေါ်တွင် ကြက်မွေးခိုင်းသောဉာဏ် (The Royal Rooster)",
    tag: "ဘုရင်ကို ပြန်လည်စနောက်ခြင်း",
    characters: ["ဘိုးတော်ဘုရား (ဘုရင်)", "အမတ်ကြီး ဦးပေါ်ဦး", "အမတ်များ"],
    dialogue: [
      { speaker: "ဘုရင်", text: "မောင်မင်းတို့... မနက်ဖြန် နန်းတော်ညီလာခံလာရင် တစ်ယောက်ကို ကြက်ဥတစ်လုံးစီ ဥပြီး ယူလာကြရမည်။ မယူလာနိုင်သူကို အပြစ်ပေးမည်!" },
      { speaker: "အမတ်များ", text: "(ဘုရင်ကြီးက တိတ်တဆိတ် ကြက်ဥတစ်လုံးစီ ကြိုပေးထားသဖြင့် ပြုံးစိစိနှင့်...) မှန်လှပါဘုရား။" },
      { speaker: "ဦးပေါ်ဦး", text: "(ကြက်ဥမရရှိသောကြောင့် စဉ်းစားကာ...) မှန်လှပါဘုရား။" },
      { speaker: "ဘုရင်", text: "(နောက်တစ်နေ့တွင်) ကဲ... ကြက်ဥတွေ ထုတ်ပြကြစမ်း!" },
      { speaker: "အမတ်များ", text: "မောင်မင်းတို့ တစ်လုံးစီ ထုတ်ပြကြသည်။" },
      { speaker: "ဘုရင်", text: "ဟဲ့... ဦးပေါ်ဦး၊ မင်းရဲ့ ကြက်ဥ ဘယ်မှာလဲ။ မဥနိုင်ရင်တော့ ခေါင်းဖြတ်ရုံပဲ!" },
      { speaker: "ဦးပေါ်ဦး", text: "(လက်နှစ်ဖက်ကို အတောင်ပံလို ခတ်ကာ...) အုတ်အုတ်အိအိ... မှန်လှပါဘုရား၊ ကျန်တဲ့အမတ်တွေအားလုံးက ဥဥနိုင်တဲ့ ကြက်မတွေဖြစ်ပြီး အကျွန်ုပ်ကတော့ ရဲရင့်လှတဲ့ ကြက်ဖကြီးဖြစ်လို့ ဥမဥနိုင်ဘဲ တွန်ရပါသည်ဘုရား!" },
      { speaker: "ဘုရင်နှင့် အမတ်များ", text: "ဟားဟားဟား... (တစ်နန်းတော်လုံး ပွဲကျသွားလေသည်)" }
    ],
    explanation: "ရန်သူ သို့မဟုတ် ဘုရင်က မိမိကို ချောက်ချရန်၊ အကျပ်ကိုင်ရန် ဖန်တီးထားသော အခက်အခဲကို မိမိ၏ လျင်မြန်လှသော ဉာဏ်တော်၊ ဟာသဥာဏ်တို့ဖြင့် အလှည့်အပြောင်းလုပ်ကာ ပရိသတ်ကို ရယ်မောစေပြီး လွတ်မြောက်ခဲ့သော သာဓကတစ်ခု ဖြစ်ပါသည်။"
  },
  {
    id: "land-rowing",
    title: "ကုန်းပေါ်တွင် လှေလှော်ခြင်း (Rowing on Land)",
    tag: "မင်းစိုးရာဇာတို့ မတရားမှုကို သရော်ခြင်း",
    characters: ["ဘိုးတော်ဘုရား (ဘုရင်)", "အမတ်ကြီး ဦးပေါ်ဦး"],
    dialogue: [
      { speaker: "ဘုရင်", text: "ပေါ်ဦး... ကုန်းပေါ်မှာ လှေလှော်လို့ ရပါ့မလားကွ။" },
      { speaker: "ဦးပေါ်ဦး", text: "ရပါတယ် ဘုရား၊ အလွန်တရာမှလည်း လှော်ရခက်လှပါတယ် ဘုရား။" },
      { speaker: "ဘုရင်", text: "ဟေ... ဘယ်လိုမျိုးလဲကွ ပေါ်ဦးရဲ့။ ရှင်းပြစမ်း။" },
      { speaker: "ဦးပေါ်ဦး", text: "တိုင်းပြည် အုပ်ချုပ်သူ မင်းစိုးရာဇာတွေက ကတိသစ္စာမရှိဘဲ လောဘကြီးပြီး၊ အမတ်တွေကလည်း လာဘ်ပေးလာဘ်ယူ အကျင့်ပျက်ခြစားနေရင်၊ တိုင်းသူပြည်သားတွေဟာ ခြောက်သွေ့နေတဲ့ ကုန်းကျောက်ဆောင်တွေပေါ်မှာ တိုင်းပြည်ရဲ့ လှေကြီးကို မရမက ဆွဲတင်ပြီး လှော်ခတ်နေရသလို အလွန်ဆင်းရဲပင်ပန်းရပါတယ် ဘုရား။" },
      { speaker: "ဘုရင်", text: "(မျက်နှာပျက်သွားသော်လည်း မှန်ကန်လွန်း၍ မငြင်းသာဘဲ...) အင်း... ပေါ်ဦး ပြောတာ ဟုတ်ပေသားပဲ..." }
    ],
    explanation: "နူးညံ့သိမ်မွေ့သော သရော်ချက်ဖြင့် တိုင်းပြည်အုပ်ချုပ်သူ မင်းကြီးအား လမ်းမှန်ကို လည်ပတ်ညွှန်ပြကာ စကားလုံးအလှည့်အပတ်ဖြင့် မင်းဆိုးမင်းညစ်တို့ကို ပြုပြင်ပေးခဲ့ခြင်း ဖြစ်ပါသည်။"
  },
  {
    id: "salt-pinch",
    title: "ဆားတစ်ဆိတ် ပေးပါ (A Pinch of Salt)",
    tag: "လောဘနှင့် ရောင့်ရဲမှုသင်ခန်းစာ",
    characters: ["ဘိုးတော်ဘုရား (ဘုရင်)", "လယ်သမား", "အမတ်ကြီး ဦးပေါ်ဦး"],
    dialogue: [
      { speaker: "ဘုရင်", text: "ငါ့တိုင်းပြည်မှာ မိမိဘဝကို လုံးဝရောင့်ရဲကျေနပ်ပြီး ပျော်ရွှင်နေသူရှိရင်၊ အဲဒီလူကို ငါ့ရဲ့ ထီးနန်းစည်းစိမ် တစ်ဝက် ပေးအပ်မည်!" },
      { speaker: "လယ်သမား", text: "(နန်းတော်သို့ ရောက်လာပြီး...) အရှင်မင်းကြီး... ကျွန်တော်မျိုးသည် လယ်သမားတစ်ဦးဖြစ်ပြီး မိမိဘဝကို လုံးဝကျေနပ်ပျော်ရွှင်နေသူဖြစ်လို့ ထီးနန်းစည်းစိမ်တစ်ဝက်ကို အရယူလိုပါတယ် ဘုရား။" },
      { speaker: "ဦးပေါ်ဦး", text: "ဟဲ့... လယ်သမားကြီး၊ တကယ်ပဲ မင်းဘဝကို မင်း လုံးဝရောင့်ရဲကျေနပ်နေတာ ဟုတ်သလား။" },
      { speaker: "လယ်သမား", text: "မှန်လှပါ အမတ်မင်း... ကျွန်တော်မျိုး ဘာမှမလိုချင်တော့ဘဲ အပြည့်အဝ ကျေနပ်နေပါပြီ။" },
      { speaker: "ဦးပေါ်ဦး", text: "ဒါဆိုရင် ဘာဖြစ်လို့ ထီးနန်းစည်းစိမ်တစ်ဝက်ကို လိုချင်လို့ ဒီအဝေးကြီးအထိ ပင်ပန်းခံ လာတောင်းနေရတာလဲကွ။" },
      { speaker: "လယ်သမား", text: "... (မျက်လုံးပြူးကာ ဘာမှမပြောနိုင်တော့ဘဲ ငြိမ်သက်သွားသည်)" },
      { speaker: "ဘုရင်", text: "ဟားဟားဟား... ပေါ်ဦးရဲ့ မေးခွန်းက အမိုက်စားပဲဟေ့!" }
    ],
    explanation: "လူသားတို့၏ လောဘသည် အဆုံးမရှိနိုင်ကြောင်းနှင့် တကယ့်ရောင့်ရဲခြင်းအစစ်အမှန်သည် ပြင်ပစည်းစိမ်ဥစ္စာအပေါ် တပ်မက်ခြင်းကင်းမှသာ ရရှိနိုင်ကြောင်းကို ဘွင်းဘွင်းရှင်းရှင်း ထောက်ပြထားခြင်း ဖြစ်သည်။"
  }
];

// 1. GET /api/jokes
app.get("/api/jokes", (req, res) => {
  res.json(CLASSIC_JOKES);
});

// 2. POST /api/chat
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const ai = getGenAI();

    // Prepare history formatted for the model chat, mapping system prompt and user interactions
    const systemInstruction = 
      "မင်းကတော့ မြန်မာ့သမိုင်းတွင် အလွန်ထင်ရှားတော်မူလှသော အမတ်ကြီး ဦးပေါ်ဦး (U Paw Oo) ဖြစ်သည်။ " +
      "အသုံးပြုသူ (မောင်မင်း သို့မဟုတ် အဆွေတော်) က မင်းကို လာရောက်မေးမြန်းသမျှ မေးခွန်းများ၊ ဘဝပြဿနာများ၊ ဆွေးနွေးမှုများကို " +
      "နန်းတွင်းသုံး အသုံးအနှုန်းအချို့ (ဥပမာ- မှန်လှပါ၊ အဆွေတော်၊ မောင်မင်း၊ ဘုရား...) ကို လိုက်ဖက်သလို သုံးနှုန်းလျက်၊ " +
      "အလွန်လျင်မြန်ထက်မြက်လှသော ဉာဏ်တော်၊ စဉ်းစားတွေးခေါ်မှုနှင့် အဓိကအားဖြင့် 'ဟာသစကားလုံးများ'၊ 'ဉာဏ်စမ်းပုံပြင်တိုများ' ဖြင့် " +
      "လှပယဉ်ကျေးစွာနှင့် ရယ်စရာကောင်းအောင် တုံ့ပြန်ရမည်။ " +
      "အမြဲတမ်း ရွှင်ပြုံးပြီး ဟာသဥာဏ်ထက်မြက်သူဖြစ်ရမည်။ " +
      "မိမိပြောသောစကား၏ နောက်ဆုံးတွင် ဟာသမြောက်သော အဆုံးသတ် သို့မဟုတ် တစ်ချက်လှည့်လိုက်သော စကားလုံး သို့မဟုတ် '(ရယ်သံများ)' ဟူသော စကားလုံးဖြင့် ပျော်ရွှင်စွာ အဆုံးသတ်ပေးရမည်။ " +
      "စကားပြောရာတွင် မြန်မာစာလုံးပေါင်း အမှန်အတိုင်း အလွန်ကျက်သရေရှိပြီး ဖတ်ရလွယ်ကူသောစာများ ရေးရမည်။ " +
      "လူတစ်ယောက်က စိတ်ညစ်နေရင်၊ အခက်အခဲကြုံနေရင်လည်း အမတ်ကြီး ဦးပေါ်ဦး ပီပီ လျင်မြန်စွာ ရယ်မောစရာ အလင်းတစ်ခုခု ပြသပေးရမည်။";

    // Format contents for generateContent
    const contents: any[] = [];
    
    // Add history
    for (const turn of history) {
      contents.push({
        role: turn.role === "assistant" ? "model" : "user",
        parts: [{ text: turn.text }]
      });
    }

    // Add current message
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.9,
      }
    });

    const reply = response.text || "အလို... စကားလုံးတွေ ဘယ်ပျောက်ကုန်တာလဲ... မှန်လှပါ၊ ကွန်ပျူတာ အခက်အခဲလေး ဖြစ်သွားပုံရပါတယ် ဘုရား (ရယ်သံများ)";
    res.json({ text: reply });
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    res.status(500).json({ error: error.message || "Something went wrong on the server" });
  }
});

// 3. POST /api/create-dialogue
app.post("/api/create-dialogue", async (req, res) => {
  try {
    const { characterA, characterB, situation } = req.body;
    if (!characterA || !characterB || !situation) {
      return res.status(400).json({ error: "characterA, characterB, and situation are required" });
    }

    const ai = getGenAI();

    const prompt = 
      `အမတ်ကြီး ဦးပေါ်ဦးစတိုင်ဖြင့် အောက်ပါ ဇာတ်ကောင်နှစ်ဦးနှင့် အခြေအနေကို အခြေခံပြီး ဟာသစကားဝိုင်း (သို့မဟုတ်) ပြောင်မြောက်သော ဉာဏ်စကား စကားဝိုင်းတိုတစ်ခု ဖန်တီးပေးပါ။

ဇာတ်ကောင် က - ${characterA}
ဇာတ်ကောင် ခ - ${characterB}
အခြေအနေ - ${situation}

သတ်မှတ်ချက် -
၁။ စကားပြောဆိုမှုသည် အလွန်ရယ်မောဖွယ်ကောင်းပြီး၊ ပညာတိုတစ်ခုခု သို့မဟုတ် ဝိရောဓိဖြစ်ရပ်တစ်ခုခုကို ကလိထိုးပြသည့် ပုံစံမျိုး ဖြစ်ရမည်။
၂။ စာကြောင်းတိုင်းသည် မြန်မာစာလုံးပေါင်း အမှန်အတိုင်းဖြစ်ရမည်။
၃။ နောက်ဆုံးတွင် ရယ်မောစရာ Punchline ပါဝင်ပြီး "(ရယ်သံများ)" ဖြင့် အဆုံးသတ်ရမည်။
၄။ ဇာတ်ကောင်နှစ်ဦး၏ အမည်များဖြင့် စကားပြော dialogue ပုံစံ ရှင်းရှင်းလင်းလင်း ဖော်ပြပေးပါ။`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        temperature: 0.85,
      }
    });

    res.json({ dialogue: response.text });
  } catch (error: any) {
    console.error("Error in /api/create-dialogue:", error);
    res.status(500).json({ error: error.message || "Something went wrong on the server" });
  }
});

// 4. POST /api/riddle-feedback
app.post("/api/riddle-feedback", async (req, res) => {
  try {
    const { riddleQuestion, userAnswer, correctAnswer } = req.body;
    if (!riddleQuestion || !userAnswer) {
      return res.status(400).json({ error: "riddleQuestion and userAnswer are required" });
    }

    const ai = getGenAI();

    const prompt = 
      `မင်းက အမတ်ကြီး ဦးပေါ်ဦး ဖြစ်သည်။ အသုံးပြုသူသည် အောက်ပါ ဉာဏ်စမ်းမေးခွန်းကို ဖြေဆိုထားသည်။
ဉာဏ်စမ်း - "${riddleQuestion}"
အဖြေမှန် - "${correctAnswer || "မသတ်မှတ်ထားပါ (မိမိဘာသာ သင့်တော်ရာ ဆုံးဖြတ်ပါ)"}"
အသုံးပြုသူ၏ အဖြေ - "${userAnswer}"

အသုံးပြုသူ၏ အဖြေကို ဦးပေါ်ဦး စတိုင်ဖြင့် သုံးသပ်ဆွေးနွေးပေးပါ။
အဖြေမှန်လျှင် အလွန်ချီးကျူးပြီး ပို၍ ရယ်မောဖွယ် စကားပြောပေးပါ။
အဖြေမှားလျှင်လည်း အားမငယ်စေဘဲ လျင်မြန်သော ဉာဏ်တော်ဖြင့် လှည့်ပတ်ပြီး ဆန်းကြယ်သော အဖြေမျိုး ပြောကာ ရယ်မောကာ စနောက်ပေးပါ။
အဆုံးသတ်တွင် "(ရယ်သံများ)" သို့မဟုတ် ဟာသသရော်ချက်လေး ထည့်ပေးပါ။
အဖြေကို ဦးပေါ်ဦးက ပြောသော စကားစစ်စစ် ပုံစံဖြင့်သာ ရေးပါ (အမတ်မင်း စတိုင်)။`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        temperature: 0.8,
      }
    });

    res.json({ feedback: response.text });
  } catch (error: any) {
    console.error("Error in /api/riddle-feedback:", error);
    res.status(500).json({ error: error.message || "Something went wrong on the server" });
  }
});

// Vite Middleware for development vs production
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server starting on http://localhost:${PORT}`);
  });
}

setupVite().catch((error) => {
  console.error("Failed to start server:", error);
});
