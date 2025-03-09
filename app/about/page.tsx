import Link from "next/link";
import React from "react";

export default function page() {
  return (
    <div>
      this is about
      <Link href="/">
        <button>hello</button>
      </Link>
    </div>
  );
}
