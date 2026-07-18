import { onRequestGet as __api_results__matricNumber__ts_onRequestGet } from "/Users/ridbay/Projects/Personal/UNILAG MIT GPA CALCULATOR/functions/api/results/[matricNumber].ts"
import { onRequestPost as __api_results__matricNumber__ts_onRequestPost } from "/Users/ridbay/Projects/Personal/UNILAG MIT GPA CALCULATOR/functions/api/results/[matricNumber].ts"

export const routes = [
    {
      routePath: "/api/results/:matricNumber",
      mountPath: "/api/results",
      method: "GET",
      middlewares: [],
      modules: [__api_results__matricNumber__ts_onRequestGet],
    },
  {
      routePath: "/api/results/:matricNumber",
      mountPath: "/api/results",
      method: "POST",
      middlewares: [],
      modules: [__api_results__matricNumber__ts_onRequestPost],
    },
  ]