import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { VerifyEmailForm } from "./verify-email-form"
import { resendVerification } from "../../api/verify-email"

const toastAdd = vi.hoisted(() => vi.fn())

vi.mock("@/shared/ui/toast", () => ({ toast: { add: toastAdd } }))
vi.mock("../../api/verify-email", () => ({
  verifyEmail: vi.fn(),
  resendVerification: vi.fn(),
}))

const mockedResendVerification = vi.mocked(resendVerification)

describe("VerifyEmailForm", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

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

  it("resends the code and confirms it", async () => {
    mockedResendVerification.mockResolvedValue({ success: true })

    const user = userEvent.setup()
    render(<VerifyEmailForm />)

    await user.click(screen.getByRole("button", { name: "Send again" }))

    expect(mockedResendVerification).toHaveBeenCalledOnce()

    await waitFor(() =>
      expect(toastAdd).toHaveBeenCalledWith(
        expect.objectContaining({ type: "success", title: "Code sent" }),
      ),
    )
  })

  it("reports a failed resend", async () => {
    mockedResendVerification.mockResolvedValue({
      success: false,
      error: "Unable to send the email. Please try again later",
      code: "failedToSendEmail",
    })

    const user = userEvent.setup()
    render(<VerifyEmailForm />)

    await user.click(screen.getByRole("button", { name: "Send again" }))

    await waitFor(() =>
      expect(toastAdd).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "error",
          description: "Unable to send the email. Please try again later",
        }),
      ),
    )
  })
})
