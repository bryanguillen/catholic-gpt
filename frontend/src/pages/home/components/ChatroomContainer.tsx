interface ChatroomContainerProps {
  children: React.ReactNode;
}

function ChatroomContainer({ children }: ChatroomContainerProps) {
  return (
    <div className="bg-background min-h-screen items-center p-4">
      <div className="bg-card text-card-foreground flex h-[calc(100vh-2rem)] w-full flex-col overflow-hidden rounded-lg shadow-lg">
        <ChatroomHeader />
        {children}
      </div>
    </div>
  );
}

function ChatroomHeader() {
  return (
    <div className="border-b p-4">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">CatholicGPT</h2>
      </div>
    </div>
  );
}

export { ChatroomContainer };
