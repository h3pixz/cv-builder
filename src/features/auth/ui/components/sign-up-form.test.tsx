import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { SignUpForm } from "./sign-up-form"

vi.mock("../../api/signup", () => ({ signup: vi.fn() }))

describe("SignUpForm", () => {
  it("keeps submit disabled until all fields are valid", async () => {
    const user = userEvent.setup()
    render(<SignUpForm />)

    const submit = screen.getByRole("button", { name: "Create account" })
    expect(submit).toBeDisabled()

    await user.type(screen.getByLabelText("Email"), "user@example.com")
    await user.type(screen.getByLabelText("Password"), "secret1")
    await user.type(screen.getByLabelText("Confirm password"), "secret1")
    await user.tab()

    await waitFor(() => expect(submit).toBeEnabled())
  })

  it("requires a password of at least 6 characters", async () => {
    const user = userEvent.setup()
    render(<SignUpForm />)

    await user.type(screen.getByLabelText("Email"), "user@example.com")
    await user.type(screen.getByLabelText("Password"), "123")
    await user.tab()

    expect(
      await screen.findByText("Password must be at least 6 characters long"),
    ).toBeInTheDocument()
  })

  it("reports mismatched passwords", async () => {
    const user = userEvent.setup()
    render(<SignUpForm />)

    await user.type(screen.getByLabelText("Email"), "user@example.com")
    await user.type(screen.getByLabelText("Password"), "secret1")
    await user.type(screen.getByLabelText("Confirm password"), "secret2")
    await user.tab()

    expect(await screen.findByText("Passwords do not match")).toBeInTheDocument()
  })
})
