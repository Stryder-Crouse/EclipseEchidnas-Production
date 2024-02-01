import { RequestButtonsInterface } from "./RequestButtonsInterface.ts";
import "./component-css/requestButton.css";

function RequestButtons({ submit }: RequestButtonsInterface) {
  function handleSubmit() {
    submit();
  }

  return (
    <div className={"requestButtonsDiv"}>
      <button
        type={"button"}
        onClick={handleSubmit}
        className={"requestButton"}
      >
        Submit
      </button>
    </div>
  );
}

export default RequestButtons;
