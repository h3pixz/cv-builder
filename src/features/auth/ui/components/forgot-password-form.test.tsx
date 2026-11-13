import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ForgotPasswordForm } from "./forgot-password-form"
import { forgotPassword } from "../../api/forgot-password"

const toastAdd = vi.hoisted(() => vi.fn())

vi.mock("@/shared/ui/toast", () => ({ toast: { add: toastAdd } }))
vi.mock("../../api/forgot-password", () => ({ forgotPassword: vi.fn() }))

const mockedForgotPassword = vi.mocked(forgotPassword)

describe("ForgotPasswordForm", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("keeps submit disabled until the email is valid", async () => {
    const user = userEvent.setup()
    render(<ForgotPasswordForm />)

    const submit = screen.getByRole("button", { name: "Reset Password" })
    expect(submit).toBeDisabled()

    await user.type(screen.getByLabelText("Email"), "user@example.com")
    await user.tab()

    await waitFor(() => expect(submit).toBeEnabled())
  })

  it("shows inline messages for an empty and an invalid email", async () => {
    const user = userEvent.setup()
    render(<ForgotPasswordForm />)

    await user.click(screen.getByLabelText("Email"))
    await user.tab()

    expect(await screen.findByText("Email is required")).toBeInTheDocument()

    await user.type(screen.getByLabelText("Email"), "not-an-email")
    await user.tab()

    expect(
      await screen.findByText("Please enter a valid email address"),
    ).toBeInTheDocument()
  })

  it("submits the email and confirms the request", async () => {
    mockedForgotPassword.mockResolvedValue({ success: true })

    const user = userEvent.setup()
    render(<ForgotPasswordForm />)

    await user.type(screen.getByLabelText("Email"), "user@example.com")
    await user.tab()

    const submit = screen.getByRole("button", { name: "Reset Password" })
    await waitFor(() => expect(submit).toBeEnabled())
    await user.click(submit)

    expect(mockedForgotPassword).toHaveBeenCalledWith("user@example.com")

    await waitFor(() =>
      expect(toastAdd).toHaveBeenCalledWith(
        expect.objectContaining({ type: "success", title: "Email sent" }),
      ),
    )

    expect(screen.getByLabelText("Email")).toHaveValue("")
  })

  it("keeps the entered email and reports a failed request", async () => {
    mockedForgotPassword.mockResolvedValue({
      success: false,
      error: "Unable to send the email. Please try again later",
    })

    const user = userEvent.setup()
    render(<ForgotPasswordForm />)

    await user.type(screen.getByLabelText("Email"), "user@example.com")
    await user.tab()

    const submit = screen.getByRole("button", { name: "Reset Password" })
    await waitFor(() => expect(submit).toBeEnabled())
    await user.click(submit)

    await waitFor(() =>
      expect(toastAdd).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "error",
          description: "Unable to send the email. Please try again later",
        }),
      ),
    )

    expect(screen.getByLabelText("Email")).toHaveValue("user@example.com")
  })

  it("links Cancel to the sign in page", () => {
    render(<ForgotPasswordForm />)

    expect(screen.getByRole("link", { name: "Cancel" })).toHaveAttribute(
      "href",
      "/sign-in",
    )
  })
})
