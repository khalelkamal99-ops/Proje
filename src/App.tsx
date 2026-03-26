/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  GraduationCap, 
  User, 
  Settings, 
  Info, 
  CheckCircle, 
  XCircle, 
  HelpCircle,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Award,
  Users,
  Moon,
  Sun,
  Book,
  Trophy,
  Gamepad2,
  MessageSquare,
  Send,
  Type,
  Plus,
  FileText,
  Folder,
  Upload,
  Trash2,
  File
} from 'lucide-react';
import { 
  PRESENT_SIMPLE_QUESTIONS, 
  PRESENT_CONTINUOUS_QUESTIONS, 
  PAST_SIMPLE_QUESTIONS,
  Question,
  Student,
  Group,
  GroupMessage,
  GroupFile
} from './types';
import { explainGrammar } from './services/geminiService';
import ReactMarkdown from 'react-markdown';

import { io } from 'socket.io-client';

const socket = io();

type View = 'welcome' | 'student-login' | 'quiz-selection' | 'quiz' | 'admin-login' | 'admin-dashboard' | 'about' | 'grammar-resources' | 'leaderboard' | 'games' | 'social';

const IRREGULAR_VERBS = [
  { v1: "be", v2: "was/were", v3: "been", tr: "olmak" },
  { v1: "become", v2: "became", v3: "become", tr: "olmak (dönüşmek)" },
  { v1: "begin", v2: "began", v3: "begun", tr: "başlamak" },
  { v1: "break", v2: "broke", v3: "broken", tr: "kırmak" },
  { v1: "bring", v2: "brought", v3: "brought", tr: "getirmek" },
  { v1: "build", v2: "built", v3: "built", tr: "inşa etmek" },
  { v1: "buy", v2: "bought", v3: "bought", tr: "satın almak" },
  { v1: "catch", v2: "caught", v3: "caught", tr: "yakalamak" },
  { v1: "choose", v2: "chose", v3: "chosen", tr: "seçmek" },
  { v1: "come", v2: "came", v3: "come", tr: "gelmek" },
  { v1: "cost", v2: "cost", v3: "cost", tr: "maliyetinde olmak" },
  { v1: "cut", v2: "cut", v3: "cut", tr: "kesmek" },
  { v1: "do", v2: "did", v3: "done", tr: "yapmak" },
  { v1: "draw", v2: "drew", v3: "drawn", tr: "çizmek" },
  { v1: "drink", v2: "drank", v3: "drunk", tr: "içmek" },
  { v1: "drive", v2: "drove", v3: "driven", tr: "sürmek" },
  { v1: "eat", v2: "ate", v3: "eaten", tr: "yemek" },
  { v1: "fall", v2: "fell", v3: "fallen", tr: "düşmek" },
  { v1: "feel", v2: "felt", v3: "felt", tr: "hissetmek" },
  { v1: "fight", v2: "fought", v3: "fought", tr: "dövüşmek" },
  { v1: "find", v2: "found", v3: "found", tr: "bulmak" },
  { v1: "fly", v2: "flew", v3: "flown", tr: "uçmak" },
  { v1: "forget", v2: "forgot", v3: "forgotten", tr: "unutmak" },
  { v1: "get", v2: "got", v3: "got/gotten", tr: "almak" },
  { v1: "give", v2: "gave", v3: "given", tr: "vermek" },
  { v1: "go", v2: "went", v3: "gone", tr: "gitmek" },
  { v1: "grow", v2: "grew", v3: "grown", tr: "büyümek" },
  { v1: "have", v2: "had", v3: "had", tr: "sahip olmak" },
  { v1: "hear", v2: "heard", v3: "heard", tr: "duymak" },
  { v1: "hide", v2: "hid", v3: "hidden", tr: "saklamak" },
  { v1: "hit", v2: "hit", v3: "hit", tr: "vurmak" },
  { v1: "hold", v2: "held", v3: "held", tr: "tutmak" },
  { v1: "hurt", v2: "hurt", v3: "hurt", tr: "incitmek" },
  { v1: "keep", v2: "kept", v3: "kept", tr: "tutmak/saklamak" },
  { v1: "know", v2: "knew", v3: "known", tr: "bilmek" },
  { v1: "leave", v2: "left", v3: "left", tr: "ayrılmak" },
  { v1: "lend", v2: "lent", v3: "lent", tr: "ödünç vermek" },
  { v1: "let", v2: "let", v3: "let", tr: "izin vermek" },
  { v1: "lose", v2: "lost", v3: "lost", tr: "kaybetmek" },
  { v1: "make", v2: "made", v3: "made", tr: "yapmak" },
  { v1: "mean", v2: "meant", v3: "meant", tr: "anlamına gelmek" },
  { v1: "meet", v2: "met", v3: "met", tr: "buluşmak" },
  { v1: "pay", v2: "paid", v3: "paid", tr: "ödemek" },
  { v1: "put", v2: "put", v3: "put", tr: "koymak" },
  { v1: "read", v2: "read", v3: "read", tr: "okumak" },
  { v1: "ride", v2: "rode", v3: "ridden", tr: "binmek" },
  { v1: "ring", v2: "rang", v3: "rung", tr: "çalmak (zil)" },
  { v1: "run", v2: "ran", v3: "run", tr: "koşmak" },
  { v1: "say", v2: "said", v3: "said", tr: "söylemek" },
  { v1: "see", v2: "saw", v3: "seen", tr: "görmek" },
  { v1: "sell", v2: "sold", v3: "sold", tr: "satmak" },
  { v1: "send", v2: "sent", v3: "sent", tr: "göndermek" },
  { v1: "show", v2: "showed", v3: "shown", tr: "göstermek" },
  { v1: "shut", v2: "shut", v3: "shut", tr: "kapatmak" },
  { v1: "sing", v2: "sang", v3: "sung", tr: "şarkı söylemek" },
  { v1: "sit", v2: "sat", v3: "sat", tr: "oturmak" },
  { v1: "sleep", v2: "slept", v3: "slept", tr: "uyumak" },
  { v1: "speak", v2: "spoke", v3: "spoken", tr: "konuşmak" },
  { v1: "spend", v2: "spent", v3: "spent", tr: "harcamak" },
  { v1: "stand", v2: "stood", v3: "stood", tr: "ayakta durmak" },
  { v1: "steal", v2: "stole", v3: "stolen", tr: "çalmak" },
  { v1: "swim", v2: "swam", v3: "swum", tr: "yüzmek" },
  { v1: "take", v2: "took", v3: "taken", tr: "almak" },
  { v1: "teach", v2: "taught", v3: "taught", tr: "öğretmek" },
  { v1: "tell", v2: "told", v3: "told", tr: "anlatmak" },
  { v1: "think", v2: "thought", v3: "thought", tr: "düşünmek" },
  { v1: "throw", v2: "threw", v3: "thrown", tr: "atmak" },
  { v1: "understand", v2: "understood", v3: "understood", tr: "anlamak" },
  { v1: "wake", v2: "woke", v3: "woken", tr: "uyanmak" },
  { v1: "wear", v2: "wore", v3: "worn", tr: "giymek" },
  { v1: "win", v2: "won", v3: "won", tr: "kazanmak" },
  { v1: "write", v2: "wrote", v3: "written", tr: "yazmak" },
  { v1: "arise", v2: "arose", v3: "arisen", tr: "ortaya çıkmak" },
  { v1: "awake", v2: "awoke", v3: "awoken", tr: "uyanmak" },
  { v1: "bear", v2: "bore", v3: "born", tr: "katlanmak" },
  { v1: "beat", v2: "beat", v3: "beaten", tr: "yenmek" },
  { v1: "bend", v2: "bent", v3: "bent", tr: "eğmek" },
  { v1: "bet", v2: "bet", v3: "bet", tr: "bahse girmek" },
  { v1: "bid", v2: "bid", v3: "bid", tr: "teklif vermek" },
  { v1: "bind", v2: "bound", v3: "bound", tr: "bağlamak" },
  { v1: "bite", v2: "bit", v3: "bitten", tr: "ısırmak" },
  { v1: "bleed", v2: "bled", v3: "bled", tr: "kanamak" },
  { v1: "blow", v2: "blew", v3: "blown", tr: "üflemek" },
  { v1: "breed", v2: "bred", v3: "bred", tr: "yetiştirmek" },
  { v1: "burn", v2: "burnt/burned", v3: "burnt/burned", tr: "yakmak" },
  { v1: "burst", v2: "burst", v3: "burst", tr: "patlamak" },
  { v1: "cling", v2: "clung", v3: "clung", tr: "yapışmak" },
  { v1: "creep", v2: "crept", v3: "crept", tr: "sürünmek" },
  { v1: "deal", v2: "dealt", v3: "dealt", tr: "anlaşmak" },
  { v1: "dig", v2: "dug", v3: "dug", tr: "kazmak" },
  { v1: "dream", v2: "dreamt/dreamed", v3: "dreamt/dreamed", tr: "rüya görmek" },
  { v1: "dwell", v2: "dwelt", v3: "dwelt", tr: "ikamet etmek" },
  { v1: "feed", v2: "fed", v3: "fed", tr: "beslemek" },
  { v1: "flee", v2: "fled", v3: "fled", tr: "kaçmak" },
  { v1: "fling", v2: "flung", v3: "flung", tr: "fırlatmak" },
  { v1: "forbid", v2: "forbade", v3: "forbidden", tr: "yasaklamak" },
  { v1: "forgive", v2: "forgave", v3: "forgiven", tr: "affetmek" },
  { v1: "freeze", v2: "froze", v3: "frozen", tr: "donmak" },
  { v1: "grind", v2: "ground", v3: "ground", tr: "öğütmek" },
  { v1: "hang", v2: "hung", v3: "hung", tr: "asmak" },
  { v1: "kneel", v2: "knelt", v3: "knelt", tr: "diz çökmek" },
  { v1: "knit", v2: "knit", v3: "knit", tr: "örmek" },
  { v1: "lay", v2: "laid", v3: "laid", tr: "sermek" },
  { v1: "lead", v2: "led", v3: "led", tr: "yol göstermek" },
  { v1: "lean", v2: "leant/leaned", v3: "leant/leaned", tr: "yaslanmak" },
  { v1: "leap", v2: "leapt/leaped", v3: "leapt/leaped", tr: "sıçramak" },
  { v1: "learn", v2: "learnt/learned", v3: "learnt/learned", tr: "öğrenmek" },
  { v1: "light", v2: "lit", v3: "lit", tr: "yakmak (ışık)" },
  { v1: "mow", v2: "mowed", v3: "mown", tr: "biçmek" },
  { v1: "quit", v2: "quit", v3: "quit", tr: "bırakmak" },
  { v1: "rise", v2: "rose", v3: "risen", tr: "yükselmek" },
  { v1: "saw", v2: "sawed", v3: "sawn", tr: "testereyle kesmek" },
  { v1: "seek", v2: "sought", v3: "sought", tr: "aramak" },
  { v1: "sew", v2: "sewed", v3: "sewn", tr: "dikmek" },
  { v1: "shake", v2: "shook", v3: "shaken", tr: "sallamak" },
  { v1: "shear", v2: "sheared", v3: "shorn", tr: "kırkmak" },
  { v1: "shed", v2: "shed", v3: "shed", tr: "dökmek" },
  { v1: "shine", v2: "shone", v3: "shone", tr: "parlamak" },
  { v1: "shoot", v2: "shot", v3: "shot", tr: "ateş etmek" },
  { v1: "shrink", v2: "shrank", v3: "shrunk", tr: "çekmek (küçülmek)" },
  { v1: "sink", v2: "sank", v3: "sunk", tr: "batmak" },
  { v1: "slide", v2: "slid", v3: "slid", tr: "kaymak" },
  { v1: "sling", v2: "slung", v3: "slung", tr: "fırlatmak" },
  { v1: "slink", v2: "slunk", v3: "slunk", tr: "gizlice gitmek" },
  { v1: "slit", v2: "slit", v3: "slit", tr: "yırtmak" },
  { v1: "smell", v2: "smelt/smelled", v3: "smelt/smelled", tr: "koklamak" },
  { v1: "sow", v2: "sowed", v3: "sown", tr: "tohum ekmek" },
  { v1: "speed", v2: "sped", v3: "sped", tr: "hızlanmak" },
  { v1: "spell", v2: "spelt/spelled", v3: "spelt/spelled", tr: "hecelemek" },
  { v1: "spill", v2: "spilt/spilled", v3: "spilt/spilled", tr: "dökmek (sıvı)" },
  { v1: "spin", v2: "spun", v3: "spun", tr: "döndürmek" },
  { v1: "spit", v2: "spat", v3: "spat", tr: "tükürmek" },
  { v1: "split", v2: "split", v3: "split", tr: "yarmak" },
  { v1: "spoil", v2: "spoilt/spoiled", v3: "spoilt/spoiled", tr: "bozmak" },
  { v1: "spread", v2: "spread", v3: "spread", tr: "yaymak" },
  { v1: "spring", v2: "sprang", v3: "sprung", tr: "sıçramak" },
  { v1: "stick", v2: "stuck", v3: "stuck", tr: "yapıştırmak" },
  { v1: "sting", v2: "stung", v3: "stung", tr: "sokmak (arı)" },
  { v1: "stink", v2: "stank", v3: "stunk", tr: "kokmak" },
  { v1: "stride", v2: "strode", v3: "stridden", tr: "uzun adımlarla yürümek" },
  { v1: "strike", v2: "struck", v3: "struck", tr: "vurmak/çarpmak" },
  { v1: "string", v2: "strung", v3: "strung", tr: "dizmek" },
  { v1: "strive", v2: "strove", v3: "striven", tr: "çabalamak" },
  { v1: "swear", v2: "swore", v3: "sworn", tr: "yemin etmek" },
  { v1: "sweep", v2: "swept", v3: "swept", tr: "süpürmek" },
  { v1: "swell", v2: "swelled", v3: "swollen", tr: "şişmek" },
  { v1: "swing", v2: "swung", v3: "swung", tr: "sallanmak" },
  { v1: "tear", v2: "tore", v3: "torn", tr: "yırtmak" },
  { v1: "tread", v2: "trod", v3: "trodden", tr: "basmak" },
  { v1: "weave", v2: "wove", v3: "woven", tr: "dokumak" },
  { v1: "weep", v2: "wept", v3: "wept", tr: "ağlamak" },
  { v1: "wind", v2: "wound", v3: "wound", tr: "sarmak" },
  { v1: "withdraw", v2: "withdrew", v3: "withdrawn", tr: "geri çekilmek" },
  { v1: "wring", v2: "wrung", v3: "wrung", tr: "bükmek/sıkmak" }
];

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <HelpCircle className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Bir Şeyler Yanlış Gitti</h1>
            <p className="text-gray-600">Uygulama yüklenirken bir hata oluştu. Lütfen sayfayı yenilemeyi deneyin.</p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
            >
              Sayfayı Yenile
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

function AppContent() {
  const [view, setView] = useState<View>('welcome');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [currentGame, setCurrentGame] = useState<string | null>(null);
  const [scrambleWord, setScrambleWord] = useState({ original: '', scrambled: '' });
  const [scrambleInput, setScrambleInput] = useState('');
  const [scrambleScore, setScrambleScore] = useState(0);
  const [scrambleFeedback, setScrambleFeedback] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const SCRAMBLE_WORDS = [
    'PRESENT', 'CONTINUOUS', 'GRAMMAR', 'ENGLISH', 'STUDENT', 'SCHOOL', 'TEACHER', 'LEARNING', 'PRACTICE', 'QUESTION',
    'ANSWER', 'SIMPLE', 'VERB', 'NOUN', 'ADJECTIVE', 'ADVERB', 'PRONOUN', 'SENTENCE', 'LANGUAGE', 'VOCABULARY'
  ];

  const initScrambleGame = () => {
    const word = SCRAMBLE_WORDS[Math.floor(Math.random() * SCRAMBLE_WORDS.length)];
    const scrambled = word.split('').sort(() => Math.random() - 0.5).join('');
    setScrambleWord({ original: word, scrambled });
    setScrambleInput('');
    setScrambleFeedback(null);
  };

  const handleScrambleSubmit = () => {
    if (scrambleInput.toUpperCase() === scrambleWord.original) {
      setScrambleScore(prev => prev + 10);
      setScrambleFeedback({ type: 'success', text: 'Tebrikler! Doğru cevap.' });
      setTimeout(initScrambleGame, 1500);
    } else {
      setScrambleFeedback({ type: 'error', text: 'Yanlış cevap, tekrar dene!' });
    }
  };
  const [currentQuiz, setCurrentQuiz] = useState<'presentSimple' | 'presentContinuous' | 'pastSimple' | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);

  // Student Login
  const [studentLoginCreds, setStudentLoginCreds] = useState({ number: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [isStudentLoggedIn, setIsStudentLoggedIn] = useState(false);
  const [studentInfo, setStudentInfo] = useState<Partial<Student>>({});
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeRoom, setActiveRoom] = useState('');

  // Groups State
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [groupJoinCode, setGroupJoinCode] = useState('');
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupCode, setNewGroupCode] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  useEffect(() => {
    const savedGroups = localStorage.getItem('app_groups');
    if (savedGroups) {
      setGroups(JSON.parse(savedGroups));
    }
  }, []);

  useEffect(() => {
    if (groups.length > 0) {
      localStorage.setItem('app_groups', JSON.stringify(groups));
    }
  }, [groups]);

  const handleCreateGroup = () => {
    if (!newGroupName || !newGroupCode) return;
    const newGroup: Group = {
      id: Date.now().toString(),
      name: newGroupName,
      code: newGroupCode,
      description: newGroupDesc,
      adminId: 'admin',
      members: [],
      files: [],
      messages: []
    };
    setGroups(prev => [...prev, newGroup]);
    setNewGroupName('');
    setNewGroupCode('');
    setNewGroupDesc('');
    setShowCreateGroup(false);
  };

  const handleJoinGroup = () => {
    const group = groups.find(g => g.code === groupJoinCode);
    if (group) {
      if (!group.members.includes(studentInfo.number || '')) {
        const updatedGroups = groups.map(g => {
          if (g.id === group.id) {
            return { ...g, members: [...g.members, studentInfo.number || ''] };
          }
          return g;
        });
        setGroups(updatedGroups);
      }
      setSelectedGroup(group);
      setGroupJoinCode('');
    } else {
      alert('Grup bulunamadı!');
    }
  };

  const handleSendGroupMessage = (groupId: string, text: string) => {
    if (!text.trim()) return;
    const newMessage: GroupMessage = {
      id: Date.now().toString(),
      senderName: isAdminLoggedIn ? 'Admin' : studentInfo.name || 'Öğrenci',
      senderId: isAdminLoggedIn ? 'admin' : studentInfo.number || 'student',
      text,
      date: new Date().toISOString()
    };
    setGroups(prev => prev.map(g => {
      if (g.id === groupId) {
        return { ...g, messages: [...g.messages, newMessage] };
      }
      return g;
    }));
    // Update selected group if it's the one we're in
    if (selectedGroup?.id === groupId) {
      setSelectedGroup(prev => prev ? { ...prev, messages: [...prev.messages, newMessage] } : null);
    }
  };

  const handleUploadFile = (groupId: string, fileName: string) => {
    const newFile: GroupFile = {
      id: Date.now().toString(),
      name: fileName,
      url: '#',
      type: fileName.split('.').pop() || 'file',
      uploadedBy: 'Admin',
      date: new Date().toISOString()
    };
    setGroups(prev => prev.map(g => {
      if (g.id === groupId) {
        return { ...g, files: [...g.files, newFile] };
      }
      return g;
    }));
    if (selectedGroup?.id === groupId) {
      setSelectedGroup(prev => prev ? { ...prev, files: [...prev.files, newFile] } : null);
    }
  };

  const handleDeleteFile = (groupId: string, fileId: string) => {
    setGroups(prev => prev.map(g => {
      if (g.id === groupId) {
        return { ...g, files: g.files.filter(f => f.id !== fileId) };
      }
      return g;
    }));
    if (selectedGroup?.id === groupId) {
      setSelectedGroup(prev => prev ? { ...prev, files: prev.files.filter(f => f.id !== fileId) } : null);
    }
  };

  // Admin
  const [adminCreds, setAdminCreds] = useState({ username: '', password: '' });
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [registeredStudents, setRegisteredStudents] = useState<Student[]>([]);
  const [newAdminUser, setNewAdminUser] = useState('');
  const [newAdminPass, setNewAdminPass] = useState('');

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Admin Forms
  const [newStudent, setNewStudent] = useState({ name: '', surname: '', className: '', branch: '', number: '', password: '' });
  const [newQuestion, setNewQuestion] = useState({ category: 'presentSimple', text: '', correctAnswer: '', points: 10, type: 'fill' as any, options: '' });

  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchStudents();
      fetchRegisteredStudents();
    }
    fetchQuestions();
  }, [isAdminLoggedIn]);

  useEffect(() => {
    const savedStudent = localStorage.getItem('student_session');
    if (savedStudent) {
      try {
        const student = JSON.parse(savedStudent);
        setStudentInfo(student);
        setIsStudentLoggedIn(true);
        setView('quiz-selection');
      } catch (err) {
        localStorage.removeItem('student_session');
      }
    }
  }, []);

  useEffect(() => {
    socket.on('receive-message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });
    return () => {
      socket.off('receive-message');
    };
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/students');
      const data = await res.json();
      setAllStudents(data);
    } catch (err) { console.error(err); }
  };

  const fetchRegisteredStudents = async () => {
    try {
      const res = await fetch('/api/admin/students-list');
      const data = await res.json();
      setRegisteredStudents(data);
    } catch (err) { console.error(err); }
  };

  const [dynamicQuestions, setDynamicQuestions] = useState<any>({ presentSimple: [], presentContinuous: [], pastSimple: [] });
  const fetchQuestions = async () => {
    try {
      const res = await fetch('/api/questions');
      const data = await res.json();
      setDynamicQuestions(data);
    } catch (err) { console.error(err); }
  };

  const handleAdminLogin = async () => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminCreds)
      });
      const data = await res.json();
      if (data.success) {
        setIsAdminLoggedIn(true);
        setView('admin-dashboard');
      } else { alert(data.message); }
    } catch (err) { alert('Giriş başarısız'); }
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch('/api/leaderboard');
      const data = await res.json();
      setLeaderboard(data);
    } catch (err) { console.error('Liderlik tablosu alınamadı'); }
  };

  useEffect(() => {
    if (view === 'leaderboard') fetchLeaderboard();
  }, [view]);

  const handleStudentLogin = async () => {
    try {
      const res = await fetch('/api/student/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentLoginCreds)
      });
      const data = await res.json();
      if (data.success) {
        setIsStudentLoggedIn(true);
        setIsGuest(false);
        setStudentInfo(data.student);
        if (rememberMe) {
          localStorage.setItem('student_session', JSON.stringify(data.student));
        }
        setView('quiz-selection');
      } else { alert(data.message); }
    } catch (err) { alert('Giriş başarısız'); }
  };

  const handleGuestLogin = () => {
    setIsStudentLoggedIn(true);
    setIsGuest(true);
    setStudentInfo({ name: 'Misafir', surname: 'Kullanıcı', className: 'G', branch: '1', number: '000' });
    setView('quiz-selection');
  };

  const handleLogout = () => {
    setIsStudentLoggedIn(false);
    setIsAdminLoggedIn(false);
    setIsGuest(false);
    setStudentInfo({});
    setSelectedGroup(null);
    localStorage.removeItem('student_session');
    setView('welcome');
  };

  const handleRegisterStudent = async () => {
    try {
      await fetch('/api/admin/register-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent)
      });
      alert('Öğrenci kaydedildi');
      setNewStudent({ name: '', surname: '', className: '', branch: '', number: '', password: '' });
      fetchRegisteredStudents();
    } catch (err) { alert('Kayıt başarısız'); }
  };

  const handleAddQuestion = async () => {
    try {
      const q = { ...newQuestion, options: newQuestion.options.split(',').map(o => o.trim()).filter(o => o) };
      await fetch('/api/admin/add-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: newQuestion.category, question: q })
      });
      alert('Soru eklendi');
      setNewQuestion({ category: 'presentSimple', text: '', correctAnswer: '', points: 10, type: 'fill', options: '' });
      fetchQuestions();
    } catch (err) { alert('Soru eklenemedi'); }
  };

  const startQuiz = (type: 'presentSimple' | 'presentContinuous' | 'pastSimple') => {
    setCurrentQuiz(type);
    let staticQ: Question[] = [];
    if (type === 'presentSimple') staticQ = PRESENT_SIMPLE_QUESTIONS;
    else if (type === 'presentContinuous') staticQ = PRESENT_CONTINUOUS_QUESTIONS;
    else if (type === 'pastSimple') staticQ = PAST_SIMPLE_QUESTIONS;
    
    const allQ = [...staticQ, ...(dynamicQuestions[type] || [])];
    setQuestions(allQ);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setScore(0);
    setCorrectCount(0);
    setIsQuizFinished(false);
    setView('quiz');
  };

  const finishQuiz = async () => {
    let finalScore = 0;
    let finalCorrect = 0;
    questions.forEach(q => {
      if (userAnswers[q.id]?.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim()) {
        finalScore += q.points;
        finalCorrect++;
      }
    });
    setScore(finalScore);
    setCorrectCount(finalCorrect);
    setIsQuizFinished(true);

    const data = {
      ...studentInfo,
      scores: {
        presentSimple: currentQuiz === 'presentSimple' ? finalScore : 0,
        presentContinuous: currentQuiz === 'presentContinuous' ? finalScore : 0,
        pastSimple: currentQuiz === 'pastSimple' ? finalScore : 0,
      },
      totalScore: finalScore,
      date: new Date().toLocaleString()
    };

    try {
      await fetch('/api/submit-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (err) { console.error(err); }
  };

  const handleAnswer = (answer: string) => {
    setUserAnswers({ ...userAnswers, [questions[currentQuestionIndex].id]: answer });
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setExplanation(null);
    } else {
      finishQuiz();
    }
  };

  const handleChangeProfile = async () => {
    if (!newAdminUser && !newAdminPass) return;
    try {
      const res = await fetch('/api/admin/change-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newUsername: newAdminUser, newPassword: newAdminPass })
      });
      const data = await res.json();
      if (data.success) {
        alert('Profil güncellendi');
        setNewAdminUser('');
        setNewAdminPass('');
      } else { alert(data.message); }
    } catch (err) { alert('Profil güncellenemedi'); }
  };

  const getAIExplanation = async () => {
    const q = questions[currentQuestionIndex];
    const userAns = userAnswers[q.id] || "Boş";
    setIsLoadingExplanation(true);
    const expl = await explainGrammar(q.text, userAns, q.correctAnswer);
    setExplanation(expl || "Açıklama alınamadı.");
    setIsLoadingExplanation(false);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#121212] text-[#e0e0e0]' : 'bg-[#f5f5f5] text-[#1a1a1a]'} font-sans`}>
      {/* Navigation */}
      <nav className={`${isDarkMode ? 'bg-[#1e1e1e] border-gray-800' : 'bg-white border-gray-200'} border-b px-6 py-4 flex justify-between items-center sticky top-0 z-50`}>
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('welcome')}>
          <GraduationCap className={`w-8 h-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <span className="text-xl font-bold tracking-tight">GrammarQuiz</span>
        </div>
        <div className="flex items-center gap-4">
          {(isStudentLoggedIn || isAdminLoggedIn) && (
            <>
              <button onClick={() => setView('games')} className={`p-2 hover:bg-opacity-10 hover:bg-gray-500 rounded-full transition-colors ${view === 'games' ? 'text-purple-500' : ''}`}>
                <Gamepad2 className="w-5 h-5" />
              </button>
              <button onClick={() => {
                setView('social');
              }} className={`p-2 hover:bg-opacity-10 hover:bg-gray-500 rounded-full transition-colors ${view === 'social' ? 'text-green-500' : ''}`}>
                <Users className="w-5 h-5" />
              </button>
            </>
          )}
          <button onClick={() => setView('leaderboard')} className={`p-2 hover:bg-opacity-10 hover:bg-gray-500 rounded-full transition-colors ${view === 'leaderboard' ? 'text-yellow-500' : ''}`}>
            <Trophy className="w-5 h-5" />
          </button>
          <button onClick={() => setView('grammar-resources')} className={`p-2 hover:bg-opacity-10 hover:bg-gray-500 rounded-full transition-colors ${view === 'grammar-resources' ? 'text-blue-500' : ''}`}>
            <Book className="w-5 h-5" />
          </button>
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 hover:bg-opacity-10 hover:bg-gray-500 rounded-full transition-colors">
            {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
          </button>
          <button onClick={() => setView('about')} className="p-2 hover:bg-opacity-10 hover:bg-gray-500 rounded-full transition-colors">
            <Info className="w-5 h-5" />
          </button>
          {isStudentLoggedIn && (
            <button onClick={handleLogout} className="p-2 hover:bg-red-500/10 rounded-full transition-colors text-red-500">
              <LogOut className="w-5 h-5" />
            </button>
          )}
          {!isAdminLoggedIn ? (
            <button onClick={() => setView('admin-login')} className={`p-2 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} rounded-full transition-colors`}>
              <Settings className="w-5 h-5" />
            </button>
          ) : (
            <button onClick={() => setView('admin-dashboard')} className={`p-2 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} rounded-full transition-colors`}>
              <Users className="w-5 h-5" />
            </button>
          )}
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-6 mt-8">
        <AnimatePresence mode="wait">
          {view === 'welcome' && (
            <motion.div 
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-12 py-12"
            >
              <div className="space-y-6">
                <h1 className={`text-5xl font-bold tracking-tighter ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  İngilizce Gramerini <br />
                  <span className="text-blue-600">Eğlenerek Öğren</span>
                </h1>
                <p className={`text-xl ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} max-w-2xl mx-auto`}>
                  Present Simple, Present Continuous ve Past Simple konularında kendini test et. 
                  Yapay zeka desteği ile hatalarını anında öğren.
                </p>
                <div className="flex justify-center gap-4">
                  <button 
                    onClick={() => setView('student-login')}
                    className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
                  >
                    Öğrenci Girişi <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-[#1e1e1e] border-gray-800' : 'bg-white border-gray-100'} shadow-sm`}>
                  <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold mb-2">Geniş Zaman</h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Günlük rutinler ve genel doğrular için kullanılır.</p>
                </div>
                <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-[#1e1e1e] border-gray-800' : 'bg-white border-gray-100'} shadow-sm`}>
                  <div className="bg-green-100 text-green-600 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold mb-2">Şimdiki Zaman</h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Şu an yapılan eylemleri anlatmak için kullanılır.</p>
                </div>
                <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-[#1e1e1e] border-gray-800' : 'bg-white border-gray-100'} shadow-sm`}>
                  <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold mb-2">Geçmiş Zaman</h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Geçmişte tamamlanmış eylemler için kullanılır.</p>
                </div>
              </div>

              <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-blue-900/20 border-blue-900/50' : 'bg-blue-50 border-blue-100'} text-left max-w-2xl mx-auto`}>
                <h4 className="font-bold text-blue-600 mb-2 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" /> Günün Gramer İpucu
                </h4>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  "Always", "Usually", "Often" gibi sıklık zarfları Geniş Zaman (Present Simple) cümlelerinde genellikle özneden sonra gelir. Örn: I <b>always</b> drink coffee.
                </p>
              </div>
            </motion.div>
          )}

          {view === 'student-login' && (
            <motion.div 
              key="student-login"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`${isDarkMode ? 'bg-[#1e1e1e] border-gray-800' : 'bg-white border-gray-100'} p-8 rounded-3xl shadow-sm border max-w-md mx-auto`}
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <User className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} /> Öğrenci Girişi
              </h2>
              <div className="space-y-4">
                <input 
                  type="text" placeholder="Okul Numarası" 
                  className={`w-full p-3 ${isDarkMode ? 'bg-[#2d2d2d] border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} rounded-xl focus:ring-2 focus:ring-blue-500 outline-none`}
                  value={studentLoginCreds.number} onChange={e => setStudentLoginCreds({...studentLoginCreds, number: e.target.value})}
                />
                <input 
                  type="password" placeholder="Şifre" 
                  className={`w-full p-3 ${isDarkMode ? 'bg-[#2d2d2d] border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} rounded-xl focus:ring-2 focus:ring-blue-500 outline-none`}
                  value={studentLoginCreds.password} onChange={e => setStudentLoginCreds({...studentLoginCreds, password: e.target.value})}
                />
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" id="rememberMe" 
                    checked={rememberMe} onChange={e => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="rememberMe" className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Oturumu açık tut</label>
                </div>
                <button 
                  onClick={handleStudentLogin}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  Giriş Yap
                </button>
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center"><span className={`w-full border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}></span></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className={`px-2 ${isDarkMode ? 'bg-[#1e1e1e] text-gray-500' : 'bg-white text-gray-500'}`}>Veya</span></div>
                </div>
                <button 
                  onClick={handleGuestLogin}
                  className={`w-full py-4 rounded-xl font-semibold border-2 ${isDarkMode ? 'border-gray-700 hover:bg-gray-800 text-gray-300' : 'border-gray-100 hover:bg-gray-50 text-gray-600'} transition-colors`}
                >
                  Misafir Girişi
                </button>
              </div>
            </motion.div>
          )}

          {view === 'quiz-selection' && (
            <div className="space-y-8">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid md:grid-cols-3 gap-6"
              >
                {[
                  { id: 'presentSimple', title: 'Present Simple', color: 'bg-green-500', questions: 50 },
                  { id: 'presentContinuous', title: 'Present Continuous', color: 'bg-blue-500', questions: 50 },
                  { id: 'pastSimple', title: 'Past Simple', color: 'bg-red-500', questions: 50 }
                ].map(quiz => (
                  <button 
                    key={quiz.id}
                    onClick={() => startQuiz(quiz.id as any)}
                    className={`${isDarkMode ? 'bg-[#1e1e1e] border-gray-800 text-white hover:bg-[#252525]' : 'bg-white border-gray-100 text-gray-900 hover:shadow-md'} p-8 rounded-3xl shadow-sm border transition-all text-left group`}
                  >
                    <div className={`w-12 h-12 ${quiz.color} rounded-2xl mb-4 flex items-center justify-center text-white`}>
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <h3 className={`text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{quiz.title}</h3>
                    <p className={`${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{quiz.questions} Soru</p>
                  </button>
                ))}
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${isDarkMode ? 'bg-[#1e1e1e] border-gray-800 text-white' : 'bg-white border-gray-100'} p-8 rounded-3xl shadow-sm border`}
              >
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-blue-600" /> Önemli Notlar
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className={`font-bold border-b pb-2 ${isDarkMode ? 'text-gray-100 border-gray-800' : 'text-gray-900 border-gray-100'}`}>Düzensiz Fiiller (Past Simple)</h4>
                    <ul className="grid grid-cols-2 gap-2 text-sm">
                      <li className={`flex justify-between p-2 rounded-lg ${isDarkMode ? 'bg-[#2d2d2d] text-gray-300' : 'bg-gray-50 text-gray-700'}`}><span>go</span> <span className="font-bold text-blue-600">went</span></li>
                      <li className={`flex justify-between p-2 rounded-lg ${isDarkMode ? 'bg-[#2d2d2d] text-gray-300' : 'bg-gray-50 text-gray-700'}`}><span>eat</span> <span className="font-bold text-blue-600">ate</span></li>
                      <li className={`flex justify-between p-2 rounded-lg ${isDarkMode ? 'bg-[#2d2d2d] text-gray-300' : 'bg-gray-50 text-gray-700'}`}><span>see</span> <span className="font-bold text-blue-600">saw</span></li>
                      <li className={`flex justify-between p-2 rounded-lg ${isDarkMode ? 'bg-[#2d2d2d] text-gray-300' : 'bg-gray-50 text-gray-700'}`}><span>come</span> <span className="font-bold text-blue-600">came</span></li>
                      <li className={`flex justify-between p-2 rounded-lg ${isDarkMode ? 'bg-[#2d2d2d] text-gray-300' : 'bg-gray-50 text-gray-700'}`}><span>take</span> <span className="font-bold text-blue-600">took</span></li>
                      <li className={`flex justify-between p-2 rounded-lg ${isDarkMode ? 'bg-[#2d2d2d] text-gray-300' : 'bg-gray-50 text-gray-700'}`}><span>buy</span> <span className="font-bold text-blue-600">bought</span></li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className={`font-bold border-b pb-2 ${isDarkMode ? 'text-gray-100 border-gray-800' : 'text-gray-900 border-gray-100'}`}>Gramer İpuçları</h4>
                    <div className={`space-y-3 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <p>• <strong>Present Simple:</strong> He/She/It öznelerinde fiile <strong>-s</strong> takısı gelir.</p>
                      <p>• <strong>Present Continuous:</strong> am/is/are + fiil + <strong>-ing</strong> yapısı kullanılır.</p>
                      <p>• <strong>Past Simple:</strong> Düzenli fiillerde <strong>-ed</strong>, düzensizlerde ise 2. hal kullanılır.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {view === 'quiz' && !isQuizFinished && (
            <motion.div 
              key="quiz"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`${isDarkMode ? 'bg-[#1e1e1e] border-gray-800 text-white' : 'bg-white border-gray-100'} p-8 rounded-3xl shadow-sm border max-w-2xl mx-auto`}
            >
              <div className="flex justify-between items-center mb-8">
                <span className="text-sm font-bold text-blue-600 uppercase tracking-widest">
                  Soru {currentQuestionIndex + 1} / {questions.length}
                </span>
                <div className={`w-32 h-2 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-full overflow-hidden`}>
                  <div 
                    className="h-full bg-blue-600 transition-all duration-300" 
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              <h2 className={`text-2xl font-semibold mb-8 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{questions[currentQuestionIndex].text}</h2>

              <div className="space-y-4 mb-8">
                {questions[currentQuestionIndex].type === 'choice' ? (
                  <div className="grid grid-cols-1 gap-3">
                    {questions[currentQuestionIndex].options?.map(opt => (
                      <button 
                        key={opt}
                        onClick={() => handleAnswer(opt)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          userAnswers[questions[currentQuestionIndex].id] === opt 
                          ? (isDarkMode ? 'border-blue-500 bg-blue-900/30 text-blue-300' : 'border-blue-600 bg-blue-50 text-blue-700')
                          : (isDarkMode ? 'border-gray-800 hover:border-gray-700' : 'border-gray-100 hover:border-gray-200')
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                ) : (
                  <input 
                    type="text" 
                    placeholder="Cevabınızı yazın..."
                    className={`w-full p-4 ${isDarkMode ? 'bg-[#2d2d2d] border-gray-800' : 'bg-gray-50 border-gray-100'} border-2 rounded-xl focus:border-blue-500 outline-none text-lg`}
                    value={userAnswers[questions[currentQuestionIndex].id] || ''}
                    onChange={e => handleAnswer(e.target.value)}
                  />
                )}
              </div>

              <div className="flex justify-between items-center">
                <button 
                  onClick={getAIExplanation}
                  disabled={isLoadingExplanation}
                  className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-500 hover:text-blue-600'} font-medium disabled:opacity-50`}
                >
                  <HelpCircle className="w-5 h-5" /> {isLoadingExplanation ? 'Açıklanıyor...' : 'Yapay Zeka Açıklaması'}
                </button>
                <button 
                  onClick={nextQuestion}
                  className={`${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-900 hover:bg-black'} text-white px-8 py-3 rounded-xl font-semibold transition-colors`}
                >
                  {currentQuestionIndex === questions.length - 1 ? 'Bitir' : 'Sonraki'}
                </button>
              </div>

              {explanation && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className={`mt-8 p-6 ${isDarkMode ? 'bg-blue-900/20 border-blue-900/50' : 'bg-blue-50 border-blue-100'} rounded-2xl border`}
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-600 text-white p-1 rounded-lg">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div className="prose prose-sm prose-blue max-w-none">
                      <ReactMarkdown>{explanation}</ReactMarkdown>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {view === 'admin-login' && (
            <motion.div 
              key="admin-login"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`${isDarkMode ? 'bg-[#1e1e1e] border-gray-800' : 'bg-white border-gray-100'} p-8 rounded-3xl shadow-sm border max-w-md mx-auto`}
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Settings className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} /> Admin Girişi
              </h2>
              <div className="space-y-4">
                <input 
                  type="text" placeholder="Kullanıcı Adı" 
                  className={`w-full p-3 ${isDarkMode ? 'bg-[#2d2d2d] border-gray-700' : 'bg-gray-50 border-gray-200'} rounded-xl outline-none focus:ring-2 focus:ring-blue-500`}
                  value={adminCreds.username} onChange={e => setAdminCreds({...adminCreds, username: e.target.value})}
                />
                <input 
                  type="password" placeholder="Şifre" 
                  className={`w-full p-3 ${isDarkMode ? 'bg-[#2d2d2d] border-gray-700' : 'bg-gray-50 border-gray-200'} rounded-xl outline-none focus:ring-2 focus:ring-blue-500`}
                  value={adminCreds.password} onChange={e => setAdminCreds({...adminCreds, password: e.target.value})}
                />
                <button 
                  onClick={handleAdminLogin}
                  className={`${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-900 hover:bg-black'} text-white w-full py-4 rounded-xl font-semibold transition-colors`}
                >
                  Giriş Yap
                </button>
              </div>
            </motion.div>
          )}

          {view === 'admin-dashboard' && isAdminLoggedIn && (
            <motion.div 
              key="admin-dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Admin Paneli</h2>
                <button 
                  onClick={() => { setIsAdminLoggedIn(false); setView('welcome'); }}
                  className={`flex items-center gap-2 text-red-600 font-semibold ${isDarkMode ? 'hover:bg-red-900/20' : 'hover:bg-red-50'} px-4 py-2 rounded-xl transition-colors`}
                >
                  <LogOut className="w-5 h-5" /> Çıkış
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Öğrenci Kayıt */}
                <div className={`${isDarkMode ? 'bg-[#1e1e1e] border-gray-800' : 'bg-white border-gray-100'} p-8 rounded-3xl shadow-sm border`}>
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <User className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} /> Öğrenci Kaydet
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="Ad" className={`p-3 ${isDarkMode ? 'bg-[#2d2d2d] border-gray-700' : 'bg-gray-50 border-gray-200'} border rounded-xl outline-none`} value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} />
                      <input type="text" placeholder="Soyad" className={`p-3 ${isDarkMode ? 'bg-[#2d2d2d] border-gray-700' : 'bg-gray-50 border-gray-200'} border rounded-xl outline-none`} value={newStudent.surname} onChange={e => setNewStudent({...newStudent, surname: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <input type="text" placeholder="Sınıf" className={`p-3 ${isDarkMode ? 'bg-[#2d2d2d] border-gray-700' : 'bg-gray-50 border-gray-200'} border rounded-xl outline-none`} value={newStudent.className} onChange={e => setNewStudent({...newStudent, className: e.target.value})} />
                      <input type="text" placeholder="Şube" className={`p-3 ${isDarkMode ? 'bg-[#2d2d2d] border-gray-700' : 'bg-gray-50 border-gray-200'} border rounded-xl outline-none`} value={newStudent.branch} onChange={e => setNewStudent({...newStudent, branch: e.target.value})} />
                      <input type="text" placeholder="No" className={`p-3 ${isDarkMode ? 'bg-[#2d2d2d] border-gray-700' : 'bg-gray-50 border-gray-200'} border rounded-xl outline-none`} value={newStudent.number} onChange={e => setNewStudent({...newStudent, number: e.target.value})} />
                    </div>
                    <input type="text" placeholder="Öğrenci Şifresi" className={`w-full p-3 ${isDarkMode ? 'bg-[#2d2d2d] border-gray-700' : 'bg-gray-50 border-gray-200'} border rounded-xl outline-none`} value={newStudent.password} onChange={e => setNewStudent({...newStudent, password: e.target.value})} />
                    <button onClick={handleRegisterStudent} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700">Kaydet</button>
                  </div>
                </div>

                {/* Soru Ekleme */}
                <div className={`${isDarkMode ? 'bg-[#1e1e1e] border-gray-800' : 'bg-white border-gray-100'} p-8 rounded-3xl shadow-sm border`}>
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <BookOpen className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} /> Soru Ekle
                  </h3>
                  <div className="space-y-4">
                    <select className={`w-full p-3 ${isDarkMode ? 'bg-[#2d2d2d] border-gray-700' : 'bg-gray-50 border-gray-200'} border rounded-xl outline-none`} value={newQuestion.category} onChange={e => setNewQuestion({...newQuestion, category: e.target.value})}>
                      <option value="presentSimple">Present Simple</option>
                      <option value="presentContinuous">Present Continuous</option>
                      <option value="pastSimple">Past Simple</option>
                    </select>
                    <input type="text" placeholder="Soru Metni" className={`w-full p-3 ${isDarkMode ? 'bg-[#2d2d2d] border-gray-700' : 'bg-gray-50 border-gray-200'} border rounded-xl outline-none`} value={newQuestion.text} onChange={e => setNewQuestion({...newQuestion, text: e.target.value})} />
                    <input type="text" placeholder="Doğru Cevap" className={`w-full p-3 ${isDarkMode ? 'bg-[#2d2d2d] border-gray-700' : 'bg-gray-50 border-gray-200'} border rounded-xl outline-none`} value={newQuestion.correctAnswer} onChange={e => setNewQuestion({...newQuestion, correctAnswer: e.target.value})} />
                    <div className="grid grid-cols-2 gap-4">
                      <input type="number" placeholder="Puan" className={`p-3 ${isDarkMode ? 'bg-[#2d2d2d] border-gray-700' : 'bg-gray-50 border-gray-200'} border rounded-xl outline-none`} value={newQuestion.points} onChange={e => setNewQuestion({...newQuestion, points: parseInt(e.target.value)})} />
                      <select className={`p-3 ${isDarkMode ? 'bg-[#2d2d2d] border-gray-700' : 'bg-gray-50 border-gray-200'} border rounded-xl outline-none`} value={newQuestion.type} onChange={e => setNewQuestion({...newQuestion, type: e.target.value as any})}>
                        <option value="fill">Boşluk Doldurma</option>
                        <option value="choice">Çoktan Seçmeli</option>
                      </select>
                    </div>
                    {newQuestion.type === 'choice' && (
                      <input type="text" placeholder="Seçenekler (virgülle ayırın)" className={`w-full p-3 ${isDarkMode ? 'bg-[#2d2d2d] border-gray-700' : 'bg-gray-50 border-gray-200'} border rounded-xl outline-none`} value={newQuestion.options} onChange={e => setNewQuestion({...newQuestion, options: e.target.value})} />
                    )}
                    <button onClick={handleAddQuestion} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700">Soru Ekle</button>
                  </div>
                </div>
              </div>

              <div className={`${isDarkMode ? 'bg-[#1e1e1e] border-gray-800' : 'bg-white border-gray-100'} p-8 rounded-3xl shadow-sm border`}>
                <h3 className="text-xl font-bold mb-6">Kayıtlı Öğrenciler</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {registeredStudents.map(s => (
                    <div key={s.id} className={`p-4 ${isDarkMode ? 'bg-[#2d2d2d] border-gray-700' : 'bg-gray-50 border-gray-100'} rounded-2xl border`}>
                      <div className="font-bold">{s.name} {s.surname}</div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No: {s.number} | Şifre: <span className="font-mono text-blue-600">{s.password}</span></div>
                      <div className="text-xs text-gray-400">{s.className}-{s.branch}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`${isDarkMode ? 'bg-[#1e1e1e] border-gray-800' : 'bg-white border-gray-100'} p-8 rounded-3xl shadow-sm border`}>
                <h3 className="text-xl font-bold mb-6">Admin Profilini Güncelle</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <input 
                    type="text" placeholder="Yeni Kullanıcı Adı" 
                    className={`p-3 rounded-xl outline-none focus:ring-2 ${isDarkMode ? 'bg-[#2d2d2d] border-gray-700 focus:ring-blue-500' : 'bg-gray-50 border-gray-200 focus:ring-gray-900'} border`}
                    value={newAdminUser} onChange={e => setNewAdminUser(e.target.value)}
                  />
                  <input 
                    type="password" placeholder="Yeni Şifre" 
                    className={`p-3 rounded-xl outline-none focus:ring-2 ${isDarkMode ? 'bg-[#2d2d2d] border-gray-700 focus:ring-blue-500' : 'bg-gray-50 border-gray-200 focus:ring-gray-900'} border`}
                    value={newAdminPass} onChange={e => setNewAdminPass(e.target.value)}
                  />
                  <button 
                    onClick={handleChangeProfile}
                    className={`${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-900 hover:bg-black'} text-white px-6 py-3 rounded-xl font-semibold transition-colors`}
                  >
                    Güncelle
                  </button>
                </div>
              </div>

              <div className={`${isDarkMode ? 'bg-[#1e1e1e] border-gray-800' : 'bg-white border-gray-100'} rounded-3xl shadow-sm border overflow-hidden`}>
                <div className={`p-6 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-100'} flex justify-between items-center`}>
                  <h3 className="text-xl font-bold">Öğrenci Sonuçları</h3>
                  <button onClick={fetchStudents} className="text-blue-600 font-semibold text-sm">Yenile</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className={`${isDarkMode ? 'bg-[#2d2d2d] text-gray-400' : 'bg-gray-50 text-gray-500'} text-sm uppercase tracking-wider`}>
                      <tr>
                        <th className="px-6 py-4 font-semibold">Öğrenci</th>
                        <th className="px-6 py-4 font-semibold">Sınıf/No</th>
                        <th className="px-6 py-4 font-semibold">Puan</th>
                        <th className="px-6 py-4 font-semibold">Tarih</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDarkMode ? 'divide-gray-800' : 'divide-gray-100'}`}>
                      {allStudents.map(s => (
                        <tr key={s.id} className={`transition-colors ${isDarkMode ? 'hover:bg-[#2d2d2d]' : 'hover:bg-gray-50'}`}>
                          <td className="px-6 py-4">
                            <div className="font-bold">{s.name} {s.surname}</div>
                          </td>
                          <td className={`px-6 py-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {s.className}-{s.branch} / {s.number}
                          </td>
                          <td className="px-6 py-4">
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold text-sm">
                              {s.totalScore}
                            </span>
                          </td>
                          <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            {s.date}
                          </td>
                        </tr>
                      ))}
                      {allStudents.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">
                            Henüz sonuç bulunmuyor.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'games' && (
            <motion.div 
              key="games"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className={`p-8 rounded-3xl shadow-sm border ${isDarkMode ? 'bg-[#1e1e1e] border-gray-800' : 'bg-white border-gray-100'}`}>
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                  <Gamepad2 className="w-8 h-8 text-purple-500" /> Eğitici Oyunlar
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#2d2d2d] border-gray-700' : 'bg-purple-50 border-purple-100'}`}>
                    <h3 className="text-xl font-bold mb-2">Kelime Karıştırma</h3>
                    <p className="text-sm text-gray-500 mb-4">Harfleri karışık verilen kelimeleri doğru sıraya diz.</p>
                    <button className="bg-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-purple-700 transition-colors">Oyna</button>
                  </div>
                  <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#2d2d2d] border-gray-700' : 'bg-blue-50 border-blue-100'}`}>
                    <h3 className="text-xl font-bold mb-2">Gramer Bulmacası</h3>
                    <p className="text-sm text-gray-500 mb-4">Cümlelerdeki gramer hatalarını bul ve düzelt.</p>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-colors">Oyna</button>
                  </div>
                </div>
              </div>
              <button onClick={() => setView('welcome')} className="text-blue-500 font-bold hover:underline flex items-center gap-2">
                <ChevronLeft className="w-5 h-5" /> Ana Sayfaya Dön
              </button>
            </motion.div>
          )}

          {view === 'social' && (
            <motion.div 
              key="social"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              {!selectedGroup ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Join/Create Sidebar */}
                  <div className="space-y-6">
                    <div className={`p-6 rounded-3xl shadow-sm border ${isDarkMode ? 'bg-[#1e1e1e] border-gray-800' : 'bg-white border-gray-100'}`}>
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Plus className="w-5 h-5 text-blue-500" /> Gruba Katıl
                      </h3>
                      <div className="space-y-3">
                        <input 
                          type="text" 
                          placeholder="Grup Kodu (Sınıf No)" 
                          className={`w-full p-3 rounded-xl border ${isDarkMode ? 'bg-[#2d2d2d] border-gray-700' : 'bg-gray-50 border-gray-200'} outline-none focus:ring-2 focus:ring-blue-500`}
                          value={groupJoinCode}
                          onChange={e => setGroupJoinCode(e.target.value)}
                        />
                        <button 
                          onClick={handleJoinGroup}
                          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
                        >
                          Katıl
                        </button>
                      </div>
                    </div>

                    {isAdminLoggedIn && (
                      <div className={`p-6 rounded-3xl shadow-sm border ${isDarkMode ? 'bg-[#1e1e1e] border-gray-800' : 'bg-white border-gray-100'}`}>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                          <Plus className="w-5 h-5 text-green-500" /> Yeni Grup Kur
                        </h3>
                        <div className="space-y-3">
                          <input 
                            type="text" 
                            placeholder="Grup Adı" 
                            className={`w-full p-3 rounded-xl border ${isDarkMode ? 'bg-[#2d2d2d] border-gray-700' : 'bg-gray-50 border-gray-200'} outline-none focus:ring-2 focus:ring-green-500`}
                            value={newGroupName}
                            onChange={e => setNewGroupName(e.target.value)}
                          />
                          <input 
                            type="text" 
                            placeholder="Grup Kodu" 
                            className={`w-full p-3 rounded-xl border ${isDarkMode ? 'bg-[#2d2d2d] border-gray-700' : 'bg-gray-50 border-gray-200'} outline-none focus:ring-2 focus:ring-green-500`}
                            value={newGroupCode}
                            onChange={e => setNewGroupCode(e.target.value)}
                          />
                          <button 
                            onClick={handleCreateGroup}
                            className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors"
                          >
                            Oluştur
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Groups List */}
                  <div className="md:col-span-2 space-y-4">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <Users className="w-6 h-6 text-blue-500" /> Gruplarım
                    </h2>
                    {groups.filter(g => isAdminLoggedIn || g.members.includes(studentInfo.number || '')).length === 0 ? (
                      <div className={`p-12 rounded-3xl border border-dashed text-center ${isDarkMode ? 'border-gray-800 text-gray-500' : 'border-gray-200 text-gray-400'}`}>
                        <Folder className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>Henüz bir gruba dahil değilsiniz.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4">
                        {groups.filter(g => isAdminLoggedIn || g.members.includes(studentInfo.number || '')).map(group => (
                          <div 
                            key={group.id}
                            onClick={() => setSelectedGroup(group)}
                            className={`p-6 rounded-3xl border cursor-pointer transition-all hover:shadow-md ${isDarkMode ? 'bg-[#1e1e1e] border-gray-800 hover:border-blue-500' : 'bg-white border-gray-100 hover:border-blue-300'}`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-xl font-bold">{group.name}</h3>
                                <p className="text-sm text-gray-500">Kod: {group.code}</p>
                              </div>
                              <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">
                                {group.members.length} Üye
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className={`flex flex-col h-[700px] rounded-3xl shadow-sm border ${isDarkMode ? 'bg-[#1e1e1e] border-gray-800' : 'bg-white border-gray-100'} overflow-hidden`}>
                  {/* Group Header */}
                  <div className={`p-4 border-b flex items-center justify-between ${isDarkMode ? 'border-gray-800 bg-[#252525]' : 'border-gray-100 bg-gray-50'}`}>
                    <div className="flex items-center gap-4">
                      <button onClick={() => setSelectedGroup(null)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <div>
                        <h3 className="font-bold text-lg">{selectedGroup.name}</h3>
                        <p className="text-xs text-gray-500">Kod: {selectedGroup.code}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <Info className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Group Content */}
                  <div className="flex-1 flex overflow-hidden">
                    {/* Chat Area */}
                    <div className="flex-1 flex flex-col border-r border-gray-100 dark:border-gray-800">
                      <div className="flex-1 p-6 overflow-y-auto space-y-4">
                        {selectedGroup.messages.length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <MessageSquare className="w-12 h-12 mb-2 opacity-20" />
                            <p>Henüz mesaj yok. İlk mesajı sen yaz!</p>
                          </div>
                        ) : (
                          selectedGroup.messages.map((msg, idx) => (
                            <div key={idx} className={`flex flex-col ${(isAdminLoggedIn ? msg.senderId === 'admin' : msg.senderId === studentInfo.number) ? 'items-end' : 'items-start'}`}>
                              <div className={`max-w-[85%] p-3 rounded-2xl ${
                                (isAdminLoggedIn ? msg.senderId === 'admin' : msg.senderId === studentInfo.number)
                                ? 'bg-blue-600 text-white rounded-tr-none' 
                                : (isDarkMode ? 'bg-[#2d2d2d] text-gray-200 rounded-tl-none' : 'bg-gray-100 text-gray-800 rounded-tl-none')
                              }`}>
                                <div className="text-[10px] font-bold mb-1 opacity-70 flex justify-between gap-4">
                                  <span>{msg.senderName}</span>
                                  <span>{new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <div className="text-sm">{msg.text}</div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      <div className={`p-4 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-100'} flex gap-2`}>
                        <input 
                          type="text" 
                          placeholder="Mesajınızı yazın..." 
                          className={`flex-1 p-3 ${isDarkMode ? 'bg-[#2d2d2d] border-gray-700' : 'bg-gray-50 border-gray-200'} border rounded-xl outline-none focus:ring-2 focus:ring-blue-500`}
                          value={newMessage}
                          onChange={e => setNewMessage(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              handleSendGroupMessage(selectedGroup.id, newMessage);
                              setNewMessage('');
                            }
                          }}
                        />
                        <button 
                          onClick={() => {
                            handleSendGroupMessage(selectedGroup.id, newMessage);
                            setNewMessage('');
                          }}
                          className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-colors"
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Files Sidebar */}
                    <div className={`w-72 hidden lg:flex flex-col ${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-gray-50'}`}>
                      <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                        <h4 className="font-bold flex items-center gap-2">
                          <FileText className="w-4 h-4" /> Dosyalar
                        </h4>
                        {isAdminLoggedIn && (
                          <button 
                            onClick={() => {
                              const name = prompt('Dosya adı girin:');
                              if (name) handleUploadFile(selectedGroup.id, name);
                            }}
                            className="p-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {selectedGroup.files.length === 0 ? (
                          <p className="text-xs text-center text-gray-500 mt-10">Henüz dosya yüklenmemiş.</p>
                        ) : (
                          selectedGroup.files.map(file => (
                            <div key={file.id} className={`p-3 rounded-xl border flex items-center justify-between group ${isDarkMode ? 'bg-[#252525] border-gray-800' : 'bg-white border-gray-100'}`}>
                              <div className="flex items-center gap-2 overflow-hidden">
                                <File className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                <span className="text-xs truncate font-medium">{file.name}</span>
                              </div>
                              {isAdminLoggedIn && (
                                <button 
                                  onClick={() => handleDeleteFile(selectedGroup.id, file.id)}
                                  className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {view === 'leaderboard' && (
            <motion.div 
              key="leaderboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto space-y-8"
            >
              <div className={`p-8 rounded-3xl shadow-sm border ${isDarkMode ? 'bg-[#1e1e1e] border-gray-800' : 'bg-white border-gray-100'}`}>
                <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
                  <Trophy className="w-8 h-8 text-yellow-500" /> Liderlik Tablosu
                </h2>
                <div className="space-y-4">
                  {leaderboard.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">Henüz skor kaydı bulunmuyor.</p>
                  ) : (
                    leaderboard.map((entry, idx) => (
                      <div key={idx} className={`flex items-center justify-between p-4 rounded-2xl ${isDarkMode ? 'bg-[#2d2d2d]' : 'bg-gray-50'} border ${idx === 0 ? 'border-yellow-400' : 'border-transparent'}`}>
                        <div className="flex items-center gap-4">
                          <span className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${idx === 0 ? 'bg-yellow-400 text-black' : idx === 1 ? 'bg-gray-300 text-black' : idx === 2 ? 'bg-orange-300 text-black' : 'bg-gray-200 text-gray-600'}`}>
                            {idx + 1}
                          </span>
                          <span className="font-semibold">{entry.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-xl text-blue-500">{entry.score} Puan</div>
                          <div className="text-xs text-gray-500">{entry.correct} Doğru</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <button 
                onClick={() => setView('welcome')}
                className="text-blue-500 font-bold hover:underline flex items-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" /> Ana Sayfaya Dön
              </button>
            </motion.div>
          )}

          {view === 'games' && (
            <motion.div 
              key="games"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className={`p-8 rounded-3xl shadow-sm border ${isDarkMode ? 'bg-[#1e1e1e] border-gray-800 text-white' : 'bg-white border-gray-100 text-gray-900'}`}>
                <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
                  <Gamepad2 className="w-8 h-8 text-purple-500" /> Oyunlar
                </h2>
                
                {!currentGame ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div 
                      onClick={() => {
                        setCurrentGame('scramble');
                        initScrambleGame();
                      }}
                      className={`p-6 rounded-3xl border cursor-pointer transition-all hover:scale-105 ${isDarkMode ? 'bg-[#2d2d2d] border-gray-700 hover:border-purple-500' : 'bg-gray-50 border-gray-100 hover:border-purple-500'}`}
                    >
                      <div className="w-16 h-16 bg-purple-500 text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-purple-500/20">
                        <Type className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Kelime Karıştırma</h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Harfleri karışık verilen kelimeleri doğru sıraya diz!</p>
                    </div>

                    <div 
                      className={`p-6 rounded-3xl border opacity-50 cursor-not-allowed ${isDarkMode ? 'bg-[#2d2d2d] border-gray-700' : 'bg-gray-50 border-gray-100'}`}
                    >
                      <div className="w-16 h-16 bg-gray-400 text-white rounded-2xl flex items-center justify-center mb-4">
                        <Gamepad2 className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Yakında...</h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Yeni oyunlar yolda!</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 max-w-md mx-auto text-center">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-2xl font-bold">Kelime Karıştırma</h3>
                      <div className="bg-purple-100 text-purple-700 px-4 py-1 rounded-full font-bold">
                        Skor: {scrambleScore}
                      </div>
                    </div>

                    <div className={`p-12 rounded-3xl border-2 border-dashed mb-8 ${isDarkMode ? 'bg-[#2d2d2d] border-gray-700' : 'bg-purple-50 border-purple-200'}`}>
                      <div className="text-4xl font-black tracking-widest text-purple-600 mb-2">
                        {scrambleWord.scrambled}
                      </div>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Bu kelimeyi düzeltin!</p>
                    </div>

                    <div className="space-y-4">
                      <input 
                        type="text"
                        placeholder="Cevabınızı yazın..."
                        className={`w-full p-4 rounded-xl border-2 outline-none transition-all text-center text-xl font-bold ${
                          isDarkMode 
                          ? 'bg-[#2d2d2d] border-gray-700 focus:border-purple-500 text-white' 
                          : 'bg-white border-gray-200 focus:border-purple-500 text-gray-900'
                        }`}
                        value={scrambleInput}
                        onChange={e => setScrambleInput(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleScrambleSubmit();
                        }}
                      />
                      
                      {scrambleFeedback && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-3 rounded-xl font-bold ${
                            scrambleFeedback.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {scrambleFeedback.text}
                        </motion.div>
                      )}

                      <div className="flex gap-3">
                        <button 
                          onClick={() => setCurrentGame(null)}
                          className={`flex-1 py-4 rounded-xl font-bold transition-all ${
                            isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                          }`}
                        >
                          Vazgeç
                        </button>
                        <button 
                          onClick={handleScrambleSubmit}
                          className="flex-[2] py-4 rounded-xl font-bold bg-purple-600 hover:bg-purple-700 text-white transition-all shadow-lg shadow-purple-500/30"
                        >
                          Kontrol Et
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <button onClick={() => setView('welcome')} className="text-blue-500 font-bold hover:underline flex items-center gap-2">
                <ChevronLeft className="w-5 h-5" /> Ana Sayfaya Dön
              </button>
            </motion.div>
          )}

          {view === 'grammar-resources' && (
            <motion.div 
              key="grammar-resources"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className={`p-8 rounded-3xl shadow-sm border ${isDarkMode ? 'bg-[#1e1e1e] border-gray-800' : 'bg-white border-gray-100'}`}>
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                  <Book className="w-8 h-8 text-blue-500" /> Gramer Kaynakları
                </h2>
                
                <div className="space-y-12">
                  <section className="space-y-4">
                    <h3 className="text-xl font-bold border-b pb-2 text-blue-500">Düzensiz Fiiller Listesi (Irregular Verbs)</h3>
                    <div className={`overflow-x-auto rounded-2xl border ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className={`${isDarkMode ? 'bg-[#2d2d2d] text-gray-300' : 'bg-gray-50 text-gray-600'} text-sm font-bold`}>
                            <th className="p-4 border-b border-gray-800">V1 (Base)</th>
                            <th className="p-4 border-b border-gray-800">V2 (Past)</th>
                            <th className="p-4 border-b border-gray-800">V3 (Participle)</th>
                            <th className="p-4 border-b border-gray-800">Türkçe Anlamı</th>
                          </tr>
                        </thead>
                        <tbody>
                          {IRREGULAR_VERBS.map((verb, idx) => (
                            <tr key={idx} className={`${isDarkMode ? 'hover:bg-[#252525] text-gray-400' : 'hover:bg-gray-50 text-gray-600'} border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-50'} transition-colors`}>
                              <td className="p-4 font-mono">{verb.v1}</td>
                              <td className="p-4 font-mono text-blue-500">{verb.v2}</td>
                              <td className="p-4 font-mono text-purple-500">{verb.v3}</td>
                              <td className="p-4 italic">{verb.tr}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </div>
              </div>
              <button onClick={() => setView('welcome')} className="text-blue-500 font-bold hover:underline flex items-center gap-2">
                <ChevronLeft className="w-5 h-5" /> Ana Sayfaya Dön
              </button>
            </motion.div>
          )}
          {view === 'about' && (
            <motion.div 
              key="about"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${isDarkMode ? 'bg-[#1e1e1e] border-gray-800' : 'bg-white border-gray-100'} p-12 rounded-3xl shadow-sm border text-center space-y-6`}
            >
              <div className="w-20 h-20 bg-blue-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-4 rotate-3 shadow-lg shadow-blue-500/30">
                <GraduationCap className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold">Proje Hakkında</h2>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-lg leading-relaxed max-w-2xl mx-auto`}>
                Bu uygulama, öğrencilerin İngilizce gramer konularını (Present Simple, Present Continuous, Past Simple) 
                interaktif bir şekilde pekiştirmeleri için tasarlanmıştır. Yapay zeka entegrasyonu sayesinde 
                öğrenciler her sorunun çözümünü detaylıca öğrenebilirler.
              </p>
              <div className={`pt-8 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                <p className="text-sm uppercase tracking-widest text-gray-400 font-bold mb-2">Geliştirici</p>
                <p className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Halil Kamal</p>
              </div>
              <button 
                onClick={() => setView('welcome')}
                className="text-blue-600 font-bold hover:underline"
              >
                Geri Dön
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className={`max-w-4xl mx-auto p-6 mt-12 text-center ${isDarkMode ? 'text-gray-600' : 'text-gray-400'} text-sm`}>
        &copy; 2026 GrammarQuiz - Halil Kamal tarafından geliştirilmiştir.
      </footer>
    </div>
  );
}
