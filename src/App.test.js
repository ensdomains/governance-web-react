import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  it.todo("should redirect to last completed step when user lands");
  it.todo("should save last completed step to local storage");
  it.todo("should render correct styles depending on breakpoint");
  it.todo("should redirect to claim page if user is ineligible");
});

describe("useInitApp", () => {
  describe("has signer", () => {
    it.todo("should set isConnected if there is a signer");
    it.todo("should set signers address if there is a signer");
  });
  describe("does not have signer", () => {
    it.todo("should set isConnected to FALSE");
    it.todo("should set addressReactive to null");
  });
});

describe("PrivateRoute", () => {
  it.todo(
    "should not redirect if there is no history and no eligible data available"
  );
  it.todo(
    "should redirect to /dashboard if we have history and eligible === false"
  );
});
