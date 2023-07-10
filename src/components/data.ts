// --------------- data for Course.tsx---------- //

interface Lesson {
  id: number;
  order: number;
  isPaid: boolean;
  title: string;
  duration: number;
  files:
    | {
        title: string;
        link: string;
      }[]
    | [];
}

interface SingleLessonFiles {
  isPaid: boolean;
  files: {
    title: string;
    link: string;
  }[];
}

const contentLessons: Lesson[] = [
  {
    id: 1,
    order: 1,
    isPaid: false,
    title: "Создание финансовой модели. Открытие фирмы. Налоги и бухучет.",
    duration: 2715,
    files: [
      {
        title: "Скрипт эффективных продаж1",
        link: "http://testoviy.url1",
      },
    ],
  },
  {
    id: 2,
    order: 2,
    isPaid: true,
    title: "Бренд, айдентика и реклама",
    duration: 2715,
    files: [
      {
        title: "Скрипт эффективных продаж2",
        link: "http://testoviy.url2",
      },
    ],
  },
  {
    id: 3,
    order: 3,
    isPaid: true,
    title: "Выбор помещения и закупка оборудования",
    duration: 2715,
    files: [],
  },
  {
    id: 4,
    order: 4,
    isPaid: true,
    title: "Найм персонала",
    duration: 2715,
    files: [],
  },
  {
    id: 5,
    order: 5,
    isPaid: true,
    title: "Открытие клуба, первые продажи. Привлечение клиентов.",
    duration: 2715,
    files: [],
  },
  {
    id: 6,
    order: 6,
    isPaid: true,
    title: "Выход на регулярную прибыль и масштабирование",
    duration: 27150,
    files: [],
  },
];

export const courseContent = {
  isPaid: false,
  title: "Как открыть фитнес-клуб с нуля",
  description:
    "Открытие фитнес-клуба — выгодный шанс занять перспективную нишу. Конечно, такой вид бизнеса сопряжен с определенными рисками и потребует серьезных инвестиций. Но и размер прибыли будет немаленьким. В этом курсе мы расскажем, как открыть фитнес-клуб с нуля и какие нюансы при этом стоит учесть.",
  lessons: contentLessons,
};

// ------------end data for Course.tsx---------- //

// -------------- data for Courses.tsx---------- //

type ActivityTypes = "fitness" | "restaurants" | "tourism";

interface VideoLesson {
  title: string;
  type: "video";
  lessons?: undefined;
  duration: number;
  activity: ActivityTypes;
}

interface Course {
  title: string;
  type: "course";
  lessons: number;
  duration?: undefined;
  activity: ActivityTypes;
}

interface Category {
  category: string;
  courses: Array<VideoLesson | Course>;
}

export const coursesData: Category[] = [
  {
    category: "Бесплатные материалы",
    courses: [
      { title: "С чего начать обучение", type: "video", duration: 27150, activity: "fitness" },
      { title: "С чего начать обучение", type: "video", duration: 2715, activity: "restaurants" },
      { title: "С чего начать обучение", type: "video", duration: 2715, activity: "fitness" },
      { title: "С чего начать обучение", type: "video", duration: 2715, activity: "fitness" },
      { title: "С чего начать обучение", type: "video", duration: 2715, activity: "fitness" },
    ],
  },
  {
    category: "Онлайн-конференции",
    courses: [
      {
        title: "Как увеличить прибыль в два раза за три месяца и что-то там еще, заголовок будет сокращен",
        type: "video",
        duration: 2715,
        activity: "fitness",
      },
      { title: "Как продвигаться в соцсетях", type: "video", duration: 2715, activity: "restaurants" },
      { title: "С чего начать обучение", type: "video", duration: 2715, activity: "fitness" },
      { title: "С чего начать обучение", type: "video", duration: 2715, activity: "fitness" },
      { title: "С чего начать обучение", type: "video", duration: 2715, activity: "fitness" },
    ],
  },
  {
    category: "Для руководителей",
    courses: [
      { title: "Как открыть фитнес-клуб с нуля", type: "course", lessons: 10, activity: "fitness" },
      { title: "Как подбирать персонал с помощью чего-то там длинного", type: "course", lessons: 10, activity: "fitness" },
      { title: "С чего начать обучение", type: "video", duration: 2715, activity: "fitness" },
      { title: "С чего начать обучение", type: "video", duration: 2715, activity: "restaurants" },
      { title: "С чего начать обучение", type: "video", duration: 2715, activity: "fitness" },
    ],
  },
  {
    category: "Для собственников",
    courses: [
      { title: "Прокачиваем soft-skills", type: "video", duration: 2715, activity: "fitness" },
      { title: "Тактика продаж", type: "video", duration: 2715, activity: "fitness" },
      { title: "С чего начать обучение", type: "video", duration: 2715, activity: "tourism" },
      { title: "С чего начать обучение", type: "video", duration: 2715, activity: "tourism" },
      { title: "С чего начать обучение", type: "video", duration: 2715, activity: "fitness" },
    ],
  },
  {
    category: "Для специалистов",
    courses: [
      { title: "Прокачиваем soft-skills", type: "video", duration: 2715, activity: "fitness" },
      { title: "Тактика продаж", type: "video", duration: 2715, activity: "tourism" },
      { title: "С чего начать обучение", type: "video", duration: 2715, activity: "fitness" },
      { title: "С чего начать обучение", type: "video", duration: 2715, activity: "fitness" },
      { title: "С чего начать обучение", type: "video", duration: 2715, activity: "fitness" },
    ],
  },
  {
    category: "Для спикеров",
    courses: [
      { title: "Прокачиваем soft-skills", type: "video", duration: 2715, activity: "fitness" },
      { title: "Тактика продаж", type: "video", duration: 2715, activity: "fitness" },
      { title: "С чего начать обучение", type: "video", duration: 2715, activity: "fitness" },
      { title: "С чего начать обучение", type: "video", duration: 2715, activity: "fitness" },
      { title: "С чего начать обучение", type: "video", duration: 2715, activity: "fitness" },
    ],
  },
];

// -----------end data for Courses.tsx---------- //

// --------------- data for Lesson.tsx---------- //

export const lessonData = {
  isPaid: true,
  title: "Как увеличить прибыль в два раза за 3 месяца",
  description:
    "Как увеличить продажи фитнес-клуба. Какие существуют инструменты продвижения. Насколько эффективны для увеличения продаж сайты, социальные сети, SEO.",
  timing: {
    "00:00": "Введение",
    "01:36": "Штат отдела продаж",
    "07:50": "Самый эффективный канал продаж",
    "14:15": "Настраиваем продажи",
    "23:35": "Скрипты продаж: золотые правила длинных комментариев к таймингам",
    "30:20": "Эффективные инструменты",
    "01:37:40": "Советы и рекомендации",
  },
  files: [
    {
      title: "Скрипт эффективных продаж",
      link: "http://testoviy.url",
    },
  ],
};
// ------------end data for Lesson.tsx---------- //
// --------- data for Subscription.tsx---------- //

interface SubscriptionData {
  term: number;
  price: number;
  isPopular: boolean;
  isGoodOffer: boolean;
}

export const subscriptionData: SubscriptionData[] = [
  {
    term: 30,
    price: 990,
    isPopular: false,
    isGoodOffer: false,
  },
  {
    term: 90,
    price: 2490,
    isPopular: true,
    isGoodOffer: false,
  },
  {
    term: 365,
    price: 9490,
    isPopular: false,
    isGoodOffer: true,
  },
];

// ------------end data for Subscription.tsx---------- //
