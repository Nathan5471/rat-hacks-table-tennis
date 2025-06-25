import styles from "./login.module.css";
import { authenticate } from "@/actions/authActions";

export default function Login() {
  return (
    <>
      <div className={styles.container}>
        <form action={authenticate}>
          <h1>Login</h1>
          <div>
            <label>Username:</label> <br />
            <input type="text" id="username" name="username"></input>
          </div>
          <div>
            <label>Password:</label>
            <br />
            <input type="password" id="password" name="password" />
            <br />
          </div>
          <button>Login</button>
        </form>
      </div>
    </>
  );
}
