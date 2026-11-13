import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ResetPasswordForm } from "./reset-password-form"
import { resetPassword } from "../../api/reset-password"

const toastAdd = vi.hoisted(() => vi.fn())

vi.mock("@/shared/ui/toast", () => ({ toast: { add: toastAdd } }))
vi.mock("../../api/reset-password", () => ({ resetPassword: vi.fn() }))

const mockedResetPassword = vi.mocked(resetPassword)

async function fillPasswords(
  user: ReturnType<typeof userEvent.setup>,
  password: string,
  confirmPassword: string,
) {
  await user.type(screen.getByLabelText("New password"), password)
  await user.type(screen.getByLabelText("Confirm password"), confirmPassword)
  await user.tab()
}

describe("ResetPasswordForm", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("shows a message and keeps submit disabled when the token is missing", async () => {
    const user = userEvent.setup()
    render(<ResetPasswordForm />)

    expect(
      screen.getByText("This password reset link is expired or invalid"),
    ).toBeInTheDocument()

    await fillPasswords(user, "secret1", "secret1")

    const submit = screen.getByRole("button", { name: "Submit" })
    await waitFor(() => expect(submit).toBeDisabled())
    expect(mockedResetPassword).not.toHaveBeenCalled()
  })

  it("requires a password of at least 6 characters", async () => {
    const user = userEvent.setup()
    render(<ResetPasswordForm token="reset-token" />)

    await user.type(screen.getByLabelText("New password"), "123")
    await user.tab()

    expect(
      await screen.findByText("Password must be at least 6 characters long"),
    ).toBeInTheDocument()
  })

  it("reports mismatched passwords", async () => {
    const user = userEvent.setup()
    render(<ResetPasswordForm token="reset-token" />)

    await fillPasswords(user, "secret1", "secret2")

    expect(await screen.findByText("Passwords do not match")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Submit" })).toBeDisabled()
  })

  it("submits the new password together with the token", async () => {
    mockedResetPassword.mockResolvedValue({ success: true })

    const user = userEvent.setup()
    render(<ResetPasswordForm token="reset-token" />)

    await fillPasswords(user, "secret1", "secret1")

    const submit = screen.getByRole("button", { name: "Submit" })
    await waitFor(() => expect(submit).toBeEnabled())
    await user.click(submit)

    expect(mockedResetPassword).toHaveBeenCalledWith({
      token: "reset-token",
      newPassword: "secret1",
      confirmPassword: "secret1",
    })
  })

  it("shows the server error when the reset fails", async () => {
    mockedResetPassword.mockResolvedValue({
      success: false,
      error: "This password reset link has expired",
      code: "actionExpired",
    })

    const user = userEvent.setup()
    render(<ResetPasswordForm token="reset-token" />)

    await fillPasswords(user, "secret1", "secret1")

    const submit = screen.getByRole("button", { name: "Submit" })
    await waitFor(() => expect(submit).toBeEnabled())
    await user.click(submit)

    expect(
      await screen.findByText("This password reset link has expired"),
    ).toBeInTheDocument()
    expect(toastAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "error",
        description: "This password reset link has expired",
      }),
    )
  })

  it("links Go to sign in to the sign in page", () => {
    render(<ResetPasswordForm token="reset-token" />)

    expect(screen.getByRole("link", { name: "Go to sign in" })).toHaveAttribute(
      "href",
      "/sign-in",
    )
  })
})
