import { logout } from "@/actions/authActions";

export default function AdminPanel() {
  return (
    <>
      Admin Panel{" "}
      <form action={logout}>
        <button>Logout</button>
      </form>
    </>
  );
}
