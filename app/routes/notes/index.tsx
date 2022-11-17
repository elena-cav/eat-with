import { Link } from "@remix-run/react";
import Socket from "../../components/chat";
export default function NoteIndexPage() {
  return (
    <div>
      No note selected. Select a note on the left, or{" "}
      <Link to="new" className="text-blue-500 underline">
        create a new note.
      </Link>
      <Socket />
    </div>
  );
}
