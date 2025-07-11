import styles from "./signup.module.css";
import { createUser } from "@/actions/authActions";

export default function Signup() {
  return (
    <>
      <div className={styles.container}>
        <form action={createUser}>
          <h1>Signup</h1>
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
          <button>Signup</button>
        </form>
      </div>
    </>
  );
}
