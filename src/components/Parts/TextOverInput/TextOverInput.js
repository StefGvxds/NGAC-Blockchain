import "./TextOverInput.css";

function TextOverInput(props) {
  const textOverInput = props.className + ':';
  return (
    <h3 className="text">{textOverInput}</h3>
  );
}

export default TextOverInput;