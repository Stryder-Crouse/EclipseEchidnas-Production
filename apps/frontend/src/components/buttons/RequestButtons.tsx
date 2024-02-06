import { RequestButtonsInterface } from "./RequestButtonsInterface.ts";
import "../../css/component-css/buttons/requestButton.css";

function RequestButtons({ submit }: RequestButtonsInterface) {
  function handleSubmit() {
    submit();
  }

  return (
    <div className={"requestButtonsDiv"}>
      <button onClick={handleSubmit} type={"button"} className={"requestButton"}>
        Submit
      </button>
    </div>
  );
}

export default RequestButtons;
