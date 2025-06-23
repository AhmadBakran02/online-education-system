import Image from "next/image";
import { ForumCard } from "../../../components/forum-card/forum-card";

import "./style.css";

export default function Discussions() {
  return (
    <div className="forum-container">
      <div className="forum-header">
        <div className="text-header">
          <h3>Forum</h3>
          <p>
            Discuss topics, ask questions, and share ideas with calssmates and
            teachers.
          </p>
        </div>
        <button className="new-topics">
          <Image src="./plus.svg" width={13} height={13} alt="" />
          <span>New Topics</span>
        </button>
      </div>
      <div className="forum-main">
        <div className="forum-first">
          <input type="search" placeholder="Search topics..." />
          <div className="select-topic">
            <ul>
              <li>All</li>
              <li>Practiacl</li>
              <li>Questions</li>
              <li>General</li>
            </ul>
          </div>
          <div className="topics-exist">
            <ForumCard show={true} />
            <ForumCard show={true} />
            <ForumCard show={true} />
          </div>
          {/* <div className="forum-file">
              <Image src="./message2.svg" width={40} height={40} alt="" />
              <h3>No topics found</h3>
              <p>Be the first to start a discussion</p>
              <button>Create topic</button>
            </div> */}
        </div>
        <div className="forum-second">
          <Image src="./message2.svg" width={40} height={40} alt="" />
          <h3>Select a Topic</h3>
          <p>
            Choose a discussion topic from the list to view replies or start a
            new discussion by clicking the &quot;New Topic&quot; button.
          </p>
          <button className="btn">Create topic</button>
        </div>
      </div>
    </div>
  );
}
