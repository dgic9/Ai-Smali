
import { Lesson, Language, Translation, Template, AIModel } from './types';

export const MODELS: {id: AIModel, labelKey: 'modelFlash' | 'modelPro'}[] = [
    { id: 'gemini-3-flash-preview', labelKey: 'modelFlash' },
    { id: 'gemini-3-pro-preview', labelKey: 'modelPro' }
];

export const TRANSLATIONS: Record<Language, Translation> = {
  en: {
    learn: 'Learn',
    editor: 'Editor',
    tutor: 'AI Tutor',
    curriculum: 'Curriculum',
    masterSmali: 'Master Smali step by step.',
    openEditor: 'Open in Editor',
    reset: 'Reset Code',
    analyze: 'Run Analysis',
    analysisTitle: 'AI Analysis',
    dismiss: 'Dismiss',
    askPlaceholder: 'Ask AI Tutor...',
    settings: 'Settings',
    selectLanguage: 'Select Language',
    attachCode: 'Attach Editor Code',
    codeAttached: 'Code from editor attached to context.',
    applyFix: 'Apply AI Fix',
    fixApplied: 'Fix Applied!',
    noIssues: 'No code changes needed.',
    templates: 'Templates',
    convertJava: 'Java to Smali',
    convertTitle: 'Convert Java to Smali',
    convertPlaceholder: 'Paste your Java code here (e.g., int a = 5;)...',
    converting: 'Converting...',
    insert: 'Insert',
    searchLessons: 'Search lessons...',
    close: 'Close',
    selectModel: 'Select AI Model',
    modelFlash: 'Gemini 3.0 Flash (Fast)',
    modelPro: 'Gemini 3.0 Pro (Complex Reasoning)',
  },
  hi: {
    learn: 'सीखें',
    editor: 'एडिटर',
    tutor: 'AI गुरु',
    curriculum: 'पाठ्यक्रम',
    masterSmali: 'Smali को स्टेप-बाय-स्टेप सीखें।',
    openEditor: 'एडिटर में खोलें',
    reset: 'कोड रीसेट करें',
    analyze: 'विश्लेषण करें',
    analysisTitle: 'AI विश्लेषण',
    dismiss: 'हटाएं',
    askPlaceholder: 'AI गुरु से पूछें...',
    settings: 'सेटिंग्स',
    selectLanguage: 'भाषा चुनें',
    attachCode: 'कोड जोड़ें',
    codeAttached: 'एडिटर का कोड संदर्भ में जोड़ा गया।',
    applyFix: 'सुधार लागू करें',
    fixApplied: 'सुधार लागू हो गया!',
    noIssues: 'कोई बदलाव जरूरी नहीं।',
    templates: 'टेम्पलेट्स',
    convertJava: 'Java से Smali',
    convertTitle: 'Java को Smali में बदलें',
    convertPlaceholder: 'Java कोड यहाँ पेस्ट करें...',
    converting: 'बदल रहा है...',
    insert: 'डालें',
    searchLessons: 'पाठ खोजें...',
    close: 'बंद करें',
    selectModel: 'AI मॉडल चुनें',
    modelFlash: 'Gemini 3.0 Flash (तेज़)',
    modelPro: 'Gemini 3.0 Pro (विस्तृत)',
  },
  hinglish: {
    learn: 'Seekho',
    editor: 'Editor',
    tutor: 'AI Guru',
    curriculum: 'Syllabus',
    masterSmali: 'Smali coding seekho aaram se.',
    openEditor: 'Editor me kholo',
    reset: 'Code Reset',
    analyze: 'Check Karo',
    analysisTitle: 'AI Report',
    dismiss: 'Hatao',
    askPlaceholder: 'Kuch bhi puccho...',
    settings: 'Settings',
    selectLanguage: 'Language Chuno',
    attachCode: 'Code Attach Karo',
    codeAttached: 'Editor ka code attach kar diya hai.',
    applyFix: 'Fix Apply Karo',
    fixApplied: 'Fix ho gaya!',
    noIssues: 'Code ekdum sahi hai.',
    templates: 'Templates',
    convertJava: 'Java se Smali',
    convertTitle: 'Java to Smali Convert',
    convertPlaceholder: 'Java code yahan daalo...',
    converting: 'Convert ho raha hai...',
    insert: 'Insert',
    searchLessons: 'Lessons dhundo...',
    close: 'Band karo',
    selectModel: 'AI Model Select Karo',
    modelFlash: 'Gemini 3.0 Flash (Fast)',
    modelPro: 'Gemini 3.0 Pro (Powerful)',
  }
};

export const CODE_TEMPLATES: Template[] = [
    {
        label: 'Log.d Debug',
        code: `const-string v0, "MyTag"
const-string v1, "Debug Message"
invoke-static {v0, v1}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I`
    },
    {
        label: 'Toast Message',
        code: `const-string v0, "Hello World"
const/4 v1, 0x1 # LENGTH_LONG
# Assuming p0 is Context
invoke-static {p0, v0, v1}, Landroid/widget/Toast;->makeText(Landroid/content/Context;Ljava/lang/CharSequence;I)Landroid/widget/Toast;
move-result-object v0
invoke-virtual {v0}, Landroid/widget/Toast;->show()V`
    },
    {
        label: 'Print Stack Trace',
        code: `move-exception v0
invoke-virtual {v0}, Ljava/lang/Exception;->printStackTrace()V`
    },
    {
        label: 'Thread Sleep',
        code: `const-wide/16 v0, 0x3e8 # 1000ms
invoke-static {v0, v1}, Ljava/lang/Thread;->sleep(J)V`
    },
    {
        label: 'New Method',
        code: `.method public myMethod()V
    .locals 1
    
    return-void
.end method`
    }
];

export const LESSONS: Lesson[] = [
  {
    id: '1',
    title: {
      en: 'Basic Registers',
      hi: 'बेसिक रजिस्टर्स',
      hinglish: 'Basic Registers'
    },
    description: {
      en: 'Understanding v0, p0, and local variables.',
      hi: 'v0, p0 और लोकल वेरिएबल्स को समझना।',
      hinglish: 'v0, p0 aur local variables ko samjho.'
    },
    difficulty: 'Beginner',
    content: {
      en: 'In Smali, registers are 32-bit slots used to hold data. Local registers start with v0, v1... while parameter registers start with p0, p1...',
      hi: 'Smali में, रजिस्टर 32-बिट स्लॉट होते हैं जो डेटा रखते हैं। लोकल रजिस्टर v0, v1... से शुरू होते हैं जबकि पैरामीटर p0, p1... से।',
      hinglish: 'Smali mein registers 32-bit slots hote hain data hold karne ke liye. Local registers v0, v1... se start hote hain aur parameter wale p0, p1... se.'
    },
    codeSnippet: `.method public hello()V
    .locals 1
    const-string v0, "Hello World"
    return-void
.end method`
  },
  {
    id: '2',
    title: {
      en: 'Math Operations',
      hi: 'गणितीय संक्रियाएं',
      hinglish: 'Math Operations'
    },
    description: {
      en: 'Addition, subtraction, and basic arithmetic opcodes.',
      hi: 'जोड़, घटाव और बुनियादी अंकगणितीय ऑपकोड।',
      hinglish: 'Addition, subtraction, aur basic math opcodes.'
    },
    difficulty: 'Beginner',
    content: {
      en: 'Common opcodes include add-int, sub-int, mul-int. These usually take a destination register and two source registers.',
      hi: 'सामान्य ऑपकोड में add-int, sub-int, mul-int शामिल हैं।',
      hinglish: 'Common opcodes hain add-int, sub-int, mul-int. Ye usually ek destination aur do source registers lete hain.'
    },
    codeSnippet: `const/4 v0, 0x5
const/4 v1, 0x3
add-int v2, v0, v1  # v2 = 5 + 3`
  },
  {
    id: '3',
    title: {
      en: 'If-Else & Jumps',
      hi: 'If-Else और Jumps',
      hinglish: 'If-Else aur Jumps'
    },
    description: {
      en: 'Control flow using labels and goto instructions.',
      hi: 'लेबल्स और goto निर्देशों का उपयोग करके कंट्रोल फ्लो।',
      hinglish: 'Labels aur goto use karke flow control karna.'
    },
    difficulty: 'Intermediate',
    content: {
      en: 'Smali uses "goto" and conditional branches like "if-eq" to jump to defined labels.',
      hi: 'Smali "goto" और "if-eq" जैसी कंडीशनल ब्रांचेस का उपयोग करता है।',
      hinglish: 'Smali mein "goto" aur "if-eq" use hota hai labels pe jump karne ke liye.'
    },
    codeSnippet: `    const/4 v0, 0x1
    if-eqz v0, :cond_true
    return-void
:cond_true
    const-string v1, "True!"`
  },
  {
    id: '4',
    title: {
      en: 'Field Access',
      hi: 'फील्ड्स का उपयोग',
      hinglish: 'Field Access (Variables)'
    },
    description: {
      en: 'Reading and writing class variables (iget, iput, sget, sput).',
      hi: 'क्लास वेरिएबल्स को पढ़ना और लिखना (iget, iput)।',
      hinglish: 'Class variables ko read aur write karna (iget, iput).'
    },
    difficulty: 'Intermediate',
    content: {
      en: 'Use `iget` to read an instance field and `iput` to write. Use `sget`/`sput` for static fields. Format: `iput vSource, vObject, FieldID`.',
      hi: 'इन्सटांस फील्ड पढ़ने के लिए `iget` और लिखने के लिए `iput` का उपयोग करें। स्टैटिक के लिए `sget`/`sput`।',
      hinglish: 'Instance field padhne ke liye `iget` aur likhne ke liye `iput` use karein. Static fields ke liye `sget`/`sput` lagta hai.'
    },
    codeSnippet: `sget-object v0, Ljava/lang/System;->out:Ljava/io/PrintStream;
const-string v1, "Hello"
# Write v1 into field
iput-object v1, p0, LMyClass;->myField:Ljava/lang/String;`
  },
  {
    id: '5',
    title: {
      en: 'Arrays',
      hi: 'एरे (Arrays)',
      hinglish: 'Arrays'
    },
    description: {
      en: 'Creating and manipulating arrays.',
      hi: 'एरे बनाना और उनमें बदलाव करना।',
      hinglish: 'Arrays banana aur unhe use karna.'
    },
    difficulty: 'Advanced',
    content: {
      en: '`new-array` allocates a new array. `aget` gets a value at an index, `aput` puts a value. Types are specific (e.g., `aget-object` for objects, `aget-wide` for long/double).',
      hi: '`new-array` नया एरे बनाता है। `aget` इंडेक्स से वैल्यू लेता है, `aput` वैल्यू रखता है।',
      hinglish: '`new-array` se naya array banta hai. `aget` se value lete hain aur `aput` se value daalte hain index par.'
    },
    codeSnippet: `const/4 v0, 0x5
new-array v1, v0, [I  # Create int array of size 5
const/4 v2, 0x0
const/16 v3, 0xA
aput v3, v1, v2    # array[0] = 10`
  },
  {
    id: '6',
    title: {
      en: 'Exception Handling',
      hi: 'एक्सेप्शन हैंडलिंग',
      hinglish: 'Try-Catch (Errors)'
    },
    description: {
      en: 'Catching errors using try-catch blocks.',
      hi: 'try-catch ब्लॉक का उपयोग करके गलतियों (Errors) को संभालना।',
      hinglish: 'Try-catch use karke errors ko handle karna.'
    },
    difficulty: 'Advanced',
    content: {
      en: 'Smali defines try blocks using labels. You specify the start and end labels, and where to jump if an exception occurs.',
      hi: 'Smali लेबल्स का उपयोग करके try ब्लॉक परिभाषित करता है। आपको स्टार्ट और एंड लेबल्स बताने होते हैं।',
      hinglish: 'Smali mein labels use hote hain try blocks ke liye. Aapko batana padta hai kahan start aur end hoga.'
    },
    codeSnippet: `    :try_start_0
    # Risky code here
    div-int/2addr v0, v1
    :try_end_0
    .catch Ljava/lang/ArithmeticException; {:try_start_0 .. :try_end_0} :catch_0

    return-void

    :catch_0
    # Handle error
    return-void`
  }
];

export const DEFAULT_EDITOR_CODE = `.class public LHelloWorld;
.super Ljava/lang/Object;

.method public static main([Ljava/lang/String;)V
    .locals 2

    const-string v0, "Smali Master"
    const-string v1, "AI Analysis Ready"
    
    invoke-static {v0, v1}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    return-void
.end method`;

export const getSystemInstruction = (lang: Language) => {
  const base = `You are an expert Android Smali reverse engineer and educator.`;
  
  if (lang === 'hi') {
    return `${base} Please reply in Hindi (Devanagari script). Explain concepts simply.`;
  }
  if (lang === 'hinglish') {
    return `${base} Please reply in Hinglish (Hindi written in Latin script). Keep the tone casual and helpful, like a tech friend.`;
  }
  return `${base} Please reply in English. Be concise and professional.`;
};
