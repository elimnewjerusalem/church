// ═══════════════════════════════════════════════════════════════
//  ENJC Bible — bible.js v5
//  Tamil-First | Bilingual Image | Real Audio | Mobile+PC
// ═══════════════════════════════════════════════════════════════

// ── FCBH API KEY (Free registration at 4.dbt.io → paste key here) ──
// For real human Tamil + English audio from Faith Comes By Hearing
const FCBH_KEY = "";
const FCBH_TA  = "TAMOVSN2DA"; // Tamil audio fileset
const FCBH_EN  = "ENGKJVC2DA"; // English KJV audio fileset

// ── CONFIG ──────────────────────────────────────────────────────
const C = {
  enAPI:  'https://bible-api.com/',
  taAPI1: 'https://bolls.life/get-text/TAMOVR/',
  taAPI2: 'https://bolls.life/get-text/TAMBL98/',
  taAPI3: 'https://api.getbible.net/v2/tamil/',
  fcbh:   'https://4.dbt.io/api/bibles/filesets/',
  data:   'data/',
  ms:     8000
};

// ── STATE ───────────────────────────────────────────────────────
const S = {
  lang:'ta', // DEFAULT = Tamil (Tamil-first!)
  book:'', bookName:'', bookTaName:'', bookNum:1,
  ch:1, totalCh:1, verses:[], taVerses:[], enVerses:[],
  fs:parseInt(localStorage.getItem('enjc_fs')||'18'), // larger default for Tamil
  hl:JSON.parse(localStorage.getItem('enjc_hl')||'{}'),
  bm:JSON.parse(localStorage.getItem('enjc_bm')||'[]'),
  tamilDB:{}, bibleData:{},
  igSz:'9:16', igBg:'#080c10', igTc:'#f5a623',
  igVerses:[], customVerse:null,
  audEl:null, // HTML Audio element for FCBH
  playing:false, playAllM:false, pIdx:0,
  showParallel:false,
  _audioUnlocked:false,
  _voicesLoaded:false,
  hlColor:'#f5c518',   // active highlight colour
  notes:JSON.parse(localStorage.getItem('enjc_notes')||'{}'), // verse notes
  theme:'dark',        // dark | sepia | light
  fontFamily:'noto'    // noto | latha | bamini
};

// ── TAMIL BOOK NAMES ─────────────────────────────────────────────
const BOOKS = [
  {id:'genesis',n:1,name:'Genesis',ta:'ஆதியாகமம்',ch:50,t:'OT'},
  {id:'exodus',n:2,name:'Exodus',ta:'யாத்திராகமம்',ch:40,t:'OT'},
  {id:'leviticus',n:3,name:'Leviticus',ta:'லேவியராகமம்',ch:27,t:'OT'},
  {id:'numbers',n:4,name:'Numbers',ta:'எண்ணாகமம்',ch:36,t:'OT'},
  {id:'deuteronomy',n:5,name:'Deuteronomy',ta:'உபாகமம்',ch:34,t:'OT'},
  {id:'joshua',n:6,name:'Joshua',ta:'யோசுவா',ch:24,t:'OT'},
  {id:'judges',n:7,name:'Judges',ta:'நியாயாதிபதிகள்',ch:21,t:'OT'},
  {id:'ruth',n:8,name:'Ruth',ta:'ரூத்',ch:4,t:'OT'},
  {id:'1+samuel',n:9,name:'1 Samuel',ta:'1 சாமுவேல்',ch:31,t:'OT'},
  {id:'2+samuel',n:10,name:'2 Samuel',ta:'2 சாமுவேல்',ch:24,t:'OT'},
  {id:'1+kings',n:11,name:'1 Kings',ta:'1 இராஜாக்கள்',ch:22,t:'OT'},
  {id:'2+kings',n:12,name:'2 Kings',ta:'2 இராஜாக்கள்',ch:25,t:'OT'},
  {id:'1+chronicles',n:13,name:'1 Chronicles',ta:'1 நாளாகமம்',ch:29,t:'OT'},
  {id:'2+chronicles',n:14,name:'2 Chronicles',ta:'2 நாளாகமம்',ch:36,t:'OT'},
  {id:'ezra',n:15,name:'Ezra',ta:'எஸ்றா',ch:10,t:'OT'},
  {id:'nehemiah',n:16,name:'Nehemiah',ta:'நெகேமியா',ch:13,t:'OT'},
  {id:'esther',n:17,name:'Esther',ta:'எஸ்தர்',ch:10,t:'OT'},
  {id:'job',n:18,name:'Job',ta:'யோபு',ch:42,t:'OT'},
  {id:'psalms',n:19,name:'Psalms',ta:'சங்கீதம்',ch:150,t:'OT'},
  {id:'proverbs',n:20,name:'Proverbs',ta:'நீதிமொழிகள்',ch:31,t:'OT'},
  {id:'ecclesiastes',n:21,name:'Ecclesiastes',ta:'பிரசங்கி',ch:12,t:'OT'},
  {id:'song+of+solomon',n:22,name:'Song of Solomon',ta:'உன்னதப்பாட்டு',ch:8,t:'OT'},
  {id:'isaiah',n:23,name:'Isaiah',ta:'ஏசாயா',ch:66,t:'OT'},
  {id:'jeremiah',n:24,name:'Jeremiah',ta:'எரேமியா',ch:52,t:'OT'},
  {id:'lamentations',n:25,name:'Lamentations',ta:'புலம்பல்',ch:5,t:'OT'},
  {id:'ezekiel',n:26,name:'Ezekiel',ta:'எசேக்கியேல்',ch:48,t:'OT'},
  {id:'daniel',n:27,name:'Daniel',ta:'தானியேல்',ch:12,t:'OT'},
  {id:'hosea',n:28,name:'Hosea',ta:'ஓசியா',ch:14,t:'OT'},
  {id:'joel',n:29,name:'Joel',ta:'யோவேல்',ch:3,t:'OT'},
  {id:'amos',n:30,name:'Amos',ta:'ஆமோஸ்',ch:9,t:'OT'},
  {id:'obadiah',n:31,name:'Obadiah',ta:'ஒபதியா',ch:1,t:'OT'},
  {id:'jonah',n:32,name:'Jonah',ta:'யோனா',ch:4,t:'OT'},
  {id:'micah',n:33,name:'Micah',ta:'மீகா',ch:7,t:'OT'},
  {id:'nahum',n:34,name:'Nahum',ta:'நாகூம்',ch:3,t:'OT'},
  {id:'habakkuk',n:35,name:'Habakkuk',ta:'ஆபகூக்',ch:3,t:'OT'},
  {id:'zephaniah',n:36,name:'Zephaniah',ta:'செப்பனியா',ch:3,t:'OT'},
  {id:'haggai',n:37,name:'Haggai',ta:'ஆகாய்',ch:2,t:'OT'},
  {id:'zechariah',n:38,name:'Zechariah',ta:'சகரியா',ch:14,t:'OT'},
  {id:'malachi',n:39,name:'Malachi',ta:'மல்கியா',ch:4,t:'OT'},
  {id:'matthew',n:40,name:'Matthew',ta:'மத்தேயு',ch:28,t:'NT'},
  {id:'mark',n:41,name:'Mark',ta:'மாற்கு',ch:16,t:'NT'},
  {id:'luke',n:42,name:'Luke',ta:'லூக்கா',ch:24,t:'NT'},
  {id:'john',n:43,name:'John',ta:'யோவான்',ch:21,t:'NT'},
  {id:'acts',n:44,name:'Acts',ta:'அப்போஸ்தலர் நடபடிகள்',ch:28,t:'NT'},
  {id:'romans',n:45,name:'Romans',ta:'ரோமர்',ch:16,t:'NT'},
  {id:'1+corinthians',n:46,name:'1 Corinthians',ta:'1 கொரிந்தியர்',ch:16,t:'NT'},
  {id:'2+corinthians',n:47,name:'2 Corinthians',ta:'2 கொரிந்தியர்',ch:13,t:'NT'},
  {id:'galatians',n:48,name:'Galatians',ta:'கலாத்தியர்',ch:6,t:'NT'},
  {id:'ephesians',n:49,name:'Ephesians',ta:'எபேசியர்',ch:6,t:'NT'},
  {id:'philippians',n:50,name:'Philippians',ta:'பிலிப்பியர்',ch:4,t:'NT'},
  {id:'colossians',n:51,name:'Colossians',ta:'கொலோசெயர்',ch:4,t:'NT'},
  {id:'1+thessalonians',n:52,name:'1 Thessalonians',ta:'1 தெசலோனிக்கேயர்',ch:5,t:'NT'},
  {id:'2+thessalonians',n:53,name:'2 Thessalonians',ta:'2 தெசலோனிக்கேயர்',ch:3,t:'NT'},
  {id:'1+timothy',n:54,name:'1 Timothy',ta:'1 தீமோத்தேயு',ch:6,t:'NT'},
  {id:'2+timothy',n:55,name:'2 Timothy',ta:'2 தீமோத்தேயு',ch:4,t:'NT'},
  {id:'titus',n:56,name:'Titus',ta:'தீத்து',ch:3,t:'NT'},
  {id:'philemon',n:57,name:'Philemon',ta:'பிலேமோன்',ch:1,t:'NT'},
  {id:'hebrews',n:58,name:'Hebrews',ta:'எபிரெயர்',ch:13,t:'NT'},
  {id:'james',n:59,name:'James',ta:'யாக்கோபு',ch:5,t:'NT'},
  {id:'1+peter',n:60,name:'1 Peter',ta:'1 பேதுரு',ch:5,t:'NT'},
  {id:'2+peter',n:61,name:'2 Peter',ta:'2 பேதுரு',ch:3,t:'NT'},
  {id:'1+john',n:62,name:'1 John',ta:'1 யோவான்',ch:5,t:'NT'},
  {id:'2+john',n:63,name:'2 John',ta:'2 யோவான்',ch:1,t:'NT'},
  {id:'3+john',n:64,name:'3 John',ta:'3 யோவான்',ch:1,t:'NT'},
  {id:'jude',n:65,name:'Jude',ta:'யூதா',ch:1,t:'NT'},
  {id:'revelation',n:66,name:'Revelation',ta:'வெளிப்படுத்தின விசேஷம்',ch:22,t:'NT'}
];

// ── VOTD (Tamil-first) ───────────────────────────────────────────
const VOTD = [
  {ta:"என்னால் நினைக்கப்படுகிற நினைவுகளை நான் அறிவேன்; அவைகள் சமாதானத்திற்கான நினைவுகளே, தீமைக்கல்ல; இறுதியில் உங்களுக்கு நம்பிக்கையான எதிர்காலம் கொடுக்கிறேன்.",tref:"எரேமியா 29:11",en:"For I know the plans I have for you — plans for welfare, to give you a future and a hope.",ref:"Jeremiah 29:11"},
  {ta:"உன் சம்பூர்ண இருதயத்தோடே கர்த்தரில் நம்பிக்கைவை; உன் சொந்த அறிவை நம்பாதே.",tref:"நீதிமொழிகள் 3:5",en:"Trust in the Lord with all your heart, and do not lean on your own understanding.",ref:"Proverbs 3:5"},
  {ta:"என்னை பலப்படுத்துகிற கிறிஸ்துவினால் எல்லாவற்றையும் செய்யவல்லேன்.",tref:"பிலிப்பியர் 4:13",en:"I can do all things through him who strengthens me.",ref:"Philippians 4:13"},
  {ta:"கர்த்தர் என் மேய்ப்பர்; எனக்கு குறைவுண்டாவதில்லை.",tref:"சங்கீதம் 23:1",en:"The Lord is my shepherd; I shall not want.",ref:"Psalm 23:1"},
  {ta:"திடமனதாயிரு, தைரியமாயிரு; கர்த்தர் நீ போகும் எவ்விடத்திலும் உன்னோடிருக்கிறார்.",tref:"யோசுவா 1:9",en:"Be strong and courageous. For the Lord your God is with you wherever you go.",ref:"Joshua 1:9"},
  {ta:"வருத்தப்பட்டு பாரஞ்சுமக்கிறவர்களே, என்னிடத்தில் வாருங்கள்; நான் உங்களுக்கு இளைப்பாறுதல் தருவேன்.",tref:"மத்தேயு 11:28",en:"Come to me, all who labour and are heavy laden, and I will give you rest.",ref:"Matthew 11:28"},
  {ta:"கர்த்தருக்கு காத்திருக்கிறவர்களோ புதுப்பெலன் அடைவார்கள்; கழுகுகளைப்போல சிறகடித்து ஏறுவார்கள்.",tref:"ஏசாயா 40:31",en:"Those who wait for the Lord shall renew their strength; they shall mount up with wings like eagles.",ref:"Isaiah 40:31"}
];

// ── PLAN DATA ────────────────────────────────────────────────────
const PLAN=[
  {day:"நாள் 1",ch:"சங்கீதம் 1",en:"Psalm 1",lbl:"பாக்கியமான மனுஷன்",book:"psalms",n:1},
  {day:"நாள் 2",ch:"யோவான் 1",en:"John 1",lbl:"வார்த்தை மாம்சமானது",book:"john",n:1},
  {day:"நாள் 3",ch:"ரோமர் 8",en:"Romans 8",lbl:"ஆக்கினைத்தீர்ப்பு இல்லை",book:"romans",n:8},
  {day:"நாள் 4",ch:"மத்தேயு 5",en:"Matthew 5",lbl:"பாக்கியவசனங்கள்",book:"matthew",n:5},
  {day:"நாள் 5",ch:"பிலிப்பியர் 4",en:"Philippians 4",lbl:"சந்தோஷமாயிருங்கள்",book:"philippians",n:4},
  {day:"நாள் 6",ch:"ஏசாயா 40",en:"Isaiah 40",lbl:"புதுப்பெலன் அடைவார்கள்",book:"isaiah",n:40},
  {day:"நாள் 7",ch:"வெளிப்படுத்தல் 21",en:"Revelation 21",lbl:"எல்லாம் புதிதாகும்",book:"revelation",n:21}
];

// ── IMAGE VERSES (Tamil + English bilingual) ─────────────────────
const IGVERSES=[
  {ta:"தேவன் இவ்வளவாய் உலகத்தில் அன்பு கூர்ந்தார், அதனால் தம்முடைய ஒரே பேறான குமாரனை அனுப்பினார்.",tref:"யோவான் 3:16",en:"For God so loved the world, that He gave His only begotten Son.",ref:"John 3:16"},
  {ta:"என்னை பலப்படுத்துகிற கிறிஸ்துவினால் எல்லாவற்றையும் செய்யவல்லேன்.",tref:"பிலிப்பியர் 4:13",en:"I can do all things through Christ who strengthens me.",ref:"Philippians 4:13"},
  {ta:"கர்த்தர் என் மேய்ப்பர்; எனக்கு குறைவுண்டாவதில்லை.",tref:"சங்கீதம் 23:1",en:"The Lord is my shepherd; I shall not want.",ref:"Psalm 23:1"},
  {ta:"நீ என் கண்களுக்கு அருமையானவன்; நீ கனம்பெற்றவன்; நான் உன்னை நேசிக்கிறேன்.",tref:"ஏசாயா 43:4",en:"Because you are precious in my sight, and honoured, and I love you.",ref:"Isaiah 43:4"},
  {ta:"கர்த்தருக்கு காத்திருக்கிறவர்களோ புதுப்பெலன் அடைவார்கள்; கழுகுகளைப்போல சிறகடித்து ஏறுவார்கள்.",tref:"ஏசாயா 40:31",en:"They who wait for the Lord shall renew their strength.",ref:"Isaiah 40:31"},
  {ta:"வருத்தப்பட்டு பாரஞ்சுமக்கிறவர்களே, என்னிடத்தில் வாருங்கள்; நான் உங்களுக்கு இளைப்பாறுதல் தருவேன்.",tref:"மத்தேயு 11:28",en:"Come to me, all who labour and are heavy laden, and I will give you rest.",ref:"Matthew 11:28"},
  {ta:"நான்தான் வழியும் சத்தியமும் ஜீவனுமாயிருக்கிறேன்; என்னைத் தவிர வேறொருவன் மூலமாய் பிதாவினிடத்தில் வரான்.",tref:"யோவான் 14:6",en:"I am the way, the truth, and the life. No one comes to the Father except through me.",ref:"John 14:6"},
  {ta:"ஆகினேதினாலும் ஆட்கொண்ட ஆவி நமக்கு கொடுக்கப்படவில்லை; பெலனும் அன்பும் தெளிந்த மனதும் உள்ள ஆவியே கொடுக்கப்பட்டது.",tref:"2 தீமோத்தேயு 1:7",en:"God gave us a spirit not of fear but of power and love and self-control.",ref:"2 Timothy 1:7"}
];

// ── TOPICS ───────────────────────────────────────────────────────
const TOPICS={
  faith:[{ref:"எபிரெயர் 11:1",en:"Hebrews 11:1",text:"விசுவாசமானது நம்பப்படுகிறவைகளின் உறுதியும், காணப்படாதவைகளின் நிச்சயமுமாயிருக்கிறது."},{ref:"ரோமர் 10:17",en:"Romans 10:17",text:"விசுவாசம் கேள்வியினாலே வரும்; கேள்வி தேவனுடைய வசனத்தினாலே வரும்."},{ref:"மத்தேயு 17:20",en:"Matthew 17:20",text:"கடுகுவிதை அளவு விசுவாசமுண்டாயிருந்தாலும் இந்த மலையை நகர்த்தலாம்."},{ref:"எபேசியர் 2:8",en:"Ephesians 2:8",text:"கிருபையினாலே விசுவாசத்தைக்கொண்டு இரட்சிக்கப்பட்டீர்கள்; இது உங்களால் உண்டானதல்ல, இது தேவனுடைய ஈவு."}],
  prayer:[{ref:"பிலிப்பியர் 4:6",en:"Philippians 4:6",text:"ஒன்றினிமித்தமும் கவலைப்படாமல், எல்லாவற்றிலேயும் ஸ்தோத்திரத்தோடு கூடிய விண்ணப்பங்களால் உங்கள் அபேட்சைகளை தேவனுக்கு தெரியப்படுத்துங்கள்."},{ref:"மத்தேயு 6:9",en:"Matthew 6:9",text:"பரமண்டலங்களிலிருக்கிற எங்கள் பிதாவே, உமது நாமம் பரிசுத்தப்படுவதாக."},{ref:"1 தெசலோனிக்கேயர் 5:17",en:"1 Thessalonians 5:17",text:"இடைவிடாமல் ஜெபம் பண்ணுங்கள்."},{ref:"யாக்கோபு 5:16",en:"James 5:16",text:"நீதிமானுடைய வேண்டுதல் மிகவும் பெலனுள்ளதாய் வல்லமையாய் நடக்கிறது."}],
  love:[{ref:"யோவான் 3:16",en:"John 3:16",text:"தேவன் இவ்வளவாய் உலகத்தில் அன்பு கூர்ந்தார், அதனால் தம்முடைய ஒரே பேறான குமாரனை அனுப்பினார்."},{ref:"1 கொரிந்தியர் 13:4",en:"1 Corinthians 13:4",text:"அன்பு நீடிய பொறுமையுள்ளது; அன்பு தயவுள்ளது; அன்பு பொறாமைப்படாது."},{ref:"1 யோவான் 4:8",en:"1 John 4:8",text:"அன்பில்லாதவன் தேவனை அறியான்; ஏனென்றால் தேவன் அன்பாகவே இருக்கிறார்."},{ref:"ரோமர் 8:38-39",en:"Romans 8:38-39",text:"மரணமும் ஜீவனும் தேவதூதர்களும் அதிகாரங்களும் வேறே எந்த சிருஷ்டியும் நம்மை தேவனுடைய அன்பினின்று பிரிக்கமாட்டாது."}],
  peace:[{ref:"யோவான் 14:27",en:"John 14:27",text:"சமாதானத்தை உங்களுக்கு வைத்துவிடுகிறேன், என்னுடைய சமாதானத்தை உங்களுக்கு கொடுக்கிறேன்."},{ref:"பிலிப்பியர் 4:7",en:"Philippians 4:7",text:"எல்லா அறிவையும் கடந்த தேவசமாதானம் உங்கள் இருதயங்களையும் சிந்தைகளையும் காத்துக்கொள்ளும்."},{ref:"ஏசாயா 26:3",en:"Isaiah 26:3",text:"உம்மை நம்புகிறவனுடைய மனம் உம்மில் நிலைத்திருக்கிறபடியால் அவனை நீர் பூரண சமாதானத்தில் காப்பீர்."},{ref:"ரோமர் 5:1",en:"Romans 5:1",text:"விசுவாசத்தினாலே நீதிமான்களாக்கப்பட்டிருக்கிறோம்; கர்த்தராகிய இயேசு கிறிஸ்துவின் மூலமாய் தேவனிடத்தில் சமாதானம் பெற்றிருக்கிறோம்."}],
  healing:[{ref:"ஏசாயா 53:5",en:"Isaiah 53:5",text:"அவர் நம்முடைய மீறுதல்களினிமித்தம் காயப்பட்டு, நம்முடைய அக்கிரமங்களினிமித்தம் நொறுக்கப்பட்டார்; அவருடைய தழும்புகளால் குணமாகிறோம்."},{ref:"எரேமியா 17:14",en:"Jeremiah 17:14",text:"கர்த்தாவே, என்னை குணமாக்கும், அப்பொழுது குணமாவேன்; என்னை இரட்சியும், அப்பொழுது இரட்சிக்கப்படுவேன்."},{ref:"யாக்கோபு 5:14",en:"James 5:14",text:"உங்களில் ஒருவன் வியாதிப்பட்டிருக்கிறானா? அவன் சபையிலுள்ள மூப்பர்களை வரவழைக்கட்டும்."},{ref:"சங்கீதம் 103:3",en:"Psalm 103:3",text:"அவர் உன் எல்லா அக்கிரமங்களையும் மன்னிக்கிறவரும் உன் எல்லா வியாதிகளையும் குணமாக்குகிறவருமாயிருக்கிறார்."}],
  salvation:[{ref:"யோவான் 3:16",en:"John 3:16",text:"அவரில் விசுவாசமாயிருக்கிற எவனும் கெட்டுப்போகாமல் நித்தியஜீவனை அடையும்படிக்கு தேவன் தம்முடைய ஒரே பேறான குமாரனை தந்தார்."},{ref:"ரோமர் 10:9",en:"Romans 10:9",text:"நீ இயேசுவை கர்த்தர் என்று வாயினாலே அறிக்கையிட்டு, தேவன் அவரை மரித்தோரிலிருந்து எழுப்பினார் என்று இருதயத்திலே விசுவாசித்தால் இரட்சிக்கப்படுவாய்."},{ref:"அப்போஸ்தலர் 4:12",en:"Acts 4:12",text:"வேறொருவரிலும் இரட்சிப்பில்லை; நாம் இரட்சிக்கப்படும்படிக்கு வானத்தின் கீழெங்கும் மனுஷர்களுக்குள்ளே அவருடைய நாமத்தையன்றி வேறொரு நாமம் கட்டளையிடப்படவில்லை."},{ref:"எபேசியர் 2:8",en:"Ephesians 2:8",text:"கிருபையினாலே விசுவாசத்தைக்கொண்டு இரட்சிக்கப்பட்டீர்கள்; இது உங்களால் உண்டானதல்ல, இது தேவனுடைய ஈவு."}],
  strength:[{ref:"பிலிப்பியர் 4:13",en:"Philippians 4:13",text:"என்னை பலப்படுத்துகிற கிறிஸ்துவினால் எல்லாவற்றையும் செய்யவல்லேன்."},{ref:"ஏசாயா 40:31",en:"Isaiah 40:31",text:"கர்த்தருக்கு காத்திருக்கிறவர்களோ புதுப்பெலன் அடைவார்கள்."},{ref:"சங்கீதம் 46:1",en:"Psalm 46:1",text:"தேவன் நமக்கு அடைக்கலமும் பெலனுமாயிருக்கிறார்; ஆபத்துக்காலத்தில் அவர் உதவி எளிதில் கிடைக்கும்."},{ref:"2 கொரிந்தியர் 12:9",en:"2 Corinthians 12:9",text:"என் கிருபை உனக்குப் போதும்; என் பெலன் பலவீனத்திலே பூரணமாகும்."}],
  family:[{ref:"யோசுவா 24:15",en:"Joshua 24:15",text:"என்னைப் பொறுத்தமட்டில் நானும் என் வீட்டாரும் கர்த்தரை சேவிப்போம்."},{ref:"நீதிமொழிகள் 22:6",en:"Proverbs 22:6",text:"பிள்ளையானவன் நடக்கவேண்டிய வழியிலே அவனை பழக்கு; அவன் முதிர்வயதிலும் அதை விடான்."},{ref:"எபேசியர் 6:1",en:"Ephesians 6:1",text:"பிள்ளைகளே, இது நியாயமானதாகையால் கர்த்தருக்குள் உங்கள் பெற்றோருக்கு கீழ்ப்படியுங்கள்."},{ref:"சங்கீதம் 127:3",en:"Psalm 127:3",text:"பிள்ளைகள் கர்த்தரால் அளிக்கப்படும் சுதந்தரம்; கர்ப்பத்தின் கனி அவரால் அளிக்கப்படும் பலன்."}],
  hope:[{ref:"எரேமியா 29:11",en:"Jeremiah 29:11",text:"உங்களுக்கு நம்பிக்கையான எதிர்காலம் கொடுக்கிறேன்; தீமைக்கல்ல, சமாதானத்திற்கான நினைவுகளே."},{ref:"ரோமர் 15:13",en:"Romans 15:13",text:"நம்பிக்கையின் தேவன் விசுவாசத்தினால் உங்களை சகல சந்தோஷத்தினாலும் சமாதானத்தினாலும் நிரப்புவாராக."},{ref:"புலம்பல் 3:22-23",en:"Lamentations 3:22-23",text:"கர்த்தருடைய கிருபைகள் தீர்ந்துபோவதில்லை; அவருடைய இரக்கங்கள் காலைதோறும் புதியவைகளாகும்."},{ref:"ரோமர் 8:28",en:"Romans 8:28",text:"தேவனிடத்தில் அன்பு கூருகிறவர்களுக்கு எல்லாமும் நன்மைக்கு ஏதுவாக நடக்கும் என்று அறிவோம்."}],
  worship:[{ref:"சங்கீதம் 95:1",en:"Psalm 95:1",text:"வாருங்கள், கர்த்தரை நோக்கி கெர்ஜீஷம் பாடுவோம்; நமது இரட்சணியாகிய கன்மலையை நோக்கி ஆர்ப்பரிப்போம்."},{ref:"யோவான் 4:24",en:"John 4:24",text:"தேவன் ஆவியாயிருக்கிறார்; அவரை தொழுதுகொள்ளுகிறவர்கள் ஆவியோடும் உண்மையோடும் தொழுதுகொள்ளவேண்டும்."},{ref:"ரோமர் 12:1",en:"Romans 12:1",text:"உங்கள் சரீரங்களை ஜீவனுள்ளதும் பரிசுத்தமுள்ளதும் தேவனுக்கு பிரியமுமான பலியாக ஒப்புக்கொடுங்கள்."},{ref:"சங்கீதம் 100:4",en:"Psalm 100:4",text:"ஸ்தோத்திரத்தோடே அவருடைய வாசல்களிலும், துதியோடே அவருடைய பிரகாரங்களிலும் பிரவேசியுங்கள்."}]
};

// ── INIT ─────────────────────────────────────────────────────────

// ── PANEL CONTENT GENERATORS ─────────────────────────────────────
const PANEL_TITLES={
  topics:'Topics',plan:'7-\u0ba8\u0bbe\u0bb3\u0bcd \u0ba4\u0bbf\u0b9f\u0bcd\u0b9f\u0bae\u0bcd',
  bm:'\u2665 \u0b9a\u0bc7\u0bae\u0bbf\u0baa\u0bcd\u0baa\u0bc1',img:'\u0b87\u0bae\u0bc7\u0b9c\u0bcd \u0b9c\u0bc6\u0ba9\u0bb0\u0bc7\u0b9f\u0bcd\u0b9f\u0bb0\u0bcd',
  settings:'\u0b85\u0bae\u0bc8\u0baa\u0bcd\u0baa\u0bc1\u0b95\u0bb3\u0bcd',quiz:'Bible Quiz',tracker:'\u0bb5\u0bbe\u0b9a\u0bbf\u0baa\u0bcd\u0baa\u0bc1 \u0baa\u0ba4\u0bbf\u0bb5\u0bc1'
};

function openPanel(id){
  // Deactivate all QA buttons
  document.querySelectorAll('.feat-btn,.qa-btn').forEach(b=>b.classList.remove('on','act'));
  const qb=document.getElementById('qa-'+id)||document.getElementById('feat-'+id);
  if(qb)qb.classList.add('on');

  document.getElementById('sp-title').textContent=PANEL_TITLES[id]||id;
  const body=document.getElementById('sp-body');
  body.innerHTML='<div style="text-align:center;padding:40px 0"><div class="bspin"></div></div>';
  document.getElementById('panel-overlay').classList.add('open');
  document.getElementById('side-panel').classList.add('open');
  document.body.style.overflow='hidden';

  // Load content
  setTimeout(()=>{
    if(id==='topics')renderPanelTopics(body);
    else if(id==='bm'){renderBmList();body.appendChild(document.getElementById('bmlist'));}
    else if(id==='plan'){renderPlan();body.appendChild(document.getElementById('pdays'));
      const hdr=document.createElement('div');
      hdr.style.cssText='display:flex;align-items:center;justify-content:space-between;margin-bottom:12px';
      hdr.innerHTML='<div class="pbar" style="flex:1;margin-right:12px"><div class="pfill" id="pfill2"></div></div><span id="ppct2" style="font-size:11px;color:var(--tx3)"></span>';
      body.insertBefore(hdr,body.firstChild);
      const d=getPD();
      const pct2=document.getElementById('ppct2');
      const pf2=document.getElementById('pfill2');
      if(pct2)pct2.textContent=d.length+'/7';
      if(pf2)pf2.style.width=Math.round(d.length/7*100)+'%';
    }
    else if(id==='img'){
      const igp=document.getElementById('panel-img');
      if(igp){body.innerHTML=igp.innerHTML;setTimeout(drawIG,100);}
    }
    else if(id==='settings')renderPanelSettings(body);
    else if(id==='quiz'){body.innerHTML='<div id="quiz-body"></div>';startQuiz();}
    else if(id==='tracker'){body.innerHTML='<div id="tracker-body"></div>';renderTracker();}
  },30);
}

function closePanel(){
  document.getElementById('panel-overlay').classList.remove('open');
  document.getElementById('side-panel').classList.remove('open');
  document.body.style.overflow='';
  document.querySelectorAll('.feat-btn,.qa-btn').forEach(b=>b.classList.remove('on'));
}

// Keep togPanel as alias
function togPanel(id,btn){
  const panel=document.getElementById('side-panel');
  if(panel.classList.contains('open')&&document.getElementById('sp-title').textContent===PANEL_TITLES[id]){
    closePanel();
  }else{
    openPanel(id);
  }
}

function renderPanelTopics(body){
  const pills=document.querySelector('.tpills');
  const res=document.getElementById('topic-res');
  const wrap=document.createElement('div');
  if(pills)wrap.appendChild(pills.cloneNode(true));
  const reswrap=document.createElement('div');
  reswrap.id='topic-res-panel';
  wrap.appendChild(reswrap);
  body.innerHTML='';
  body.appendChild(wrap);
  // Wire up topic pills
  wrap.querySelectorAll('.tp').forEach(tp=>{
    tp.onclick=function(){
      wrap.querySelectorAll('.tp').forEach(p=>p.classList.remove('on'));
      this.classList.add('on');
      const topic=this.getAttribute('onclick')?.match(/'(\w+)'/)?.[1];
      if(topic){
        const tmpDiv=document.createElement('div');
        showTopic(this,topic);
        reswrap.innerHTML=document.getElementById('topic-res')?.innerHTML||'';
      }
    };
  });
}

function renderPanelSettings(body){
  body.innerHTML=`
    <div style="margin-bottom:16px">
      <div style="font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:var(--tx3);margin-bottom:8px">Reading Theme</div>
      <div style="display:flex;gap:6px">
        <button class="theme-btn on" data-theme="dark" onclick="setTheme('dark')" style="flex:1;background:rgba(255,255,255,.04);border:1px solid var(--bd);border-radius:6px;padding:8px;font-size:12px;color:var(--tx2);cursor:pointer;font-family:var(--sans);transition:all .2s">\u{1F319} Dark</button>
        <button class="theme-btn" data-theme="sepia" onclick="setTheme('sepia')" style="flex:1;background:rgba(255,255,255,.04);border:1px solid var(--bd);border-radius:6px;padding:8px;font-size:12px;color:var(--tx2);cursor:pointer;font-family:var(--sans);transition:all .2s">\u{1F4DC} Sepia</button>
        <button class="theme-btn" data-theme="light" onclick="setTheme('light')" style="flex:1;background:rgba(255,255,255,.04);border:1px solid var(--bd);border-radius:6px;padding:8px;font-size:12px;color:var(--tx2);cursor:pointer;font-family:var(--sans);transition:all .2s">\u2600 Light</button>
      </div>
    </div>
    <div style="margin-bottom:16px">
      <div style="font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:var(--tx3);margin-bottom:8px">Tamil Font</div>
      <div style="display:flex;gap:6px">
        <button class="font-btn on" data-font="noto" onclick="setFontFamily('noto')" style="flex:1;background:rgba(255,255,255,.04);border:1px solid var(--bd);border-radius:6px;padding:8px;font-size:11px;color:var(--tx2);cursor:pointer;font-family:var(--sans)">Noto Serif</button>
        <button class="font-btn" data-font="latha" onclick="setFontFamily('latha')" style="flex:1;background:rgba(255,255,255,.04);border:1px solid var(--bd);border-radius:6px;padding:8px;font-size:11px;color:var(--tx2);cursor:pointer;font-family:var(--sans)">Latha</button>
        <button class="font-btn" data-font="bamini" onclick="setFontFamily('bamini')" style="flex:1;background:rgba(255,255,255,.04);border:1px solid var(--bd);border-radius:6px;padding:8px;font-size:11px;color:var(--tx2);cursor:pointer;font-family:var(--sans)">Bamini</button>
      </div>
    </div>
    <div style="margin-bottom:16px">
      <div style="font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:var(--tx3);margin-bottom:8px">Highlight Colour</div>
      <div style="display:flex;gap:8px;align-items:center">
        <div class="hlc on" data-color="#f5c518" style="width:24px;height:24px;border-radius:50%;background:#f5c518;cursor:pointer;border:2.5px solid white;flex-shrink:0" onclick="setHlColor('#f5c518')"></div>
        <div class="hlc" data-color="#4caf50" style="width:24px;height:24px;border-radius:50%;background:#4caf50;cursor:pointer;border:2px solid transparent;flex-shrink:0" onclick="setHlColor('#4caf50')"></div>
        <div class="hlc" data-color="#60b0ff" style="width:24px;height:24px;border-radius:50%;background:#60b0ff;cursor:pointer;border:2px solid transparent;flex-shrink:0" onclick="setHlColor('#60b0ff')"></div>
        <div class="hlc" data-color="#c850c8" style="width:24px;height:24px;border-radius:50%;background:#c850c8;cursor:pointer;border:2px solid transparent;flex-shrink:0" onclick="setHlColor('#c850c8')"></div>
        <div class="hlc" data-color="#ff7043" style="width:24px;height:24px;border-radius:50%;background:#ff7043;cursor:pointer;border:2px solid transparent;flex-shrink:0" onclick="setHlColor('#ff7043')"></div>
      </div>
    </div>
    <div style="margin-bottom:16px">
      <div style="font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:var(--tx3);margin-bottom:8px">Font Size</div>
      <div style="display:flex;align-items:center;gap:8px">
        <button onclick="chFont(-1)" style="background:rgba(255,255,255,.05);border:1px solid var(--bd);border-radius:6px;padding:7px 14px;font-size:13px;color:var(--tx);cursor:pointer;font-weight:600;font-family:var(--sans)">A\u2212</button>
        <span id="fszv2" style="font-size:12px;color:var(--tx3);flex:1;text-align:center">${S.fs}px</span>
        <button onclick="chFont(1)" style="background:rgba(255,255,255,.05);border:1px solid var(--bd);border-radius:6px;padding:7px 14px;font-size:13px;color:var(--tx);cursor:pointer;font-weight:600;font-family:var(--sans)">A+</button>
        <button onclick="chFont(0)" style="background:rgba(255,255,255,.05);border:1px solid var(--bd);border-radius:6px;padding:7px 10px;font-size:11px;color:var(--tx);cursor:pointer;font-family:var(--sans)">\u21ba</button>
      </div>
    </div>
    <div style="margin-bottom:16px">
      <div style="font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:var(--tx3);margin-bottom:8px">Line Spacing</div>
      <div style="display:flex;gap:6px">
        <button onclick="setSpacing(1.6)" style="flex:1;background:rgba(255,255,255,.04);border:1px solid var(--bd);border-radius:6px;padding:8px;font-size:12px;color:var(--tx2);cursor:pointer;font-family:var(--sans)">Compact</button>
        <button onclick="setSpacing(1.9)" style="flex:1;background:var(--gdm);border:1px solid var(--gdb);border-radius:6px;padding:8px;font-size:12px;color:var(--gd);cursor:pointer;font-family:var(--sans)">Normal</button>
        <button onclick="setSpacing(2.4)" style="flex:1;background:rgba(255,255,255,.04);border:1px solid var(--bd);border-radius:6px;padding:8px;font-size:12px;color:var(--tx2);cursor:pointer;font-family:var(--sans)">Wide</button>
      </div>
    </div>
    <div style="background:var(--bg3);border-radius:var(--r);padding:12px 14px">
      <div style="font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:var(--tx3);margin-bottom:8px">Offline Cache</div>
      <div style="font-size:12px;color:var(--tx2);margin-bottom:8px" id="cache-info2">Loading...</div>
      <div style="display:flex;gap:6px">
        <button onclick="try{document.getElementById('cache-info2').textContent=getCacheInfo();}catch(e){}" style="background:transparent;border:1px solid var(--bd);border-radius:99px;padding:5px 14px;font-size:11px;color:var(--tx3);cursor:pointer;font-family:var(--sans)">Refresh</button>
        <button onclick="clearTaCache();try{document.getElementById('cache-info2').textContent=getCacheInfo();}catch(e){}" style="background:transparent;border:1px solid rgba(248,113,113,.3);border-radius:99px;padding:5px 14px;font-size:11px;color:#fca5a5;cursor:pointer;font-family:var(--sans)">Clear</button>
      </div>
    </div>
  `;
  // Update cache info
  setTimeout(()=>{try{const ci2=body.querySelector('#cache-info2');if(ci2)ci2.textContent=getCacheInfo();}catch(e){}},200);
  // Sync theme/font buttons
  syncSettingsBtns();
}

function syncSettingsBtns(){
  setTimeout(()=>{
    document.querySelectorAll('.theme-btn').forEach(b=>b.classList.toggle('on',b.dataset.theme===S.theme));
    document.querySelectorAll('.font-btn').forEach(b=>b.classList.toggle('on',b.dataset.font===S.fontFamily));
  },50);
}

document.addEventListener('DOMContentLoaded',()=>{
  populateBooks();
  initFsz();
  initBmBadge();
  initVoices();
  // Show VOTD immediately from local data — no network wait
  loadVOTD();
  // Then load remote data in background
  loadData();
  setLang('ta');
  document.querySelectorAll('.menu a').forEach(a=>a.addEventListener('click',closeMenu));
  // Unlock audio on any first interaction
  document.addEventListener('click', unlockAudio, {once:true});
  document.addEventListener('touchstart', unlockAudio, {once:true});
  // Add keyboard shortcuts
  document.addEventListener('keydown',e=>{
    if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA')return;
    if(e.key==='ArrowRight')nextCh();
    if(e.key==='ArrowLeft')prevCh();
    if(e.key===' '){e.preventDefault();togPlay();}
    if(e.key==='Escape')closePanel();
  });
  // Init cache info
  const ci=document.getElementById('cache-info');
  if(ci)setTimeout(()=>{try{ci.textContent=getCacheInfo();}catch(e){}},800);
});

async function loadData(){
  try{
    const [bd,tb]=await Promise.allSettled([
      fetch(C.data+'bible-data.json').then(r=>r.json()),
      fetch(C.data+'tamil-bible.json').then(r=>r.json())
    ]);
    if(bd.status==='fulfilled') S.bibleData=bd.value;
    if(tb.status==='fulfilled') S.tamilDB=tb.value;
  }catch(e){}
  loadVOTD();
  renderPlan();
  initIGVerses();
}

// ── NAV ──────────────────────────────────────────────────────────
function toggleMenu(){document.getElementById('menu').classList.toggle('open');document.getElementById('ham').classList.toggle('open');}
function closeMenu(){document.getElementById('menu').classList.remove('open');document.getElementById('ham').classList.remove('open');}

// ── TOAST ────────────────────────────────────────────────────────
let _tt;
function toast(msg,dur=2500){
  let el=document.getElementById('btoast');
  if(!el){el=Object.assign(document.createElement('div'),{id:'btoast',className:'btoast'});document.body.appendChild(el);}
  el.innerHTML=msg;el.classList.add('show');
  clearTimeout(_tt);_tt=setTimeout(()=>el.classList.remove('show'),dur);
}

// ── VOTD ─────────────────────────────────────────────────────────
function loadVOTD(){
  let pool=VOTD;
  try{if(S.bibleData&&Array.isArray(S.bibleData.verseOfDay)&&S.bibleData.verseOfDay.length>0){
    pool=S.bibleData.verseOfDay;
  }}catch(e){}
  const day=new Date().getDay();
  const v=pool[day%pool.length];
  if(!v)return;
  window._vd=v;
  const taText=v.ta||'';
  const enText=v.en||v.text||v.ta||'';
  const taRef=v.tref||v.ref||'';
  const enRef=v.ref||v.tref||'';
  // Update all VOTD elements safely
  const safe=(id,txt)=>{const el=document.getElementById(id);if(el)el.textContent=txt;};
  safe('votd-ta','“'+taText+'”');
  safe('votd-taref','— '+taRef);
  safe('votd-en','“'+enText+'”');
  safe('votd-ref','— '+enRef);
}

function playVOTD(lang){
  const v=window._vd;if(!v)return;
  const text=lang==='ta'?(v.ta||v.en):v.en;
  speakNow(text,lang);
}

function shareVOTD(){
  const v=window._vd;if(!v)return;
  const msg=(v.tref||v.ref)+'\n'+(v.ta||'')+'\n'+v.ref+'\n'+v.en+'\n\nRead: https://elimnewjerusalem.github.io/church/bible.html';
  if(navigator.share)navigator.share({title:'ENJC Verse of the Day',text:msg});
  else{navigator.clipboard?.writeText(msg);toast('Copied!');}
}

function copyVOTD(){
  const v=window._vd;if(!v)return;
  navigator.clipboard?.writeText((v.tref||v.ref)+' \u2014 '+(v.ta||v.en));
  toast('&#128203; நகலெடுக்கப்பட்டது!');
}

function genVOTDImage(){
  const v=window._vd;if(!v)return;
  S.customVerse={ta:v.ta,tref:v.tref,en:v.en,ref:v.ref};
  togPanel('img');setTimeout(drawIG,120);
  toast('Image generator-ல் திறக்கப்பட்டது');
}

// ── LANGUAGE ─────────────────────────────────────────────────────
function setLang(l){
  S.lang=l;
  document.getElementById('btn-ta').classList.toggle('on',l==='ta');
  document.getElementById('btn-en').classList.toggle('on',l==='en');
  // Tamil info always visible when Tamil selected
  const ti=document.getElementById('tainfo');
  if(ti)ti.style.display=l==='ta'?'block':'none';
  stopAud();
  if(S.book)loadCh();
}

function togParallel(){
  S.showParallel=!S.showParallel;
  const btn=document.getElementById('para-btn');
  if(btn){
    btn.textContent=S.showParallel?'On ✓':'Off';
    btn.style.color=S.showParallel?'var(--gd)':'var(--tx2)';
    btn.style.borderColor=S.showParallel?'var(--gdb)':'var(--bd)';
    btn.style.background=S.showParallel?'var(--gdm)':'rgba(255,255,255,.05)';
  }
  if(S.verses.length)renderVerses();
}

// ── BOOKS ────────────────────────────────────────────────────────
function populateBooks(){
  const sel=document.getElementById('book-sel');
  let lt='';
  BOOKS.forEach(b=>{
    if(b.t!==lt){
      const og=document.createElement('optgroup');
      og.label=b.t==='OT'?'பழைய ஏற்பாடு (Old Testament)':'புதிய ஏற்பாடு (New Testament)';
      sel.appendChild(og);lt=b.t;
    }
    const o=document.createElement('option');o.value=b.id;
    o.textContent=b.ta+' ('+b.name+')'; // Tamil name first!
    sel.lastElementChild.appendChild(o);
  });
}

function onBook(){
  const id=document.getElementById('book-sel').value;if(!id)return;
  const bk=BOOKS.find(b=>b.id===id);
  S.book=id;S.bookName=bk.name;S.bookTaName=bk.ta;S.bookNum=bk.n;
  S.totalCh=bk.ch;S.ch=1;
  const cs=document.getElementById('ch-sel');
  cs.innerHTML='';cs.disabled=false;
  for(let i=1;i<=bk.ch;i++){
    const o=document.createElement('option');o.value=i;
    o.textContent='அதிகாரம் '+i+' (Chapter '+i+')';
    cs.appendChild(o);
  }
  document.getElementById('gobtn').style.display='block';
  loadCh();
}

function onCh(){S.ch=parseInt(document.getElementById('ch-sel').value)||1;loadCh();}

// ── LOAD CHAPTER ─────────────────────────────────────────────────
async function loadCh(){
  if(!S.book)return;
  stopAud();
  setHTML('<div class="bload"><div class="bspin"></div><p>'+(S.lang==='ta'?'தமிழ் வேதாகமம் ஏற்றுகிறது...':'Loading English Bible...')+'</p></div>');
  try{
    // Always load both Tamil + English in parallel for modal use
    const [taR, enR] = await Promise.allSettled([loadTA(), loadEN()]);
    S.taVerses = taR.status==='fulfilled' ? taR.value : [];
    S.enVerses = enR.status==='fulfilled' ? enR.value : [];
    // Primary verses = selected language
    S.verses = S.lang==='ta' ? S.taVerses : S.enVerses;
    // Fallback: if Tamil empty, use English
    if(!S.verses.length && S.lang==='ta' && S.enVerses.length){
      S.verses = S.enVerses;
      toast('Tamil இணைய இல்லை — English காட்டுகிறோம்');
    }
    if(!S.verses.length) throw new Error('வசனங்கள் கிடைக்கவில்லை — Please check internet');
    renderVerses();
    updateChUI();
  }catch(e){
    setHTML('<div class="berr">&#9888; '+e.message+'</div>');
  }
}

async function loadEN(){
  const r=await fetchT(C.enAPI+S.book+'+'+S.ch+'?translation=kjv');
  const d=await r.json();
  if(d.error)throw new Error(d.error);
  return(d.verses||[]).map(v=>({num:v.verse,text:v.text.trim().replace(/\n/g,' ')}));
}

async function loadTA(){
  const key=S.bookNum+'_'+S.ch;

  // Layer 1: embedded offline DB
  if(S.tamilDB[key])return S.tamilDB[key].map(v=>({num:v[0],text:v[1]}));

  // Layer 2: localStorage cache (auto-offline after first read)
  const ck='enjc_ta_'+key;
  try{
    const cached=localStorage.getItem(ck);
    if(cached){const p=JSON.parse(cached);if(p&&p.length)return p;}
  }catch(e){}

  // Layer 3: fetch from API + cache for offline
  for(const url of[
    C.taAPI1+S.bookNum+'/'+S.ch+'/',
    C.taAPI2+S.bookNum+'/'+S.ch+'/',
    C.taAPI3+S.bookNum+'/'+S.ch+'.json'
  ]){
    try{
      const r=await fetchT(url);if(!r.ok)continue;
      const d=await r.json();
      let verses=null;
      if(Array.isArray(d)&&d.length)verses=d.map(v=>({num:v.verse,text:v.text}));
      else if(d.verses?.length)verses=d.verses.map(v=>({num:v.verse_nr,text:v.verse}));
      if(verses&&verses.length){
        try{
          localStorage.setItem(ck,JSON.stringify(verses));
          const n=Object.keys(localStorage).filter(k=>k.startsWith('enjc_ta_')).length;
          if(n%10===0)toast('\u{1F4D6} '+n+' chapters offline saved');
        }catch(e){}
        return verses;
      }
    }catch(e){continue;}
  }
  throw new Error('No internet. Previously read chapters available offline.');
}

function clearTaCache(){
  const keys=Object.keys(localStorage).filter(k=>k.startsWith('enjc_ta_'));
  keys.forEach(k=>localStorage.removeItem(k));
  toast('Cache cleared: '+keys.length+' chapters');
}

function getCacheInfo(){
  const keys=Object.keys(localStorage).filter(k=>k.startsWith('enjc_ta_'));
  const kb=Math.round(keys.reduce((a,k)=>{try{return a+(localStorage.getItem(k)||'').length;}catch(e){return a;}},0)/1024);
  return keys.length+' chapters cached ('+kb+' KB)';
}

async function fetchT(url){
  const ctrl=new AbortController();
  const tid=setTimeout(()=>ctrl.abort(),C.ms);
  try{const r=await fetch(url,{signal:ctrl.signal});clearTimeout(tid);return r;}
  catch(e){clearTimeout(tid);throw e;}
}

function setHTML(h){document.getElementById('bcontent').innerHTML=h;}

function updateChUI(){
  document.getElementById('chbar').style.display='flex';
  // Reset progress bar
  const pf=document.getElementById('chprogf');
  if(pf)pf.style.width='0%';
  const taName=S.bookTaName||S.bookName;
  document.getElementById('chtitle').textContent=taName+' \u2014 அதிகாரம் '+S.ch;const _cs=document.getElementById('chsub');if(_cs)_cs.textContent=S.bookName+' Chapter '+S.ch;
  
  document.getElementById('prevb').disabled=S.ch<=1;
  document.getElementById('nextb').disabled=S.ch>=S.totalCh;
  document.getElementById('ch-sel').value=S.ch;
  document.getElementById('abar').style.display='flex';
  setTimeout(markChapterRead, 500);
  document.getElementById('apstat').textContent='வசனத்தை தொட்டு கேளுங்கள்';
}

function prevCh(){if(S.ch>1){S.ch--;loadCh();}}
function nextCh(){if(S.ch<S.totalCh){S.ch++;loadCh();}}

// ── RENDER VERSES ────────────────────────────────────────────────
function renderVerses(){
  const isTa=S.lang==='ta';
  const hlk=S.book+S.ch;const hlm=S.hl[hlk]||{};
  const enMap={};
  if(S.showParallel&&S.enVerses.length)S.enVerses.forEach(v=>enMap[v.num]=v.text);

  const html=S.verses.map((v,i)=>{
    const ref=(isTa?(S.bookTaName+' '+S.ch+':'+v.num):(S.bookName+' '+S.ch+':'+v.num));
    const refEN=S.bookName+' '+S.ch+':'+v.num;
    const isBm=S.bm.some(b=>b.ref===refEN);
    const isHl=!!hlm[v.num];
    const st=v.text.replace(/'/g,"\\'").replace(/\n/g,' ');
    const sr=ref.replace(/'/g,"\\'");
    const srEN=refEN.replace(/'/g,"\\'");
    const enText=enMap[v.num]||'';
    const enSt=enText.replace(/'/g,"\\'");

    return `<div class="vi${isHl?' vhl':''}${isTa?' vi-ta':''}" id="vi${i}" onclick="openVModal(${i})">
<span class="vn" onclick="playV(${i})">${v.num}</span>
<div class="vb">
<span class="vtxt${isTa?' ta-font':''}" style="font-size:${S.fs}px" onclick="playV(${i})">${v.text}</span>
${S.showParallel&&enText?`<span class="vtxt v-en-parallel" style="font-size:${Math.max(12,S.fs-2)}px">${enText}</span>`:''}
${S.notes[refEN]?`<div style="font-size:11px;color:var(--gd);line-height:1.5;margin-top:6px;padding:4px 8px;background:var(--gdm);border-radius:4px;border-left:2px solid var(--gd);font-style:italic">&#128221; ${S.notes[refEN].substring(0,60)}${S.notes[refEN].length>60?'...':''}</div>`:''}
</div>
<div class="vacts">
<button class="vbt vaplay" onclick="playV(${i})" title="${isTa?'கேளுங்கள்':'Listen'}">&#9654;</button>
<button class="vbt${isHl?' hl':''}" onclick="togHL(${v.num},${i})" title="${isTa?'குறிப்பிடு':'Highlight'}">&#9679;</button>
<button class="vbt${isBm?' bm':''}" id="bmbtn${i}" onclick="togBM('${srEN}','${st}','${sr}',${i})" title="${isTa?'சேமி':'Save'}">&#9829;</button>
<button class="vbt" onclick="cpV('${sr}','${st}')" title="${isTa?'நகலெடு':'Copy'}">&#128203;</button>
<button class="vbt" onclick="shrV('${srEN}','${st}','${sr}')" title="${isTa?'பகிர்':'Share'}">&#128279;</button>
<button class="vbt vaimg" onclick="useVerseForImg('${sr}','${st}','${srEN}','${enSt}')" title="Image">&#128247;</button>
</div>
</div>`;
  }).join('');
  setHTML('<div class="vlist">'+html+'</div>');
}

// ── AUDIO (Mobile + PC) ──────────────────────────────────────────
// Primary: FCBH real human audio (if key set)
// Secondary: Browser SpeechSynthesis (Tamil TTS)
// Always works: play/pause/stop controls on both mobile and PC

const synth=window.speechSynthesis;
let utt=null;

function initVoices(){
  // Load voices with retry — Chrome loads async
  function tryLoad(attempts){
    const vv=synth.getVoices();
    if(vv.length>0){S._voicesLoaded=true;return;}
    if(attempts>0)setTimeout(()=>tryLoad(attempts-1),300);
  }
  if(synth.onvoiceschanged!==undefined){
    synth.onvoiceschanged=()=>{synth.getVoices();S._voicesLoaded=true;};
  }
  tryLoad(10); // retry up to 10 times
}

// Unlock Web Audio on first user gesture (required by Chrome/iOS)
function unlockAudio(){
  if(S._audioUnlocked)return;
  S._audioUnlocked=true;
  // Create and immediately stop a silent audio context
  try{
    const ctx=new(window.AudioContext||window.webkitAudioContext)();
    const buf=ctx.createBuffer(1,1,22050);
    const src=ctx.createBufferSource();
    src.buffer=buf;src.connect(ctx.destination);
    src.start(0);
    ctx.resume().then(()=>ctx.close());
  }catch(e){}
  // Also init synth
  const u=new SpeechSynthesisUtterance('');
  u.volume=0;u.rate=10;
  try{synth.speak(u);}catch(e){}
}

function getTaVoice(){
  const vv=synth.getVoices();
  // Try all Tamil voice identifiers
  const taVoice=vv.find(v=>
    v.lang==='ta-IN'||v.lang==='ta'||v.lang==='ta-LK'||v.lang.startsWith('ta')||
    v.name.toLowerCase().includes('tamil')||v.name.includes('Tamil')
  );
  return taVoice||null;
}

function getEnVoice(){
  const vv=synth.getVoices();
  return vv.find(v=>v.lang==='en-IN')||
         vv.find(v=>v.lang==='en-GB')||
         vv.find(v=>v.lang==='en-US')||
         vv.find(v=>v.lang.startsWith('en'))||
         vv[0]||null;
}

// Try FCBH real audio first, fallback to TTS
async function tryFCBH(bookNum,ch,lang){
  if(!FCBH_KEY)return null;
  try{
    const fileset=lang==='ta'?FCBH_TA:FCBH_EN;
    const bkCodes=['GEN','EXO','LEV','NUM','DEU','JOS','JDG','RUT','1SA','2SA','1KI','2KI','1CH','2CH','EZR','NEH','EST','JOB','PSA','PRO','ECC','SNG','ISA','JER','LAM','EZK','DAN','HOS','JOL','AMO','OBA','JON','MIC','NAM','HAB','ZEP','HAG','ZEC','MAL','MAT','MRK','LUK','JHN','ACT','ROM','1CO','2CO','GAL','EPH','PHP','COL','1TH','2TH','1TI','2TI','TIT','PHM','HEB','JAS','1PE','2PE','1JN','2JN','3JN','JUD','REV'];
    const bk=bkCodes[bookNum-1];if(!bk)return null;
    const url=`${C.fcbh}${fileset}/${bk}/${ch}?v=4&key=${FCBH_KEY}`;
    const r=await fetch(url);if(!r.ok)return null;
    const d=await r.json();
    const files=d.data||[];
    return files[0]?.path||null;
  }catch(e){return null;}
}

function speakNow(text,lang,cb){
  unlockAudio(); // ensure audio is unlocked on PC/iOS
  stopAud();
  const lg=lang||S.lang;
  const spd=parseFloat(document.getElementById('aspd')?.value||'1');
  
  // Show audio bar immediately
  const ab=document.getElementById('abar');
  if(ab)ab.style.display='flex';
  const apst=document.getElementById('apstat');
  if(apst)apst.textContent=lg==='ta'?'ஒலி தயாரிக்கிறது...':'Preparing audio...';
  S.playing=true;updPBtn();

  setTimeout(async()=>{
    try{
      // Layer 1: FCBH real human audio
      if(FCBH_KEY&&S.bookNum){
        const url=await tryFCBH(S.bookNum,S.ch,lg);
        if(url){
          if(S.audEl){S.audEl.pause();S.audEl=null;}
          S.audEl=new Audio(url);
          S.audEl.playbackRate=spd;
          S.audEl.onplay=()=>{S.playing=true;updPBtn();if(apst)apst.textContent='Playing...';};
          S.audEl.onended=()=>{S.playing=false;updPBtn();if(cb)cb();};
          S.audEl.onerror=()=>{S.playing=false;updPBtn();useRVorTTS(text,lg,spd,cb);};
          await S.audEl.play();
          S.playing=true;updPBtn();
          return;
        }
      }
      // Layer 2+3: ResponsiveVoice / SpeechSynthesis
      useRVorTTS(text,lg,spd,cb);
    }catch(e){
      console.warn('Audio error:',e);
      useRVorTTS(text,lg,spd,cb);
    }
  },50);
}

function useRVorTTS(text,lang,spd,cb){
  const apst=document.getElementById('apstat');
  if(typeof responsiveVoice!=='undefined'&&responsiveVoice.voiceSupport()){
    S.rvReady=true;
    // PC: use UK English Male for English (more reliable on Chrome)
    const voice=lang==='ta'?'Tamil Female':(navigator.userAgent.includes('Chrome')?'UK English Male':'en-IN Female');
    const alt=lang==='ta'?'Tamil Male':'UK English Female';
    if(apst)apst.textContent=lang==='ta'?'Tamil Female voice...':'English voice...';
    let _rvDone=false;
    function rvNext(){if(_rvDone)return;_rvDone=true;S.playing=false;updPBtn();if(cb)cb();}
    // Fallback: estimate audio duration (~55ms/char) + 2s buffer
    const _rvFallback=setTimeout(()=>{if(S.playing&&!_rvDone){console.warn('RV fallback');rvNext();}},Math.max(3000,text.length*55)+2000);
    responsiveVoice.speak(text,voice,{
      rate:spd,pitch:1,volume:1,
      onstart:()=>{S.playing=true;updPBtn();if(apst)apst.textContent=lang==='ta'?'இயங்குகிறது...':'Playing...';},
      onend:()=>{clearTimeout(_rvFallback);rvNext();},
      onerror:()=>{
        clearTimeout(_rvFallback);
        responsiveVoice.speak(text,alt,{
          rate:spd,pitch:1,volume:1,
          onstart:()=>{S.playing=true;updPBtn();},
          onend:()=>{S.playing=false;updPBtn();if(cb)cb();},
          onerror:()=>{S.playing=false;updPBtn();speakTTS(text,lang,cb);}
        });
      }
    });
  }else{
    speakTTS(text,lang,cb);
  }
}

function speakTTS(text,lang,cb){
  const u=new SpeechSynthesisUtterance(text);
  u.rate=parseFloat(document.getElementById('aspd')?.value||'1');
  u.volume=1;u.pitch=1;
  const lg=lang||S.lang;
  if(lg==='ta'){
    const tv=getTaVoice();
    if(tv){u.voice=tv;u.lang=tv.lang;}
    else{
      u.lang='ta-IN';
      // Show guide only if ResponsiveVoice also not available
      if(!S.rvReady&&!window._taWarn){
        window._taWarn=true;
        setTimeout(()=>showTaGuide(),500);
      }
    }
  }else{
    const ev=getEnVoice();
    if(ev){u.voice=ev;u.lang=ev.lang;}
    else u.lang='en-IN';
  }
  let _ttsEnded=false;
  function onTTSEnd(){if(_ttsEnded)return;_ttsEnded=true;S.playing=false;updPBtn();if(cb)cb();}
  u.onend=onTTSEnd;
  // Fallback for Chrome PC where onend sometimes doesn't fire
  const estDur=Math.max(3000, text.length * 70);
  const _ttsFallback=setTimeout(()=>{if(S.playing&&!_ttsEnded)onTTSEnd();}, estDur+2000);
  u.onstart=()=>{S.playing=true;updPBtn();clearTimeout(_ttsFallback);
    // Reset fallback from actual start
    setTimeout(()=>{if(S.playing&&!_ttsEnded)onTTSEnd();}, estDur+2000);
  };
  u.onerror=(e)=>{clearTimeout(_ttsFallback);S.playing=false;updPBtn();
    if(e.error!=='interrupted'){
      const msg=S.lang==='ta'?
        'Tamil TTS இல்லை — Browser settings-ல் Tamil voice install பண்ணுங்கள்':
        'Audio playback error — check browser permissions';
      const apst=document.getElementById('apstat');
      if(apst)apst.textContent=msg;
      toast('&#128266; '+msg,3500);
    }
  };
  utt=u;synth.speak(u);S.playing=true;updPBtn();
}

function showTaGuide(){
  const g=document.getElementById('ta-guide');
  if(g)g.style.display='block';
}

function hideTaGuide(){
  const g=document.getElementById('ta-guide');
  if(g)g.style.display='none';
}

async function playV(i){
  unlockAudio();
  S.playAllM=false;S.pIdx=i;
  const v=S.verses[i];if(!v)return;
  hlPlay(i);
  const taName=S.bookTaName||S.bookName;
  // Show audio bar immediately
  const ab=document.getElementById('abar');
  if(ab)ab.style.display='flex';
  document.getElementById('aptitle').textContent=(S.lang==='ta'?taName:S.bookName)+' '+S.ch+':'+v.num;
  document.getElementById('apstat').textContent=(S.lang==='ta'?'வசனம் '+v.num+' இயங்குகிறது...':'Playing verse '+v.num+'...');
  speakNow(v.text,S.lang);
}

function playAll(){
  if(!S.verses.length)return;
  S.playAllM=true;S.pIdx=0;seqPlay();
}

function seqPlay(){
  if(!S.playAllM||S.pIdx>=S.verses.length){
    S.playAllM=false;S.playing=false;updPBtn();
    const st=document.getElementById('apstat');
    if(st)st.textContent=(S.lang==='ta'?'முடிந்தது ✓':'Finished ✓');
    return;
  }
  const v=S.verses[S.pIdx];
  hlPlay(S.pIdx);
  const st=document.getElementById('apstat');
  if(st)st.textContent=(S.lang==='ta'?'வசனம் ':'Verse ')+v.num+' / '+S.verses.length;
  document.getElementById('vi'+S.pIdx)?.scrollIntoView({behavior:'smooth',block:'center'});
  
  // Callback with timeout fallback — mobile SpeechSynthesis sometimes misses onend
  let _cbCalled=false;
  function nextVerse(){
    if(_cbCalled)return;
    _cbCalled=true;
    S.pIdx++;
    seqPlay();
  }
  // Estimate verse duration for fallback: ~65ms per character
  const estMs=Math.max(2000, v.text.length * 65);
  const fallbackTimer=setTimeout(()=>{
    if(S.playAllM&&!_cbCalled){
      console.warn('seqPlay fallback timer fired for verse',v.num);
      nextVerse();
    }
  }, estMs + 1500);
  
  speakNow(v.text, S.lang, ()=>{
    clearTimeout(fallbackTimer);
    nextVerse();
  });
}

function hlPlay(i){
  document.querySelectorAll('.vi').forEach(el=>el.classList.remove('vplay'));
  document.getElementById('vi'+i)?.classList.add('vplay');
  // Update reading progress
  if(S.verses.length){
    const pct=Math.round((i+1)/S.verses.length*100);
    const pf=document.getElementById('chprogf');
    if(pf)pf.style.width=pct+'%';
  }
}

function togPlay(){
  if(S.audEl&&!S.audEl.paused){S.audEl.pause();S.playing=false;updPBtn();}
  else if(S.audEl&&S.audEl.paused){S.audEl.play();S.playing=true;updPBtn();}
  else if(synth.speaking&&!synth.paused){synth.pause();S.playing=false;updPBtn();document.getElementById('apstat').textContent=S.lang==='ta'?'இடைநிறுத்தம்':'Paused';}
  else if(synth.paused){synth.resume();S.playing=true;updPBtn();document.getElementById('apstat').textContent=S.lang==='ta'?'இயங்குகிறது...':'Playing...';}
  else if(S.verses.length)playAll();
}

function stopAud(){
  try{if(typeof responsiveVoice!=='undefined')responsiveVoice.cancel();}catch(e){}
  if(S.audEl){S.audEl.pause();S.audEl.currentTime=0;S.audEl=null;}
  synth.cancel();
  S.playing=false;S.playAllM=false;updPBtn();
  document.querySelectorAll('.vi').forEach(el=>el.classList.remove('vplay'));
  const s=document.getElementById('apstat');
  if(s)s.textContent=S.lang==='ta'?'நிறுத்தப்பட்டது':'Stopped';
}

function updPBtn(){
  const pi=document.getElementById('plic');const pu=document.getElementById('puic');
  if(pi)pi.style.display=S.playing?'none':'block';
  if(pu)pu.style.display=S.playing?'block':'none';
}

function chSpd(){
  const rate=parseFloat(document.getElementById('aspd').value)||1;
  if(S.audEl)S.audEl.playbackRate=rate;
  if(S.playing){const i=S.pIdx;stopAud();setTimeout(()=>playV(i),150);}
}

// ── VERSE ACTIONS ────────────────────────────────────────────────
function cpV(ref,text){
  navigator.clipboard?.writeText(ref+' \u2014 '+text);
  toast('&#128203; '+(S.lang==='ta'?'நகலெடுக்கப்பட்டது!':'Copied!')+' '+ref.split(' ').slice(-1)[0]);
}

function shrV(refEN,text,refTA){
  const ref=S.lang==='ta'?(refTA||refEN):refEN;
  const msg=ref+'\n'+text+'\n\nRead: https://elimnewjerusalem.github.io/church/bible.html';
  if(navigator.share)navigator.share({title:'ENJC Bible',text:msg});
  else{navigator.clipboard?.writeText(msg);toast(S.lang==='ta'?'நகலெடுக்கப்பட்டது!':'Copied to share!');}
}

function useVerseForImg(taRef,taText,enRef,enText){
  S.customVerse={ta:taText,tref:taRef,en:enText,ref:enRef};
  togPanel('img');setTimeout(drawIG,100);
  toast(S.lang==='ta'?'Image generator-ல் திறக்கப்பட்டது \u2192':'Loaded in Image Generator \u2192');
}

// ── HIGHLIGHT ────────────────────────────────────────────────────
function showHlPicker(){
  const p=document.getElementById('hl-picker');
  if(p)p.style.display=p.style.display==='flex'?'none':'flex';
}
function togHL(vnum,i,color){
  const k=S.book+S.ch;if(!S.hl[k])S.hl[k]={};
  const el=document.getElementById('vi'+i);
  const btn=el?.querySelectorAll('.vbt')[1];
  if(S.hl[k][vnum]&&!color){
    delete S.hl[k][vnum];
    el?.classList.remove('vhl');
    el?.style.removeProperty('--hl-color');
    btn?.classList.remove('hl');
    toast(S.lang==='ta'?'குறிப்பு நீக்கப்பட்டது':'Highlight removed');
  }else{
    const c=color||S.hlColor||'#f5c518';
    S.hl[k][vnum]=c;
    el?.classList.add('vhl');
    el?.style.setProperty('--hl-color',c);
    btn?.classList.add('hl');
    toast(S.lang==='ta'?'&#9679; குறிப்பிடப்பட்டது':'&#9679; Highlighted');
  }
  localStorage.setItem('enjc_hl',JSON.stringify(S.hl));
}

function setHlColor(color){
  S.hlColor=color;
  document.querySelectorAll('.hlc').forEach(el=>{
    const isOn=el.dataset.color===color;
    el.style.borderColor=isOn?'white':'transparent';
    el.style.transform=isOn?'scale(1.15)':'scale(1)';
  });
  toast('&#9679; Highlight colour set');
}

// ── BOOKMARKS ────────────────────────────────────────────────────
function getBM(){return JSON.parse(localStorage.getItem('enjc_bm')||'[]');}
function saveBM(bms){localStorage.setItem('enjc_bm',JSON.stringify(bms));S.bm=bms;}

function togBM(refEN,text,refTA,i){
  const ref=refEN;
  const bms=getBM();const fi=bms.findIndex(b=>b.ref===ref);
  const btn=document.getElementById('bmbtn'+i);
  if(fi>=0){bms.splice(fi,1);btn?.classList.remove('bm');toast(S.lang==='ta'?'சேமிப்பிலிருந்து நீக்கப்பட்டது':'Removed');}
  else{bms.unshift({ref:refEN,refTA,text});btn?.classList.add('bm');toast(S.lang==='ta'?'\u2665 வசனம் சேமிக்கப்பட்டது!':'\u2665 Saved!');}
  saveBM(bms);initBmBadge();
}

function initBmBadge(){
  const bms=getBM();const n=bms.length;
  const el=document.getElementById('qa-bm');
  if(el){const lbl=el.querySelector('.qal');if(lbl)lbl.textContent=n?'சேமிப்பு ('+n+')':'சேமிப்பு';}
}

function renderBmList(){
  const bms=getBM();const el=document.getElementById('bmlist');
  if(!bms.length){el.innerHTML='<div class="bempty">&#9829; சேமித்த வசனங்கள் இல்லை.<br>வசனத்தில் &#9829; அழுத்துங்கள்.</div>';return;}
  el.innerHTML=bms.map((b,i)=>{
    const sr=(b.refTA||b.ref).replace(/'/g,"\\'");const st=b.text.replace(/'/g,"\\'");
    const srEN=b.ref.replace(/'/g,"\\'");
    return `<div class="vi" style="margin-bottom:6px">
<div class="vb"><div class="vtag">${b.refTA||b.ref}</div>
<span class="vtxt ta-font" style="font-size:${S.fs}px">${b.text}</span>
${b.ref!==b.refTA&&b.ref?`<div class="vtag" style="margin-top:5px;opacity:.6">${b.ref}</div>`:''}
</div>
<div class="vacts" style="opacity:1">
<button class="vbt" onclick="cpV('${sr}','${st}')">&#128203;</button>
<button class="vbt" onclick="shrV('${srEN}','${st}','${sr}')">&#128279;</button>
<button class="vbt" onclick="rmBM(${i})" style="color:#f87171">&#10005;</button>
</div></div>`;
  }).join('');
}

function rmBM(i){const bms=getBM();bms.splice(i,1);saveBM(bms);renderBmList();initBmBadge();toast(S.lang==='ta'?'நீக்கப்பட்டது':'Removed');}

// ── FONT SIZE ─────────────────────────────────────────────────────
function initFsz(){document.getElementById('fszv').textContent=S.fs+'px';}
function chFont(d){
  S.fs=d===0?18:Math.min(30,Math.max(13,S.fs+d*2));
  localStorage.setItem('enjc_fs',S.fs);
  document.getElementById('fszv').textContent=S.fs+'px';
  document.querySelectorAll('.vtxt').forEach(el=>el.style.fontSize=S.fs+'px');
}

// ── PANEL TOGGLE ─────────────────────────────────────────────────
// togPanel — defined above with openPanel


// ── TOPIC SEARCH (Tamil) ──────────────────────────────────────────
function showTopic(btn,topic){
  document.querySelectorAll('.tp').forEach(p=>p.classList.remove('on'));
  btn.classList.add('on');
  const vv=TOPICS[topic]||[];
  document.getElementById('topic-res').innerHTML=vv.map((v,i)=>{
    const sr=v.ref.replace(/'/g,"\\'");const st=v.text.replace(/'/g,"\\'");
    const srEN=(v.en||v.ref).replace(/'/g,"\\'");
    return `<div class="vi" style="margin-bottom:6px">
<span class="vn">${i+1}</span>
<div class="vb"><div class="vtag">${v.ref}${v.en?' | '+v.en:''}</div>
<span class="vtxt ta-font" style="font-size:${S.fs}px">${v.text}</span></div>
<div class="vacts" style="opacity:1">
<button class="vbt" onclick="cpV('${sr}','${st}')">&#128203;</button>
<button class="vbt" onclick="shrV('${srEN}','${st}','${sr}')">&#128279;</button>
<button class="vbt" onclick="useVerseForImg('${sr}','${st}','${srEN}','')">&#128247;</button>
</div></div>`;
  }).join('')||'<div class="bempty">வசனங்கள் கிடைக்கவில்லை.</div>';
}

// ── READING PLAN (Tamil) ──────────────────────────────────────────
function getPD(){return JSON.parse(localStorage.getItem('enjc_pd')||'[]');}
function savePD(d){localStorage.setItem('enjc_pd',JSON.stringify(d));}

function renderPlan(){
  const done=getPD();const cnt=done.length;
  document.getElementById('ppct').textContent=cnt+'/'+PLAN.length;
  document.getElementById('pfill').style.width=Math.round(cnt/PLAN.length*100)+'%';
  document.getElementById('pdays').innerHTML=PLAN.map((p,i)=>{
    const isDone=done.includes(i);
    return `<div class="pday${isDone?' done':''}" onclick="togPDay(${i})">
<div class="pchk">${isDone?'&#10003;':''}</div>
<div class="pinfo"><div class="plbl">${p.day}</div>
<div class="pch">${p.ch} <span style="opacity:.5;font-size:.82em">\u2014 ${p.lbl}</span></div></div>
<button class="pgo" onclick="event.stopPropagation();goPlan(${i})">படி &rarr;</button>
</div>`;
  }).join('');
}

function togPDay(i){
  const done=getPD();const idx=done.indexOf(i);
  if(idx>=0)done.splice(idx,1);else done.push(i);
  savePD(done);renderPlan();
  toast(done.includes(i)?'நாள் '+(i+1)+' முடிந்தது \u2713':'குறிப்பு நீக்கப்பட்டது');
}

function goPlan(i){
  const p=PLAN[i];if(!p)return;
  const bk=BOOKS.find(b=>b.id===p.book);if(!bk)return;
  document.getElementById('book-sel').value=p.book;
  S.book=p.book;S.bookName=bk.name;S.bookTaName=bk.ta;S.bookNum=bk.n;S.totalCh=bk.ch;S.ch=p.n;
  const cs=document.getElementById('ch-sel');
  cs.innerHTML='';cs.disabled=false;
  for(let j=1;j<=bk.ch;j++){const o=document.createElement('option');o.value=j;o.textContent='அதிகாரம் '+j+' (Chapter '+j+')';cs.appendChild(o);}
  cs.value=p.n;
  document.getElementById('gobtn').style.display='block';
  togPanel('plan');loadCh();
  window.scrollTo({top:document.getElementById('bcontent').offsetTop-80,behavior:'smooth'});
}

function resetPlan(){savePD([]);renderPlan();toast(S.lang==='ta'?'திட்டம் மீட்டமைக்கப்பட்டது':'Plan reset');}

// ── SEARCH ───────────────────────────────────────────────────────
async function doSearch(){
  const q=document.getElementById('sinp').value.trim();if(!q)return;
  stopAud();
  document.getElementById('chbar').style.display='none';
  setHTML('<div class="bload"><div class="bspin"></div><p>தேடுகிறது...</p></div>');
  try{
    const r=await fetchT(C.enAPI+encodeURIComponent(q)+'?translation=kjv');
    const d=await r.json();if(d.error)throw new Error(d.error);
    const vv=d.verses||[];
    setHTML('<p style="color:var(--mt);font-size:.85rem;margin-bottom:14px">"'+q+'" \u2014 '+vv.length+' results</p><div class="vlist">'+
      vv.map(v=>{
        const ref=v.book_name+' '+v.chapter+':'+v.verse;
        const txt=v.text.replace(/\n/g,' ');
        const sr=ref.replace(/'/g,"\\'");const st=txt.replace(/'/g,"\\'");
        return `<div class="vi"><span class="vn">&#9733;</span>
<div class="vb"><div class="vtag">${ref}</div><span class="vtxt">${txt}</span></div>
<div class="vacts" style="opacity:1">
<button class="vbt" onclick="cpV('${sr}','${st}')">&#128203;</button>
<button class="vbt" onclick="useVerseForImg('${sr}','${st}','${sr}','${st}')">&#128247;</button>
</div></div>`;
      }).join('')+'</div>');
  }catch(e){setHTML('<div class="berr">முடிவு இல்லை "'+q+'" \u2014 John 3:16 அல்லது faith என்று முயற்சிக்கவும்.</div>');}
}

// ── IMAGE GENERATOR (Bilingual: Tamil + English) ──────────────────
const RATIO={'9:16':[1080,1920],'3:4':[900,1200],'1:1':[1080,1080],'16:9':[1920,1080]};

function initIGVerses(){
  const verses=IGVERSES;
  const sel=document.getElementById('igvsel')||document.getElementById('img-vsel');if(!sel)return;
  S.igVerses=verses;
  sel.innerHTML='';
  verses.forEach((v,i)=>{
    const o=document.createElement('option');o.value=i;
    o.textContent=v.tref+' \u2014 '+v.ta.substring(0,30)+'...';
    sel.appendChild(o);
  });
}

function setSz(btn,sz){
  document.querySelectorAll('.szb').forEach(b=>b.classList.remove('on'));
  btn.classList.add('on');S.igSz=sz;drawIG();
}

function setBG(el,bg){
  document.querySelectorAll('.bgsw').forEach(b=>b.classList.remove('on'));
  el.classList.add('on');S.igBg=bg;drawIG();
}

function setTC(btn,tc){
  document.querySelectorAll('.tcb').forEach(b=>b.classList.remove('on'));
  btn.classList.add('on');S.igTc=tc;drawIG();
}

function useCurrentVerse(){
  if(!S.verses.length){toast(S.lang==='ta'?'முதலில் ஒரு அதிகாரம் தேர்வு செய்யுங்கள்':'Select a chapter first');return;}
  const hlk=S.book+S.ch;const hlm=S.hl[hlk]||{};
  const nums=Object.keys(hlm).map(Number);
  const v=nums.length?S.verses.find(vv=>vv.num===nums[0]):S.verses[0];
  if(!v)return;
  const taRef=(S.bookTaName||S.bookName)+' '+S.ch+':'+v.num;
  const enRef=S.bookName+' '+S.ch+':'+v.num;
  const enV=S.enVerses.find(ev=>ev.num===v.num);
  S.customVerse={ta:v.text,tref:taRef,en:enV?.text||'',ref:enRef};
  drawIG();toast(S.lang==='ta'?'தற்போதைய வசனம் பயன்படுத்தப்படுகிறது':'Using current verse');
}

function getIGVerse(){
  if(S.customVerse){const v=S.customVerse;S.customVerse=null;return v;}
  const idx=parseInt(document.getElementById('img-vsel')?.value||'0');
  return (S.igVerses||IGVERSES)[idx]||IGVERSES[0];
}

function drawIG(){
  const cv=document.getElementById('igcv');if(!cv)return;
  const[W,H]=RATIO[S.igSz]||[1080,1920];
  cv.width=W;cv.height=H;
  const ctx=cv.getContext('2d');
  const v=getIGVerse();

  // Determine bg and tc based on mode
  let bg=S.igBg, tc=S.igTc;
  if(_igMode==='template'){
    const tpl=IG_TEMPLATES[_igTemplate]||IG_TEMPLATES.cross;
    bg=tpl.bg; tc=tpl.accent;
  }

  const light=isLightBg(bg);
  const bodyC=light?'rgba(0,0,0,0.85)':'rgba(255,255,255,0.9)';
  const subC=light?'rgba(0,0,0,0.5)':'rgba(255,255,255,0.55)';

  // Background
  if(_igMode==='photo'&&_userPhoto){
    // Draw user photo
    const img=new Image();
    img.onload=()=>{
      // Draw photo cover
      const ir=img.width/img.height;const cr=W/H;
      let sx=0,sy=0,sw=img.width,sh=img.height;
      if(ir>cr){sw=img.height*cr;sx=(img.width-sw)/2;}
      else{sh=img.width/cr;sy=(img.height-sh)/2;}
      ctx.drawImage(img,sx,sy,sw,sh,0,0,W,H);
      // Dark overlay for text readability
      const opacity=getOverlayOpacity();
      ctx.fillStyle='rgba(0,0,0,'+opacity+')';
      ctx.fillRect(0,0,W,H);
      // Draw the rest
      _drawIGContent(ctx,W,H,tc,'rgba(255,255,255,0.92)','rgba(255,255,255,0.6)',v);
    };
    img.src=_userPhoto;
    return; // async
  }else{
    ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  }

  _drawIGContent(ctx,W,H,tc,bodyC,subC,v);
}

function _drawIGContent(ctx,W,H,tc,bodyC,subC,v){
  // Top accent
  ctx.fillStyle=tc;ctx.fillRect(0,0,W,5);

  // Decorative corners
  const co=45;const cl=W*0.1;const lw=Math.max(2,W*0.003);
  ctx.strokeStyle=tc;ctx.globalAlpha=.2;ctx.lineWidth=lw;
  ctx.beginPath();ctx.moveTo(co,co+cl);ctx.lineTo(co,co);ctx.lineTo(co+cl,co);ctx.stroke();
  ctx.beginPath();ctx.moveTo(W-co,H-co-cl);ctx.lineTo(W-co,H-co);ctx.lineTo(W-co-cl,H-co);ctx.stroke();
  ctx.globalAlpha=1;

  // Church label
  ctx.fillStyle=tc;ctx.globalAlpha=.45;
  ctx.font='bold '+Math.round(W*0.022)+'px system-ui';
  ctx.letterSpacing=Math.round(W*0.008)+'px';
  ctx.textAlign='center';
  ctx.fillText('ELIM NEW JERUSALEM CHURCH',W/2,H*0.085);
  ctx.letterSpacing='0px';ctx.globalAlpha=1;

  // Divider
  ctx.fillStyle=tc;ctx.globalAlpha=.2;
  ctx.fillRect(W/2-100,H*0.1,200,1.5);ctx.globalAlpha=1;

  const maxW=W*0.82;

  function wrapC(text,maxW2){
    const words=text.split(' ');const lines=[];let line='';
    for(const w of words){const t=line+w+' ';if(ctx.measureText(t).width>maxW2&&line){lines.push(line.trim());line=w+' ';}else line=t;}
    if(line.trim())lines.push(line.trim());return lines;
  }

  let curY=H*0.14;

  // TAMIL TEXT — primary, larger, Tamil font
  if(v.ta){
    const taFs=Math.round(W*0.052);const taLH=taFs*1.6;
    ctx.font='italic '+taFs+'px "Noto Serif Tamil",serif';
    ctx.fillStyle=bodyC;
    const taLines=wrapC('\u201c'+v.ta+'\u201d',maxW);
    taLines.forEach((l,i)=>ctx.fillText(l,W/2,curY+i*taLH));
    curY+=taLines.length*taLH;

    // Tamil reference
    if(v.tref){
      curY+=taFs*0.6;
      ctx.font='bold '+Math.round(W*0.038)+'px "Noto Serif Tamil",system-ui';
      ctx.fillStyle=tc;
      ctx.fillText('\u2014 '+v.tref,W/2,curY);
      curY+=taFs*0.7;
    }
  }

  // Divider between Tamil and English
  if(v.ta&&v.en){
    curY+=H*0.025;
    ctx.fillStyle=tc;ctx.globalAlpha=.15;
    ctx.fillRect(W*0.3,curY,W*0.4,1);ctx.globalAlpha=1;
    curY+=H*0.03;
  }

  // ENGLISH TEXT — secondary, smaller, italic
  if(v.en){
    const enFs=Math.round(W*0.038);const enLH=enFs*1.55;
    ctx.font='italic '+enFs+'px Georgia,serif';
    ctx.fillStyle=subC;
    const enLines=wrapC('\u201c'+v.en+'\u201d',maxW);
    enLines.forEach((l,i)=>ctx.fillText(l,W/2,curY+i*enLH));
    curY+=enLines.length*enLH;

    if(v.ref){
      curY+=enFs*0.5;
      ctx.font=Math.round(W*0.028)+'px system-ui';
      ctx.fillStyle=tc;ctx.globalAlpha=.7;
      ctx.fillText('\u2014 '+v.ref,W/2,curY);
      ctx.globalAlpha=1;
    }
  }

  // Bottom
  ctx.fillStyle=tc;ctx.globalAlpha=.15;
  ctx.fillRect(0,H-5,W,5);ctx.globalAlpha=1;
  ctx.fillStyle=tc;ctx.globalAlpha=.3;
  ctx.font=Math.round(W*0.018)+'px system-ui';
  ctx.fillText('elimnewjerusalem.github.io/church/bible.html',W/2,H-Math.round(H*0.022));
  ctx.globalAlpha=1;
}

function isLightBg(hex){
  if(!hex||hex.length<7)return false;
  const r=parseInt(hex.slice(1,3),16);const g=parseInt(hex.slice(3,5),16);const b=parseInt(hex.slice(5,7),16);
  return(0.299*r+0.587*g+0.114*b)>140;
}

function dlIG(fmt){
  const cv=document.getElementById('igcv');if(!cv)return;
  const a=document.createElement('a');
  a.download='enjc-verse.'+fmt;
  a.href=cv.toDataURL(fmt==='png'?'image/png':'image/jpeg',0.93);
  a.click();toast('&#8595; '+fmt.toUpperCase()+' '+(S.lang==='ta'?'பதிவிறக்கப்பட்டது!':'Downloaded!'));
}

function shareIG(){
  const cv=document.getElementById('igcv');if(!cv)return;
  cv.toBlob(blob=>{
    if(navigator.share&&navigator.canShare?.({files:[new File([blob],'enjc-verse.jpg',{type:'image/jpeg'})]})){
      navigator.share({title:'ENJC Bible Verse',files:[new File([blob],'enjc-verse.jpg',{type:'image/jpeg'})]});
    }else{dlIG('jpg');toast(S.lang==='ta'?'பதிவிறக்கப்பட்டது — கைமுறையாக பகிருங்கள்':'Downloaded — share manually');}
  },'image/jpeg',0.93);
}

// ── KEYBOARD ─────────────────────────────────────────────────────

// ── VERSE MODAL ──────────────────────────────────────────────────
var _modalVerse = null;

function openVModal(i){
  const v = S.verses[i]; if(!v) return;
  _modalVerse = {i, v,
    ref: S.bookName+' '+S.ch+':'+v.num,
    taRef: (S.bookTaName||S.bookName)+' '+S.ch+':'+v.num,
    enTxt: (S.enVerses.find(e=>e.num===v.num)||{}).text || (S.lang==='en'?v.text:''),
    taTxt: (S.taVerses.find(t=>t.num===v.num)||{}).text || (S.lang==='ta'?v.text:'')
  };
  const mv = _modalVerse;
  document.getElementById('vmodal-ref').textContent = mv.taRef + (mv.ref!==mv.taRef?' · '+mv.ref:'');
  document.getElementById('vmodal-ta').textContent = mv.taTxt ? '“'+mv.taTxt+'”' : '';
  document.getElementById('vmodal-en').textContent = mv.enTxt ? '“'+mv.enTxt+'”' : '';
  document.getElementById('vmodal-en').style.display = mv.enTxt ? 'block' : 'none';
  // Check if bookmarked
  const bms=getBM();
  const isBm=bms.some(b=>b.ref===mv.ref);
  document.getElementById('modal-bm-ic').textContent = isBm ? '♥' : '♡';
  document.getElementById('modal-bm-lb').textContent = isBm ? 'Saved ✓' : 'Save Verse';
  // Load existing note
  const notes=getNotes();
  const noteEl=document.getElementById('note-ta');
  if(noteEl)noteEl.value=notes[mv.ref]||'';
  document.getElementById('vmodal-wrap').classList.add('open');
  document.body.style.overflow='hidden';
}

function closeVModal(){
  document.getElementById('vmodal-wrap').classList.remove('open');
  document.body.style.overflow='';
}

function closeModal(e){
  if(e.target===document.getElementById('vmodal-wrap')) closeVModal();
}

function modalAct(action){
  const mv=_modalVerse; if(!mv) return;
  if(action==='ta-audio'){
    speakNow(mv.taTxt||mv.v.text,'ta');
    toast('▶ Tamil audio...');
  } else if(action==='en-audio'){
    speakNow(mv.enTxt||mv.v.text,'en');
    toast('▶ English audio...');
  } else if(action==='image'){
    S.igVerse={ref:mv.ref,taRef:mv.taRef,text:mv.enTxt,ta:mv.taTxt};
    closeVModal();
    togPanel('img',document.getElementById('qa-img'));
    setTimeout(drawIG,100);
    toast('Image Generator திறந்தது');
  } else if(action==='save'){
    const bms=getBM();
    const fi=bms.findIndex(b=>b.ref===mv.ref);
    if(fi>=0){
      bms.splice(fi,1);saveBM(bms);
      document.getElementById('modal-bm-ic').textContent='♡';
      document.getElementById('modal-bm-lb').textContent='Save Verse';
      toast('Removed');
    } else {
      bms.unshift({ref:mv.ref,text:mv.enTxt||mv.v.text,taRef:mv.taRef,taText:mv.taTxt});
      saveBM(bms);
      document.getElementById('modal-bm-ic').textContent='♥';
      document.getElementById('modal-bm-lb').textContent='Saved ✓';
      toast('♥ சேமிக்கப்பட்டது!');
    }
    initBmBadge();
  } else if(action==='copy'){
    const out=(mv.taRef&&mv.taTxt?mv.taRef+' — '+mv.taTxt+'\n':'')+mv.ref+' — '+(mv.enTxt||mv.v.text);
    navigator.clipboard?.writeText(out);
    toast('Copied!');
  } else if(action==='share'){
    const msg=mv.ref+'\n'+(mv.enTxt||mv.v.text)+'\n\nhttps://elimnewjerusalem.github.io/church/bible.html';
    if(navigator.share)navigator.share({title:'ENJC Bible',text:msg});
    else{navigator.clipboard?.writeText(msg);toast('Copied!');}
  }
}


// ── NOTES ────────────────────────────────────────────────────────
function getNotes(){return JSON.parse(localStorage.getItem('enjc_notes')||'{}');}
function saveNotes(n){localStorage.setItem('enjc_notes',JSON.stringify(n));S.notes=n;}

function openNoteModal(i){
  // Open verse modal then focus note
  openVModal(i);
  setTimeout(()=>{
    const ta=document.getElementById('note-ta');
    if(ta)ta.focus();
  },300);
}

function saveNote(ref,text){
  const notes=getNotes();
  if(text.trim()){notes[ref]=text.trim();}
  else{delete notes[ref];}
  saveNotes(notes);
  // Update note indicator on verse
  renderNoteIndicators();
  toast(text.trim()?'📝 '+(S.lang==='ta'?'குறிப்பு சேமிக்கப்பட்டது':'Note saved'):'Note removed');
}

function renderNoteIndicators(){
  const notes=getNotes();
  document.querySelectorAll('.vi').forEach((el,i)=>{
    const v=S.verses[i];if(!v)return;
    const ref=S.bookName+' '+S.ch+':'+v.num;
    const noteEl=el.querySelector('.vnote-ind');
    if(notes[ref]){
      if(!noteEl){
        const nd=document.createElement('div');
        nd.className='vnote-ind';
        nd.textContent='📝 '+notes[ref].substring(0,40)+(notes[ref].length>40?'...':'');
        el.querySelector('.vb')?.appendChild(nd);
      }else{
        noteEl.textContent='📝 '+notes[ref].substring(0,40)+(notes[ref].length>40?'...':'');
      }
    }else if(noteEl){
      noteEl.remove();
    }
  });
}

// ── READING THEMES ───────────────────────────────────────────────
const THEMES={
  dark:{
    '--bg':'#07090f','--bg2':'#0c1018','--bg3':'#111926',
    '--tx':'#dde4f0','--tx2':'rgba(221,228,240,.55)','--tx3':'rgba(221,228,240,.25)',
    '--bd':'rgba(255,255,255,.06)','--bd2':'rgba(255,255,255,.12)',
    '--card':'#111926'
  },
  sepia:{
    '--bg':'#f8f1e4','--bg2':'#f2e9d8','--bg3':'#ede0c8',
    '--tx':'#2c1a0e','--tx2':'rgba(44,26,14,.6)','--tx3':'rgba(44,26,14,.35)',
    '--bd':'rgba(44,26,14,.1)','--bd2':'rgba(44,26,14,.2)',
    '--card':'#f2e9d8'
  },
  light:{
    '--bg':'#ffffff','--bg2':'#f5f5f5','--bg3':'#eeeeee',
    '--tx':'#111111','--tx2':'rgba(17,17,17,.55)','--tx3':'rgba(17,17,17,.3)',
    '--bd':'rgba(0,0,0,.08)','--bd2':'rgba(0,0,0,.15)',
    '--card':'#f5f5f5'
  }
};

function setTheme(theme){
  S.theme=theme;
  localStorage.setItem('enjc_theme',theme);
  const t=THEMES[theme];
  const root=document.documentElement;
  if(t){Object.entries(t).forEach(([k,v])=>root.style.setProperty(k,v));}
  // Update gold to brown/dark for sepia light
  if(theme==='sepia'){
    root.style.setProperty('--gd','#8b4513');
    root.style.setProperty('--gd2','#a0522d');
    root.style.setProperty('--gdm','rgba(139,69,19,.1)');
    root.style.setProperty('--gdb','rgba(139,69,19,.25)');
  }else if(theme==='light'){
    root.style.setProperty('--gd','#b8860b');
    root.style.setProperty('--gd2','#daa520');
    root.style.setProperty('--gdm','rgba(184,134,11,.1)');
    root.style.setProperty('--gdb','rgba(184,134,11,.25)');
  }else{
    root.style.setProperty('--gd','#e8a020');
    root.style.setProperty('--gd2','#f5bf50');
    root.style.setProperty('--gdm','rgba(232,160,32,.12)');
    root.style.setProperty('--gdb','rgba(232,160,32,.22)');
  }
  document.querySelectorAll('.theme-btn').forEach(b=>b.classList.toggle('on',b.dataset.theme===theme));
  toast(theme==='dark'?'🌙 Dark':theme==='sepia'?'📜 Sepia':'☀ Light');
}

function setFontFamily(fam){
  S.fontFamily=fam;
  localStorage.setItem('enjc_font',fam);
  const fonts={noto:"'Noto Serif Tamil',serif",latha:"'Latha','Arial Unicode MS',serif",bamini:"'Bamini',serif"};
  document.documentElement.style.setProperty('--tamil',fonts[fam]||fonts.noto);
  document.querySelectorAll('.font-btn').forEach(b=>b.classList.toggle('on',b.dataset.font===fam));
}

// Init theme from localStorage
(function(){
  const t=localStorage.getItem('enjc_theme');
  const f=localStorage.getItem('enjc_font');
  if(t)setTheme(t);
  if(f)setFontFamily(f);
})();

// ── IMAGE GEN — PHOTO UPLOAD ─────────────────────────────────────
var _userPhoto = null; // base64 data URL
var _igMode = 'colour'; // colour | photo | template
var _igTemplate = 'cross';

const IG_TEMPLATES = {
  cross:   {bg:'#0b1929', accent:'#e8a020', style:'cross'},
  sunrise: {bg:'#2d1a05', accent:'#f5a020', style:'sunrise'},
  nature:  {bg:'#0d2010', accent:'#4caf50', style:'nature'},
  stars:   {bg:'#05051a', accent:'#9c88ff', style:'stars'}
};

function setIGMode(mode){
  _igMode=mode;
  ['colour','photo','template'].forEach(m=>{
    const el=document.getElementById('igmode-'+m);
    if(el)el.classList.toggle('on',m===mode);
  });
  const colSec=document.getElementById('ig-colour-sec');
  const phSec=document.getElementById('ig-photo-sec');
  const tplSec=document.getElementById('ig-template-sec');
  if(colSec)colSec.style.display=mode==='colour'?'block':'none';
  if(phSec)phSec.style.display=mode==='photo'?'block':'none';
  if(tplSec)tplSec.style.display=mode==='template'?'block':'none';
  drawIG();
}

function triggerPhotoUpload(){
  const inp=document.createElement('input');
  inp.type='file';inp.accept='image/*';
  inp.onchange=e=>{
    const file=e.target.files[0];if(!file)return;
    const reader=new FileReader();
    reader.onload=ev=>{
      _userPhoto=ev.target.result;
      const thumb=document.getElementById('ig-photo-thumb');
      if(thumb){thumb.src=_userPhoto;thumb.style.display='block';}
      const placeholder=document.getElementById('ig-photo-placeholder');
      if(placeholder)placeholder.style.display='none';
      drawIG();
      toast(S.lang==='ta'?'📷 படம் ஏற்றப்பட்டது!':'📷 Photo uploaded!');
    };
    reader.readAsDataURL(file);
  };
  inp.click();
}

function setIGTemplate(name){
  _igTemplate=name;
  document.querySelectorAll('.ig-tpl').forEach(el=>el.classList.toggle('on',el.dataset.tpl===name));
  drawIG();
}

function getOverlayOpacity(){
  const sl=document.getElementById('overlay-slider');
  return sl?parseInt(sl.value)/100:0.55;
}


function autoSaveNote(text){
  const mv=_modalVerse;if(!mv)return;
  const ref=mv.ref;
  const notes=getNotes();
  if(text.trim()){notes[ref]=text.trim();}
  else{delete notes[ref];}
  saveNotes(notes);
  renderNoteIndicators();
}

function setSpacing(val){
  document.documentElement.style.setProperty('--line-height', val);
  document.querySelectorAll('.verse-text,.vtxt').forEach(el=>el.style.lineHeight=val);
  toast('Line spacing: '+val);
}




// ── FCBH SETUP GUIDE ─────────────────────────────────────────────
function checkFCBH(){
  if(FCBH_KEY){
    toast('FCBH audio active! Real human voice.');
    return true;
  }
  toast('FCBH key missing. Register free at 4.dbt.io then paste key in bible.js line 8');
  return false;
}

// ── WEB PUSH NOTIFICATION ─────────────────────────────────────────
const PUSH_VOTD_KEY='enjc_push_enabled';

async function requestPushNotification(){
  if(!('Notification' in window)){
    toast('This browser does not support notifications');
    return;
  }
  if(Notification.permission==='granted'){
    scheduleDailyVerse();
    toast('Notifications already enabled!');
    return;
  }
  if(Notification.permission==='denied'){
    toast('Notifications blocked. Enable in browser settings.');
    return;
  }
  const perm=await Notification.requestPermission();
  if(perm==='granted'){
    localStorage.setItem(PUSH_VOTD_KEY,'1');
    scheduleDailyVerse();
    toast('Notifications enabled! Daily verse every morning.');
    showTestNotification();
  }else{
    toast('Notification permission denied');
  }
}

function showTestNotification(){
  const pool=VOTD;
  const v=pool[new Date().getDay()%pool.length];
  if(Notification.permission==='granted'){
    new Notification('ENJC Bible - Today\'s Verse', {
      body:(v.tref||v.ref)+'\n'+(v.ta||v.en),
      icon:'/church/images/icon.png',
      tag:'enjc-votd'
    });
  }
}

function scheduleDailyVerse(){
  // Check every hour if it's 7am and notification not sent today
  const NOTIF_KEY='enjc_notif_last';
  function check(){
    const now=new Date();
    const today=now.toDateString();
    const last=localStorage.getItem(NOTIF_KEY);
    if(now.getHours()>=7&&last!==today&&Notification.permission==='granted'){
      localStorage.setItem(NOTIF_KEY,today);
      const pool=VOTD;
      const v=pool[now.getDay()%pool.length];
      new Notification('ENJC Bible - ' + (v.tref||v.ref), {
        body:(v.ta||v.en).substring(0,100)+'...',
        icon:'/church/images/icon.png',
        tag:'enjc-votd'
      });
    }
  }
  check();
  setInterval(check,60*60*1000); // check every hour
}

// Auto-schedule if previously enabled
if(localStorage.getItem(PUSH_VOTD_KEY)==='1'&&Notification.permission==='granted'){
  scheduleDailyVerse();
}

// ── BIBLE QUIZ ────────────────────────────────────────────────────
const QUIZ_QUESTIONS=[
  {q:"யோவான் 3:16 இல் தேவன் உலகத்தில் என்ன செய்தார்?",a:1,opts:["ஆக்கினை தீர்த்தார்","அன்பு கூர்ந்தார்","நியாயந்தீர்த்தார்","மறந்தார்"],ref:"யோவான் 3:16"},
  {q:"கர்த்தர் என் ___; எனக்கு குறைவுண்டாவதில்லை. (சங்கீதம் 23:1)",a:0,opts:["மேய்ப்பர்","தந்தை","ராஜா","நண்பர்"],ref:"சங்கீதம் 23:1"},
  {q:"பிலிப்பியர் 4:13 — என்னை ___ பலப்படுத்துகிற கிறிஸ்துவினால் எல்லாவற்றையும் செய்யவல்லேன்.",a:2,opts:["எப்போதும்","மட்டும்","","அன்பாய்"],ref:"பிலிப்பியர் 4:13"},
  {q:"எரேமியா 29:11 — என்னால் நினைக்கப்படுகிற நினைவுகள் எவ்வகையானவை?",a:0,opts:["சமாதானம்","தீமை","நியாயம்","கோபம்"],ref:"எரேமியா 29:11"},
  {q:"யோசுவா 1:9 — திடமனதாயிரு, ___; கர்த்தர் உன்னோடிருக்கிறார்.",a:1,opts:["பெரியவனாயிரு","தைரியமாயிரு","சந்தோஷமாயிரு","நம்பிக்கையாயிரு"],ref:"யோசுவா 1:9"},
  {q:"ஏசாயா 40:31 — கர்த்தருக்கு காத்திருக்கிறவர்கள் என்ன அடைவார்கள்?",a:2,opts:["ஆசீர்வாதம்","சமாதானம்","புதுப்பெலன்","ஜீவன்"],ref:"ஏசாயா 40:31"},
  {q:"மத்தேயு 11:28 — வருத்தப்பட்டு பாரஞ்சுமக்கிறவர்களே என்னிடத்தில் வாருங்கள்; நான் என்ன தருவேன்?",a:3,opts:["வாழ்க்கை","நம்பிக்கை","ஆசீர்வாதம்","இளைப்பாறுதல்"],ref:"மத்தேயு 11:28"},
  {q:"1 கொரிந்தியர் 13:4 — அன்பு நீடிய ___ உள்ளது",a:0,opts:["பொறுமை","கோபம்","சந்தோஷம்","சக்தி"],ref:"1 கொரிந்தியர் 13:4"},
  {q:"ரோமர் 8:28 — தேவனிடத்தில் அன்பு கூருகிறவர்களுக்கு எல்லாமும் எதற்கு ஏதுவாக நடக்கும்?",a:1,opts:["தீமைக்கு","நன்மைக்கு","ஆக்கினைக்கு","சோதனைக்கு"],ref:"ரோமர் 8:28"},
  {q:"சங்கீதம் 46:1 — தேவன் நமக்கு அடைக்கலமும் ___ மாயிருக்கிறார்",a:2,opts:["சந்தோஷமு","அன்பு","பெலனு","நம்பிக்கையு"],ref:"சங்கீதம் 46:1"}
];

var _quizIdx=0, _quizScore=0, _quizActive=false;

function startQuiz(){
  _quizIdx=0;_quizScore=0;_quizActive=true;
  _quizOrder=[...Array(QUIZ_QUESTIONS.length).keys()].sort(()=>Math.random()-.5).slice(0,10);
  renderQuizQ();
}

var _quizOrder=[];

function renderQuizQ(){
  const el=document.getElementById('quiz-body');if(!el)return;
  if(_quizIdx>=_quizOrder.length){
    // Show result
    const pct=Math.round(_quizScore/_quizOrder.length*100);
    const msg=pct>=80?'மிகவும் நல்லது! Excellent!':pct>=60?'நல்லது! Good!':'இன்னும் படியுங்கள்! Keep studying!';
    el.innerHTML=`<div style="text-align:center;padding:24px 16px">
      <div style="font-size:3rem;margin-bottom:12px">${pct>=80?'🏆':pct>=60?'⭐':'📖'}</div>
      <div style="font-size:1.4rem;font-weight:600;color:var(--gd);margin-bottom:6px">${_quizScore}/${_quizOrder.length}</div>
      <div style="font-size:.95rem;color:var(--tx2);margin-bottom:20px">${msg}</div>
      <button onclick="startQuiz()" style="background:var(--gd);color:var(--bg);border:none;border-radius:99px;padding:10px 24px;font-size:13px;font-weight:500;cursor:pointer;font-family:var(--sans)">மீண்டும் விளையாடு</button>
    </div>`;
    return;
  }
  const q=QUIZ_QUESTIONS[_quizOrder[_quizIdx]];
  const num=_quizIdx+1;
  el.innerHTML=`
    <div style="padding:16px 18px;border-bottom:1px solid var(--bd)">
      <div style="font-size:9px;color:var(--tx3);letter-spacing:1px;margin-bottom:8px">கேள்வி ${num}/${_quizOrder.length} · Score: ${_quizScore}</div>
      <div style="font-size:14px;color:var(--tx);line-height:1.7;font-family:var(--tamil)">${q.q}</div>
      <div style="font-size:9px;color:var(--gd);margin-top:5px">${q.ref}</div>
    </div>
    <div style="padding:12px 16px;display:flex;flex-direction:column;gap:7px">
      ${q.opts.map((opt,i)=>`<button onclick="answerQ(${i})" style="background:rgba(255,255,255,.04);border:1px solid var(--bd);border-radius:var(--rl);padding:11px 14px;text-align:left;color:var(--tx);font-size:13px;font-family:var(--tamil);cursor:pointer;transition:all .2s" onmouseover="this.style.borderColor='var(--gdb)'" onmouseout="this.style.borderColor='var(--bd)'">${String.fromCharCode(65+i)}. ${opt}</button>`).join('')}
    </div>`;
}

function answerQ(i){
  const q=QUIZ_QUESTIONS[_quizOrder[_quizIdx]];
  const correct=i===q.a;
  if(correct)_quizScore++;
  const btns=document.getElementById('quiz-body').querySelectorAll('button');
  btns.forEach((b,idx)=>{
    b.disabled=true;
    if(idx===q.a)b.style.background='rgba(76,175,80,.2)',b.style.borderColor='#4caf50',b.style.color='#4caf50';
    else if(idx===i&&!correct)b.style.background='rgba(248,113,113,.15)',b.style.borderColor='#f87171',b.style.color='#f87171';
  });
  toast(correct?'✓ சரியான பதில்!':'✗ '+q.opts[q.a]+' சரியான பதில்');
  setTimeout(()=>{_quizIdx++;renderQuizQ();},1500);
}

// ── CHAPTER READ TRACKER ─────────────────────────────────────────
const TRACKER_KEY='enjc_read';

function getReadChapters(){return JSON.parse(localStorage.getItem(TRACKER_KEY)||'{}');}
function saveReadChapters(d){localStorage.setItem(TRACKER_KEY,JSON.stringify(d));}

function markChapterRead(){
  if(!S.book||!S.ch)return;
  const d=getReadChapters();
  if(!d[S.book])d[S.book]=[];
  if(!d[S.book].includes(S.ch)){
    d[S.book].push(S.ch);
    saveReadChapters(d);
    const total=BOOKS.find(b=>b.id===S.book)?.ch||1;
    const pct=Math.round(d[S.book].length/total*100);
    toast('\u2713 '+S.bookTaName+' \u0b85\u0ba4\u0bbf\u0b95\u0bbe\u0bb0\u0bae\u0bcd '+S.ch+' \u0baa\u0b9f\u0bbf\u0ba4\u0bcd\u0ba4\u0bc1 \u0bae\u0bc1\u0b9f\u0bbf\u0ba4\u0bcd\u0ba4\u0ba4\u0bc1 ('+pct+'%)');
    initTrackerBadge();
  }
}

function getReadStats(){
  const d=getReadChapters();
  let totalRead=0;
  BOOKS.forEach(b=>{if(d[b.id])totalRead+=d[b.id].length;});
  const totalChapters=1189;
  return {read:totalRead,total:totalChapters,pct:Math.round(totalRead/totalChapters*100)};
}

function initTrackerBadge(){
  const stats=getReadStats();
  const el=document.getElementById('tracker-pct');
  if(el)el.textContent=stats.pct+'%';
}

function renderTracker(){
  const d=getReadChapters();
  const el=document.getElementById('tracker-body');if(!el)return;
  const stats=getReadStats();
  el.innerHTML=`
    <div style="text-align:center;padding:14px 0 10px">
      <div style="font-size:2rem;font-weight:600;color:var(--gd)">${stats.pct}%</div>
      <div style="font-size:11px;color:var(--tx3)">${stats.read} / ${stats.total} chapters read</div>
      <div style="background:rgba(255,255,255,.07);border-radius:99px;height:4px;margin:10px 0">
        <div style="height:4px;border-radius:99px;background:var(--gd);width:${stats.pct}%;transition:width .4s"></div>
      </div>
    </div>
    <div style="display:flex;flex-direction:column;gap:5px;max-height:300px;overflow-y:auto">
      ${BOOKS.map(b=>{
        const read=(d[b.id]||[]).length;
        const pct=Math.round(read/b.ch*100);
        const color=pct===100?'var(--gd)':pct>0?'rgba(232,160,32,.5)':'var(--tx3)';
        return `<div style="display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--bd)">
          <div style="font-size:12px;color:${color};min-width:18px">${pct===100?'✓':pct>0?'◑':'○'}</div>
          <div style="flex:1">
            <div style="font-size:12px;color:var(--tx);font-family:var(--tamil)">${b.ta}</div>
            <div style="background:rgba(255,255,255,.06);border-radius:99px;height:2px;margin-top:3px">
              <div style="height:2px;border-radius:99px;background:${color};width:${pct}%"></div>
            </div>
          </div>
          <div style="font-size:10px;color:${color};font-weight:600;min-width:32px;text-align:right">${read}/${b.ch}</div>
        </div>`;
      }).join('')}
    </div>
    <button onclick="markChapterRead()" style="width:100%;margin-top:10px;background:var(--gd);color:var(--bg);border:none;border-radius:99px;padding:10px;font-size:13px;font-weight:500;cursor:pointer;font-family:var(--sans)">\u2713 Mark This Chapter as Read</button>
  `;
  initTrackerBadge();
}


