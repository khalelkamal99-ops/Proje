export interface Question {
  id: number;
  text: string;
  options?: string[];
  correctAnswer: string;
  points: number;
  type: 'fill' | 'choice' | 'form' | 'negative' | 'question' | 'short-answer';
}

export interface Student {
  id: number;
  name: string;
  surname: string;
  className: string;
  branch: string;
  number: string;
  password?: string;
  scores: {
    presentSimple: number;
    presentContinuous: number;
    pastSimple: number;
  };
  totalScore: number;
  date: string;
}

export interface GroupFile {
  id: string;
  name: string;
  url: string;
  type: string;
  uploadedBy: string;
  date: string;
}

export interface GroupMessage {
  id: string;
  senderName: string;
  senderId: string;
  text: string;
  date: string;
}

export interface Group {
  id: string;
  name: string;
  code: string;
  description: string;
  adminId: string;
  members: string[]; // Student IDs
  files: GroupFile[];
  messages: GroupMessage[];
}

export const PRESENT_SIMPLE_QUESTIONS: Question[] = [
  // Boşluk doldurma (10)
  { id: 1, text: "I ___ (go) to school every day.", correctAnswer: "go", type: 'fill', points: 10 },
  { id: 2, text: "She ___ (eat) breakfast.", correctAnswer: "eats", type: 'fill', points: 10 },
  { id: 3, text: "We ___ (play) football.", correctAnswer: "play", type: 'fill', points: 10 },
  { id: 4, text: "He ___ (watch) TV.", correctAnswer: "watches", type: 'fill', points: 10 },
  { id: 5, text: "They ___ (like) pizza.", correctAnswer: "like", type: 'fill', points: 10 },
  { id: 6, text: "I ___ (read) books.", correctAnswer: "read", type: 'fill', points: 10 },
  { id: 7, text: "She ___ (drink) milk.", correctAnswer: "drinks", type: 'fill', points: 10 },
  { id: 8, text: "We ___ (run) fast.", correctAnswer: "run", type: 'fill', points: 10 },
  { id: 9, text: "He ___ (write) homework.", correctAnswer: "writes", type: 'fill', points: 10 },
  { id: 10, text: "They ___ (buy) snacks.", correctAnswer: "buy", type: 'fill', points: 10 },
  // Doğru form (10)
  { id: 11, text: "go → ___ (he)", correctAnswer: "goes", type: 'fill', points: 10 },
  { id: 12, text: "eat → ___ (she)", correctAnswer: "eats", type: 'fill', points: 10 },
  { id: 13, text: "play → ___ (he)", correctAnswer: "plays", type: 'fill', points: 10 },
  { id: 14, text: "watch → ___ (she)", correctAnswer: "watches", type: 'fill', points: 10 },
  { id: 15, text: "like → ___ (he)", correctAnswer: "likes", type: 'fill', points: 10 },
  { id: 16, text: "read → ___ (she)", correctAnswer: "reads", type: 'fill', points: 10 },
  { id: 17, text: "run → ___ (he)", correctAnswer: "runs", type: 'fill', points: 10 },
  { id: 18, text: "write → ___ (she)", correctAnswer: "writes", type: 'fill', points: 10 },
  { id: 19, text: "drink → ___ (he)", correctAnswer: "drinks", type: 'fill', points: 10 },
  { id: 20, text: "buy → ___ (she)", correctAnswer: "buys", type: 'fill', points: 10 },
  // Çoktan seçmeli (5)
  { id: 21, text: "She ___ to school.", options: ["go", "goes", "going"], correctAnswer: "goes", type: 'choice', points: 10 },
  { id: 22, text: "He ___ football.", options: ["play", "plays", "playing"], correctAnswer: "plays", type: 'choice', points: 10 },
  { id: 23, text: "They ___ TV.", options: ["watch", "watches", "watching"], correctAnswer: "watch", type: 'choice', points: 10 },
  { id: 24, text: "I ___ pizza.", options: ["like", "likes", "liking"], correctAnswer: "like", type: 'choice', points: 10 },
  { id: 25, text: "We ___ books.", options: ["read", "reads", "reading"], correctAnswer: "read", type: 'choice', points: 10 },
  // Olumsuz (5)
  { id: 26, text: "I ___ not go.", correctAnswer: "do", type: 'fill', points: 10 },
  { id: 27, text: "She ___ not eat.", correctAnswer: "does", type: 'fill', points: 10 },
  { id: 28, text: "We ___ not play.", correctAnswer: "do", type: 'fill', points: 10 },
  { id: 29, text: "He ___ not watch.", correctAnswer: "does", type: 'fill', points: 10 },
  { id: 30, text: "They ___ not like.", correctAnswer: "do", type: 'fill', points: 10 },
  // Soru yap (5)
  { id: 31, text: "You play → ___ ?", correctAnswer: "Do you play", type: 'fill', points: 10 },
  { id: 32, text: "She eats → ___ ?", correctAnswer: "Does she eat", type: 'fill', points: 10 },
  { id: 33, text: "They watch → ___ ?", correctAnswer: "Do they watch", type: 'fill', points: 10 },
  { id: 34, text: "He likes → ___ ?", correctAnswer: "Does he like", type: 'fill', points: 10 },
  { id: 35, text: "We read → ___ ?", correctAnswer: "Do we read", type: 'fill', points: 10 },
  // Kısa cevap (5)
  { id: 36, text: "Do you play? → Yes, I ___", correctAnswer: "do", type: 'fill', points: 10 },
  { id: 37, text: "Does she eat? → Yes, she ___", correctAnswer: "does", type: 'fill', points: 10 },
  { id: 38, text: "Do they watch? → No, they ___", correctAnswer: "don't", type: 'fill', points: 10 },
  { id: 39, text: "Does he like? → Yes, he ___", correctAnswer: "does", type: 'fill', points: 10 },
  { id: 40, text: "Do you read? → No, I ___", correctAnswer: "don't", type: 'fill', points: 10 },
  // Karışık (10)
  { id: 41, text: "She ___ (go) every day.", correctAnswer: "goes", type: 'fill', points: 10 },
  { id: 42, text: "He ___ (eat) apples.", correctAnswer: "eats", type: 'fill', points: 10 },
  { id: 43, text: "They ___ (play) football.", correctAnswer: "play", type: 'fill', points: 10 },
  { id: 44, text: "We ___ (watch) TV.", correctAnswer: "watch", type: 'fill', points: 10 },
  { id: 45, text: "I ___ (like) milk.", correctAnswer: "like", type: 'fill', points: 10 },
  { id: 46, text: "She ___ (read) books.", correctAnswer: "reads", type: 'fill', points: 10 },
  { id: 47, text: "He ___ (run) fast.", correctAnswer: "runs", type: 'fill', points: 10 },
  { id: 48, text: "They ___ (write) fast.", correctAnswer: "write", type: 'fill', points: 10 },
  { id: 49, text: "We ___ (drink) tea.", correctAnswer: "drink", type: 'fill', points: 10 },
  { id: 50, text: "I ___ (buy) food.", correctAnswer: "buy", type: 'fill', points: 10 },
];

export const PRESENT_CONTINUOUS_QUESTIONS: Question[] = [
  // Boşluk doldurma (10)
  { id: 1, text: "I ___ (play) now.", correctAnswer: "am playing", type: 'fill', points: 10 },
  { id: 2, text: "She ___ (eat).", correctAnswer: "is eating", type: 'fill', points: 10 },
  { id: 3, text: "We ___ (watch) TV.", correctAnswer: "are watching", type: 'fill', points: 10 },
  { id: 4, text: "He ___ (run).", correctAnswer: "is running", type: 'fill', points: 10 },
  { id: 5, text: "They ___ (study).", correctAnswer: "are studying", type: 'fill', points: 10 },
  { id: 6, text: "I ___ (read).", correctAnswer: "am reading", type: 'fill', points: 10 },
  { id: 7, text: "She ___ (drink).", correctAnswer: "is drinking", type: 'fill', points: 10 },
  { id: 8, text: "We ___ (write).", correctAnswer: "are writing", type: 'fill', points: 10 },
  { id: 9, text: "He ___ (jump).", correctAnswer: "is jumping", type: 'fill', points: 10 },
  { id: 10, text: "They ___ (sleep).", correctAnswer: "are sleeping", type: 'fill', points: 10 },
  // Doğru yardımcı fiil (10)
  { id: 11, text: "I ___ playing.", correctAnswer: "am", type: 'fill', points: 10 },
  { id: 12, text: "She ___ eating.", correctAnswer: "is", type: 'fill', points: 10 },
  { id: 13, text: "We ___ watching.", correctAnswer: "are", type: 'fill', points: 10 },
  { id: 14, text: "He ___ running.", correctAnswer: "is", type: 'fill', points: 10 },
  { id: 15, text: "They ___ studying.", correctAnswer: "are", type: 'fill', points: 10 },
  { id: 16, text: "I ___ reading.", correctAnswer: "am", type: 'fill', points: 10 },
  { id: 17, text: "She ___ drinking.", correctAnswer: "is", type: 'fill', points: 10 },
  { id: 18, text: "We ___ writing.", correctAnswer: "are", type: 'fill', points: 10 },
  { id: 19, text: "He ___ jumping.", correctAnswer: "is", type: 'fill', points: 10 },
  { id: 20, text: "They ___ sleeping.", correctAnswer: "are", type: 'fill', points: 10 },
  // Çoktan seçmeli (5)
  { id: 21, text: "I ___ playing.", options: ["am", "is", "are"], correctAnswer: "am", type: 'choice', points: 10 },
  { id: 22, text: "She ___ eating.", options: ["am", "is", "are"], correctAnswer: "is", type: 'choice', points: 10 },
  { id: 23, text: "We ___ watching.", options: ["am", "is", "are"], correctAnswer: "are", type: 'choice', points: 10 },
  { id: 24, text: "He ___ running.", options: ["am", "is", "are"], correctAnswer: "is", type: 'choice', points: 10 },
  { id: 25, text: "They ___ studying.", options: ["am", "is", "are"], correctAnswer: "are", type: 'choice', points: 10 },
  // Olumsuz (5)
  { id: 26, text: "I ___ not playing.", correctAnswer: "am", type: 'fill', points: 10 },
  { id: 27, text: "She ___ not eating.", correctAnswer: "is", type: 'fill', points: 10 },
  { id: 28, text: "We ___ not watching.", correctAnswer: "are", type: 'fill', points: 10 },
  { id: 29, text: "He ___ not running.", correctAnswer: "is", type: 'fill', points: 10 },
  { id: 30, text: "They ___ not studying.", correctAnswer: "are", type: 'fill', points: 10 },
  // Soru yap (5)
  { id: 31, text: "You are playing → ___ ?", correctAnswer: "Are you playing", type: 'fill', points: 10 },
  { id: 32, text: "She is eating → ___ ?", correctAnswer: "Is she eating", type: 'fill', points: 10 },
  { id: 33, text: "They are watching → ___ ?", correctAnswer: "Are they watching", type: 'fill', points: 10 },
  { id: 34, text: "He is running → ___ ?", correctAnswer: "Is he running", type: 'fill', points: 10 },
  { id: 35, text: "We are reading → ___ ?", correctAnswer: "Are we reading", type: 'fill', points: 10 },
  // Kısa cevap (5)
  { id: 36, text: "Are you playing? → Yes, I ___", correctAnswer: "am", type: 'fill', points: 10 },
  { id: 37, text: "Is she eating? → Yes, she ___", correctAnswer: "is", type: 'fill', points: 10 },
  { id: 38, text: "Are they watching? → No, they ___", correctAnswer: "aren't", type: 'fill', points: 10 },
  { id: 39, text: "Is he running? → Yes, he ___", correctAnswer: "is", type: 'fill', points: 10 },
  { id: 40, text: "Are you reading? → No, I ___", correctAnswer: "am not", type: 'fill', points: 10 },
  // Karışık (10)
  { id: 41, text: "I ___ (play) now.", correctAnswer: "am playing", type: 'fill', points: 10 },
  { id: 42, text: "She ___ (eat) now.", correctAnswer: "is eating", type: 'fill', points: 10 },
  { id: 43, text: "We ___ (watch) now.", correctAnswer: "are watching", type: 'fill', points: 10 },
  { id: 44, text: "He ___ (run) now.", correctAnswer: "is running", type: 'fill', points: 10 },
  { id: 45, text: "They ___ (study) now.", correctAnswer: "are studying", type: 'fill', points: 10 },
  { id: 46, text: "I ___ (read) now.", correctAnswer: "am reading", type: 'fill', points: 10 },
  { id: 47, text: "She ___ (drink) now.", correctAnswer: "is drinking", type: 'fill', points: 10 },
  { id: 48, text: "We ___ (write) now.", correctAnswer: "are writing", type: 'fill', points: 10 },
  { id: 49, text: "He ___ (jump) now.", correctAnswer: "is jumping", type: 'fill', points: 10 },
  { id: 50, text: "They ___ (sleep) now.", correctAnswer: "are sleeping", type: 'fill', points: 10 },
];

export const PAST_SIMPLE_QUESTIONS: Question[] = [
  // Boşluk doldurma (10)
  { id: 1, text: "I ___ (go) yesterday.", correctAnswer: "went", type: 'fill', points: 10 },
  { id: 2, text: "She ___ (eat) pizza.", correctAnswer: "ate", type: 'fill', points: 10 },
  { id: 3, text: "We ___ (play) football.", correctAnswer: "played", type: 'fill', points: 10 },
  { id: 4, text: "He ___ (watch) TV.", correctAnswer: "watched", type: 'fill', points: 10 },
  { id: 5, text: "They ___ (visit) us.", correctAnswer: "visited", type: 'fill', points: 10 },
  { id: 6, text: "I ___ (read) a book.", correctAnswer: "read", type: 'fill', points: 10 },
  { id: 7, text: "She ___ (drink) milk.", correctAnswer: "drank", type: 'fill', points: 10 },
  { id: 8, text: "We ___ (write) homework.", correctAnswer: "wrote", type: 'fill', points: 10 },
  { id: 9, text: "He ___ (run) fast.", correctAnswer: "ran", type: 'fill', points: 10 },
  { id: 10, text: "They ___ (buy) food.", correctAnswer: "bought", type: 'fill', points: 10 },
  // Fiilin 2. hali (10)
  { id: 11, text: "go → ___", correctAnswer: "went", type: 'fill', points: 10 },
  { id: 12, text: "eat → ___", correctAnswer: "ate", type: 'fill', points: 10 },
  { id: 13, text: "see → ___", correctAnswer: "saw", type: 'fill', points: 10 },
  { id: 14, text: "come → ___", correctAnswer: "came", type: 'fill', points: 10 },
  { id: 15, text: "take → ___", correctAnswer: "took", type: 'fill', points: 10 },
  { id: 16, text: "make → ___", correctAnswer: "made", type: 'fill', points: 10 },
  { id: 17, text: "give → ___", correctAnswer: "gave", type: 'fill', points: 10 },
  { id: 18, text: "find → ___", correctAnswer: "found", type: 'fill', points: 10 },
  { id: 19, text: "run → ___", correctAnswer: "ran", type: 'fill', points: 10 },
  { id: 20, text: "write → ___", correctAnswer: "wrote", type: 'fill', points: 10 },
  // Çoktan seçmeli (5)
  { id: 21, text: "I ___ to school.", options: ["go", "went", "going"], correctAnswer: "went", type: 'choice', points: 10 },
  { id: 22, text: "She ___ pizza.", options: ["eat", "ate", "eating"], correctAnswer: "ate", type: 'choice', points: 10 },
  { id: 23, text: "We ___ TV.", options: ["watch", "watched", "watching"], correctAnswer: "watched", type: 'choice', points: 10 },
  { id: 24, text: "He ___ football.", options: ["play", "played", "playing"], correctAnswer: "played", type: 'choice', points: 10 },
  { id: 25, text: "They ___ home.", options: ["come", "came", "coming"], correctAnswer: "came", type: 'choice', points: 10 },
  // Olumsuz (5)
  { id: 26, text: "I ___ not go.", correctAnswer: "did", type: 'fill', points: 10 },
  { id: 27, text: "She ___ not eat.", correctAnswer: "did", type: 'fill', points: 10 },
  { id: 28, text: "We ___ not play.", correctAnswer: "did", type: 'fill', points: 10 },
  { id: 29, text: "He ___ not watch.", correctAnswer: "did", type: 'fill', points: 10 },
  { id: 30, text: "They ___ not come.", correctAnswer: "did", type: 'fill', points: 10 },
  // Soru yap (5)
  { id: 31, text: "You went → ___ ?", correctAnswer: "Did you go", type: 'fill', points: 10 },
  { id: 32, text: "She ate → ___ ?", correctAnswer: "Did she eat", type: 'fill', points: 10 },
  { id: 33, text: "They played → ___ ?", correctAnswer: "Did they play", type: 'fill', points: 10 },
  { id: 34, text: "He watched → ___ ?", correctAnswer: "Did he watch", type: 'fill', points: 10 },
  { id: 35, text: "We saw → ___ ?", correctAnswer: "Did we see", type: 'fill', points: 10 },
  // Kısa cevap (5)
  { id: 36, text: "Did you go? → Yes, I ___", correctAnswer: "did", type: 'fill', points: 10 },
  { id: 37, text: "Did she eat? → Yes, she ___", correctAnswer: "did", type: 'fill', points: 10 },
  { id: 38, text: "Did they play? → No, they ___", correctAnswer: "didn't", type: 'fill', points: 10 },
  { id: 39, text: "Did he watch? → Yes, he ___", correctAnswer: "did", type: 'fill', points: 10 },
  { id: 40, text: "Did you see? → No, I ___", correctAnswer: "didn't", type: 'fill', points: 10 },
  // Karışık (10)
  { id: 41, text: "I ___ (go) yesterday.", correctAnswer: "went", type: 'fill', points: 10 },
  { id: 42, text: "She ___ (eat) pizza.", correctAnswer: "ate", type: 'fill', points: 10 },
  { id: 43, text: "We ___ (play) football.", correctAnswer: "played", type: 'fill', points: 10 },
  { id: 44, text: "He ___ (watch) TV.", correctAnswer: "watched", type: 'fill', points: 10 },
  { id: 45, text: "They ___ (visit) us.", correctAnswer: "visited", type: 'fill', points: 10 },
  { id: 46, text: "I ___ (read) book.", correctAnswer: "read", type: 'fill', points: 10 },
  { id: 47, text: "She ___ (drink) milk.", correctAnswer: "drank", type: 'fill', points: 10 },
  { id: 48, text: "We ___ (write) homework.", correctAnswer: "wrote", type: 'fill', points: 10 },
  { id: 49, text: "He ___ (run) fast.", correctAnswer: "ran", type: 'fill', points: 10 },
  { id: 50, text: "They ___ (buy) food.", correctAnswer: "bought", type: 'fill', points: 10 },
];
