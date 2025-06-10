export interface RoadmapLevel {
  level: number;
  name: string;
  visualEvolution: string;
  notification: string;
  timeframe: string;
  unlocked: boolean;
  currentLevel?: boolean;
}

export interface RoadmapPath {
  type: 'fat_loss' | 'muscle_gain';
  levels: RoadmapLevel[];
}

export const fatLossPath: RoadmapPath = {
  type: 'fat_loss',
  levels: [
    {
      level: 1,
      name: 'נקודת התחלה',
      visualEvolution: 'הדמות בעודף משקל, מעט כפופה. רקע: אפרפר, עמום.',
      notification: 'ברוכים הבאים! מסע הירידה במשקל שלך מתחיל היום! 🚀 תעד את הארוחה והאימון הראשונים שלך.',
      timeframe: 'יום 1',
      unlocked: true,
      currentLevel: true
    },
    {
      level: 2,
      name: 'בניית תנופה',
      visualEvolution: 'יציבה משתפרת מעט, ירידה של 1-2% במשקל. הרקע מתבהר מעט.',
      notification: 'עבודה מצוינת! השגת רצף של 14 ימים. המשך כך!',
      timeframe: 'שבועיים',
      unlocked: false
    },
    {
      level: 3,
      name: 'שינוי ראשון נראה לעין',
      visualEvolution: 'הפנים נראות רזות יותר, ירידה קלה בשומן בטן. הדמות עומדת זקוף יותר.',
      notification: 'הבגדים מתאימים טוב יותר? העקביות שלך משתלמת! המשך לעקוב אחר הארוחות.',
      timeframe: '4 שבועות',
      unlocked: false
    },
    {
      level: 4,
      name: 'מאיץ חילוף חומרים',
      visualEvolution: 'ירידה נראית יותר בשומן (במיוחד בבטן ובפנים), טון שרירי קל. הדמות הולכת בביטחון רב יותר.',
      notification: 'חילוף החומרים שלך בוער! 🔥 זה הזמן להתאמץ יותר—נסה אתגר חדש.',
      timeframe: '6 שבועות',
      unlocked: false
    },
    {
      level: 5,
      name: 'יעד ראשון הושג',
      visualEvolution: 'ירידה של 5-7% באחוזי שומן. שרירי הבטן מתחילים להיראות, הזרועות מוגדרות יותר.',
      notification: 'אתה מנצח! אבן דרך ראשונה הושגה—חגוג עם פרס בריא!',
      timeframe: '8 שבועות',
      unlocked: false
    },
    {
      level: 6,
      name: 'זהות חדשה',
      visualEvolution: 'שרירי בטן נראים, רגליים מעוצבות, מבנה אתלטי מתגבש. הרקע בהיר לחלוטין.',
      notification: 'הפכת לאדם ששומר על הכושר שלו! המשך לשמור על הרצף.',
      timeframe: '12 שבועות',
      unlocked: false
    },
    {
      level: 7,
      name: 'מבנה גוף רזה אולטימטיבי',
      visualEvolution: 'טרנספורמציה מלאה, רזה, מעוצב, עמידה בטוחה, רקע בהיר.',
      notification: 'עשית את זה! 🔥 הטרנספורמציה שלך הושלמה—זה הזמן להציב יעדים חדשים!',
      timeframe: '16+ שבועות',
      unlocked: false
    }
  ]
};

export const muscleGainPath: RoadmapPath = {
  type: 'muscle_gain',
  levels: [
    {
      level: 1,
      name: 'נקודת התחלה',
      visualEvolution: 'הדמות רזה או במבנה גוף ממוצע. רקע: סביבת חדר כושר ניטרלית.',
      notification: 'מסע בניית השרירים שלך מתחיל היום! בוא נתחיל להתאמן. 🏋️',
      timeframe: 'יום 1',
      unlocked: true,
      currentLevel: true
    },
    {
      level: 2,
      name: 'בסיס כוח',
      visualEvolution: 'שיפור קל ביציבה, עלייה ראשונה בכוח. הרקע מעט יותר דינמי.',
      notification: 'הכוח שלך עולה! הגיע הזמן להרים משקולות כבדות יותר.',
      timeframe: 'שבועיים',
      unlocked: false
    },
    {
      level: 3,
      name: 'הפעלת שרירים',
      visualEvolution: 'החזה והזרועות מלאים יותר, יציבה משתפרת. הדמות עומדת זקוף יותר.',
      notification: 'אתה מתחזק! שמת לב שהפאמפ נשאר יותר זמן?',
      timeframe: '4 שבועות',
      unlocked: false
    },
    {
      level: 4,
      name: 'רווחים ראשונים',
      visualEvolution: 'הכתפיים והטרפזים נראים יותר, צורת V מתגבשת. הרקע כולל כעת אלמנטים של חדר כושר.',
      notification: 'השגת את אבן הדרך הראשונה בשרירים! בוא נתקדם להעמסה מתקדמת!',
      timeframe: '6 שבועות',
      unlocked: false
    },
    {
      level: 5,
      name: 'זינוק בכוח',
      visualEvolution: 'שרירי הזרוע והגב מוגדרים יותר, מבנה גוף מלא יותר. הדמות נראית יותר אתלטית.',
      notification: 'השיאים האישיים שלך משתפרים! המשך לדחוף!',
      timeframe: '8 שבועות',
      unlocked: false
    },
    {
      level: 6,
      name: 'נפח נראה לעין',
      visualEvolution: 'שרירי הבטן מציצים, הזרועות והרגליים עבות יותר באופן ניכר. הרקע כעת בהיר עם סביבת חדר כושר מלאה.',
      notification: 'אתה הופך לחיה! 🔥 הגיע הזמן לדייק את התזונה.',
      timeframe: '12 שבועות',
      unlocked: false
    },
    {
      level: 7,
      name: 'מבנה גוף אולטימטיבי',
      visualEvolution: 'שרירי לחלוטין, ורידים נראים קלות, עמידה של גיבור על.',
      notification: 'בנית את גוף החלומות שלך! הגיע הזמן לשלב הבא—תחזוקה ושיפור.',
      timeframe: '16+ שבועות',
      unlocked: false
    }
  ]
};