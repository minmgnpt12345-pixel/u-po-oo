/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MessageSquare,
  BookOpen,
  Sparkles,
  HelpCircle,
  Send,
  RefreshCw,
  Crown,
  Smile,
  CheckCircle,
  XCircle,
  Users,
  Compass,
  ArrowRight,
  ChevronRight,
  BookOpenText,
  Volume2
} from "lucide-react";
import { ClassicJoke, ChatMessage } from "./types";

const AVATAR_PATH = "/src/assets/images/u_paw_oo_avatar_1781630192790.jpg";

const CLIENT_FALLBACK_JOKES: ClassicJoke[] = [
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
      { speaker: "ဦးပေါ်ဦး", text: "ဟဲ့... လယ်သမားကြီး... တကယ်ပဲ မင်းဘဝကို မင်း လုံးဝရောင့်ရဲကျေနပ်နေတာ ဟုတ်သလား။" },
      { speaker: "လယ်သမား", text: "မှန်လှပါ အမတ်မင်း... ကျွန်တော်မျိုး ဘာမှမလိုချင်တော့ဘဲ အပြည့်အဝ ကျေနပ်နေပါပြီ။" },
      { speaker: "ဦးပေါ်ဦး", text: "ဒါဆိုရင် ဘာဖြစ်လို့ ထီးနန်းစည်းစိမ်တစ်ဝက်ကို လိုချင်လို့ ဒီအဝေးကြီးအထိ ပင်ပန်းခံ လာတောင်းနေရတာလဲကွ။" },
      { speaker: "လယ်သမား", text: "... (မျက်လုံးပြူးကာ ဘာမှမပြောနိုင်တော့ဘဲ ငြိမ်သက်သွားသည်)" },
      { speaker: "ဘုရင်", text: "ဟားဟားဟား... ပေါ်ဦးရဲ့ မေးခွန်းက အမိုက်စားပဲဟေ့!" }
    ],
    explanation: "လူသားတို့၏ လောဘသည် အဆုံးမရှိနိုင်ကြောင်းနှင့် တကယ့်ရောင့်ရဲခြင်းအစစ်အမှန်သည် ပြင်ပစည်းစိမ်ဥစ္စာအပေါ် တပ်မက်ခြင်းကင်းမှသာ ရရှိနိုင်ကြောင်းကို ဘွင်းဘွင်းရှင်းရှင်း ထောက်ပြထားခြင်း ဖြစ်သည်။"
  }
];

export default function App() {
  // Navigation tab state
  const [activeTab, setActiveTab] = useState<"chat" | "tales" | "generator" | "riddle">("chat");

  // API loading & error states
  const [classicJokes, setClassicJokes] = useState<ClassicJoke[]>([]);
  const [loadingJokes, setLoadingJokes] = useState(false);
  
  // Chat state
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "ကဲ... မောင်မင်း အဆွေတော်တို့၊ အမတ်ကြီး ဦးပေါ်ဦး အခစားဝင်လို့ ရောက်ရှိလာပါပြီ။ ဘဝမှာ ဘယ်လို အခက်အခဲပြဿနာတွေ၊ စိတ်ညစ်စရာတွေ ကြုံတွေ့နေရလို့ တိုင်ပင်ချင်ပါသလဲ။ ရွှေဉာဏ်တော် တည့်တည့်နဲ့ ရယ်မောစရာ အဖြေလွှာတွေ ပေးဖို့ အသင့်ရှိပါတယ် ဘုရား (ရယ်သံများ)",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // AI Dialogue Generator state
  const [charA, setCharA] = useState("လင်ဖြစ်သူ ဦးကျောက်ခဲ");
  const [charB, setCharB] = useState("ဇနီးဖြစ်သူ ဒေါ်စိန်ပွင့်");
  const [situation, setSituation] = useState("ကြက်ဥတွေ အကုန်ကုန်သွားလို့ မနက်စာစားစရာမရှိဖြစ်ခြင်း");
  const [generatedDialogue, setGeneratedDialogue] = useState<string>("");
  const [dialogueLoading, setDialogueLoading] = useState(false);

  // Riddle state
  const riddles = [
    {
      id: 1,
      question: "ပေါ်ဦး... နေရာတကာ အဆိတ်သင့်စေနိုင်တဲ့ အရာက ဘာလဲ?",
      options: [
        { key: "A", text: "တောထဲက မြွေပွေး၊ မြွေဆိုးများ" },
        { key: "B", text: "သူတော်ကောင်းဟန်ဆောင်တဲ့ လောဘသားရဲ့ လျှာဖျား" },
        { key: "C", text: "အငြှိုးအတေးကြီးစွာ ချက်ထားတဲ့ ဟင်းအိုး" },
        { key: "D", text: "ဦးပေါ်ဦး ဥထားတဲ့ ဆားငန်ကြက်ဥ" }
      ],
      correctAnswer: "B",
      correctExplanation: "လောဘသားရဲ့ လျှာဖျားစကားဟာ တိုင်းပြည်တစ်ပြည်လုံး စစ်မီးတောက်စေနိုင်သလို၊ ပတ်ဝန်းကျင်တစ်ခုလုံးကို အမုန်းတရားတွေ ပြန့်ပွားစေတတ်လို့ မြွေဆိပ်ထက် ကြောက်စရာကောင်းပါတယ် အဆွေတော်။",
      riddleQuote: "မြွေဆိပ်က တစ်ကိုယ်စာပဲ ဟန့်တားနိုင်ပေမဲ့၊ လောဘသားရဲ့ နှုတ်ထွက်ကတော့ တိုင်းပြည်ပါ ပျက်စီးစေတာပေါ့ (ရယ်သံများ)။"
    },
    {
      id: 2,
      question: "လူတွေဟာ ဘယ်အချိန်မှာ အမှန်တရားကို အကြောက်ဆုံးလဲ ပေါ်ဦးကွ?",
      options: [
        { key: "A", text: "မှောင်မိုက်လွန်းတဲ့ သင်္ချိုင်းကုန်းထဲ ရောက်နေတဲ့အချိန်" },
        { key: "B", text: "ရှင်ဘုရင်ကြီး ဒေါသအမျက်ထွက်ပြီး ဓားကိုင်ရပ်နေတဲ့အချိန်" },
        { key: "C", text: "ဇနီးသည်က ခါတိုင်းထက်ပိုပြီး ချိုချိုသာသာ ပြုံးစိပြုံးစိ မေးလာတဲ့အချိန်" },
        { key: "D", text: "တရားသူကြီးက ရာဇဝတ်ကောင်ကို စစ်ဆေးမေးမြန်းနေတဲ့အချိန်" }
      ],
      correctAnswer: "C",
      correctExplanation: "မှန်လှပါဘုရား၊ အိမ်ရှင်မတွေ ခါတိုင်းထက် ထူးထူးခြားခြား ပြုံးရွှင်ပြီး လေသံအေးအေးနဲ့ မေးလာတဲ့ မေးခွန်းနောက်ကွယ်မှာ ကြောက်စရာ အမှန်တရားတစ်ခုခု ရှိနေပြီးသား ဖြစ်လို့ အိမ်ထောင်သည် ယောက်ျားတိုင်း အစိုးရိမ်ဆုံးပေါ့ ဘုရား!",
      riddleQuote: "ဓားမိုးတာထက် ဇနီးသည်ရဲ့ ပြုံးပြုံးလေး စစ်ဆေးတာက ပိုပြီး အမှန်အတိုင်း ဝန်ခံချင်စရာကောင်းပါတယ် (ရယ်သံများ)။"
    },
    {
      id: 3,
      question: "မောင်မင်း... လူတစ်ယောက်မှာ အမောရဆုံး၊ ပင်ပန်းရဆုံး ဖိနပ်က ဘာလဲ?",
      options: [
        { key: "A", text: "ခြေထောက်ထက် သုံးဆလောက်ကြီးနေတဲ့ ဖိနပ်ကြီး" },
        { key: "B", text: "သူတစ်ပါးရဲ့ ခြေရာကို အတင်းပြေးပြီး နင်းဖို့ကြိုးစားရတဲ့ ဖိနပ်" },
        { key: "C", text: "ဆူးနဲ့ ခဲအပြည့်ခံရတဲ့ တောလမ်းလျှောက်ဖိနပ်ကြမ်း" },
        { key: "D", text: "ရွှေနဲ့လုပ်ထားလို့ အလွန်လေးလံတဲ့ နန်းတွင်းဖိနပ်" }
      ],
      correctAnswer: "B",
      correctExplanation: "ကိုယ့်ခြေလှမ်းနဲ့ကိုယ် မလျှောက်လှမ်းဘဲ အောင်မြင်နေတဲ့သူ၊ ချမ်းသာနေတဲ့သူရဲ့ အရိပ် သို့မဟုတ် ခြေရာနောက်ကို အသေအလဲ လိုက်နင်းဖို့ ကြိုးစားလေလေ၊ ဘဝမှာ မောဟိုက်ပင်ပန်းပြီး ကိုယ့်လမ်းကိုယ် ပျောက်ဆုံးလေလေပါပဲ အဆွေတော်။",
      riddleQuote: "ကိုယ့်ရော်ဘာဖိနပ်စုတ်လေးနဲ့ လွတ်လပ်စွာ လျှောက်ရတာက နန်းတွင်းရွှေဖိနပ်နောက် ပြေးလိုက်ရတာထက် သက်သာပါတယ် (ရယ်သံများ)။"
    }
  ];

  const [currentRiddleIdx, setCurrentRiddleIdx] = useState(0);
  const [selectedRiddleAnswer, setSelectedRiddleAnswer] = useState<string | null>(null);
  const [riddleResult, setRiddleResult] = useState<string>("");
  const [riddleLoading, setRiddleLoading] = useState(false);

  // Selected Classic Joke detailing
  const [selectedJokeId, setSelectedJokeId] = useState<string>("egg-yogurt");
  const [jokeTab, setJokeTab] = useState<"dialogue" | "explanation">("dialogue");

  // Rotating header fun quotes
  const pawOoQuotes = [
    "“ကြက်ဥတွေ မနေ့က အကုန်စားမိသွားလို့ မရှိတော့ရင်လည်း တက်တက်ကြွကြွ ဒိန်ချဉ်စားတတ်ရတယ် မောင်မင်းရဲ့ (ရယ်သံများ)။”",
    "“ရှင်ဘုရင်စကားထက် ဇနီးသည် ဒေါသမုန်တိုင်းက ပိုပြီး အသံကျယ်သံပြင်းတယ်လို့ ဆိုချင်ပါတယ် (ရယ်သံများ)။”",
    "“ဉာဏ်ပညာဆိုတာ အလှဆင်ထားတဲ့ အိမ်ဦးခန်းထဲမှာ မဟုတ်ဘူး၊ လျင်လျင်မြန်မြန် တုံ့ပြန်နိုင်တဲ့ နှုတ်ခမ်းဖျားမှာ ရှိတာကွ။”",
    "“ထီးနန်းစီးစိမ်တစ်ဝက်ထက် ဆားတစ်ဦး ကောင်းကောင်းရွေးချယ်စားသုံးနိုင်တာက ပိုမြင့်မြတ်တာပေါ့။”"
  ];
  const [currentQuoteIdx, setCurrentQuoteIdx] = useState(0);

  // Fetch classic jokes on load
  useEffect(() => {
    async function loadJokes() {
      setLoadingJokes(true);
      try {
        const res = await fetch("/api/jokes");
        if (res.ok) {
          const data = await res.json();
          setClassicJokes(data);
        }
      } catch (err) {
        console.error("Failed to load classic jokes API", err);
      } finally {
        setLoadingJokes(false);
      }
    }
    loadJokes();

    // Rotate quote every 8 seconds
    const interval = setInterval(() => {
      setCurrentQuoteIdx((prev) => (prev + 1) % pawOoQuotes.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isTyping]);

  // Handle Chat Submit
  const handleChatSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isTyping) return;

    const userMsgText = chatInput.trim();
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: userMsgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setIsTyping(true);

    try {
      // Format context history for backend API (limit to last 8 messages to be optimized)
      const historyContext = chatMessages
        .slice(-8)
        .filter((msg) => msg.id !== "welcome")
        .map((msg) => ({
          role: msg.role,
          text: msg.text
        }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsgText,
          history: historyContext
        })
      });

      if (res.ok) {
        const data = await res.json();
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: "assistant",
          text: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error("Chat api returned error");
      }
    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "assistant",
        text: "အမတ်ကြီး တစ်ခဏတာ စဉ်းစားတွေးခေါ်ဖို့ ရွှေဉာဏ်တော် ကွန့်မြူးနေပါတယ် ဘုရား။ (ကွန်ပျူတာ၏ ဆာဗာ သို့မဟုတ် Secrets Panel တွင် GEMINI_API_KEY ကို စစ်ဆေးပေးပါ ဘုရား) (ရယ်သံများ)",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  // Helper to trigger specific ideas in Chat
  const triggerQuickScenario = (text: string) => {
    setChatInput(text);
  };

  // Handle Dialogue Generation Submit
  const handleGenerateDialogue = async () => {
    if (!charA.trim() || !charB.trim() || !situation.trim() || dialogueLoading) return;

    setDialogueLoading(true);
    setGeneratedDialogue("");
    try {
      const res = await fetch("/api/create-dialogue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          characterA: charA,
          characterB: charB,
          situation: situation
        })
      });
      if (res.ok) {
        const data = await res.json();
        setGeneratedDialogue(data.dialogue);
      } else {
        throw new Error("Failed generating dialogue code");
      }
    } catch (err) {
      console.error(err);
      setGeneratedDialogue("အလို... အမတ်ကြီး ဦးပေါ်ဦး ရေးသားနေတုန်း ကလောင်တံ ကျိုးသွားပုံရပါတယ် ဘုရား။ (ဆာဗာ သို့မဟုတ် GEMINI_API_KEY ကို ပြန်လည်စစ်ဆေးပေးပါ)");
    } finally {
      setDialogueLoading(false);
    }
  };

  // Handle Riddle Selection Option
  const handleSelectRiddleOption = async (optionKey: string) => {
    if (selectedRiddleAnswer !== null || riddleLoading) return;

    setSelectedRiddleAnswer(optionKey);
    setRiddleLoading(true);
    setRiddleResult("");

    const currentRiddle = riddles[currentRiddleIdx];
    const isCorrect = optionKey === currentRiddle.correctAnswer;

    try {
      const res = await fetch("/api/riddle-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          riddleQuestion: currentRiddle.question,
          userAnswer: currentRiddle.options.find((opt) => opt.key === optionKey)?.text || "",
          correctAnswer: currentRiddle.options.find((opt) => opt.key === currentRiddle.correctAnswer)?.text || ""
        })
      });

      if (res.ok) {
        const data = await res.json();
        setRiddleResult(data.feedback);
      } else {
        throw new Error();
      }
    } catch (err) {
      // Fallback response inside riddle
      const fallbackMsg = isCorrect 
        ? `သာဓု... ဆရာတော် သာဓုခေါ်လောက်ပါပေတယ်။ အဖြေမှန်ကွ မောင်မင်း! ${currentRiddle.correctExplanation} ${currentRiddle.riddleQuote}`
        : `အဟမ်း... မှားသွားပြီ မောင်မင်းရယ်။ စဉ်းစားဉာဏ် လွဲသွားသလား (ရယ်သံများ)။ အဖြေမှန်က "${currentRiddle.correctAnswer}" ဖြစ်တယ်။ ${currentRiddle.correctExplanation}`;
      setRiddleResult(fallbackMsg);
    } finally {
      setRiddleLoading(false);
    }
  };

  const handleNextRiddle = () => {
    setSelectedRiddleAnswer(null);
    setRiddleResult("");
    setCurrentRiddleIdx((prev) => (prev + 1) % riddles.length);
  };

  const activeJoke = classicJokes.find((j) => j.id === selectedJokeId) || CLIENT_FALLBACK_JOKES[0];

  return (
    <div className="min-h-screen bg-radial from-stone-900 to-black text-stone-100 flex flex-col antialiased">
      
      {/* Royal Gold Top Header Banner bar */}
      <div className="h-2 w-full bg-linear-to-r from-royal-burgundy via-royal-amber to-royal-burgundy shadow-md"></div>

      {/* Main Container */}
      <div className="max-w-6xl w-full mx-auto px-4 py-6 flex-1 flex flex-col">
        
        {/* Header Branding */}
        <header id="app-header" className="mb-8 text-center flex flex-col items-center border-b border-royal-burgundy/40 pb-6">
          <div className="relative mb-3 inline-block">
            <div className="absolute inset-0 bg-royal-gold blur-md opacity-30 rounded-full animate-pulse"></div>
            <img
              src={AVATAR_PATH}
              alt="အမတ်ကြီး ဦးပေါ်ဦး"
              className="relative w-24 h-24 rounded-full border-2 border-royal-gold object-cover shadow-lg"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // If generated avatar fails, fallback gracefully to a placeholder
                e.currentTarget.src = "https://picsum.photos/seed/royal-minister/150/150";
              }}
            />
            <div className="absolute -bottom-1 -right-1 bg-royal-crimson text-royal-gold border border-royal-gold rounded-full p-1 shadow-md">
              <Crown className="w-4 h-4" />
            </div>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-royal-gold select-none">
            ဦးပေါ်ဦး ပညာရှိ AI - U Paw Oo Advisor
          </h1>
          <p className="text-stone-400 text-xs sm:text-sm font-sans mt-2 max-w-lg leading-relaxed">
            မြန်မာ့သမိုင်းဝင် ရွှေဉာဏ်တော်ရှင် ကောင်စီဝင် အမတ်ကြီး ဦးပေါ်ဦး၏ ခေတ်မီဉာဏ်ပညာ၊ ဟာသဉာဏ်နှင့် စကားအလှည့်အပတ်များကို လေ့လာစမ်းသပ်နိုင်သော စိတ်အပန်းပြေကွင်း
          </p>

          {/* Golden Rotating Quotes */}
          <div className="min-h-[50px] mt-4 flex items-center justify-center max-w-2xl px-6 py-2 bg-royal-burgundy/25 rounded-lg border border-royal-gold/20">
            <p className="text-royal-amber/90 italic text-xs sm:text-sm font-sans text-center">
              {pawOoQuotes[currentQuoteIdx]}
            </p>
          </div>
        </header>

        {/* Tab Navigation Menu */}
        <div className="flex flex-wrap justify-center gap-2 mb-6 border-b border-stone-800 pb-4">
          <button
            id="tab-chat"
            onClick={() => setActiveTab("chat")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all text-xs sm:text-sm font-medium ${
              activeTab === "chat"
                ? "bg-royal-crimson text-royal-gold border-royal-gold/60 shadow-lg"
                : "bg-stone-900/60 text-stone-300 border-stone-800 hover:border-stone-700 hover:bg-stone-800/50"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>အခစားဝင်ပါ (Ask U Paw Oo)</span>
          </button>

          <button
            id="tab-tales"
            onClick={() => setActiveTab("tales")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all text-xs sm:text-sm font-medium ${
              activeTab === "tales"
                ? "bg-royal-crimson text-royal-gold border-royal-gold/60 shadow-lg"
                : "bg-stone-900/60 text-stone-300 border-stone-800 hover:border-stone-700 hover:bg-stone-800/50"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>ကျော်ကြားသော ဟာသများ (Tales)</span>
          </button>

          <button
            id="tab-generator"
            onClick={() => setActiveTab("generator")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all text-xs sm:text-sm font-medium ${
              activeTab === "generator"
                ? "bg-royal-crimson text-royal-gold border-royal-gold/60 shadow-lg"
                : "bg-stone-900/60 text-stone-300 border-stone-800 hover:border-stone-700 hover:bg-stone-800/50"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>ဟာသစကားဝိုင်းဖန်တီးခြင်း (AI Creator)</span>
          </button>

          <button
            id="tab-riddle"
            onClick={() => setActiveTab("riddle")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all text-xs sm:text-sm font-medium ${
              activeTab === "riddle"
                ? "bg-royal-crimson text-royal-gold border-royal-gold/60 shadow-lg"
                : "bg-stone-900/60 text-stone-300 border-stone-800 hover:border-stone-700 hover:bg-stone-800/50"
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>ရွှေဉာဏ်စမ်း ဆန်းစစ်ချက် (Wit Quizzes)</span>
          </button>
        </div>

        {/* Workspace Display */}
        <main className="flex-1 flex flex-col justify-stretch">
          <AnimatePresence mode="wait">
            
            {/* TAB 1: Chat/Interactive AI */}
            {activeTab === "chat" && (
              <motion.div
                key="chat-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col lg:flex-row gap-6 items-stretch"
              >
                {/* Chat Panel */}
                <div className="flex-1 bg-stone-950/80 rounded-xl border border-stone-800 flex flex-col shadow-2xl overflow-hidden min-h-[480px]">
                  
                  {/* Chat Info Header */}
                  <div className="p-4 bg-stone-900 border-b border-stone-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
                      <span className="text-xs font-mono text-stone-400">အမတ်ကြီးနှင့် တိုက်ရိုက်ဆွေးနွေးခန်း</span>
                    </div>
                    <button
                      onClick={() => setChatMessages([chatMessages[0]])}
                      title="ဆွေးနွေးမှုအသစ် ပြန်စမည်"
                      className="text-stone-500 hover:text-stone-300 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Messages Stream */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[420px] lg:max-h-[500px]">
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {msg.role === "assistant" && (
                          <img
                            src={AVATAR_PATH}
                            alt="U"
                            className="w-8 h-8 rounded-full border border-royal-gold/60 object-cover flex-shrink-0"
                            referrerPolicy="no-referrer"
                            onError={(e) => { e.currentTarget.src = "https://picsum.photos/seed/royal-minister/150/150"; }}
                          />
                        )}
                        <div
                          className={`max-w-[80%] rounded-xl px-4 py-2.5 text-xs sm:text-sm shadow-md leading-relaxed ${
                            msg.role === "user"
                              ? "bg-royal-crimson text-stone-100 rounded-tr-none border-t border-r border-royal-burgundy"
                              : "bg-stone-900 text-stone-100 rounded-tl-none border-t border-l border-stone-800"
                          }`}
                        >
                          <p className="whitespace-pre-line">{msg.text}</p>
                          <span className="block text-[10px] text-stone-500 mt-1.5 text-right font-mono">
                            {msg.timestamp}
                          </span>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex gap-3 justify-start">
                        <img
                          src={AVATAR_PATH}
                          alt="U"
                          className="w-8 h-8 rounded-full border border-royal-gold/60 object-cover flex-shrink-0"
                          referrerPolicy="no-referrer"
                          onError={(e) => { e.currentTarget.src = "https://picsum.photos/seed/royal-minister/150/150"; }}
                        />
                        <div className="bg-stone-900 rounded-xl rounded-tl-none px-4 py-3 border border-stone-800 flex items-center gap-1.5">
                          <span className="w-2 h-2 bg-royal-gold rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                          <span className="w-2 h-2 bg-royal-gold rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                          <span className="w-2 h-2 bg-royal-gold rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef}></div>
                  </div>

                  {/* Input Form */}
                  <form onSubmit={handleChatSend} className="p-3 bg-stone-900/60 border-t border-stone-800 flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="ဦးပေါ်ဦးအား မေးခွန်း သို့မဟုတ် ဘဝအခက်အခဲ တစ်ခုခု မေးဆွေးနွေးပါ..."
                      disabled={isTyping}
                      className="flex-1 bg-stone-950 text-stone-100 text-xs sm:text-sm rounded-lg px-4 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-royal-gold/60 border border-stone-800 placeholder-stone-600"
                    />
                    <button
                      type="submit"
                      disabled={isTyping || !chatInput.trim()}
                      className="bg-royal-crimson hover:bg-royal-amber hover:text-stone-950 text-royal-gold px-4 rounded-lg flex items-center justify-center transition-all disabled:opacity-40 disabled:hover:bg-royal-crimson disabled:hover:text-royal-gold cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>

                {/* Suggestions Sidebar panel */}
                <div className="lg:w-80 flex flex-col gap-4">
                  <div className="bg-stone-900/60 rounded-xl border border-stone-800/80 p-5 shadow-lg flex-1">
                    <h3 className="text-royal-gold font-display text-sm font-semibold flex items-center gap-2 mb-4 pb-2 border-b border-stone-800">
                      <Compass className="w-4 h-4 text-royal-amber" />
                      <span>စကားစရန် အထောက်အကူများ</span>
                    </h3>
                    <p className="text-stone-400 text-xs leading-relaxed mb-4">
                      အမတ်ကြီး ဦးပေါ်ဦး၏ စဉ်းစားပုံများ၊ ဟာသဉာဏ်ပညာကို ချက်ချင်းခံစားနိုင်ရန် အောက်ပါ ခေါင်းစဉ်များကို ကလစ်နှိပ်ပြီး မေးမြန်းကြည့်ပါ -
                    </p>
                    <div className="space-y-2.5">
                      {[
                        { text: "ဦးပေါ်ဦး... ဇနီးသည် စိတ်ကောက်နေရင် ဘယ်လိုချော့ရမလဲ?", label: "ဇနီးချော့နည်း" },
                        { text: "ပိုက်ဆံတွေ အကုန်လုံး ကြောစား (သို့မဟုတ်) ဆုံးရှုံးသွားရင် ဘာဆက်လုပ်ရမလဲ?", label: "ကြက်ဥနှင့်ဒိန်ချဉ်သင်ခန်းစာ" },
                        { text: "အလုပ်မှာ အမှားအယွင်းလုပ်မိလို့ ဆူပူအပြစ်ပေးခံရတော့မယ်။ ဘယ်လိုဖြေရှင်းရမလဲ?", label: "ဥပဒေအကျပ်အတည်း" },
                        { text: "ကပ်စေးနှဲတတ်တဲ့ သူဌေးကြီးတစ်ဦးကို ပညာပေးစနောက်ချင်ပါတယ်။ ဉာဏ်လမ်းညွှန်ပါဦး။", label: "သူဌေးကြီးအား ပညာပေးပုံ" }
                      ].map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => triggerQuickScenario(item.text)}
                          className="w-full text-left p-3 rounded-lg bg-stone-950/60 border border-stone-800 hover:border-royal-crimson/50 hover:bg-royal-burgundy/10 transition-all text-xs group cursor-pointer"
                        >
                          <div className="flex justify-between items-center text-royal-amber/90 font-medium mb-1 group-hover:text-royal-gold">
                            <span>{item.label}</span>
                            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <p className="text-stone-500 line-clamp-2 text-[11px] group-hover:text-stone-300">
                            {item.text}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

              </motion.div>
            )}

            {/* TAB 2: Classic Tales Catalog */}
            {activeTab === "tales" && (
              <motion.div
                key="tales-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {/* Sidebar index of jokes */}
                <div className="md:col-span-1 bg-stone-950/70 border border-stone-800 rounded-xl p-4 shadow-lg space-y-2 max-h-[500px] overflow-y-auto">
                  <h3 className="text-stone-400 text-xs font-mono mb-4 uppercase tracking-wider px-2">
                    ကျော်ကြားလှသော ဦးပေါ်ဦး ဟာသများ
                  </h3>
                  
                  {(classicJokes.length > 0 ? classicJokes : CLIENT_FALLBACK_JOKES).map((joke) => (
                    <button
                      key={joke.id}
                      onClick={() => {
                        setSelectedJokeId(joke.id);
                        setJokeTab("dialogue");
                      }}
                      className={`w-full text-left p-3.5 rounded-lg border transition-all cursor-pointer block ${
                        selectedJokeId === joke.id
                          ? "bg-royal-burgundy/40 border-royal-gold/60 text-royal-gold"
                          : "bg-stone-900/40 border-stone-900 hover:border-stone-800 text-stone-300 hover:bg-stone-800/30"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-royal-crimson/55 text-royal-gold border border-royal-gold/20">
                          {joke.tag}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-semibold line-clamp-1">{joke.title}</h4>
                      <p className="text-[11px] text-stone-500 mt-1 line-clamp-1">
                        ပါဝင်သူများ - {joke.characters.join("၊ ")}
                      </p>
                    </button>
                  ))}
                </div>

                {/* Main panel viewer */}
                <div className="md:col-span-2 flex flex-col bg-stone-950/80 rounded-xl border border-stone-800 shadow-xl overflow-hidden">
                  
                  {/* Tales header tab selectors */}
                  <div className="p-4 bg-stone-900/80 border-b border-stone-800 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                    <h2 className="text-royal-gold font-display font-bold text-sm sm:text-base flex items-center gap-2">
                      <BookOpenText className="w-5 h-5 text-royal-amber" />
                      <span>{activeJoke.title}</span>
                    </h2>

                    <div className="flex rounded-md bg-stone-950 p-1 border border-stone-850 self-start">
                      <button
                        onClick={() => setJokeTab("dialogue")}
                        className={`px-3 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                          jokeTab === "dialogue"
                            ? "bg-royal-crimson text-royal-gold"
                            : "text-stone-400 hover:text-stone-200"
                        }`}
                      >
                        ဟာသစကားဝိုင်း
                      </button>
                      <button
                        onClick={() => setJokeTab("explanation")}
                        className={`px-3 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                          jokeTab === "explanation"
                            ? "bg-royal-crimson text-royal-gold"
                            : "text-stone-400 hover:text-stone-200"
                        }`}
                      >
                        ဓမ္မဓိဋ္ဌာန် သင်ခန်းစာ
                      </button>
                    </div>
                  </div>

                  {/* Tales Viewer Container */}
                  <div className="flex-1 p-6 overflow-y-auto max-h-[400px] sm:max-h-[460px] bg-stone-950/40">
                    <AnimatePresence mode="wait">
                      {jokeTab === "dialogue" ? (
                        <motion.div
                          key="dialogue-tab-pane"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="space-y-4"
                        >
                          {activeJoke.dialogue.map((line, idx) => {
                            const isLaughter = line.speaker === "ရယ်သံများ" || line.text.includes("(ရယ်သံများ)");
                            return (
                              <div
                                key={idx}
                                className={`p-3.5 rounded-lg border ${
                                  isLaughter
                                    ? "bg-royal-amber/10 border-royal-amber/20 text-royal-amber text-center italic font-semibold text-xs sm:text-sm"
                                    : line.speaker.includes("ဦးပေါ်ဦး")
                                    ? "bg-royal-burgundy/15 border-royal-burgundy/30 text-stone-200"
                                    : "bg-stone-900/50 border-stone-800 text-stone-300"
                                }`}
                              >
                                {!isLaughter && (
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                                      line.speaker.includes("ဦးပေါ်ဦး") 
                                        ? "bg-royal-crimson text-royal-gold"
                                        : "bg-stone-800 text-stone-400"
                                    }`}>
                                      {line.speaker}
                                    </span>
                                  </div>
                                )}
                                <p className={isLaughter ? "" : "text-xs sm:text-sm leading-relaxed"}>
                                  {line.text}
                                </p>
                              </div>
                            );
                          })}
                        </motion.div>
                      ) : (
                        <motion.div
                          key="explanation-tab-pane"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="bg-stone-900/60 p-6 rounded-xl border border-stone-800 leading-relaxed space-y-4 text-xs sm:text-sm border-l-4 border-l-royal-gold"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Crown className="w-5 h-5 text-royal-gold" />
                            <h3 className="text-royal-gold font-semibold text-sm sm:text-base">
                              အမတ်ကြီး၏ ဓမ္မဓိဋ္ဌာန် ရည်ရွယ်ချက်သင်ခန်းစာ
                            </h3>
                          </div>
                          
                          <p className="text-stone-300 whitespace-pre-line leading-loose text-justify">
                            {activeJoke.explanation}
                          </p>

                          <div className="p-4 bg-stone-950/80 rounded-lg border border-stone-800 mt-6 flex items-start gap-3">
                            <Compass className="w-5 h-5 text-royal-amber flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="text-xs font-semibold text-royal-amber mb-1">စိတ်ခွန်အားပေး စကားစု</h4>
                              <p className="text-[11px] text-stone-400 italic">
                                "ဘဝမှာ တစ်ခါတလေ ကိုယ်ဖြစ်ချင်တာ မဖြစ်လာတဲ့အခါ စိတ်ဓာတ်မကျဘဲ၊ ဒိန်ချဉ်စားသလိုပဲ အကောင်းမြင်စိတ်နဲ့ အစားထိုးကျော်ဖြတ်ရတာမျိုးဟာ ဦးပေါ်ဦးရဲ့ ဉာဏ်ပဲ မောင်မင်းရယ်..."
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                </div>

              </motion.div>
            )}

            {/* TAB 3: Dialogue Generator */}
            {activeTab === "generator" && (
              <motion.div
                key="generator-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6"
              >
                {/* Control Panel configuration */}
                <div className="lg:col-span-1 bg-stone-900/60 border border-stone-800 p-5 rounded-xl shadow-lg flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="pb-3 border-b border-stone-800 mb-2">
                      <h3 className="text-royal-gold font-display text-sm sm:text-base font-semibold flex items-center gap-2">
                        <Users className="w-5 h-5 text-royal-amber" />
                        <span>ဟာသပွဲတည် ဆက်တင်များ</span>
                      </h3>
                      <p className="text-stone-500 text-[11px] leading-relaxed mt-1">
                        ဇာတ်ကောင်နှစ်ဦးနှင့် အခက်အခဲကို ထည့်သွင်းပြီး အမတ်ကြီး ဦးပေါ်ဦးစတိုင် အလှည့်အပတ်မြောက် မြန်မာဟာသ ဇာတ်လမ်းဆန်းကို ဖန်တီးပါ
                      </p>
                    </div>

                    <div>
                      <label className="block text-stone-400 text-xs font-medium mb-1.5">
                        ဇာတ်ကောင် (က) မင်းစိုးမင်းညစ် သို့မဟုတ် အမေးရှင်
                      </label>
                      <input
                        type="text"
                        value={charA}
                        onChange={(e) => setCharA(e.target.value)}
                        placeholder="ဥပမာ- ဘုရင်ခံ၊ အလုပ်ရှင်၊ လင်သား"
                        className="w-full bg-stone-950 text-stone-100 rounded-lg p-2.5 focus:outline-hidden focus:ring-1 focus:ring-royal-gold text-xs border border-stone-800"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-400 text-xs font-medium mb-1.5">
                        ဇာတ်ကောင် (ခ) ဝိရောဓိဆရာ သို့မဟုတ် အဖြေရှင် (ဦးပေါ်ဦး စတိုင်)
                      </label>
                      <input
                        type="text"
                        value={charB}
                        onChange={(e) => setCharB(e.target.value)}
                        placeholder="ဥပမာ- အမတ်ပေါ်ဦး၊ လက်ထောက်ကောင်လေး၊ ဇနီးသည်"
                        className="w-full bg-stone-950 text-stone-100 rounded-lg p-2.5 focus:outline-hidden focus:ring-1 focus:ring-royal-gold text-xs border border-stone-800"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-400 text-xs font-medium mb-1.5">
                        ဟာသဖြစ်စေမည့် အခြေအနေ (Situation)
                      </label>
                      <textarea
                        value={situation}
                        onChange={(e) => setSituation(e.target.value)}
                        rows={3}
                        placeholder="ဥပမာ- အိမ်တွင် ဆားမရှိသဖြင့် ရွှေနန်းတော်မှ ဆားတစ်ဆိတ် သွားခိုးရန် စဉ်းစားခြင်း သို့မဟုတ် ကြက်ဥမီးဖိုပျက်စီးခြင်း"
                        className="w-full bg-stone-950 text-stone-100 rounded-lg p-2.5 focus:outline-hidden focus:ring-1 focus:ring-royal-gold text-xs border border-stone-800 resize-none leading-relaxed"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleGenerateDialogue}
                    disabled={dialogueLoading || !charA.trim() || !charB.trim() || !situation.trim()}
                    className="w-full bg-royal-crimson hover:bg-royal-amber text-royal-gold hover:text-stone-950 font-semibold p-3.5 rounded-lg text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-45 disabled:hover:bg-royal-crimson disabled:hover:text-royal-gold mt-6"
                  >
                    {dialogueLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>ရွှေကလောင်ခတ်နေဆဲ... (Generating)</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>လျင်မြန်စွာ ဖန်တီးမည် (Generate)</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Response displaying screen */}
                <div className="lg:col-span-2 bg-stone-950/80 rounded-xl border border-stone-800 shadow-xl overflow-hidden min-h-[400px] flex flex-col">
                  <div className="p-4 bg-stone-900/80 border-b border-stone-800">
                    <span className="text-xs font-mono text-royal-gold">ဦးပေါ်ဦး သမိုင်းဝင် တီထွင်ဖန်တီးချက်ပြခန်း</span>
                  </div>

                  <div className="flex-1 p-6 overflow-y-auto flex flex-col justify-center bg-stone-950/40">
                    {dialogueLoading ? (
                      <div className="text-center py-12 space-y-4">
                        <div className="inline-block relative">
                          <Crown className="w-10 h-10 text-royal-amber animate-bounce" />
                          <div className="absolute inset-x-0 -bottom-1 h-1.5 bg-royal-gold/20 blur-xs rounded-full"></div>
                        </div>
                        <p className="text-royal-gold text-xs sm:text-sm italic">
                          "အလို... ဉာဏ်တော်များ လင်းလက်နေပါပြီ။ ဦးပေါ်ဦး ဇာတ်ညွှန်းကို မြန်မာစတိုင် အံကိုက်ရေးဖွဲ့နေပါတယ် ဘုရား..."
                        </p>
                      </div>
                    ) : generatedDialogue ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-stone-900/30 border border-stone-800 rounded-lg p-5 leading-relaxed text-xs sm:text-sm whitespace-pre-wrap text-stone-200"
                      >
                        {generatedDialogue}
                      </motion.div>
                    ) : (
                      <div className="text-center py-12 text-stone-500 max-w-sm mx-auto space-y-4">
                        <Compass className="w-12 h-12 stroke-1 mx-auto text-stone-700" />
                        <div>
                          <p className="text-stone-400 font-medium text-xs sm:text-sm">သတင်းအလှည့်အပတ် မရှိသေးပါ</p>
                          <p className="text-stone-600 text-[11px] mt-1.5">
                            ဘယ်ဘက်ရှိ ဆက်တင်များကို ဖြည့်စွက်ပြီး "လျင်မြန်စွာ ဖန်တီးမည်" ခလုတ်ကို နှိပ်ကာ အမတ်မင်း၏ ဟာသစကားသံ အတုမဲ့ ဇာတ်အိမ်ကို ကြည့်ရှုလိုက်ပါ
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </motion.div>
            )}

            {/* TAB 4: Riddle/Quiz Arena */}
            {activeTab === "riddle" && (
              <motion.div
                key="riddle-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex-1 max-w-3xl mx-auto w-full flex flex-col bg-stone-950/80 rounded-xl border border-stone-800 shadow-xl overflow-hidden min-h-[460px]"
              >
                
                {/* Riddle Header */}
                <div className="p-4 bg-stone-900 border-b border-stone-800 flex items-center justify-between">
                  <span className="text-xs font-mono text-royal-gold font-semibold">
                    ဦးပေါ်ဦး၏ ဉာဏ်အမြော်အမြင် ဂိမ်းကွင်း
                  </span>
                  <span className="text-[11px] bg-royal-crimson/50 text-royal-gold border border-royal-gold/20 px-2 py-0.5 rounded-full font-mono">
                    မေးခွန်း - {currentRiddleIdx + 1} / {riddles.length}
                  </span>
                </div>

                {/* Riddle Body / Interactive Panel */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  
                  {/* Riddle Prompt Question */}
                  <div className="mb-6">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-royal-burgundy text-royal-gold flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5 border border-royal-gold/30">
                        ?
                      </div>
                      <h3 className="text-xs sm:text-base font-semibold text-stone-200 leading-relaxed font-display">
                        {riddles[currentRiddleIdx].question}
                      </h3>
                    </div>
                  </div>

                  {/* Riddle Options Choices */}
                  <div className="space-y-2.5 mb-6">
                    {riddles[currentRiddleIdx].options.map((opt) => {
                      const isSelected = selectedRiddleAnswer === opt.key;
                      const isCorrectAnswer = opt.key === riddles[currentRiddleIdx].correctAnswer;
                      
                      let optBtnStyle = "bg-stone-900 border-stone-800 text-stone-300 hover:border-royal-crimson/30 hover:bg-stone-850";
                      if (selectedRiddleAnswer !== null) {
                        if (isSelected) {
                          optBtnStyle = isCorrectAnswer 
                            ? "bg-emerald-900/40 border-emerald-500 text-emerald-200"
                            : "bg-rose-950/40 border-rose-500 text-rose-300";
                        } else if (isCorrectAnswer) {
                          optBtnStyle = "bg-emerald-950/20 border-emerald-900/60 text-stone-400";
                        } else {
                          optBtnStyle = "bg-stone-950 border-stone-900/40 text-stone-600 opacity-60";
                        }
                      }

                      return (
                        <button
                          key={opt.key}
                          onClick={() => handleSelectRiddleOption(opt.key)}
                          disabled={selectedRiddleAnswer !== null}
                          className={`w-full text-left p-3.5 rounded-lg border text-xs sm:text-sm flex items-center transition-all ${optBtnStyle} ${selectedRiddleAnswer === null ? "cursor-pointer" : "cursor-default"}`}
                        >
                          <span className={`w-6 h-6 rounded-md flex items-center justify-center font-bold font-mono mr-3 text-xs border ${
                            isSelected 
                              ? "bg-royal-gold text-stone-950 border-royal-amber" 
                              : "bg-stone-950 border-stone-800 text-royal-amber"
                          }`}>
                            {opt.key}
                          </span>
                          <span className="flex-1 font-sans">{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback Panel */}
                  <AnimatePresence>
                    {selectedRiddleAnswer !== null && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`p-4 rounded-lg border mb-6 text-xs sm:text-sm leading-relaxed ${
                          selectedRiddleAnswer === riddles[currentRiddleIdx].correctAnswer
                            ? "bg-emerald-950/20 border-emerald-800 text-stone-200"
                            : "bg-rose-950/10 border-rose-900/50 text-stone-300"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 mb-2 font-display font-semibold">
                          {selectedRiddleAnswer === riddles[currentRiddleIdx].correctAnswer ? (
                            <>
                              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                              <span className="text-emerald-400">ဉာဏ်တော်အလွန်မြက်လှပါပေတယ်!</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                              <span className="text-rose-400">စဉ်းစားဉာဏ် လိုအပ်နေပါသေးတယ်၊ အပြုံးမပျက်ပါနဲ့!</span>
                            </>
                          )}
                        </div>
                        
                        {riddleLoading ? (
                          <div className="flex items-center gap-2 py-2 text-stone-500 font-mono text-[11px]">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>အမတ်ကြီး ဦးပေါ်ဦးက သင့်အဖြေကို ဉာဏ်တော်ဖြင့် တုံ့ပြန်ဆွေးနွေးနေပါသည်...</span>
                          </div>
                        ) : (
                          <p className="whitespace-pre-line text-stone-300">
                            {riddleResult}
                          </p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Riddle Controls Navigation Footer */}
                  {selectedRiddleAnswer !== null && (
                    <div className="flex justify-end border-t border-stone-850 pt-4">
                      <button
                        onClick={handleNextRiddle}
                        className="bg-royal-crimson hover:bg-royal-amber text-royal-gold hover:text-stone-950 font-semibold px-5 py-2.5 rounded-lg text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <span>နောက်ဉာဏ်စမ်းတစ်ခုဆီသို့ (Next Quiz)</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                </div>

              </motion.div>
            )}

          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-stone-800 text-center text-stone-600 text-[10px] sm:text-xs leading-relaxed max-w-xl mx-auto space-y-1.5 pb-4">
          <p>
            © {new Date().getFullYear()} ဦးပေါ်ဦး ပညာရှိ AI စနစ်။ Created with Google AI Studio & Gemini 3.5.
          </p>
          <p className="text-stone-700">
            * ဤအက်ပလီကေးရှင်းသည် မြန်မာ့သမိုင်းဝင် အမတ်ကြီး ဦးပေါ်ဦး၏ ရွှင်မြူးဖွယ် ဟာသသမိုင်းကြောင်းများကို ထိန်းသိမ်းရန်နှင့် စိတ်ပေါ့ပါးစေရန် ရည်ရွယ်ထုတ်လုပ်ထားခြင်းဖြစ်ပါသည်။
          </p>
        </footer>

      </div>
    </div>
  );
}
