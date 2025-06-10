import { WorkoutLog } from '../types/workout';

export const workoutLogs: WorkoutLog[] = [
  {
    date: "2024-03-21",
    type: "כתפיים וידיים",
    duration: "95 min",
    exercises: [
      {
        name: "לחיצת כתפיים מאחורי הראש בסמיט",
        sets: [
          { weight: 60, reps: 12 },
          { weight: 65, reps: 10 },
          { weight: 70, reps: 8 },
          { weight: 70, reps: 6, notes: "שיא אישי חדש!" }
        ]
      },
      {
        name: "הרחקה עם משקולות לצצדים",
        sets: [
          { weight: 12, reps: 15 },
          { weight: 14, reps: 15 },
          { weight: 14, reps: 12 },
          { weight: 12, reps: 15 }
        ]
      },
      {
        name: "חתירה בפולי תחתון מלפנים אחיזה רחבה",
        sets: [
          { weight: 65, reps: 12 },
          { weight: 70, reps: 12 },
          { weight: 75, reps: 10 },
          { weight: 70, reps: 12 }
        ]
      },
      {
        name: "לחיצה צרפתית",
        sets: [
          { weight: 25, reps: 12 },
          { weight: 30, reps: 10 },
          { weight: 32.5, reps: 8 },
          { weight: 30, reps: 10 }
        ]
      }
    ],
    notes: "אימון טוב, שיפור בכוח בלחיצות כתפיים"
  },
  {
    date: "2024-03-20",
    type: "רגליים",
    duration: "105 min",
    exercises: [
      {
        name: "פשיטת ברכיים בישיבה במכונה",
        sets: [
          { weight: 45, reps: 15 },
          { weight: 50, reps: 12 },
          { weight: 55, reps: 10 },
          { weight: 50, reps: 12 },
          { weight: 45, reps: 15 }
        ]
      },
      {
        name: "v-squat",
        sets: [
          { weight: 100, reps: 12 },
          { weight: 120, reps: 10 },
          { weight: 140, reps: 8 },
          { weight: 150, reps: 6, notes: "שיא אישי" },
          { weight: 120, reps: 10 }
        ]
      },
      {
        name: "סקוואט בסמיט מאשין",
        sets: [
          { weight: 100, reps: 12 },
          { weight: 110, reps: 10 },
          { weight: 120, reps: 8 }
        ]
      },
      {
        name: "דדליפט רומני עם משקולות",
        sets: [
          { weight: 80, reps: 12 },
          { weight: 90, reps: 12 },
          { weight: 100, reps: 10 }
        ]
      }
    ],
    notes: "אימון מצוין, שברתי שיא אישי ב-V-squat"
  },
  {
    date: "2024-03-19",
    type: "גב",
    duration: "85 min",
    exercises: [
      {
        name: "פולי עליון אחיזה רחבה",
        sets: [
          { weight: 65, reps: 12 },
          { weight: 70, reps: 10 },
          { weight: 75, reps: 8 },
          { weight: 70, reps: 10 }
        ]
      },
      {
        name: "חתירה בהאמר בישיבה",
        sets: [
          { weight: 70, reps: 12 },
          { weight: 80, reps: 10 },
          { weight: 85, reps: 8 },
          { weight: 80, reps: 10 }
        ]
      },
      {
        name: "פולי עליון מאחורי הראש",
        sets: [
          { weight: 60, reps: 10 },
          { weight: 65, reps: 10 },
          { weight: 70, reps: 8 }
        ]
      },
      {
        name: "פולאובר בעמידה כנגד פולי עליון מוט ישר",
        sets: [
          { weight: 35, reps: 12 },
          { weight: 40, reps: 10 },
          { weight: 45, reps: 8 },
          { weight: 40, reps: 10 }
        ]
      }
    ]
  },
  {
    date: "2024-03-18",
    type: "חזה",
    duration: "90 min",
    exercises: [
      {
        name: "לחיצת חזה עם משקולות בשיפוע עליון",
        sets: [
          { weight: 80, reps: 12 },
          { weight: 85, reps: 10 },
          { weight: 90, reps: 8, notes: "קשה מאוד" },
          { weight: 85, reps: 8 }
        ]
      },
      {
        name: "פרפר עם משקולות בשיפוע על ספסל",
        sets: [
          { weight: 20, reps: 12 },
          { weight: 22.5, reps: 12 },
          { weight: 25, reps: 10 }
        ]
      },
      {
        name: "לחיצה עם צלחת בשיפוע עליון",
        sets: [
          { weight: 40, reps: 10 },
          { weight: 45, reps: 10 },
          { weight: 50, reps: 8 }
        ]
      },
      {
        name: "פרפר במכונה בישיבה",
        sets: [
          { weight: 65, reps: 12 },
          { weight: 70, reps: 12 },
          { weight: 75, reps: 10 },
          { weight: 70, reps: 12 }
        ]
      }
    ],
    notes: "אימון טוב, הרגשתי חזק בלחיצות"
  }
];