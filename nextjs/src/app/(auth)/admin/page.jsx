import styles from "./admin.module.css";
import { adminAuthenticate } from "@/actions/authActions";

export default function Admin() {
  return (
    <>
      <div className={styles.container}>
        <form action={adminAuthenticate}>
          <h1>Admin Login</h1>
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
