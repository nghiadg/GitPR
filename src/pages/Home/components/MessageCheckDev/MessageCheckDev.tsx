import React, { useCallback, useState } from "react";
import { Button, Card } from "react-bootstrap";
import styles from "./MessageCheckDev.module.css";
import clsx from "clsx";

export interface MessageCheckDevProps {
  message: string;
  jiraUrls: string[];
}

export const MessageCheckDev = ({
  message,
  jiraUrls,
}: MessageCheckDevProps) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const copyMessage = useCallback(() => {
    navigator.clipboard.writeText(message);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  }, [message]);

  const openJiraUrls = useCallback(() => {
    jiraUrls.forEach((url) => {
      window.open(url, "_blank");
    });
  }, [jiraUrls]);

  return (
    <div className="h-100 d-flex flex-column flex-fill">
      <div className="mb-3 d-flex justify-content-end gap-2">
        <Button size="sm" onClick={copyMessage} className="rounded-0">
          {isCopied ? "Copy Success" : "Copy Message"}
        </Button>
        <Button size="sm" onClick={openJiraUrls} className="rounded-0">
          Open Jira
        </Button>
      </div>
      <Card className={clsx("p-2 flex-fill rounded-0 border-light", styles.msgContent)}>
        <p>{message}</p>
      </Card>
    </div>
  );
};
