import { Link } from "@remix-run/react";
import eatgroup from "../assets/eat-group.jpg";
import { useOptionalUser } from "~/utils";
import { Image, Header } from "../styles/landing-page";
export default function Index() {
  const user = useOptionalUser();
  return (
    <main>
      <Header>
        <Image src={eatgroup} />
        {user ? (
          <section>
            <Link to="/eat-with">View Notes for {user.email}</Link>
          </section>
        ) : (
          <section>
            <Link to="/join">Sign up</Link>
            <Link to="/login">Log In</Link>
          </section>
        )}
      </Header>
    </main>
  );
}
