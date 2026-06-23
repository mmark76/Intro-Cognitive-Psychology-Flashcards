import { createHashRouter } from "react-router-dom";
import { ChaptersPage } from "../features/chapters/ChaptersPage";
import { FlashcardsPage } from "../features/flashcards/FlashcardsPage";
import { HomePage } from "../features/home/HomePage";
import { ProgressPage } from "../features/progress/ProgressPage";
import { QuizPage } from "../features/quiz/QuizPage";
import { ReviewPage } from "../features/review/ReviewPage";
import { StudyMaterialsPage } from "../features/study-materials/StudyMaterialsPage";
import { AppLayout } from "../shared/components/AppLayout";

export const router = createHashRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "chapters", element: <ChaptersPage /> },
      { path: "flashcards", element: <FlashcardsPage /> },
      { path: "review", element: <ReviewPage /> },
      { path: "quiz", element: <QuizPage /> },
      { path: "progress", element: <ProgressPage /> },
      { path: "study-materials", element: <StudyMaterialsPage /> },
    ],
  },
]);
