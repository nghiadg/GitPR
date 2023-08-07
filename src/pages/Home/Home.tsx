import React, { useCallback, useState } from "react";
import { ModalEnterToken, PullRequestsSection } from "./components";
import { MessageCheckDev } from "./components";

const Home = () => {
  const [message, setMessage] = useState<string>("");
  const [jiraUrls, setJiraUrls] = useState<string[]>([]);

  const generateMessage = useCallback((msg: string, urls: string[]) => {
    setMessage(msg);
    setJiraUrls(urls);
  }, []);

  return (
    <>
      <main className="container-fluid py-3 d-flex gap-4 vh-100">
        <PullRequestsSection onGenerateMessage={generateMessage} />
        <div className="w-50">
          <MessageCheckDev message={message} jiraUrls={jiraUrls} />
        </div>
      </main>
      <ModalEnterToken />
    </>
  );
};

export default Home;
