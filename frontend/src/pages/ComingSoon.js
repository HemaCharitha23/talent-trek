import { Link } from "react-router-dom";

function ComingSoon({ title, phase }) {
  return (
    <div className="coming-soon">
      <h1>{title}</h1>
      {phase && <p>This page will be built in {phase}.</p>}
      <Link to="/" className="btn btn-primary">
        Back to Home
      </Link>
    </div>
  );
}

export default ComingSoon;