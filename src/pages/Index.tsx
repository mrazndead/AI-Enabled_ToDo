// Update this page to include the TodoList component
import { MadeWithDyad } from "@/components/made-with-dyad";
import TodoList from "@/components/TodoList";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold mb-6 text-center">My Todo App</h1>
        <TodoList />
        <div className="mt-8">
          <MadeWithDyad />
        </div>
      </div>
    </div>
  );
};

export default Index;