import { RecipeAreaControls } from "@/components/app/recipe/recipe-area-controls";
import { RecipeAreaTitle } from "@/components/app/recipe/recipe-area-title";
import { CookingPotIcon } from "lucide-react";

const RecipeAreaHeader = () => {
  return (
    <div className="flex w-full items-center justify-between border-gray-200 border-b px-8 py-3 dark:border-gray-800">
      <div className="flex min-w-32 items-center gap-x-2">
        <CookingPotIcon className="size-4" />
        <h1 className="font-medium">Recipe</h1>
      </div>
      <RecipeAreaTitle />
      <RecipeAreaControls />
    </div>
  );
};

export { RecipeAreaHeader };
