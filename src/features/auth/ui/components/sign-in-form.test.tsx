import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { SignInForm } from "./sign-in-form"

vi.mock("../../api/login", () => ({ login: vi.fn() }))

describe("SignInForm", () => {
  it("keeps submit disabled until both fields are valid", async () => {
    const user = userEvent.setup()
    render(<SignInForm />)

    const submit = screen.getByRole("button", { name: "Sign in" })
    expect(submit).toBeDisabled()

    await user.type(screen.getByLabelText("Email"), "user@example.com")
    await user.tab()
    await user.type(screen.getByLabelText("Password"), "secret1")
    await user.tab()

    await waitFor(() => expect(submit).toBeEnabled())
  })

  it("shows inline messages for invalid values", async () => {
    const user = userEvent.setup()
    render(<SignInForm />)

    await user.type(screen.getByLabelText("Email"), "not-an-email")
    await user.tab()

    expect(
      await screen.findByText("Please enter a valid email address"),
    ).toBeInTheDocument()

    await user.type(screen.getByLabelText("Password"), "123")
    await user.tab()

    expect(
      await screen.findByText("Password must be at least 6 characters long"),
    ).toBeInTheDocument()
  })

  it("shows a required message for an empty field", async () => {
    const user = userEvent.setup()
    render(<SignInForm />)

    await user.click(screen.getByLabelText("Email"))
    await user.tab()

    expect(await screen.findByText("Email is required")).toBeInTheDocument()
  })
})
