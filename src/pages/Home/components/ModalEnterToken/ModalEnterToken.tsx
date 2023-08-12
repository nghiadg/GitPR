import { Octokit } from "@octokit/rest";
import { useCallback, useContext, useEffect, useState } from "react";
import { Alert, Button, Form, Modal, ModalProps } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useSessionStorage } from "../../../../hooks/useSessionStorage";
import { AppContext } from "../../../../stores";
import styles from "./ModalEnterToken.module.css";

interface FormVerifyGithubToken {
  token: string;
}

export const ModalEnterToken = ({ ...props }: ModalProps) => {
  const [show, setShow] = useState<boolean>(false);
  const { setOctokit } = useContext(AppContext);
  const { value, setValue, getValue } = useSessionStorage("token", "");
  const { getValues, register } = useForm<FormVerifyGithubToken>({
    defaultValues: {
      token: value,
    },
  });
  const [errMsg, setErrMsg] = useState<string>("");

  const verifyGithubToken = useCallback(
    async (token: string) => {
      try {
        const octokit = new Octokit({
          auth: token,
        });
        await octokit.request("GET /user");
        setOctokit?.(octokit);
        setValue(token);
        setShow(false);
      } catch (error: any) {
        console.error(error.message);
        setErrMsg(error.message);
      }
    },
    [setOctokit, setValue]
  );

  const submitForm = useCallback(() => {
    const { token } = getValues();
    verifyGithubToken(token);
  }, [getValues, verifyGithubToken]);

  useEffect(() => {
    const token = getValue();
    console.log(token);
    if (!token) {
      setShow(true);
    } else {
      verifyGithubToken(token);
    }
  }, [getValue, verifyGithubToken]);

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      centered
      backdrop="static"
      contentClassName="rounded-0"
    >
      <Modal.Header className="p-2">
        <span className={styles.heading}>Verify Token</span>
      </Modal.Header>
      <Modal.Body>
        <form action="">
          <Form.Group>
            <Form.Label>Access Token</Form.Label>
            <Form.Control
              {...register("token")}
              as="textarea"
              rows={3}
              placeholder="Enter your github token..."
              className="rounded-0"
            />
          </Form.Group>
          {errMsg ? (
            <Alert variant="danger" className="rounded-0 m-0 mt-3">
              {errMsg}
            </Alert>
          ) : null}
        </form>
      </Modal.Body>
      <Modal.Footer className="p-1">
        <Button size="sm" onClick={submitForm} className="rounded-0">
          Verify Token
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
