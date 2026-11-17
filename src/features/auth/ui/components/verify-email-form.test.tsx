import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { VerifyEmailForm } from "./verify-email-form"

vi.mock("../../api/verify-email", () => ({ verifyEmail: vi.fn() }))

describe("VerifyEmailForm", () => {
  it("shows a required error when confirming an empty code", async () => {
    const user = userEvent.setup()
    render(<VerifyEmailForm />)

    await user.click(screen.getByRole("button", { name: "Confirm" }))

    expect(
      await screen.findByText("Verification code is required"),
    ).toBeInTheDocument()
  })

  it("shows a format error for an incomplete code", async () => {
    const user = userEvent.setup()
    render(<VerifyEmailForm />)

    await user.keyboard("12")
    await user.click(screen.getByRole("button", { name: "Confirm" }))

    expect(
      await screen.findByText("Please enter a valid 6-digit code"),
    ).toBeInTheDocument()
  })

  it("links Later to the application main page", () => {
    render(<VerifyEmailForm />)

    expect(screen.getByRole("link", { name: "Later" })).toHaveAttribute(
      "href",
      "/",
    )
  })
})
