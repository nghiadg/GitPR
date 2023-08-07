import React, { useCallback, useState } from "react";
import { ModalEnterToken, PullRequestsSection } from "./components";
import { MessageCheckDev } from "./components";

const Home = () => {
  const [showEnterToken, setShowEnterToken] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");
  const [jiraUrls, setJiraUrls] = useState<string[]>([]);

  const generateMessage = useCallback((msg: string, urls: string[]) => {
    setMessage(msg);
    setJiraUrls(urls);
  }, []);

  return (
    <>
      <main className="container py-3 d-flex gap-4 vh-100">
        <PullRequestsSection onGenerateMessage={generateMessage} />
        <div className="w-50">
          <MessageCheckDev message={message} jiraUrls={jiraUrls} />
        </div>
      </main>
      <ModalEnterToken
        show={showEnterToken}
        onHide={() => setShowEnterToken(false)}
      />
    </>
  );
};

export default Home;
