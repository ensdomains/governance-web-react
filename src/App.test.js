import { render, screen } from "@testing-library/react"
import { useQuery } from "@apollo/client"

import { useQueryStirng } from "./utils/hooks"
import App from "./App"

jest.mock("@apollo/client", () => ({
  __esModule: true,
  ...jest.requireActual("@apollo/client"),
  useQuery: jest.fn(),
}))

describe("App", () => {
  it("should render", () => {
    useQuery.mockImplementation(() => ({ data: { address: "0xaddress" } }))
    render(<App />)
  })
})

describe("PrivateRoute", () => {
  it.todo(
    "should not redirect if there is no history and no eligible data available"
  )
  it.todo(
    "should redirect to /dashboard if we have history and eligible === false"
  )
  it("should redirect to dashboard if navigating to a route past voting but voting has not been completed", () => {})
})
